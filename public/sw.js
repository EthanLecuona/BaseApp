/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// If the loader is already loaded, just stop.
if (!self.define) {
  let registry = {};

  // Used for `eval` and `importScripts` where we can't get script URL by other means.
  // In both cases, it's safe to use a global var because those functions are synchronous.
  let nextDefineUri;

  const singleRequire = (uri, parentUri) => {
    uri = new URL(uri + ".js", parentUri).href;
    return registry[uri] || (
      
        new Promise(resolve => {
          if ("document" in self) {
            const script = document.createElement("script");
            script.src = uri;
            script.onload = resolve;
            document.head.appendChild(script);
          } else {
            nextDefineUri = uri;
            importScripts(uri);
            resolve();
          }
        })
      
      .then(() => {
        let promise = registry[uri];
        if (!promise) {
          throw new Error(`Module ${uri} didn’t register its module`);
        }
        return promise;
      })
    );
  };

  self.define = (depsNames, factory) => {
    const uri = nextDefineUri || ("document" in self ? document.currentScript.src : "") || location.href;
    if (registry[uri]) {
      // Module is already loading or loaded.
      return;
    }
    let exports = {};
    const require = depUri => singleRequire(depUri, uri);
    const specialDeps = {
      module: { uri },
      exports,
      require
    };
    registry[uri] = Promise.all(depsNames.map(
      depName => specialDeps[depName] || require(depName)
    )).then(deps => {
      factory(...deps);
      return exports;
    });
  };
}
define(['./workbox-bd7e3b9b'], (function (workbox) { 'use strict';

  importScripts();
  self.skipWaiting();
  workbox.clientsClaim();
  workbox.registerRoute("/", new workbox.NetworkFirst({
    "cacheName": "start-url",
    plugins: [{
      cacheWillUpdate: async ({
        request,
        response,
        event,
        state
      }) => {
        if (response && response.type === 'opaqueredirect') {
          return new Response(response.body, {
            status: 200,
            statusText: 'OK',
            headers: response.headers
          });
        }
        return response;
      }
    }]
  }), 'GET');
  workbox.registerRoute(/.*/i, new workbox.NetworkOnly({
    "cacheName": "dev",
    plugins: []
  }), 'GET');

}));
// # sourceMappingURL=sw.js.map




// // This is the "Offline copy of pages" service worker

// const CACHE = "pwa-offline";
// const assets = [];
// //
// // TODO: replace the following with the correct offline fallback page i.e.: const offlineFallbackPage = "index.html";
// const offlineFallbackPage = "/fallback.js";

// // Install stage sets up the index page (home page) in the cache and opens a new cache
// self.addEventListener("install", function (event) {
//   console.log("[PWA] Install Event processing");

//   event.waitUntil(
//     caches.open(CACHE).then(function (cache) {
//       console.log("[PWA] Cached offline page during install");

//       if (offlineFallbackPage === "/fallback.js") {
//         return cache.add(
//           new Response(
//             "TODO: Update the value of the offlineFallbackPage constant in the serviceworker."
//           )
//         );
//       }

//       return cache.add(offlineFallbackPage, assets);
//     })
//   );
// });

// // If any fetch fails, it will look for the request in the cache and serve it from there first
// self.addEventListener("fetch", function (event) {
//   if (event.request.method !== "GET") return;

//   event.respondWith(
//     fetch(event.request)
//       .then(function (response) {
//         // console.log("[PWA ] add page to offline cache: " + response.url);

//         // If request was success, add or update it in the cache
//         event.waitUntil(updateCache(event.request, response.clone()));

//         return response;
//       })
//       .catch(function (error) {
//         console.log(
//           "[PWA] Network request Failed. Serving content from cache: " + error
//         );
//         return fromCache(event.request);
//       })
//   );
// });

// function fromCache(request) {
//   // Check to see if you have it in the cache
//   // Return response
//   // If not in the cache, then return error page
//   return caches.open(CACHE).then(function (cache) {
//     return cache.match(request).then(function (matching) {
//       if (!matching || matching.status === 404) {
//         return Promise.reject("no-match");
//       }

//       return matching;
//     });
//   });
// }

// function updateCache(request, response) {
//   return caches.open(CACHE).then(function (cache) {
//     return cache.put(request, response);
//   });
// }