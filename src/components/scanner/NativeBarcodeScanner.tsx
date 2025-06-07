import React, { useState, useRef, useEffect } from 'react';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { BrowserMultiFormatReader } from '@zxing/library';
import { ScannerStatus } from '../../types';
import { useHaptics } from '../../hooks/useHaptics';
import { Loader2, ZapOff, Check, Camera as CameraIcon } from 'lucide-react';

interface NativeBarcodeScannerProps {
  onScan: (barcode: string) => void;
  onError?: (error: string) => void;
}

const NativeBarcodeScanner: React.FC<NativeBarcodeScannerProps> = ({ onScan, onError }) => {
  const [status, setStatus] = useState<ScannerStatus>('idle');
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const { triggerNotification, triggerImpact } = useHaptics();
  const codeReader = useRef<BrowserMultiFormatReader | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    checkCameraPermission();
    return () => {
      stopScanning();
    };
  }, []);

  const checkCameraPermission = async () => {
    if (Capacitor.isNativePlatform()) {
      try {
        const permissions = await Camera.checkPermissions();
        setHasPermission(permissions.camera === 'granted');
      } catch (error) {
        console.error('Error checking camera permissions:', error);
        setHasPermission(false);
      }
    } else {
      // For web, we'll check when starting the scanner
      setHasPermission(true);
    }
  };

  const requestCameraPermission = async () => {
    if (Capacitor.isNativePlatform()) {
      try {
        const permissions = await Camera.requestPermissions();
        setHasPermission(permissions.camera === 'granted');
        return permissions.camera === 'granted';
      } catch (error) {
        console.error('Error requesting camera permissions:', error);
        setHasPermission(false);
        return false;
      }
    }
    return true;
  };

  const startNativeScanning = async () => {
    try {
      setStatus('scanning');
      
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
        promptLabelHeader: 'Scan Barcode',
        promptLabelPhoto: 'Take Photo',
        promptLabelPicture: 'Select from Gallery'
      });

      if (image.dataUrl) {
        // Create an image element to decode the barcode
        const img = new Image();
        img.onload = async () => {
          try {
            if (!codeReader.current) {
              codeReader.current = new BrowserMultiFormatReader();
            }
            
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx?.drawImage(img, 0, 0);
            
            const result = await codeReader.current.decodeFromCanvas(canvas);
            
            if (result) {
              setStatus('success');
              await triggerNotification('success');
              onScan(result.getText());
            } else {
              throw new Error('No barcode found in image');
            }
          } catch (error) {
            setStatus('error');
            await triggerNotification('error');
            onError?.('No barcode detected in the image. Please try again.');
          }
        };
        
        img.src = image.dataUrl;
      }
    } catch (error) {
      setStatus('error');
      await triggerNotification('error');
      onError?.('Failed to capture image. Please try again.');
    }
  };

  const startWebScanning = async () => {
    try {
      setStatus('scanning');
      
      if (!codeReader.current) {
        codeReader.current = new BrowserMultiFormatReader();
      }

      const videoInputDevices = await codeReader.current.listVideoInputDevices();
      const selectedDeviceId = videoInputDevices[0]?.deviceId;

      if (videoRef.current && selectedDeviceId) {
        await codeReader.current.decodeFromVideoDevice(
          selectedDeviceId,
          videoRef.current,
          (result, error) => {
            if (result) {
              setStatus('success');
              triggerNotification('success');
              onScan(result.getText());
              stopScanning();
            }
          }
        );
      }
    } catch (error) {
      setStatus('error');
      triggerNotification('error');
      onError?.('Failed to start camera. Please check permissions.');
    }
  };

  const startScanning = async () => {
    await triggerImpact();
    
    if (hasPermission === false) {
      const granted = await requestCameraPermission();
      if (!granted) {
        onError?.('Camera permission is required to scan barcodes');
        return;
      }
    }

    if (Capacitor.isNativePlatform()) {
      await startNativeScanning();
    } else {
      await startWebScanning();
    }
  };

  const stopScanning = () => {
    if (codeReader.current) {
      codeReader.current.reset();
    }
    setStatus('idle');
  };

  const retryScanning = async () => {
    await triggerImpact();
    setStatus('idle');
    setTimeout(() => startScanning(), 500);
  };

  if (hasPermission === false) {
    return (
      <div className="flex flex-col items-center p-6 text-center">
        <CameraIcon className="w-16 h-16 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">Camera Permission Required</h3>
        <p className="text-muted-foreground mb-4">
          Please grant camera permission to scan barcodes
        </p>
        <button 
          className="btn btn-primary"
          onClick={requestCameraPermission}
        >
          Grant Permission
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="scanner-container mb-4 relative">
        {!Capacitor.isNativePlatform() && (
          <video 
            ref={videoRef} 
            className="w-full h-full object-cover rounded-lg"
            style={{ display: status === 'scanning' ? 'block' : 'none' }}
          />
        )}
        
        {status === 'scanning' && Capacitor.isNativePlatform() && (
          <div className="w-full h-64 bg-muted rounded-lg flex items-center justify-center">
            <div className="text-center">
              <CameraIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Camera will open automatically</p>
            </div>
          </div>
        )}
        
        {status === 'scanning' && !Capacitor.isNativePlatform() && (
          <div className="scanner-overlay">
            <div className="scanner-target">
              <div className="scanner-corners"><span></span></div>
              <div className="scanning-line"></div>
            </div>
          </div>
        )}
        
        {status === 'success' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-30 rounded-lg">
            <div className="bg-white rounded-full p-4">
              <Check className="w-12 h-12 text-success" />
            </div>
          </div>
        )}
        
        {status === 'error' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-30 rounded-lg">
            <div className="bg-white rounded-full p-4">
              <ZapOff className="w-12 h-12 text-error" />
            </div>
          </div>
        )}
      </div>
      
      <div className="flex gap-4">
        {status === 'idle' && (
          <button 
            className="btn btn-primary btn-lg"
            onClick={startScanning}
          >
            <CameraIcon className="w-5 h-5 mr-2" />
            {Capacitor.isNativePlatform() ? 'Take Photo' : 'Start Scanning'}
          </button>
        )}
        
        {status === 'scanning' && !Capacitor.isNativePlatform() && (
          <button 
            className="btn btn-secondary btn-lg"
            onClick={stopScanning}
          >
            Stop Scanning
          </button>
        )}
        
        {status === 'error' && (
          <button 
            className="btn btn-primary btn-lg"
            onClick={retryScanning}
          >
            Try Again
          </button>
        )}
        
        {status === 'success' && (
          <button 
            className="btn btn-primary btn-lg"
            onClick={retryScanning}
          >
            Scan Again
          </button>
        )}
      </div>
      
      {status === 'scanning' && (
        <div className="mt-4 flex items-center text-muted-foreground">
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          <span>
            {Capacitor.isNativePlatform() 
              ? 'Position the barcode in the camera frame' 
              : 'Position the barcode in the frame'
            }
          </span>
        </div>
      )}
    </div>
  );
};

export default NativeBarcodeScanner;