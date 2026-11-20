const fs = require("fs");
const path = require("path");

const envFile = path.join(__dirname, "..", ".env");
if (fs.existsSync(envFile)) {
  fs.readFileSync(envFile, "utf8").split(/\r?\n/).forEach((line) => {
    const match = line.match(/^([^#=\s]+)\s*=\s*(.*)$/);
    if (match && process.env[match[1]] === undefined) process.env[match[1]] = match[2].trim();
  });
}

const { migrate } = require("./db");
const app = require("./app");
const port = Number(process.env.PORT) || 3005;

migrate()
  .then(() => {
    app.listen(port, () => {
      console.log("ARSY berjalan di http://localhost:" + port);
    });
  })
  .catch((error) => {
    console.error("Database belum siap: " + error.message);
    process.exit(1);
  });
