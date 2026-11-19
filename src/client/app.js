    const PAGES = ["publicPortal", "loginPage", "operatorDashboard"];
    const PILL_BASE = "inline-flex h-12 shrink-0 items-center border-b-2 px-5 text-sm font-medium transition sm:px-7 ";
    const SIDE_BASE = "flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left text-[13px] transition ";

    const NEWS = [
      {
        category: "Keselamatan",
        date: "12 Nov 2026",
        title: "Kecelakaan turun 18% di koridor dalam kota",
        image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=1200&q=80",
        body: "Lima ruas prioritas di Jakarta Pusat dan Selatan mencatat penurunan fatalitas setelah simpang diatur ulang dan patroli diikat ke layer gangguan nyata. Operator kini menerima rekomendasi dispatch dalam satu kartu kejadian, sehingga unit terdekat berangkat tanpa berpindah sistem."
      },
      {
        category: "Infrastruktur",
        date: "8 Nov 2026",
        title: "40 kamera baru di simpang rawan",
        image: "https://images.unsplash.com/photo-1544620341-11cb2cd7c626?auto=format&fit=crop&w=1200&q=80",
        body: "Kamera tambahan menutup titik buta di Jakarta Selatan dan Timur. Setiap aliran masuk ke peta utama sebagai penanda AG, PG, atau GN, sehingga filter layer operator langsung memisahkan antrean ringan dari gangguan yang perlu dikerjakan hari ini."
      },
      {
        category: "Operasi",
        date: "2 Nov 2026",
        title: "Respons lapangan menyentuh 4 menit",
        image: "https://images.unsplash.com/photo-1465447142348-e9952c393450?auto=format&fit=crop&w=1200&q=80",
        body: "Gabungan laporan publik dan antrian internal memangkas waktu sampai di lokasi menjadi rata-rata 4,1 menit pada minggu operasi terakhir. Angka ini yang tampil di indikator beranda dan di kartu keselamatan command center."
      }
    ];

    const MAP_POINTS = [
      { id: "GN-01", lat: -6.175392, lng: 106.827168, type: "GN", title: "Bundaran HI", desc: "Antrean 1,2 km ke arah selatan. Lajur kanan masih merayap.", photo: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=900&q=70", jam: "16.30–19.30", waktu: "16 Nov 2026 · 17.42", penyebab: "Arus Sudirman bertemu Thamrin pada jam pulang kerja, ditambah kendaraan yang berhenti di mulut simpang.", ruas: "Nasional", ruasNama: "Jl. M.H. Thamrin", ka: null },
      { id: "GN-02", lat: -6.186214, lng: 106.834186, type: "GN", title: "Gambir", desc: "Kecelakaan tunggal menutup lajur lambat di sisi stasiun.", photo: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=900&q=70", jam: "07.00–09.00", waktu: "16 Nov 2026 · 08.16", penyebab: "Sepeda motor tergelincir di lajur lambat, antrean menumpuk sampai Medan Merdeka.", ruas: "Nasional", ruasNama: "Jl. Medan Merdeka Timur", ka: null },
      { id: "GN-03", lat: -6.125618, lng: 106.834492, type: "GN", title: "Tanjung Priok", desc: "Truk mogok menutup akses gerbang pelabuhan.", photo: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=900&q=70", jam: "09.00–15.00", waktu: "16 Nov 2026 · 11.05", penyebab: "Truk peti kemas mogok di lajur masuk, antrean truk menahan arus umum.", ruas: "Nasional", ruasNama: "Jl. Pelabuhan Tanjung Priok", ka: null },
      { id: "GN-04", lat: -6.261084, lng: 106.890126, type: "GN", title: "Tebet", desc: "Kecelakaan beruntun, dua lajur ditutup.", photo: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=900&q=70", jam: "17.00–19.00", waktu: "16 Nov 2026 · 17.28", penyebab: "Tabrakan beruntun tiga kendaraan setelah pengereman mendadak di turunan pendek.", ruas: "Kota", ruasNama: "Jl. Tebet Raya", ka: null },
      { id: "PG-01", lat: -6.208846, lng: 106.845612, type: "PG", title: "Sudirman", desc: "Potensi gangguan pada jam sibuk sore.", photo: "https://images.unsplash.com/photo-1489824904134-891ab64532f1?auto=format&fit=crop&w=900&q=70", jam: "16.30–19.00", waktu: "16 Nov 2026 · 16.50", penyebab: "Volume pejalan kaki di pelican crossing menahan pelepasan simpang.", ruas: "Nasional", ruasNama: "Jl. Jenderal Sudirman", ka: null },
      { id: "PG-02", lat: -6.194428, lng: 106.822914, type: "PG", title: "Tanah Abang", desc: "Parkir liar menyempitkan lajur di sisi pasar.", photo: "https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=900&q=70", jam: "10.00–16.00", waktu: "16 Nov 2026 · 13.10", penyebab: "Bongkar muat dan parkir liar di bahu mengurangi lebar efektif menjadi satu lajur.", ruas: "Kota", ruasNama: "Jl. KH. Wahid Hasyim", ka: null },
      { id: "PG-03", lat: -6.238276, lng: 106.975584, type: "PG", title: "Cawang", desc: "Perbaikan jalan di lajur kiri anyaman tol.", photo: "https://images.unsplash.com/photo-1465447142348-e9952c393450?auto=format&fit=crop&w=900&q=70", jam: "07.00–09.00 · 16.30–19.00", waktu: "16 Nov 2026 · 07.40", penyebab: "Pekerjaan perkerasan lajur kiri memaksa penggabungan arus sebelum simpang susun.", ruas: "Tol", ruasNama: "Tol Dalam Kota", ka: null },
      { id: "PG-04", lat: -6.138492, lng: 106.813318, type: "PG", title: "Kelapa Gading", desc: "Aktivitas pasar meluber ke bahu jalan.", photo: "https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=900&q=70", jam: "16.00–20.00", waktu: "16 Nov 2026 · 16.20", penyebab: "Pedagang dan pejalan kaki memakai bahu, sehingga motor masuk ke lajur cepat.", ruas: "Kota", ruasNama: "Jl. Boulevard Kelapa Gading", ka: null },
      { id: "PG-05", lat: -6.174486, lng: 106.788412, type: "PG", title: "Grogol", desc: "Lampu APILL padam di satu kaki simpang.", photo: "https://images.unsplash.com/photo-1489824904134-891ab64532f1?auto=format&fit=crop&w=900&q=70", jam: "07.00–09.00", waktu: "16 Nov 2026 · 07.22", penyebab: "APILL kaki utara padam, arus di simpang saling serobot.", ruas: "Provinsi", ruasNama: "Jl. Kyai Tapa", ka: null },
      { id: "AG-01", lat: -6.261508, lng: 106.810624, type: "AG", title: "Blok M", desc: "Antrean sedang, arus masih bergerak.", photo: "https://images.unsplash.com/photo-1501700493788-fa1a4fc9fe62?auto=format&fit=crop&w=900&q=70", jam: "17.00–19.30", waktu: "16 Nov 2026 · 17.55", penyebab: "Naik-turun penumpang di halte menahan lajur kiri, belum sampai macet total.", ruas: "Kota", ruasNama: "Jl. Melawai", ka: null },
      { id: "AG-02", lat: -6.229714, lng: 106.825286, type: "AG", title: "Senayan", desc: "Volume tinggi setelah acara, belum macet total.", photo: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=900&q=70", jam: "20.00–22.00", waktu: "16 Nov 2026 · 20.18", penyebab: "Kendaraan keluar gelanggang bersamaan, antrean pendek di mulut parkir.", ruas: "Kota", ruasNama: "Jl. Asia Afrika", ka: null },
      { id: "AG-03", lat: -6.168326, lng: 106.763784, type: "AG", title: "Akses bandara", desc: "Perlambatan di pintu tol, masih terkendali.", photo: "https://images.unsplash.com/photo-1465447142348-e9952c393450?auto=format&fit=crop&w=900&q=70", jam: "06.00–08.30", waktu: "16 Nov 2026 · 06.48", penyebab: "Antrean gardu tol pada penerbangan pagi, kecepatan turun di bawah 40 km/j.", ruas: "Tol", ruasNama: "Tol Prof. Dr. Sedyatmo", ka: null },
      { id: "AG-04", lat: -6.301486, lng: 106.815042, type: "AG", title: "Lenteng Agung", desc: "Volume normal hingga padat di jam berangkat.", photo: "https://images.unsplash.com/photo-1501700493788-fa1a4fc9fe62?auto=format&fit=crop&w=900&q=70", jam: "07.00–08.30", waktu: "16 Nov 2026 · 07.35", penyebab: "Naik-turun penumpang angkutan umum menahan lajur kiri.", ruas: "Kota", ruasNama: "Jl. Lenteng Agung Raya", ka: null },
      { id: "AG-05", lat: -6.214628, lng: 106.845118, type: "AG", title: "Setiabudi", desc: "Hujan lokal menurunkan kecepatan.", photo: "https://images.unsplash.com/photo-1494522358652-f30e61a60313?auto=format&fit=crop&w=900&q=70", jam: "15.00–18.00", waktu: "16 Nov 2026 · 15.26", penyebab: "Hujan sedang membuat jarak antar kendaraan melebar, belum ada genangan.", ruas: "Nasional", ruasNama: "Jl. H.R. Rasuna Said", ka: null },
      { id: "AG-06", lat: -6.292046, lng: 106.882018, type: "AG", title: "Pasar Minggu", desc: "Arus padat namun tetap mengalir.", photo: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=900&q=70", jam: "07.00–09.00", waktu: "16 Nov 2026 · 07.58", penyebab: "Penyeberang dan angkutan umum berhenti di lajur kiri pada jam sekolah.", ruas: "Provinsi", ruasNama: "Jl. Raya Pasar Minggu", ka: null },
      { id: "KA-01", lat: -6.329820, lng: 106.833410, type: "KA", title: "Lenteng Agung", wilayah: "Jakarta Selatan", desc: "Perlintasan sebidang di jalur Bogor. Palang menutup lajur pada jam komuter.", photo: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=900&q=70", jam: "06.00–09.00 · 16.30–19.30", waktu: "16 Nov 2026 · 07.12", penyebab: "Palang turun berulang mengikuti headway KRL, antrean motor menumpuk di kedua mulut.", ruas: "Kota", ruasNama: "Jl. Lenteng Agung Raya", ka: { kategori: "Sebidang berpalang", nama: "Perlintasan Lenteng Agung", km: "KM 22+140", wilayah: "Jakarta Selatan" } },
      { id: "KA-02", lat: -6.307640, lng: 106.838920, type: "KA", title: "Tanjung Barat", wilayah: "Jakarta Selatan", desc: "Perlintasan sebidang di selatan stasiun Tanjung Barat.", photo: "https://images.unsplash.com/photo-1501700493788-fa1a4fc9fe62?auto=format&fit=crop&w=900&q=70", jam: "06.30–09.00 · 16.30–19.00", waktu: "16 Nov 2026 · 07.28", penyebab: "Penutupan palang bersamaan dengan angkutan umum yang berhenti di lajur kiri.", ruas: "Kota", ruasNama: "Jl. Raya Tanjung Barat", ka: { kategori: "Sebidang berpalang", nama: "Perlintasan Tanjung Barat", km: "KM 19+860", wilayah: "Jakarta Selatan" } },
      { id: "KA-03", lat: -6.369140, lng: 106.831860, type: "KA", title: "Pondok Cina", wilayah: "Depok", desc: "Perlintasan tanpa palang di jalur Bogor, sisi Depok.", photo: "https://images.unsplash.com/photo-1489824904134-891ab64532f1?auto=format&fit=crop&w=900&q=70", jam: "06.30–08.30 · 16.00–18.30", waktu: "16 Nov 2026 · 07.41", penyebab: "Pengendara menerobos saat kereta mendekat karena tidak ada palang.", ruas: "Kota", ruasNama: "Jl. Margonda Raya", ka: { kategori: "Sebidang tanpa palang", nama: "Perlintasan Pondok Cina", km: "KM 26+420", wilayah: "Depok" } },
      { id: "KA-04", lat: -6.449360, lng: 106.807620, type: "KA", title: "Citayam", wilayah: "Depok", desc: "Perlintasan berpenjaga di pertemuan arus Depok dan Bogor.", photo: "https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=900&q=70", jam: "06.00–08.30 · 16.30–19.00", waktu: "16 Nov 2026 · 06.58", penyebab: "Penjaga menutup jalur saat rangkaian panjang lewat, antrean meluber ke simpang.", ruas: "Provinsi", ruasNama: "Jl. Raya Citayam", ka: { kategori: "Sebidang berpenjaga", nama: "Perlintasan Citayam", km: "KM 34+210", wilayah: "Depok" } },
      { id: "KA-05", lat: -6.485820, lng: 106.793960, type: "KA", title: "Bojong Gede", wilayah: "Bogor", desc: "Perlintasan sebidang berpalang di koridor komuter Bogor.", photo: "https://images.unsplash.com/photo-1465447142348-e9952c393450?auto=format&fit=crop&w=900&q=70", jam: "05.30–08.30 · 16.00–19.00", waktu: "16 Nov 2026 · 06.44", penyebab: "Palang turun lebih lama pada jam berangkat, truk ikut tertahan di tanjakan pendek.", ruas: "Kabupaten", ruasNama: "Jl. Raya Bojong Gede", ka: { kategori: "Sebidang berpalang", nama: "Perlintasan Bojong Gede", km: "KM 38+050", wilayah: "Bogor" } },
      { id: "KA-06", lat: -6.530780, lng: 106.800460, type: "KA", title: "Cilebut", wilayah: "Bogor", desc: "Perlintasan tanpa palang di utara Stasiun Cilebut.", photo: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=900&q=70", jam: "06.00–08.00 · 16.30–18.30", waktu: "16 Nov 2026 · 06.36", penyebab: "Tidak ada palang. Motor tetap melintas saat sinyal berbunyi.", ruas: "Kabupaten", ruasNama: "Jl. Raya Cilebut", ka: { kategori: "Sebidang tanpa palang", nama: "Perlintasan Cilebut", km: "KM 43+180", wilayah: "Bogor" } },
      { id: "KA-07", lat: -6.160640, lng: 106.769840, type: "KA", title: "Pesing", wilayah: "Jakarta Barat", desc: "Perlintasan sebidang di jalur Tangerang, sisi Pesing.", photo: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=900&q=70", jam: "06.30–09.00 · 16.30–19.30", waktu: "16 Nov 2026 · 07.18", penyebab: "Palang menutup akses Daan Mogot, antrean bercampur dengan truk logistik.", ruas: "Nasional", ruasNama: "Jl. Daan Mogot", ka: { kategori: "Sebidang berpalang", nama: "Perlintasan Pesing", km: "KM 5+640", wilayah: "Jakarta Barat" } },
      { id: "KA-08", lat: -6.172180, lng: 106.665720, type: "KA", title: "Batu Ceper", wilayah: "Tangerang", desc: "Perlintasan berpenjaga di jalur komuter Tangerang.", photo: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=900&q=70", jam: "06.00–08.30 · 16.30–19.00", waktu: "16 Nov 2026 · 07.05", penyebab: "Penjaga menahan arus saat dua rangkaian berpapasan, antrian masuk ke pasar.", ruas: "Kota", ruasNama: "Jl. Raya Batu Ceper", ka: { kategori: "Sebidang berpenjaga", nama: "Perlintasan Batu Ceper", km: "KM 16+280", wilayah: "Tangerang" } },
      { id: "KA-09", lat: -6.320160, lng: 106.665840, type: "KA", title: "Serpong", wilayah: "Tangerang Selatan", desc: "Perlintasan tanpa palang di jalur Rangkasbitung, sisi Serpong.", photo: "https://images.unsplash.com/photo-1494522358652-f30e61a60313?auto=format&fit=crop&w=900&q=70", jam: "06.30–09.00 · 17.00–19.30", waktu: "16 Nov 2026 · 07.33", penyebab: "Perlintasan tanpa palang di mulut permukiman. Pengendara mengandalkan sirene saja.", ruas: "Kota", ruasNama: "Jl. Raya Serpong", ka: { kategori: "Sebidang tanpa palang", nama: "Perlintasan Serpong", km: "KM 23+910", wilayah: "Tangerang Selatan" } },
      { id: "KA-10", lat: -6.301820, lng: 106.710420, type: "KA", title: "Sudimara", wilayah: "Tangerang Selatan", desc: "Perlintasan sebidang berpalang di dekat Stasiun Sudimara.", photo: "https://images.unsplash.com/photo-1465447142348-e9952c393450?auto=format&fit=crop&w=900&q=70", jam: "06.00–08.30 · 16.30–19.00", waktu: "16 Nov 2026 · 07.22", penyebab: "Palang turun pada jam sekolah, antrean menutup akses perumahan.", ruas: "Kota", ruasNama: "Jl. Raya Pondok Aren", ka: { kategori: "Sebidang berpalang", nama: "Perlintasan Sudimara", km: "KM 19+440", wilayah: "Tangerang Selatan" } },
      { id: "KA-11", lat: -6.220840, lng: 106.948160, type: "KA", title: "Cakung", wilayah: "Jakarta Timur", desc: "Perlintasan sebidang di jalur Bekasi, sisi Cakung.", photo: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=900&q=70", jam: "06.00–09.00 · 16.00–19.00", waktu: "16 Nov 2026 · 07.09", penyebab: "Palang menutup jalur industri. Truk dan motor berebut lajur saat palang naik.", ruas: "Nasional", ruasNama: "Jl. Raya Bekasi", ka: { kategori: "Sebidang berpalang", nama: "Perlintasan Cakung", km: "KM 15+070", wilayah: "Jakarta Timur" } },
      { id: "KA-12", lat: -6.225420, lng: 106.979360, type: "KA", title: "Kranji", wilayah: "Bekasi", desc: "Perlintasan berpenjaga di perbatasan Jakarta Timur dan Bekasi.", photo: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=900&q=70", jam: "05.30–08.30 · 16.30–19.30", waktu: "16 Nov 2026 · 06.51", penyebab: "Penjaga menutup perlintasan lebih awal karena jarak pandang pendek di tikungan.", ruas: "Nasional", ruasNama: "Jl. Raya Kranji", ka: { kategori: "Sebidang berpenjaga", nama: "Perlintasan Kranji", km: "KM 18+330", wilayah: "Bekasi" } },
      { id: "KA-13", lat: -6.235620, lng: 106.996840, type: "KA", title: "Bekasi", wilayah: "Bekasi", desc: "Perlintasan sebidang di barat Stasiun Bekasi.", photo: "https://images.unsplash.com/photo-1501700493788-fa1a4fc9fe62?auto=format&fit=crop&w=900&q=70", jam: "06.00–09.00 · 16.30–19.30", waktu: "16 Nov 2026 · 07.16", penyebab: "Palang turun di ruas nasional. Antrean menembus simpang Juanda.", ruas: "Nasional", ruasNama: "Jl. Ir. H. Juanda", ka: { kategori: "Sebidang berpalang", nama: "Perlintasan Bekasi", km: "KM 20+150", wilayah: "Bekasi" } }
    ];

    let users = [
      { id: "USR-2401", name: "Dina Saputra", email: "admin@arsy.id", password: "arsy1234", role: "Admin", provinsi: "", kota: "", polda: "", jabatan: "Admin", status: "Aktif" },
      { id: "USR-2410", name: "Komjen Pol. Andika Pratama", email: "kapolri@arsy.id", password: "arsy1234", role: "Eksekutif 1", provinsi: "", kota: "", polda: "", jabatan: "Kapolri", status: "Aktif" },
      { id: "USR-2411", name: "Irjen Pol. Raka Mahendra", email: "kapolda.metro@arsy.id", password: "arsy1234", role: "Eksekutif 2", provinsi: "DKI Jakarta", kota: "", polda: "Jakarta Raya", jabatan: "Kapolda Metro Jaya", status: "Aktif" },
      { id: "USR-2412", name: "Kombes Pol. Sari Wulandari", email: "kapolres.depok@arsy.id", password: "arsy1234", role: "Eksekutif 3", provinsi: "DKI Jakarta", kota: "Depok", polda: "Jakarta Raya", jabatan: "Kapolres Metro Depok", status: "Aktif" },
      { id: "USR-2413", name: "Bripka Dimas Putra", email: "operator.depok@arsy.id", password: "arsy1234", role: "Operator", provinsi: "DKI Jakarta", kota: "Depok", polda: "Jakarta Raya", jabatan: "Operator Depok", status: "Aktif" }
    ];
    let session = null;
    let menuGrants = null;

    const USER_AREAS = {
      "Aceh": ["Banda Aceh", "Lhokseumawe", "Langsa", "Sabang", "Subulussalam"],
      "Sumatera Utara": ["Medan", "Binjai", "Pematangsiantar", "Sibolga", "Tanjungbalai", "Tebing Tinggi"],
      "Sumatera Barat": ["Padang", "Bukittinggi", "Padang Panjang", "Pariaman", "Payakumbuh", "Solok"],
      "Riau": ["Pekanbaru", "Dumai"],
      "Kepulauan Riau": ["Tanjungpinang", "Batam"],
      "Jambi": ["Jambi", "Sungai Penuh"],
      "Sumatera Selatan": ["Palembang", "Lubuklinggau", "Pagar Alam", "Prabumulih"],
      "Kepulauan Bangka Belitung": ["Pangkalpinang"],
      "Bengkulu": ["Bengkulu"],
      "Lampung": ["Bandar Lampung", "Metro"],
      "DKI Jakarta": ["Jakarta Pusat", "Jakarta Utara", "Jakarta Barat", "Jakarta Selatan", "Jakarta Timur", "Kepulauan Seribu"],
      "Banten": ["Serang", "Cilegon", "Tangerang", "Tangerang Selatan"],
      "Jawa Barat": ["Bandung", "Bekasi", "Bogor", "Depok", "Cimahi", "Cirebon", "Sukabumi", "Tasikmalaya", "Banjar"],
      "Jawa Tengah": ["Semarang", "Surakarta", "Magelang", "Pekalongan", "Salatiga", "Tegal"],
      "DI Yogyakarta": ["Yogyakarta"],
      "Jawa Timur": ["Surabaya", "Malang", "Kediri", "Madiun", "Mojokerto", "Pasuruan", "Probolinggo", "Blitar", "Batu"],
      "Bali": ["Denpasar"],
      "Nusa Tenggara Barat": ["Mataram", "Bima"],
      "Nusa Tenggara Timur": ["Kupang"],
      "Kalimantan Barat": ["Pontianak", "Singkawang"],
      "Kalimantan Tengah": ["Palangka Raya"],
      "Kalimantan Selatan": ["Banjarmasin", "Banjarbaru"],
      "Kalimantan Timur": ["Samarinda", "Balikpapan", "Bontang"],
      "Kalimantan Utara": ["Tanjung Selor", "Tarakan"],
      "Sulawesi Utara": ["Manado", "Bitung", "Kotamobagu", "Tomohon"],
      "Sulawesi Tengah": ["Palu"],
      "Sulawesi Selatan": ["Makassar", "Palopo", "Parepare"],
      "Sulawesi Tenggara": ["Kendari", "Baubau"],
      "Gorontalo": ["Gorontalo"],
      "Sulawesi Barat": ["Mamuju"],
      "Maluku": ["Ambon", "Tual"],
      "Maluku Utara": ["Ternate", "Tidore Kepulauan"],
      "Papua": ["Jayapura"],
      "Papua Barat": ["Manokwari"],
      "Papua Barat Daya": ["Sorong"],
      "Papua Selatan": ["Merauke"],
      "Papua Tengah": ["Nabire"],
      "Papua Pegunungan": ["Wamena"]
    };

    function fillUserAreas(provinsi, kota) {
      const provinsiSelect = document.getElementById("userProvinsi");
      const names = Object.keys(USER_AREAS);
      if (!provinsiSelect.options.length) {
        provinsiSelect.innerHTML = names.map((name) => `<option>${esc(name)}</option>`).join("");
      }
      const nextProvinsi = names.includes(provinsi) ? provinsi : names[0];
      provinsiSelect.value = nextProvinsi;
      const cities = USER_AREAS[nextProvinsi] || [];
      const kotaSelect = document.getElementById("userKota");
      kotaSelect.innerHTML = cities.map((name) => `<option>${esc(name)}</option>`).join("");
      kotaSelect.value = cities.includes(kota) ? kota : cities[0];
    }

    const ACCESS_ROLES = ["Eksekutif 1", "Eksekutif 2", "Eksekutif 3", "Operator"];
    const METRO_KOTA = ["Jakarta Pusat", "Jakarta Utara", "Jakarta Barat", "Jakarta Selatan", "Jakarta Timur", "Kepulauan Seribu", "Depok", "Tangerang", "Tangerang Selatan", "Bekasi"];
    const POINT_KOTA = {
      "Bundaran HI": "Jakarta Pusat", "Gambir": "Jakarta Pusat", "Sudirman": "Jakarta Pusat", "Tanah Abang": "Jakarta Pusat", "Senayan": "Jakarta Pusat",
      "Tanjung Priok": "Jakarta Utara", "Kelapa Gading": "Jakarta Utara",
      "Tebet": "Jakarta Selatan", "Blok M": "Jakarta Selatan", "Setiabudi": "Jakarta Selatan", "Pasar Minggu": "Jakarta Selatan", "Lenteng Agung": "Jakarta Selatan", "Tanjung Barat": "Jakarta Selatan",
      "Cawang": "Jakarta Timur", "Cakung": "Jakarta Timur",
      "Grogol": "Jakarta Barat", "Pesing": "Jakarta Barat",
      "Akses bandara": "Tangerang", "Batu Ceper": "Tangerang",
      "Serpong": "Tangerang Selatan", "Sudimara": "Tangerang Selatan",
      "Kranji": "Bekasi", "Bekasi": "Bekasi",
      "Pondok Cina": "Depok", "Citayam": "Depok",
      "Bojong Gede": "Bogor", "Cilebut": "Bogor"
    };
    const POLRES_BY_POLDA = { "Jakarta Raya": METRO_KOTA.slice() };

    function roleLevel(user) {
      if (!user || user.role === "Admin" || user.role === "Eksekutif 1") return "nasional";
      if (user.role === "Eksekutif 2") return "provinsi";
      return "kota";
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
        if (key === "viewUsers" || key === "viewMenuAdmin") return;
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
      ACCESS_ROLES.forEach((role) => { grants[role] = {}; });
      menuCatalog().forEach((item) => {
        grants["Eksekutif 1"][item.key] = item.group !== "Data Master";
        grants["Eksekutif 2"][item.key] = ["viewMap", "viewKeselamatan", "viewKetertiban", "viewKelancaran"].includes(item.key) || item.group === "Data Sekunder";
        grants["Eksekutif 3"][item.key] = ["viewMap", "viewKeselamatan", "viewKeamanan"].includes(item.key);
        grants.Operator[item.key] = item.key === "viewMap" || item.key === "viewKeselamatan";
      });
      return grants;
    }

    function canOpen(key) {
      if (!session) return false;
      if (key === "profile") return true;
      if (key === "viewUsers" || key === "viewMenuAdmin" || key === "users") return session.role === "Admin";
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
        "Eksekutif 3": "Hanya data kota " + (session.kota || wilayah) + ". Data di luar kota ini tidak ditampilkan.",
        Operator: "Hanya data kota " + (session.kota || wilayah) + ", pada menu yang dibuka untuk petugas."
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

    function markerAllowed(kota) {
      const level = roleLevel(session);
      if (level === "nasional") return true;
      if (level === "provinsi") {
        if ((session.polda || poldaKey(session.provinsi)) === "Jakarta Raya") return METRO_KOTA.includes(kota);
        return false;
      }
      return kota === session.kota;
    }

    function applyMapScope() {
      if (!map) return;
      const counts = { AG: 0, PG: 0, GN: 0, KA: 0 };
      const level = roleLevel(session);
      Object.entries(layerGroups).forEach(([type, items]) => {
        items.forEach((item) => {
          const scoped = item.get && item.get("scoped");
          const allowed = scoped ? markerAllowed(item.get("kota")) : level !== "kota";
          const layerOn = document.getElementById("layer" + type).checked;
          item.setMap(allowed && layerOn ? map : null);
          if (scoped && allowed) counts[type] += 1;
        });
      });
      Object.entries(counts).forEach(([type, count]) => {
        const node = document.getElementById("count" + type);
        if (node) node.textContent = String(count);
      });
      const hint = document.getElementById("mapHint");
      if (hint) {
        const where = roleLevel(session) === "nasional" ? "seluruh wilayah" : scopeLabel(session);
        hint.textContent = "Cakupan " + where + ". Garis biru adalah jalur kereta. Klik palang atau titik gangguan untuk rincian.";
      }
    }

    let activeView = "viewMap";
    let map = null;
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
      if (session && viewId !== "viewProfile" && viewId !== "viewConstruction" && !canOpen(viewId)) return;
      const live = viewId === "viewMap" || viewId === "viewKeselamatan" || viewId === "viewProfile" || viewId === "viewUsers" || viewId === "viewMenuAdmin" || viewId === "viewSurvey";
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

      if (viewId === "viewKeamanan") mountChart("keamanan", "chartKeamanan", keamananConfig);
      if (viewId === "viewKeselamatan") renderSafeMap();
      if (viewId === "viewKetertiban") mountChart("ketertiban", "chartKetertiban", ketertibanConfig);
      if (viewId === "viewKelancaran") mountChart("kelancaran", "chartKelancaran", kelancaranConfig);
      paintMenu("");

      closeSidebar();
    }

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
      return {
        day: date.toLocaleDateString("id-ID", { day: "numeric", month: "short" }),
        time: date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
      };
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

    function esc(value) {
      return String(value).replace(/[&<>"']/g, (char) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      }[char]));
    }

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
          : "bg-slate-100 text-slate-500";
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
              <button type="button" data-user-action="view" data-user-index="${index}" class="grid h-8 w-8 place-items-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-brand-blue" aria-label="Lihat ${esc(user.name)}"><i class="fa-solid fa-eye"></i></button>
              <button type="button" data-user-action="edit" data-user-index="${index}" class="grid h-8 w-8 place-items-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-brand-blue" aria-label="Ubah ${esc(user.name)}"><i class="fa-solid fa-pen"></i></button>
              <button type="button" data-user-action="delete" data-user-index="${index}" class="grid h-8 w-8 place-items-center rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600" aria-label="Hapus ${esc(user.name)}"><i class="fa-solid fa-trash"></i></button>
            </div>
          </td>
        </tr>`;
      }).join("");
    }

    const USER_FIELDS = ["userName", "userEmail", "userPassword", "userRole", "userProvinsi", "userKota", "userStatus"];

    function syncUserScopeFields(user, locked) {
      const role = document.getElementById("userRole").value;
      const national = role === "Admin" || role === "Eksekutif 1";
      const provinceOnly = role === "Eksekutif 2";
      const provinsiSelect = document.getElementById("userProvinsi");
      const kotaSelect = document.getElementById("userKota");
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
      document.getElementById("userRole").value = user.role;
      document.getElementById("userStatus").value = user.status;
      syncUserScopeFields(user, locked);
      USER_FIELDS.forEach((id) => {
        if (id === "userProvinsi" || id === "userKota") return;
        document.getElementById(id).disabled = locked;
      });
    }

    function openUserModal(mode, index) {
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
      const blank = { name: "", email: "", password: "arsy1234", role: "Operator", provinsi: "DKI Jakarta", kota: "Jakarta Pusat", status: "Aktif" };
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
      return {
        name: document.getElementById("userName").value.trim(),
        email: document.getElementById("userEmail").value.trim(),
        password: document.getElementById("userPassword").value.trim() || "arsy1234",
        role: document.getElementById("userRole").value,
        provinsi: document.getElementById("userProvinsi").value === "Nasional" ? "" : document.getElementById("userProvinsi").value,
        kota: document.getElementById("userKota").value === "—" ? "" : document.getElementById("userKota").value,
        polda: document.getElementById("userProvinsi").value === "Nasional" ? "" : poldaKey(document.getElementById("userProvinsi").value),
        status: document.getElementById("userStatus").value
      };
    }

    function nextUserId() {
      const max = users.reduce((highest, user) => {
        const num = parseInt(user.id.replace("USR-", ""), 10);
        return Number.isFinite(num) ? Math.max(highest, num) : highest;
      }, 2400);
      return "USR-" + (max + 1);
    }

    let sidebarOpen = window.innerWidth >= 768;

    function renderSidebar() {
      const aside = document.getElementById("sidebar");
      const backdrop = document.getElementById("sidebarBackdrop");
      const desktop = window.innerWidth >= 768;
      aside.classList.toggle("-translate-x-full", !desktop && !sidebarOpen);
      aside.classList.toggle("md:-ml-80", desktop && !sidebarOpen);
      aside.classList.toggle("md:ml-0", !desktop || sidebarOpen);
      backdrop.classList.toggle("hidden", desktop || !sidebarOpen);
      const toggle = document.getElementById("toggleSidebar");
      if (toggle) toggle.setAttribute("aria-expanded", sidebarOpen ? "true" : "false");
      clearTimeout(renderSidebar.timer);
      renderSidebar.timer = setTimeout(() => {
        if (map && window.google && google.maps) google.maps.event.trigger(map, "resize");
      }, 220);
    }

    function openSidebar() {
      sidebarOpen = true;
      renderSidebar();
    }

    function closeSidebar() {
      if (window.innerWidth >= 768) return;
      sidebarOpen = false;
      renderSidebar();
    }

    function toggleSidebar() {
      sidebarOpen = !sidebarOpen;
      renderSidebar();
    }

    function tickClock() {
      const clock = document.getElementById("opsClock");
      const date = document.getElementById("opsDate");
      if (!clock) return;
      const now = new Date();
      const pad = (value) => String(value).padStart(2, "0");
      clock.textContent = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
      if (date) {
        date.textContent = now.toLocaleDateString("id-ID", { day: "2-digit", month: "short" }).replace(".", "");
      }
    }

    Chart.defaults.font.family = "Poppins";
    Chart.defaults.color = "#64748b";
    Chart.defaults.plugins.tooltip.backgroundColor = "#0f172a";
    Chart.defaults.plugins.tooltip.padding = 10;
    Chart.defaults.plugins.tooltip.cornerRadius = 10;

    document.getElementById("publicMenuBtn").addEventListener("click", () => {
      document.getElementById("publicMobileMenu").classList.toggle("hidden-section");
    });

    const publicSections = ["profile", "berita", "program", "contact"].map((id) => document.getElementById(id));
    function markPublicNav() {
      if (document.getElementById("publicPortal").classList.contains("hidden-section")) return;
      const line = window.scrollY + 140;
      let current = "";
      publicSections.forEach((section) => {
        if (section.offsetTop <= line) current = section.id;
      });
      document.querySelectorAll("[data-nav]").forEach((link) => {
        link.classList.toggle("is-active", link.dataset.nav === current);
      });
    }
    window.addEventListener("scroll", markPublicNav, { passive: true });
    markPublicNav();
    document.querySelectorAll("[data-close-public-menu]").forEach((link) => {
      link.addEventListener("click", () => {
        document.getElementById("publicMobileMenu").classList.add("hidden-section");
      });
    });

    document.getElementById("togglePassword").addEventListener("click", () => {
      const input = document.getElementById("passwordInput");
      const icon = document.querySelector("#togglePassword i");
      const reveal = input.type === "password";
      input.type = reveal ? "text" : "password";
      icon.className = reveal ? "fa-solid fa-eye-slash" : "fa-solid fa-eye";
    });

    document.getElementById("contactForm").addEventListener("submit", (event) => {
      event.preventDefault();
      document.getElementById("contactSuccess").classList.remove("hidden-section");
      event.currentTarget.reset();
    });

    document.querySelectorAll("[data-news]").forEach((button) => {
      const openNews = () => {
        const article = NEWS[Number(button.dataset.news)];
        document.getElementById("newsModalImage").src = article.image;
        document.getElementById("newsModalImage").alt = article.title;
        document.getElementById("newsModalMeta").textContent = `${article.category} · ${article.date}`;
        document.getElementById("newsModalTitle").textContent = article.title;
        document.getElementById("newsModalBody").textContent = article.body;
        document.getElementById("newsModal").classList.remove("hidden-section");
      };
      button.addEventListener("click", openNews);
      button.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openNews();
        }
      });
    });
    document.querySelectorAll("[data-close-news]").forEach((el) => {
      el.addEventListener("click", () => document.getElementById("newsModal").classList.add("hidden-section"));
    });

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
    document.getElementById("surveyForm").addEventListener("submit", (event) => {
      event.preventDefault();
      const photos = document.getElementById("surveyPhoto");
      if (!photos.files.length || photos.files.length > 3) {
        const note = document.getElementById("surveyFiles");
        note.className = "mt-3 text-sm text-red-600";
        note.classList.remove("hidden");
        note.textContent = "Lampirkan 1 sampai 3 foto.";
        return;
      }
      const cause = document.getElementById("surveyCause").value;
      const other = document.getElementById("surveyOther").value.trim();
      surveyReports.unshift({
        id: Date.now(),
        at: new Date(),
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
        photos: [...photos.files].map((file) => ({ name: file.name, url: URL.createObjectURL(file) }))
      });
      const done = document.getElementById("surveyDone");
      done.classList.remove("hidden");
      document.getElementById("surveyForm").reset();
      fillSurveyCause();
      paintSurvey();
      document.getElementById("surveyFiles").classList.add("hidden");
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
        const row = surveyReports.find((item) => item.id === id);
        if (row) row.photos.forEach((photo) => URL.revokeObjectURL(photo.url));
        surveyReports = surveyReports.filter((item) => item.id !== id);
        surveyOpen.delete(id);
        renderSurveyTable();
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

    function attemptLogin(email, password) {
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
      document.getElementById("menuGrantNote").textContent = "Akses diperbarui. Masuk dengan peran itu untuk melihat menunya.";
    });
    document.getElementById("menuGrantSave").addEventListener("click", () => {
      document.getElementById("menuGrantNote").textContent = "Tersimpan. Menu tiap peran langsung mengikuti pengaturan ini.";
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
