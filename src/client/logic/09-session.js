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
      setAccountMenu(false);
      showPage("publicPortal");
    });

    async function attemptLogin(email, password) {
      await stateReady;
      const found = users.find((user) => user.email.toLowerCase() === String(email || "").trim().toLowerCase() && user.password === password && user.status === "Aktif");
      const error = document.getElementById("loginError");
      if (!found) {
        error.textContent = "Email atau kata sandi tidak cocok, atau akun sedang nonaktif.";
        error.classList.remove("hidden");
        return;
      }
      error.classList.add("hidden");
      if (!menuGrants) menuGrants = buildDefaultGrants();
      session = found;
      activeView = canOpen("viewMap") ? "viewMap" : "viewKeselamatan";
      showPage("operatorDashboard");
    }

    function renderMenuAdmin() {
      if (!menuGrants) menuGrants = buildDefaultGrants();
      const body = document.getElementById("menuGrantBody");
      if (!body) return;
      let group = "";
      body.innerHTML = menuCatalog().map((item) => {
        const head = item.group === group ? "" : `<tr class="bg-[#f4f7fb]"><td colspan="5" class="px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">${esc(item.group)}</td></tr>`;
        group = item.group;
        const cells = ACCESS_ROLES.map((role) => {
          const on = !!menuGrants[role][item.key];
          return `<td class="px-3 py-2 text-center"><input type="checkbox" data-grant-role="${esc(role)}" data-grant-key="${esc(item.key)}" ${on ? "checked" : ""} class="h-4 w-4 accent-[#1e3a8a]"></td>`;
        }).join("");
        return head + `<tr class="border-t border-slate-100"><td class="px-4 py-2.5 text-slate-800">${esc(item.label)}</td>${cells}</tr>`;
      }).join("");
    }

    menuGrants = buildDefaultGrants();
    const stateReady = fetch("/api/state").then(async (response) => {
      if (!response.ok) return;
      const data = await response.json();
      if (Array.isArray(data.reports)) surveyReports = data.reports;
      if (data.grants && typeof data.grants === "object") {
        const defaults = buildDefaultGrants();
        ACCESS_ROLES.forEach((role) => {
          defaults[role] = Object.assign(defaults[role], data.grants[role] || {});
        });
        menuGrants = defaults;
      }
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
      if (!box || !menuGrants[box.dataset.grantRole]) return;
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
      const role = document.getElementById("userRole").value;
      if (role === "Admin" || role === "Eksekutif 1") return;
      fillUserAreas(document.getElementById("userProvinsi").value, "");
      if (role === "Eksekutif 2") {
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
    document.getElementById("userForm").addEventListener("submit", (event) => {
      event.preventDefault();
      if (userMode !== "create" && userMode !== "edit") return;
      const draft = readUserForm();
      const duplicate = users.some((user, index) => user.email.toLowerCase() === draft.email.toLowerCase() && index !== userIndex);
      if (duplicate) {
        document.getElementById("userEmail").setCustomValidity("Email ini sudah dipakai.");
        document.getElementById("userEmail").reportValidity();
        return;
      }
      document.getElementById("userEmail").setCustomValidity("");
      if (userMode === "create") {
        users.unshift(Object.assign({ id: nextUserId() }, draft));
      } else {
        users[userIndex] = Object.assign({}, users[userIndex], draft);
      }
      closeUserModal();
      renderUsers();
    });
    document.getElementById("userDeleteBtn").addEventListener("click", () => {
      if (userIndex < 0) return;
      users.splice(userIndex, 1);
      closeUserModal();
      renderUsers();
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
      if (q.includes("master") || q.includes("import")) return "Data Master punya grup Import (Import Data, Edit Data, Log Import) dan Input (Mobile apps).";
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

