import { useEffect, useState } from 'react';
import { Preferences } from '@capacitor/preferences';
import { Capacitor } from '@capacitor/core';

export const useNativeStorage = <T>(key: string, defaultValue: T) => {
  const [value, setValue] = useState<T>(defaultValue);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadValue = async () => {
      try {
        if (Capacitor.isNativePlatform()) {
          const result = await Preferences.get({ key });
          if (result.value) {
            setValue(JSON.parse(result.value));
          }
        } else {
          // Fallback to localStorage for web
          const stored = localStorage.getItem(key);
          if (stored) {
            setValue(JSON.parse(stored));
          }
        }
      } catch (error) {
        console.error(`Error loading ${key} from storage:`, error);
      } finally {
        setIsLoading(false);
      }
    };

    loadValue();
  }, [key]);

  const updateValue = async (newValue: T) => {
    try {
      setValue(newValue);
      
      if (Capacitor.isNativePlatform()) {
        await Preferences.set({
          key,
          value: JSON.stringify(newValue)
        });
      } else {
        localStorage.setItem(key, JSON.stringify(newValue));
      }
    } catch (error) {
      console.error(`Error saving ${key} to storage:`, error);
    }
  };

  return { value, updateValue, isLoading };
};