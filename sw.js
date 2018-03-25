let appAlias = "";
if (location.hostname === "localhost") {
  appAlias = "/mws-restaurant-stage-1";
}
const CACHE_VERSION = 9;
const staticCacheName = `rreviews-data-v${CACHE_VERSION}`;
const contentImgsCache = `rreviews-imgs-v${CACHE_VERSION}`;
const allCaches = [staticCacheName, contentImgsCache];
self.addEventListener("install", function(event) {
  event.waitUntil(
    caches.open(staticCacheName).then(function(cache) {
      console.log(`${staticCacheName} is opened`);
      return cache.addAll([
        "/",
        "index.html",
        "js/app.js",
        "js/dbhelper.js",
        "js/main.js",
        "js/restaurant_info.js",
        "js/focus.handler.js",
        "js/select.change.handler.js",
        "css/styles.css",
        "https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.0/normalize.min.css",
        "favicon.ico",
        "https://fonts.gstatic.com/s/roboto/v18/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2",
        "https://fonts.gstatic.com/s/roboto/v18/KFOlCnqEu92Fr1MmEU9fBBc4AMP6lQ.woff2"
      ]) /*
        .catch(function(error) {
          alert(`cache addAll error: ${error}`);0
          console.log("cache addAll : ", error);
        })*/;
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
            console.log(`About to delete the cache ${cacheName}`);
            //return caches.delete(cacheName);
          })
      );
    })
  );
});
self.addEventListener("fetch", function(event) {
  const requestUrl = new URL(event.request.url);

  //Skip Google Maps resources fetch
  if (
    event.request.url.startsWith("https://maps.gstatic.com") ||
    event.request.url.startsWith("https://maps.googleapis.com")
  ) {
    //console.log("Skipping Google Maps resource...");
    return;
  }

  if (requestUrl.pathname.startsWith(`${appAlias}/build/img`)) {
    event.respondWith(serveImage(event.request));
    return;
  }

  serveFile(event.request);
});

function serveFile(request) {
  const storageUrl = request.url;
  caches.open(staticCacheName).then(function(cache) {
    cache.match(storageUrl).then(function(response) {
      if (response) {
        console.log("Response found for:", storageUrl);
        return response;
      }
      console.log("Response for request not cached", request.url);
      console.log("Caching response after network fetch...");
      return fetch(request)
        .then(function(networkResponse) {
          cache.put(storageUrl, networkResponse.clone());
          console.log("Resource cached from network!", storageUrl);
          return networkResponse;
        })
        .catch(function(err) {
          console.log("Error fetching resource not cached", err);
        });
    });
  });
}
function serveImage(request) {
  var storageUrl = request.url.replace(/-\d+w\.jpg$/, "");
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
