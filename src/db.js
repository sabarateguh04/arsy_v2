const fs = require("fs");
const path = require("path");
const mysql = require("mysql2/promise");

const migrationsDir = path.join(__dirname, "..", "sql", "migrations");

function settings() {
  return {
    host: process.env.MYSQL_HOST || "127.0.0.1",
    port: Number(process.env.MYSQL_PORT) || 3306,
    user: process.env.MYSQL_USER || "root",
    password: process.env.MYSQL_PASSWORD || "",
    database: process.env.MYSQL_DATABASE || "db_arsy",
    charset: "utf8mb4"
  };
}

let pool = null;

async function migrate() {
  const conf = settings();
  const root = await mysql.createConnection({
    host: conf.host,
    port: conf.port,
    user: conf.user,
    password: conf.password,
    multipleStatements: true
  });
  try {
    await root.query(
      "CREATE DATABASE IF NOT EXISTS `" + conf.database.replace(/`/g, "") + "` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci"
    );
  } finally {
    await root.end();
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
    connectionLimit: 10,
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
  const envFile = path.join(__dirname, "..", ".env");
  if (fs.existsSync(envFile)) {
    fs.readFileSync(envFile, "utf8").split(/\r?\n/).forEach((line) => {
      const match = line.match(/^([^#=\s]+)\s*=\s*(.*)$/);
      if (match && process.env[match[1]] === undefined) process.env[match[1]] = match[2].trim();
    });
  }
  migrate()
    .then(() => {
      console.log("Database " + (process.env.MYSQL_DATABASE || "db_arsy") + " siap.");
      return pool && pool.end();
    })
    .catch((error) => {
      console.error(error.message);
      process.exit(1);
    });
}

module.exports = { migrate, query, db };
