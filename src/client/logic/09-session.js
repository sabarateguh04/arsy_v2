const accountBtn = document.getElementById("accountBtn");
const accountMenu = document.getElementById("accountMenu");
function placeAccountMenu() {
  const rect = accountBtn.getBoundingClientRect();
  accountMenu.style.position = "fixed";
  accountMenu.style.top = (rect.bottom + 10) + "px";
  accountMenu.style.right = Math.max(12, window.innerWidth - rect.right) + "px";
  accountMenu.style.left = "auto";
  accountMenu.style.zIndex = "120";
}
function setAccountMenu(open) {
  if (open) {
    document.body.appendChild(accountMenu);
    placeAccountMenu();
    accountMenu.classList.remove("hidden");
  } else {
    accountMenu.classList.add("hidden");
  }
  accountBtn.setAttribute("aria-expanded", open ? "true" : "false");
}
accountBtn.addEventListener("click", (event) => {
  event.stopPropagation();
  setAccountMenu(accountMenu.classList.contains("hidden"));
});
document.querySelectorAll("[data-account]").forEach((button) => {
  button.addEventListener("click", () => {
    if (document.getElementById("viewKeselamatan").classList.contains("is-full")) setSafeFull(false);
    openLeaf(button.dataset.account);
    setAccountMenu(false);
  });
});
document.getElementById("accountLogout").addEventListener("click", () => {
  session = null;
  users = [];
  fetch("/api/logout", { method: "POST" }).catch(() => undefined);
  setAccountMenu(false);
  showPage("publicPortal");
});

async function attemptLogin(email, password) {
  await stateReady;
  const error = document.getElementById("loginError");
  let found = null;
  try {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    if (response.ok) found = await response.json();
    else if (response.status >= 500) {
      error.textContent = "Layanan akun belum siap. Coba lagi.";
      error.classList.remove("hidden");
      return;
    }
  } catch (err) {
    error.textContent = "Layanan akun belum siap. Coba lagi.";
    error.classList.remove("hidden");
    return;
  }
  if (!found) {
    error.textContent = "Email atau kata sandi tidak cocok, atau akun sedang nonaktif.";
    error.classList.remove("hidden");
    return;
  }
  error.classList.add("hidden");
  if (!menuGrants) menuGrants = buildDefaultGrants();
  session = found;
  await loadCatalog();
  if (session.role === "Admin") await loadUsers();
  activeView = canOpen("viewMap") ? "viewMap" : "viewKeselamatan";
  showPage("operatorDashboard");
}

async function loadCatalog() {
  try {
    const response = await fetch("/api/master/catalog");
    if (!response.ok) return false;
    const data = await response.json();
    masterCatalog = Object.assign({ roles: [], jabatan: [], provinsi: [], kota: [], menus: [], areas: {}, grants: null }, data);
    applySavedGrants(data.grants || menuGrants);
    return true;
  } catch (error) {
    return false;
  }
}

async function renderMenuAdmin() {
  if (!menuGrants) menuGrants = buildDefaultGrants();
  await loadCatalog();
  paintAccessMatrix("menuGrantHead", "menuGrantBody");
}

menuGrants = buildDefaultGrants();
const stateReady = fetch("/api/state").then(async (response) => {
  if (!response.ok) return;
  const data = await response.json();
  if (Array.isArray(data.reports)) surveyReports = data.reports;
  if (data.grants && typeof data.grants === "object") applySavedGrants(data.grants);
}).catch(() => undefined);
document.getElementById("loginForm").addEventListener("submit", (event) => {
  event.preventDefault();
  attemptLogin(document.getElementById("loginEmail").value, document.getElementById("passwordInput").value);
});
document.querySelectorAll("[data-demo]").forEach((button) => {
  button.addEventListener("click", () => {
    document.getElementById("loginEmail").value = button.dataset.demo;
    document.getElementById("passwordInput").value = "arsy1234";
    attemptLogin(button.dataset.demo, "arsy1234");
  });
});
document.getElementById("menuGrantBody").addEventListener("change", (event) => {
  const box = event.target.closest("[data-grant-key]");
  if (!box) return;
  if (!menuGrants[box.dataset.grantRole]) menuGrants[box.dataset.grantRole] = {};
  menuGrants[box.dataset.grantRole][box.dataset.grantKey] = box.checked;
  applyMenuAccess();
  persistGrants();
  document.getElementById("menuGrantNote").textContent = "Akses diperbarui. Masuk dengan peran itu untuk melihat menunya.";
});
document.getElementById("menuGrantSave").addEventListener("click", async () => {
  const note = document.getElementById("menuGrantNote");
  const saved = await persistGrants();
  note.textContent = saved
    ? "Tersimpan. Menu tiap peran langsung mengikuti pengaturan ini."
    : "Belum tersimpan. Coba lagi.";
});
document.getElementById("userRole").addEventListener("change", () => {
  syncUserScopeFields({
    jabatan: document.getElementById("userJabatan").value,
    provinsi: document.getElementById("userProvinsi").value,
    kota: document.getElementById("userKota").value
  }, userMode === "view");
});
document.addEventListener("click", (event) => {
  if (accountMenu.classList.contains("hidden")) return;
  if (accountMenu.contains(event.target) || accountBtn.contains(event.target)) return;
  setAccountMenu(false);
});

["AG", "PG", "GN", "KA"].forEach((type) => {
  document.getElementById("layer" + type).addEventListener("change", () => setLayerVisibility(type));
});
document.getElementById("closePointPanel").addEventListener("click", closePoint);
document.getElementById("recenterMap").addEventListener("click", () => {
  closePoint();
  if (map) {
    map.panTo({ lat: MAP_HOME.lat, lng: MAP_HOME.lng });
    map.setZoom(MAP_HOME.zoom);
  }
});

document.getElementById("userProvinsi").addEventListener("change", () => {
  const cakupan = roleCakupan(document.getElementById("userRole").value);
  if (cakupan === "nasional") return;
  fillUserAreas(document.getElementById("userProvinsi").value, "");
  if (cakupan === "provinsi") {
    const kotaSelect = document.getElementById("userKota");
    kotaSelect.innerHTML = "<option>—</option>";
    kotaSelect.disabled = true;
  }
});
document.getElementById("userSearch").addEventListener("input", renderUsers);
document.getElementById("filterBtn").addEventListener("click", (event) => {
  event.stopPropagation();
  document.getElementById("filterMenu").classList.toggle("hidden-section");
});
document.querySelectorAll("#filterMenu [data-status]").forEach((button) => {
  button.addEventListener("click", () => {
    statusFilter = button.dataset.status;
    document.getElementById("filterLabel").textContent = statusFilter;
    document.getElementById("filterMenu").classList.add("hidden-section");
    renderUsers();
  });
});
document.getElementById("addUserBtn").addEventListener("click", () => openUserModal("create", -1));
document.getElementById("userTableBody").addEventListener("click", (event) => {
  const button = event.target.closest("[data-user-action]");
  if (!button) return;
  openUserModal(button.dataset.userAction, Number(button.dataset.userIndex));
});
document.getElementById("userForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  if (userMode !== "create" && userMode !== "edit") return;
  const draft = readUserForm();
  showUserError("");
  const current = userIndex >= 0 ? users[userIndex] : null;
  const response = userMode === "create"
    ? await fetch("/api/users", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(draft) })
    : await fetch("/api/users/" + encodeURIComponent(current.id), { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(draft) });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    showUserError(data.error || "Pengguna belum tersimpan.");
    return;
  }
  closeUserModal();
  await loadUsers();
});
document.getElementById("userDeleteBtn").addEventListener("click", async () => {
  if (userIndex < 0) return;
  const current = users[userIndex];
  const response = await fetch("/api/users/" + encodeURIComponent(current.id), { method: "DELETE" });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    showUserError(data.error || "Pengguna belum terhapus.");
    return;
  }
  closeUserModal();
  await loadUsers();
});
document.querySelectorAll("[data-close-user]").forEach((el) => {
  el.addEventListener("click", closeUserModal);
});

document.addEventListener("click", (event) => {
  const menu = document.getElementById("filterMenu");
  const button = document.getElementById("filterBtn");
  if (!menu || menu.classList.contains("hidden-section")) return;
  if (menu.contains(event.target) || button.contains(event.target)) return;
  menu.classList.add("hidden-section");
});

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
  copiedId: ""
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

function renderAleshaFeed() {
  const feed = document.getElementById("aiFeed");
  const current = activeAleshaSession();
  const messages = current ? current.messages || [] : [];
  const info = aleshaScope();
  if (!messages.length && !aleshaUi.busy) {
    const cards = ALESHA_PROMPTS.map((item, index) => `<button type="button" data-ai-prompt="${index}" class="flex w-full min-w-0 items-center gap-3 rounded-xl border border-slate-200 p-3 text-left text-xs text-slate-700 shadow-sm hover:border-blue-300 hover:bg-blue-50/50"><span class="min-w-0 flex-1"><span class="block text-xs font-bold text-slate-900">${esc(item.label)}</span><span class="mt-0.5 block text-[11px] leading-relaxed text-slate-500">${esc(item.prompt)}</span></span><i class="fa-solid fa-chevron-right shrink-0 text-slate-400"></i></button>`).join("");
    feed.innerHTML = `<div class="mx-auto flex min-h-full w-full max-w-2xl flex-col items-center justify-center px-1 py-6 text-center"><span class="mb-3.5 grid h-16 w-16 place-items-center rounded-2xl border border-blue-200 bg-blue-50 text-blue-600"><i class="fa-solid fa-robot text-2xl"></i></span><h3 class="text-base font-bold text-slate-900">Selamat Datang, ${esc((session && session.name) || "Petugas")}</h3><p class="mt-1 max-w-md text-xs leading-relaxed text-slate-600">Alesha siap menyajikan data master ARSY: pengguna, peran, jabatan, provinsi, kota, dan hak akses menu wilayah <strong>${esc(info.scope)}</strong> dalam wewenang <strong>${esc(info.role)}</strong>.</p><div class="mt-6 w-full space-y-2 text-left"><p class="mb-2.5 text-center text-[11px] font-bold uppercase tracking-wider text-slate-400">Pilih Pertanyaan Cepat Berdasarkan Menu:</p>${cards}</div></div>`;
  } else {
    feed.innerHTML = messages.map((item) => {
      const mine = item.role === "user";
      const copy = mine ? "" : `<button type="button" data-ai-copy="${esc(item.id)}" class="ai-copy absolute -right-1 -top-2 rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] text-slate-500 hover:text-blue-700">${aleshaUi.copiedId === item.id ? "Tersalin" : "Salin"}</button>`;
      return `<article class="relative flex min-w-0 ${mine ? "justify-end" : "justify-start"}"><div class="max-w-[85%] whitespace-pre-wrap break-words rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-sm ${mine ? "rounded-br-sm bg-[#0a1d37] text-white" : "rounded-bl-sm border border-slate-200 bg-slate-50 text-slate-800"}">${esc(item.content)}</div>${copy}</article>`;
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
      current.messages.push({ id: "a-" + Date.now(), role: "assistant", content: reply, createdAt: new Date().toISOString() });
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

function kioskContextPayload() {
  const info = aleshaScope();
  const active = activeAleshaSession();
  const sessionId = (active && (active.aleshaSessionId || active.id)) || localStorage.getItem("arsy_alesha_session_id") || (session ? "arsy-" + session.id : "arsy-guest");
  return {
    context_app: "sm-arsy",
    category: "sm-arsy",
    session_id: sessionId,
    current_menu: "ARSY",
    user_role: info.role,
    user_name: (session && session.name) || "",
    user_fullname: (session && session.name) || "",
    fullName: (session && session.name) || "",
    polda: session && roleLevel(session) !== "nasional" ? (session.provinsi || "") : "",
    polres: session && roleLevel(session) === "kota" ? (session.kota || "") : "",
    user_position: (session && session.jabatan) || ""
  };
}

function kioskUrl() {
  const url = new URL("https://alesha.djalu.co.id/kiosk-public");
  const payload = kioskContextPayload();
  Object.keys(payload).forEach((key) => {
    if (payload[key]) url.searchParams.set(key, payload[key]);
  });
  return url.toString();
}

function sendKioskContext() {
  const frame = document.getElementById("aiKioskFrame");
  if (!frame.contentWindow) return;
  frame.contentWindow.postMessage({ type: "ALESHA_CONTEXT_UPDATE", payload: kioskContextPayload() }, "*");
}

function setAleshaKiosk(open) {
  const modal = document.getElementById("aiKioskModal");
  modal.hidden = !open;
  if (!open) return;
  const info = aleshaScope();
  document.getElementById("aiKioskScope").textContent = "Menyinkronkan data teritori " + info.scope;
  document.getElementById("aiKioskLoading").classList.remove("hidden");
  document.getElementById("aiKioskFrame").src = kioskUrl();
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
document.getElementById("aiPickKiosk").addEventListener("click", () => {
  setAleshaMenu(false);
  setAleshaChat(false);
  setAleshaKiosk(true);
});
document.getElementById("aiChatClose").addEventListener("click", () => setAleshaChat(false));
document.getElementById("aiKioskClose").addEventListener("click", () => setAleshaKiosk(false));
document.getElementById("aiChatFull").addEventListener("click", () => {
  const dialog = document.getElementById("aiChatDialog");
  dialog.classList.toggle("is-full");
  document.getElementById("aiChatFull").title = dialog.classList.contains("is-full") ? "Keluar Layar Penuh" : "Layar Penuh";
});
document.getElementById("aiKioskFull").addEventListener("click", () => {
  const dialog = document.getElementById("aiKioskDialog");
  dialog.classList.toggle("is-full");
  document.getElementById("aiKioskFull").title = dialog.classList.contains("is-full") ? "Keluar Layar Penuh" : "Layar Penuh";
});
document.getElementById("aiKioskReload").addEventListener("click", () => {
  document.getElementById("aiKioskLoading").classList.remove("hidden");
  const frame = document.getElementById("aiKioskFrame");
  frame.src = kioskUrl();
});
document.getElementById("aiKioskFrame").addEventListener("load", () => {
  document.getElementById("aiKioskLoading").classList.add("hidden");
  sendKioskContext();
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
document.getElementById("aiFeed").addEventListener("click", (event) => {
  const prompt = event.target.closest("[data-ai-prompt]");
  if (prompt) {
    sendAlesha(ALESHA_PROMPTS[Number(prompt.dataset.aiPrompt)].prompt);
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
window.addEventListener("message", (event) => {
  const data = event.data || {};
  if (data.type === "ALESHA_SESSION_SYNC" && data.sessionId) {
    const existing = localStorage.getItem("arsy_alesha_session_id");
    if (!existing || existing === "arsy-guest") localStorage.setItem("arsy_alesha_session_id", data.sessionId);
  }
  const file = data.type === "ALESHA_FILE_GENERATED" ? data.payload : (data.type === "ALESHA_KIOSK_EVENT" && data.action === "FILE_GENERATED" ? data.data : null);
  if (!file) return;
  const link = document.getElementById("aiKioskFile");
  const href = String(file.download_url || file.url || file.file_url || "");
  if (!href) return;
  link.href = href;
  link.className = "flex items-center gap-1.5 rounded-xl border border-red-500/50 bg-red-600/25 px-3 py-1.5 text-xs font-semibold text-red-200";
  link.innerHTML = `<i class="fa-solid fa-download"></i><span>Unduh ${esc(file.type || "berkas")}</span>`;
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  if (document.getElementById("viewKeselamatan").classList.contains("is-full")) {
    setSafeFull(false);
    return;
  }
  if (!document.getElementById("aiMenu").hidden) {
    setAleshaMenu(false);
    return;
  }
  if (!document.getElementById("aiChatModal").hidden) {
    setAleshaChat(false);
    return;
  }
  if (!document.getElementById("aiKioskModal").hidden) {
    setAleshaKiosk(false);
    return;
  }
  closeUserModal();
  closeMasterModal();
  closePoint();
  document.getElementById("newsModal").classList.add("hidden-section");
  document.getElementById("filterMenu").classList.add("hidden-section");
  document.getElementById("accountMenu").classList.add("hidden");
  document.getElementById("accountBtn").setAttribute("aria-expanded", "false");
  closeSidebar();
});

renderSidebar();

window.addEventListener("resize", () => {
  renderSidebar();
  if (map && window.google && activeView === "viewMap" && !document.getElementById("operatorDashboard").classList.contains("hidden-section")) {
    google.maps.event.trigger(map, "resize");
  }
  if (activeView === "viewKeselamatan") renderSafeMap();
});

renderUsers();
paintSafePanel();
tickClock();
setInterval(tickClock, 1000);
showPage("publicPortal");

