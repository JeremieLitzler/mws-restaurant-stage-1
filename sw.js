const staticCacheName = "rreviews-data-v1";
const contentImgsCache = "rreviews-imgs";
const allCaches = [staticCacheName, contentImgsCache];
self.addEventListener("install", function(event) {
  event.waitUntil(
    caches.open(staticCacheName).then(function(cache) {
      return cache.addAll([
        "manifest.json",
        "index.html",
        "restaurant.html",
        "sw.js",
        "js/app.js",
        "js/dbhelper.js",
        "js/main.js",
        "js/restaurant_info.js",
        "js/focus.handler.js",
        "js/select.change.handler.js",
        "css/styles.css",
        "favicon.ico",
        "https://fonts.gstatic.com/s/roboto/v18/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2",
        "https://fonts.gstatic.com/s/roboto/v18/KFOlCnqEu92Fr1MmEU9fBBc4AMP6lQ.woff2",
        "data/restaurants.json"
      ]);
    })
  );
});
self.addEventListener("activate", function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames
          .filter(function(cacheName) {
            return (
              cacheName.startsWith("rreviews-") &&
              !allCaches.includes(cacheName)
            );
          })
          .map(function(cacheName) {
            return caches.delete(cacheName);
          })
      );
    })
  );
});
self.addEventListener("fetch", function(event) {
  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin === location.origin) {
    if (
      requestUrl.pathname === "/" ||
      requestUrl.pathname === "/mws-restaurant-stage-1/"
    ) {
      event.respondWith(caches.match("/index.html"));
      return;
    }
    if (
      requestUrl.pathname === "/restaurant.html" ||
      requestUrl.pathname === "/mws-restaurant-stage-1/restaurant.html"
    ) {
      event.respondWith(caches.match("/restaurant.html"));
      return;
    }
    if (requestUrl.pathname.startsWith("/img/dist")) {
      event.respondWith(serveImage(event.request));
      return;
    }
  }
  event.respondWith(
    caches
      .match(event.request)
      .then(function(response) {
        return response || fetch(event.request);
      })
      .catch(function(err) {
        console.log("Failed fetch", event.request);
      })
  );
});

function serveImage(request) {
  var storageUrl = request.url.replace(/-\d+px\.jpg$/, "");
  return caches.open(contentImgsCache).then(function(cache) {
    return cache.match(storageUrl).then(function(response) {
      if (response) return response;
      return fetch(request).then(function(networkResponse) {
        cache.put(storageUrl, networkResponse.clone());
        return networkResponse;
      });
    });
  });
}
