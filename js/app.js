const GOOGLE_MAPS_API_KEY = "AIzaSyBXysE433qRY0W9gup0-_N5UF_0ObJK3oc";
const origin = location.origin;
console.log("origin is ", origin);
let isSsl = location.protocol.indexOf("https") !== -1;
let appAlias = "/mws-restaurant-stage-1";

if (
  location.hostname === "mws-restaurant-stage-1-webdevjlprojects.c9users.io"
) {
  appAlias = "";
}
