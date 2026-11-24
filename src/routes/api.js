const express = require("express");
const fs = require("fs");
const path = require("path");
const store = require("../store");
const users = require("../users");
const master = require("../master");
const publicContent = require("../publicContent");

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
    const result = await users.login(email, password);
    if (result.error) {
      res.status(result.status || 401).json({ error: result.error });
      return;
    }
    users.setSessionCookie(res, users.createSession(result.user));
    res.json(result.user);
  } catch (error) {
    res.status(503).json({ error: "Layanan akun belum siap. Coba lagi." });
  }
});

router.post("/logout", (req, res) => {
  users.destroySession(req);
  users.clearSessionCookie(res);
  res.json({ ok: true });
});

router.get("/register/areas", async (req, res) => {
  try {
    res.json({ areas: await users.registerAreas() });
  } catch (error) {
    res.status(503).json({ error: "Wilayah belum siap. Coba lagi." });
  }
});

router.post("/register", async (req, res) => {
  try {
    const result = await users.register(req.body || {});
    if (result.error) {
      res.status(result.status || 400).json({ error: result.error });
      return;
    }
    res.status(201).json({
      pending: true,
      message: "Pendaftaran diterima. Tunggu persetujuan admin sebelum masuk."
    });
  } catch (error) {
    res.status(500).json({ error: "Pendaftaran belum bisa disimpan." });
  }
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

router.get("/public", async (req, res) => {
  try {
    res.json(await publicContent.getPublic());
  } catch (error) {
    res.json(publicContent.defaultPublic());
  }
});

router.put("/public", async (req, res) => {
  if (!requireAdmin(req, res)) return;
  try {
    res.json(await publicContent.savePublic(req.body || {}));
  } catch (error) {
    res.status(500).json({ error: "Konten publik belum tersimpan." });
  }
});

router.post("/public/photo", (req, res) => {
  if (!requireAdmin(req, res)) return;
  const saved = savePhoto(req.body || {});
  if (!saved) {
    res.status(400).json({ error: "Foto tidak bisa disimpan." });
    return;
  }
  res.json(saved);
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

router.post("/ai-chat/send", async (req, res) => {
  try {
    const user = await users.currentPublicUser(req);
    if (!user) {
      res.status(401).json({ error: "Masuk dulu." });
      return;
    }
    const message = text(req.body && req.body.message, 4000);
    const files = Array.isArray(req.body && req.body.files) ? req.body.files.slice(0, 4).map((item) => ({
      name: text(item && item.name, 180) || "berkas",
      type: text(item && item.type, 120),
      size: Number(item && item.size) || 0,
      base64: String(item && item.base64 || "").slice(0, 12000000)
    })).filter((item) => item.base64) : [];
    const audioRaw = req.body && req.body.audio;
    const audio = audioRaw && audioRaw.base64 ? {
      name: text(audioRaw.name, 80) || "voicenote.webm",
      base64: String(audioRaw.base64).slice(0, 12000000),
      duration: Number(audioRaw.duration) || 0
    } : null;
    if (!message && !files.length && !audio) {
      res.status(400).json({ error: "Pesan, rekaman suara, atau berkas tidak boleh kosong." });
      return;
    }
    let sessionId = text(req.body && req.body.sessionId, 80);
    if (sessionId && !sessionId.startsWith("arsy-")) sessionId = "";
    const nasional = user.cakupan === "nasional";
    const provinsi = nasional ? "" : (user.provinsi || "");
    const kota = user.cakupan === "kota" ? (user.kota || "") : "";
    const payload = {
      message,
      session_id: sessionId,
      files,
      audio,
      context_app: "sm-arsy",
      user_category: "sm-arsy",
      user_role: user.role,
      user_fullname: user.name,
      login_user_id: user.id,
      organization_level: user.cakupan,
      executive_level: user.cakupan,
      user_polda: provinsi,
      user_polres: kota,
      provinsi,
      kota,
      client_ip: req.ip || ""
    };
    const base = String(process.env.ALESHA_API_URL || "https://alesha-be.djalu.co.id").replace(/\/+$/, "");
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 60000);
    let response;
    try {
      response = await fetch(base + "/api/chat/arsy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal
      });
    } finally {
      clearTimeout(timer);
    }
    const data = await response.json().catch(() => ({}));
    if (!response.ok || data.success === false) {
      res.status(502).json({ error: data.message || "Alesha belum bisa menjawab." });
      return;
    }
    res.json({
      reply: data.reply || data.response || "",
      sessionId: data.session_id || sessionId,
      source: data.source || null
    });
  } catch (error) {
    res.status(502).json({ error: "Alesha belum terhubung." });
  }
});

module.exports = router;
