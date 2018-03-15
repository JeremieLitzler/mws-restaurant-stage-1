const GOOGLE_MAPS_API_KEY = "AIzaSyBXysE433qRY0W9gup0-_N5UF_0ObJK3oc";
const origin = location.origin;
console.log("origin is ", origin);
let isSsl = location.protocol.indexOf("https") !== -1;
let appAlias = "/mws-restaurant-stage-1";
if (location.hostname === "mws-restaurant-stage-1-webdevjlprojects.c9users.io" ||
    location.hostname === "agitated-shockley-450c4d.netlify.com" ||
    location.hostname === "mws-nd-s1.puzzlout.com") {
    appAlias = "";
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", function() {
    navigator.serviceWorker.register("js/sw/index.js").then(
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
  });
}
