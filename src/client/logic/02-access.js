    function roleLevel(user) {
      if (!user) return "nasional";
      if (user.cakupan) return user.cakupan;
      return roleCakupan(user.role);
    }

    function poldaKey(provinsi) {
      if (provinsi === "DKI Jakarta") return "Jakarta Raya";
      if (provinsi === "DI Yogyakarta") return "Yogyakarta";
      return provinsi || "";
    }

    function personInitials(name) {
      const words = String(name || "").split(/\s+/).filter((word) => word && !word.endsWith("."));
      const pick = words.length > 2 ? words.slice(-2) : words;
      return pick.map((word) => word[0]).join("").toUpperCase().slice(0, 2) || "AR";
    }

    function scopeLabel(user) {
      if (!user) return "Nasional";
      const level = roleLevel(user);
      if (level === "nasional") return "Nasional";
      if (level === "provinsi") return user.jabatan || user.provinsi || "Provinsi";
      return user.kota || "Kota";
    }

    function menuCatalog() {
      const names = { dashboard: "Dashboard", primer: "Data Primer", sdc: "Data Primer", tmc: "Data Primer", ssc: "Data Primer", media: "Data Primer", sekunder: "Data Sekunder", master: "Data Master", mimport: "Data Master", minput: "Data Master" };
      const items = [];
      document.querySelectorAll("#sidebar [data-side], #sidebar [data-leaf]").forEach((button) => {
        const key = button.dataset.side || button.dataset.leaf;
        if (key === "viewUsers" || key === "viewMenuAdmin" || key === "viewPublicAdmin" || key === "mrole" || key === "mjabatan" || key === "mprovinsi" || key === "mkota") return;
        const host = button.closest("ul[id^='sub-']");
        const groupId = host ? host.id.replace("sub-", "") : "menu";
        items.push({
          key,
          label: (button.querySelector("span") || button).textContent.trim(),
          group: names[groupId] || "Menu"
        });
      });
      return items;
    }

    function buildDefaultGrants() {
      const grants = {};
      accessRoles().forEach((role) => { grants[role] = {}; });
      menuCatalog().forEach((item) => {
        accessRoles().forEach((role) => {
          if (role === "Eksekutif 1") grants[role][item.key] = (item.group !== "Data Master" && item.key !== "aktifitas") || item.key === "mobile";
          else if (role === "Eksekutif 2") grants[role][item.key] = ["viewMap", "viewKeselamatan", "viewKetertiban", "viewKelancaran", "mobile"].includes(item.key) || item.group === "Data Sekunder";
          else if (role === "Eksekutif 3") grants[role][item.key] = ["viewMap", "viewKeselamatan", "viewKeamanan", "mobile"].includes(item.key);
          else if (role === "Operator") grants[role][item.key] = item.key === "viewMap" || item.key === "viewKeselamatan" || item.key === "mobile";
          else grants[role][item.key] = false;
        });
      });
      return grants;
    }

    function applySavedGrants(saved) {
      const defaults = buildDefaultGrants();
      Object.keys(defaults).forEach((role) => {
        defaults[role] = Object.assign(defaults[role], (saved && saved[role]) || {});
      });
      Object.keys(saved || {}).forEach((role) => {
        if (role === "Admin") return;
        defaults[role] = Object.assign(defaults[role] || {}, saved[role] || {});
      });
      menuGrants = defaults;
    }

    function canOpen(key) {
      if (!session) return false;
      if (key === "profile") return true;
      if (key === "viewUsers" || key === "viewMenuAdmin" || key === "viewPublicAdmin" || key === "users" || key === "mrole" || key === "mjabatan" || key === "mprovinsi" || key === "mkota") return session.role === "Admin";
      if (key === "viewSurvey") key = "mobile";
      if (session.role === "Admin") return true;
      return !!(menuGrants && menuGrants[session.role] && menuGrants[session.role][key]);
    }

    function setShown(element, on) {
      if (element) element.style.display = on ? "" : "none";
    }

    function applyMenuAccess() {
      document.querySelectorAll("#sidebar [data-side], #sidebar [data-leaf]").forEach((button) => {
        const key = button.dataset.side || button.dataset.leaf;
        const on = canOpen(key);
        setShown(button, on);
        const li = button.parentElement;
        if (li && li.tagName === "LI" && !li.querySelector("ul")) setShown(li, on);
      });
      document.querySelectorAll("#sidebar [data-toggle]").forEach((toggle) => {
        const panel = document.getElementById("sub-" + toggle.dataset.toggle);
        if (!panel) return;
        const visible = [...panel.querySelectorAll("[data-side], [data-leaf]")].some((button) => button.style.display !== "none");
        setShown(toggle, visible);
        setShown(panel, visible);
        if (toggle.parentElement && toggle.parentElement.tagName === "LI") setShown(toggle.parentElement, visible);
      });
      setShown(document.getElementById("accountUsers"), session && session.role === "Admin");
    }

    function paintSession() {
      if (!session) return;
      const initials = personInitials(session.name);
      const meta = session.role + " · " + scopeLabel(session);
      document.getElementById("accountInitial").textContent = initials;
      document.getElementById("accountName").textContent = session.name;
      document.getElementById("accountMeta").textContent = meta;
      const levelName = roleLevel(session) === "nasional" ? "Nasional" : roleLevel(session) === "provinsi" ? "Provinsi" : "Kota";
      const wilayah = roleLevel(session) === "nasional"
        ? "Seluruh Indonesia"
        : roleLevel(session) === "provinsi"
          ? (session.jabatan || session.provinsi || "Provinsi")
          : (session.kota || "Kota");
      const notes = {
        Admin: "Semua menu dan data nasional bisa dibuka, termasuk pengaturan pengguna dan menu.",
        "Eksekutif 1": "Data nasional seluruh polda. Menu yang tampil mengikuti pengaturan admin.",
        "Eksekutif 2": "Hanya data " + wilayah + ". Angka nasional dan polda lain tidak ditampilkan.",
        "Eksekutif 3": "Hanya data polres " + (session.kota || wilayah) + ". Data di luar polres ini tidak ditampilkan.",
        Operator: "Data peta dan keselamatan setingkat polres " + (session.kota || wilayah) + ". Input gangguan hanya laporan Anda sendiri."
      };
      document.getElementById("menuAccountInitial").textContent = initials;
      document.getElementById("menuAccountName").textContent = session.name;
      document.getElementById("menuAccountJabatan").textContent = session.jabatan || session.role;
      document.getElementById("menuAccountEmail").textContent = session.email;
      document.getElementById("menuAccountScope").textContent = levelName + " · " + wilayah;
      document.getElementById("profileInitial").textContent = initials;
      document.getElementById("profileName").textContent = session.name;
      document.getElementById("profileJabatan").textContent = session.jabatan || session.role;
      document.getElementById("profileRoleName").textContent = session.role;
      document.getElementById("profileStatus").textContent = session.status || "Aktif";
      document.getElementById("profileStatus").className = "mt-3 text-xs " + ((session.status || "Aktif") === "Aktif" ? "text-emerald-200" : "text-amber-200");
      document.getElementById("profileId").textContent = session.id;
      document.getElementById("profileEmail").textContent = session.email;
      document.getElementById("profileRoleDetail").textContent = session.role;
      document.getElementById("profileJabatanDetail").textContent = session.jabatan || session.role;
      document.getElementById("profileLevel").textContent = levelName;
      document.getElementById("profileArea").textContent = wilayah;
      document.getElementById("profileNote").textContent = notes[session.role] || "Data yang tampil mengikuti peran dan wilayah akun ini.";
    }

    function sessionPoldaKey(user) {
      const row = user || session;
      if (!row) return "";
      return row.polda || poldaKey(row.provinsi) || "";
    }

    function kotaPolda(kota) {
      if (!kota) return "";
      if (METRO_KOTA.includes(kota)) return "Jakarta Raya";
      const row = (masterCatalog.kota || []).find((item) => item.name === kota);
      if (row && row.provinsi) return poldaKey(row.provinsi);
      return poldaKey(kota);
    }

    function kotaAllowed(kota) {
      if (!session) return true;
      const level = roleLevel(session);
      if (session.role === "Admin" || level === "nasional") return true;
      const key = sessionPoldaKey();
      if (level === "provinsi") {
        if (key === "Jakarta Raya") return METRO_KOTA.includes(kota);
        return kotaPolda(kota) === key;
      }
      return kota === session.kota;
    }

    function markerAllowed(kota) {
      return kotaAllowed(kota);
    }

    function applyMapScope() {
      if (!map) return;
      const counts = { AG: 0, PG: 0, GN: 0, KA: 0 };
      const level = roleLevel(session);
      Object.entries(layerGroups).forEach(([type, items]) => {
        items.forEach((item) => {
          const scoped = item.get && item.get("scoped");
          const allowed = scoped ? kotaAllowed(item.get("kota")) : level === "nasional";
          const layerOn = document.getElementById("layer" + type).checked;
          item.setMap(allowed && layerOn ? map : null);
          if (scoped && allowed) counts[type] += 1;
        });
      });
      Object.entries(counts).forEach(([type, count]) => {
        const node = document.getElementById("count" + type);
        if (node) node.textContent = String(count);
      });
      const where = roleLevel(session) === "nasional" ? "seluruh wilayah" : scopeLabel(session);
      const hintText = "Cakupan " + where + ". Garis biru adalah jalur kereta. Gunakan layer GIS untuk CCTV, lapgiat, macet, dan JPL.";
      const hint = document.getElementById("mapHint");
      if (hint) hint.textContent = hintText;
      const lead = document.getElementById("mapInfoLead");
      if (lead) lead.textContent = hintText;
      applyGisScope();
      fitMapToScope();
    }
