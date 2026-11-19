const app = require("./app");

const port = Number(process.env.PORT) || 3005;

app.listen(port, () => {
  console.log("ARSY berjalan di http://localhost:" + port);
});
