const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const root = path.join(__dirname, "..", "..");

router.get("/", (req, res) => {
  const page = fs.readFileSync(path.join(root, "public", "index.html"), "utf8");
  const client = fs.readFileSync(path.join(root, "src", "client", "app.js"), "utf8");
  const html = page.replace("<!-- APP_SCRIPT -->", () => "<script>\n" + client + "</script>");
  res.type("html").send(html);
});

module.exports = router;
