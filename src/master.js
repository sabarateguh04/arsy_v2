const { query } = require("./db");
const store = require("./store");

const TABLES = {
  roles: {
    table: "roles",
    fields: ["name", "cakupan", "status"],
    search: ["name", "cakupan"],
    unique: "name"
  },
  jabatan: {
    table: "jabatan",
    fields: ["name", "role_name", "status"],
    search: ["name", "role_name"],
    unique: "name"
  },
  provinsi: {
    table: "provinsi",
    fields: ["name", "status"],
    search: ["name"],
    unique: "name"
  },
  kota: {
    table: "kota",
    fields: ["name", "provinsi", "status"],
    search: ["name", "provinsi"],
    unique: null
  },
  menus: {
    table: "menus",
    fields: ["menu_key", "label", "grup", "status"],
    search: ["menu_key", "label", "grup"],
    unique: "menu_key",
    idField: "menu_key"
  }
};

function text(value, max) {
  return String(value || "").trim().slice(0, max);
}

function statusOf(value) {
  return value === "Nonaktif" ? "Nonaktif" : "Aktif";
}

function clean(type, body) {
  if (type === "roles") {
    const name = text(body.name, 64);
    const cakupan = text(body.cakupan, 16);
    if (!name) return { error: "Nama role wajib diisi." };
    if (!["nasional", "provinsi", "kota"].includes(cakupan)) return { error: "Cakupan tidak valid." };
    return { name, cakupan, status: statusOf(body.status) };
  }
  if (type === "jabatan") {
    const name = text(body.name, 160);
    if (!name) return { error: "Nama jabatan wajib diisi." };
    return { name, role_name: text(body.role_name, 64), status: statusOf(body.status) };
  }
  if (type === "provinsi") {
    const name = text(body.name, 120);
    if (!name) return { error: "Nama provinsi wajib diisi." };
    return { name, status: statusOf(body.status) };
  }
  if (type === "kota") {
    const name = text(body.name, 120);
    const provinsi = text(body.provinsi, 120);
    if (!name) return { error: "Nama kota wajib diisi." };
    if (!provinsi) return { error: "Provinsi wajib diisi." };
    return { name, provinsi, status: statusOf(body.status) };
  }
  const menu_key = text(body.menu_key, 64);
  const label = text(body.label, 160);
  const grup = text(body.grup, 64) || "Menu";
  if (!menu_key) return { error: "Kunci menu wajib diisi." };
  if (!/^[a-zA-Z][a-zA-Z0-9_-]*$/.test(menu_key)) return { error: "Kunci menu hanya huruf, angka, dan strip." };
  if (!label) return { error: "Nama menu wajib diisi." };
  return { menu_key, label, grup, status: statusOf(body.status) };
}

async function list(type) {
  if (type === "kota") return query("SELECT * FROM kota ORDER BY provinsi, name");
  if (type === "menus") return query("SELECT * FROM menus ORDER BY grup, label");
  const conf = TABLES[type];
  const order = conf.idField || "name";
  return query("SELECT * FROM `" + conf.table + "` ORDER BY `" + order + "` ASC");
}

async function create(type, body) {
  const conf = TABLES[type];
  const data = clean(type, body);
  if (data.error) return data;
  const fields = conf.fields;
  try {
    const result = await query(
      "INSERT INTO `" + conf.table + "` (" + fields.map((field) => "`" + field + "`").join(", ") + ") VALUES (" + fields.map(() => "?").join(", ") + ")",
      fields.map((field) => data[field])
    );
    const id = conf.idField ? data[conf.idField] : result.insertId;
    if (type === "roles" && data.name !== "Admin") {
      await query("INSERT IGNORE INTO role_menu (role_name, menu_key, allowed) SELECT ?, menu_key, 0 FROM menus", [data.name]);
    }
    const rows = await query("SELECT * FROM `" + conf.table + "` WHERE `" + (conf.idField || "id") + "` = ? LIMIT 1", [id]);
    return { row: rows[0] };
  } catch (error) {
    if (error && error.code === "ER_DUP_ENTRY") return { error: "Data ini sudah ada.", status: 409 };
    throw error;
  }
}

async function update(type, id, body) {
  const conf = TABLES[type];
  const key = conf.idField || "id";
  const rows = await query("SELECT * FROM `" + conf.table + "` WHERE `" + key + "` = ? LIMIT 1", [id]);
  if (!rows[0]) return { error: "Data tidak ditemukan.", status: 404 };
  const data = clean(type, body);
  if (data.error) return data;
  if (type === "roles" && rows[0].name === "Admin" && data.name !== "Admin") return { error: "Nama role Admin tidak bisa diubah." };
  if (type === "roles" && data.name !== rows[0].name) {
    const used = await query("SELECT COUNT(*) AS total FROM users WHERE role = ?", [rows[0].name]);
    if (Number(used[0].total)) return { error: "Role masih dipakai pengguna, nama tidak bisa diubah." };
  }
  if (type === "jabatan" && data.name !== rows[0].name) {
    const used = await query("SELECT COUNT(*) AS total FROM users WHERE jabatan = ?", [rows[0].name]);
    if (Number(used[0].total)) return { error: "Jabatan masih dipakai pengguna, nama tidak bisa diubah." };
  }
  if (type === "provinsi" && data.name !== rows[0].name) {
    const usedUser = await query("SELECT COUNT(*) AS total FROM users WHERE provinsi = ?", [rows[0].name]);
    const usedKota = await query("SELECT COUNT(*) AS total FROM kota WHERE provinsi = ?", [rows[0].name]);
    if (Number(usedUser[0].total) || Number(usedKota[0].total)) return { error: "Provinsi masih dipakai, nama tidak bisa diubah." };
  }
  const fields = conf.fields.filter((field) => field !== conf.idField);
  try {
    await query(
      "UPDATE `" + conf.table + "` SET " + fields.map((field) => "`" + field + "` = ?").join(", ") + " WHERE `" + key + "` = ?",
      fields.map((field) => data[field]).concat([id])
    );
  } catch (error) {
    if (error && error.code === "ER_DUP_ENTRY") return { error: "Data ini sudah ada.", status: 409 };
    throw error;
  }
  const next = await query("SELECT * FROM `" + conf.table + "` WHERE `" + key + "` = ? LIMIT 1", [conf.idField ? data[conf.idField] : id]);
  return { row: next[0] };
}

async function remove(type, id) {
  const conf = TABLES[type];
  const key = conf.idField || "id";
  const rows = await query("SELECT * FROM `" + conf.table + "` WHERE `" + key + "` = ? LIMIT 1", [id]);
  const row = rows[0];
  if (!row) return { error: "Data tidak ditemukan.", status: 404 };
  if (type === "roles" && row.name === "Admin") return { error: "Role Admin tidak bisa dihapus." };
  if (type === "roles") {
    const used = await query("SELECT COUNT(*) AS total FROM users WHERE role = ?", [row.name]);
    if (Number(used[0].total)) return { error: "Role masih dipakai pengguna." };
  }
  if (type === "jabatan") {
    const used = await query("SELECT COUNT(*) AS total FROM users WHERE jabatan = ?", [row.name]);
    if (Number(used[0].total)) return { error: "Jabatan masih dipakai pengguna." };
  }
  if (type === "provinsi") {
    const usedUser = await query("SELECT COUNT(*) AS total FROM users WHERE provinsi = ?", [row.name]);
    const usedKota = await query("SELECT COUNT(*) AS total FROM kota WHERE provinsi = ?", [row.name]);
    if (Number(usedUser[0].total) || Number(usedKota[0].total)) return { error: "Provinsi masih dipakai." };
  }
  if (type === "kota") {
    const used = await query("SELECT COUNT(*) AS total FROM users WHERE kota = ? AND provinsi = ?", [row.name, row.provinsi]);
    if (Number(used[0].total)) return { error: "Kota masih dipakai pengguna." };
  }
  await query("DELETE FROM `" + conf.table + "` WHERE `" + key + "` = ?", [id]);
  if (type === "roles") await query("DELETE FROM role_menu WHERE role_name = ?", [row.name]);
  if (type === "menus") await query("DELETE FROM role_menu WHERE menu_key = ?", [row.menu_key]);
  return { ok: true };
}

function grantsObject(rows) {
  const grants = {};
  rows.forEach((row) => {
    if (!grants[row.role_name]) grants[row.role_name] = {};
    grants[row.role_name][row.menu_key] = !!row.allowed;
  });
  return Object.keys(grants).length ? grants : null;
}

async function getGrants() {
  const rows = await query("SELECT role_name, menu_key, allowed FROM role_menu");
  const fromDb = grantsObject(rows);
  if (fromDb) return fromDb;
  const data = store.read();
  return data.grants || null;
}

async function saveGrants(grants) {
  const roles = Object.keys(grants || {});
  for (const role of roles) {
    const keys = grants[role] && typeof grants[role] === "object" ? grants[role] : {};
    for (const menuKey of Object.keys(keys)) {
      await query(
        "INSERT INTO role_menu (role_name, menu_key, allowed) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE allowed = VALUES(allowed)",
        [role.slice(0, 64), String(menuKey).slice(0, 64), keys[menuKey] ? 1 : 0]
      );
    }
  }
  await store.update((data) => {
    data.grants = grants;
  });
}

async function catalog() {
  const [roles, jabatan, provinsi, kota, menus, grantRows] = await Promise.all([
    query("SELECT id, name, cakupan, status FROM roles ORDER BY name"),
    query("SELECT id, name, role_name, status FROM jabatan ORDER BY name"),
    query("SELECT id, name, status FROM provinsi ORDER BY name"),
    query("SELECT id, name, provinsi, status FROM kota ORDER BY provinsi, name"),
    query("SELECT menu_key, label, grup, status FROM menus ORDER BY grup, label"),
    query("SELECT role_name, menu_key, allowed FROM role_menu")
  ]);
  const areas = {};
  kota.filter((row) => row.status === "Aktif").forEach((row) => {
    if (!areas[row.provinsi]) areas[row.provinsi] = [];
    areas[row.provinsi].push(row.name);
  });
  return {
    roles,
    jabatan,
    provinsi,
    kota,
    menus,
    areas,
    grants: grantsObject(grantRows)
  };
}

async function findRole(name) {
  const rows = await query("SELECT * FROM roles WHERE name = ? LIMIT 1", [name]);
  return rows[0] || null;
}

module.exports = { TABLES, list, create, update, remove, getGrants, saveGrants, catalog, findRole };
