const fs = require("fs");
const path = require("path");

const envFile = path.join(__dirname, "..", ".env");

const ENV_DEFAULTS = {
  PORT: "3005",
  GOOGLE_MAPS_API_KEY: "",
  DB_HOST: "127.0.0.1",
  DB_PORT: "3306",
  DB_USER: "db_arsy",
  DB_PASSWORD: "db_arsy",
  DB_NAME: "db_arsy",
  DB_POOL: "20",
  ALESHA_API_URL: "https://alesha-be.djalu.co.id"
};

const MYSQL_ALIASES = {
  DB_HOST: "MYSQL_HOST",
  DB_PORT: "MYSQL_PORT",
  DB_USER: "MYSQL_USER",
  DB_PASSWORD: "MYSQL_PASSWORD",
  DB_NAME: "MYSQL_DATABASE"
};

function parseEnvFile(text) {
  const values = {};
  text.split(/\r?\n/).forEach((line) => {
    const match = line.match(/^([^#=\s]+)\s*=\s*(.*)$/);
    if (match) values[match[1]] = match[2].trim();
  });
  return values;
}

function applyEnv(values) {
  Object.keys(values).forEach((key) => {
    if (process.env[key] === undefined) process.env[key] = values[key];
  });
}

function loadEnv() {
  if (!fs.existsSync(envFile)) return;
  applyEnv(parseEnvFile(fs.readFileSync(envFile, "utf8")));
}

function envText(values) {
  return Object.keys(values)
    .map((key) => key + "=" + values[key])
    .join("\n") + "\n";
}

function ensureEnv() {
  if (!fs.existsSync(envFile)) {
    fs.writeFileSync(envFile, envText(ENV_DEFAULTS));
    applyEnv(ENV_DEFAULTS);
    return true;
  }

  const raw = fs.readFileSync(envFile, "utf8");
  const existing = parseEnvFile(raw);
  const missing = {};
  Object.keys(ENV_DEFAULTS).forEach((key) => {
    if (existing[key] !== undefined) return;
    if (MYSQL_ALIASES[key] && existing[MYSQL_ALIASES[key]] !== undefined) return;
    missing[key] = ENV_DEFAULTS[key];
  });
  if (Object.keys(missing).length) {
    const prefix = raw === "" || raw.endsWith("\n") ? "" : "\n";
    fs.appendFileSync(envFile, prefix + envText(missing));
  }
  applyEnv(existing);
  applyEnv(missing);
  return false;
}

function firstEnv(names, fallback) {
  for (let i = 0; i < names.length; i += 1) {
    if (process.env[names[i]] !== undefined) return process.env[names[i]];
  }
  return fallback;
}

function dbSettings() {
  return {
    host: firstEnv(["DB_HOST", "MYSQL_HOST"], ENV_DEFAULTS.DB_HOST),
    port: Number(firstEnv(["DB_PORT", "MYSQL_PORT"], ENV_DEFAULTS.DB_PORT)),
    user: firstEnv(["DB_USER", "MYSQL_USER"], ENV_DEFAULTS.DB_USER),
    password: firstEnv(["DB_PASSWORD", "MYSQL_PASSWORD"], ENV_DEFAULTS.DB_PASSWORD),
    database: firstEnv(["DB_NAME", "MYSQL_DATABASE"], ENV_DEFAULTS.DB_NAME),
    connectionLimit: Number(firstEnv(["DB_POOL"], ENV_DEFAULTS.DB_POOL)),
    charset: "utf8mb4"
  };
}

module.exports = { loadEnv, ensureEnv, dbSettings, envFile };
