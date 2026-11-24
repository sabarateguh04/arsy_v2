const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const { query } = require("./db");
const master = require("./master");

const sessions = new Map();

function poldaKey(provinsi) {
  if (provinsi === "DKI Jakarta") return "Jakarta Raya";
  if (provinsi === "DI Yogyakarta") return "Yogyakarta";
  return provinsi || "";
}

function publicUser(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    jabatan: row.jabatan || "",
    provinsi: row.provinsi || "",
    kota: row.kota || "",
    polda: poldaKey(row.provinsi),
    status: row.status,
    cakupan: row.cakupan || (row.role === "Admin" || row.role === "Eksekutif 1" || row.role === "Editor Berita" ? "nasional" : row.role === "Eksekutif 2" ? "provinsi" : "kota")
  };
}

function parseCookies(req) {
  const header = req.headers.cookie || "";
  const out = {};
  header.split(";").forEach((part) => {
    const index = part.indexOf("=");
    if (index < 1) return;
    const key = part.slice(0, index).trim();
    const value = part.slice(index + 1).trim();
    try {
      out[key] = decodeURIComponent(value);
    } catch (error) {
      out[key] = value;
    }
  });
  return out;
}

function setSessionCookie(res, token) {
  res.setHeader("Set-Cookie", "arsy_sid=" + token + "; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400");
}

function clearSessionCookie(res) {
  res.setHeader("Set-Cookie", "arsy_sid=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0");
}

function createSession(user) {
  const token = crypto.randomBytes(24).toString("hex");
  sessions.set(token, { id: user.id, role: user.role, at: Date.now() });
  return token;
}

function readSession(req) {
  const token = parseCookies(req).arsy_sid;
  if (!token) return null;
  const session = sessions.get(token);
  if (!session) return null;
  session.token = token;
  return session;
}

function destroySession(req) {
  const token = parseCookies(req).arsy_sid;
  if (token) sessions.delete(token);
}

const USER_SELECT = "SELECT u.*, r.cakupan FROM users u LEFT JOIN roles r ON r.name = u.role ";

async function findByEmail(email) {
  const rows = await query(USER_SELECT + "WHERE u.email = ? LIMIT 1", [String(email || "").trim().toLowerCase()]);
  return rows[0] || null;
}

async function findById(id) {
  const rows = await query(USER_SELECT + "WHERE u.id = ? LIMIT 1", [id]);
  return rows[0] || null;
}

async function listUsers() {
  const rows = await query(USER_SELECT + "ORDER BY u.id ASC");
  return rows.map(publicUser);
}

async function nextUserId() {
  const rows = await query("SELECT id FROM users WHERE id LIKE 'USR-%'");
  const max = rows.reduce((highest, row) => {
    const num = parseInt(String(row.id).replace("USR-", ""), 10);
    return Number.isFinite(num) ? Math.max(highest, num) : highest;
  }, 2400);
  return "USR-" + (max + 1);
}

async function cleanUser(body, existing) {
  const role = String((body && body.role) || "").trim();
  const roleRow = await master.findRole(role);
  if (!roleRow || roleRow.status !== "Aktif") return { error: "Peran tidak valid." };
  const name = String((body && body.name) || "").trim().slice(0, 160);
  const email = String((body && body.email) || "").trim().toLowerCase().slice(0, 190);
  const status = String((body && body.status) || "Aktif").trim();
  if (!name) return { error: "Nama wajib diisi." };
  if (!email || !email.includes("@")) return { error: "Email tidak valid." };
  if (status !== "Aktif" && status !== "Nonaktif") return { error: "Status tidak valid." };
  let provinsi = String((body && body.provinsi) || "").trim().slice(0, 120);
  let kota = String((body && body.kota) || "").trim().slice(0, 120);
  if (roleRow.cakupan === "nasional") {
    provinsi = "";
    kota = "";
  } else if (roleRow.cakupan === "provinsi") {
    kota = "";
    if (!provinsi) return { error: "Provinsi wajib diisi." };
  } else if (!provinsi || !kota) {
    return { error: "Provinsi dan kota wajib diisi." };
  }
  const jabatan = String((body && body.jabatan) || (existing && existing.jabatan) || role).trim().slice(0, 160);
  const password = String((body && body.password) || "").trim();
  return { name, email, role, jabatan, provinsi, kota, status, password };
}

async function createUser(body) {
  const data = await cleanUser(body, null);
  if (data.error) return data;
  const password = data.password || "arsy1234";
  if (password.length < 4) return { error: "Kata sandi terlalu pendek." };
  const id = await nextUserId();
  try {
    await query(
      "INSERT INTO users (id, name, email, password_hash, role, jabatan, provinsi, kota, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [id, data.name, data.email, bcrypt.hashSync(password, 10), data.role, data.jabatan, data.provinsi, data.kota, data.status]
    );
  } catch (error) {
    if (error && error.code === "ER_DUP_ENTRY") return { error: "Email ini sudah dipakai.", status: 409 };
    throw error;
  }
  return { user: publicUser(await findById(id)) };
}

async function updateUser(id, body) {
  const existing = await findById(id);
  if (!existing) return { error: "Pengguna tidak ditemukan.", status: 404 };
  const data = await cleanUser(body, existing);
  if (data.error) return data;
  const fields = [data.name, data.email, data.role, data.jabatan, data.provinsi, data.kota, data.status];
  let sql = "UPDATE users SET name = ?, email = ?, role = ?, jabatan = ?, provinsi = ?, kota = ?, status = ?";
  if (data.password) {
    if (data.password.length < 4) return { error: "Kata sandi terlalu pendek." };
    sql += ", password_hash = ?";
    fields.push(bcrypt.hashSync(data.password, 10));
  }
  fields.push(id);
  try {
    await query(sql + " WHERE id = ?", fields);
  } catch (error) {
    if (error && error.code === "ER_DUP_ENTRY") return { error: "Email ini sudah dipakai.", status: 409 };
    throw error;
  }
  return { user: publicUser(await findById(id)) };
}

async function deleteUser(id, actorId) {
  const existing = await findById(id);
  if (!existing) return { error: "Pengguna tidak ditemukan.", status: 404 };
  if (existing.id === actorId) return { error: "Akun yang sedang masuk tidak bisa dihapus." };
  if (existing.role === "Admin") {
    const rows = await query("SELECT COUNT(*) AS total FROM users WHERE role = 'Admin'");
    if (Number(rows[0].total) <= 1) return { error: "Admin terakhir tidak bisa dihapus." };
  }
  await query("DELETE FROM users WHERE id = ?", [id]);
  return { ok: true };
}

async function currentPublicUser(req) {
  const session = readSession(req);
  if (!session) return null;
  const row = await findById(session.id);
  if (!row || row.status !== "Aktif") return null;
  return publicUser(row);
}

async function login(email, password) {
  const user = await findByEmail(email);
  if (!user || user.status !== "Aktif") return null;
  if (!bcrypt.compareSync(String(password || ""), user.password_hash)) return null;
  return publicUser(user);
}

async function registerAreas() {
  const [provinsiRows, kotaRows] = await Promise.all([
    query("SELECT name FROM provinsi WHERE status = 'Aktif' ORDER BY name"),
    query("SELECT name, provinsi FROM kota WHERE status = 'Aktif' ORDER BY provinsi, name")
  ]);
  const areas = {};
  provinsiRows.forEach((row) => {
    areas[row.name] = [];
  });
  kotaRows.forEach((row) => {
    if (!areas[row.provinsi]) areas[row.provinsi] = [];
    areas[row.provinsi].push(row.name);
  });
  return areas;
}

async function register(body) {
  const name = String((body && body.name) || "").trim().slice(0, 160);
  const email = String((body && body.email) || "").trim().toLowerCase().slice(0, 190);
  const password = String((body && body.password) || "").trim();
  const confirm = String((body && body.confirm) || "").trim();
  const provinsi = String((body && body.provinsi) || "").trim().slice(0, 120);
  const kota = String((body && body.kota) || "").trim().slice(0, 120);
  if (!name) return { error: "Nama wajib diisi." };
  if (!email || !email.includes("@")) return { error: "Email tidak valid." };
  if (password.length < 4) return { error: "Kata sandi terlalu pendek." };
  if (confirm && confirm !== password) return { error: "Konfirmasi kata sandi tidak sama." };
  if (!provinsi || !kota) return { error: "Provinsi dan kota wajib diisi." };
  const match = await query(
    "SELECT name FROM kota WHERE name = ? AND provinsi = ? AND status = 'Aktif' LIMIT 1",
    [kota, provinsi]
  );
  if (!match.length) return { error: "Provinsi atau kota tidak valid." };
  return createUser({
    name,
    email,
    password,
    role: "Operator",
    jabatan: "Operator",
    provinsi,
    kota,
    status: "Aktif"
  });
}

module.exports = {
  publicUser,
  createSession,
  readSession,
  destroySession,
  setSessionCookie,
  clearSessionCookie,
  listUsers,
  currentPublicUser,
  createUser,
  updateUser,
  deleteUser,
  login,
  register,
  registerAreas
};
