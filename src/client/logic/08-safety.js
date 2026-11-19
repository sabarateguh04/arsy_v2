    const SAFE_NATIONAL = { deaths: 18036, crashes: 145673, people: 243951447, vehicles: 145001668, drivers: 1827932 };
    const SAFE_HOT = {
      "Papua": 0.86, "Papua Barat": 0.72, "Papua Pegunungan": 0.9, "Papua Selatan": 0.76,
      "Papua Tengah": 0.8, "Papua Barat Daya": 0.68, "Maluku": 0.58, "Maluku Utara": 0.5,
      "Nusa Tenggara Timur": 0.64, "Kalimantan Timur": 0.46, "Kalimantan Utara": 0.52,
      "Kalimantan Tengah": 0.4, "Sulawesi Tengah": 0.44, "Sulawesi Tenggara": 0.36
    };
    const SAFE_TREND = [
      { year: 2021, laka: 43750, md: 11163 },
      { year: 2022, laka: 127019, md: 25794 },
      { year: 2023, laka: 136801, md: 25483 },
      { year: 2024, laka: 146146, md: 26363 },
      { year: 2025, laka: 157602, md: 24396 },
      { year: 2026, laka: 145673, md: 18036 }
    ];
    const SAFE_TABS = {
      reduction: {
        kicker: "2026 Fatality Reduction",
        title: "Penurunan Fatalitas",
        note: "Korban meninggal lebih rendah dibanding periode yang sama tahun lalu pada koridor yang sama.",
        short: "Fatality Reduction",
        ask: "Fatality Reduction?",
        chart: "CAPAIAN FATALITY REDUCTION Terhadap Target RUNK LLAJ",
        lead: "Fatality Reduction mengukur penurunan jumlah korban meninggal dibanding periode yang sama pada tahun sebelumnya.",
        more: "Manfaat dari pengukuran ini sebagai data untuk menentukan program - program preemtif, preventif, dan represif lalu lintas dalam menurunkan fatalitas kecelakaan."
      },
      cfr: {
        kicker: "2026 Case Fatality Rate (CFR)",
        title: "Case Fatality Rate",
        note: "Dari setiap 100 kecelakaan, sekitar 12–13 diantaranya mengakibatkan korban meninggal dunia.",
        short: "Case Fatality Rate",
        ask: "Case Fatality Rate?",
        chart: "CAPAIAN CASE FATALITY RATE Terhadap Target RUNK LLAJ",
        lead: "Case Fatality Rate (CFR) merupakan pengukuran tingkat fatalitas kecelakaan dengan menggunakan jumlah korban meninggal dunia dibandingkan dengan jumlah kejadian kecelakaan.",
        more: "Manfaat dari pengukuran ini sebagai data untuk menentukan program - program preemtif, preventif, dan represif lalu lintas dalam menurunkan fatalitas kecelakaan."
      },
      populasi: {
        kicker: "2026 Indeks Fatalitas Berbasis Populasi",
        title: "Per 100.000 penduduk",
        note: "Jumlah korban meninggal dibagi penduduk, lalu dikali 100.000.",
        short: "Indeks Fatalitas Berbasis Populasi",
        ask: "Indeks Fatalitas Berbasis Populasi?",
        chart: "CAPAIAN INDEKS FATALITAS BERBASIS POPULASI Terhadap Target RUNK LLAJ",
        lead: "Indeks fatalitas berbasis populasi membandingkan jumlah korban meninggal dunia dengan jumlah penduduk, dinyatakan per 100.000 jiwa.",
        more: "Manfaat dari pengukuran ini sebagai data untuk membandingkan wilayah yang jumlah penduduknya berbeda, lalu menentukan program preemtif, preventif, dan represif."
      },
      kendaraan: {
        kicker: "2026 Indeks Fatalitas Berbasis Kendaraan",
        title: "Per 10.000 kendaraan",
        note: "Jumlah korban meninggal dibagi kendaraan bermotor, lalu dikali 10.000.",
        short: "Indeks Fatalitas Berbasis Kendaraan",
        ask: "Indeks Fatalitas Berbasis Kendaraan?",
        chart: "CAPAIAN INDEKS FATALITAS BERBASIS KENDARAAN Terhadap Target RUNK LLAJ",
        lead: "Indeks fatalitas berbasis kendaraan membandingkan jumlah korban meninggal dunia dengan jumlah kendaraan bermotor, dinyatakan per 10.000 unit.",
        more: "Manfaat dari pengukuran ini sebagai data untuk membaca risiko pada armada yang beroperasi, lalu menentukan program preemtif, preventif, dan represif."
      }
    };
    const SAFE_YEAR_CFR = [
      { year: 2021, fi: 25.52, cut: null },
      { year: 2022, fi: 20.31, cut: 20.41 },
      { year: 2023, fi: 18.63, cut: 8.27 },
      { year: 2024, fi: 18.04, cut: 3.16 },
      { year: 2025, fi: 15.48, cut: 14.19 },
      { year: 2026, fi: 12.38, cut: 20.02 }
    ];
    const SAFE_POLDA = [
      { name: "Polda Kepulauan Riau", provinces: ["Kepulauan Riau"], md: 54, laka: 1874 },
      { name: "Polda DI Yogyakarta", provinces: ["Yogyakarta"], md: 318, laka: 6929 },
      { name: "Polda Metro Jaya", provinces: ["Jakarta Raya"], md: 596, laka: 10550 },
      { name: "Polda Bali", provinces: ["Bali"], md: 452, laka: 8104 },
      { name: "Polda Papua", provinces: ["Papua", "Papua Pegunungan", "Papua Selatan", "Papua Tengah"], md: 142, laka: 2210 },
      { name: "Polda Sulawesi Selatan", provinces: ["Sulawesi Selatan"], md: 545, laka: 6519 },
      { name: "Polda Nusa Tenggara Barat", provinces: ["Nusa Tenggara Barat"], md: 273, laka: 2831 },
      { name: "Polda Jawa Tengah", provinces: ["Jawa Tengah"], md: 3182, laka: 31086 },
      { name: "Polda Sumatera Barat", provinces: ["Sumatera Barat"], md: 323, laka: 3147 },
      { name: "Polda Sulawesi Barat", provinces: ["Sulawesi Barat"], md: 84, laka: 765 },
      { name: "Polda Sulawesi Utara", provinces: ["Sulawesi Utara"], md: 217, laka: 2053 },
      { name: "Polda Papua Barat", provinces: ["Papua Barat", "Papua Barat Daya"], md: 52, laka: 348 },
      { name: "Polda Lampung", provinces: ["Lampung"], md: 509, laka: 3981 },
      { name: "Polda Bengkulu", provinces: ["Bengkulu"], md: 180, laka: 1314 },
      { name: "Polda Jawa Barat", provinces: ["Jawa Barat"], md: 1329, laka: 8935 },
      { name: "Polda Sulawesi Tenggara", provinces: ["Sulawesi Tenggara"], md: 243, laka: 1627 },
      { name: "Polda Jawa Timur", provinces: ["Jawa Timur"], md: 4162, laka: 27760 },
      { name: "Polda Jambi", provinces: ["Jambi"], md: 316, laka: 1926 },
      { name: "Polda Banten", provinces: ["Banten"], md: 186, laka: 1399 },
      { name: "Polda Kalimantan Utara", provinces: ["Kalimantan Utara"], md: 45, laka: 272 },
      { name: "Polda Aceh", provinces: ["Aceh"], md: 508, laka: 2766 },
      { name: "Polda Sumatera Selatan", provinces: ["Sumatera Selatan"], md: 677, laka: 3489 },
      { name: "Polda Riau", provinces: ["Riau"], md: 544, laka: 2711 },
      { name: "Polda Sumatera Utara", provinces: ["Sumatera Utara"], md: 1149, laka: 5291 },
      { name: "Polda Nusa Tenggara Timur", provinces: ["Nusa Tenggara Timur"], md: 271, laka: 1322 },
      { name: "Polda Gorontalo", provinces: ["Gorontalo"], md: 92, laka: 391 },
      { name: "Polda Maluku", provinces: ["Maluku"], md: 100, laka: 391 },
      { name: "Polda Kalimantan Selatan", provinces: ["Kalimantan Selatan"], md: 193, laka: 747 },
      { name: "Polda Babel", provinces: ["Kepulauan Bangka Belitung"], md: 70, laka: 1400 },
      { name: "Polda Kalimantan Barat", provinces: ["Kalimantan Barat"], md: 120, laka: 900 },
      { name: "Polda Kalimantan Tengah", provinces: ["Kalimantan Tengah"], md: 180, laka: 700 },
      { name: "Polda Kalimantan Timur", provinces: ["Kalimantan Timur"], md: 280, laka: 800 },
      { name: "Polda Sulawesi Tengah", provinces: ["Sulawesi Tengah"], md: 280, laka: 600 },
      { name: "Polda Maluku Utara", provinces: ["Maluku Utara"], md: 364, laka: 535 }
    ];
    let safeTab = "cfr";
    let safeGeo = null;
    let safeView = { x: 0, y: 0, k: 1, w: 0, h: 0 };
    let safeDragged = false;
    let safeMapMode = "warna";
    let safeGoogle = null;
    let safeGoogleData = null;
    let safeGoogleReady = false;

    function idNum(value) {
      return Math.round(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    function safeScore(name) {
      return Object.prototype.hasOwnProperty.call(SAFE_HOT, name) ? SAFE_HOT[name] : 0.18;
    }

    function safeColor(score) {
      const stops = [[0, [34, 139, 63]], [0.35, [132, 196, 62]], [0.55, [236, 206, 62]], [0.78, [232, 138, 48]], [1, [210, 52, 42]]];
      let index = 0;
      while (index < stops.length - 1 && score > stops[index + 1][0]) index += 1;
      const left = stops[index];
      const right = stops[Math.min(index + 1, stops.length - 1)];
      const span = right[0] - left[0] || 1;
      const t = (score - left[0]) / span;
      const rgb = left[1].map((channel, i) => Math.round(channel + (right[1][i] - channel) * t));
      return "rgb(" + rgb.join(",") + ")";
    }

    function safeScope() {
      const year = Number(document.getElementById("safeYear").value);
      const month = document.getElementById("safeMonth").value;
      const polda = document.getElementById("safePolda").value;
      const polres = document.getElementById("safePolres").value;
      const yearFactor = year === 2026 ? 1 : year === 2025 ? 1.12 : 1.2;
      const monthFactor = month === "all" ? 1 : Number(month) / 12;
      let share = 1;
      if (polda !== "all") {
        const seed = [...polda].reduce((sum, char) => sum + char.charCodeAt(0), 0);
        share = 0.025 + (seed % 40) / 1000;
      }
      if (polres !== "all") share *= 0.34;
      return {
        year,
        polda,
        share,
        yearFactor,
        monthFactor,
        deaths: SAFE_NATIONAL.deaths * yearFactor * monthFactor * share,
        crashes: SAFE_NATIONAL.crashes * yearFactor * monthFactor * share
      };
    }

    function paintSafeTrend(scope) {
      const host = document.getElementById("safeTrend");
      if (!host) return;
      const rows = SAFE_TREND.map((row) => ({
        year: row.year,
        laka: row.laka * scope.share,
        md: row.md * scope.share
      }));
      const peak = Math.max.apply(null, rows.map((row) => Math.max(row.laka, row.md)));
      let yMax = 175000;
      let ticks = [0, 50000, 100000, 150000];
      if (scope.share !== 1) {
        const rough = Math.max(peak * 1.22, 4);
        const step = Math.pow(10, Math.floor(Math.log10(rough / 3)));
        yMax = Math.ceil(rough / step) * step;
        ticks = [0, yMax / 4, yMax / 2, (yMax * 3) / 4, yMax].map((value) => Math.round(value));
      }
      const width = 760;
      const height = 320;
      const left = 58;
      const right = 28;
      const top = 28;
      const bottom = 36;
      const plotW = width - left - right;
      const plotH = height - top - bottom;
      const xAt = (index) => left + (plotW * index) / (rows.length - 1);
      const yAt = (value) => top + plotH - (value / yMax) * plotH;
      const tickLabel = (value) => {
        if (!value) return "0";
        if (value >= 1000 && value % 1000 === 0) return value / 1000 + "K";
        if (value >= 1000) return (value / 1000).toFixed(1).replace(".", ",") + "K";
        return idNum(value);
      };
      const series = (key, color) => {
        const line = rows.map((row, index) => (index ? "L" : "M") + xAt(index).toFixed(1) + " " + yAt(row[key]).toFixed(1)).join(" ");
        const marks = rows.map((row, index) => {
          const x = xAt(index);
          const y = yAt(row[key]);
          const anchor = index === 0 ? "start" : index === rows.length - 1 ? "end" : "middle";
          const dx = index === 0 ? 8 : index === rows.length - 1 ? -8 : 0;
          const label = idNum(row[key]);
          const labelY = y - 12;
          const ring = row.year === scope.year ? `<circle cx="${x}" cy="${y}" r="7" fill="none" stroke="#ffffff" stroke-width="1.5"/>` : "";
          const pill = key === "laka" && index === 0
            ? `<rect x="${(x + dx - 4).toFixed(1)}" y="${(labelY - 11).toFixed(1)}" width="${(label.length * 6.8 + 8).toFixed(1)}" height="15" rx="3" fill="#071433"/>`
            : "";
          return `${ring}<circle cx="${x}" cy="${y}" r="4" fill="${color}"/>${pill}<text x="${(x + dx).toFixed(1)}" y="${labelY.toFixed(1)}" text-anchor="${anchor}" fill="#ffffff" font-size="12" font-weight="600">${label}</text>`;
        }).join("");
        return `<path d="${line}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>${marks}`;
      };
      const grid = ticks.map((tick) => {
        const y = yAt(tick);
        return `<line x1="${left}" y1="${y.toFixed(1)}" x2="${width - right}" y2="${y.toFixed(1)}" stroke="rgba(255,255,255,0.14)"/><text x="${left - 10}" y="${(y + 4).toFixed(1)}" text-anchor="end" fill="#ffffff" font-size="12">${tickLabel(tick)}</text>`;
      }).join("");
      const years = rows.map((row, index) => `<text x="${xAt(index)}" y="${height - 12}" text-anchor="middle" fill="${row.year === scope.year ? "#ffffff" : "rgba(255,255,255,0.8)"}" font-size="13" font-weight="${row.year === scope.year ? "700" : "500"}">${row.year}</text>`).join("");
      host.innerHTML = `<svg viewBox="0 0 ${width} ${height}" class="h-auto w-full" role="img" aria-label="Grafik korban meninggal dan kecelakaan 2021 sampai 2026">
        ${grid}
        <text x="${xAt(1.55)}" y="${(top + 18).toFixed(1)}" text-anchor="middle" fill="rgba(255,255,255,0.75)" font-size="12">Tahun</text>
        ${series("laka", "#22c55e")}
        ${series("md", "#ef4444")}
        ${years}
      </svg>`;
    }

    function idDec(value, digits) {
      return value.toFixed(digits).replace(".", ",");
    }

    function waveAround(base, count, seed) {
      const raw = [];
      for (let index = 0; index < count; index += 1) {
        const swing = Math.sin((index + 1) * seed) * 0.16 + Math.cos((index + seed) * 0.8) * 0.08;
        raw.push(Math.max(0.4, 1 + swing));
      }
      const mean = raw.reduce((sum, value) => sum + value, 0) / raw.length;
      return raw.map((value) => base * value / mean);
    }

    function paintRateChart(host, groups, yMax, axisText, compact, ticks) {
      if (!host) return;
      const width = 720;
      const height = compact ? 200 : 228;
      const left = 44;
      const right = 8;
      const top = 18;
      const bottom = compact ? 28 : 34;
      const plotW = width - left - right;
      const plotH = height - top - bottom;
      const groupGap = groups.length > 1 ? 8 : 0;
      const inner = plotW - groupGap * (groups.length - 1);
      const total = groups.reduce((sum, group) => sum + group.bars.length, 0);
      const slot = inner / total;
      const bars = [];
      const captions = [];
      let cursor = left;
      groups.forEach((group, groupIndex) => {
        const start = cursor;
        group.bars.forEach((bar) => {
          const x = cursor + slot * 0.14;
          const w = Math.max(slot * 0.72, 1.2);
          const h = Math.min(Math.max((bar.value / yMax) * plotH, 0), plotH);
          bars.push({
            ...bar,
            x,
            y: top + plotH - h,
            w,
            h,
            cx: x + w / 2
          });
          cursor += slot;
        });
        captions.push({ text: group.label, x: (start + cursor) / 2 });
        if (groupIndex < groups.length - 1) cursor += groupGap;
      });
      const marks = ticks || [0, 0.25, 0.5, 0.75, 1].map((step) => yMax * step);
      const grid = marks.map((tick) => {
        const y = top + plotH - (tick / yMax) * plotH;
        return `<line x1="${left}" y1="${y.toFixed(1)}" x2="${width - right}" y2="${y.toFixed(1)}" stroke="rgba(255,255,255,0.14)"/><text x="${left - 6}" y="${(y + 3).toFixed(1)}" text-anchor="end" fill="rgba(255,255,255,0.82)" font-size="10">${axisText(tick)}</text>`;
      }).join("");
      const line = bars.map((bar, index) => (index ? "L" : "M") + bar.cx.toFixed(1) + " " + bar.y.toFixed(1)).join(" ");
      const dots = bars.map((bar) => `<circle cx="${bar.cx.toFixed(1)}" cy="${bar.y.toFixed(1)}" r="${compact ? 1.7 : 2.6}" fill="#ef4444" stroke="#fb923c" stroke-width="1"/>`).join("");
      const names = captions.map((caption) => `<text x="${caption.x.toFixed(1)}" y="${height - (groups[0].bars[0].foot ? 16 : 8)}" text-anchor="middle" fill="#ffffff" font-size="11" font-weight="700">${esc(caption.text)}</text>`).join("");
      const rects = bars.map((bar) => {
        const fill = bar.on ? "#4ade80" : "#15803d";
        const stroke = bar.on ? ' stroke="#ffffff" stroke-width="1.4"' : "";
        return `<g><title>${esc(bar.tip)}</title><rect x="${bar.x.toFixed(1)}" y="${bar.y.toFixed(1)}" width="${bar.w.toFixed(1)}" height="${Math.max(bar.h, 1).toFixed(1)}" rx="1.5" fill="${fill}"${stroke}/></g>`;
      }).join("");
      const notes = bars.map((bar) => {
        let text = "";
        if (bar.inside && bar.h > 26) text += `<text x="${bar.cx.toFixed(1)}" y="${(bar.y + 13).toFixed(1)}" text-anchor="middle" fill="#ffffff" font-size="9" font-weight="700">${esc(bar.inside)}</text>`;
        if (bar.above) text += `<text x="${bar.cx.toFixed(1)}" y="${(bar.y - 5).toFixed(1)}" text-anchor="middle" fill="#fdba74" font-size="10" font-weight="700">${esc(bar.above)}</text>`;
        if (bar.foot) text += `<text x="${bar.cx.toFixed(1)}" y="${height - 6}" text-anchor="middle" fill="rgba(255,255,255,0.75)" font-size="8">${esc(bar.foot)}</text>`;
        return text;
      }).join("");
      host.innerHTML = `<svg viewBox="0 0 ${width} ${height}" class="h-auto w-full" role="img" aria-label="${esc(host.getAttribute("aria-label") || "Grafik fatalitas")}">${grid}${rects}<path d="${line}" fill="none" stroke="#fb923c" stroke-width="1.6"/>${dots}${notes}${names}</svg>`;
    }

    function paintSafeDetail(scope) {
      const tab = SAFE_TABS[safeTab];
      document.querySelectorAll(".safe-metric-name").forEach((node) => {
        node.textContent = tab.short;
      });
      const yearGroups = SAFE_YEAR_CFR.map((row) => ({
        label: String(row.year),
        bars: [{
          value: row.fi,
          on: row.year === scope.year,
          inside: "FI: " + idDec(row.fi, 2) + "%",
          above: row.cut == null ? "" : idDec(row.cut, 2) + "%",
          tip: row.year + " · FI " + idDec(row.fi, 2) + "%" + (row.cut == null ? "" : " · turun " + idDec(row.cut, 2) + "%")
        }]
      }));
      const quarterGroups = SAFE_YEAR_CFR.map((row) => ({
        label: String(row.year),
        bars: waveAround(row.fi / 100, 4, (row.year % 5) + 1.4).map((value, index) => ({
          value,
          on: row.year === scope.year,
          foot: "K" + (index + 1),
          tip: row.year + " kuartal " + (index + 1) + " · FI " + idDec(value * 100, 2) + "%"
        }))
      }));
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
      const monthGroups = SAFE_YEAR_CFR.map((row) => ({
        label: String(row.year),
        bars: waveAround(row.fi / 100, 12, (row.year % 4) + 0.7).map((value, index) => ({
          value,
          on: row.year === scope.year,
          tip: row.year + " " + monthNames[index] + " · FI " + idDec(value * 100, 2) + "%"
        }))
      }));
      const yearHost = document.getElementById("safeYearChart");
      const quarterHost = document.getElementById("safeQuarterChart");
      const monthHost = document.getElementById("safeMonthChart");
      if (yearHost) yearHost.setAttribute("aria-label", "Tren tahunan " + tab.short);
      if (quarterHost) quarterHost.setAttribute("aria-label", "Tren kuartal " + tab.short);
      if (monthHost) monthHost.setAttribute("aria-label", "Tren bulanan " + tab.short);
      paintRateChart(yearHost, yearGroups, 30, (tick) => idDec(tick, 0) + "%", false, [0, 10, 20, 30]);
      paintRateChart(quarterHost, quarterGroups, 0.3, (tick) => idDec(tick, 2), false, [0, 0.1, 0.2, 0.3]);
      paintRateChart(monthHost, monthGroups, 0.3, (tick) => idDec(tick, 2), true, [0, 0.1, 0.2, 0.3]);

      const picked = SAFE_POLDA.find((row) => row.provinces.includes(scope.polda));
      const yearRow = SAFE_YEAR_CFR.find((row) => row.year === scope.year) || SAFE_YEAR_CFR[SAFE_YEAR_CFR.length - 1];
      const advice = picked ? (picked.md / picked.laka) * 100 : yearRow.fi;
      document.getElementById("safeAdviceValue").textContent = idDec(advice, 2) + "%";
      document.getElementById("safeTableTitle").textContent = tab.short;
      const level = roleLevel(session);
      const place = level === "kota"
        ? "Polres " + session.kota
        : level === "provinsi"
          ? (session.jabatan || "Polda")
          : (scope.polda === "all" ? "Polda" : document.getElementById("safePolda").selectedOptions[0].textContent.replace(/^Polda /, ""));
      document.getElementById("safeTableScope").textContent = level === "nasional"
        ? "per " + place + " vs Proyeksi Tanpa Intervensi RUNK Nasional"
        : place + " · data di luar cakupan peran ini tidak ditampilkan";

      const scale = scope.yearFactor * scope.monthFactor;
      let ranked = SAFE_POLDA
        .map((row) => ({ ...row, cfr: row.md / row.laka }))
        .sort((a, b) => a.cfr - b.cfr || a.name.localeCompare(b.name, "id"));
      if (level === "provinsi" && session) ranked = ranked.filter((row) => row.provinces.includes(session.polda || poldaKey(session.provinsi)));
      if (level === "kota" && session) {
        const parent = SAFE_POLDA.find((row) => row.provinces.includes(session.polda || poldaKey(session.provinsi))) || SAFE_POLDA[0];
        ranked = [{ name: "Polres " + session.kota, md: parent.md * 0.34, laka: parent.laka * 0.34, cfr: parent.md / parent.laka, provinces: [session.kota] }];
      }
      const body = document.getElementById("safePoldaBody");
      body.innerHTML = ranked.map((row, index) => {
        const on = level === "kota" || row.provinces.includes(scope.polda);
        return `<tr data-hit="${on ? "1" : "0"}" class="border-b border-slate-100 ${on ? "bg-sky-100 font-semibold text-slate-900" : "text-slate-700"}">
          <td class="px-3 py-1.5">${esc(row.name)}</td>
          <td class="px-2 py-1.5 text-right tabular-nums">${idNum(row.md * scale)}</td>
          <td class="px-2 py-1.5 text-right tabular-nums">${idNum(row.laka * scale)}</td>
          <td class="px-2 py-1.5 text-right tabular-nums">${index + 1}</td>
          <td class="px-3 py-1.5 text-right tabular-nums">${idDec(row.cfr, 2)}</td>
        </tr>`;
      }).join("");
      const hit = body.querySelector("[data-hit='1']");
      const scroller = document.getElementById("safePoldaScroll");
      if (hit && scroller) scroller.scrollTop = Math.max(hit.offsetTop - scroller.clientHeight / 3, 0);
    }

    function paintSafePanel() {
      const scope = safeScope();
      const tab = SAFE_TABS[safeTab];
      const cfr = scope.crashes ? (scope.deaths / scope.crashes) * 100 : 0;
      const perPeople = scope.deaths / SAFE_NATIONAL.people * 100000;
      const perVehicles = scope.deaths / SAFE_NATIONAL.vehicles * 10000;
      const reduction = scope.year === 2026 ? 18 : scope.year === 2025 ? 9 : 4;
      let value = cfr.toFixed(2).replace(".", ",") + "%";
      if (safeTab === "reduction") value = "−" + reduction + "%";
      if (safeTab === "populasi") value = perPeople.toFixed(2).replace(".", ",");
      if (safeTab === "kendaraan") value = perVehicles.toFixed(2).replace(".", ",");
      const prefix = scope.polda === "all" ? String(scope.year) : scope.polda;
      document.getElementById("safePanelKicker").textContent = tab.kicker.replace("2026", prefix);
      document.getElementById("safePanelTitle").textContent = tab.title;
      document.getElementById("safePanelValue").textContent = value;
      document.getElementById("safePanelNote").textContent = tab.note;
      document.getElementById("safeDeathLine").textContent = idNum(scope.deaths) + " jiwa";
      document.getElementById("safeCrashLine").textContent = idNum(scope.crashes) + " kasus";
      const level = roleLevel(session);
      const people = Math.round(SAFE_NATIONAL.people * scope.share);
      const vehicles = Math.round(SAFE_NATIONAL.vehicles * scope.share);
      const drivers = Math.round(SAFE_NATIONAL.drivers * scope.share);
      const area = scope.share === 1 ? "1.890.179" : idNum(Math.max(1, Math.round(1890179 * scope.share)));
      const coverage = level === "nasional" ? "Nasional" : (session && (session.jabatan || scopeLabel(session))) || "Wilayah tugas";
      document.getElementById("safePanelFacts").innerHTML = `
        <p>Cakupan : <strong>${esc(coverage)}</strong></p>
        <p>Luas Wilayah : <strong>${area} km²</strong> (Sumber Data : BPS)</p>
        <p>Jumlah Penduduk : <strong>${idNum(people)} jiwa</strong></p>
        <p>Jumlah Kendaraan : <strong>${idNum(vehicles)} unit</strong></p>
        <p>Jumlah Pengemudi : <strong>${idNum(drivers)} jiwa</strong></p>`;
      document.getElementById("safeDefTitle").textContent = tab.ask;
      document.getElementById("safeDefLead").textContent = tab.lead;
      document.getElementById("safeDefNote").textContent = tab.more;
      document.getElementById("safeChartTitle").textContent = tab.chart;
      paintSafeTrend(scope);
      paintSafeDetail(scope);
      document.querySelectorAll("[data-safe-tab]").forEach((button) => {
        const on = button.dataset.safeTab === safeTab;
        button.className = "shrink-0 rounded-full px-4 py-2 text-[11px] font-bold tracking-wide text-white sm:text-xs " + (on ? "bg-[#f472b6]" : "bg-[#1d4ed8] hover:bg-[#2563eb]");
      });
    }

    function ensurePoldaOptions() {
      const select = document.getElementById("safePolda");
      if (!safeGeo || select.dataset.ready === "1") return;
      safeGeo.features
        .map((feature) => feature.properties.name)
        .sort((a, b) => a.localeCompare(b, "id"))
        .forEach((name) => {
          const option = document.createElement("option");
          option.value = name;
          option.textContent = name === "Jakarta Raya" ? "Polda Metro Jaya" : "Polda " + name;
          select.appendChild(option);
        });
      select.dataset.ready = "1";
    }

    function fillSafePolda() {
      ensurePoldaOptions();
      applyDataScope();
    }

    function fillSafePolres() {
      const polda = document.getElementById("safePolda").value;
      const select = document.getElementById("safePolres");
      const level = roleLevel(session);
      const names = polda === "all"
        ? ["Semua"]
        : ["Semua"].concat(POLRES_BY_POLDA[polda] || ["Polresta", "Polres Kota", "Polres Kabupaten"]);
      select.innerHTML = names.map((name) => `<option value="${name === "Semua" ? "all" : esc(name)}">${esc(name)}</option>`).join("");
      if (level === "kota" && session && session.kota) {
        if (![...select.options].some((option) => option.value === session.kota)) {
          select.insertAdjacentHTML("beforeend", `<option value="${esc(session.kota)}">${esc(session.kota)}</option>`);
        }
        select.value = session.kota;
        select.disabled = true;
        return;
      }
      select.value = "all";
      select.disabled = polda === "all";
    }

    function applyDataScope() {
      const select = document.getElementById("safePolda");
      if (!select) return;
      ensurePoldaOptions();
      const level = roleLevel(session);
      const allOption = [...select.options].find((option) => option.value === "all");
      if (level === "nasional") {
        if (!allOption) {
          const option = document.createElement("option");
          option.value = "all";
          option.textContent = "Semua";
          select.insertBefore(option, select.firstChild);
        }
        select.disabled = false;
        fillSafePolres();
      } else if (session) {
        if (allOption) allOption.remove();
        const key = session.polda || poldaKey(session.provinsi) || "Jakarta Raya";
        if ([...select.options].some((option) => option.value === key)) select.value = key;
        select.disabled = true;
        fillSafePolres();
      }
      applyMapScope();
    }

    function ensureSafeGoogle() {
      const host = document.getElementById("safeGoogle");
      if (!host) return;
      if (!window.google || !google.maps) {
        setTimeout(() => {
          if (safeMapMode === "gmaps") ensureSafeGoogle();
        }, 300);
        return;
      }
      if (!safeGoogle) {
        safeGoogle = new google.maps.Map(host, {
          center: { lat: -2.4, lng: 118 },
          zoom: 5,
          mapTypeControl: true,
          mapTypeControlOptions: { mapTypeIds: ["roadmap", "terrain", "satellite", "hybrid"] },
          streetViewControl: false,
          fullscreenControl: false,
          gestureHandling: "greedy"
        });
        safeGoogleData = new google.maps.Data({ map: safeGoogle });
        safeGoogleData.addListener("click", (event) => {
          const name = event.feature.getProperty("name");
          if (!name) return;
          if (document.getElementById("safePolda").disabled) return;
          document.getElementById("safePolda").value = name;
          fillSafePolres();
          renderSafeMap();
        });
        safeGoogleData.addListener("mouseover", (event) => {
          if (event.domEvent) placeSafeTip(event.domEvent, event.feature.getProperty("name"));
        });
        safeGoogleData.addListener("mouseout", () => placeSafeTip(null, ""));
        safeGoogle.addListener("idle", () => {
          if (safeMapMode !== "gmaps") return;
          const label = document.getElementById("safeZoomLabel");
          if (label) label.textContent = String(safeGoogle.getZoom());
        });
      }
      if (safeGeo && !safeGoogleReady) {
        safeGoogleData.addGeoJson(safeGeo);
        safeGoogle.fitBounds({ north: 6.2, south: -11.2, west: 94.8, east: 141.2 });
        safeGoogleReady = true;
      } else if (!safeGeo) {
        loadSafeGeo().then(() => {
          if (safeMapMode === "gmaps") ensureSafeGoogle();
        });
      }
      safeGoogleData.setStyle((feature) => {
        const name = feature.getProperty("name");
        const selected = document.getElementById("safePolda").value;
        const on = selected === name;
        const outside = roleLevel(session) !== "nasional" && selected !== "all" && !on;
        return {
          fillColor: outside ? "#d5dee6" : safeColor(safeScore(name)),
          fillOpacity: outside ? 0.25 : 0.55,
          strokeColor: on ? "#0b1f4a" : "#ffffff",
          strokeWeight: on ? 2.4 : 0.8,
          clickable: !outside
        };
      });
      google.maps.event.trigger(safeGoogle, "resize");
    }

    function renderSafeMap() {
      const svg = document.getElementById("safeMap");
      const host = document.getElementById("safeGoogle");
      if (!svg) return;
      if (safeMapMode === "gmaps") {
        svg.classList.add("hidden");
        if (host) host.classList.remove("hidden");
        ensureSafeGoogle();
        paintSafePanel();
        return;
      }
      svg.classList.remove("hidden");
      if (host) host.classList.add("hidden");
      if (!safeGeo) {
        loadSafeGeo().then(() => {
          if (activeView === "viewKeselamatan") renderSafeMap();
        });
        return;
      }
      const width = Math.max(svg.clientWidth, 320);
      const height = Math.max(svg.clientHeight, 280);
      let minLng = 180;
      let maxLng = -180;
      let minLat = 90;
      let maxLat = -90;
      const visit = (lng, lat) => {
        minLng = Math.min(minLng, lng);
        maxLng = Math.max(maxLng, lng);
        minLat = Math.min(minLat, lat);
        maxLat = Math.max(maxLat, lat);
      };
      safeGeo.features.forEach((feature) => {
        const polygons = feature.geometry.type === "Polygon" ? [feature.geometry.coordinates] : feature.geometry.coordinates;
        polygons.forEach((rings) => rings.forEach((ring) => ring.forEach((point) => visit(point[0], point[1]))));
      });
      const padX = (maxLng - minLng) * 0.03;
      const padY = (maxLat - minLat) * 0.04;
      minLng -= padX;
      maxLng += padX;
      minLat -= padY;
      maxLat += padY;
      const inset = 16;
      const project = (lng, lat) => [
        inset + ((lng - minLng) / (maxLng - minLng)) * (width - inset * 2),
        inset + ((maxLat - lat) / (maxLat - minLat)) * (height - inset * 2)
      ];
      if (safeView.w !== width || safeView.h !== height) {
        safeView.x = 0;
        safeView.y = 0;
        safeView.k = 1;
      }
      safeView.w = width;
      safeView.h = height;
      const selected = document.getElementById("safePolda").value;
      const paths = safeGeo.features.map((feature) => {
        const name = feature.properties.name;
        const score = safeScore(name);
        const color = safeColor(score);
        const polygons = feature.geometry.type === "Polygon" ? [feature.geometry.coordinates] : feature.geometry.coordinates;
        let sumX = 0;
        let sumY = 0;
        let count = 0;
        let minX = Infinity;
        let maxX = -Infinity;
        let minY = Infinity;
        let maxY = -Infinity;
        const d = polygons.map((rings) => rings.map((ring) => ring.map((point, index) => {
          const [x, y] = project(point[0], point[1]);
          if (index === 0 || rings[0] === ring) {
            sumX += x;
            sumY += y;
            count += 1;
            minX = Math.min(minX, x);
            maxX = Math.max(maxX, x);
            minY = Math.min(minY, y);
            maxY = Math.max(maxY, y);
          }
          return (index === 0 ? "M" : "L") + x.toFixed(1) + " " + y.toFixed(1);
        }).join(" ") + " Z").join(" ")).join(" ");
        const on = selected !== "all" && selected === name;
        const outside = roleLevel(session) !== "nasional" && selected !== "all" && !on;
        const pale = outside || safeMapMode === "garis" || safeMapMode === "titik";
        const fill = pale ? "#e7eef2" : color;
        const stroke = on ? "#0b1f4a" : (safeMapMode === "garis" ? color : "#ffffff");
        const strokeWidth = on ? 2.6 : (safeMapMode === "garis" ? 2.2 : 0.8);
        const cx = count ? sumX / count : 0;
        const cy = count ? sumY / count : 0;
        const wide = maxX - minX > 46 && maxY - minY > 26;
        let extra = "";
        if (!outside && safeMapMode === "titik") {
          const radius = (3.5 + score * 11).toFixed(1);
          extra = `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${radius}" fill="${color}" stroke="#ffffff" stroke-width="1.2"/>`;
        } else if (!outside && safeMapMode === "angka" && wide) {
          extra = `<text x="${cx.toFixed(1)}" y="${(cy + 4).toFixed(1)}" text-anchor="middle" fill="#ffffff" stroke="#0b1f4a" stroke-width="3" paint-order="stroke" font-size="11" font-weight="700">${idDec(score, 2)}</text>`;
        }
        return `<g data-province="${esc(name)}" class="${outside ? "pointer-events-none" : "cursor-pointer"}" opacity="${outside ? "0.4" : "1"}"><path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"><title>${esc(name)}</title></path>${extra}</g>`;
      }).join("");
      svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
      svg.innerHTML = `<g id="safeMapShapes">${paths}</g>`;
      applySafeView();
      paintSafePanel();
    }

    function applySafeView() {
      const shapes = document.getElementById("safeMapShapes");
      if (shapes) shapes.setAttribute("transform", `translate(${safeView.x.toFixed(2)} ${safeView.y.toFixed(2)}) scale(${safeView.k.toFixed(4)})`);
      const label = document.getElementById("safeZoomLabel");
      if (label) label.textContent = Math.round(safeView.k * 100) + "%";
    }

    function clampSafeView() {
      const minX = safeView.w * (1 - safeView.k);
      const minY = safeView.h * (1 - safeView.k);
      safeView.x = Math.min(0, Math.max(minX, safeView.x));
      safeView.y = Math.min(0, Math.max(minY, safeView.y));
    }

    function zoomSafeMap(factor, cx, cy) {
      if (safeMapMode === "gmaps") {
        if (!safeGoogle) return;
        const next = Math.min(18, Math.max(4, safeGoogle.getZoom() + (factor > 1 ? 1 : -1)));
        safeGoogle.setZoom(next);
        const label = document.getElementById("safeZoomLabel");
        if (label) label.textContent = String(next);
        return;
      }
      if (!safeView.w) return;
      const next = Math.min(8, Math.max(1, safeView.k * factor));
      const ratio = next / safeView.k;
      safeView.x = cx - (cx - safeView.x) * ratio;
      safeView.y = cy - (cy - safeView.y) * ratio;
      safeView.k = next;
      if (next === 1) {
        safeView.x = 0;
        safeView.y = 0;
      }
      clampSafeView();
      applySafeView();
    }

    function safeMapPoint(event) {
      const svg = document.getElementById("safeMap");
      const rect = svg.getBoundingClientRect();
      return {
        x: ((event.clientX - rect.left) / rect.width) * safeView.w,
        y: ((event.clientY - rect.top) / rect.height) * safeView.h
      };
    }

    function safeProvinceStat(name) {
      const row = SAFE_POLDA.find((item) => item.provinces.indexOf(name) !== -1);
      if (!row) return null;
      const scope = safeScope();
      const md = row.md * scope.yearFactor * scope.monthFactor;
      const laka = row.laka * scope.yearFactor * scope.monthFactor;
      return { polda: row.name, md, laka, cfr: laka ? (md / laka) * 100 : 0 };
    }

    function placeSafeTip(event, name) {
      const tip = document.getElementById("safeMapTip");
      const wrap = document.getElementById("safeMapWrap");
      if (!tip || !wrap) return;
      if (!name) {
        tip.classList.add("hidden");
        return;
      }
      const stat = safeProvinceStat(name);
      const label = name === "Jakarta Raya" ? "DKI Jakarta" : name;
      tip.innerHTML = stat
        ? `<p class="font-bold">${esc(label)}</p><p class="text-white/80">${esc(stat.polda)}</p><p class="mt-0.5">CFR ${esc(idDec(stat.cfr, 2))}%</p><p>MD ${esc(idNum(stat.md))} · Laka ${esc(idNum(stat.laka))}</p>`
        : `<p class="font-bold">${esc(label)}</p>`;
      tip.classList.remove("hidden");
      const bounds = wrap.getBoundingClientRect();
      let left = event.clientX - bounds.left + 14;
      let top = event.clientY - bounds.top + 14;
      if (left + tip.offsetWidth > bounds.width - 8) left = event.clientX - bounds.left - tip.offsetWidth - 12;
      if (top + tip.offsetHeight > bounds.height - 8) top = event.clientY - bounds.top - tip.offsetHeight - 12;
      tip.style.left = Math.max(8, left) + "px";
      tip.style.top = Math.max(8, top) + "px";
    }

    function loadSafeGeo() {
      if (safeGeo) return Promise.resolve(safeGeo);
      if (!loadSafeGeo.pending) {
        loadSafeGeo.pending = fetch("img/sample/indonesia-simplified.json")
          .then((response) => response.json())
          .then((data) => {
            safeGeo = data;
            fillSafePolda();
            return data;
          })
          .catch(() => {
            const svg = document.getElementById("safeMap");
            if (svg) svg.innerHTML = "<text x='24' y='36' fill='#64748b' font-size='14'>Peta provinsi belum bisa dimuat.</text>";
          });
      }
      return loadSafeGeo.pending;
    }

    document.getElementById("safeMapModeSelect").addEventListener("change", (event) => {
      safeMapMode = event.target.value;
      renderSafeMap();
    });
    document.querySelectorAll("[data-safe-tab]").forEach((button) => {
      button.addEventListener("click", () => {
        safeTab = button.dataset.safeTab;
        paintSafePanel();
      });
    });
    document.getElementById("safeFilters").addEventListener("change", (event) => {
      if (event.target.id === "safePolda") fillSafePolres();
      renderSafeMap();
    });
    document.getElementById("safeMap").addEventListener("click", (event) => {
      if (safeDragged) {
        safeDragged = false;
        return;
      }
      const path = event.target.closest("[data-province]");
      if (!path || document.getElementById("safePolda").disabled) return;
      document.getElementById("safePolda").value = path.dataset.province;
      fillSafePolres();
      renderSafeMap();
    });
    const safeMapWrap = document.getElementById("safeMapWrap");
    safeMapWrap.addEventListener("wheel", (event) => {
      if (safeMapMode === "gmaps" || !safeView.w) return;
      event.preventDefault();
      const point = safeMapPoint(event);
      zoomSafeMap(event.deltaY < 0 ? 1.15 : 1 / 1.15, point.x, point.y);
    }, { passive: false });
    safeMapWrap.addEventListener("dblclick", (event) => {
      if (safeMapMode === "gmaps" || !safeView.w) return;
      const point = safeMapPoint(event);
      zoomSafeMap(1.7, point.x, point.y);
    });
    let safePointer = null;
    safeMapWrap.addEventListener("pointerdown", (event) => {
      if (safeMapMode === "gmaps" || event.button !== 0 || !safeView.w) return;
      safePointer = { id: event.pointerId, x: event.clientX, y: event.clientY, ox: safeView.x, oy: safeView.y };
      safeDragged = false;
    });
    safeMapWrap.addEventListener("pointermove", (event) => {
      if (safePointer && safePointer.id === event.pointerId) {
        const dx = event.clientX - safePointer.x;
        const dy = event.clientY - safePointer.y;
        if (Math.hypot(dx, dy) > 4) {
          safeDragged = true;
          safeMapWrap.classList.add("is-panning");
          placeSafeTip(event, "");
        }
        if (safeDragged && safeView.k > 1) {
          const rect = document.getElementById("safeMap").getBoundingClientRect();
          safeView.x = safePointer.ox + dx * (safeView.w / rect.width);
          safeView.y = safePointer.oy + dy * (safeView.h / rect.height);
          clampSafeView();
          applySafeView();
        }
        return;
      }
      const path = event.target.closest ? event.target.closest("[data-province]") : null;
      placeSafeTip(event, path ? path.dataset.province : "");
    });
    document.addEventListener("pointerup", (event) => {
      if (!safePointer || safePointer.id !== event.pointerId) return;
      safePointer = null;
      safeMapWrap.classList.remove("is-panning");
    });
    safeMapWrap.addEventListener("pointerleave", () => placeSafeTip(null, ""));
    document.getElementById("safeZoomIn").addEventListener("click", () => zoomSafeMap(1.25, safeView.w / 2, safeView.h / 2));
    document.getElementById("safeZoomOut").addEventListener("click", () => zoomSafeMap(1 / 1.25, safeView.w / 2, safeView.h / 2));
    document.getElementById("safeZoomReset").addEventListener("click", () => {
      if (safeMapMode === "gmaps" && safeGoogle) {
        safeGoogle.fitBounds({ north: 6.2, south: -11.2, west: 94.8, east: 141.2 });
        return;
      }
      safeView.x = 0;
      safeView.y = 0;
      safeView.k = 1;
      applySafeView();
    });
    function setSafeFull(on) {
      const view = document.getElementById("viewKeselamatan");
      view.classList.toggle("is-full", on);
      document.getElementById("safeFull").setAttribute("aria-pressed", on ? "true" : "false");
      document.querySelector("#safeFull span").textContent = on ? "Keluar" : "Layar penuh";
      document.querySelector("#safeFull i").className = on ? "fa-solid fa-compress" : "fa-solid fa-expand";
      requestAnimationFrame(() => {
        renderSafeMap();
        if (safeGoogle && window.google) google.maps.event.trigger(safeGoogle, "resize");
      });
    }
    document.getElementById("safeFull").addEventListener("click", () => {
      setSafeFull(!document.getElementById("viewKeselamatan").classList.contains("is-full"));
    });
    document.getElementById("safePdf").addEventListener("click", () => window.print());
    function loadHtml2Canvas() {
      if (window.html2canvas) return Promise.resolve(window.html2canvas);
      return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js";
        script.onload = () => resolve(window.html2canvas);
        script.onerror = reject;
        document.head.appendChild(script);
      });
    }

    function saveJpeg(canvas, name) {
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/jpeg", 0.9);
      link.download = name;
      link.click();
    }

    function paintCaptureMap(root) {
      const svg = root.querySelector('svg[aria-label="Peta fatalitas provinsi Indonesia"]');
      if (!svg || svg.classList.contains("hidden")) return Promise.resolve();
      const wrap = svg.parentElement;
      let width = Math.round(wrap.clientWidth);
      const height = Math.round(wrap.clientHeight);
      if (width < 20 || height < 20) return Promise.resolve();
      const column = wrap.parentElement;
      const row = column && column.parentElement;
      if (row && column) {
        const aside = row.querySelector("aside");
        const asideWidth = aside ? Math.round(aside.getBoundingClientRect().width) : 0;
        const rowWidth = Math.round(row.clientWidth);
        const colWidth = Math.max(width, rowWidth - asideWidth);
        row.style.width = "100%";
        column.style.flex = "none";
        column.style.width = colWidth + "px";
        column.style.minWidth = colWidth + "px";
        wrap.style.width = colWidth + "px";
        wrap.style.height = height + "px";
        width = colWidth;
      }
      svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
      svg.setAttribute("width", String(width));
      svg.setAttribute("height", String(height));
      svg.setAttribute("preserveAspectRatio", "none");
      const xml = new XMLSerializer().serializeToString(svg);
      const url = URL.createObjectURL(new Blob([xml], { type: "image/svg+xml;charset=utf-8" }));
      return new Promise((resolve) => {
        const source = new Image();
        source.onload = () => {
          const canvas = document.createElement("canvas");
          const sharp = 2;
          canvas.width = width * sharp;
          canvas.height = height * sharp;
          const ctx = canvas.getContext("2d");
          ctx.fillStyle = "#e7eef2";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(source, 0, 0, canvas.width, canvas.height);
          URL.revokeObjectURL(url);
          const shot = new Image();
          shot.alt = "";
          shot.width = width;
          shot.height = height;
          shot.style.position = "absolute";
          shot.style.left = "0";
          shot.style.top = "0";
          shot.style.width = width + "px";
          shot.style.height = height + "px";
          shot.style.objectFit = "fill";
          shot.onload = () => resolve();
          shot.onerror = () => resolve();
          shot.src = canvas.toDataURL("image/png");
          svg.replaceWith(shot);
        };
        source.onerror = () => {
          URL.revokeObjectURL(url);
          resolve();
        };
        source.src = url;
      });
    }

    function captureSafePage() {
      const view = document.getElementById("viewKeselamatan");
      const button = document.getElementById("safeJpg");
      const icon = button.querySelector("i");
      const iconClass = icon.className;
      const width = view.clientWidth;
      const toolbar = document.getElementById("safeToolbar");
      const toolbarHeight = toolbar ? Math.round(toolbar.getBoundingClientRect().height) : 0;
      const stageHeight = Math.max(280, Math.round(document.getElementById("safeStage").getBoundingClientRect().height) - toolbarHeight);
      const clone = view.cloneNode(true);
      clone.id = "safeCaptureSheet";
      clone.classList.remove("is-full", "hidden-section");
      const cloneToolbar = clone.querySelector("#safeToolbar");
      if (cloneToolbar) cloneToolbar.remove();
      clone.querySelectorAll("[id]").forEach((el) => el.removeAttribute("id"));
      const cloneStage = clone.querySelector('[class*="min-h-[28rem]"]');
      if (cloneStage) {
        cloneStage.style.height = stageHeight + "px";
        cloneStage.style.minHeight = stageHeight + "px";
        cloneStage.style.flex = "none";
      }
      clone.querySelectorAll(".sticky").forEach((el) => { el.style.position = "relative"; });
      clone.style.position = "absolute";
      clone.style.left = "-10000px";
      clone.style.top = "0";
      clone.style.right = "auto";
      clone.style.bottom = "auto";
      clone.style.width = width + "px";
      clone.style.height = "auto";
      clone.style.maxHeight = "none";
      clone.style.overflow = "visible";
      clone.style.background = "#ffffff";
      const full = view.classList.contains("is-full");
      let sheet = clone;
      if (!full) {
        const dash = document.getElementById("operatorDashboard");
        const header = dash.querySelector(":scope > header");
        const sidebar = document.getElementById("sidebar");
        const sideW = Math.max(280, Math.round(sidebar.getBoundingClientRect().width));
        const shell = document.createElement("div");
        shell.id = "safeCaptureShell";
        shell.style.position = "absolute";
        shell.style.left = "-10000px";
        shell.style.top = "0";
        shell.style.width = (sideW + width) + "px";
        shell.style.display = "flex";
        shell.style.flexDirection = "column";
        shell.style.background = "#f4f7fb";
        const headerClone = header.cloneNode(true);
        headerClone.querySelectorAll("[id]").forEach((el) => el.removeAttribute("id"));
        headerClone.style.position = "relative";
        headerClone.style.flex = "none";
        headerClone.style.zIndex = "auto";
        const row = document.createElement("div");
        row.style.display = "flex";
        row.style.alignItems = "stretch";
        row.style.background = "#f4f7fb";
        const sideClone = sidebar.cloneNode(true);
        sideClone.style.position = "relative";
        sideClone.style.inset = "auto";
        sideClone.style.transform = "none";
        sideClone.style.width = sideW + "px";
        sideClone.style.maxHeight = "none";
        sideClone.style.flex = "0 0 " + sideW + "px";
        sideClone.style.overflow = "visible";
        sideClone.style.zIndex = "auto";
        const sideNav = sideClone.querySelector("nav");
        if (sideNav) {
          sideNav.style.overflow = "visible";
          sideNav.style.flex = "none";
        }
        clone.style.position = "relative";
        clone.style.left = "auto";
        clone.style.top = "auto";
        clone.style.flex = "none";
        row.appendChild(sideClone);
        row.appendChild(clone);
        shell.appendChild(headerClone);
        shell.appendChild(row);
        sheet = shell;
      }
      document.body.appendChild(sheet);
      button.disabled = true;
      icon.className = "fa-solid fa-spinner fa-spin text-lg";
      const restore = () => {
        sheet.remove();
        icon.className = iconClass;
        button.disabled = false;
      };
      return new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))
        .then(() => paintCaptureMap(sheet))
        .then(() => loadHtml2Canvas())
        .then((shoot) => {
          const sheetWidth = sheet.scrollWidth;
          const sheetHeight = sheet.scrollHeight;
          let scale = 2;
          if (sheetWidth * scale > 3600 || sheetHeight * scale > 9000) scale = 1;
          return shoot(sheet, { backgroundColor: "#ffffff", scale, useCORS: true, logging: false });
        })
        .then((canvas) => saveJpeg(canvas, "kinerja-keselamatan.jpg"))
        .catch(() => {})
        .finally(restore);
    }

    document.getElementById("safeJpg").addEventListener("click", () => captureSafePage());

    document.querySelectorAll("[data-pill], [data-side]").forEach((button) => {
      button.addEventListener("click", () => {
        switchOperatorView(button.dataset.pill || button.dataset.side);
      });
    });
    document.querySelectorAll("[data-toggle]").forEach((button) => {
      button.addEventListener("click", () => toggleMenu(button.dataset.toggle));
    });
    document.querySelectorAll("[data-leaf]").forEach((button) => {
      button.addEventListener("click", () => openLeaf(button.dataset.leaf, button.hasAttribute("data-crud") ? "crud" : "show"));
    });
    document.getElementById("surveyFaktor").addEventListener("change", fillSurveyCause);
    document.getElementById("surveyCause").addEventListener("change", () => {
      const otherWrap = document.getElementById("surveyOtherWrap");
      const other = document.getElementById("surveyOther");
      const show = document.getElementById("surveyCause").value === "Lainnya";
      otherWrap.classList.toggle("hidden", !show);
      other.required = show;
      if (!show) other.value = "";
      if (show) other.focus();
    });
    document.getElementById("surveyPhoto").addEventListener("change", () => {
      const input = document.getElementById("surveyPhoto");
      const note = document.getElementById("surveyFiles");
      note.classList.remove("hidden");
      if (input.files.length > 3) {
        note.className = "mt-3 text-sm text-red-600";
        note.textContent = "Paling banyak 3 foto. Pilihan tadi dibatalkan.";
        input.value = "";
        return;
      }
      note.className = "mt-3 text-sm text-emerald-700";
      note.textContent = input.files.length ? input.files.length + " foto dipilih." : "";
      if (!input.files.length) note.classList.add("hidden");
    });
    document.getElementById("surveyGps").addEventListener("click", () => {
      const input = document.getElementById("surveyCoord");
      const note = document.getElementById("surveyGpsMsg");
      if (!navigator.geolocation) {
        note.textContent = "Perangkat ini tidak bisa mengambil koordinat.";
        return;
      }
      note.textContent = "Mencari koordinat...";
      navigator.geolocation.getCurrentPosition((position) => {
        input.value = position.coords.latitude.toFixed(6) + ", " + position.coords.longitude.toFixed(6);
        note.textContent = "Koordinat terisi dari perangkat.";
      }, () => {
        note.textContent = "Lokasi tidak bisa diambil. Izinkan akses lokasi, lalu coba lagi.";
      });
    });
    document.getElementById("surveyForm").addEventListener("submit", async (event) => {
      event.preventDefault();
      const photos = document.getElementById("surveyPhoto");
      const note = document.getElementById("surveyFiles");
      if (!photos.files.length || photos.files.length > 3) {
        note.className = "mt-3 text-sm text-red-600";
        note.classList.remove("hidden");
        note.textContent = "Lampirkan 1 sampai 3 foto.";
        return;
      }
      const cause = document.getElementById("surveyCause").value;
      const other = document.getElementById("surveyOther").value.trim();
      let saved;
      try {
        const encoded = await Promise.all([...photos.files].map(readPhoto));
        const response = await fetch("/api/reports", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            officer: session ? session.name : "",
            polda: document.getElementById("surveyPolda").value,
            polres: document.getElementById("surveyPolres").value,
            poldaKey: session ? (session.polda || poldaKey(session.provinsi) || "") : "",
            kota: session && session.kota ? session.kota : "",
            giat: document.getElementById("surveyGiat").value,
            tingkat: document.getElementById("surveyTingkat").value,
            rawan: document.getElementById("surveyRawan").value,
            faktor: document.getElementById("surveyFaktor").value,
            penyebab: cause === "Lainnya" ? other : cause,
            road: document.getElementById("surveyRoad").value.trim(),
            coord: document.getElementById("surveyCoord").value.trim(),
            detail: document.getElementById("surveyDetail").value.trim(),
            photos: encoded
          })
        });
        if (!response.ok) throw new Error("save");
        saved = await response.json();
      } catch (error) {
        note.className = "mt-3 text-sm text-red-600";
        note.classList.remove("hidden");
        note.textContent = "Laporan belum tersimpan. Coba lagi.";
        return;
      }
      surveyReports.unshift(saved);
      const done = document.getElementById("surveyDone");
      done.classList.remove("hidden");
      document.getElementById("surveyForm").reset();
      fillSurveyCause();
      paintSurvey();
      note.classList.add("hidden");
      document.getElementById("surveyResult").scrollIntoView({ block: "nearest" });
    });
    document.getElementById("surveyRows").addEventListener("click", (event) => {
      const open = event.target.closest("[data-survey-open]");
      const del = event.target.closest("[data-survey-del]");
      if (open) {
        const id = Number(open.dataset.surveyOpen);
        if (surveyOpen.has(id)) surveyOpen.delete(id);
        else surveyOpen.add(id);
        renderSurveyTable();
      }
      if (del) {
        const id = Number(del.dataset.surveyDel);
        fetch("/api/reports/" + id, { method: "DELETE" }).then((response) => {
          if (!response.ok) return;
          surveyReports = surveyReports.filter((item) => item.id !== id);
          surveyOpen.delete(id);
          renderSurveyTable();
        });
      }
    });
    document.getElementById("primerAdd").addEventListener("click", () => showLeafForm(-1));
    document.getElementById("primerCancel").addEventListener("click", hideLeafForm);
    document.getElementById("primerForm").addEventListener("submit", (event) => {
      event.preventDefault();
      const item = LEAVES[leafKey];
      if (!item) return;
      const next = item.columns.map((_, field) => document.querySelector(`#primerFields [data-field="${field}"]`).value.trim());
      const rows = leafRows(leafKey);
      if (leafEdit >= 0) rows[leafEdit] = next;
      else rows.unshift(next);
      hideLeafForm();
      renderLeaf();
    });
    document.getElementById("primerTable").addEventListener("click", (event) => {
      const edit = event.target.closest("[data-row-edit]");
      const del = event.target.closest("[data-row-del]");
      if (edit) showLeafForm(Number(edit.dataset.rowEdit));
      if (del) {
        leafRows(leafKey).splice(Number(del.dataset.rowDel), 1);
        hideLeafForm();
        renderLeaf();
      }
    });

    document.getElementById("toggleSidebar").addEventListener("click", toggleSidebar);
    document.getElementById("closeSidebar").addEventListener("click", closeSidebar);
    document.getElementById("sidebarBackdrop").addEventListener("click", closeSidebar);
