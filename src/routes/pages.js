const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const distDir = path.join(__dirname, "..", "..", "dist");
const indexFile = path.join(distDir, "index.html");
const faviconFile = path.join(__dirname, "..", "..", "public", "favicon.svg");
const mapsTag = '<link rel="icon" href="/favicon.svg" type="image/svg+xml"><script src="/maps/js?loading=async" async></script>';
const markerGuard = "<script>console.warn=function(original){return function(){var text=Array.prototype.join.call(arguments,\" \");if(text.indexOf(\"google.maps.Marker is deprecated\")<0)return original.apply(console,arguments);};}(console.warn);</script>";

router.use("/assets", express.static(path.join(distDir, "assets"), { index: false, fallthrough: false }));
router.use("/img", express.static(path.join(distDir, "img"), { index: false, fallthrough: false }));

router.get(["/favicon.ico", "/favicon.svg"], (req, res) => {
  res.type("image/svg+xml");
  res.set("Cache-Control", "public, max-age=86400");
  res.sendFile(faviconFile);
});

router.get("/", (req, res) => {
  if (!fs.existsSync(indexFile)) {
    res.status(503).type("text").send("Build frontend belum ada. Jalankan npm run build.");
    return;
  }
  let html = fs.readFileSync(indexFile, "utf8");
  if (html.includes("<!-- MAPS_SCRIPT -->")) html = html.replace("<!-- MAPS_SCRIPT -->", () => mapsTag);
  if (!html.includes("google.maps.Marker is deprecated")) {
    html = html.replace('<script src="/maps/js?loading=async" async></script>', markerGuard + '<script src="/maps/js?loading=async" async></script>');
  }
  res.set("Cache-Control", "no-store");
  res.set("X-Content-Type-Options", "nosniff");
  res.type("html").send(html);
});

module.exports = router;
