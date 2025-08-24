import { useTradingStore } from "@/stores/tradingStore";
import { useEffect, useRef, useState } from "react";

export const useServiceWorker = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const swRef = useRef<ServiceWorkerRegistration | null>(null);
  const { notifications } = useTradingStore();

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          swRef.current = registration;
          
          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  setUpdateAvailable(true);
                }
              });
            }
          });

          // Enable background sync (if supported)
          try {
            if ('sync' in window.ServiceWorkerRegistration.prototype) {
              (registration as any).sync?.register('whale-data-sync');
            }
          } catch (error) {
            console.log('Background sync not supported');
          }

          // Enable periodic sync (if supported)
          try {
            if ('periodicSync' in window.ServiceWorkerRegistration.prototype) {
              (registration as any).periodicSync?.register('whale-periodic-sync', {
                minInterval: 24 * 60 * 60 * 1000, // 24 hours
              });
            }
          } catch (error) {
            console.log('Periodic sync not supported');
          }
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    }

    // Request notification permission
    if (notifications.enabled && 'Notification' in window) {
      Notification.requestPermission();
    }

    // Online/offline status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [notifications.enabled]);

  const updateServiceWorker = () => {
    if (swRef.current && swRef.current.waiting) {
      swRef.current.waiting.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
  };

  const sendNotification = (title: string, body: string, tag?: string) => {
    if (notifications.enabled && 'Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/favicon.ico',
        tag: tag || 'whale-pulse',
        requireInteraction: true,
      });
    }
  };

  const requestPersistentStorage = async () => {
    if ('storage' in navigator && 'persist' in navigator.storage) {
      const isPersistent = await navigator.storage.persist();
      return isPersistent;
    }
    return false;
  };

  return {
    isOnline,
    updateAvailable,
    updateServiceWorker,
    sendNotification,
    requestPersistentStorage,
  };
};