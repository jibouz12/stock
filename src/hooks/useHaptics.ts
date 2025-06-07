import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Capacitor } from '@capacitor/core';

export const useHaptics = () => {
  const triggerImpact = async (style: ImpactStyle = ImpactStyle.Medium) => {
    if (Capacitor.isNativePlatform()) {
      try {
        await Haptics.impact({ style });
      } catch (error) {
        console.log('Haptics not available');
      }
    }
  };

  const triggerNotification = async (type: 'success' | 'warning' | 'error' = 'success') => {
    if (Capacitor.isNativePlatform()) {
      try {
        await Haptics.notification({ type });
      } catch (error) {
        console.log('Haptics not available');
      }
    }
  };

  const triggerSelection = async () => {
    if (Capacitor.isNativePlatform()) {
      try {
        await Haptics.selectionStart();
      } catch (error) {
        console.log('Haptics not available');
      }
    }
  };

  return {
    triggerImpact,
    triggerNotification,
    triggerSelection
  };
};