    const MAP_HOME = { lat: -6.34, lng: 106.83, zoom: 11 };
    const TYPE_META = {
      AG: { label: "Antrian ringan", badge: "bg-yellow-400 text-slate-900" },
      PG: { label: "Potensi gangguan", badge: "bg-brand-orange text-white" },
      GN: { label: "Gangguan nyata", badge: "bg-red-500 text-white" },
      KA: { label: "Perlintasan kereta", badge: "bg-brand-blue text-white" }
    };
    const MARKER_COLORS = { AG: "#eab308", PG: "#f97316", GN: "#ef4444", KA: "#1e3a8a" };
    const gisGroups = {};
    const gisStatusOn = { aktif: true, liar: true, ditutup: true, flyover: true, lain: true };
    const GIS_IDS = {
      kota: "gisKota",
      cctv: "gisCctv",
      perangkat: "gisPerangkat",
      petugas: "gisPetugas",
      contingency: "gisContingency",
      rutin: "gisRutin",
      macet: "gisMacet",
      jpl: "gisJpl"
    };
    const GIS_KIND = {
      kota: { label: "Kabupaten / Kota", color: "#4f46e5", icon: "fa-city" },
      cctv: { label: "CCTV", color: "#2563eb", icon: "fa-video" },
      perangkat: { label: "Perangkat", color: "#16a34a", icon: "fa-walkie-talkie" },
      petugas: { label: "Petugas", color: "#0d9488", icon: "fa-user-shield" },
      contingency: { label: "Lapgiat Contingency", color: "#ef4444", icon: "fa-triangle-exclamation" },
      rutin: { label: "Lapgiat Rutin", color: "#7c3aed", icon: "fa-clipboard-list" },
      macet: { label: "Macet", color: "#f59e0b", icon: "fa-traffic-light" },
      jpl: { label: "JPL / Pintu KA", color: "#7c3aed", icon: "fa-train" }
    };
    const JPL_STATUS = {
      aktif: { label: "Gerbang aktif (dijaga)", color: "#22c55e" },
      liar: { label: "Tidak dijaga / liar", color: "#ef4444" },
      ditutup: { label: "Ditutup", color: "#14b8a6" },
      flyover: { label: "Tidak sebidang (flyover/underpass)", color: "#38bdf8" },
      lain: { label: "Status lain", color: "#a855f7" }
    };
    let activeMarker = null;
    let pointOpenedAt = 0;
    let mapDesk = "statistik";
    let gisBodyOpen = true;

    function esc(value) {
      return String(value).replace(/[&<>"']/g, (ch) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      }[ch]));
    }

    const RAIL_ROUTES = [
      {
        id: "bogor",
        name: "Jalur Bogor",
        path: [
          { lat: -6.1376, lng: 106.8148 },
          { lat: -6.1494, lng: 106.8197 },
          { lat: -6.1605, lng: 106.8274 },
          { lat: -6.1670, lng: 106.8307 },
          { lat: -6.1858, lng: 106.8328 },
          { lat: -6.1986, lng: 106.8411 },
          { lat: -6.2101, lng: 106.8503 },
          { lat: -6.2262, lng: 106.8585 },
          { lat: -6.2427, lng: 106.8584 },
          { lat: -6.2845, lng: 106.8444 },
          { lat: -6.307640, lng: 106.838920 },
          { lat: -6.329820, lng: 106.833410 },
          { lat: -6.3606, lng: 106.8317 },
          { lat: -6.369140, lng: 106.831860 },
          { lat: -6.3915, lng: 106.8226 },
          { lat: -6.4052, lng: 106.8175 },
          { lat: -6.449360, lng: 106.807620 },
          { lat: -6.485820, lng: 106.793960 },
          { lat: -6.530780, lng: 106.800460 },
          { lat: -6.5944, lng: 106.7903 }
        ]
      },
      {
        id: "bekasi",
        name: "Jalur Bekasi",
        path: [
          { lat: -6.2101, lng: 106.8503 },
          { lat: -6.2152, lng: 106.8705 },
          { lat: -6.2138, lng: 106.9014 },
          { lat: -6.2165, lng: 106.9218 },
          { lat: -6.220840, lng: 106.948160 },
          { lat: -6.225420, lng: 106.979360 },
          { lat: -6.235620, lng: 106.996840 }
        ]
      },
      {
        id: "tangerang",
        name: "Jalur Tangerang",
        path: [
          { lat: -6.1856, lng: 106.8110 },
          { lat: -6.1552, lng: 106.8016 },
          { lat: -6.160640, lng: 106.769840 },
          { lat: -6.1556, lng: 106.7052 },
          { lat: -6.172180, lng: 106.665720 },
          { lat: -6.1766, lng: 106.6330 }
        ]
      },
      {
        id: "serpong",
        name: "Jalur Serpong",
        path: [
          { lat: -6.1858, lng: 106.8328 },
          { lat: -6.1856, lng: 106.8110 },
          { lat: -6.2078, lng: 106.7976 },
          { lat: -6.2370, lng: 106.7826 },
          { lat: -6.2692, lng: 106.7550 },
          { lat: -6.301820, lng: 106.710420 },
          { lat: -6.3160, lng: 106.6768 },
          { lat: -6.320160, lng: 106.665840 }
        ]
      }
    ];

    function markerIcon(type, on, meta) {
      if (type === "KA" && meta) return palangIcon(meta.kategori, meta.bearing, on);
      return {
        path: google.maps.SymbolPath.CIRCLE,
        scale: on ? 12 : 8,
        fillColor: MARKER_COLORS[type],
        fillOpacity: 1,
        strokeColor: on ? "#0b1f4a" : "#ffffff",
        strokeWeight: on ? 3 : 2
      };
    }

    function palangIcon(kategori, bearing, on) {
      const rotation = bearing - 90;
      if (kategori === "Sebidang tanpa palang") {
        return {
          path: "M -6,-6 L 6,6 M 6,-6 L -6,6",
          scale: on ? 1.5 : 1.2,
          strokeColor: "#ef4444",
          strokeWeight: 2,
          fillOpacity: 0,
          rotation
        };
      }
      return {
        path: "M -14,-2.4 L 14,-2.4 L 14,2.4 L -14,2.4 Z",
        scale: on ? 1.3 : 1,
        fillColor: kategori === "Sebidang berpenjaga" ? "#f97316" : "#dc2626",
        fillOpacity: 1,
        strokeColor: "#ffffff",
        strokeWeight: 1.5,
        rotation
      };
    }

    function gisRand(seed) {
      let x = seed % 2147483647;
      if (x <= 0) x += 2147483646;
      return function () {
        x = (x * 16807) % 2147483647;
        return (x - 1) / 2147483646;
      };
    }

    function jplStatusAt(index) {
      const slot = index % 100;
      if (slot === 0) return "lain";
      if (slot < 43) return "aktif";
      if (slot < 83) return "liar";
      if (slot < 89) return "ditutup";
      return "flyover";
    }

    function buildGisCatalog() {
      const photo = "/img/stock/d82d11e8105e.jpg";
      const points = [];
      const cities = [
        ["Jakarta Pusat", -6.1754, 106.8272], ["Jakarta Utara", -6.1384, 106.8827], ["Jakarta Barat", -6.1683, 106.7588],
        ["Jakarta Selatan", -6.2615, 106.8106], ["Jakarta Timur", -6.2250, 106.9004], ["Kepulauan Seribu", -5.6110, 106.5580],
        ["Depok", -6.4025, 106.7942], ["Tangerang", -6.1783, 106.6300], ["Tangerang Selatan", -6.2889, 106.7180],
        ["Bekasi", -6.2383, 106.9756], ["Bogor", -6.5971, 106.8060], ["Bandung", -6.9175, 107.6191],
        ["Cimahi", -6.8720, 107.5420], ["Cirebon", -6.7320, 108.5523], ["Sukabumi", -6.9277, 106.9300],
        ["Tasikmalaya", -7.3274, 108.2208], ["Banjar", -7.3667, 108.5333], ["Serang", -6.1200, 106.1503],
        ["Cilegon", -6.0182, 106.0558], ["Semarang", -6.9667, 110.4167], ["Surakarta", -7.5755, 110.8243],
        ["Magelang", -7.4797, 110.2177], ["Pekalongan", -6.8888, 109.6753], ["Salatiga", -7.3305, 110.5084],
        ["Tegal", -6.8797, 109.1256], ["Yogyakarta", -7.7956, 110.3695], ["Surabaya", -7.2575, 112.7521],
        ["Malang", -7.9666, 112.6326], ["Kediri", -7.8480, 112.0160], ["Madiun", -7.6298, 111.5239],
        ["Mojokerto", -7.4664, 112.4338], ["Pasuruan", -7.6453, 112.9075], ["Probolinggo", -7.7543, 113.2159],
        ["Blitar", -8.0955, 112.1609]
      ];
      cities.forEach((row, index) => {
        points.push({
          id: "KOTA-" + String(index + 1).padStart(2, "0"),
          kind: "kota",
          kota: row[0],
          lat: row[1],
          lng: row[2],
          title: row[0],
          desc: "Layer administrasi kabupaten/kota untuk pemantauan Satupeta.",
          photo
        });
      });
      [
        ["CCTV-01", "CCTV Bundaran HI", "Jakarta Pusat", -6.1754, 106.8272],
        ["CCTV-02", "CCTV Cawang", "Jakarta Timur", -6.2427, 106.8736],
        ["CCTV-03", "CCTV Margonda", "Depok", -6.3940, 106.8226],
        ["CCTV-04", "CCTV Daan Mogot", "Jakarta Barat", -6.1683, 106.7712],
        ["CCTV-05", "CCTV Juanda Bekasi", "Bekasi", -6.2365, 106.9921],
        ["CCTV-06", "CCTV Serpong", "Tangerang Selatan", -6.3018, 106.7104]
      ].forEach((row) => {
        points.push({ id: row[0], kind: "cctv", title: row[1], kota: row[2], lat: row[3], lng: row[4], desc: "Kamera pantau arus dan kejadian di koridor prioritas.", photo: "/img/stock/cb9ee2741b7a.jpg", jam: "24 jam" });
      });
      points.push({
        id: "PTG-01",
        kind: "petugas",
        title: "Patroli Sudirman",
        kota: "Jakarta Pusat",
        lat: -6.2088,
        lng: 106.8456,
        desc: "Unit patroli aktif di koridor Sudirman.",
        photo: "/img/stock/242293df78b4.jpg",
        jam: "Shift siang"
      });
      [
        ["CON-01", "Lapgiat Cawang", "Jakarta Timur", -6.2383, 106.8756, "Pengalihan arus saat laka beruntun."],
        ["CON-02", "Lapgiat Tebet", "Jakarta Selatan", -6.2611, 106.8901, "Penutupan dua lajur setelah tabrakan."],
        ["CON-03", "Lapgiat Priok", "Jakarta Utara", -6.1256, 106.8345, "Truk mogok di akses pelabuhan."],
        ["CON-04", "Lapgiat Margonda", "Depok", -6.3872, 106.8301, "Antrean palang KA menahan simpang."],
        ["CON-05", "Lapgiat Pasteur", "Bandung", -6.8964, 107.5996, "Kontingensi simpang saat volume puncak."],
        ["CON-06", "Lapgiat Gubeng", "Surabaya", -7.2654, 112.7528, "Pengamanan perlintasan saat jam sibuk."],
        ["CON-07", "Lapgiat Solo", "Surakarta", -7.5694, 110.8213, "Rekayasa lalin sementara di ring road."]
      ].forEach((row) => {
        points.push({ id: row[0], kind: "contingency", title: row[1], kota: row[2], lat: row[3], lng: row[4], desc: row[5], photo: "/img/stock/a0c58c277311.jpg" });
      });
      [
        ["RTN-01", "Rutin Bundaran HI", "Jakarta Pusat", -6.1862, 106.8342, "Pemeriksaan rutin marka dan APILL."],
        ["RTN-02", "Rutin Lenteng Agung", "Jakarta Selatan", -6.3298, 106.8334, "Pantau palang dan antrean komuter."],
        ["RTN-03", "Rutin Bekasi", "Bekasi", -6.2356, 106.9968, "Cek perangkat dan lapgiat harian."],
        ["RTN-04", "Rutin Malang", "Malang", -7.9797, 112.6304, "Patroli rutin koridor stasiun."]
      ].forEach((row) => {
        points.push({ id: row[0], kind: "rutin", title: row[1], kota: row[2], lat: row[3], lng: row[4], desc: row[5], photo: "/img/stock/26f6f4e978c6.jpg" });
      });
      points.push({
        id: "MCT-01",
        kind: "macet",
        title: "Macet Cawang",
        kota: "Jakarta Timur",
        lat: -6.2450,
        lng: 106.8584,
        desc: "Indeks kemacetan tinggi pada anyaman Cawang.",
        photo: "/img/stock/ca38b728f438.jpg",
        jam: "07.00–09.00 · 16.30–19.30"
      });
      const hubs = [
        { kota: "Jakarta Selatan", lat: -6.26, lng: 106.83, n: 10 },
        { kota: "Jakarta Timur", lat: -6.22, lng: 106.90, n: 8 },
        { kota: "Jakarta Barat", lat: -6.17, lng: 106.76, n: 6 },
        { kota: "Jakarta Utara", lat: -6.13, lng: 106.86, n: 5 },
        { kota: "Jakarta Pusat", lat: -6.18, lng: 106.83, n: 5 },
        { kota: "Depok", lat: -6.39, lng: 106.82, n: 8 },
        { kota: "Tangerang", lat: -6.18, lng: 106.63, n: 6 },
        { kota: "Tangerang Selatan", lat: -6.30, lng: 106.71, n: 6 },
        { kota: "Bekasi", lat: -6.24, lng: 107.00, n: 8 },
        { kota: "Bogor", lat: -6.59, lng: 106.80, n: 6 },
        { kota: "Bandung", lat: -6.92, lng: 107.62, n: 8 },
        { kota: "Cirebon", lat: -6.73, lng: 108.55, n: 4 },
        { kota: "Semarang", lat: -6.97, lng: 110.42, n: 7 },
        { kota: "Yogyakarta", lat: -7.80, lng: 110.37, n: 5 },
        { kota: "Surabaya", lat: -7.26, lng: 112.75, n: 12 },
        { kota: "Malang", lat: -7.97, lng: 112.63, n: 8 },
        { kota: "Kediri", lat: -7.85, lng: 112.02, n: 7 },
        { kota: "Madiun", lat: -7.63, lng: 111.52, n: 4 },
        { kota: "Pasuruan", lat: -7.65, lng: 112.91, n: 5 },
        { kota: "Probolinggo", lat: -7.75, lng: 113.22, n: 4 },
        { kota: "Serang", lat: -6.12, lng: 106.15, n: 4 },
        { kota: "Bandar Lampung", lat: -5.45, lng: 105.27, n: 3 }
      ];
      let serial = 0;
      hubs.forEach((hub, hubIndex) => {
        const rand = gisRand(4100 + hubIndex * 97);
        for (let i = 0; i < hub.n; i += 1) {
          serial += 1;
          const status = jplStatusAt(serial);
          points.push({
            id: "JPL-" + String(serial).padStart(3, "0"),
            kind: "jpl",
            status,
            kota: hub.kota,
            lat: hub.lat + (rand() - 0.5) * 0.18,
            lng: hub.lng + (rand() - 0.5) * 0.22,
            title: "Pintu KA " + hub.kota + " " + String(i + 1).padStart(2, "0"),
            desc: JPL_STATUS[status].label + " di wilayah " + hub.kota + ".",
            photo: "/img/stock/a0c58c277311.jpg",
            ruasNama: "Perlintasan " + hub.kota
          });
        }
      });
      return points;
    }

    function gisPinIcon(color, on) {
      const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="36" height="48" viewBox="0 0 36 48"><path fill="' + color + '" stroke="#ffffff" stroke-width="2" d="M18 3c7.7 0 14 6.2 14 14 0 10.4-14 28-14 28S4 27.4 4 17C4 9.2 10.3 3 18 3z"/><circle cx="18" cy="17" r="6.2" fill="#ffffff"/></svg>';
      return {
        url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg),
        scaledSize: new google.maps.Size(on ? 32 : 26, on ? 43 : 35),
        anchor: new google.maps.Point(on ? 16 : 13, on ? 43 : 35)
      };
    }

    function gisDotIcon(color, on) {
      return {
        path: google.maps.SymbolPath.CIRCLE,
        scale: on ? 8 : 5.2,
        fillColor: color,
        fillOpacity: 0.95,
        strokeColor: "#ffffff",
        strokeWeight: on ? 2 : 1.3
      };
    }

    function gisMarkerIcon(point, on) {
      if (point.kind === "jpl" || point.gisKind === "jpl") {
        const status = point.status || point.gisStatus || "lain";
        return gisDotIcon((JPL_STATUS[status] || JPL_STATUS.lain).color, on);
      }
      const kind = point.kind || point.gisKind;
      return gisPinIcon((GIS_KIND[kind] || GIS_KIND.kota).color, on);
    }

    function gisAsPoint(row) {
      const meta = GIS_KIND[row.kind] || GIS_KIND.kota;
      return {
        id: row.id,
        gisKind: row.kind,
        gisStatus: row.status || "",
        kind: row.kind,
        status: row.status,
        type: "GIS",
        title: row.title,
        desc: row.desc,
        kota: row.kota,
        lat: row.lat,
        lng: row.lng,
        photo: row.photo || "/img/stock/d82d11e8105e.jpg",
        jam: row.jam || "Pantauan 24 jam",
        waktu: row.waktu || "16 Nov 2026",
        penyebab: row.desc,
        ruas: row.ruas || "Kota",
        ruasNama: row.ruasNama || row.title,
        wilayah: row.kota,
        ka: null,
        gisLabel: meta.label
      };
    }

    function gisPointHtml(point) {
      const meta = GIS_KIND[point.gisKind] || GIS_KIND.kota;
      const status = point.gisStatus ? (JPL_STATUS[point.gisStatus] || null) : null;
      return `<div class="relative h-32 bg-slate-200">
          <img src="${esc(point.photo)}" alt="Foto ${esc(point.title)}" class="h-full w-full object-cover" onerror="this.remove()">
          <span class="absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-semibold text-white" style="background:${meta.color}">${esc(meta.label)}</span>
        </div>
        <div class="p-4">
          <p class="text-[11px] font-semibold uppercase tracking-wide text-violet-600">${esc(point.id)} · ${esc(point.kota || "")}</p>
          <h2 id="pointTitle" class="mt-1 text-lg font-semibold text-slate-900">${esc(point.title)}</h2>
          <p class="mt-1 text-sm leading-relaxed text-slate-500">${esc(point.desc)}</p>
          ${status ? `<p class="mt-2 inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700"><span class="h-2 w-2 rounded-full" style="background:${status.color}"></span>${esc(status.label)}</p>` : ""}
          <dl class="mt-3 space-y-2.5">
            ${detailRow("fa-location-crosshairs", "Koordinat", `${esc(formatCoord(point.lat, point.lng))}<span class="mt-0.5 block text-xs text-slate-400">${point.lat.toFixed(6)}, ${point.lng.toFixed(6)}</span>`)}
            ${detailRow(meta.icon, "Layer GIS", esc(meta.label))}
            ${detailRow("fa-city", "Wilayah", esc(point.kota || "-"))}
          </dl>
        </div>`;
    }

    function paintGisCounts(counts, jplCounts) {
      const setText = (id, value) => {
        const node = document.getElementById(id);
        if (node) node.textContent = String(value);
      };
      setText("statCctv", counts.cctv);
      setText("statPerangkat", counts.perangkat);
      setText("statPetugas", counts.petugas);
      setText("statContingency", counts.contingency);
      setText("statRutin", counts.rutin);
      setText("statMacet", counts.macet);
      setText("gisCountKota", counts.kota);
      setText("gisCountCctv", counts.cctv);
      setText("gisCountPerangkat", counts.perangkat);
      setText("gisCountPetugas", counts.petugas);
      setText("gisCountContingency", counts.contingency);
      setText("gisCountRutin", counts.rutin);
      setText("gisCountMacet", counts.macet);
      setText("gisCountJpl", counts.jpl);
      setText("countJplBadge", counts.jpl);
      setText("jplCountAktif", jplCounts.aktif);
      setText("jplCountLiar", jplCounts.liar);
      setText("jplCountDitutup", jplCounts.ditutup);
      setText("jplCountFlyover", jplCounts.flyover);
      setText("jplCountLain", jplCounts.lain);
    }

    function applyGisScope() {
      if (!map) return;
      const counts = { kota: 0, cctv: 0, perangkat: 0, petugas: 0, contingency: 0, rutin: 0, macet: 0, jpl: 0 };
      const jplCounts = { aktif: 0, liar: 0, ditutup: 0, flyover: 0, lain: 0 };
      Object.entries(gisGroups).forEach(([kind, items]) => {
        const box = document.getElementById(GIS_IDS[kind]);
        const layerOn = box ? box.checked : true;
        items.forEach((item) => {
          const allowed = markerAllowed(item.get("kota"));
          if (allowed) {
            counts[kind] += 1;
            if (kind === "jpl") {
              const status = item.get("gisStatus");
              if (jplCounts[status] != null) jplCounts[status] += 1;
            }
          }
          const statusOn = kind !== "jpl" || gisStatusOn[item.get("gisStatus")];
          item.setMap(allowed && layerOn && statusOn ? map : null);
        });
      });
      paintGisCounts(counts, jplCounts);
    }

    function paintGisMarkers() {
      if (!map || !window.google) return;
      Object.keys(GIS_IDS).forEach((kind) => { gisGroups[kind] = []; });
      buildGisCatalog().forEach((row) => {
        const point = gisAsPoint(row);
        const marker = new google.maps.Marker({
          position: { lat: point.lat, lng: point.lng },
          map: null,
          title: point.title,
          zIndex: point.gisKind === "jpl" ? 4 : 6,
          icon: gisMarkerIcon(point, false)
        });
        marker.set("scoped", true);
        marker.set("kota", point.kota);
        marker.set("gisKind", point.gisKind);
        marker.set("gisStatus", point.gisStatus || "");
        marker.set("gisPoint", point);
        marker.addListener("click", () => openPoint(point, marker));
        gisGroups[point.gisKind].push(marker);
      });
    }

    function showMapGisDock(on) {
      const dock = document.getElementById("mapGisDock");
      if (dock) dock.classList.toggle("hidden-section", !on);
    }

    function setMapDesk(mode) {
      mapDesk = mode;
      const infoBtn = document.getElementById("mapDeskInfo");
      const statBtn = document.getElementById("mapDeskStat");
      if (infoBtn) {
        infoBtn.classList.toggle("is-on", mode === "info");
        infoBtn.setAttribute("aria-pressed", mode === "info" ? "true" : "false");
      }
      if (statBtn) {
        statBtn.classList.toggle("is-on", mode === "statistik");
        statBtn.setAttribute("aria-pressed", mode === "statistik" ? "true" : "false");
      }
      const infoPanel = document.getElementById("mapInfoPanel");
      const statPanel = document.getElementById("mapStatPanel");
      if (infoPanel) infoPanel.classList.toggle("hidden-section", mode !== "info");
      if (statPanel) statPanel.classList.toggle("hidden-section", mode !== "statistik");
    }

    function bindMapGis() {
      Object.entries(GIS_IDS).forEach(([kind, id]) => {
        const node = document.getElementById(id);
        if (!node) return;
        node.addEventListener("change", () => {
          applyGisScope();
          if (!node.checked && activeMarker && activeMarker.get("gisKind") === kind) closePoint();
        });
      });
      document.querySelectorAll("[data-jpl-status]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const key = btn.dataset.jplStatus;
          gisStatusOn[key] = !gisStatusOn[key];
          btn.classList.toggle("is-on", gisStatusOn[key]);
          applyGisScope();
        });
      });
      const infoBtn = document.getElementById("mapDeskInfo");
      const statBtn = document.getElementById("mapDeskStat");
      if (infoBtn) infoBtn.addEventListener("click", () => setMapDesk("info"));
      if (statBtn) statBtn.addEventListener("click", () => setMapDesk("statistik"));
      document.querySelectorAll("[data-map-desk-close]").forEach((btn) => {
        btn.addEventListener("click", () => setMapDesk(""));
      });
      const toggle = document.getElementById("mapGisToggle");
      if (toggle) {
        toggle.addEventListener("click", () => {
          gisBodyOpen = !gisBodyOpen;
          const body = document.getElementById("mapGisBody");
          const chevron = document.querySelector("[data-gis-chevron]");
          if (body) body.classList.toggle("hidden-section", !gisBodyOpen);
          toggle.setAttribute("aria-expanded", gisBodyOpen ? "true" : "false");
          if (chevron) {
            chevron.classList.toggle("fa-chevron-up", gisBodyOpen);
            chevron.classList.toggle("fa-chevron-down", !gisBodyOpen);
          }
        });
      }
      const badge = document.getElementById("mapJplBadge");
      if (badge) {
        badge.addEventListener("click", () => {
          closePoint();
          const panel = document.getElementById("mapGisPanel");
          if (panel) panel.classList.add("is-open");
          const box = document.getElementById("gisJpl");
          if (box && !box.checked) {
            box.checked = true;
            applyGisScope();
          }
          if (!gisBodyOpen && toggle) toggle.click();
          if (map) {
            map.panTo({ lat: -7.35, lng: 110.2 });
            if (map.getZoom() > 8) map.setZoom(7);
          }
        });
      }
    }

    function nearestRail(lat, lng) {
      let best = null;
      RAIL_ROUTES.forEach((route) => {
        for (let i = 0; i < route.path.length - 1; i += 1) {
          const a = route.path[i];
          const b = route.path[i + 1];
          const abLat = b.lat - a.lat;
          const abLng = b.lng - a.lng;
          const len2 = abLat * abLat + abLng * abLng;
          let t = len2 === 0 ? 0 : ((lat - a.lat) * abLat + (lng - a.lng) * abLng) / len2;
          t = Math.max(0, Math.min(1, t));
          const latMid = (a.lat + b.lat) / 2;
          const dLat = (lat - (a.lat + t * abLat)) * 111320;
          const dLng = (lng - (a.lng + t * abLng)) * 111320 * Math.cos(latMid * Math.PI / 180);
          const d = Math.hypot(dLat, dLng);
          const north = abLat * 111320;
          const east = abLng * 111320 * Math.cos(latMid * Math.PI / 180);
          const bearing = (Math.atan2(east, north) * 180 / Math.PI + 360) % 360;
          if (!best || d < best.d) best = { d, bearing, id: route.id, name: route.name };
        }
      });
      return best;
    }

    function paintRoutes(activeId) {
      Object.entries(routeLines).forEach(([id, pair]) => {
        const on = id === activeId;
        pair.casing.setOptions({ strokeWeight: on ? 11 : 8 });
        pair.line.setOptions({ strokeWeight: on ? 6 : 4 });
      });
    }

    function formatCoord(lat, lng) {
      const latHem = lat < 0 ? "LS" : "LU";
      const lngHem = lng < 0 ? "BB" : "BT";
      return `${Math.abs(lat).toFixed(6)}° ${latHem}, ${Math.abs(lng).toFixed(6)}° ${lngHem}`;
    }

    function kaTone(kategori) {
      if (kategori === "Sebidang tanpa palang") return "bg-red-50 text-red-700";
      if (kategori === "Tidak sebidang") return "bg-slate-100 text-slate-700";
      if (kategori === "Bukan perlintasan") return "bg-slate-100 text-slate-600";
      return "bg-blue-50 text-brand-blue";
    }

    function detailRow(icon, label, value) {
      return `<div class="flex gap-3">
        <span class="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-slate-100 text-brand-blue"><i class="fa-solid ${icon}"></i></span>
        <div class="min-w-0">
          <dt class="text-[11px] font-medium uppercase tracking-wide text-slate-400">${label}</dt>
          <dd class="mt-0.5 text-sm leading-snug text-slate-800">${value}</dd>
        </div>
      </div>`;
    }

    function pointHtml(point) {
      if (point.gisKind) return gisPointHtml(point);
      const meta = TYPE_META[point.type];
      const ka = point.ka || { kategori: "Bukan perlintasan", nama: "Ruas ini tidak memotong jalur kereta.", km: "" };
      const kaNote = point.ka ? `${esc(ka.wilayah)} · ${esc(ka.nama)} · ${esc(ka.km)}` : esc(ka.nama);
      const kicker = `${esc(point.id)} · ${esc(point.ruas)}${point.wilayah ? " · " + esc(point.wilayah) : ""}`;
      return `<div class="relative h-36 bg-slate-200">
          <img src="${esc(point.photo)}" alt="Foto lokasi ${esc(point.title)}" class="h-full w-full object-cover" onerror="this.remove()">
          <span class="absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-semibold ${meta.badge}">${esc(point.type)} · ${esc(meta.label)}</span>
        </div>
        <div class="p-4">
          <p class="text-[11px] font-semibold uppercase tracking-wide text-brand-orange">${kicker}</p>
          <h2 id="pointTitle" class="mt-1 text-lg font-semibold text-slate-900">${esc(point.title)}</h2>
          <p class="mt-1 text-sm leading-relaxed text-slate-500">${esc(point.desc)}</p>
          <dl class="mt-3 space-y-2.5">
            ${detailRow("fa-location-crosshairs", "Koordinat presisi", `${esc(formatCoord(point.lat, point.lng))}<span class="mt-0.5 block text-xs text-slate-400">${point.lat.toFixed(6)}, ${point.lng.toFixed(6)}</span>`)}
            ${detailRow("fa-clock", "Waktu / jam rawan", `${esc(point.jam)}<span class="mt-0.5 block text-xs text-slate-400">Dipantau ${esc(point.waktu)}</span>`)}
            ${detailRow("fa-triangle-exclamation", "Penyebab masalah", esc(point.penyebab))}
            ${detailRow("fa-road", "Kategori ruas jalan", `<span class="font-medium">${esc(point.ruas)}</span><span class="mt-0.5 block text-xs text-slate-500">${esc(point.ruasNama)}</span>`)}
            ${detailRow("fa-train", "Perlintasan kereta api", `<span class="inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${kaTone(ka.kategori)}">${esc(ka.kategori)}</span>${point.jalur ? `<span class="mt-1 block text-xs font-medium text-brand-blue">${esc(point.jalur)}</span>` : ""}<span class="mt-0.5 block text-xs text-slate-500">${kaNote}</span>`)}
          </dl>
        </div>`;
    }

    function closePoint() {
      const panel = document.getElementById("pointPanel");
      const hint = document.getElementById("mapHint");
      if (panel) panel.classList.add("hidden-section");
      if (hint) hint.classList.add("hidden-section");
      showMapGisDock(true);
      if (activeMarker) {
        const gisKind = activeMarker.get("gisKind");
        if (gisKind) {
          activeMarker.setIcon(gisMarkerIcon(activeMarker.get("gisPoint"), false));
          activeMarker.setZIndex(gisKind === "jpl" ? 4 : 6);
        } else {
          activeMarker.setIcon(markerIcon(activeMarker.get("pointType"), false, activeMarker.get("kaMeta")));
          activeMarker.setZIndex(activeMarker.get("pointType") === "KA" ? 5 : 3);
        }
        activeMarker = null;
      }
      paintRoutes("");
    }

    function openPoint(point, marker) {
      pointOpenedAt = Date.now();
      if (activeMarker && activeMarker !== marker) {
        const prevGis = activeMarker.get("gisKind");
        if (prevGis) {
          activeMarker.setIcon(gisMarkerIcon(activeMarker.get("gisPoint"), false));
          activeMarker.setZIndex(prevGis === "jpl" ? 4 : 6);
        } else {
          activeMarker.setIcon(markerIcon(activeMarker.get("pointType"), false, activeMarker.get("kaMeta")));
          activeMarker.setZIndex(activeMarker.get("pointType") === "KA" ? 5 : 3);
        }
      }
      activeMarker = marker;
      if (point.gisKind) {
        marker.setIcon(gisMarkerIcon(point, true));
      } else {
        marker.setIcon(markerIcon(point.type, true, marker.get("kaMeta")));
      }
      marker.setZIndex(20);
      paintRoutes(marker.get("jalurId") || "");
      document.getElementById("pointBody").innerHTML = pointHtml(point);
      document.getElementById("pointPanel").classList.remove("hidden-section");
      document.getElementById("mapHint").classList.add("hidden-section");
      showMapGisDock(false);
      if (!map) return;
      const shiftLng = window.innerWidth >= 768 ? 0.004 : 0;
      const shiftLat = window.innerWidth >= 768 ? 0 : -0.003;
      map.panTo({ lat: point.lat + shiftLat, lng: point.lng + shiftLng });
      if (map.getZoom() < 14) map.setZoom(14);
    }

    let mapLoadTries = 0;

    function initMap() {
      if (map) return;
      if (!window.google || !google.maps) {
        mapLoadTries += 1;
        if (mapLoadTries < 20) setTimeout(initMap, 300);
        else document.getElementById("mapError").classList.remove("hidden-section");
        return;
      }
      map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: MAP_HOME.lat, lng: MAP_HOME.lng },
        zoom: MAP_HOME.zoom,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        gestureHandling: "greedy",
        styles: [
          { featureType: "poi", stylers: [{ visibility: "off" }] }
        ]
      });

      const counts = { AG: 0, PG: 0, GN: 0, KA: 0 };
      ["AG", "PG", "GN", "KA"].forEach((type) => { layerGroups[type] = []; });
      const showKA = document.getElementById("layerKA").checked;

      RAIL_ROUTES.forEach((route) => {
        const casing = new google.maps.Polyline({
          path: route.path,
          map: showKA ? map : null,
          strokeColor: "#ffffff",
          strokeOpacity: 0.95,
          strokeWeight: 8,
          zIndex: 1,
          clickable: false,
          geodesic: true
        });
        const line = new google.maps.Polyline({
          path: route.path,
          map: showKA ? map : null,
          strokeColor: "#1e3a8a",
          strokeOpacity: 1,
          strokeWeight: 4,
          zIndex: 2,
          clickable: false,
          geodesic: true
        });
        routeLines[route.id] = { casing, line };
        layerGroups.KA.push(casing, line);
      });

      MAP_POINTS.forEach((point) => {
        counts[point.type] += 1;
        let kaMeta = null;
        let railHit = null;
        if (point.type === "KA" && point.ka) {
          railHit = nearestRail(point.lat, point.lng);
          point.jalur = railHit.name;
          kaMeta = { kategori: point.ka.kategori, bearing: railHit.bearing };
        }
        const marker = new google.maps.Marker({
          position: { lat: point.lat, lng: point.lng },
          map: document.getElementById("layer" + point.type).checked ? map : null,
          title: point.title,
          zIndex: point.type === "KA" ? 5 : 3,
          icon: kaMeta ? palangIcon(kaMeta.kategori, kaMeta.bearing, false) : markerIcon(point.type, false)
        });
        marker.set("pointType", point.type);
        marker.set("scoped", true);
        marker.set("kota", POINT_KOTA[point.title] || point.wilayah || "");
        if (kaMeta) {
          marker.set("kaMeta", kaMeta);
          marker.set("jalurId", railHit.id);
        }
        marker.addListener("click", () => openPoint(point, marker));
        layerGroups[point.type].push(marker);
      });
      paintGisMarkers();

      map.addListener("click", () => {
        if (Date.now() - pointOpenedAt < 300) return;
        closePoint();
      });

      Object.entries(counts).forEach(([type, count]) => {
        document.getElementById("count" + type).textContent = String(count);
      });
      document.getElementById("mapError").classList.add("hidden-section");
      applyMapScope();
    }

    window.gm_authFailure = function () {
      const error = document.getElementById("mapError");
      if (error) error.classList.remove("hidden-section");
    };

    function setLayerVisibility(type) {
      if (!map || !layerGroups[type]) return;
      applyMapScope();
      const visible = document.getElementById("layer" + type).checked;
      if (!visible && activeMarker && activeMarker.get("pointType") === type) closePoint();
    }

    function scaleDefaults() {
      return {
        x: {
          grid: { display: false },
          ticks: { color: "#64748b" }
        },
        y: {
          beginAtZero: true,
          grid: { color: "#e2e8f0" },
          ticks: { color: "#64748b" }
        }
      };
    }

    const keamananConfig = {
      type: "bar",
      data: {
        labels: ["Jakpus", "Jaksel", "Jakbar", "Jakut", "Jaktim", "Tangerang", "Bekasi"],
        datasets: [{
          label: "Kasus",
          data: [48, 42, 36, 29, 33, 31, 29],
          backgroundColor: "#1e3a8a",
          hoverBackgroundColor: "#1d4ed8",
          borderRadius: 10,
          borderSkipped: false,
          maxBarThickness: 42
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: scaleDefaults()
      }
    };

    const keselamatanConfig = {
      type: "line",
      data: {
        labels: ["M1", "M2", "M3", "M4", "M5", "M6", "M7", "M8"],
        datasets: [
          {
            label: "2026",
            data: [41, 38, 44, 36, 33, 35, 29, 32],
            borderColor: "#f97316",
            backgroundColor: "rgba(249, 115, 22, 0.1)",
            pointBackgroundColor: "#ffffff",
            pointBorderColor: "#f97316",
            pointRadius: 4,
            pointHoverRadius: 6,
            borderWidth: 2.5,
            tension: 0.4,
            fill: true
          },
          {
            label: "2025",
            data: [52, 49, 55, 47, 46, 43, 40, 39],
            borderColor: "#ef4444",
            backgroundColor: "transparent",
            pointRadius: 0,
            borderWidth: 2,
            borderDash: [5, 5],
            tension: 0.4,
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: { usePointStyle: true, pointStyle: "circle", boxWidth: 8 }
          }
        },
        scales: scaleDefaults()
      }
    };

    const ketertibanConfig = {
      type: "doughnut",
      data: {
        labels: ["Tanpa helm", "Kecepatan", "Lawan arus", "Parkir liar", "Lampu mati"],
        datasets: [{
          data: [420, 260, 180, 140, 90],
          backgroundColor: ["#065f46", "#059669", "#10b981", "#6ee7b7", "#bef264"],
          borderWidth: 0,
          spacing: 4,
          hoverOffset: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "70%",
        plugins: {
          legend: { display: false }
        }
      }
    };

    const kelancaranConfig = {
      type: "line",
      data: {
        labels: ["06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21"],
        datasets: [{
          label: "Indeks kemacetan",
          data: [22, 48, 86, 91, 70, 54, 49, 44, 51, 63, 88, 95, 82, 60, 41, 28],
          borderColor: "#06b6d4",
          backgroundColor: "rgba(6, 182, 212, 0.18)",
          pointBackgroundColor: "#ffffff",
          pointBorderColor: "#06b6d4",
          pointRadius: 3,
          borderWidth: 2.5,
          tension: 0.45,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: scaleDefaults().x,
          y: Object.assign({}, scaleDefaults().y, { suggestedMax: 100 })
        }
      }
    };

    function mountChart(key, canvasId, config) {
      if (charts[key]) {
        setTimeout(() => charts[key].resize(), 60);
        return;
      }
      charts[key] = new Chart(document.getElementById(canvasId), config);
    }
