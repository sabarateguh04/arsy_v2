const express = require("express");
const fs = require("fs");
const path = require("path");
const store = require("../store");
const users = require("../users");
const master = require("../master");

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

function requireAdmin(req, res) {
  const session = users.readSession(req);
  if (!session) {
    res.status(401).json({ error: "Masuk dulu sebagai admin." });
    return null;
  }
  if (session.role !== "Admin") {
    res.status(403).json({ error: "Hanya admin yang bisa mengelola pengguna." });
    return null;
  }
  return session;
}

router.post("/login", async (req, res) => {
  const email = text(req.body && req.body.email, 190);
  const password = String((req.body && req.body.password) || "");
  try {
    const user = await users.login(email, password);
    if (!user) {
      res.status(401).json({ error: "Email atau kata sandi tidak cocok, atau akun sedang nonaktif." });
      return;
    }
    users.setSessionCookie(res, users.createSession(user));
    res.json(user);
  } catch (error) {
    res.status(503).json({ error: "Layanan akun belum siap. Coba lagi." });
  }
});

router.post("/logout", (req, res) => {
  users.destroySession(req);
  users.clearSessionCookie(res);
  res.json({ ok: true });
});

router.get("/users", async (req, res) => {
  if (!requireAdmin(req, res)) return;
  try {
    res.json(await users.listUsers());
  } catch (error) {
    res.status(500).json({ error: "Daftar pengguna belum bisa dibuka." });
  }
});

router.post("/users", async (req, res) => {
  if (!requireAdmin(req, res)) return;
  try {
    const result = await users.createUser(req.body || {});
    if (result.error) {
      res.status(result.status || 400).json({ error: result.error });
      return;
    }
    res.status(201).json(result.user);
  } catch (error) {
    res.status(500).json({ error: "Pengguna belum tersimpan." });
  }
});

router.put("/users/:id", async (req, res) => {
  if (!requireAdmin(req, res)) return;
  try {
    const result = await users.updateUser(req.params.id, req.body || {});
    if (result.error) {
      res.status(result.status || 400).json({ error: result.error });
      return;
    }
    res.json(result.user);
  } catch (error) {
    res.status(500).json({ error: "Pengguna belum tersimpan." });
  }
});

router.delete("/users/:id", async (req, res) => {
  const session = requireAdmin(req, res);
  if (!session) return;
  try {
    const result = await users.deleteUser(req.params.id, session.id);
    if (result.error) {
      res.status(result.status || 400).json({ error: result.error });
      return;
    }
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: "Pengguna belum terhapus." });
  }
});

router.get("/master/catalog", async (req, res) => {
  if (!users.readSession(req)) {
    res.status(401).json({ error: "Masuk dulu." });
    return;
  }
  try {
    res.json(await master.catalog());
  } catch (error) {
    res.status(500).json({ error: "Data master belum bisa dibuka." });
  }
});

["roles", "jabatan", "provinsi", "kota", "menus"].forEach((type) => {
  router.get("/master/" + type, async (req, res) => {
    if (!requireAdmin(req, res)) return;
    try {
      res.json(await master.list(type));
    } catch (error) {
      res.status(500).json({ error: "Data belum bisa dibuka." });
    }
  });
  router.post("/master/" + type, async (req, res) => {
    if (!requireAdmin(req, res)) return;
    try {
      const result = await master.create(type, req.body || {});
      if (result.error) {
        res.status(result.status || 400).json({ error: result.error });
        return;
      }
      res.status(201).json(result.row);
    } catch (error) {
      res.status(500).json({ error: "Data belum tersimpan." });
    }
  });
  router.put("/master/" + type + "/:id", async (req, res) => {
    if (!requireAdmin(req, res)) return;
    try {
      const result = await master.update(type, req.params.id, req.body || {});
      if (result.error) {
        res.status(result.status || 400).json({ error: result.error });
        return;
      }
      res.json(result.row);
    } catch (error) {
      res.status(500).json({ error: "Data belum tersimpan." });
    }
  });
  router.delete("/master/" + type + "/:id", async (req, res) => {
    if (!requireAdmin(req, res)) return;
    try {
      const result = await master.remove(type, req.params.id);
      if (result.error) {
        res.status(result.status || 400).json({ error: result.error });
        return;
      }
      res.json({ ok: true });
    } catch (error) {
      res.status(500).json({ error: "Data belum terhapus." });
    }
  });
});

router.get("/state", async (req, res) => {
  const data = store.read();
  let grants = data.grants;
  try {
    const fromDb = await master.getGrants();
    if (fromDb) grants = fromDb;
  } catch (error) {
    grants = data.grants;
  }
  res.json({ reports: data.reports, grants });
});

router.put("/grants", async (req, res) => {
  const grants = req.body;
  if (!grants || typeof grants !== "object" || Array.isArray(grants)) {
    res.status(400).json({ error: "Pengaturan menu tidak valid." });
    return;
  }
  try {
    await master.saveGrants(grants);
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
