    const MASTER_PAGES = {
      mrole: {
        type: "roles",
        title: "Role",
        lead: "Peran pengguna dan cakupan datanya: nasional, provinsi, atau kota.",
        columns: [["Nama", "name"], ["Cakupan", "cakupan"], ["Status", "status"]],
        fields: [
          { id: "name", label: "Nama", required: true },
          { id: "cakupan", label: "Cakupan", type: "select", options: [["nasional", "Nasional"], ["provinsi", "Provinsi"], ["kota", "Kota"]] },
          { id: "status", label: "Status", type: "select", options: [["Aktif", "Aktif"], ["Nonaktif", "Nonaktif"]] }
        ]
      },
      mjabatan: {
        type: "jabatan",
        title: "Jabatan",
        lead: "Jabatan yang bisa dipilih saat menambah atau mengubah pengguna.",
        columns: [["Nama", "name"], ["Role", "role_name"], ["Status", "status"]],
        fields: [
          { id: "name", label: "Nama", required: true },
          { id: "role_name", label: "Role", type: "role" },
          { id: "status", label: "Status", type: "select", options: [["Aktif", "Aktif"], ["Nonaktif", "Nonaktif"]] }
        ]
      },
      mprovinsi: {
        type: "provinsi",
        title: "Provinsi",
        lead: "Daftar provinsi untuk cakupan wilayah akun.",
        columns: [["Nama", "name"], ["Status", "status"]],
        fields: [
          { id: "name", label: "Nama", required: true },
          { id: "status", label: "Status", type: "select", options: [["Aktif", "Aktif"], ["Nonaktif", "Nonaktif"]] }
        ]
      },
      mkota: {
        type: "kota",
        title: "Kota",
        lead: "Daftar kota, masing-masing terhubung ke satu provinsi.",
        columns: [["Nama", "name"], ["Provinsi", "provinsi"], ["Status", "status"]],
        fields: [
          { id: "name", label: "Nama", required: true },
          { id: "provinsi", label: "Provinsi", type: "provinsi" },
          { id: "status", label: "Status", type: "select", options: [["Aktif", "Aktif"], ["Nonaktif", "Nonaktif"]] }
        ]
      }
    };

    let masterKey = "mrole";
    let masterRows = [];
    let masterMode = "create";
    let masterIndex = -1;

    function masterPage() {
      return MASTER_PAGES[masterKey] || MASTER_PAGES.mrole;
    }

    function masterId(row) {
      return masterPage().type === "menus" ? row.menu_key : row.id;
    }

    async function loadMasterRows() {
      const page = masterPage();
      const response = await fetch("/api/master/" + page.type);
      if (!response.ok) {
        masterRows = [];
        return;
      }
      const rows = await response.json();
      masterRows = Array.isArray(rows) ? rows : [];
    }

    function renderMasterTable() {
      const page = masterPage();
      const head = page.columns.map((col) => `<th class="px-4 py-3 font-semibold">${esc(col[0])}</th>`).join("") + `<th class="px-4 py-3 font-semibold">Aksi</th>`;
      document.getElementById("masterHead").innerHTML = head;
      document.getElementById("masterCount").textContent = masterRows.length + " data";
      const tbody = document.getElementById("masterBody");
      if (!masterRows.length) {
        tbody.innerHTML = `<tr><td colspan="${page.columns.length + 1}" class="px-4 py-10 text-center text-sm text-slate-500">Belum ada data.</td></tr>`;
        return;
      }
      tbody.innerHTML = masterRows.map((row, index) => {
        const badge = row.status === "Aktif" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500";
        const cells = page.columns.map((col) => {
          const value = row[col[1]] || "—";
          if (col[1] === "status") return `<td class="px-4 py-3"><span class="rounded-full px-2.5 py-1 text-xs font-semibold ${badge}">${esc(value)}</span></td>`;
          if (col[1] === "cakupan") return `<td class="px-4 py-3 text-slate-600">${esc(value === "nasional" ? "Nasional" : value === "provinsi" ? "Provinsi" : "Kota")}</td>`;
          return `<td class="px-4 py-3 ${col[1] === "name" || col[1] === "label" ? "font-medium text-slate-900" : "text-slate-600"}">${esc(value)}</td>`;
        }).join("");
        return `<tr class="border-b border-slate-100 hover:bg-slate-50">${cells}<td class="px-4 py-3">
          <div class="flex items-center gap-1">
            <button type="button" data-master-action="edit" data-master-index="${index}" class="grid h-8 w-8 place-items-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-brand-blue" aria-label="Ubah"><i class="fa-solid fa-pen"></i></button>
            <button type="button" data-master-action="delete" data-master-index="${index}" class="grid h-8 w-8 place-items-center rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600" aria-label="Hapus"><i class="fa-solid fa-trash"></i></button>
          </div>
        </td></tr>`;
      }).join("");
    }

    function masterFieldHtml(field, row, locked) {
      const value = row && row[field.id] != null ? row[field.id] : "";
      const disabled = locked ? " disabled" : "";
      if (field.type === "select") {
        const options = field.options.map((option) => `<option value="${esc(option[0])}" ${option[0] === value ? "selected" : ""}>${esc(option[1])}</option>`).join("");
        return `<label class="block text-sm font-medium text-slate-700">${esc(field.label)}<select id="master-field-${field.id}" class="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"${disabled}>${options}</select></label>`;
      }
      if (field.type === "role") {
        const options = (masterCatalog.roles || []).map((role) => `<option value="${esc(role.name)}" ${role.name === value ? "selected" : ""}>${esc(role.name)}</option>`).join("");
        return `<label class="block text-sm font-medium text-slate-700">${esc(field.label)}<select id="master-field-${field.id}" class="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"${disabled}><option value="">Semua role</option>${options}</select></label>`;
      }
      if (field.type === "provinsi") {
        const options = (masterCatalog.provinsi || []).filter((item) => item.status === "Aktif").map((item) => `<option value="${esc(item.name)}" ${item.name === value ? "selected" : ""}>${esc(item.name)}</option>`).join("");
        return `<label class="block text-sm font-medium text-slate-700">${esc(field.label)}<select id="master-field-${field.id}" class="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"${disabled}>${options}</select></label>`;
      }
      return `<label class="block text-sm font-medium text-slate-700">${esc(field.label)}<input id="master-field-${field.id}" value="${esc(value)}" ${field.required ? "required" : ""} class="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"${disabled}></label>`;
    }

    function openMasterModal(mode, index) {
      const page = masterPage();
      masterMode = mode;
      masterIndex = index;
      const row = index >= 0 ? masterRows[index] : {};
      const locked = mode === "delete";
      document.getElementById("masterModalTitle").textContent = mode === "create" ? "Tambah " + page.title : mode === "edit" ? "Ubah " + page.title : "Hapus " + page.title;
      document.getElementById("masterDeleteHint").classList.toggle("hidden-section", mode !== "delete");
      document.getElementById("masterSaveBtn").classList.toggle("hidden-section", mode === "delete");
      document.getElementById("masterDeleteBtn").classList.toggle("hidden-section", mode !== "delete");
      document.getElementById("masterFormError").classList.add("hidden-section");
      document.getElementById("masterFields").innerHTML = page.fields.map((field) => masterFieldHtml(field, row, locked)).join("");
      document.getElementById("masterModal").classList.remove("hidden-section");
    }

    function closeMasterModal() {
      document.getElementById("masterModal").classList.add("hidden-section");
    }

    function readMasterForm() {
      const data = {};
      masterPage().fields.forEach((field) => {
        const node = document.getElementById("master-field-" + field.id);
        data[field.id] = node ? node.value.trim() : "";
      });
      return data;
    }

    async function paintMaster(key) {
      masterKey = key;
      const page = masterPage();
      document.getElementById("masterTitle").textContent = page.title;
      document.getElementById("masterLead").textContent = page.lead;
      await loadMasterRows();
      renderMasterTable();
    }

    function roleShort(name) {
      if (name === "Operator") return "OP";
      const digit = String(name).match(/(\d+)/);
      if (String(name).indexOf("Eksekutif") === 0 && digit) return "E" + digit[1];
      return String(name || "").slice(0, 2).toUpperCase() || "R";
    }

    function grantGroupIcon(group) {
      if (group === "Dashboard") return "fa-gauge-high";
      if (group === "Data Primer") return "fa-database";
      if (group === "Data Sekunder") return "fa-folder-open";
      if (group === "Data Master") return "fa-sliders";
      return "fa-layer-group";
    }

    function paintAccessMatrix(headId, bodyId) {
      const roles = accessRoles();
      const skip = { viewUsers: true, viewMenuAdmin: true, mrole: true, mjabatan: true, mprovinsi: true, mkota: true };
      let items = (masterCatalog.menus || []).filter((item) => item.status === "Aktif" && !skip[item.menu_key]);
      if (!items.length) {
        items = menuCatalog().map((item) => ({ menu_key: item.key, label: item.label, grup: item.group, status: "Aktif" }));
      }
      const grouped = [];
      items.forEach((item) => {
        if (!grouped.length || grouped[grouped.length - 1].group !== item.grup) grouped.push({ group: item.grup, rows: [] });
        grouped[grouped.length - 1].rows.push(item);
      });
      document.getElementById(headId).innerHTML = `<th class="grant-col-menu">Menu</th>` + roles.map((role) => `<th class="grant-col-role"><span class="grant-role-mark">${esc(roleShort(role))}</span><span class="grant-role-name">${esc(role)}</span></th>`).join("");
      if (!menuGrants) menuGrants = buildDefaultGrants();
      roles.forEach((role) => {
        if (!menuGrants[role]) menuGrants[role] = {};
      });
      let html = "";
      grouped.forEach((block) => {
        html += `<tr class="grant-group"><td colspan="${roles.length + 1}"><span class="grant-group-label"><i class="fa-solid ${grantGroupIcon(block.group)}"></i>${esc(block.group)}<span class="grant-group-count">${block.rows.length} menu</span></span></td></tr>`;
        block.rows.forEach((item) => {
          const cells = roles.map((role) => {
            const on = !!(menuGrants[role] && menuGrants[role][item.menu_key]);
            return `<td class="grant-col-role"><label class="grant-toggle" title="${esc(role)} · ${esc(item.label)}"><input type="checkbox" data-grant-role="${esc(role)}" data-grant-key="${esc(item.menu_key)}" ${on ? "checked" : ""}><span></span></label></td>`;
          }).join("");
          html += `<tr class="grant-row"><td class="grant-col-menu">${esc(item.label)}</td>${cells}</tr>`;
        });
      });
      document.getElementById(bodyId).innerHTML = html || `<tr><td class="px-4 py-10 text-center text-sm text-slate-500" colspan="${roles.length + 1}">Belum ada menu.</td></tr>`;
      const meta = document.getElementById("menuGrantMeta");
      if (meta) meta.textContent = roles.length + " peran · " + items.length + " menu";
    }

    function showMasterError(message) {
      const node = document.getElementById("masterFormError");
      if (!message) {
        node.classList.add("hidden-section");
        node.textContent = "";
        return;
      }
      node.textContent = message;
      node.classList.remove("hidden-section");
    }

    document.getElementById("masterAddBtn").addEventListener("click", () => openMasterModal("create", -1));
    document.getElementById("masterBody").addEventListener("click", (event) => {
      const button = event.target.closest("[data-master-action]");
      if (!button) return;
      openMasterModal(button.dataset.masterAction, Number(button.dataset.masterIndex));
    });
    document.getElementById("masterForm").addEventListener("submit", async (event) => {
      event.preventDefault();
      if (masterMode !== "create" && masterMode !== "edit") return;
      const page = masterPage();
      const draft = readMasterForm();
      showMasterError("");
      const current = masterIndex >= 0 ? masterRows[masterIndex] : null;
      const response = masterMode === "create"
        ? await fetch("/api/master/" + page.type, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(draft) })
        : await fetch("/api/master/" + page.type + "/" + encodeURIComponent(masterId(current)), { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(draft) });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        showMasterError(data.error || "Data belum tersimpan.");
        return;
      }
      closeMasterModal();
      await loadCatalog();
      await paintMaster(masterKey);
    });
    document.getElementById("masterDeleteBtn").addEventListener("click", async () => {
      if (masterIndex < 0) return;
      const page = masterPage();
      const current = masterRows[masterIndex];
      const response = await fetch("/api/master/" + page.type + "/" + encodeURIComponent(masterId(current)), { method: "DELETE" });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        showMasterError(data.error || "Data belum terhapus.");
        return;
      }
      closeMasterModal();
      await loadCatalog();
      await paintMaster(masterKey);
    });
    document.querySelectorAll("[data-close-master]").forEach((el) => {
      el.addEventListener("click", closeMasterModal);
    });
