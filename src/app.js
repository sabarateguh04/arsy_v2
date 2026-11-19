const express = require("express");
const path = require("path");
const pages = require("./routes/pages");

const app = express();
const publicDir = path.join(__dirname, "..", "public");

app.disable("x-powered-by");
app.use(express.static(publicDir, { index: false }));
app.use(pages);

module.exports = app;
