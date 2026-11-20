const fs = require("fs");
const path = require("path");
const mysql = require("mysql2/promise");
const { loadEnv, ensureEnv, dbSettings } = require("./env");

const migrationsDir = path.join(__dirname, "..", "sql", "migrations");

function settings() {
  return dbSettings();
}

let pool = null;

async function migrate() {
  const conf = settings();
  const dbName = String(conf.database).replace(/`/g, "");

  try {
    const root = await mysql.createConnection({
      host: conf.host,
      port: conf.port,
      user: conf.user,
      password: conf.password,
      multipleStatements: true
    });
    try {
      await root.query(
        "CREATE DATABASE IF NOT EXISTS `" + dbName + "` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci"
      );
    } catch (error) {
      if (error.code !== "ER_DBACCESS_DENIED_ERROR" && error.code !== "ER_SPECIFIC_ACCESS_DENIED_ERROR") {
        throw error;
      }
    } finally {
      await root.end();
    }
  } catch (error) {
    if (error.code === "ECONNREFUSED" || error.code === "ENOTFOUND" || error.code === "ETIMEDOUT") {
      throw error;
    }
  }

  const conn = await mysql.createConnection({
    host: conf.host,
    port: conf.port,
    user: conf.user,
    password: conf.password,
    database: conf.database,
    multipleStatements: true
  });
  try {
    await conn.query(
      "CREATE TABLE IF NOT EXISTS schema_migrations (" +
        "name VARCHAR(128) NOT NULL," +
        "applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP," +
        "PRIMARY KEY (name)" +
      ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci"
    );
    const [doneRows] = await conn.query("SELECT name FROM schema_migrations");
    const done = new Set(doneRows.map((row) => row.name));
    const files = fs.readdirSync(migrationsDir).filter((name) => name.endsWith(".sql")).sort();
    for (const name of files) {
      if (done.has(name)) continue;
      const sql = fs.readFileSync(path.join(migrationsDir, name), "utf8");
      await conn.query(sql);
      await conn.query("INSERT IGNORE INTO schema_migrations (name) VALUES (?)", [name]);
    }
  } finally {
    await conn.end();
  }

  pool = mysql.createPool({
    host: conf.host,
    port: conf.port,
    user: conf.user,
    password: conf.password,
    database: conf.database,
    waitForConnections: true,
    connectionLimit: conf.connectionLimit || 20,
    charset: "utf8mb4"
  });
}

function db() {
  if (!pool) throw new Error("Database belum siap.");
  return pool;
}

async function query(sql, params) {
  const [rows] = await db().query(sql, params);
  return rows;
}

if (require.main === module) {
  const created = ensureEnv();
  loadEnv();
  const conf = settings();
  migrate()
    .then(() => {
      if (created) console.log("File .env dibuat dengan kredensial default db_arsy.");
      console.log("Database " + conf.database + " siap (" + conf.user + "@" + conf.host + ":" + conf.port + ").");
      return pool && pool.end();
    })
    .catch((error) => {
      console.error(error.message);
      process.exit(1);
    });
}

module.exports = { migrate, query, db };
