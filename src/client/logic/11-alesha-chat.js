
const ALESHA_PROMPTS = [
  { label: "📊 Rekap Data Master ARSY", prompt: "Berapa jumlah pengguna, peran, jabatan, provinsi, kota, dan menu di ARSY?" },
  { label: "🎖️ Daftar Peran dan Jabatan", prompt: "Sebutkan daftar peran dan jabatan yang ada di ARSY." },
  { label: "🗺️ Wilayah Sesuai Cakupan", prompt: "Tampilkan daftar provinsi dan kota sesuai cakupan wilayah saya." },
  { label: "🔐 Menu Hak Akses Peran", prompt: "Menu apa saja yang boleh dibuka peran saya?" }
];
const aleshaUi = {
  busy: false,
  sessions: [],
  activeId: "",
  files: [],
  voice: null,
  recording: false,
  recordSec: 0,
  recorder: null,
  chunks: [],
  timer: null,
  notice: "",
  copiedId: "",
  charts: [],
  chartBank: [],
  chartModes: {},
  mermaidBank: []
};

function aleshaKey() {
  return "arsy_alesha_chats_" + ((session && session.id) || "guest");
}

function aleshaScope() {
  if (!session) return { role: "Tamu", scope: "Belum masuk", pill: "Tamu" };
  const level = roleLevel(session);
  if (level === "nasional") return { role: session.role || "Admin", scope: "Nasional", pill: "Nasional" };
  if (level === "provinsi") {
    const name = session.provinsi || session.jabatan || "Polda";
    return { role: session.role || "Eksekutif", scope: "PROVINSI " + name, pill: "Provinsi" };
  }
  const city = session.kota || "Kota";
  return { role: session.role || "Operator", scope: "KAB/KOTA " + city, pill: "Kota" };
}

function loadAleshaStore() {
  try {
    aleshaUi.sessions = JSON.parse(localStorage.getItem(aleshaKey()) || "[]");
  } catch (error) {
    aleshaUi.sessions = [];
  }
  if (!Array.isArray(aleshaUi.sessions)) aleshaUi.sessions = [];
  const saved = localStorage.getItem("arsy_alesha_session_id");
  const matched = saved && aleshaUi.sessions.find((item) => item.id === saved || item.aleshaSessionId === saved);
  if (!aleshaUi.activeId) aleshaUi.activeId = matched ? matched.id : (aleshaUi.sessions[0] ? aleshaUi.sessions[0].id : "");
}

function saveAleshaStore() {
  localStorage.setItem(aleshaKey(), JSON.stringify(aleshaUi.sessions));
  const active = aleshaUi.sessions.find((item) => item.id === aleshaUi.activeId);
  if (active) localStorage.setItem("arsy_alesha_session_id", active.aleshaSessionId || active.id);
}

function activeAleshaSession() {
  return aleshaUi.sessions.find((item) => item.id === aleshaUi.activeId) || null;
}

function syncAleshaVisibility(visible) {
  const root = document.getElementById("aleshaRoot");
  if (!root) return;
  root.hidden = !visible;
  if (!visible) {
    setAleshaMenu(false);
    setAleshaChat(false);
    setAleshaKiosk(false);
  }
}

function setAleshaMenu(open) {
  document.getElementById("aiMenu").hidden = !open;
  document.getElementById("aiMenuBackdrop").hidden = !open;
  document.getElementById("aleshaRoot").classList.toggle("is-open", open);
  document.getElementById("aiToggle").setAttribute("aria-expanded", open ? "true" : "false");
  document.getElementById("aiToggleIcon").className = open ? "fa-solid fa-xmark text-xl" : "fa-solid fa-comment-dots text-xl";
}

function paintAleshaIdentity() {
  const info = aleshaScope();
  document.getElementById("aiRoleName").textContent = info.role;
  document.getElementById("aiScopeName").textContent = info.scope;
  document.getElementById("aiScopePill").textContent = "ARSY " + info.pill;
  document.getElementById("aiWilayah").textContent = info.scope;
}

function renderAleshaSessions() {
  const query = document.getElementById("aiSessionSearch").value.trim().toLowerCase();
  const list = [...aleshaUi.sessions].sort((a, b) => new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0));
  const shown = query ? list.filter((item) => String(item.title || "").toLowerCase().includes(query)) : list;
  const host = document.getElementById("aiSessionList");
  if (!shown.length) {
    host.innerHTML = `<div class="p-8 text-center text-xs text-slate-400"><i class="fa-regular fa-comment-dots mb-2 text-2xl text-slate-300"></i><p class="font-semibold text-slate-600">${query ? "Tidak Ditemukan" : "Belum Ada Riwayat"}</p><p class="mt-1">${query ? "Coba kata kunci pencarian lain." : "Mulai percakapan pertama Anda dengan Alesha."}</p></div>`;
  } else {
    host.innerHTML = shown.map((item) => {
      const on = item.id === aleshaUi.activeId;
      return `<div data-ai-session="${esc(item.id)}" class="group relative flex cursor-pointer items-center justify-between rounded-xl border px-3 py-2.5 text-xs ${on ? "border-blue-200 bg-blue-50/90 font-bold text-blue-950" : "border-transparent text-slate-700 hover:bg-slate-50"}"><span class="flex min-w-0 items-center gap-2"><i class="fa-solid fa-robot ${on ? "text-blue-600" : "text-slate-400"}"></i><span class="truncate">${esc(item.title || "Percakapan Baru")}</span></span><button type="button" data-ai-delete="${esc(item.id)}" class="rounded-md p-1 text-slate-400 opacity-0 hover:bg-red-50 hover:text-red-600 group-hover:opacity-100" title="Hapus Sesi"><i class="fa-solid fa-trash text-[11px]"></i></button></div>`;
    }).join("");
  }
  const clear = document.getElementById("aiClearChats");
  clear.hidden = !aleshaUi.sessions.length;
  clear.style.display = aleshaUi.sessions.length ? "flex" : "none";
}

const ALESHA_PALETTE = ["#2563eb", "#0d9488", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#ec4899", "#10b981"];

function aleshaSafeUrl(url) {
  const raw = String(url || "").trim().replace(/&amp;/g, "&");
  if (raw.startsWith("/static/")) return "https://alesha-be.djalu.co.id" + raw;
  if (/^https?:\/\//i.test(raw)) {
    return raw
      .replace(/^https?:\/\/alesha\.djalu\.co\.id\/static\//i, "https://alesha-be.djalu.co.id/static/")
      .replace(/^https?:\/\/(?:localhost|127\.0\.0\.1):8000/i, "https://alesha-be.djalu.co.id");
  }
  return "";
}

function aleshaLink(label, url) {
  const href = aleshaSafeUrl(url);
  if (!href) return label;
  const blob = (label + " " + href).toLowerCase();
  const file = /unduh|download|dokumen|berkas|laporan|export|ekspor|infografis|gambar|image|\/static\/exports|\.pdf|\.xlsx?|\.docx?|\.csv|\.pptx?|\.png|\.jpe?g|\.webp/.test(blob);
  if (!file) return `<a href="${esc(href)}" target="_blank" rel="noopener" class="font-semibold text-blue-700 underline">${label}</a>`;
  const kind = /docx?|\bword\b/.test(blob) ? "word" : /xlsx?|excel|spreadsheet/.test(blob) ? "excel" : /\bcsv\b/.test(blob) ? "csv" : /pptx?|powerpoint|presentasi/.test(blob) ? "pptx" : /\.pdf|pdf/.test(blob) ? "pdf" : /\.(png|jpe?g|webp|gif)|infografis|gambar|image/.test(blob) ? "image" : "file";
  const styles = {
    word: ["DOCX", "from-blue-600 to-indigo-700", "from-blue-50 via-indigo-50 to-slate-50", "border-blue-200", "bg-blue-600", "Unduh Word", "Dokumen Word Korlantas POLRI Siap Diunduh", "docx"],
    excel: ["XLSX", "from-emerald-600 to-teal-700", "from-emerald-50 via-teal-50 to-slate-50", "border-emerald-200", "bg-emerald-600", "Unduh Excel", "Spreadsheet Excel Korlantas POLRI Siap Diunduh", "xlsx"],
    csv: ["CSV", "from-teal-600 to-cyan-700", "from-teal-50 via-cyan-50 to-slate-50", "border-teal-200", "bg-teal-600", "Unduh CSV", "Format Data CSV Korlantas POLRI Siap Diunduh", "csv"],
    pdf: ["PDF", "from-red-600 to-rose-700", "from-red-50 via-rose-50 to-slate-50", "border-red-200", "bg-red-600", "Unduh PDF", "Dokumen Resmi Korlantas POLRI Siap Diunduh", "pdf"],
    pptx: ["PPTX", "from-orange-600 to-amber-700", "from-orange-50 via-amber-50 to-slate-50", "border-orange-200", "bg-orange-600", "Unduh PPT", "Paparan Presentasi Korlantas POLRI Siap Diunduh", "pptx"],
    image: ["IMG", "from-purple-600 via-indigo-600 to-blue-600", "from-purple-50 via-indigo-50 to-slate-50", "border-purple-200", "bg-purple-600", "Unduh Gambar", "Infografis & Visual Report Siap Ditampilkan & Diunduh", "png"],
    file: ["FILE", "from-slate-700 to-indigo-800", "from-slate-50 via-indigo-50 to-slate-50", "border-slate-200", "bg-slate-800", "Unduh Berkas", "Berkas Dokumen Korlantas POLRI Siap Diunduh", "pdf"]
  };
  const style = styles[kind];
  const title = label.replace(/^(?:unduh|download)\s+(?:dokumen|file|berkas)?\s*(?:word|docx?|excel|xlsx?|spreadsheet|csv|pdf|pptx?|powerpoint)?\s*[:\-–—]?\s*/i, "").trim() || label;
  const fileAttr = `data-ai-file="${encodeURIComponent(href)}" data-ai-ext="${style[7]}" data-ai-name="${encodeURIComponent(title)}"`;
  const picture = kind === "image" ? `<div class="group relative mt-2 overflow-hidden rounded-xl border border-purple-200 bg-slate-950"><img src="${esc(href)}" alt="" class="mx-auto max-h-[420px] w-full object-contain"><div class="absolute inset-0 flex items-center justify-center gap-2 bg-slate-950/40 opacity-0 group-hover:opacity-100"><button type="button" data-ai-image="${encodeURIComponent(href)}" data-ai-name="${encodeURIComponent(title)}" class="rounded-xl bg-purple-600 px-3.5 py-2 text-xs font-semibold text-white">Perbesar Infografis</button><button type="button" ${fileAttr} class="rounded-xl bg-slate-800 px-3.5 py-2 text-xs font-semibold text-white">Unduh PNG</button></div></div>` : "";
  return `<div class="my-2 space-y-1.5"><div class="my-2.5 flex flex-col items-start justify-between gap-3 rounded-2xl border ${style[3]} bg-gradient-to-r ${style[2]} p-3.5 sm:flex-row sm:items-center"><div class="flex items-center gap-3"><div class="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${style[1]} text-xs font-bold tracking-wider text-white">${style[0]}</div><div><div class="text-[13px] font-bold leading-snug text-slate-900">${title}</div><div class="mt-0.5 flex items-center gap-1.5 text-[11px] text-slate-500"><span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>${style[6]}</div></div></div><button type="button" ${fileAttr} class="inline-flex shrink-0 items-center gap-2 rounded-xl ${style[4]} px-3.5 py-2 text-xs font-semibold text-white">${style[5]}</button></div>${picture}</div>`;
}

async function aleshaSaveFile(url, name, ext) {
  const href = aleshaSafeUrl(decodeURIComponent(url)) || decodeURIComponent(url);
  let filename = decodeURIComponent(name || "berkas_arsy").replace(/&amp;/g, "dan").replace(/[^\w\s.-]/g, "").trim().replace(/\s+/g, "_") || "berkas_arsy";
  if (!/\.(png|jpe?g|pdf|webp|docx?|xlsx?|csv|pptx?)$/i.test(filename)) filename += "." + (ext || "pdf");
  try {
    const response = await fetch(href);
    if (!response.ok) throw new Error("berkas tidak terbaca");
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = filename;
    link.click();
    setTimeout(() => URL.revokeObjectURL(objectUrl), 1500);
  } catch (error) {
    window.open(href, "_blank", "noopener");
  }
}

function aleshaInline(text) {
  let value = esc(text);
  value = value.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, (all, alt, url) => {
    const href = aleshaSafeUrl(url);
    return href ? `<img src="${esc(href)}" alt="${alt}" class="my-2 max-h-72 w-full rounded-xl border border-slate-200 object-contain">` : alt;
  });
  value = value.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (all, label, url) => aleshaLink(label, url));
  value = value.replace(/`([^`]+)`/g, '<code class="rounded bg-slate-100 px-1 py-0.5 font-mono text-[11px] text-slate-800">$1</code>');
  value = value.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  return value;
}

function aleshaChartSpec(body) {
  const start = body.indexOf("{");
  const end = body.lastIndexOf("}");
  if (start < 0 || end <= start) return null;
  try {
    const data = JSON.parse(body.slice(start, end + 1));
    if (!data || (!Array.isArray(data.data) && !Array.isArray(data.items))) return null;
    return data;
  } catch (error) {
    return null;
  }
}

function aleshaRows(spec) {
  return ((spec && (spec.data || spec.items)) || []).map((row, index) => ({
    name: String(row.name || row.label || row.kategori || "Data"),
    value: Number(row.value) || 0,
    secondary: Number(row.secondary_value || row.target) || 0,
    color: row.color || ALESHA_PALETTE[index % ALESHA_PALETTE.length]
  }));
}

function aleshaChartKind(spec) {
  const raw = String((spec && (spec.type || spec.chart_type)) || "bar").toLowerCase();
  if (raw === "pie" || raw === "donut") return "pie";
  if (raw === "combo" || raw === "bar_line" || raw === "line_bar") return "combo";
  if (raw === "dual_line" || raw === "dual-line" || raw === "compare") return "dual-line";
  if (raw === "line" || raw === "area" || raw === "tren") return "line";
  return "bar";
}

function aleshaNum(value) {
  return Number(value || 0).toLocaleString("id-ID");
}

function aleshaLinePath(points) {
  if (!points.length) return "";
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;
  let path = `M ${points[0].x} ${points[0].y}`;
  for (let index = 0; index < points.length - 1; index += 1) {
    const previous = points[Math.max(0, index - 1)];
    const current = points[index];
    const next = points[index + 1];
    const after = points[Math.min(points.length - 1, index + 2)];
    const c1x = current.x + (next.x - previous.x) / 6;
    const c1y = current.y + (next.y - previous.y) / 6;
    const c2x = next.x - (after.x - current.x) / 6;
    const c2y = next.y - (after.y - current.y) / 6;
    path += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${next.x.toFixed(1)} ${next.y.toFixed(1)}`;
  }
  return path;
}

function aleshaChartPlot(spec, mode) {
  const rows = aleshaRows(spec);
  if (!rows.length) return `<div class="py-8 text-center text-xs text-slate-400">Tidak ada data untuk ditampilkan.</div>`;
  const total = rows.reduce((sum, row) => sum + row.value, 0);
  const max = Math.max(...rows.map((row) => Math.max(row.value, row.secondary)), 1);
  if (mode === "pie") {
    let angle = -Math.PI / 2;
    const slices = rows.map((row) => {
      const sweep = total > 0 ? (row.value / total) * Math.PI * 2 : 0;
      const end = angle + sweep;
      const large = sweep > Math.PI ? 1 : 0;
      const x1 = 110 + 78 * Math.cos(angle);
      const y1 = 110 + 78 * Math.sin(angle);
      const x2 = 110 + 78 * Math.cos(end);
      const y2 = 110 + 78 * Math.sin(end);
      angle = end;
      return `<path d="M 110 110 L ${x1.toFixed(1)} ${y1.toFixed(1)} A 78 78 0 ${large} 1 ${x2.toFixed(1)} ${y2.toFixed(1)} Z" fill="${row.color}"></path>`;
    }).join("");
    const legend = rows.map((row) => `<li class="flex items-center justify-between gap-3"><span class="flex min-w-0 items-center gap-1.5"><span class="h-2 w-2 shrink-0 rounded-full" style="background:${row.color}"></span><span class="truncate">${esc(row.name)}</span></span><span class="font-bold">${aleshaNum(row.value)}</span></li>`).join("");
    return `<div class="flex flex-wrap items-center justify-center gap-4"><svg viewBox="0 0 220 220" class="h-52 w-52">${slices}<circle cx="110" cy="110" r="42" fill="#ffffff"></circle></svg><ul class="min-w-[10rem] space-y-1 text-[11px] text-slate-700">${legend}</ul></div>`;
  }
  if (mode === "line" || mode === "dual-line" || mode === "combo") {
    const width = 640;
    const height = 240;
    const left = 36;
    const right = 16;
    const top = 16;
    const bottom = 28;
    const innerW = width - left - right;
    const innerH = height - top - bottom;
    const point = (value, index) => ({
      x: rows.length > 1 ? left + (index / (rows.length - 1)) * innerW : width / 2,
      y: top + innerH - (value / max) * innerH
    });
    const primary = rows.map((row, index) => point(row.value, index));
    const secondary = rows.map((row, index) => point(row.secondary, index));
    const labels = rows.map((row, index) => `<text x="${primary[index].x}" y="${height - 8}" text-anchor="middle" font-size="10" fill="#475569">${esc(row.name).slice(0, 16)}</text>`).join("");
    const bars = mode === "combo" ? rows.map((row, index) => {
      const barWidth = Math.min(36, innerW / rows.length * 0.45);
      const barHeight = (row.value / max) * innerH;
      return `<rect x="${primary[index].x - barWidth / 2}" y="${top + innerH - barHeight}" width="${barWidth}" height="${barHeight}" rx="6" fill="${row.color}"></rect>`;
    }).join("") : "";
    const second = mode === "line" ? "" : `<path d="${aleshaLinePath(secondary)}" fill="none" stroke="#f59e0b" stroke-width="2.5"></path>`;
    return `<svg viewBox="0 0 ${width} ${height}" class="h-56 w-full">${bars}<path d="${aleshaLinePath(primary)}" fill="none" stroke="#2563eb" stroke-width="2.5"></path>${second}${primary.map((item, index) => `<circle cx="${item.x}" cy="${item.y}" r="3.5" fill="${rows[index].color}"></circle>`).join("")}${labels}</svg>`;
  }
  const columns = rows.map((row, index) => {
    const share = total > 0 ? Math.round((row.value / total) * 100) : 0;
    const height = Math.max(row.value > 0 ? 10 : 3, Math.round((row.value / max) * 100));
    const previous = index > 0 ? rows[index - 1].value : row.value;
    const delta = previous ? Math.round(((row.value - previous) / previous) * 100) : 0;
    const badge = index === 0 ? "" : `<span class="mb-0.5 rounded-full border px-1.5 text-[9px] font-black ${delta >= 0 ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-rose-200 bg-rose-50 text-rose-700"}">${delta >= 0 ? "▲" : "▼"} ${Math.abs(delta)}%</span>`;
    return `<div class="flex h-full min-w-0 flex-1 flex-col items-center justify-end" style="max-width:${rows.length <= 4 ? "96px" : "64px"}"><div class="mb-1.5 flex flex-col items-center">${badge}<span class="rounded-md border border-slate-300 bg-white px-2 py-0.5 text-[11px] font-black text-slate-900">${aleshaNum(row.value)}</span><span class="text-[10px] font-bold text-slate-500">${share}%</span></div><div class="flex w-full items-end justify-center" style="height:70%"><div class="w-full max-w-[48px] rounded-t-xl" style="height:${height}%;background:linear-gradient(180deg, ${row.color} 0%, ${row.color}d9 100%)"></div></div><p class="mt-2 line-clamp-2 text-center text-[11px] font-semibold text-slate-700" title="${esc(row.name)}">${esc(row.name)}</p></div>`;
  }).join("");
  return `<div class="space-y-3"><div class="flex items-center justify-between border-b border-slate-200/70 px-1 pb-2 text-xs"><span class="font-medium text-slate-600">Total Data: <strong class="text-slate-900">${aleshaNum(total)}</strong></span><span class="text-[11px] text-slate-500">${rows.length} Kategori Analisis</span></div><div class="flex h-56 items-end justify-around gap-2 rounded-xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white px-3 pb-2 pt-3">${columns}</div></div>`;
}

function aleshaChartCard(index, spec) {
  const mode = aleshaUi.chartModes[index] || aleshaChartKind(spec);
  const modes = [
    ["bar", "Batang"],
    ["line", "Garis"],
    ["combo", "Batang+Line"],
    ["dual-line", "Line+Line"],
    ["pie", "Pie"]
  ];
  const buttons = modes.map(([key, label]) => {
    const on = key === mode;
    return `<button type="button" data-ai-mode="${key}" data-ai-chart-index="${index}" class="rounded-md px-2 py-1 text-[11px] font-semibold ${on ? "bg-blue-600 text-white" : "text-slate-300 hover:bg-white/10 hover:text-white"}">${label}</button>`;
  }).join("");
  return `<section data-ai-chart-card="${index}" class="my-3 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div class="flex flex-wrap items-center justify-between gap-2 bg-gradient-to-r from-slate-900 via-[#0a1d37] to-[#132c4f] px-4 py-3 text-white"><div class="min-w-0"><h4 class="truncate text-xs font-bold">${esc(spec.title || "Grafik data ARSY")}</h4><p class="truncate text-[10px] text-slate-300">${esc(spec.subtitle || "Visualisasi data master ARSY")}</p></div><div data-export-hide="true" class="ai-export-hide flex flex-wrap items-center gap-2"><div class="flex flex-wrap gap-0.5 rounded-lg border border-slate-700 bg-slate-800/90 p-0.5">${buttons}</div><button type="button" data-ai-chart-png="${index}" class="rounded-lg border border-white/10 bg-white/10 px-2.5 py-1 text-[11px] font-semibold">Unduh PNG</button><button type="button" data-ai-zoom="${index}" class="rounded-lg border border-white/10 bg-white/10 px-2 py-1 text-[11px] font-semibold">Perbesar</button></div></div><div class="bg-slate-50/50 p-4" data-ai-plot="${index}"></div></section>`;
}

function aleshaFlow(code) {
  const labels = {};
  const nodeRe = /([A-Za-z][\w]*)\s*(?:\(\[\s*"?([^"\]\n]+)"?\s*\]\)|\[\s*"?([^"\]\n]+)"?\s*\]|\{\s*"?([^"\}\n]+)"?\s*\}|\(\s*"?([^"\)\n]+)"?\s*\))/g;
  let match = nodeRe.exec(code);
  while (match) {
    labels[match[1]] = String(match[2] || match[3] || match[4] || match[5] || match[1]).replace(/<[^>]+>/g, "").trim();
    match = nodeRe.exec(code);
  }
  const edges = [];
  const edgeRe = /([A-Za-z][\w]*)\s*-->\s*(?:\|([^|]+)\|\s*)?([A-Za-z][\w]*)/g;
  match = edgeRe.exec(code);
  while (match) {
    edges.push({ from: match[1], to: match[3], label: (match[2] || "").trim() });
    if (!labels[match[1]]) labels[match[1]] = match[1];
    if (!labels[match[3]]) labels[match[3]] = match[3];
    match = edgeRe.exec(code);
  }
  const order = [];
  Object.keys(labels).forEach((id) => { if (!order.includes(id)) order.push(id); });
  edges.forEach((edge) => { if (!order.includes(edge.to)) order.push(edge.to); });
  return { labels, edges, order };
}

function aleshaDiagramCard(index, code) {
  const flow = aleshaFlow(code);
  const steps = flow.order.map((id, step) => `<div class="flex items-start gap-3"><span class="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-cyan-400/40 bg-blue-600 text-[11px] font-bold text-white">${step + 1}</span><div class="min-w-0 flex-1 rounded-xl border border-blue-900/60 bg-slate-900 px-3 py-2 text-xs text-slate-100">${esc(flow.labels[id] || id)}</div></div>${step < flow.order.length - 1 ? `<div class="ml-3 h-4 border-l border-dashed border-cyan-400/50"></div>` : ""}`).join("");
  const incoming = {};
  flow.edges.forEach((edge) => { incoming[edge.to] = true; });
  const children = {};
  flow.edges.forEach((edge) => { children[edge.from] = children[edge.from] || []; children[edge.from].push(edge); });
  const roots = flow.order.filter((id) => !incoming[id]);
  const drawTree = (id, depth, seen) => {
    if (depth > 8 || seen[id]) return "";
    const next = Object.assign({}, seen);
    next[id] = true;
    return `<div style="padding-left:${Math.min(depth, 6) * 16}px"><div class="my-1 inline-flex rounded-lg border border-emerald-400/40 bg-slate-900 px-3 py-1.5 text-xs text-emerald-100">${esc(flow.labels[id] || id)}</div>${(children[id] || []).map((edge) => `${edge.label ? `<span class="ml-2 text-[10px] text-cyan-300">${esc(edge.label)}</span>` : ""}${drawTree(edge.to, depth + 1, next)}`).join("")}</div>`;
  };
  const tree = (roots.length ? roots : flow.order.slice(0, 1)).map((id) => drawTree(id, 0, {})).join("") || `<p class="text-xs text-slate-400">Bagan mengikuti diagram.</p>`;
  const modes = [["tree", "Bagan Pohon"], ["snake", "Visual Alur"], ["mermaid", "Diagram SVG"]];
  const buttons = modes.map(([key, label]) => `<button type="button" data-ai-diagram-mode="${key}" data-ai-diagram-index="${index}" class="rounded-md px-2.5 py-1 text-[11px] font-semibold ${key === "mermaid" ? "bg-blue-600 text-white" : "text-slate-400"}">${label}</button>`).join("");
  return `<section data-ai-diagram="${index}" data-zoom="1" class="my-4 w-full overflow-hidden rounded-2xl border border-blue-900/60 bg-slate-950 shadow-xl"><div class="flex flex-wrap items-center justify-between gap-2 border-b border-blue-900/50 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 px-4 py-3"><div class="min-w-0"><span class="rounded-full border border-blue-400/30 bg-blue-500/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-cyan-300">Diagram Alur</span><h4 class="mt-0.5 truncate text-xs font-semibold text-slate-100">Diagram Data Master ARSY</h4></div><div data-export-hide="true" class="ai-export-hide ml-auto flex flex-wrap items-center gap-1.5"><div class="flex items-center rounded-lg border border-blue-900/60 bg-slate-900 p-0.5">${buttons}<button type="button" data-ai-diagram-mode="code" data-ai-diagram-index="${index}" class="rounded-md px-2 py-1 text-[11px] text-slate-400">Kode</button></div><div class="flex items-center rounded-lg border border-slate-700 bg-slate-800 p-0.5 text-slate-300"><button type="button" data-ai-diagram-zoom="out" class="px-1.5 py-1 text-xs">−</button><button type="button" data-ai-diagram-zoom="reset" data-ai-zoom-label class="px-1.5 text-[10px] font-mono">100%</button><button type="button" data-ai-diagram-zoom="in" class="px-1.5 py-1 text-xs">+</button></div><button type="button" data-ai-diagram-png="${index}" class="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-2.5 py-1.5 text-[11px] font-medium text-white">Unduh PNG</button><button type="button" data-ai-diagram-full="${index}" class="rounded-lg border border-slate-700 bg-slate-800 px-2 py-1.5 text-[11px] text-slate-200">Layar Penuh</button></div></div><div class="overflow-auto border-t border-slate-800 bg-[#090d16] p-4" style="background-image:radial-gradient(rgba(59,130,246,0.15) 1px, transparent 1px);background-size:24px 24px"><div data-ai-diagram-canvas class="origin-top transition-transform"><div data-ai-diagram-view="tree" hidden class="space-y-1">${tree}</div><div data-ai-diagram-view="snake" hidden class="mx-auto flex max-w-xl flex-col">${steps || `<p class="text-xs text-slate-400">Alur tidak terbaca.</p>`}</div><div data-ai-diagram-view="mermaid" class="overflow-x-auto" data-ai-mermaid="${index}"></div><pre data-ai-diagram-view="code" hidden class="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900 p-3 text-[11px] leading-relaxed text-cyan-300"><code>${esc(code)}</code></pre></div></div></section>`;
}

function aleshaCode(lang, body) {
  if (lang.startsWith("chart") || body.includes('"data"')) {
    const spec = aleshaChartSpec(body);
    if (spec) {
      const index = aleshaUi.chartBank.length;
      aleshaUi.chartBank.push(spec);
      return aleshaChartCard(index, spec);
    }
  }
  if (lang === "mermaid" || lang === "flowchart" || lang === "diagram" || /^\s*(graph|flowchart)\s/i.test(body)) {
    const index = aleshaUi.mermaidBank.length;
    aleshaUi.mermaidBank.push(body.trim());
    return aleshaDiagramCard(index, body.trim());
  }
  return `<pre class="my-2 overflow-x-auto rounded-xl bg-slate-900 p-3 text-[11px] leading-relaxed text-slate-100"><code>${esc(body)}</code></pre>`;
}

function aleshaTable(rows) {
  const parsed = rows.map((row) => row.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((cell) => cell.trim())).filter((cells) => !cells.every((cell) => /^:?-+:?$/.test(cell)));
  if (!parsed.length) return "";
  const head = parsed[0].map((cell) => `<th class="px-3 py-2 text-left text-[11px] font-bold">${aleshaInline(cell)}</th>`).join("");
  const body = parsed.slice(1).map((cells) => `<tr class="border-t border-slate-100">${cells.map((cell) => `<td class="px-3 py-2 align-top">${aleshaInline(cell)}</td>`).join("")}</tr>`).join("");
  return `<div class="my-3 overflow-x-auto rounded-xl border border-slate-200"><table class="w-full border-collapse text-xs"><thead class="bg-[#0a1d37] text-white"><tr>${head}</tr></thead><tbody class="bg-white text-slate-700">${body}</tbody></table></div>`;
}

function aleshaBlocks(raw) {
  const lines = String(raw || "").replace(/\r\n/g, "\n").split("\n");
  const html = [];
  let index = 0;
  while (index < lines.length) {
    const line = lines[index];
    if (line.trim().startsWith("```")) {
      const lang = line.trim().slice(3).trim().toLowerCase();
      const body = [];
      index += 1;
      while (index < lines.length && !lines[index].trim().startsWith("```")) {
        body.push(lines[index]);
        index += 1;
      }
      if (index < lines.length) index += 1;
      html.push(aleshaCode(lang, body.join("\n")));
      continue;
    }
    if (line.trim().startsWith("|")) {
      const rows = [];
      while (index < lines.length && lines[index].trim().startsWith("|")) {
        rows.push(lines[index]);
        index += 1;
      }
      html.push(aleshaTable(rows));
      continue;
    }
    if (/^#{1,3}\s+/.test(line.trim())) {
      html.push(`<h3 class="mt-3 text-sm font-bold text-slate-900">${aleshaInline(line.trim().replace(/^#{1,3}\s+/, ""))}</h3>`);
      index += 1;
      continue;
    }
    if (/^[-*•]\s+/.test(line.trim())) {
      const items = [];
      while (index < lines.length && /^[-*•]\s+/.test(lines[index].trim())) {
        items.push(`<li>${aleshaInline(lines[index].trim().replace(/^[-*•]\s+/, ""))}</li>`);
        index += 1;
      }
      html.push(`<ul class="my-2 list-disc space-y-1 pl-4">${items.join("")}</ul>`);
      continue;
    }
    if (/^\d+\.\s+/.test(line.trim())) {
      const items = [];
      while (index < lines.length && /^\d+\.\s+/.test(lines[index].trim())) {
        items.push(`<li>${aleshaInline(lines[index].trim().replace(/^\d+\.\s+/, ""))}</li>`);
        index += 1;
      }
      html.push(`<ol class="my-2 list-decimal space-y-1 pl-4">${items.join("")}</ol>`);
      continue;
    }
    if (!line.trim()) {
      index += 1;
      continue;
    }
    const para = [];
    while (index < lines.length && lines[index].trim() && !lines[index].trim().startsWith("```") && !lines[index].trim().startsWith("|") && !/^#{1,3}\s+/.test(lines[index].trim()) && !/^[-*•]\s+/.test(lines[index].trim()) && !/^\d+\.\s+/.test(lines[index].trim())) {
      para.push(lines[index].trim());
      index += 1;
    }
    html.push(`<p class="my-1.5 leading-relaxed">${aleshaInline(para.join(" "))}</p>`);
  }
  return html.join("");
}

function aleshaActions(raw) {
  const actions = [];
  const clean = String(raw || "").replace(/\[action:([^\]]+)\]/gi, (all, tag) => {
    const pipe = tag.indexOf("|");
    const label = (pipe === -1 ? tag : tag.slice(0, pipe)).trim();
    const prompt = (pipe === -1 ? label : tag.slice(pipe + 1)).trim();
    if (label) actions.push({ label, prompt });
    return "";
  }).replace(/^.*(?:Langkah Selanjutnya|Saran lanjutan).*$/gim, "");
  return { clean, actions };
}

function aleshaBrand(text) {
  return String(text || "")
    .replace(/smart\s*city/gi, "Algoritma Road Safety")
    .replace(/SM-Connect/gi, "ARSY")
    .replace(/SM-Lite/gi, "ARSY")
    .replace(/\bSM\b/g, "ARSY");
}

function aleshaSourceOf(message) {
  const source = message.source && message.source.name ? message.source : {
    name: "Basis Data Master ARSY",
    detail: "Dibaca dari data master ARSY sesuai cakupan akun yang masuk."
  };
  const name = aleshaBrand(source.name).replace(/\(\s*ARSY\s*\)/g, "").replace(/\s{2,}/g, " ").trim();
  return {
    name: name || "Basis Data Master ARSY",
    detail: aleshaBrand(source.detail || ""),
    badge: source.badge
  };
}

function renderAleshaAnswer(item) {
  const parsed = aleshaActions(item.content);
  const source = aleshaSourceOf(item);
  const chips = parsed.actions.length ? `<div class="mt-3 border-t border-slate-200 pt-2.5"><p class="mb-2 flex items-center gap-1.5 text-[11px] font-bold text-slate-500"><i class="fa-solid fa-sparkles text-amber-500"></i> Langkah Selanjutnya &amp; Saran Analisis</p><div class="flex flex-wrap gap-2">${parsed.actions.map((action) => `<button type="button" data-ai-follow="${encodeURIComponent(action.prompt)}" class="inline-flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-800 hover:bg-blue-100"><i class="fa-solid fa-sparkles text-[11px] text-blue-600"></i>${esc(action.label)}</button>`).join("")}</div></div>` : "";
  const copied = aleshaUi.copiedId === item.id;
  return `${aleshaBlocks(parsed.clean)}${chips}<div class="ai-export-hide mt-2.5 space-y-1.5 border-t border-slate-200 pt-2"><div class="flex flex-wrap items-center justify-between gap-2"><div class="flex flex-wrap items-center gap-1.5 text-[11px]"><span class="font-medium text-slate-500"><i class="fa-solid fa-database mr-1 text-blue-600"></i>Sumber Data:</span><span class="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-900"><span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>${esc(source.name)}</span></div><div class="flex flex-wrap items-center gap-1.5"><button type="button" data-ai-preview="${esc(item.id)}" class="rounded-lg bg-indigo-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-indigo-500">Preview &amp; Download Laporan</button><button type="button" data-ai-pdf="${esc(item.id)}" class="rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1 text-[11px] font-semibold text-rose-800 hover:bg-rose-100">Unduh PDF</button><button type="button" data-ai-png="${esc(item.id)}" class="rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-800 hover:bg-blue-100">Unduh PNG</button><button type="button" data-ai-copy="${esc(item.id)}" class="rounded-md px-2 py-1 text-[11px] font-medium text-slate-600 hover:bg-slate-200">${copied ? "Disalin" : "Salin"}</button></div></div><p class="flex items-start gap-1 text-[10px] leading-relaxed text-slate-500"><i class="fa-solid fa-shield-halved mt-0.5 text-emerald-600"></i><span>${esc(source.detail || source.badge || "")}</span></p></div>`;
}

function paintAleshaCharts(root) {
  const scope = root || document;
  const cards = scope.matches && scope.matches("[data-ai-chart-card]") ? [scope] : [...scope.querySelectorAll("[data-ai-chart-card]")];
  cards.forEach((card) => {
    const index = Number(card.dataset.aiChartCard);
    const spec = aleshaUi.chartBank[index];
    if (!spec) return;
    const mode = aleshaUi.chartModes[index] || aleshaChartKind(spec);
    card.querySelectorAll("[data-ai-mode]").forEach((button) => {
      const on = button.dataset.aiMode === mode;
      button.className = `rounded-md px-2 py-1 text-[11px] font-semibold ${on ? "bg-blue-600 text-white" : "text-slate-300 hover:bg-white/10 hover:text-white"}`;
    });
    const plot = card.querySelector("[data-ai-plot]");
    if (plot) plot.innerHTML = aleshaChartPlot(spec, mode);
  });
}

function aleshaDiagramApply(card, mode) {
  if (!card) return;
  card.querySelectorAll("[data-ai-diagram-view]").forEach((node) => {
    node.hidden = node.dataset.aiDiagramView !== mode;
  });
  card.querySelectorAll("[data-ai-diagram-mode]").forEach((button) => {
    const on = button.dataset.aiDiagramMode === mode;
    button.className = `rounded-md px-2.5 py-1 text-[11px] font-semibold ${on ? "bg-blue-600 text-white" : "text-slate-400"}`;
  });
  if (mode === "mermaid") hydrateAleshaVisuals(card);
}

function aleshaDiagramZoom(card, direction) {
  const current = Number(card.dataset.zoom || "1");
  const next = direction === "reset" ? 1 : Math.min(1.8, Math.max(0.6, Math.round((current + (direction === "in" ? 0.15 : -0.15)) * 100) / 100));
  card.dataset.zoom = String(next);
  const canvas = card.querySelector("[data-ai-diagram-canvas]");
  if (canvas) canvas.style.transform = "scale(" + next + ")";
  const label = card.querySelector("[data-ai-zoom-label]");
  if (label) label.textContent = Math.round(next * 100) + "%";
}

function hydrateAleshaVisuals(root) {
  const scope = root || document.getElementById("aiFeed");
  if (!scope) return;
  paintAleshaCharts(scope);
  const diagrams = [...scope.querySelectorAll("[data-ai-mermaid]")];
  if (!diagrams.length) return;
  import("mermaid").then((mod) => {
    const mermaid = mod.default || mod;
    mermaid.initialize({
      startOnLoad: false,
      securityLevel: "strict",
      theme: "base",
      fontFamily: "Inter, system-ui, sans-serif",
      flowchart: { useMaxWidth: true, htmlLabels: true, curve: "basis", nodeSpacing: 45, rankSpacing: 45 },
      themeVariables: {
        background: "#090d16",
        mainBkg: "#0f172a",
        nodeBorder: "#38bdf8",
        primaryColor: "#1e3a8a",
        primaryTextColor: "#f8fafc",
        primaryBorderColor: "#38bdf8",
        lineColor: "#60a5fa",
        textColor: "#f8fafc"
      }
    });
    diagrams.forEach((node, index) => {
      const code = aleshaUi.mermaidBank[Number(node.dataset.aiMermaid)];
      mermaid.render("aiMermaid" + Date.now() + index, code).then((drawn) => {
        node.innerHTML = drawn.svg;
      }).catch(() => {
        node.innerHTML = `<pre class="overflow-x-auto text-[11px] text-slate-700">${esc(code)}</pre>`;
      });
    });
  }).catch(() => {
    diagrams.forEach((node) => {
      const code = aleshaUi.mermaidBank[Number(node.dataset.aiMermaid)] || "";
      node.innerHTML = `<pre class="overflow-x-auto text-[11px] text-slate-700">${esc(code)}</pre>`;
    });
  });
}

function ensureAleshaModal() {
  let modal = document.getElementById("aiRichModal");
  if (modal) return modal;
  modal = document.createElement("div");
  modal.id = "aiRichModal";
  modal.className = "fixed inset-0 z-[10000] hidden items-center justify-center bg-slate-950/75 p-3 sm:p-6";
  modal.innerHTML = `<div class="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"><div class="flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-3"><div><h3 id="aiRichTitle" class="text-sm font-bold text-slate-900">Preview Laporan Data Master ARSY</h3><p class="text-[11px] text-slate-500">Korlantas POLRI • ARSY • Alesha</p></div><div class="flex items-center gap-1.5"><button type="button" id="aiRichPdf" class="rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-bold text-white">Unduh PDF</button><button type="button" id="aiRichPng" class="rounded-xl bg-blue-600 px-3 py-2 text-xs font-bold text-white">Unduh PNG HD</button><button type="button" id="aiRichClose" class="rounded-xl px-2 py-2 text-slate-400 hover:bg-slate-100">Tutup</button></div></div><div id="aiRichBody" class="min-h-0 flex-1 overflow-auto bg-white p-4 text-xs leading-relaxed text-slate-800"></div></div>`;
  document.body.appendChild(modal);
  modal.addEventListener("click", (event) => {
    if (aleshaVisualClick(event)) return;
    const mode = event.target.closest("[data-ai-mode]");
    if (mode) {
      aleshaUi.chartModes[mode.dataset.aiChartIndex] = mode.dataset.aiMode;
      paintAleshaCharts(mode.closest("[data-ai-chart-card]") || modal);
      return;
    }
    const diagramMode = event.target.closest("[data-ai-diagram-mode]");
    if (diagramMode) {
      aleshaDiagramApply(diagramMode.closest("[data-ai-diagram]"), diagramMode.dataset.aiDiagramMode);
      return;
    }
    const diagramZoom = event.target.closest("[data-ai-diagram-zoom]");
    if (diagramZoom) {
      aleshaDiagramZoom(diagramZoom.closest("[data-ai-diagram]"), diagramZoom.dataset.aiDiagramZoom);
      return;
    }
    const sheet = document.getElementById("aiDocSheet") || document.getElementById("aiRichBody");
    if (event.target.id === "aiRichPdf") exportAleshaPdf(sheet);
    if (event.target.id === "aiRichPng") exportAleshaPng(sheet);
    if (event.target === modal || event.target.id === "aiRichClose") {
      modal.classList.add("hidden");
      modal.classList.remove("flex");
    }
  });
  return modal;
}

async function aleshaRaster(node, background) {
  const width = 1180;
  const offscreen = document.createElement("div");
  offscreen.style.cssText = "position:fixed;left:-99999px;top:0;z-index:-1;background:" + background + ";width:" + width + "px";
  const clone = node.cloneNode(true);
  clone.querySelectorAll('[data-export-hide="true"], .ai-export-hide, button').forEach((item) => item.remove());
  clone.style.width = "100%";
  clone.style.maxHeight = "none";
  clone.style.overflow = "visible";
  clone.style.background = background;
  offscreen.appendChild(clone);
  document.body.appendChild(offscreen);
  await new Promise((resolve) => setTimeout(resolve, 150));
  const height = Math.max(offscreen.scrollHeight, clone.scrollHeight, 400);
  try {
    try {
      const { toCanvas } = await import("html-to-image");
      return await toCanvas(clone, { pixelRatio: 2, backgroundColor: background, width, height, skipFonts: true });
    } catch (error) {
      const mod = await import("html2canvas");
      const html2canvas = mod.default || mod;
      return html2canvas(clone, { backgroundColor: background, scale: 2, width, height });
    }
  } finally {
    offscreen.remove();
  }
}

async function exportAleshaPng(node, background) {
  const canvas = await aleshaRaster(node, background || "#ffffff");
  const link = document.createElement("a");
  link.href = canvas.toDataURL("image/png");
  link.download = "laporan_arsy_" + Date.now() + ".png";
  link.click();
}

async function exportAleshaPdf(node) {
  const canvas = await aleshaRaster(node, "#ffffff");
  const { jsPDF } = await import("jspdf");
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4", compress: true });
  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 8;
  const contentWidth = pageWidth - margin * 2;
  const contentHeight = pageHeight - margin * 2;
  const pxPerMm = canvas.width / contentWidth;
  const sliceHeight = Math.floor(contentHeight * pxPerMm);
  let offset = 0;
  let page = 0;
  while (offset < canvas.height) {
    const heightPx = Math.min(sliceHeight, canvas.height - offset);
    const slice = document.createElement("canvas");
    slice.width = canvas.width;
    slice.height = heightPx;
    const context = slice.getContext("2d");
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, slice.width, slice.height);
    context.drawImage(canvas, 0, offset, canvas.width, heightPx, 0, 0, canvas.width, heightPx);
    if (page > 0) pdf.addPage("a4", "portrait");
    pdf.addImage(slice.toDataURL("image/jpeg", 0.95), "JPEG", margin, margin, contentWidth, heightPx / pxPerMm, undefined, "FAST");
    offset += heightPx;
    page += 1;
  }
  pdf.save("laporan_arsy_" + Date.now() + ".pdf");
}

function renderAleshaFeed() {
  const feed = document.getElementById("aiFeed");
  aleshaUi.chartBank = [];
  aleshaUi.mermaidBank = [];
  const current = activeAleshaSession();
  const messages = current ? current.messages || [] : [];
  const info = aleshaScope();
  if (!messages.length && !aleshaUi.busy) {
    const cards = ALESHA_PROMPTS.map((item, index) => `<button type="button" data-ai-prompt="${index}" class="flex w-full min-w-0 items-center gap-3 rounded-xl border border-slate-200 p-3 text-left text-xs text-slate-700 shadow-sm hover:border-blue-300 hover:bg-blue-50/50"><span class="min-w-0 flex-1"><span class="block text-xs font-bold text-slate-900">${esc(item.label)}</span><span class="mt-0.5 block text-[11px] leading-relaxed text-slate-500">${esc(item.prompt)}</span></span><i class="fa-solid fa-chevron-right shrink-0 text-slate-400"></i></button>`).join("");
    feed.innerHTML = `<div class="mx-auto flex min-h-full w-full max-w-2xl flex-col items-center justify-center px-1 py-6 text-center"><span class="mb-3.5 grid h-16 w-16 place-items-center rounded-2xl border border-blue-200 bg-blue-50 text-blue-600"><i class="fa-solid fa-robot text-2xl"></i></span><h3 class="text-base font-bold text-slate-900">Selamat Datang, ${esc((session && session.name) || "Petugas")}</h3><p class="mt-1 max-w-md text-xs leading-relaxed text-slate-600">Alesha siap menyajikan data master ARSY: pengguna, peran, jabatan, provinsi, kota, dan hak akses menu wilayah <strong>${esc(info.scope)}</strong> dalam wewenang <strong>${esc(info.role)}</strong>.</p><div class="mt-6 w-full space-y-2 text-left"><p class="mb-2.5 text-center text-[11px] font-bold uppercase tracking-wider text-slate-400">Pilih Pertanyaan Cepat Berdasarkan Menu:</p>${cards}</div></div>`;
  } else {
    feed.innerHTML = messages.map((item) => {
      const mine = item.role === "user";
      if (mine) return `<article class="relative flex min-w-0 justify-end"><div class="max-w-[85%] whitespace-pre-wrap break-words rounded-2xl rounded-br-sm bg-[#0a1d37] px-4 py-3 text-xs leading-relaxed text-white shadow-sm">${esc(item.content)}</div></article>`;
      return `<article class="relative flex w-full min-w-0 justify-start"><div data-ai-bubble="${esc(item.id)}" class="w-full max-w-3xl break-words rounded-2xl rounded-bl-sm border border-slate-200 bg-slate-50 px-4 py-3 text-xs leading-relaxed text-slate-800 shadow-sm">${renderAleshaAnswer(item)}</div></article>`;
    }).join("") + (aleshaUi.busy ? `<div class="flex items-center gap-2 rounded-2xl rounded-tl-sm border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600"><span class="h-2 w-2 animate-bounce rounded-full bg-blue-600"></span><span class="h-2 w-2 animate-bounce rounded-full bg-blue-600 [animation-delay:0.2s]"></span><span class="h-2 w-2 animate-bounce rounded-full bg-blue-600 [animation-delay:0.4s]"></span><span class="ml-2 font-medium">Alesha sedang membaca database &amp; menyusun jawaban...</span></div>` : "");
  }
  const notice = document.getElementById("aiNotice");
  if (aleshaUi.notice) {
    notice.className = "mx-4 mt-3 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900";
    notice.innerHTML = `<i class="fa-solid fa-triangle-exclamation mt-0.5 text-amber-600"></i><div class="flex-1"><p class="font-bold text-amber-950">Pemberitahuan Sistem</p><p class="mt-0.5 leading-relaxed">${esc(aleshaUi.notice)}</p></div><button type="button" id="aiNoticeClose" class="rounded-md px-2 py-1 font-bold text-amber-700 hover:bg-amber-100">Tutup</button>`;
  } else {
    notice.className = "mx-4 mt-3 hidden";
    notice.innerHTML = "";
  }
  if (messages.length || aleshaUi.busy) feed.scrollTop = feed.scrollHeight;
  hydrateAleshaVisuals();
}

function renderAleshaExtras() {
  const record = document.getElementById("aiRecordBar");
  const voice = document.getElementById("aiVoiceChip");
  const files = document.getElementById("aiFileChips");
  const mic = document.getElementById("aiMic");
  if (aleshaUi.recording) {
    record.className = "mb-2 flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700";
    record.innerHTML = `<span class="flex items-center gap-2"><span class="h-2.5 w-2.5 animate-ping rounded-full bg-red-600"></span><span class="font-bold">Merekam Pesan Suara...</span><span class="rounded bg-red-100 px-2 py-0.5 font-mono font-semibold text-red-900">${formatAleshaSeconds(aleshaUi.recordSec)}</span></span><span class="flex gap-2"><button type="button" id="aiRecordStop" class="rounded-lg bg-red-600 px-2.5 py-1 font-bold text-white">Selesai</button><button type="button" id="aiRecordCancel" class="rounded-lg px-2 py-1 text-slate-500 hover:bg-red-100" title="Batalkan"><i class="fa-solid fa-xmark"></i></button></span>`;
  } else {
    record.className = "mb-2 hidden";
    record.innerHTML = "";
  }
  if (aleshaUi.voice && !aleshaUi.recording) {
    voice.className = "mb-2 flex items-center justify-between rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-xs text-blue-900";
    voice.innerHTML = `<span class="flex items-center gap-2"><i class="fa-solid fa-microphone text-blue-600"></i><span class="font-semibold">Pesan Suara Siap Dikirim</span><span class="text-[11px] text-slate-500">(${formatAleshaSeconds(aleshaUi.voice.duration)})</span></span><button type="button" id="aiVoiceClear" class="rounded-lg p-1 text-slate-400 hover:bg-blue-100 hover:text-red-600" title="Hapus Rekaman"><i class="fa-solid fa-xmark"></i></button>`;
  } else {
    voice.className = "mb-2 hidden";
    voice.innerHTML = "";
  }
  if (aleshaUi.files.length) {
    files.className = "mb-2 flex max-h-24 flex-wrap gap-2 overflow-y-auto";
    files.innerHTML = aleshaUi.files.map((file, index) => `<span class="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] text-slate-700"><i class="fa-solid fa-file text-slate-500"></i><span class="max-w-[130px] truncate font-medium">${esc(file.name)}</span><span class="text-[10px] text-slate-400">(${Math.round(file.size / 1024)} KB)</span><button type="button" data-ai-file="${index}" class="text-slate-400 hover:text-red-600"><i class="fa-solid fa-xmark"></i></button></span>`).join("");
  } else {
    files.className = "mb-2 hidden";
    files.innerHTML = "";
  }
  mic.className = aleshaUi.recording
    ? "shrink-0 animate-pulse rounded-lg bg-red-600 p-2 text-white"
    : "shrink-0 rounded-lg p-2 text-slate-400 hover:bg-blue-50 hover:text-blue-600";
  mic.title = aleshaUi.recording ? "Hentikan Rekaman" : "Mulai Pesan Suara";
}

function formatAleshaSeconds(sec) {
  const mins = Math.floor(sec / 60);
  const rest = sec % 60;
  return String(mins).padStart(2, "0") + ":" + String(rest).padStart(2, "0");
}

function ensureAleshaSession(title) {
  let current = activeAleshaSession();
  if (current) return current;
  const id = "arsy-" + Date.now() + "-" + Math.random().toString(36).slice(2, 7);
  current = { id, title: title || "Sesi Percakapan Baru", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), messages: [], aleshaSessionId: id };
  aleshaUi.sessions.unshift(current);
  aleshaUi.activeId = id;
  return current;
}

async function sendAlesha(custom) {
  const input = document.getElementById("aiInput");
  const raw = custom !== undefined ? custom : input.value;
  const textMessage = String(raw || "").trim();
  if (aleshaUi.busy || aleshaUi.recording) return;
  if (!textMessage && !aleshaUi.files.length && !aleshaUi.voice) return;
  if (!session) {
    aleshaUi.notice = "Masuk dulu untuk berbicara dengan Alesha.";
    renderAleshaFeed();
    return;
  }
  let display = textMessage;
  if (aleshaUi.voice) display = (display ? display + "\n\n" : "") + "[Pesan Suara / Voice Note Dikirim]";
  if (aleshaUi.files.length) display = (display ? display + "\n\n" : "") + "[" + aleshaUi.files.length + " Lampiran: " + aleshaUi.files.map((file) => file.name).join(", ") + "]";
  if (!display) display = "Tolong analisis berkas lampiran ini.";
  const current = ensureAleshaSession(textMessage.slice(0, 35) + (textMessage.length > 35 ? "..." : ""));
  if (current.title === "Sesi Percakapan Baru" && textMessage) current.title = textMessage.slice(0, 35) + (textMessage.length > 35 ? "..." : "");
  current.messages.push({ id: "u-" + Date.now(), role: "user", content: display, createdAt: new Date().toISOString() });
  current.updatedAt = new Date().toISOString();
  const payload = {
    sessionId: current.aleshaSessionId || current.id,
    message: textMessage,
    files: aleshaUi.files.map((file) => ({ name: file.name, type: file.type, size: file.size, base64: file.base64 })),
    audio: aleshaUi.voice ? { name: "voicenote.webm", base64: aleshaUi.voice.base64, duration: aleshaUi.voice.duration } : null
  };
  input.value = "";
  aleshaUi.files = [];
  aleshaUi.voice = null;
  aleshaUi.notice = "";
  aleshaUi.busy = true;
  saveAleshaStore();
  renderAleshaSessions();
  renderAleshaFeed();
  renderAleshaExtras();
  try {
    const response = await fetch("/api/ai-chat/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await response.json().catch(() => ({}));
    if (response.status === 429) {
      aleshaUi.notice = data.message || data.error || "Limit kuota sementara habis. Silakan coba kembali dalam beberapa saat.";
    } else {
      const reply = response.ok ? (data.reply || "Alesha belum memberi jawaban.") : (data.error || "Alesha belum terhubung.");
      if (data.sessionId) current.aleshaSessionId = data.sessionId;
      current.messages.push({ id: "a-" + Date.now(), role: "assistant", content: reply, source: data.source || null, createdAt: new Date().toISOString() });
      current.updatedAt = new Date().toISOString();
    }
  } catch (error) {
    aleshaUi.notice = "Kendala Sistem: Alesha belum terhubung.";
    current.messages.push({ id: "e-" + Date.now(), role: "assistant", content: "Siap komandan/rekan petugas. Permintaan telah diterima. Saat ini modul Alesha AI Engine sedang melakukan sinkronisasi. Silakan coba kembali dalam beberapa saat.", createdAt: new Date().toISOString() });
  } finally {
    aleshaUi.busy = false;
    saveAleshaStore();
    renderAleshaSessions();
    renderAleshaFeed();
  }
}

function setAleshaChat(open) {
  const modal = document.getElementById("aiChatModal");
  modal.hidden = !open;
  if (!open) return;
  loadAleshaStore();
  paintAleshaIdentity();
  renderAleshaSessions();
  renderAleshaFeed();
  renderAleshaExtras();
  document.getElementById("aiInput").focus();
}
function readAleshaFiles(fileList) {
  [...fileList].slice(0, 4).forEach((file) => {
    if (file.size > 8 * 1024 * 1024) {
      aleshaUi.notice = "Berkas " + file.name + " lebih dari 8 MB dan tidak dilampirkan.";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      aleshaUi.files.push({ name: file.name, size: file.size, type: file.type || "", base64: String(reader.result || "") });
      renderAleshaExtras();
      renderAleshaFeed();
    };
    reader.readAsDataURL(file);
  });
}

async function startAleshaRecording() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    aleshaUi.recorder = recorder;
    aleshaUi.chunks = [];
    recorder.ondataavailable = (event) => { if (event.data.size) aleshaUi.chunks.push(event.data); };
    recorder.onstop = () => {
      const blob = new Blob(aleshaUi.chunks, { type: recorder.mimeType || "audio/webm" });
      const reader = new FileReader();
      const duration = aleshaUi.recordSec;
      reader.onloadend = () => {
        if (aleshaUi.chunks.length) aleshaUi.voice = { base64: String(reader.result || ""), duration };
        aleshaUi.chunks = [];
        renderAleshaExtras();
      };
      reader.readAsDataURL(blob);
      stream.getTracks().forEach((track) => track.stop());
    };
    recorder.start();
    aleshaUi.recording = true;
    aleshaUi.recordSec = 0;
    aleshaUi.timer = setInterval(() => {
      aleshaUi.recordSec += 1;
      renderAleshaExtras();
    }, 1000);
    renderAleshaExtras();
  } catch (error) {
    aleshaUi.notice = "Izin mikrofon diperlukan untuk merekam pesan suara.";
    renderAleshaFeed();
  }
}

function stopAleshaRecording(cancel) {
  if (aleshaUi.timer) clearInterval(aleshaUi.timer);
  aleshaUi.timer = null;
  if (cancel) aleshaUi.chunks = [];
  if (aleshaUi.recorder && aleshaUi.recording) aleshaUi.recorder.stop();
  aleshaUi.recording = false;
  if (cancel) aleshaUi.voice = null;
  renderAleshaExtras();
}

document.getElementById("aiToggle").addEventListener("click", () => {
  setAleshaMenu(document.getElementById("aiMenu").hidden);
});
document.getElementById("aiMenuBackdrop").addEventListener("click", () => setAleshaMenu(false));
document.getElementById("aiMenuClose").addEventListener("click", () => setAleshaMenu(false));
document.getElementById("aiPickChat").addEventListener("click", () => {
  setAleshaMenu(false);
  setAleshaKiosk(false);
  setAleshaChat(true);
});
document.getElementById("aiChatClose").addEventListener("click", () => setAleshaChat(false));
document.getElementById("aiChatFull").addEventListener("click", () => {
  const dialog = document.getElementById("aiChatDialog");
  dialog.classList.toggle("is-full");
  document.getElementById("aiChatFull").title = dialog.classList.contains("is-full") ? "Keluar Layar Penuh" : "Layar Penuh";
});
document.getElementById("aiNewChat").addEventListener("click", () => {
  aleshaUi.activeId = "";
  ensureAleshaSession("Sesi Percakapan Baru");
  aleshaUi.notice = "";
  saveAleshaStore();
  renderAleshaSessions();
  renderAleshaFeed();
});
document.getElementById("aiRefreshChats").addEventListener("click", () => {
  loadAleshaStore();
  renderAleshaSessions();
  renderAleshaFeed();
});
document.getElementById("aiSessionSearch").addEventListener("input", renderAleshaSessions);
document.getElementById("aiSessionList").addEventListener("click", (event) => {
  const remove = event.target.closest("[data-ai-delete]");
  if (remove) {
    event.stopPropagation();
    aleshaUi.sessions = aleshaUi.sessions.filter((item) => item.id !== remove.dataset.aiDelete);
    if (aleshaUi.activeId === remove.dataset.aiDelete) aleshaUi.activeId = aleshaUi.sessions[0] ? aleshaUi.sessions[0].id : "";
    saveAleshaStore();
    renderAleshaSessions();
    renderAleshaFeed();
    return;
  }
  const row = event.target.closest("[data-ai-session]");
  if (!row) return;
  aleshaUi.activeId = row.dataset.aiSession;
  aleshaUi.notice = "";
  saveAleshaStore();
  renderAleshaSessions();
  renderAleshaFeed();
});
document.getElementById("aiClearChats").addEventListener("click", () => {
  aleshaUi.sessions = [];
  aleshaUi.activeId = "";
  saveAleshaStore();
  renderAleshaSessions();
  renderAleshaFeed();
});
function aleshaVisualClick(event) {
  const file = event.target.closest("[data-ai-file]");
  if (file) {
    aleshaSaveFile(file.dataset.aiFile, file.dataset.aiName, file.dataset.aiExt);
    return true;
  }
  const image = event.target.closest("[data-ai-image]");
  if (image) {
    const modal = ensureAleshaModal();
    document.getElementById("aiRichTitle").textContent = decodeURIComponent(image.dataset.aiName || "Infografis");
    document.getElementById("aiRichBody").innerHTML = `<img src="${esc(decodeURIComponent(image.dataset.aiImage))}" alt="" class="mx-auto max-h-[70vh] w-full object-contain">`;
    modal.classList.remove("hidden");
    modal.classList.add("flex");
    return true;
  }
  const chartPng = event.target.closest("[data-ai-chart-png]");
  if (chartPng) {
    const card = chartPng.closest("[data-ai-chart-card]");
    if (card) exportAleshaPng(card);
    return true;
  }
  const diagramMode = event.target.closest("[data-ai-diagram-mode]");
  if (diagramMode) {
    aleshaDiagramApply(diagramMode.closest("[data-ai-diagram]"), diagramMode.dataset.aiDiagramMode);
    return true;
  }
  const diagramZoom = event.target.closest("[data-ai-diagram-zoom]");
  if (diagramZoom) {
    aleshaDiagramZoom(diagramZoom.closest("[data-ai-diagram]"), diagramZoom.dataset.aiDiagramZoom);
    return true;
  }
  const diagramPng = event.target.closest("[data-ai-diagram-png]");
  if (diagramPng) {
    const card = diagramPng.closest("[data-ai-diagram]");
    if (card) {
      aleshaDiagramZoom(card, "reset");
      exportAleshaPng(card, "#090d16");
    }
    return true;
  }
  const diagramFull = event.target.closest("[data-ai-diagram-full]");
  if (diagramFull) {
    const index = Number(diagramFull.dataset.aiDiagramFull);
    const code = aleshaUi.mermaidBank[index];
    const modal = ensureAleshaModal();
    document.getElementById("aiRichTitle").textContent = "Diagram Data Master ARSY";
    document.getElementById("aiRichBody").innerHTML = code ? aleshaDiagramCard(index, code) : "";
    hydrateAleshaVisuals(document.getElementById("aiRichBody"));
    modal.classList.remove("hidden");
    modal.classList.add("flex");
    return true;
  }
  return false;
}

document.getElementById("aiFeed").addEventListener("click", (event) => {
  if (aleshaVisualClick(event)) return;
  const prompt = event.target.closest("[data-ai-prompt]");
  if (prompt) {
    sendAlesha(ALESHA_PROMPTS[Number(prompt.dataset.aiPrompt)].prompt);
    return;
  }
  const follow = event.target.closest("[data-ai-follow]");
  if (follow) {
    sendAlesha(decodeURIComponent(follow.dataset.aiFollow));
    return;
  }
  const mode = event.target.closest("[data-ai-mode]");
  if (mode) {
    aleshaUi.chartModes[mode.dataset.aiChartIndex] = mode.dataset.aiMode;
    paintAleshaCharts(mode.closest("[data-ai-chart-card]") || document.getElementById("aiFeed"));
    return;
  }
  const zoom = event.target.closest("[data-ai-zoom]");
  if (zoom) {
    const index = Number(zoom.dataset.aiZoom);
    const spec = aleshaUi.chartBank[index];
    const modal = ensureAleshaModal();
    document.getElementById("aiRichTitle").textContent = (spec && spec.title) || "Grafik data ARSY";
    document.getElementById("aiRichBody").innerHTML = spec ? aleshaChartCard(index, spec) : "";
    paintAleshaCharts(document.getElementById("aiRichBody"));
    modal.classList.remove("hidden");
    modal.classList.add("flex");
    return;
  }
  const preview = event.target.closest("[data-ai-preview]");
  if (preview) {
    const bubble = document.querySelector(`[data-ai-bubble="${preview.dataset.aiPreview}"]`);
    const modal = ensureAleshaModal();
    const info = aleshaScope();
    const when = new Date().toLocaleString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });
    document.getElementById("aiRichTitle").textContent = "Preview Laporan Data Master ARSY";
    const body = document.getElementById("aiRichBody");
    body.innerHTML = `<div id="aiDocSheet" class="mx-auto w-full max-w-[1180px] rounded-xl border border-slate-100 bg-white p-6"><div class="flex items-center gap-4 border-b-2 border-slate-900 pb-4"><img src="/img/brand/algorskorl.png" alt="Korlantas POLRI" class="h-16 w-16 object-contain"><div><h1 class="text-sm font-black uppercase tracking-wider text-[#0a1d37]">Korps Lalu Lintas Kepolisian Negara Republik Indonesia</h1><h2 class="mt-0.5 text-xs font-extrabold tracking-wide text-blue-900">ARSY • Algoritma Road Safety</h2><p class="mt-0.5 text-[11px] text-slate-500">Laporan resmi data master • Alesha</p></div></div><div class="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-[11px] text-slate-700"><div><strong>Waktu Dokumen:</strong> ${esc(when)} WIB • <strong>Otorisasi:</strong> ${esc(info.role)} (${esc((session && session.name) || "Petugas")}) • <span class="rounded border border-emerald-200 bg-emerald-50 px-2 py-0.5 font-semibold text-emerald-700">Klasifikasi: Resmi</span></div><div class="font-semibold text-blue-900">Basis Data Master ARSY</div></div><div id="aiDocContent" class="mt-4 text-xs leading-relaxed text-slate-800"></div><div class="mt-4 flex items-center justify-between border-t border-slate-200 pt-4 text-[10px] text-slate-400"><span>KORLANTAS POLRI • ARSY</span><span>Dokumen Resmi Kedinasan • Alesha</span></div></div>`;
    const content = document.getElementById("aiDocContent");
    content.innerHTML = bubble ? bubble.innerHTML : "";
    content.querySelectorAll(".ai-export-hide").forEach((item) => item.remove());
    paintAleshaCharts(content);
    hydrateAleshaVisuals(content);
    modal.classList.remove("hidden");
    modal.classList.add("flex");
    return;
  }
  const pdf = event.target.closest("[data-ai-pdf]");
  if (pdf) {
    const bubble = document.querySelector(`[data-ai-bubble="${pdf.dataset.aiPdf}"]`);
    if (bubble) exportAleshaPdf(bubble);
    return;
  }
  const png = event.target.closest("[data-ai-png]");
  if (png) {
    const bubble = document.querySelector(`[data-ai-bubble="${png.dataset.aiPng}"]`);
    if (bubble) exportAleshaPng(bubble);
    return;
  }
  const copy = event.target.closest("[data-ai-copy]");
  if (!copy || !navigator.clipboard) return;
  const current = activeAleshaSession();
  const message = current && current.messages.find((item) => item.id === copy.dataset.aiCopy);
  if (!message) return;
  navigator.clipboard.writeText(message.content);
  aleshaUi.copiedId = message.id;
  renderAleshaFeed();
  setTimeout(() => {
    aleshaUi.copiedId = "";
    renderAleshaFeed();
  }, 2000);
});
document.getElementById("aiNotice").addEventListener("click", (event) => {
  if (event.target.id === "aiNoticeClose") {
    aleshaUi.notice = "";
    renderAleshaFeed();
  }
});
document.getElementById("aiAttach").addEventListener("click", () => document.getElementById("aiFileInput").click());
document.getElementById("aiFileInput").addEventListener("change", (event) => {
  readAleshaFiles(event.target.files || []);
  event.target.value = "";
});
document.getElementById("aiFileChips").addEventListener("click", (event) => {
  const button = event.target.closest("[data-ai-file]");
  if (!button) return;
  aleshaUi.files.splice(Number(button.dataset.aiFile), 1);
  renderAleshaExtras();
});
document.getElementById("aiMic").addEventListener("click", () => {
  if (aleshaUi.recording) stopAleshaRecording(false);
  else startAleshaRecording();
});
document.getElementById("aiRecordBar").addEventListener("click", (event) => {
  if (event.target.id === "aiRecordStop") stopAleshaRecording(false);
  if (event.target.closest("#aiRecordCancel")) stopAleshaRecording(true);
});
document.getElementById("aiVoiceChip").addEventListener("click", (event) => {
  if (!event.target.closest("#aiVoiceClear")) return;
  aleshaUi.voice = null;
  renderAleshaExtras();
});
document.getElementById("aiSend").addEventListener("click", () => sendAlesha());
document.getElementById("aiInput").addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    sendAlesha();
  }
});
