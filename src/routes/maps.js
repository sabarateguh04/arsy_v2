const express = require("express");

const router = express.Router();
const HOST = /^(?:maps\.googleapis\.com|maps\.gstatic\.com|maps\.google\.com|www\.google\.com|www\.gstatic\.com|khms\d*\.(?:googleapis\.com|google\.com)|mts\d*\.googleapis\.com|cbks?\d*\.googleapis\.com|streetviewpixels-pa\.googleapis\.com|earthbuilder\.googleapis\.com|geo\d+\.ggpht\.com|lh\d+\.(?:ggpht|googleusercontent)\.com)$/;
const TEXT = /javascript|ecmascript|text\/css|svg|html|text\/plain|\/json(?!\+)/;

let scriptCache = { at: 0, body: "" };

function mapKey() {
  return process.env.GOOGLE_MAPS_API_KEY || "";
}

function allowed(host) {
  return HOST.test(host);
}

function rewrite(text) {
  return text.replace(/https?:\/\/([a-z0-9.-]+)/gi, (full, host) => {
    return allowed(host) ? "/maps/p/" + host : full;
  });
}

async function forward(req, res, host, pathAndQuery) {
  const key = mapKey();
  if (!allowed(host) || !key) {
    res.status(404).end();
    return;
  }
  let target = "https://" + host + pathAndQuery;
  if (host === "maps.googleapis.com" && !/[?&]key=/.test(pathAndQuery)) {
    target += (pathAndQuery.includes("?") ? "&" : "?") + "key=" + encodeURIComponent(key);
  }
  const headers = {
    "user-agent": req.get("user-agent") || "Mozilla/5.0",
    accept: req.get("accept") || "*/*",
    "accept-language": req.get("accept-language") || "id"
  };
  if (req.get("referer")) headers.referer = req.get("referer");
  if (req.get("origin")) headers.origin = req.get("origin");
  for (const [name, value] of Object.entries(req.headers)) {
    if (name.startsWith("x-")) headers[name] = value;
  }
  const init = { method: req.method === "HEAD" ? "GET" : req.method, headers, redirect: "follow" };
  if (req.method === "POST") {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    init.body = Buffer.concat(chunks);
    const type = req.get("content-type");
    if (type) headers["content-type"] = type;
  }
  let upstream;
  try {
    upstream = await fetch(target, init);
  } catch (error) {
    res.status(502).end();
    return;
  }
  const type = upstream.headers.get("content-type") || "application/octet-stream";
  const body = Buffer.from(await upstream.arrayBuffer());
  res.status(upstream.status);
  res.set("X-Content-Type-Options", "nosniff");
  res.set("Cache-Control", type.includes("javascript") ? "no-store" : "public, max-age=300");
  if (TEXT.test(type)) {
    res.type(type).send(rewrite(body.toString("utf8")));
    return;
  }
  res.set("Content-Type", type);
  res.send(body);
}

router.get("/js", async (req, res) => {
  const key = mapKey();
  if (!key) {
    res.status(204).end();
    return;
  }
  try {
    if (!scriptCache.body || Date.now() - scriptCache.at > 10 * 60 * 1000) {
      const upstream = await fetch("https://maps.googleapis.com/maps/api/js?v=weekly&loading=async&key=" + encodeURIComponent(key), {
        headers: {
          "user-agent": req.get("user-agent") || "Mozilla/5.0",
          referer: req.get("referer") || ""
        }
      });
      if (!upstream.ok) {
        res.status(502).type("js").send("/* maps unavailable */");
        return;
      }
      scriptCache = { at: Date.now(), body: await upstream.text() };
    }
  } catch (error) {
    res.status(502).type("js").send("/* maps unavailable */");
    return;
  }
  res.set("Cache-Control", "private, no-store");
  res.set("X-Content-Type-Options", "nosniff");
  res.type("js").send(rewrite(scriptCache.body));
});

router.use("/p/:host", (req, res) => {
  const host = req.params.host;
  const prefix = "/maps/p/" + host;
  const rest = req.originalUrl.startsWith(prefix) ? req.originalUrl.slice(prefix.length) : req.url;
  forward(req, res, host, rest.startsWith("/") ? rest : "/" + rest);
});

router.use((req, res) => {
  forward(req, res, "maps.googleapis.com", req.originalUrl);
});

module.exports = router;
