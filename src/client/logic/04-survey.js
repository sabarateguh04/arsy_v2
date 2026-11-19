    const SURVEY_CAUSES = {
      Alam: ["Banjir", "Tanah Longsor", "Pohon Tumbang", "Hujan", "Berkabut"],
      Jalan: ["Jalan Berlubang", "Jalan Bergelombang", "Jalan Berkerikil", "Jalan Licin", "Jalan Menyempit", "Ada Pembangunan", "Ada Pedestrian", "Tidak Ada Pedestrian", "Kegiatan di Badan Jalan", "Kontur Jalan Miring", "Tanjakan atau Turunan Curam", "Tikungan Terlalu Tajam", "Akses Jalan Bersinggungan", "Lonjakan Volume Kendaraan"],
      "Giat Masyarakat": ["Unras", "Konser", "Pameran", "Festival", "Olahraga", "Keagamaan"],
      "Prasarana Jalan": ["APILL", "Perlintasan KA tanpa Palang", "Lampu Lalu Lintas", "Penerangan", "Rambu Jalan", "Marka Jalan", "Separator", "Tidak Ada Rambu", "Tidak Ada Marka", "Lainnya"],
      Kendaraan: ["Mogok", "Parkir Liar", "Muatan Berlebih", "Melebihi Batas Kecepatan", "Emisi dan Gas Buang", "Konsleting", "Pecah Ban", "Rem Blong", "Sistem Kemudi", "Gangguan Mesin", "Lampu Isyarat", "Sistem Transmisi", "Lainnya"],
      Peraturan: ["Andalalin", "Angkutan Online", "Regulasi Alat Berat", "Jasa Derek", "Rental Kendaraan", "Ambulans"],
      Pengemudi: ["Mengantuk", "Sikap Mental", "Minim Pengetahuan Rambu", "Lalai Merawat Kendaraan"],
      Infrastruktur: ["Pasar Tumpah", "Antrean Gerbang Tol", "Pusat Perbelanjaan", "Tempat Wisata", "Objek Vital", "Perkantoran", "Jembatan", "Stasiun", "Terminal Bus", "Bandara"],
      "Giat Kenegaraan": ["Rute VIP dan VVIP", "Upacara Kenegaraan", "Sidang Kenegaraan", "Tamu Negara"]
    };

    function surveyStamp() {
      return new Date().toLocaleString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });
    }

    function paintSurvey() {
      if (!session) return;
      const level = roleLevel(session);
      const poldaName = (session.polda || poldaKey(session.provinsi)) === "Jakarta Raya"
        ? "Polda Metro Jaya"
        : session.polda
          ? "Polda " + session.polda
          : "Nasional";
      const polresName = level === "kota" && session.kota
        ? (session.polda === "Jakarta Raya" && session.kota === "Depok" ? "Polres Metro Depok" : "Polres " + session.kota)
        : level === "provinsi"
          ? "Seluruh polres di wilayah ini"
          : "Nasional";
      document.getElementById("surveyDate").value = surveyStamp();
      document.getElementById("surveyOfficer").value = session.name + " · " + session.id;
      document.getElementById("surveyPolda").value = poldaName;
      document.getElementById("surveyPolres").value = polresName;
      renderSurveyTable();
    }

    let surveyReports = [];
    const surveyOpen = new Set();
    const SURVEY_BADGE = { PG: "survey-pg", AG: "survey-ag", GN: "survey-gn" };

    function surveyVisible(row) {
      if (!session) return false;
      const level = roleLevel(session);
      if (level === "nasional") return true;
      const key = session.polda || poldaKey(session.provinsi);
      if (row.poldaKey !== key) return false;
      return level === "provinsi" || row.kota === session.kota;
    }

    function surveyWhen(date) {
      const value = date instanceof Date ? date : new Date(date);
      return {
        day: value.toLocaleDateString("id-ID", { day: "numeric", month: "short" }),
        time: value.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
      };
    }

    function readPhoto(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve({ name: file.name, data: reader.result });
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
      });
    }

    async function persistGrants() {
      try {
        const response = await fetch("/api/grants", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(menuGrants)
        });
        return response.ok;
      } catch (error) {
        return false;
      }
    }

    function renderSurveyTable() {
      const rows = surveyReports.filter(surveyVisible);
      const empty = document.getElementById("surveyEmpty");
      const wrap = document.getElementById("surveyTableWrap");
      const body = document.getElementById("surveyRows");
      const count = document.getElementById("surveyCount");
      const tally = document.getElementById("surveyTally");
      if (!body) return;
      const total = rows.length;
      const scoped = session && roleLevel(session) !== "nasional";
      count.textContent = total
        ? total + " laporan" + (scoped ? " pada cakupan akun ini" : "")
        : "Belum ada laporan di sesi ini.";
      tally.innerHTML = total
        ? ["PG", "AG", "GN"].map((level) => `<span class="${SURVEY_BADGE[level]} rounded-full px-2.5 py-1">${level} ${rows.filter((row) => row.tingkat === level).length}</span>`).join("")
        : "";
      empty.classList.toggle("hidden", total > 0);
      wrap.classList.toggle("hidden", total === 0);
      body.innerHTML = rows.map((row) => {
        const when = surveyWhen(row.at);
        const open = surveyOpen.has(row.id);
        const thumbs = row.photos.map((photo) => `<img src="${esc(photo.url)}" alt="" class="h-8 w-8 rounded-lg object-cover">`).join("");
        const detail = open ? `
          <tr class="border-b border-[#eef3f8] bg-[#f7f9fc]">
            <td colspan="7" class="px-4 py-4">
              <dl class="grid gap-3 sm:grid-cols-3">
                <div><dt class="text-[11px] uppercase tracking-wide text-slate-400">Jenis giat</dt><dd class="mt-0.5 font-medium text-[#0b1f4a]">${esc(row.giat)}</dd></div>
                <div><dt class="text-[11px] uppercase tracking-wide text-slate-400">Status kerawanan</dt><dd class="mt-0.5 font-medium text-[#0b1f4a]">${esc(row.rawan)}</dd></div>
                <div><dt class="text-[11px] uppercase tracking-wide text-slate-400">Petugas</dt><dd class="mt-0.5 font-medium text-[#0b1f4a]">${esc(row.officer)}</dd></div>
                <div><dt class="text-[11px] uppercase tracking-wide text-slate-400">Polda</dt><dd class="mt-0.5 font-medium text-[#0b1f4a]">${esc(row.polda)}</dd></div>
                <div><dt class="text-[11px] uppercase tracking-wide text-slate-400">Polres</dt><dd class="mt-0.5 font-medium text-[#0b1f4a]">${esc(row.polres)}</dd></div>
                <div><dt class="text-[11px] uppercase tracking-wide text-slate-400">Koordinat</dt><dd class="mt-0.5 font-medium text-[#0b1f4a]">${esc(row.coord)}</dd></div>
              </dl>
              <p class="mt-3 text-sm leading-relaxed text-slate-600">${esc(row.detail)}</p>
              ${row.photos.length ? `<div class="mt-3 flex flex-wrap gap-2">${row.photos.map((photo) => `<img src="${esc(photo.url)}" alt="${esc(photo.name)}" class="h-16 w-16 rounded-xl object-cover">`).join("")}</div>` : ""}
            </td>
          </tr>` : "";
        return `
          <tr class="border-b border-[#eef3f8] align-top">
            <td class="whitespace-nowrap px-4 py-3">
              <p class="font-semibold text-[#0b1f4a]">${esc(when.day)}</p>
              <p class="text-xs text-slate-500">${esc(when.time)}</p>
            </td>
            <td class="px-4 py-3"><span class="${SURVEY_BADGE[row.tingkat] || "survey-pg"} rounded-full px-2.5 py-1 text-xs font-semibold" title="${esc(row.tingkat)}">${esc(row.tingkat)}</span></td>
            <td class="px-4 py-3">
              <p class="max-w-[12rem] font-medium text-[#0b1f4a]">${esc(row.road)}</p>
              <p class="text-xs text-slate-500">${esc(row.rawan)}</p>
            </td>
            <td class="px-4 py-3">
              <p class="max-w-[11rem] text-[#0b1f4a]">${esc(row.penyebab)}</p>
              <p class="text-xs text-slate-500">${esc(row.faktor)}</p>
            </td>
            <td class="hidden px-4 py-3 md:table-cell">
              <p class="text-[#0b1f4a]">${esc(row.officer)}</p>
              <p class="text-xs text-slate-500">${esc(row.polres)}</p>
            </td>
            <td class="px-4 py-3"><div class="flex gap-1">${thumbs}</div></td>
            <td class="whitespace-nowrap px-4 py-3 text-right">
              <button type="button" data-survey-open="${row.id}" class="text-xs font-semibold text-brand-blue">${open ? "Tutup" : "Detail"}</button>
              <button type="button" data-survey-del="${row.id}" class="ml-3 text-xs font-semibold text-slate-400 hover:text-red-600">Hapus</button>
            </td>
          </tr>${detail}`;
      }).join("");
    }

    function fillSurveyCause() {
      const factor = document.getElementById("surveyFaktor").value;
      const wrap = document.getElementById("surveyCauseWrap");
      const select = document.getElementById("surveyCause");
      const otherWrap = document.getElementById("surveyOtherWrap");
      const other = document.getElementById("surveyOther");
      otherWrap.classList.add("hidden");
      other.required = false;
      other.value = "";
      const list = SURVEY_CAUSES[factor];
      if (!list) {
        wrap.classList.add("hidden");
        select.required = false;
        select.innerHTML = "";
        return;
      }
      select.innerHTML = `<option value="" disabled selected>Pilih penyebab</option>` + list.map((item) => `<option>${esc(item)}</option>`).join("");
      wrap.classList.remove("hidden");
      select.required = true;
    }
