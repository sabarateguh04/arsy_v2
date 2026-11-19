const express = require("express");
const path = require("path");
const pages = require("./routes/pages");
const api = require("./routes/api");
const store = require("./store");

const app = express();
const publicDir = path.join(__dirname, "..", "public");

app.disable("x-powered-by");
app.use(express.json({ limit: "25mb" }));
app.use("/uploads", express.static(store.uploadsDir, { index: false, fallthrough: false }));
app.use("/api", api);
app.use(express.static(publicDir, { index: false }));
app.use(pages);

module.exports = app;
