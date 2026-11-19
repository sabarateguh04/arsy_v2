const express = require("express");
const pages = require("./routes/pages");
const api = require("./routes/api");
const maps = require("./routes/maps");
const store = require("./store");

const app = express();

app.disable("x-powered-by");
app.use("/maps", maps);
app.use(express.json({ limit: "25mb" }));
app.use("/uploads", express.static(store.uploadsDir, { index: false, fallthrough: false }));
app.use("/api", api);
app.use(pages);

module.exports = app;
