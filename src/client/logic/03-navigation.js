    let activeView = "viewMap";
    let map = null;
    let mapFitToken = "";
    const layerGroups = {};
    const routeLines = {};
    const charts = {};
    let userMode = "create";
    let userIndex = -1;
    let statusFilter = "Semua";

    function showPage(pageId) {
      if (pageId === "operatorDashboard" && !session) pageId = "loginPage";
      PAGES.forEach((id) => document.getElementById(id).classList.add("hidden-section"));
      document.getElementById(pageId).classList.remove("hidden-section");
      if (pageId !== "operatorDashboard") window.scrollTo(0, 0);
      const titles = {
        publicPortal: "ARSY · Algoritma Road Safety",
        loginPage: "Masuk · ARSY",
        operatorDashboard: "Command Center · ARSY"
      };
      document.title = titles[pageId] || titles.publicPortal;
      if (typeof syncAleshaVisibility === "function") syncAleshaVisibility(pageId === "operatorDashboard" && !!session);
      if (pageId === "loginPage") {
        const loginPanel = document.getElementById("loginPanel");
        const registerPanel = document.getElementById("registerPanel");
        if (loginPanel && registerPanel) {
          loginPanel.classList.remove("hidden-section");
          registerPanel.classList.add("hidden-section");
        }
      }
      if (pageId === "publicPortal") loadPublicPage();
      if (pageId === "operatorDashboard") {
        paintSession();
        applyMenuAccess();
        applyDataScope();
        if (!canOpen(activeView)) activeView = canOpen("viewMap") ? "viewMap" : "viewKeselamatan";
        switchOperatorView(activeView);
      }
    }

    const LEAF_BASE = "block w-full rounded-lg px-3 py-1.5 text-left text-[13px] leading-snug transition ";
    const LEAF_PARENT_BASE = "flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left text-[13px] transition ";
    const LEAF_VIEW = { laka: "viewAccident", users: "viewUsers", profile: "viewProfile" };

    function sheet(group, title, lead, stats, columns, rows) {
      return {
        group,
        title,
        lead,
        stats: stats.map(([label, value, note]) => ({ label, value, note })),
        columns,
        rows
      };
    }

    const LEAVES = {
      sim: sheet("Safety Driving Center", "Surat Izin Mengemudi (SIM)", "Penerbitan dan status SIM yang masuk dari Safety Driving Center.", [["SIM aktif", "1,84 jt", "Jabodetabek"], ["Terbit bulan ini", "12.640", "Baru dan perpanjang"], ["Blokir", "860", "Menunggu klarifikasi"]], ["Nomor", "Pemegang", "Golongan", "Status"], [["SIM-0912", "Andi Wijaya", "A", "Aktif"], ["SIM-0884", "Rina Marlina", "C", "Perpanjang"], ["SIM-0871", "Hendra Kusuma", "A", "Blokir"], ["SIM-0860", "Siti Rahma", "C", "Aktif"]]),
      laka: sheet("Safety & Security Center", "Kecelakaan", "Daftar kecelakaan yang masuk ke meja operator.", [["Hari ini", "4", "16 Nov 2026"], ["Masih investigasi", "1", "Tebet"], ["Selesai", "3", "Termasuk Gambir"]], ["Kode", "Lokasi", "Jenis", "Korban", "Status"], [["ACC-088", "Tebet", "Beruntun, 3 kendaraan", "1 meninggal · 3 luka", "Investigasi"], ["ACC-086", "Gambir", "Tunggal, pengendara motor", "1 luka ringan", "Selesai"], ["ACC-081", "Kelapa Gading", "Tabrak samping", "2 luka ringan", "Selesai"], ["ACC-079", "Akses Bandara", "Tunggal, mobil", "Tidak ada korban", "Selesai"]]),
      eri: sheet("Data Primer", "Electronic Registration & Identification", "Registrasi dan identifikasi elektronik kendaraan yang tersambung ke meja operator.", [["Kendaraan terdaftar", "842 rb", "Basis Jabodetabek"], ["Pembaruan hari ini", "12.400", "STNK dan identitas"], ["Gagal verifikasi", "36", "Menunggu pemeriksaan"]], ["Nomor", "Identitas", "Jenis", "Hasil"], [["B 1842 KX", "ERI-88211", "Mobil penumpang", "Terverifikasi"], ["B 2901 FY", "ERI-88190", "Sepeda motor", "Terverifikasi"], ["B 7730 TQ", "ERI-88144", "Truk", "Gagal"], ["B 4412 ZZ", "ERI-88102", "Bus", "Ditinjau"]]),
      mobilitas: sheet("Traffic Management Center", "Mobilitas Pengguna Jalan", "Pergerakan orang dan kendaraan pada koridor yang dipantau hari ini.", [["Perjalanan", "2,4 jt", "Sampai pukul 16.00"], ["Moda terbanyak", "Motor", "61% dari perjalanan"], ["Kecepatan rata", "27 km/j", "Arteri utama"]], ["Koridor", "Moda", "Volume", "Arah"], [["Sudirman", "Mobil", "Padat", "Selatan"], ["Gatot Subroto", "Motor", "Padat", "Timur"], ["Cawang", "Campuran", "Sedang", "Bekasi"], ["Tol dalam kota", "Mobil", "Lancar", "Bandara"]]),
      lalulintas: sheet("Traffic Management Center", "Data Lalu Lintas", "Volume, kecepatan, dan kelas gangguan pada ruas pantauan.", [["Ruas terpantau", "148", "Arteri dan tol"], ["AG / PG / GN", "6 / 5 / 4", "Layer peta saat ini"], ["Kamera online", "98%", "326 titik"]], ["Kode", "Lokasi", "Kelas", "Status"], [["GN-118", "Tebet", "GN", "Ditangani"], ["PG-206", "Sudirman", "PG", "Dipantau"], ["AG-331", "Blok M", "AG", "Terkendali"], ["AG-328", "Setiabudi", "AG", "Terkendali"]]),
      kontingensi: sheet("Traffic Management Center", "Layanan Kontingensi", "Rencana dan aktivasi saat ruas utama tidak bisa dipakai.", [["Skenario siap", "9", "Jabodetabek"], ["Sedang aktif", "1", "Tebet · lajur tutup"], ["Unit siaga", "14", "Termasuk derek"]], ["Kode", "Pemicu", "Pengalihan", "Status"], [["KON-14", "Laka beruntun Tebet", "MT Haryono", "Aktif"], ["KON-11", "Banjir Cawang", "Tol lingkar", "Siaga"], ["KON-08", "Kegiatan Sudirman", "Thamrin", "Siaga"], ["KON-04", "Padam APILL Grogol", "Latumeten", "Siaga"]]),
      operasional: sheet("Traffic Management Center", "Operasional & Pengendalian", "Tugas petugas dan perangkat yang sedang mengendalikan simpang.", [["Petugas lapangan", "42", "Shift sore"], ["Simpang dikendali", "48", "Prioritas harian"], ["Perintah terbuka", "7", "Menunggu tutup"]], ["Tugas", "Lokasi", "Unit", "Status"], [["Atur simpang", "Sudirman", "TMC-2", "Berjalan"], ["Derek", "Tebet", "PJ-11", "Di lokasi"], ["Patroli", "Cawang", "PJ-04", "Menuju"], ["Cek APILL", "Grogol", "TMC-1", "Selesai"]]),
      langgar: sheet("Safety & Security Center", "Penindakan Pelanggaran", "Tilang dan teguran yang tercatat kamera serta petugas bulan ini.", [["Pelanggaran", "1.090", "Bulan berjalan"], ["Tilang terbit", "640", "59% berlanjut"], ["Kepatuhan", "86%", "Naik 2 poin"]], ["Jenis", "Jumlah", "Sumber", "Tindak"], [["Tanpa helm", "420", "Kamera", "Tilang"], ["Kecepatan", "260", "Kamera", "Tilang"], ["Lawan arus", "180", "Petugas", "Tilang"], ["Parkir liar", "140", "Petugas", "Teguran"]]),
      jalan: sheet("Safety & Security Center", "Data Jalan", "Ruas, fungsi, dan kondisi perkerasan yang dipakai penilaian risiko.", [["Ruas", "1.126", "Jabodetabek"], ["Fungsi arteri", "214", "Prioritas pantau"], ["Perlu perbaikan", "37", "Laporan bulan ini"]], ["Kode", "Ruas", "Fungsi", "Kondisi"], [["JL-220", "Sudirman", "Arteri", "Baik"], ["JL-188", "Tebet Raya", "Kolektor", "Rusak ringan"], ["JL-164", "Cawang", "Arteri", "Baik"], ["JL-141", "Akses Priok", "Arteri", "Perbaikan"]]),
      blackspot: sheet("Safety & Security Center", "BlackSpot", "Lokasi dengan kecelakaan berulang dalam tiga tahun terakhir.", [["Titik", "26", "Masih aktif"], ["Baru tahun ini", "4", "Termasuk Tebet"], ["Sudah ditangani", "11", "Rekayasa selesai"]], ["Kode", "Lokasi", "Kejadian 3 th", "Tindakan"], [["BS-09", "Tebet", "18", "Investigasi"], ["BS-07", "Cawang", "14", "Rambu tambahan"], ["BS-04", "Grogol", "11", "APILL"], ["BS-02", "Blok M", "9", "Pantau"]]),
      troublespot: sheet("Safety & Security Center", "TroubleSpot", "Titik yang sering macet atau konflik arus, belum tentu tinggi fatalitasnya.", [["Titik", "19", "Dipantau harian"], ["Jam sibuk", "16", "Pagi dan sore"], ["Perlu rekayasa", "6", "Antrian teknis"]], ["Kode", "Lokasi", "Masalah", "Jam"], [["TS-12", "Sudirman", "Antrean panjang", "16.00–19.00"], ["TS-08", "Cawang", "Anyaman arus", "07.00–09.00"], ["TS-05", "Grogol", "APILL padam", "Sepanjang hari"], ["TS-03", "Kelapa Gading", "Parkir meluber", "Sore"]]),
      rawanlaka: sheet("Safety & Security Center", "Rawan Laka", "Ruas dengan peluang kecelakaan lebih tinggi dari rata-rata koridor.", [["Ruas", "15", "Skor di atas ambang"], ["Prioritas", "5", "Ditangani minggu ini"], ["Turun skor", "3", "Setelah rekayasa"]], ["Kode", "Ruas", "Skor", "Catatan"], [["RL-08", "Tebet dalam kota", "86", "Laka beruntun"], ["RL-06", "Akses bandara", "74", "Kecepatan tinggi"], ["RL-04", "Cawang", "71", "Anyaman"], ["RL-01", "Gambir", "64", "Motor"]]),
      rawanlanggar: sheet("Safety & Security Center", "Rawan Langgar", "Titik dengan pelanggaran berulang, terutama helm, kecepatan, dan lawan arus.", [["Titik", "22", "Kamera dan petugas"], ["Dominan", "Helm", "420 kasus"], ["Tilang minggu ini", "186", "Naik dari minggu lalu"]], ["Kode", "Lokasi", "Jenis", "Jumlah"], [["RG-18", "Blok M", "Tanpa helm", "64"], ["RG-14", "Sudirman", "Kecepatan", "41"], ["RG-09", "Kelapa Gading", "Parkir liar", "28"], ["RG-06", "Grogol", "Lawan arus", "19"]]),
      rawanlambat: sheet("Safety & Security Center", "Rawan Perlambatan", "Ruas yang kecepatannya sering jatuh di bawah ambang kelancaran.", [["Ruas", "12", "Di bawah 20 km/j"], ["Terparah", "Sudirman", "Sore hari"], ["Pulih setelah 19.00", "8", "Arus bergerak lagi"]], ["Kode", "Ruas", "Kecepatan", "Periode"], [["RP-07", "Sudirman", "12 km/j", "16.30–18.30"], ["RP-05", "Gatot Subroto", "16 km/j", "17.00–19.00"], ["RP-03", "Cawang", "18 km/j", "07.00–09.00"], ["RP-01", "Tol dalam kota", "22 km/j", "Hujan"]]),
      rawanpidana: sheet("Safety & Security Center", "Rawan Tindak Pidana", "Lokasi dengan laporan tindak pidana jalan yang perlu penjagaan tambahan.", [["Lokasi", "9", "Dalam pantauan"], ["Laporan bulan ini", "14", "Belum semua naik berkas"], ["Patroli tambahan", "4", "Malam hari"]], ["Kode", "Lokasi", "Jenis", "Shift"], [["RPID-06", "Tanah Abang", "Pencurian kendaraan", "Malam"], ["RPID-04", "Blok M", "Curanmor", "Sore"], ["RPID-02", "Akses Priok", "Begal", "Malam"], ["RPID-01", "Gambir", "Copet di halte", "Pagi"]]),
      rawanbencana: sheet("Safety & Security Center", "Rawan Bencana", "Titik yang cepat terganggu hujan, genangan, atau longsor ringan.", [["Titik", "11", "Musim hujan"], ["Siaga hari ini", "2", "Cawang dan Tebet"], ["Genangan aktif", "1", "Kolong Cawang"]], ["Kode", "Lokasi", "Ancaman", "Status"], [["RB-08", "Cawang", "Genangan", "Siaga"], ["RB-05", "Tebet", "Drainase lambat", "Pantau"], ["RB-03", "Kelapa Gading", "Genangan", "Aman"], ["RB-01", "Akses bandara", "Angin kencang", "Aman"]]),
      aktifitas: sheet("Manajemen Media", "Aktifitas", "Kabar dan unggahan operasional yang boleh tampil ke publik.", [["Terbit", "3", "November 2026"], ["Draf", "1", "Menunggu persetujuan"], ["Jangkauan", "18 rb", "Tujuh hari"]], ["Tanggal", "Kanal", "Judul", "Status"], [["12 Nov", "Berita", "Kecelakaan turun 18% di koridor dalam kota", "Terbit"], ["8 Nov", "Berita", "40 kamera baru di simpang rawan", "Terbit"], ["2 Nov", "Berita", "Respons lapangan menyentuh 4 menit", "Terbit"], ["16 Nov", "Internal", "Catatan shift sore", "Draf"]]),
      obv: sheet("Data Primer", "Objek Vital", "Kantor dan objek vital yang dijaga dalam radius pantauan komando.", [["Objek", "28", "Jabodetabek"], ["Siaga", "28", "Tidak ada yang kosong"], ["Insiden dekat", "2", "Dalam radius 1 km"]], ["Kode", "Objek", "Wilayah", "Kondisi"], [["OBV-01", "Kantor pusat komando", "Jakarta Selatan", "Aman"], ["OBV-04", "Bandara", "Jakarta Barat", "Dipantau"], ["OBV-07", "Pelabuhan Tanjung Priok", "Jakarta Utara", "Dipantau"], ["OBV-11", "Kompleks pemerintahan", "Jakarta Pusat", "Aman"]]),
      monitor: sheet("Data Primer", "Monitoring Data", "Kompilasi sumber data yang masuk ke ARSY hari ini.", [["Sumber hidup", "8", "Semua terhubung"], ["Kelengkapan", "99,2%", "Sampai 16.20"], ["Tertunda", "1", "Antrian kamera timur"]], ["Sumber", "Jenis", "Terakhir", "Kondisi"], [["SDC", "Pengemudi", "16.18", "Sinkron"], ["ERI", "Registrasi", "16.19", "Sinkron"], ["TMC", "Lalu lintas", "16.20", "Sinkron"], ["SSC", "Kejadian", "16.14", "Tertunda"]]),
      anatomi: sheet("Info Visual", "Anatomi Kecelakaan", "Rekaman dan sketsa kejadian yang dipakai membaca pola tabrakan.", [["Berkas", "4", "Terbuka"], ["Ada sketsa", "3", "Termasuk Tebet"], ["Menunggu video", "1", "Akses bandara"]], ["Kode", "Lokasi", "Pola", "Lampiran"], [["ACC-088", "Tebet", "Beruntun 3 kendaraan", "Video + sketsa"], ["ACC-086", "Gambir", "Tunggal motor", "Sketsa"], ["ACC-081", "Kelapa Gading", "Tabrak samping", "Foto"], ["ACC-079", "Akses bandara", "Tunggal mobil", "Video"]]),
      populasi: sheet("Data Sekunder", "Data Populasi", "Jumlah penduduk, kendaraan, dan pengguna jalan yang menjadi pembanding indikator.", [["Penduduk", "31 jt", "Jabodetabek"], ["Kendaraan", "21 jt", "Termasuk motor"], ["Rasio motor", "76%", "Dari kendaraan terdaftar"]], ["Wilayah", "Penduduk", "Kendaraan", "SIM aktif"], [["Jakarta Pusat", "1,1 jt", "0,9 jt", "0,7 jt"], ["Jakarta Selatan", "2,3 jt", "1,8 jt", "1,4 jt"], ["Tangerang", "3,9 jt", "2,4 jt", "1,6 jt"], ["Bekasi", "3,1 jt", "2,1 jt", "1,5 jt"]]),
      import: sheet("Pengaturan", "Import Data", "Berkas harian yang masuk dari IRSMS dan sumber lain.", [["Antrian", "2", "Menunggu proses"], ["Berhasil hari ini", "6", "Tanpa gagal baris"], ["Gagal", "1", "Format kolom"]], ["Berkas", "Jenis", "Baris", "Hasil"], [["laka_16nov.csv", "Laka IRSMS", "128", "Masuk"], ["langgar_16nov.csv", "Langgar", "640", "Masuk"], ["kendaraan_16nov.csv", "Kendaraan", "12.400", "Masuk"], ["sim_16nov.csv", "SIM", "860", "Ditolak"]]),
      edit: sheet("Pengaturan", "Edit Data", "Perubahan manual yang masih terbuka di meja operator.", [["Draf", "5", "Belum disimpan"], ["Menunggu review", "2", "Admin"], ["Selesai hari ini", "9", "Termasuk koreksi ruas"]], ["Kode", "Objek", "Petugas", "Status"], [["ED-22", "BS-09 Tebet", "Dina Saputra", "Review"], ["ED-21", "JL-188 Tebet Raya", "Bima Pratama", "Draf"], ["ED-18", "ACC-086 Gambir", "Maya Kusuma", "Selesai"], ["ED-16", "OBV-04 Bandara", "Dina Saputra", "Selesai"]]),
      log: sheet("Pengaturan", "Log Import", "Jejak unggah: siapa, kapan, dan berapa baris yang diterima.", [["Unggah 7 hari", "28", "Semua sumber"], ["Ditolak", "3", "Perlu unggah ulang"], ["Terakhir", "16.12", "laka_16nov.csv"]], ["Waktu", "Berkas", "Petugas", "Hasil"], [["16.12", "laka_16nov.csv", "Dina Saputra", "128 baris"], ["15.40", "langgar_16nov.csv", "Bima Pratama", "640 baris"], ["11.05", "kendaraan_16nov.csv", "Maya Kusuma", "12.400 baris"], ["09.18", "sim_16nov.csv", "Raka Hidayat", "Ditolak"]]),
      laporan: sheet("Pengaturan", "Laporan Harian", "Ringkasan yang dikirim ke pimpinan pada akhir shift.", [["Laporan", "16 Nov", "Shift pagi ditutup"], ["Laka", "4", "1 masih investigasi"], ["Langgar", "186", "Tilang dan teguran"]], ["Bagian", "Isi", "Angka", "Catatan"], [["Laka", "Kejadian baru", "4", "Tebet masih terbuka"], ["Langgar", "Tilang terbit", "112", "Helm mendominasi"], ["Lalin", "Indeks macet", "64", "Sore padat"], ["Respons", "Rata-rata datang", "4,1 mnt", "Sesuai target"]]),
      irms: sheet("Data Sekunder", "Data IRSMS", "Kecelakaan harian yang ditarik dari IRSMS.", [["Hari ini", "4", "16 Nov 2026"], ["Korban meninggal", "1", "Tebet"], ["Sudah cocok", "3", "Dengan meja ARSY"]], ["Kode IRSMS", "Lokasi", "Korban", "Status"], [["IRS-4412", "Tebet", "1 meninggal · 3 luka", "Investigasi"], ["IRS-4408", "Gambir", "1 luka ringan", "Selesai"], ["IRS-4401", "Kelapa Gading", "2 luka ringan", "Selesai"], ["IRS-4396", "Akses bandara", "Tidak ada korban", "Selesai"]]),
      langgarharian: sheet("Data Sekunder", "Data Langgar", "Pelanggaran yang masuk pada hari operasional ini.", [["Total", "186", "Sampai 16.20"], ["Tilang", "112", "Kamera 80, petugas 32"], ["Teguran", "74", "Sebagian parkir"]], ["Jam", "Jenis", "Lokasi", "Sumber"], [["16.05", "Kecepatan", "Sudirman", "Kamera"], ["15.40", "Tanpa helm", "Blok M", "Kamera"], ["14.12", "Parkir liar", "Tanah Abang", "Petugas"], ["11.20", "Lawan arus", "Grogol", "Petugas"]]),
      kendaraan: sheet("Data Sekunder", "Data Kendaraan", "Mutasi registrasi kendaraan yang masuk hari ini dari ERI.", [["Masuk", "12.400", "Baru, ubah, hapus"], ["Baru", "1.120", "Dominan motor"], ["Gagal cocok", "36", "Identitas tidak lengkap"]], ["Nomor", "Mutasi", "Jenis", "Hasil"], [["B 1842 KX", "Ubah alamat", "Mobil", "Masuk"], ["B 9021 AA", "Baru", "Motor", "Masuk"], ["B 7730 TQ", "Balik nama", "Truk", "Gagal"], ["B 1102 CD", "Hapus", "Motor", "Masuk"]]),
      mobile: sheet("Input", "Mobile apps", "Laporan yang masuk dari aplikasi petugas di lapangan.", [["Masuk hari ini", "28", "Sampai 16.20"], ["Menunggu", "4", "Belum diverifikasi"], ["Perangkat aktif", "36", "Shift sore"]], ["Kode", "Petugas", "Jenis", "Status"], [["APP-220", "Bima Pratama", "Laka", "Masuk"], ["APP-218", "Maya Kusuma", "Langgar", "Masuk"], ["APP-214", "Raka Hidayat", "Gangguan", "Menunggu"], ["APP-209", "Intan Lestari", "Kontingensi", "Masuk"]])
    };

    let leafMode = "show";
    let leafKey = "";
    let leafEdit = -1;
    const leafStore = {};

    function paintMenu(activeId, mode) {
      document.querySelectorAll("[data-leaf]").forEach((btn) => {
        const crud = btn.hasAttribute("data-crud");
        const on = btn.dataset.leaf === activeId && crud === (mode === "crud");
        const parent = btn.querySelector("i");
        btn.className = (parent ? LEAF_PARENT_BASE : LEAF_BASE) + (on
          ? "bg-brand-blue font-medium text-white"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900");
        if (parent) {
          parent.classList.toggle("text-white", on);
          parent.classList.toggle("text-slate-400", !on);
        }
      });
    }

    function leafRows(id) {
      if (!leafStore[id]) leafStore[id] = LEAVES[id].rows.map((row) => row.slice());
      return leafStore[id];
    }

    function hideLeafForm() {
      leafEdit = -1;
      document.getElementById("primerForm").classList.add("hidden");
    }

    function renderLeaf() {
      const item = LEAVES[leafKey];
      const crud = leafMode === "crud";
      const rows = leafRows(leafKey);
      const sekunder = ["populasi", "laporan", "irms", "langgarharian", "kendaraan"].includes(leafKey);
      document.getElementById("primerKicker").textContent = crud ? "Data Master" : (sekunder ? "Data Sekunder" : "Data Primer");
      document.getElementById("primerTitle").textContent = item.title;
      document.getElementById("primerLead").textContent = item.lead;
      document.getElementById("primerCrud").classList.toggle("hidden", !crud);
      document.getElementById("primerStats").innerHTML = item.stats.map((stat) => `
        <article class="rounded-xl border border-slate-200 bg-white p-4">
          <p class="text-xs text-slate-500">${esc(stat.label)}</p>
          <p class="mt-1 text-2xl font-semibold text-slate-900">${esc(stat.value)}</p>
          <p class="mt-1 text-xs text-slate-400">${esc(stat.note)}</p>
        </article>`).join("");
      const head = item.columns.map((col) => `<th class="px-4 py-3 font-semibold">${esc(col)}</th>`).join("") + (crud ? `<th class="px-4 py-3 font-semibold">Aksi</th>` : "");
      const body = rows.map((row, rowIndex) => {
        const cells = row.map((cell, index) => `<td class="px-4 py-3 ${index === 0 ? "font-medium text-slate-900" : "text-slate-600"}">${esc(cell)}</td>`).join("");
        const tools = crud ? `<td class="whitespace-nowrap px-4 py-3"><button type="button" data-row-edit="${rowIndex}" class="text-sm font-semibold text-brand-blue">Ubah</button><button type="button" data-row-del="${rowIndex}" class="ml-3 text-sm font-semibold text-red-600">Hapus</button></td>` : "";
        return `<tr class="border-t border-slate-100">${cells}${tools}</tr>`;
      }).join("");
      document.getElementById("primerTable").innerHTML = `
        <div class="overflow-x-auto">
          <table class="min-w-[640px] w-full text-left text-sm">
            <thead class="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr>${head}</tr></thead>
            <tbody>${body || `<tr><td class="px-4 py-6 text-slate-400" colspan="${item.columns.length + (crud ? 1 : 0)}">Belum ada data.</td></tr>`}</tbody>
          </table>
        </div>`;
    }

    function showLeafForm(index) {
      const item = LEAVES[leafKey];
      const row = index >= 0 ? leafRows(leafKey)[index] : item.columns.map(() => "");
      leafEdit = index;
      document.getElementById("primerFields").innerHTML = item.columns.map((col, field) => `
        <label class="block text-sm">
          <span class="mb-1 block text-xs font-semibold text-slate-500">${esc(col)}</span>
          <input data-field="${field}" value="${esc(row[field] || "")}" class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-blue" required>
        </label>`).join("");
      document.getElementById("primerForm").classList.remove("hidden");
    }

    function openLeaf(id, mode) {
      if (!canOpen(id)) return;
      const crud = mode === "crud";
      const view = !crud && LEAF_VIEW[id];
      if (view === "viewProfile" || view === "viewUsers") {
        switchOperatorView(view);
        paintMenu(id, "show");
        return;
      }
      if (id === "mobile") {
        switchOperatorView("viewSurvey");
        paintSurvey();
        paintMenu(id, "crud");
        return;
      }
      if (typeof MASTER_PAGES !== "undefined" && MASTER_PAGES[id]) {
        switchOperatorView("viewMaster");
        paintMaster(id);
        paintMenu(id, "crud");
        return;
      }
      const item = LEAVES[id];
      const button = document.querySelector(`[data-leaf="${id}"]`);
      const title = item ? item.title : (button ? button.textContent.trim() : "Halaman ini");
      document.getElementById("constructTitle").textContent = title;
      switchOperatorView("viewConstruction");
      paintMenu(id, crud ? "crud" : "show");
    }

    function toggleMenu(id) {
      const panel = document.getElementById("sub-" + id);
      if (!panel) return;
      panel.classList.toggle("hidden");
      const open = !panel.classList.contains("hidden");
      const chevron = document.querySelector(`[data-toggle="${id}"] [data-chevron]`);
      if (chevron) chevron.classList.toggle("rotate-180", open);
      const button = document.querySelector(`[data-toggle="${id}"]`);
      if (button) button.setAttribute("aria-expanded", open ? "true" : "false");
    }

    function switchOperatorView(viewId) {
      if (session && viewId !== "viewProfile" && viewId !== "viewConstruction" && viewId !== "viewMaster" && !canOpen(viewId)) return;
      const live = viewId === "viewMap" || viewId === "viewKeselamatan" || viewId === "viewProfile" || viewId === "viewUsers" || viewId === "viewMenuAdmin" || viewId === "viewPublicAdmin" || viewId === "viewSurvey" || viewId === "viewMaster";
      const shown = live ? viewId : "viewConstruction";
      activeView = viewId;
      document.querySelectorAll("[data-view]").forEach((section) => {
        section.classList.toggle("hidden-section", section.id !== shown);
      });
      if (!live) {
        const side = document.querySelector(`[data-side="${viewId}"] span`);
        if (side) document.getElementById("constructTitle").textContent = side.textContent.trim();
      }
      if (shown === "viewMenuAdmin") renderMenuAdmin();
      if (shown === "viewPublicAdmin") openPublicAdmin();
      if (shown === "viewSurvey") paintSurvey();

      document.querySelectorAll("[data-pill]").forEach((btn) => {
        const on = btn.dataset.pill === viewId;
        btn.className = PILL_BASE + (on
          ? "border-brand-orange text-brand-blue"
          : "border-transparent text-slate-500 hover:text-slate-900");
      });

      document.querySelectorAll("[data-side]").forEach((btn) => {
        const on = btn.dataset.side === viewId;
        btn.className = SIDE_BASE + (on
          ? "bg-[#e8eefc] font-semibold text-brand-blue"
          : "text-slate-700 hover:bg-slate-100");
        const icon = btn.querySelector("[data-side-icon]");
        if (icon) {
          icon.classList.toggle("text-brand-orange", on);
          icon.classList.toggle("text-slate-400", !on);
        }
        const count = btn.querySelector("[data-side-count]");
        if (count) {
          count.classList.toggle("text-white/60", on);
          count.classList.toggle("text-slate-400", !on);
        }
      });

      if (viewId === "viewMap") {
        setTimeout(() => {
          initMap();
          if (map && window.google && google.maps) google.maps.event.trigger(map, "resize");
        }, 200);
      }

      if (viewId !== "viewKeselamatan") setSafeTableFull(false);
      if (viewId === "viewKeamanan") mountChart("keamanan", "chartKeamanan", keamananConfig);
      if (viewId === "viewKeselamatan") renderSafeMap();
      if (viewId === "viewKetertiban") mountChart("ketertiban", "chartKetertiban", ketertibanConfig);
      if (viewId === "viewKelancaran") mountChart("kelancaran", "chartKelancaran", kelancaranConfig);
      paintMenu("");

      closeSidebar();
    }
