const fs = require("fs");
const path = require("path");
const { defineConfig } = require("vite");

const root = __dirname;

function readOrder(folder) {
  return JSON.parse(fs.readFileSync(path.join(root, "src", "client", folder, "order.json"), "utf8"));
}

function viewsHtml() {
  return readOrder("views").map((name) => fs.readFileSync(path.join(root, "src", "client", "views", name), "utf8")).join("");
}

function appModule() {
  const logic = readOrder("logic").map((name) => fs.readFileSync(path.join(root, "src", "client", "logic", name), "utf8")).join("\n");
  return [
    'import Chart from "chart.js/auto";',
    "window.Chart = Chart;",
    logic,
    "window.showPage = showPage; window.showAuth = showAuth;"
  ].join("\n");
}

module.exports = defineConfig({
  plugins: [
    {
      name: "arsy-assemble",
      transformIndexHtml(html) {
        return html.replace("<!-- VIEWS -->", () => viewsHtml());
      },
      resolveId(id) {
        if (id === "virtual:arsy-app") return "\0arsy-app";
      },
      load(id) {
        if (id === "\0arsy-app") return appModule();
      }
    }
  ],
  build: {
    sourcemap: false,
    minify: "esbuild",
    emptyOutDir: true,
    modulePreload: false
  },
  esbuild: {
    drop: ["console", "debugger"]
  }
});
