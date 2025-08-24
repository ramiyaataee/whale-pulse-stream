// Service Worker for background processing
const CACHE_NAME = 'whale-pulse-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
];

// Install Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

// Fetch from cache
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
  );
});

// Background sync for data updates
self.addEventListener('sync', (event) => {
  if (event.tag === 'whale-data-sync') {
    event.waitUntil(syncWhaleData());
  }
});

// Push notifications
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Whale activity detected!',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View Details',
        icon: '/images/checkmark.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/images/xmark.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Whale Pulse', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    // Open the app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Background data sync function
async function syncWhaleData() {
  try {
    // Simulate API call for whale data
    const response = await fetch('/api/whale-data');
    const data = await response.json();
    
    // Store data in IndexedDB for offline access
    const dbRequest = indexedDB.open('WhalePulseDB', 1);
    
    dbRequest.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction(['whaleData'], 'readwrite');
      const store = transaction.objectStore('whaleData');
      store.put(data);
    };
    
    // Check for significant whale activity
    const significantActivity = data.filter(activity => 
      parseFloat(activity.amount.replace(/[$M]/g, '')) > 5
    );
    
    if (significantActivity.length > 0) {
      // Send push notification
      self.registration.showNotification('Whale Alert!', {
        body: `Large whale activity detected: ${significantActivity[0].amount}`,
        icon: '/favicon.ico',
        tag: 'whale-alert'
      });
    }
    
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// Periodic background sync (when supported)
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'whale-periodic-sync') {
    event.waitUntil(syncWhaleData());
  }
});

// Handle message from main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});