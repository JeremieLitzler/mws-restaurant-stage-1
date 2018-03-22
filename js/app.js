const GOOGLE_MAPS_API_KEY = "AIzaSyBXysE433qRY0W9gup0-_N5UF_0ObJK3oc";
const origin = location.origin;
//console.log("origin is ", origin);
let isSsl = location.protocol.indexOf("https") !== -1;
let appAlias = "/mws-restaurant-stage-1";
if (
  location.hostname === "mws-restaurant-stage-1-webdevjlprojects.c9users.io" ||
  location.hostname === "mws-nd-s1.puzzlout.com"
) {
  appAlias = "";
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
function registerServiceWorker() {
  if (!navigator.serviceWorker) {
    console.log("ServiceWorker is not compatible with this browser...");
    return;
  }
  console.log("ServiceWorker is compatible with this browser!");
  console.log("Loading window...");
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

window.addEventListener("load", function() {
  //openDatabase();
  registerServiceWorker();
  let homeLinks = document.querySelectorAll(".jsHomeLink");
  for (const link of homeLinks) {
    link.href = `${appAlias}`;
  }
});
