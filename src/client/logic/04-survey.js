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
    const SURVEY_LEVEL = { PG: "Potensi Gangguan", AG: "Ambang Gangguan", GN: "Gangguan Nyata" };

    function surveyField(label, value) {
      return `<div class="border-b border-[#eef3f8] px-4 py-3 sm:border-r"><p class="text-[11px] font-semibold uppercase tracking-wide text-slate-400">${label}</p><p class="mt-1 text-sm font-medium text-[#0b1f4a]">${esc(value || "—")}</p></div>`;
    }

    function surveyPhotoThumb(photo, size) {
      const box = size === "lg"
        ? "h-28 w-full sm:h-36"
        : "h-10 w-10";
      return `<button type="button" data-survey-photo="${esc(photo.url)}" data-survey-photo-name="${esc(photo.name || "Foto laporan")}" class="group relative overflow-hidden rounded-xl ring-1 ring-slate-200 transition hover:ring-brand-blue" aria-label="Perbesar ${esc(photo.name || "foto")}">
        <img src="${esc(photo.url)}" alt="${esc(photo.name || "")}" class="${box} object-cover">
        <span class="pointer-events-none absolute inset-0 grid place-items-center bg-slate-950/0 text-white opacity-0 transition group-hover:bg-slate-950/35 group-hover:opacity-100"><i class="fa-solid fa-magnifying-glass-plus text-xs"></i></span>
      </button>`;
    }

    function surveyVisible(row) {
      if (!session) return false;
      if (session.role === "Admin" || roleLevel(session) === "nasional") return true;
      if (session.role === "Operator") {
        if (row.userId) return row.userId === session.id;
        return row.officer === session.name && (!row.kota || row.kota === session.kota);
      }
      const key = sessionPoldaKey();
      if (roleLevel(session) === "provinsi") {
        if (key === "Jakarta Raya") return row.poldaKey === "Jakarta Raya" || METRO_KOTA.includes(row.kota);
        return row.poldaKey === key;
      }
      return row.kota === session.kota;
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
        ? total + " laporan" + (session && session.role === "Operator" ? " Anda" : scoped ? " pada cakupan akun ini" : "")
        : (session && session.role === "Operator" ? "Belum ada laporan yang Anda kirim." : "Belum ada laporan di sesi ini.");
      tally.innerHTML = total
        ? ["PG", "AG", "GN"].map((level) => `<span class="${SURVEY_BADGE[level]} rounded-full px-2.5 py-1">${level} ${rows.filter((row) => row.tingkat === level).length}</span>`).join("")
        : "";
      empty.classList.toggle("hidden", total > 0);
      wrap.classList.toggle("hidden", total === 0);
      body.innerHTML = rows.map((row) => {
        const when = surveyWhen(row.at);
        const open = surveyOpen.has(row.id);
        const thumbs = (row.photos || []).map((photo) => surveyPhotoThumb(photo, "sm")).join("");
        const gallery = (row.photos || []).length
          ? `<div class="border-t border-[#eef3f8] px-4 py-4">
              <p class="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Dokumentasi</p>
              <p class="mt-0.5 text-xs text-slate-500">Klik foto untuk memperbesar.</p>
              <div class="mt-3 grid grid-cols-3 gap-2 sm:max-w-lg">${(row.photos || []).map((photo) => surveyPhotoThumb(photo, "lg")).join("")}</div>
            </div>`
          : "";
        const detail = open ? `
          <tr class="border-b border-[#eef3f8] bg-[#eef3fa]">
            <td colspan="7" class="px-3 py-4 sm:px-4">
              <div class="overflow-hidden rounded-2xl border border-[#d7e3f3] bg-white shadow-sm">
                <div class="flex flex-wrap items-start justify-between gap-3 border-b border-[#eef3f8] px-4 py-3">
                  <div class="min-w-0">
                    <p class="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#f97316]">Detail laporan</p>
                    <h4 class="mt-1 text-base font-semibold text-[#0b1f4a]">${esc(row.road)}</h4>
                    <p class="mt-0.5 text-xs text-slate-500">${esc(when.day)} · ${esc(when.time)} · ${esc(row.officer)}</p>
                  </div>
                  <span class="${SURVEY_BADGE[row.tingkat] || "survey-pg"} rounded-full px-3 py-1 text-xs font-semibold">${esc(row.tingkat)} · ${esc(SURVEY_LEVEL[row.tingkat] || row.tingkat)}</span>
                </div>
                <div class="grid sm:grid-cols-2 lg:grid-cols-3">
                  ${surveyField("Jenis giat", row.giat)}
                  ${surveyField("Status kerawanan", row.rawan)}
                  ${surveyField("Faktor / penyebab", (row.faktor || "") + (row.penyebab ? " · " + row.penyebab : ""))}
                  ${surveyField("Polda", row.polda)}
                  ${surveyField("Polres", row.polres)}
                  ${surveyField("Koordinat", row.coord)}
                </div>
                <div class="border-t border-[#eef3f8] px-4 py-3">
                  <p class="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Keterangan</p>
                  <p class="mt-1 text-sm leading-relaxed text-slate-700">${esc(row.detail)}</p>
                </div>
                ${gallery}
              </div>
            </td>
          </tr>` : "";
        return `
          <tr class="border-b border-[#eef3f8] align-top ${open ? "bg-[#f7f9fc]" : "hover:bg-slate-50/80"}">
            <td class="whitespace-nowrap px-4 py-3">
              <p class="font-semibold text-[#0b1f4a]">${esc(when.day)}</p>
              <p class="text-xs text-slate-500">${esc(when.time)}</p>
            </td>
            <td class="px-4 py-3"><span class="${SURVEY_BADGE[row.tingkat] || "survey-pg"} rounded-full px-2.5 py-1 text-xs font-semibold" title="${esc(SURVEY_LEVEL[row.tingkat] || row.tingkat)}">${esc(row.tingkat)}</span></td>
            <td class="px-4 py-3">
              <p class="max-w-[14rem] font-medium text-[#0b1f4a]">${esc(row.road)}</p>
              <p class="text-xs text-slate-500">${esc(row.rawan)}</p>
            </td>
            <td class="px-4 py-3">
              <p class="max-w-[12rem] text-[#0b1f4a]">${esc(row.penyebab)}</p>
              <p class="text-xs text-slate-500">${esc(row.faktor)}</p>
            </td>
            <td class="hidden px-4 py-3 md:table-cell">
              <p class="text-[#0b1f4a]">${esc(row.officer)}</p>
              <p class="text-xs text-slate-500">${esc(row.polres)}</p>
            </td>
            <td class="px-4 py-3"><div class="flex gap-1.5">${thumbs}</div></td>
            <td class="whitespace-nowrap px-4 py-3 text-right">
              <button type="button" data-survey-open="${row.id}" class="rounded-lg px-2 py-1 text-xs font-semibold text-brand-blue hover:bg-[#e7eef8]">${open ? "Tutup" : "Detail"}</button>
              <button type="button" data-survey-del="${row.id}" class="rounded-lg px-2 py-1 text-xs font-semibold text-slate-400 hover:bg-red-50 hover:text-red-600">Hapus</button>
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

    let surveyPickMap = null;
    let surveyPickMarker = null;
    let surveyPickDraft = { lat: null, lng: null, road: "" };
    let surveyGeoSeq = 0;

    function parseSurveyCoord(value) {
      const match = String(value || "").match(/(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)/);
      if (!match) return null;
      const lat = Number(match[1]);
      const lng = Number(match[2]);
      if (!Number.isFinite(lat) || !Number.isFinite(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180) return null;
      return { lat, lng };
    }

    function reverseSurveyRoad(lat, lng, done) {
      const seq = ++surveyGeoSeq;
      fetch("/api/geo/reverse?lat=" + encodeURIComponent(lat) + "&lng=" + encodeURIComponent(lng))
        .then((response) => response.ok ? response.json() : {})
        .then((data) => {
          if (seq !== surveyGeoSeq) return;
          done((data && (data.road || data.display)) ? String(data.road || data.display.split(",")[0] || "") : "");
        })
        .catch(() => {
          if (seq !== surveyGeoSeq) return;
          done("");
        });
    }

    function formatSurveyCoord(lat, lng) {
      return Number(lat).toFixed(6) + ", " + Number(lng).toFixed(6);
    }

    function surveyPickCenter() {
      const parsed = parseSurveyCoord(document.getElementById("surveyCoord").value);
      if (parsed) return parsed;
      return { lat: MAP_HOME.lat, lng: MAP_HOME.lng };
    }

    function paintSurveyPickDraft() {
      const road = document.getElementById("surveyMapRoadPreview");
      const coord = document.getElementById("surveyMapCoordPreview");
      if (surveyPickDraft.lat == null) {
        road.textContent = "Belum ada titik";
        coord.textContent = "—";
        return;
      }
      road.textContent = surveyPickDraft.road || "Nama jalan belum terdeteksi";
      coord.textContent = formatSurveyCoord(surveyPickDraft.lat, surveyPickDraft.lng);
    }

    function placeSurveyPickMarker(lat, lng) {
      const position = { lat, lng };
      if (!surveyPickMarker) {
        surveyPickMarker = new google.maps.Marker({
          map: surveyPickMap,
          position,
          draggable: true,
          title: "Lokasi gangguan"
        });
        surveyPickMarker.addListener("dragend", () => {
          const at = surveyPickMarker.getPosition();
          pickSurveyPoint(at.lat(), at.lng());
        });
      } else {
        surveyPickMarker.setPosition(position);
      }
      surveyPickMap.panTo(position);
    }

    function pickSurveyPoint(lat, lng, keepRoad) {
      surveyPickDraft = { lat, lng, road: keepRoad || "" };
      paintSurveyPickDraft();
      if (surveyPickMap) placeSurveyPickMarker(lat, lng);
      const hint = document.getElementById("surveyMapHint");
      hint.textContent = "Mencari nama jalan...";
      reverseSurveyRoad(lat, lng, (name) => {
        if (surveyPickDraft.lat !== lat || surveyPickDraft.lng !== lng) return;
        if (name) surveyPickDraft.road = name;
        else if (!surveyPickDraft.road) surveyPickDraft.road = "";
        paintSurveyPickDraft();
        hint.textContent = name
          ? "Titik siap dipakai. Geser penanda jika perlu menyesuaikan."
          : "Koordinat siap. Nama jalan bisa dilengkapi manual setelah dipakai.";
      });
    }

    function ensureSurveyPickMap() {
      if (surveyPickMap) return true;
      if (!window.google || !google.maps) return false;
      surveyPickMap = new google.maps.Map(document.getElementById("surveyPickMap"), {
        center: surveyPickCenter(),
        zoom: 16,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        gestureHandling: "greedy",
        styles: [{ featureType: "poi", stylers: [{ visibility: "off" }] }]
      });
      surveyPickMap.addListener("click", (event) => {
        pickSurveyPoint(event.latLng.lat(), event.latLng.lng());
      });
      return true;
    }

    function openSurveyMap() {
      const modal = document.getElementById("surveyMapModal");
      const hint = document.getElementById("surveyMapHint");
      modal.classList.remove("hidden-section");
      if (!ensureSurveyPickMap()) {
        hint.textContent = "Peta belum siap. Tunggu sebentar, lalu buka lagi.";
        return;
      }
      hint.textContent = "Klik peta untuk menandai titik gangguan.";
      const center = surveyPickCenter();
      const existingRoad = document.getElementById("surveyRoad").value.trim();
      setTimeout(() => {
        google.maps.event.trigger(surveyPickMap, "resize");
        surveyPickMap.setCenter(center);
        if (surveyPickMap.getZoom() < 15) surveyPickMap.setZoom(16);
        pickSurveyPoint(center.lat, center.lng, existingRoad);
      }, 80);
    }

    function closeSurveyMap() {
      document.getElementById("surveyMapModal").classList.add("hidden-section");
    }

    function applySurveyMap() {
      if (surveyPickDraft.lat == null) {
        document.getElementById("surveyMapHint").textContent = "Pilih titik di peta dulu.";
        return;
      }
      document.getElementById("surveyCoord").value = formatSurveyCoord(surveyPickDraft.lat, surveyPickDraft.lng);
      if (surveyPickDraft.road) document.getElementById("surveyRoad").value = surveyPickDraft.road;
      document.getElementById("surveyGpsMsg").textContent = surveyPickDraft.road
        ? "Koordinat dan nama jalan terisi dari peta."
        : "Koordinat terisi dari peta. Lengkapi nama jalan jika perlu.";
      closeSurveyMap();
    }

    function fillSurveyFromGps(lat, lng) {
      document.getElementById("surveyCoord").value = formatSurveyCoord(lat, lng);
      const note = document.getElementById("surveyGpsMsg");
      note.textContent = "Mencari nama jalan...";
      reverseSurveyRoad(lat, lng, (name) => {
        if (name) document.getElementById("surveyRoad").value = name;
        note.textContent = name
          ? "Koordinat dan nama jalan terisi dari perangkat."
          : "Koordinat terisi dari perangkat. Nama jalan bisa dilengkapi manual.";
      });
    }

    function openSurveyPhoto(url, name) {
      const modal = document.getElementById("surveyPhotoModal");
      const image = document.getElementById("surveyPhotoFull");
      const caption = document.getElementById("surveyPhotoCaption");
      image.src = url;
      image.alt = name || "Foto laporan";
      caption.textContent = name || "";
      modal.classList.remove("hidden-section");
    }

    function closeSurveyPhoto() {
      const modal = document.getElementById("surveyPhotoModal");
      modal.classList.add("hidden-section");
      document.getElementById("surveyPhotoFull").src = "";
    }

    document.getElementById("surveyMapBtn").addEventListener("click", openSurveyMap);
    document.getElementById("surveyMapApply").addEventListener("click", applySurveyMap);
    document.querySelectorAll("[data-close-survey-map]").forEach((el) => {
      el.addEventListener("click", closeSurveyMap);
    });
    document.getElementById("surveyMapSearchForm").addEventListener("submit", (event) => {
      event.preventDefault();
      const query = document.getElementById("surveyMapSearch").value.trim();
      const hint = document.getElementById("surveyMapHint");
      if (!query) {
        hint.textContent = "Tulis nama jalan atau tempat yang dicari.";
        return;
      }
      hint.textContent = "Mencari lokasi...";
      fetch("/api/geo/search?q=" + encodeURIComponent(query))
        .then((response) => response.json().then((data) => ({ ok: response.ok, data })))
        .then(({ ok, data }) => {
          if (!ok || data.lat == null) {
            hint.textContent = (data && data.error) || "Lokasi tidak ditemukan. Coba nama jalan yang lebih lengkap.";
            return;
          }
          if (surveyPickMap && surveyPickMap.getZoom() < 16) surveyPickMap.setZoom(17);
          pickSurveyPoint(Number(data.lat), Number(data.lng), data.road || "");
        })
        .catch(() => {
          hint.textContent = "Pencarian lokasi belum siap. Coba lagi.";
        });
    });
    document.querySelectorAll("[data-close-survey-photo]").forEach((el) => {
      el.addEventListener("click", closeSurveyPhoto);
    });
