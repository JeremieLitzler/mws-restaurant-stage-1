const GOOGLE_MAPS_API_KEY = "AIzaSyBXysE433qRY0W9gup0-_N5UF_0ObJK3oc";
let appAlias = "";
if (location.port === "8001") {
  appAlias = "mws-restaurant-stage-1";
}

function openDatabase() {
  // If the browser doesn't support service worker,
  // we don't care about having a database
  if (!navigator.serviceWorker) {
    return Promise.resolve();
  }
  return idb.open("rreviews-db", 1, function(upgradeDb) {
    var store = upgradeDb.createObjectStore("rreviews", {
      keyPath: "id"
    });
    store.createIndex("by-date", "time");
  });
}
function isBrowserCompatiblewithServiceWorkers() {
  if (!navigator.serviceWorker) {
    console.log("ServiceWorker is not compatible with this browser...");
    return false;
  }

  return true;
}
function registerServiceWorker() {
  if (!isBrowserCompatiblewithServiceWorkers()) {
    return;
  }
  console.log("ServiceWorker is compatible with this browser!");
  navigator.serviceWorker.register("sw.js").then(
    function(registration) {
      // Registration was successful
      console.log(
        "ServiceWorker registration successful with scope: ",
        registration.scope
      );
    },
    function(err) {
      console.log("ServiceWorker registration failed: ", err);
    }
  );
}

function checkServiceWorkerController() {
  if (!isBrowserCompatiblewithServiceWorkers()) {
    return;
  }
  if (navigator.serviceWorker.controller) {
    console.log(
      "This page is currently controlled by:",
      navigator.serviceWorker.controller
    );
  } else {
    console.log(
      "This page is not currently controlled " + "by a service worker."
    );
  }
}
window.addEventListener("load", function() {
  //openDatabase();
  registerServiceWorker();
  checkServiceWorkerController();
  let homeLinks = document.querySelectorAll(".jsHomeLink");
  for (const link of homeLinks) {
    link.href = `./`;
  }
  this.fetch("assets/offline.html").catch(response => {
    if (response.name === "TypeError") {
      //Show the placeholder and hide the map element
      let mapOfflineMsgBlock = document.querySelector(
        ".map-offline-placeholder"
      );
      let mapBlock = document.querySelector("#map");
      if (mapOfflineMsgBlock != null && mapBlock != null) {
        mapBlock.style.display = "none";
        mapOfflineMsgBlock.style.display = "block";
      }
    }
  });
});
