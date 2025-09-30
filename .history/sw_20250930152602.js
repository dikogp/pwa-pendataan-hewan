const CACHE_NAME = "hewanku-super-app-v2";
const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  "/assets/css/style.css",
  "/assets/js/app.js",
  "/assets/js/utils.js",
  "https://cdnjs.cloudflare.com/ajax/libs/jsbarcode/3.11.5/JsBarcode.all.min.js",
  "https://cdn.jsdelivr.net/npm/chart.js",
];

// Install service worker
self.addEventListener("install", function (event) {
  console.log("Service Worker: Installing...");
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(function (cache) {
        console.log("Service Worker: Caching Files");
        return cache.addAll(urlsToCache);
      })
      .then(function () {
        console.log("Service Worker: Cached Files");
        return self.skipWaiting();
      })
  );
});

// Activate service worker
self.addEventListener("activate", function (event) {
  console.log("Service Worker: Activating...");
  event.waitUntil(
    caches
      .keys()
      .then(function (cacheNames) {
        return Promise.all(
          cacheNames.map(function (cacheName) {
            if (cacheName !== CACHE_NAME) {
              console.log("Service Worker: Clearing Old Cache");
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(function () {
        console.log("Service Worker: Activated");
        return self.clients.claim();
      })
  );
});

// Fetch event
self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches
      .match(event.request)
      .then(function (response) {
        // Return cached version or fetch from network
        if (response) {
          return response;
        }
        return fetch(event.request).then(function (response) {
          // Check if valid response
          if (
            !response ||
            response.status !== 200 ||
            response.type !== "basic"
          ) {
            return response;
          }

          // Clone the response
          const responseToCache = response.clone();

          caches.open(CACHE_NAME).then(function (cache) {
            cache.put(event.request, responseToCache);
          });

          return response;
        });
      })
      .catch(function () {
        // Return offline page or fallback
        if (event.request.destination === "document") {
          return caches.match("/index.html");
        }
      })
  );
});

// Background sync for offline data
self.addEventListener("sync", function (event) {
  if (event.tag === "background-sync") {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  // Sync offline data when connection is restored
  console.log("Service Worker: Background sync triggered");

  // Check for pending data in localStorage
  const pendingAnimals = localStorage.getItem("pendingAnimals");
  const pendingSchedules = localStorage.getItem("pendingSchedules");
  const pendingRecords = localStorage.getItem("pendingRecords");

  if (pendingAnimals || pendingSchedules || pendingRecords) {
    console.log("Processing pending offline data...");
    // Process and sync data when connection is restored

    // Clear pending data after successful sync
    localStorage.removeItem("pendingAnimals");
    localStorage.removeItem("pendingSchedules");
    localStorage.removeItem("pendingRecords");
  }
}
