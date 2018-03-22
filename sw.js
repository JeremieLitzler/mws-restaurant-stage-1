let appAlias = "/mws-restaurant-stage-1";
if (
  location.hostname === "mws-restaurant-stage-1-webdevjlprojects.c9users.io" ||
  location.hostname === "mws-nd-s1.puzzlout.com"
) {
  appAlias = "";
}

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
  if (requestUrl.origin !== location.origin) {
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
  }

  if (requestUrl.pathname.startsWith(`${appAlias}/img/dist`)) {
    event.respondWith(serveImage(event.request));
    return;
  }

  return serveFile(event.request);
});

function serveFile(request) {
  const storageUrl = request.url; //.replace(`${appAlias}/`, "");
  if (storageUrl === "/" || storageUrl === `${appAlias}/`) {
    console.log("Url is the index page!");
    storageUrl = `${appAlias}/index.html`;
  }
  caches.open(staticCacheName).then(function(cache) {
    cache.match(storageUrl).then(function(response) {
      if (response) {
        console.log("Response found!");
        return response;
      }
      console.log("Response for request not cached", request.url);
      console.log("Caching response after network fetch...");
      return fetch(request).then(function(networkResponse) {
        cache.put(storageUrl, networkResponse.clone());
        console.log("Resource cached from network!", storageUrl);
        return networkResponse;
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
