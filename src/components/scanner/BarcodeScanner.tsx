import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { ScannerStatus } from '../../types';
import { Loader2, ZapOff, Check } from 'lucide-react';

interface BarcodeScannerProps {
  onScan: (barcode: string) => void;
  onError?: (error: string) => void;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onScan, onError }) => {
  const [status, setStatus] = useState<ScannerStatus>('idle');
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const startScanner = async () => {
    if (!containerRef.current) return;
    
    try {
      setStatus('scanning');
      const html5QrCode = new Html5Qrcode('scanner');
      scannerRef.current = html5QrCode;
      
      const config = {
        fps: 10,
        qrbox: { width: 250, height: 150 },
        aspectRatio: 1.0,
      };
      
      await html5QrCode.start(
        { facingMode: 'environment' },
        config,
        (decodedText) => {
          // Success callback
          setStatus('success');
          onScan(decodedText);
          
          // Stop scanner after successful scan
          if (scannerRef.current) {
            scannerRef.current.stop().catch(error => {
              console.error('Failed to stop scanner:', error);
            });
          }
        },
        (errorMessage) => {
          // Error callback is called continuously when no barcode is detected
          // We don't want to spam the error handler, so we only log it
          console.log(errorMessage);
        }
      );
    } catch (error) {
      setStatus('error');
      if (onError && error instanceof Error) {
        onError(error.message);
      }
      console.error('Error starting scanner:', error);
    }
  };

  const stopScanner = () => {
    if (scannerRef.current) {
      scannerRef.current.stop().catch(error => {
        console.error('Failed to stop scanner:', error);
      });
    }
    setStatus('idle');
  };

  useEffect(() => {
    return () => {
      // Clean up scanner when component unmounts
      if (scannerRef.current) {
        scannerRef.current.stop().catch(error => {
          console.error('Failed to stop scanner on unmount:', error);
        });
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center">
      <div className="scanner-container mb-4" ref={containerRef}>
        <div id="scanner" className="w-full h-full"></div>
        
        {status === 'scanning' && (
          <div className="scanner-overlay">
            <div className="scanner-target">
              <div className="scanner-corners"><span></span></div>
              <div className="scanning-line"></div>
            </div>
          </div>
        )}
        
        {status === 'success' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-30">
            <div className="bg-white rounded-full p-4">
              <Check className="w-12 h-12 text-success" />
            </div>
          </div>
        )}
        
        {status === 'error' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-30">
            <div className="bg-white rounded-full p-4">
              <ZapOff className="w-12 h-12 text-error" />
            </div>
          </div>
        )}
      </div>
      
      <div className="flex gap-4">
        {status === 'idle' && (
          <button 
            className="btn btn-primary btn-md"
            onClick={startScanner}
          >
            Start Scanning
          </button>
        )}
        
        {status === 'scanning' && (
          <button 
            className="btn btn-secondary btn-md"
            onClick={stopScanner}
          >
            Stop Scanning
          </button>
        )}
        
        {status === 'error' && (
          <button 
            className="btn btn-primary btn-md"
            onClick={startScanner}
          >
            Try Again
          </button>
        )}
        
        {status === 'success' && (
          <button 
            className="btn btn-primary btn-md"
            onClick={() => {
              setStatus('idle');
              setTimeout(startScanner, 500);
            }}
          >
            Scan Again
          </button>
        )}
      </div>
      
      {status === 'scanning' && (
        <div className="mt-4 flex items-center text-muted-foreground">
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          <span>Position the barcode in the frame</span>
        </div>
      )}
    </div>
  );
};

export default BarcodeScanner;