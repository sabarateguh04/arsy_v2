const { loadEnv, dbSettings } = require("./env");

loadEnv();

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
    const conf = dbSettings();
    console.error("Database belum siap: " + error.message);
    console.error("Cek user " + conf.user + "@" + conf.host + " / database " + conf.database + ".");
    process.exit(1);
  });
