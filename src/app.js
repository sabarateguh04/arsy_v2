const express = require("express");
const pages = require("./routes/pages");
const api = require("./routes/api");
const maps = require("./routes/maps");
const store = require("./store");

const app = express();

const ALLOWED_ORIGINS = new Set([
  "https://alesha-be.djalu.co.id",
  "https://alesha.djalu.co.id"
]);

app.disable("x-powered-by");
app.use((req, res, next) => {
  const origin = req.get("origin");
  if (origin && ALLOWED_ORIGINS.has(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  }
  if (req.method === "OPTIONS") {
    res.sendStatus(204);
    return;
  }
  next();
});
app.use("/maps", maps);
app.use(express.json({ limit: "25mb" }));
app.use("/uploads", express.static(store.uploadsDir, { index: false, fallthrough: false }));
app.use("/api", api);
app.use(pages);

module.exports = app;
