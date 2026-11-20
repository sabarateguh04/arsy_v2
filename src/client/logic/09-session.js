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

    let aiGreeted = false;

    function setAiChat(open) {
      const panel = document.getElementById("aiPanel");
      const toggle = document.getElementById("aiToggle");
      panel.hidden = !open;
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.querySelector("i").className = open ? "fa-solid fa-xmark" : "fa-solid fa-comment-dots";
      toggle.setAttribute("aria-label", open ? "Tutup asisten AI" : "Buka asisten AI");
      if (open && !aiGreeted) {
        aiGreeted = true;
        appendAiMessage("bot", "Halo, saya asisten ARSY. Tanya CFR, peta gangguan, atau menu data. Jawaban ini panduan di halaman, bukan model eksternal.");
      }
      if (open) document.getElementById("aiInput").focus();
    }

    function appendAiMessage(role, text) {
      const row = document.createElement("div");
      row.className = "ai-row" + (role === "user" ? " is-user" : "");
      row.innerHTML = `<div class="ai-bubble">${esc(text)}</div>`;
      const log = document.getElementById("aiLog");
      log.appendChild(row);
      log.scrollTop = log.scrollHeight;
    }

    function answerAi(text) {
      const q = text.toLowerCase();
      const onDesk = !document.getElementById("operatorDashboard").classList.contains("hidden-section");
      if (q.includes("cfr") || q.includes("fatal")) {
        if (session && roleLevel(session) !== "nasional") {
          const scope = safeScope();
          const cfr = scope.crashes ? (scope.deaths / scope.crashes) * 100 : 0;
          return "Di cakupan " + scopeLabel(session) + ", Case Fatality Rate " + cfr.toFixed(2).replace(".", ",") + "% dari " + idNum(scope.deaths) + " korban meninggal dan " + idNum(scope.crashes) + " kecelakaan. Angka nasional tidak ditampilkan untuk peran ini.";
        }
        return "Case Fatality Rate 2026 di Kinerja Keselamatan saat ini 12,38%, dari 18.036 korban meninggal dan 145.673 kecelakaan.";
      }
      if (q.includes("peta") || q.includes("gangguan")) {
        if (onDesk && canOpen("viewMap")) switchOperatorView("viewMap");
        if (onDesk && !canOpen("viewMap")) return "Peta Utama tidak dibuka untuk peran yang sedang masuk.";
        return onDesk ? "Peta Utama sudah dibuka. Titik yang tampil mengikuti cakupan akun ini." : "Peta gangguan ada di command center. Masuk dulu, lalu pilih Dashboard → Peta Utama.";
      }
      if (q.includes("keselamatan")) {
        if (onDesk && canOpen("viewKeselamatan")) switchOperatorView("viewKeselamatan");
        if (onDesk && !canOpen("viewKeselamatan")) return "Kinerja Keselamatan tidak dibuka untuk peran yang sedang masuk.";
        return onDesk ? "Kinerja Keselamatan sudah dibuka. Angka dan tabel mengikuti cakupan akun ini." : "Kinerja Keselamatan ada setelah masuk ke command center, di menu Dashboard.";
      }
      if (q.includes("master") || q.includes("import")) return "Data Master punya grup Import (Import Data, Edit Data, Log Import) dan Input (Input Gangguan). Role, Jabatan, Provinsi, Kota, dan Manajemen Menu ada di Administrasi.";
      if (q.includes("sekunder")) return "Data Sekunder menampilkan Data Populasi, Laporan Harian, Data IRSMS, Data Langgar, dan Data Kendaraan.";
      return "Saya bisa bantu ke Peta Utama, Kinerja Keselamatan, Data Sekunder, atau Data Master. Sebut bagian yang ingin dilihat.";
    }

    function askAi(text) {
      const message = text.trim();
      if (!message) return;
      appendAiMessage("user", message);
      document.getElementById("aiInput").value = "";
      window.setTimeout(() => appendAiMessage("bot", answerAi(message)), 280);
    }

    document.getElementById("aiToggle").addEventListener("click", () => {
      setAiChat(document.getElementById("aiPanel").hidden);
    });
    document.getElementById("aiClose").addEventListener("click", () => setAiChat(false));
    document.getElementById("aiForm").addEventListener("submit", (event) => {
      event.preventDefault();
      askAi(document.getElementById("aiInput").value);
    });
    document.querySelectorAll("[data-ai-ask]").forEach((button) => {
      button.addEventListener("click", () => askAi(button.dataset.aiAsk));
    });

    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      if (document.getElementById("viewKeselamatan").classList.contains("is-full")) {
        setSafeFull(false);
        return;
      }
      if (!document.getElementById("aiPanel").hidden) {
        setAiChat(false);
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

