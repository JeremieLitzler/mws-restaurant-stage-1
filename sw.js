/*
 Copyright 2016 Google Inc. All Rights Reserved.
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at
     http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
*/

// Names of the two caches used in this version of the service worker.
// Change to CACHE_VERSION, etc. when you update any of the local resources, which will
// in turn trigger the install event again.
const CACHE_VERSION = 3;
const PRECACHE = `rreviews-data-v${CACHE_VERSION}`;
const PRECACHE_IMG = `rreviews-imgs-v${CACHE_VERSION}`;
const RUNTIME = `rreviews-runtime-v${CACHE_VERSION}`;
const RUNTIME_IMG = `rreviews-runtime-img-v${CACHE_VERSION}`;

// A list of local resources we always want to be cached.
const PRECACHE_URLS = [
  "./",
  "index.html",
  "restaurant.html",
  "assets/js/app.js",
  "assets/js/dbhelper.js",
  "assets/js/main.js",
  "assets/js/restaurant_info.js",
  "assets/js/focus.handler.js",
  "assets/js/select.change.handler.js",
  "assets/css/styles.css",
  "assets/css/reset.css",
  "favicon.ico"
];

// The install handler takes care of precaching the resources we always need.
self.addEventListener("install", event => {
  console.log("Installing service worker...");
  event.waitUntil(
    caches
      .open(PRECACHE)
      .then(cache => {
        console.log(`Cache ${PRECACHE} opened!`);
        for (const url of PRECACHE_URLS) {
          console.log(`About to cache ${url} at index ${url}`);
          cache.add(url).catch(err => {
            console.log(`Cache.add failed for ${url}`, err);
          });
        }
      })
      .catch(error => {
        console.log("caches", error);
      })
  );
});

// The activate handler takes care of cleaning up old caches.
self.addEventListener("activate", event => {
  const currentCaches = [PRECACHE, RUNTIME];
  console.log(`Activating service worker with CACHE ${PRECACHE}`);
  event.waitUntil(
    caches
      .keys()
      .then(cacheNames => {
        return cacheNames.filter(
          cacheName => !currentCaches.includes(cacheName)
        );
      })
      .then(cachesToDelete => {
        return Promise.all(
          cachesToDelete.map(cacheToDelete => {
            return caches.delete(cacheToDelete);
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// The fetch handler serves responses for same-origin resources from a cache.
// If no response is found, it populates the runtime cache with the response
// from the network before returning it to the page.
self.addEventListener("fetch", event => {
  // Skip cross-origin requests, like those for Google Analytics or Maps
  const requestUrl = event.request.url;
  if (requestUrl.endsWith("offline.html")) {
    //Do not catchoffline.html.
    //It is used to detect if the user isn't connected to any netword
    return;
  }
  if (requestUrl.startsWith(self.location.origin)) {
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }
        let targetCache = RUNTIME;
        if (requestUrl.endsWith("jpg")) {
          targetCache = RUNTIME_IMG;
        }
        return caches
          .open(targetCache)
          .then(cache => {
            return fetch(event.request)
              .then(response => {
                // Put a copy of the response in the runtime cache.
                return cache
                  .put(event.request, response.clone())
                  .then(() => {
                    return response;
                  })
                  .catch(err => {
                    console.log(`cache.put failed on ${requestUrl}`, err);
                  });
              })
              .catch(err => {
                console.log(`fetch failed on ${requestUrl}`, err);
              });
          })
          .catch(err => {
            console.log(`cache.match failed ${requestUrl}`, err);
          });
      })
    );
  }
});
