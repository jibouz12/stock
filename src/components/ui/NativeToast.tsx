import React, { useEffect } from 'react';
import { Toast as CapacitorToast } from '@capacitor/toast';
import { Capacitor } from '@capacitor/core';
import { useToastStore } from '../../store/useToastStore';
import { CheckCircle, AlertCircle, Info, X, AlertTriangle } from 'lucide-react';

export const NativeToaster: React.FC = () => {
  const { toasts, removeToast } = useToastStore();

  useEffect(() => {
    // Show native toasts on mobile platforms
    if (Capacitor.isNativePlatform() && toasts.length > 0) {
      const latestToast = toasts[toasts.length - 1];
      
      CapacitorToast.show({
        text: `${latestToast.title}${latestToast.description ? ': ' + latestToast.description : ''}`,
        duration: 'short',
        position: 'bottom'
      });
    }
  }, [toasts]);

  // On native platforms, we rely on the native toast
  if (Capacitor.isNativePlatform()) {
    return null;
  }

  // Web fallback with custom toast UI
  const icons = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <AlertCircle className="w-5 h-5" />,
    warning: <AlertTriangle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
  };

  const colors = {
    success: 'bg-success text-white',
    error: 'bg-error text-white',
    warning: 'bg-warning text-black',
    info: 'bg-primary text-white',
  };

  return (
    <div className="fixed bottom-0 right-0 p-4 z-50 flex flex-col gap-2 max-w-md w-full">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`rounded-lg p-4 pr-10 shadow-md text-sm relative animate-slide-up ${colors[toast.type]}`}
        >
          <div className="flex items-start gap-3">
            <div className="shrink-0 mt-0.5">{icons[toast.type]}</div>
            <div>
              <div className="font-medium">{toast.title}</div>
              {toast.description && <div className="mt-1">{toast.description}</div>}
            </div>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="absolute top-3 right-3 p-1 rounded-full hover:bg-black/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};