    const MAP_HOME = { lat: -6.34, lng: 106.83, zoom: 11 };
    const TYPE_META = {
      AG: { label: "Antrian ringan", badge: "bg-yellow-400 text-slate-900" },
      PG: { label: "Potensi gangguan", badge: "bg-brand-orange text-white" },
      GN: { label: "Gangguan nyata", badge: "bg-red-500 text-white" },
      KA: { label: "Perlintasan kereta", badge: "bg-brand-blue text-white" }
    };
    const MARKER_COLORS = { AG: "#eab308", PG: "#f97316", GN: "#ef4444", KA: "#1e3a8a" };
    let activeMarker = null;
    let pointOpenedAt = 0;

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
      if (hint) hint.classList.remove("hidden-section");
      if (activeMarker) {
        activeMarker.setIcon(markerIcon(activeMarker.get("pointType"), false, activeMarker.get("kaMeta")));
        activeMarker.setZIndex(activeMarker.get("pointType") === "KA" ? 5 : 3);
        activeMarker = null;
      }
      paintRoutes("");
    }

    function openPoint(point, marker) {
      pointOpenedAt = Date.now();
      if (activeMarker && activeMarker !== marker) {
        activeMarker.setIcon(markerIcon(activeMarker.get("pointType"), false, activeMarker.get("kaMeta")));
        activeMarker.setZIndex(activeMarker.get("pointType") === "KA" ? 5 : 3);
      }
      activeMarker = marker;
      marker.setIcon(markerIcon(point.type, true, marker.get("kaMeta")));
      marker.setZIndex(20);
      paintRoutes(marker.get("jalurId") || "");
      document.getElementById("pointBody").innerHTML = pointHtml(point);
      document.getElementById("pointPanel").classList.remove("hidden-section");
      document.getElementById("mapHint").classList.add("hidden-section");
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
