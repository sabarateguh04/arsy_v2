const express = require("express");
const fs = require("fs");
const path = require("path");
const store = require("../store");

const router = express.Router();
const TYPES = { "image/png": "png", "image/jpeg": "jpg", "image/jpg": "jpg", "image/webp": "webp", "image/gif": "gif" };

function text(value, max) {
  return String(value || "").trim().slice(0, max);
}

function savePhoto(photo) {
  const match = String(photo && photo.data || "").match(/^data:(image\/[a-z0-9.+-]+);base64,([a-z0-9+/=\s]+)$/i);
  if (!match || !TYPES[match[1].toLowerCase()]) return null;
  const buffer = Buffer.from(match[2].replace(/\s/g, ""), "base64");
  if (!buffer.length || buffer.length > 8 * 1024 * 1024) return null;
  const ext = TYPES[match[1].toLowerCase()];
  const filename = Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8) + "." + ext;
  fs.writeFileSync(path.join(store.uploadsDir, filename), buffer);
  return { name: text(photo.name, 180) || filename, url: "/uploads/" + filename };
}

function removePhoto(url) {
  const filename = path.basename(String(url || ""));
  if (!filename || filename === "." || filename === "..") return;
  const file = path.join(store.uploadsDir, filename);
  if (fs.existsSync(file)) fs.unlinkSync(file);
}

router.get("/state", (req, res) => {
  const data = store.read();
  res.json({ reports: data.reports, grants: data.grants });
});

router.put("/grants", async (req, res) => {
  const grants = req.body;
  if (!grants || typeof grants !== "object" || Array.isArray(grants)) {
    res.status(400).json({ error: "Pengaturan menu tidak valid." });
    return;
  }
  try {
    await store.update((data) => {
      data.grants = grants;
    });
  } catch (error) {
    res.status(500).json({ error: "Pengaturan menu belum tersimpan." });
    return;
  }
  res.json({ ok: true });
});

router.post("/reports", async (req, res) => {
  const body = req.body || {};
  const photos = Array.isArray(body.photos) ? body.photos.slice(0, 3) : [];
  if (!photos.length) {
    res.status(400).json({ error: "Lampirkan 1 sampai 3 foto." });
    return;
  }
  const saved = photos.map(savePhoto);
  if (saved.some((photo) => !photo)) {
    saved.forEach((photo) => photo && removePhoto(photo.url));
    res.status(400).json({ error: "Foto tidak bisa disimpan." });
    return;
  }
  const report = {
    id: Date.now(),
    at: new Date().toISOString(),
    officer: text(body.officer, 160),
    polda: text(body.polda, 120),
    polres: text(body.polres, 120),
    poldaKey: text(body.poldaKey, 80),
    kota: text(body.kota, 80),
    giat: text(body.giat, 80),
    tingkat: text(body.tingkat, 8),
    rawan: text(body.rawan, 80),
    faktor: text(body.faktor, 80),
    penyebab: text(body.penyebab, 160),
    road: text(body.road, 180),
    coord: text(body.coord, 80),
    detail: text(body.detail, 2000),
    photos: saved
  };
  try {
    await store.update((data) => {
      data.reports.unshift(report);
    });
  } catch (error) {
    saved.forEach((photo) => removePhoto(photo.url));
    res.status(500).json({ error: "Laporan belum tersimpan." });
    return;
  }
  res.status(201).json(report);
});

router.delete("/reports/:id", async (req, res) => {
  const id = Number(req.params.id);
  let removed = null;
  try {
    await store.update((data) => {
      removed = data.reports.find((item) => item.id === id) || null;
      data.reports = data.reports.filter((item) => item.id !== id);
    });
  } catch (error) {
    res.status(500).json({ error: "Laporan belum terhapus." });
    return;
  }
  if (removed) removed.photos.forEach((photo) => removePhoto(photo.url));
  res.json({ ok: true });
});

module.exports = router;
