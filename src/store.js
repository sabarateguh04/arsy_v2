const fs = require("fs");
const path = require("path");

const dataDir = path.join(__dirname, "..", "data");
const uploadsDir = path.join(dataDir, "uploads");
const storeFile = path.join(dataDir, "store.json");

let queue = Promise.resolve();

function ensure() {
  fs.mkdirSync(uploadsDir, { recursive: true });
  if (!fs.existsSync(storeFile)) {
    fs.writeFileSync(storeFile, JSON.stringify({ reports: [], grants: null }, null, 2));
  }
}

function read() {
  ensure();
  const data = JSON.parse(fs.readFileSync(storeFile, "utf8"));
  if (!Array.isArray(data.reports)) data.reports = [];
  if (!Object.prototype.hasOwnProperty.call(data, "grants")) data.grants = null;
  return data;
}

function write(data) {
  ensure();
  const temp = storeFile + ".tmp";
  fs.writeFileSync(temp, JSON.stringify(data, null, 2));
  fs.renameSync(temp, storeFile);
}

function update(change) {
  const run = queue.then(() => {
    const data = read();
    change(data);
    write(data);
    return data;
  });
  queue = run.then(() => undefined, () => undefined);
  return run;
}

module.exports = { dataDir, uploadsDir, read, update };
