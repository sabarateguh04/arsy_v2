    function filteredUsers() {
      const query = document.getElementById("userSearch").value.trim().toLowerCase();
      return users
        .map((user, index) => ({ user, index }))
        .filter(({ user }) => {
          const blob = `${user.name} ${user.email} ${user.role} ${user.jabatan || ""} ${user.provinsi} ${user.kota}`.toLowerCase();
          const matchQuery = !query || blob.includes(query);
          const matchStatus = statusFilter === "Semua" || user.status === statusFilter;
          return matchQuery && matchStatus;
        });
    }

    function renderUsers() {
      const rows = filteredUsers();
      const tbody = document.getElementById("userTableBody");
      const userCountBadge = document.getElementById("userCountBadge");
      if (userCountBadge) userCountBadge.textContent = String(users.length);
      document.getElementById("userResultCount").textContent = `${rows.length} pengguna ditampilkan · ${users.length} total`;
      if (!rows.length) {
        tbody.innerHTML = `<tr><td colspan="7" class="px-4 py-10 text-center text-sm text-slate-500">Tidak ada pengguna yang cocok dengan pencarian ini.</td></tr>`;
        return;
      }
      tbody.innerHTML = rows.map(({ user, index }) => {
        const badge = user.status === "Aktif"
          ? "bg-emerald-100 text-emerald-700"
          : user.status === "Menunggu"
            ? "bg-amber-100 text-amber-800"
            : "bg-slate-100 text-slate-500";
        const pending = user.status === "Menunggu"
          ? `<button type="button" data-user-action="approve" data-user-index="${index}" class="grid h-8 w-8 place-items-center rounded-lg text-emerald-600 hover:bg-emerald-50" aria-label="Setujui ${esc(user.name)}"><i class="fa-solid fa-check"></i></button>
              <button type="button" data-user-action="reject" data-user-index="${index}" class="grid h-8 w-8 place-items-center rounded-lg text-amber-700 hover:bg-amber-50" aria-label="Tolak ${esc(user.name)}"><i class="fa-solid fa-xmark"></i></button>`
          : "";
        return `<tr class="border-b border-slate-100 hover:bg-slate-50">
          <td class="px-4 py-3">
            <p class="font-medium text-slate-900">${esc(user.name)}</p>
            <p class="text-xs text-slate-500">${esc(user.email)}</p>
          </td>
          <td class="px-4 py-3 text-slate-500">${esc(user.id)}</td>
          <td class="px-4 py-3"><p>${esc(user.role)}</p><p class="text-xs text-slate-500">${esc(user.jabatan || "")}</p></td>
          <td class="px-4 py-3">${esc(roleLevel(user) === "nasional" ? "Nasional" : user.provinsi)}</td>
          <td class="px-4 py-3">${esc(roleLevel(user) === "kota" ? user.kota : "—")}</td>
          <td class="px-4 py-3"><span class="rounded-full px-2.5 py-1 text-xs font-semibold ${badge}">${esc(user.status)}</span></td>
          <td class="px-4 py-3">
            <div class="flex items-center gap-1">
              ${pending}
              <button type="button" data-user-action="view" data-user-index="${index}" class="grid h-8 w-8 place-items-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-brand-blue" aria-label="Lihat ${esc(user.name)}"><i class="fa-solid fa-eye"></i></button>
              <button type="button" data-user-action="edit" data-user-index="${index}" class="grid h-8 w-8 place-items-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-brand-blue" aria-label="Ubah ${esc(user.name)}"><i class="fa-solid fa-pen"></i></button>
              <button type="button" data-user-action="delete" data-user-index="${index}" class="grid h-8 w-8 place-items-center rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600" aria-label="Hapus ${esc(user.name)}"><i class="fa-solid fa-trash"></i></button>
            </div>
          </td>
        </tr>`;
      }).join("");
    }

    const USER_FIELDS = ["userName", "userEmail", "userPassword", "userRole", "userJabatan", "userProvinsi", "userKota", "userStatus"];

    function fillUserRoles(selected) {
      const select = document.getElementById("userRole");
      const rows = (masterCatalog.roles || []).filter((item) => item.status === "Aktif");
      const names = rows.length ? rows.map((item) => item.name) : ["Admin"].concat(ACCESS_ROLES);
      if (selected && !names.includes(selected)) names.unshift(selected);
      select.innerHTML = names.map((name) => `<option>${esc(name)}</option>`).join("");
      select.value = names.includes(selected) ? selected : names[0];
    }

    function fillUserJabatan(role, jabatan) {
      const select = document.getElementById("userJabatan");
      const rows = (masterCatalog.jabatan || []).filter((item) => item.status === "Aktif" && (!item.role_name || item.role_name === role));
      const names = rows.map((item) => item.name);
      if (!names.length) names.push(role);
      if (jabatan && !names.includes(jabatan)) names.unshift(jabatan);
      select.innerHTML = names.map((name) => `<option>${esc(name)}</option>`).join("");
      select.value = names.includes(jabatan) ? jabatan : names[0];
    }

    function syncUserScopeFields(user, locked) {
      const role = document.getElementById("userRole").value;
      const cakupan = roleCakupan(role);
      const national = cakupan === "nasional";
      const provinceOnly = cakupan === "provinsi";
      const provinsiSelect = document.getElementById("userProvinsi");
      const kotaSelect = document.getElementById("userKota");
      fillUserJabatan(role, user && user.jabatan);
      if (national) {
        provinsiSelect.innerHTML = "<option>Nasional</option>";
        kotaSelect.innerHTML = "<option>—</option>";
      } else {
        fillUserAreas(user && user.provinsi, user && user.kota);
        if (provinceOnly) kotaSelect.innerHTML = "<option>—</option>";
      }
      provinsiSelect.disabled = locked || national;
      kotaSelect.disabled = locked || national || provinceOnly;
    }

    function setUserFields(user, locked) {
      document.getElementById("userName").value = user.name;
      document.getElementById("userEmail").value = user.email;
      document.getElementById("userPassword").value = user.password || "";
      fillUserRoles(user.role);
      document.getElementById("userStatus").value = user.status;
      syncUserScopeFields(user, locked);
      USER_FIELDS.forEach((id) => {
        if (id === "userProvinsi" || id === "userKota") return;
        document.getElementById(id).disabled = locked;
      });
    }

    async function openUserModal(mode, index) {
      await loadCatalog();
      userMode = mode;
      userIndex = index;
      const titles = {
        create: "Tambah pengguna",
        edit: "Ubah pengguna",
        view: "Detail pengguna",
        delete: "Hapus pengguna"
      };
      document.getElementById("userModalTitle").textContent = titles[mode];
      document.getElementById("userDeleteHint").classList.toggle("hidden-section", mode !== "delete");
      document.getElementById("userSaveBtn").classList.toggle("hidden-section", mode === "view" || mode === "delete");
      document.getElementById("userSaveBtn").textContent = mode === "create" ? "Tambah" : "Simpan";
      document.getElementById("userDeleteBtn").classList.toggle("hidden-section", mode !== "delete");
      const blank = { name: "", email: "", password: "arsy1234", role: "Operator", jabatan: "Operator", provinsi: "DKI Jakarta", kota: "Jakarta Pusat", status: "Aktif" };
      const current = index >= 0 ? users[index] : blank;
      setUserFields(current, mode === "view" || mode === "delete");
      document.getElementById("userModal").classList.remove("hidden-section");
    }

    function closeUserModal() {
      document.getElementById("userModal").classList.add("hidden-section");
      USER_FIELDS.forEach((id) => {
        document.getElementById(id).disabled = false;
      });
    }

    function readUserForm() {
      const password = document.getElementById("userPassword").value.trim();
      const draft = {
        name: document.getElementById("userName").value.trim(),
        email: document.getElementById("userEmail").value.trim(),
        role: document.getElementById("userRole").value,
        jabatan: document.getElementById("userJabatan").value,
        provinsi: document.getElementById("userProvinsi").value === "Nasional" ? "" : document.getElementById("userProvinsi").value,
        kota: document.getElementById("userKota").value === "—" ? "" : document.getElementById("userKota").value,
        polda: document.getElementById("userProvinsi").value === "Nasional" ? "" : poldaKey(document.getElementById("userProvinsi").value),
        status: document.getElementById("userStatus").value
      };
      if (userMode === "create") draft.password = password || "arsy1234";
      else if (password) draft.password = password;
      return draft;
    }

    function showUserError(message) {
      const email = document.getElementById("userEmail");
      email.setCustomValidity(message || "");
      if (message) email.reportValidity();
    }

    async function loadUsers() {
      const response = await fetch("/api/users");
      if (!response.ok) return false;
      const rows = await response.json();
      if (!Array.isArray(rows)) return false;
      users = rows;
      renderUsers();
      return true;
    }
