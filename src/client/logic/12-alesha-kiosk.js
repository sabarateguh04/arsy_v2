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
document.getElementById("aiPickKiosk").addEventListener("click", () => {
  setAleshaMenu(false);
  setAleshaChat(false);
  setAleshaKiosk(true);
});
document.getElementById("aiKioskClose").addEventListener("click", () => setAleshaKiosk(false));
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
