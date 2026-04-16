'use client';

import { useEffect } from 'react';

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      // Register service worker after page load
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js', { scope: '/' })
          .then((registration) => {
            console.log('✅ Service Worker registered:', registration.scope);
            
            // Check for updates
            registration.addEventListener('updatefound', () => {
              const newWorker = registration.installing;
              if (newWorker) {
                newWorker.addEventListener('statechange', () => {
                  console.log('[SW] State changed:', newWorker.state);
                  
                  if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    // New service worker available, ask user to reload
                    if (confirm('New version available! Reload to update?')) {
                      window.location.reload();
                    }
                  }
                });
              }
            });
          })
          .catch((error) => {
            console.error('❌ Service Worker registration failed:', error);
          });

        // Handle controller change
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          console.log('[SW] Controller changed');
        });
      });
    }
  }, []);

  return null;
}
