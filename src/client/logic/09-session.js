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
    if (document.getElementById("safeTableCard") && document.getElementById("safeTableCard").classList.contains("is-table-full")) setSafeTableFull(false);
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

async function enterSession(found) {
  if (!menuGrants) menuGrants = buildDefaultGrants();
  session = found;
  await loadCatalog();
  if (session.role === "Admin") await loadUsers();
  activeView = canOpen("viewMap") ? "viewMap" : "viewKeselamatan";
  showPage("operatorDashboard");
}

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
  await enterSession(found);
}

let registerAreas = null;
function fillRegisterKota() {
  const provinsi = document.getElementById("registerProvinsi").value;
  const kotaSelect = document.getElementById("registerKota");
  const cities = (registerAreas && registerAreas[provinsi]) || [];
  kotaSelect.innerHTML = '<option value="">Pilih kota</option>' + cities.map((name) => '<option>' + name.replace(/</g, "") + "</option>").join("");
}
async function fillRegisterAreas() {
  if (!registerAreas) {
    try {
      const response = await fetch("/api/register/areas");
      const data = response.ok ? await response.json() : {};
      registerAreas = data.areas || {};
    } catch (error) {
      registerAreas = {};
    }
  }
  const provinsiSelect = document.getElementById("registerProvinsi");
  const names = Object.keys(registerAreas);
  const current = provinsiSelect.value;
  provinsiSelect.innerHTML = '<option value="">Pilih provinsi</option>' + names.map((name) => '<option>' + name.replace(/</g, "") + "</option>").join("");
  if (names.includes(current)) provinsiSelect.value = current;
  fillRegisterKota();
}
function showAuth(mode) {
  showPage("loginPage");
  const isRegister = mode === "register";
  document.getElementById("loginPanel").classList.toggle("hidden-section", isRegister);
  document.getElementById("registerPanel").classList.toggle("hidden-section", !isRegister);
  document.title = isRegister ? "Daftar · ARSY" : "Masuk · ARSY";
  if (isRegister) fillRegisterAreas();
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
document.getElementById("registerProvinsi").addEventListener("change", fillRegisterKota);
document.getElementById("registerForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const error = document.getElementById("registerError");
  const password = document.getElementById("registerPassword").value;
  const confirm = document.getElementById("registerConfirm").value;
  if (password !== confirm) {
    error.textContent = "Konfirmasi kata sandi tidak sama.";
    error.classList.remove("hidden");
    return;
  }
  error.classList.add("hidden");
  try {
    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: document.getElementById("registerName").value,
        email: document.getElementById("registerEmail").value,
        password,
        confirm,
        provinsi: document.getElementById("registerProvinsi").value,
        kota: document.getElementById("registerKota").value
      })
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      error.textContent = data.error || "Pendaftaran belum berhasil.";
      error.classList.remove("hidden");
      return;
    }
    await enterSession(data);
  } catch (err) {
    error.textContent = "Layanan akun belum siap. Coba lagi.";
    error.classList.remove("hidden");
  }
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
bindMapGis();
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

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  if (document.getElementById("safeTableCard") && document.getElementById("safeTableCard").classList.contains("is-table-full")) {
    setSafeTableFull(false);
    return;
  }
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
