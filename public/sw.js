/* eslint-disable */
const cacheID = 'v1';
// Files to precache
const cacheFiles = [
  // Kerpal HTML Files
  './soundboard-final.html',
  // Kerpal CSS Files
  'assets/css/style_final.min.css',
  'assets/css/style-2_final.min.css',
  'assets/css/error.css',
  'assets/css/error.min.css',
  // Kerpal Font Files
  'assets/fonts/Lato.woff2',
  'assets/fonts/Simplifica.woff',
  'assets/fonts/Simplifica.eot',
  'assets/fonts/Simplifica.ttf',
  // Kerpal Image Files
  'assets/imgs/cartman1.jpg',
  'assets/imgs/cartman2.jpg',
  'assets/imgs/cartman3.jpeg',
  'assets/imgs/CharlieKelly.jpg',
  'assets/imgs/DaveChappelle.jpeg',
  'assets/imgs/DeNiro.jpg',
  'assets/imgs/DwightSchrute.jpg',
  'assets/imgs/garrison1.jpeg',
  'assets/imgs/garrison2.jpg',
  'assets/imgs/garrison3.jpg',
  'assets/imgs/JoePesci.jpg',
  'assets/imgs/kerpal-icon16x16.png',
  'assets/imgs/kerpal-icon48x48.png',
  'assets/imgs/kerpal-icon72x72.png',
  'assets/imgs/kerpal-icon96x96.png',
  'assets/imgs/kerpal-icon144x144.png',
  'assets/imgs/kerpal-icon168x168.png',
  'assets/imgs/kerpal-icon192x192.png',
  'assets/imgs/kerpal-icon256x256.png',
  'assets/imgs/kerpal-icon512x512.png',
  'assets/imgs/kyle1.jpg',
  'assets/imgs/kyle2.jpg',
  'assets/imgs/kyle3.png',
  'assets/imgs/menu-arrow.png',
  'assets/imgs/menu-arrow2.png',
  'assets/imgs/menu-arrow-small.png',
  'assets/imgs/menu-arrow2-small.png',
  'assets/imgs/MrRogers.jpg',
  'assets/imgs/play-button.svg',
  'assets/imgs/pause-button.svg',
  'assets/imgs/randy1.png',
  'assets/imgs/randy2.jpg',
  'assets/imgs/randy3.jpg',
  'assets/imgs/SamuelJackson.jpg',
  'assets/imgs/view-column-36.png',
  'assets/imgs/view-column-36-2.png',
  'assets/imgs/view-column-48.png',
  'assets/imgs/view-column-48-2.png',
  'assets/imgs/view-list-36.png',
  'assets/imgs/view-list-36-2.png',
  'assets/imgs/view-list-48.png',
  'assets/imgs/view-list-48-2.png',
  'assets/imgs/WillFerrell.jpg',
  // Kerpal Sound Files
  'assets/sounds/cartman1.mp3',
  'assets/sounds/cartman2.mp3',
  'assets/sounds/cartman3.mp3',
  'assets/sounds/Charlie_1.mp3',
  'assets/sounds/Charlie_2.mp3',
  'assets/sounds/Dave_1.mp3',
  'assets/sounds/Dave_2.mp3',
  'assets/sounds/DeNiro_1.mp3',
  'assets/sounds/DwightSchrute_1.mp3',
  'assets/sounds/garrison1.mp3',
  'assets/sounds/garrison2.mp3',
  'assets/sounds/garrison3.mp3',
  'assets/sounds/JoePesci_1.mp3',
  'assets/sounds/JoePesci_2.mp3',
  'assets/sounds/kyle1.mp3',
  'assets/sounds/kyle2.mp3',
  'assets/sounds/kyle3.mp3',
  'assets/sounds/MrRogers_1.mp3',
  'assets/sounds/randy1.mp3',
  'assets/sounds/randy2.mp3',
  'assets/sounds/randy3.mp3',
  'assets/sounds/Samuel_1.mp3',
  'assets/sounds/Samuel_2.mp3',
  'assets/sounds/WillFerrell_1.mp3',
  // Kerpal JS Files
  'assets/js/index_final.js',
  'assets/js/raven.min.js',
  'assets/js/snackbar.min.js',
  './sw.js',
  './app.js',
  // Kerpal JSON Files
  'assets/config.json',
  'assets/sounds/sounds-A.json',
  'assets/sounds/sounds-B.json',
  './manifest.json',
];

// Service Worker Install Event
self.addEventListener('install', function(event) {
  console.log('Attempting to install service worker and cache static assets');
  event.waitUntil(
    caches.open(cacheID)
    .then(function(cache) {
      return cache.addAll(cacheFiles);
    })
    .catch(function(error) {
      console.log(`Unable to add cached assets: ${error}`);
    })
  );
});

// Service Worker Activate Event
self.addEventListener('activate', function(e) {
  e.waitUntil(
    // Load up all items from cache, and check if cache items are not outdated
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== cacheID) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});

// Service Worker Fetch Event
self.addEventListener('fetch', function(e) {
  e.respondWith(
    // If request matches with something in cache, then return reponse
    // from cache, otherwise fetch it
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});
