const { query } = require("./db");

function clip(value, max) {
  return String(value == null ? "" : value).trim().slice(0, max);
}

function lines(value, maxLines, maxLen) {
  return String(value == null ? "" : value)
    .split(/\r?\n/)
    .map((line) => clip(line, maxLen))
    .filter(Boolean)
    .slice(0, maxLines);
}

function safeImage(url) {
  const value = clip(url, 240);
  if (value.indexOf("/img/") === 0 || value.indexOf("/uploads/") === 0) return value;
  return "";
}

function defaultPublic() {
  return {
    hero: {
      badge: "Sistem Management Kinerja",
      title: [
        "Memastikan Setiap Kebijakan",
        "Menjadi Langkah Nyata",
        "Menuju Peningkatan Kinerja."
      ],
      lead: "Mengubah data lalu lintas menjadi kecerdasan strategis untuk menghasilkan keputusan yang tepat, intervensi kebijakan yang terarah, dan peningkatan kinerja keselamatan lalu lintas yang terukur."
    },
    profile: {
      kicker: "Profile",
      title: "Platform ARSY",
      paragraphs: [
        "Platform ARSY merupakan platform informasi dan dokumentasi nasional yang menyajikan berbagai capaian, perkembangan, serta kemajuan program dan kegiatan yang dilaksanakan oleh Korlantas POLRI bersama stakeholder LLAJ dalam upaya meningkatkan kualitas Keselamatan, Keamanan, Ketertiban, dan Kelancaran lalu lintas di Indonesia.",
        "Platform ini dibangun sebagai media integrasi informasi yang memungkinkan setiap stakeholder dapat mengakses, menyampaikan, mendokumentasikan, dan mempublikasikan hasil pelaksanaan program serta kontribusinya dalam mewujudkan sistem lalu lintas yang aman, tertib, berkeselamatan, dan berkelanjutan.",
        "Melalui penyajian informasi yang terstruktur, terukur, dan berkesinambungan, platform ini diharapkan menjadi sumber referensi bersama dalam melihat perkembangan kinerja, mengidentifikasi pencapaian, serta mendorong peningkatan kualitas penyelenggaraan lalu lintas secara nasional."
      ],
      visi: "Terwujudnya ekosistem informasi kinerja keselamatan dan ketertiban lalu lintas nasional yang terintegrasi, transparan, akuntabel, dan berorientasi pada peningkatan keselamatan masyarakat.",
      misi: [
        { title: "Dokumentasi Capaian.", body: "Menghimpun dan mendokumentasikan berbagai capaian program keselamatan dan ketertiban lalu lintas dari seluruh stakeholder." },
        { title: "Integrasi Informasi.", body: "Menyediakan pusat informasi terpadu mengenai perkembangan pelaksanaan program dan kegiatan keselamatan lalu lintas." },
        { title: "Transparansi Kinerja.", body: "Mendorong keterbukaan informasi mengenai hasil dan kemajuan pelaksanaan program setiap stakeholder." },
        { title: "Kolaborasi Nasional.", body: "Memperkuat sinergi dan koordinasi antarinstansi dalam mewujudkan keselamatan lalu lintas." },
        { title: "Evaluasi dan Peningkatan.", body: "Menjadi referensi dalam mengukur perkembangan, mengevaluasi pencapaian, dan merumuskan langkah strategis peningkatan kinerja." }
      ],
      tujuan: [
        "Menyediakan dokumentasi capaian kinerja stakeholder secara nasional.",
        "Menampilkan perkembangan program keselamatan dan ketertiban lalu lintas berdasarkan wilayah dan instansi.",
        "Menyajikan informasi kegiatan, inovasi, kebijakan, dan implementasi program.",
        "Membangun basis informasi yang dapat digunakan untuk monitoring dan evaluasi.",
        "Mendorong budaya kerja berbasis kinerja, kolaborasi, dan hasil nyata."
      ]
    },
    focus: {
      kicker: "Tata kelola data",
      title: "6 Focus Tata Kelola Data",
      items: [
        { title: "Data Integration", body: "Memastikan seluruh data dari berbagai sumber terus mengalir, terintegrasi, dan tersinkronisasi secara konsisten untuk menghasilkan informasi yang selalu mutakhir.", icon: "fa-link" },
        { title: "Data Quality", body: "Menjaga akurasi, kelengkapan, konsistensi, dan validitas data agar setiap informasi yang dihasilkan dapat dipercaya dan menjadi dasar pengambilan keputusan.", icon: "fa-check-double" },
        { title: "System Monitoring", body: "Melakukan pemantauan sistem secara berkelanjutan untuk mendeteksi potensi gangguan, anomali, maupun kegagalan proses sejak dini sebelum berdampak terhadap operasional.", icon: "fa-desktop" },
        { title: "Database Performance", body: "Mengoptimalkan kinerja database agar proses penyimpanan, pengolahan, integrasi, dan penyajian data tetap berjalan cepat, efisien, dan stabil.", icon: "fa-database" },
        { title: "Backup & Recovery", body: "Memastikan perlindungan data melalui pencadangan berkala serta mekanisme pemulihan yang teruji untuk menjaga keberlangsungan operasional dan mencegah kehilangan data.", icon: "fa-cloud-arrow-up" },
        { title: "Governance & Security", body: "Menerapkan tata kelola dan pengamanan data melalui pengaturan hak akses, pengawasan penggunaan, serta perlindungan informasi agar data dikelola secara aman, terstruktur, dan bertanggung jawab.", icon: "fa-shield-halved" }
      ]
    },
    news: {
      kicker: "Berita & Data",
      title: "Kabar terbaru dari jalan",
      lead: "Satu kabar utama, lalu dua perkembangan yang masih pantas dibaca publik.",
      period: "November 2026",
      items: [
        {
          category: "Keselamatan",
          date: "12 Nov 2026",
          title: "Kecelakaan turun 18% di koridor dalam kota",
          excerpt: "Rekayasa simpang dan patroli respons cepat menekan fatalitas pada lima ruas prioritas di Jakarta Pusat dan Selatan.",
          body: "Lima ruas prioritas di Jakarta Pusat dan Selatan mencatat penurunan fatalitas setelah simpang diatur ulang dan patroli diikat ke layer gangguan nyata. Operator kini menerima rekomendasi dispatch dalam satu kartu kejadian, sehingga unit terdekat berangkat tanpa berpindah sistem.",
          image: "/img/stock/6f0a34c6712e.jpg"
        },
        {
          category: "Infrastruktur",
          date: "8 Nov 2026",
          title: "40 kamera baru di simpang rawan",
          excerpt: "Titik buta di Jakarta Selatan dan Timur masuk ke peta layer gangguan.",
          body: "Kamera tambahan menutup titik buta di Jakarta Selatan dan Timur. Setiap aliran masuk ke peta utama sebagai penanda AG, PG, atau GN, sehingga filter layer operator langsung memisahkan antrean ringan dari gangguan yang perlu dikerjakan hari ini.",
          image: "/img/stock/5f1a789f03ab.jpg"
        },
        {
          category: "Operasi",
          date: "2 Nov 2026",
          title: "Respons lapangan menyentuh 4 menit",
          excerpt: "Laporan publik dan dispatch operator memangkas waktu sampai di lokasi.",
          body: "Gabungan laporan publik dan antrian internal memangkas waktu sampai di lokasi menjadi rata-rata 4,1 menit pada minggu operasi terakhir. Angka ini yang tampil di indikator beranda dan di kartu keselamatan command center.",
          image: "/img/stock/96f08048776f.jpg"
        }
      ]
    },
    program: {
      kicker: "Program & Indicator",
      title: "Program jalan, lalu angkanya",
      lead: "Tiga program yang sedang berjalan, diikuti indikator yang sama dengan dasbor operator. Angka diperbarui setiap hari operasional.",
      items: [
        { kicker: "Program 01", title: "Patroli respons cepat", body: "Unit terdekat berangkat dari kartu kejadian yang sama, tanpa pindah sistem.", meta: "Target 4,1 menit" },
        { kicker: "Program 02", title: "Kamera simpang rawan", body: "Titik buta di selatan dan timur masuk ke layer peta, lalu dipantau dari command center.", meta: "326 kamera aktif" },
        { kicker: "Program 03", title: "Rekayasa koridor", body: "Simpang prioritas diatur ulang supaya fatalitas di lima ruas utama terus turun.", meta: "48 simpang prioritas" }
      ],
      indicatorKicker: "Indicator",
      indicatorTitle: "Kondisi jalan hari ini",
      indicators: [
        { icon: "fa-life-ring", value: "1.284", label: "Kejadian tertangani", note: "6% dari bulan lalu", tone: "up" },
        { icon: "fa-heart-pulse", value: "18%", label: "Penurunan fatalitas", note: "YoY pada koridor prioritas", tone: "down" },
        { icon: "fa-stopwatch", value: "4,1 mnt", label: "Rata-rata respons", note: "48 detik lebih cepat", tone: "down" },
        { icon: "fa-video", value: "326", label: "Titik CCTV aktif", note: "98% online hari ini", tone: "neutral" }
      ]
    },
    contact: {
      title: "Hubungi kami",
      intro: "Untuk Informasi data lalu lintas lebih detail dan kemitraan data, silahkan hubungi :",
      office: "Backoffice Pusat",
      address: "Jl. Letjen M.T. Haryono Kav. 37-38, Jakarta Selatan 12770",
      phone: "Telp",
      phoneValue: "+62 812-1689-0906",
      email: "Email",
      emailValue: "halo@arsy.id"
    }
  };
}

function listOf(items, mapFn, fallback, limit) {
  if (!Array.isArray(items)) return fallback.slice();
  return items.map(mapFn).filter(Boolean).slice(0, limit);
}

function sanitize(input) {
  const base = defaultPublic();
  const src = input && typeof input === "object" ? input : {};
  const hero = src.hero && typeof src.hero === "object" ? src.hero : {};
  const profile = src.profile && typeof src.profile === "object" ? src.profile : {};
  const focus = src.focus && typeof src.focus === "object" ? src.focus : {};
  const news = src.news && typeof src.news === "object" ? src.news : {};
  const program = src.program && typeof src.program === "object" ? src.program : {};
  const contact = src.contact && typeof src.contact === "object" ? src.contact : {};

  return {
    hero: {
      badge: clip(hero.badge, 80) || base.hero.badge,
      title: lines(Array.isArray(hero.title) ? hero.title.join("\n") : hero.title, 4, 80).length
        ? lines(Array.isArray(hero.title) ? hero.title.join("\n") : hero.title, 4, 80)
        : base.hero.title.slice(),
      lead: clip(hero.lead, 600) || base.hero.lead
    },
    profile: {
      kicker: clip(profile.kicker, 40) || base.profile.kicker,
      title: clip(profile.title, 80) || base.profile.title,
      paragraphs: listOf(
        Array.isArray(profile.paragraphs) ? profile.paragraphs : String(profile.paragraphs || "").split(/\n\s*\n/),
        (item) => clip(item, 800),
        base.profile.paragraphs,
        6
      ),
      visi: clip(profile.visi, 500) || base.profile.visi,
      misi: listOf(profile.misi, (item) => {
        if (!item) return null;
        if (typeof item === "string") return { title: "", body: clip(item, 280) };
        return { title: clip(item.title, 80), body: clip(item.body, 280) };
      }, base.profile.misi, 8),
      tujuan: listOf(profile.tujuan, (item) => clip(typeof item === "string" ? item : item && item.body, 280), base.profile.tujuan, 8)
    },
    focus: {
      kicker: clip(focus.kicker, 60) || base.focus.kicker,
      title: clip(focus.title, 80) || base.focus.title,
      items: listOf(focus.items, (item) => {
        if (!item) return null;
        return {
          title: clip(item.title, 80),
          body: clip(item.body, 400),
          icon: clip(item.icon, 40).replace(/^fa-solid\s+/, "") || "fa-circle"
        };
      }, base.focus.items, 8)
    },
    news: {
      kicker: clip(news.kicker, 40) || base.news.kicker,
      title: clip(news.title, 80) || base.news.title,
      lead: clip(news.lead, 240) || base.news.lead,
      period: clip(news.period, 40) || base.news.period,
      items: listOf(news.items, (item) => {
        if (!item || !clip(item.title, 160)) return null;
        return {
          category: clip(item.category, 40) || "Berita",
          date: clip(item.date, 40),
          title: clip(item.title, 160),
          excerpt: clip(item.excerpt, 280),
          body: clip(item.body, 2000),
          image: safeImage(item.image) || "/img/stock/6f0a34c6712e.jpg"
        };
      }, base.news.items, 12)
    },
    program: {
      kicker: clip(program.kicker, 40) || base.program.kicker,
      title: clip(program.title, 80) || base.program.title,
      lead: clip(program.lead, 280) || base.program.lead,
      items: listOf(program.items, (item) => {
        if (!item || !clip(item.title, 120)) return null;
        return {
          kicker: clip(item.kicker, 40),
          title: clip(item.title, 120),
          body: clip(item.body, 280),
          meta: clip(item.meta, 80)
        };
      }, base.program.items, 6),
      indicatorKicker: clip(program.indicatorKicker, 40) || base.program.indicatorKicker,
      indicatorTitle: clip(program.indicatorTitle, 80) || base.program.indicatorTitle,
      indicators: listOf(program.indicators, (item) => {
        if (!item) return null;
        const tone = item.tone === "up" || item.tone === "down" ? item.tone : "neutral";
        return {
          icon: clip(item.icon, 40).replace(/^fa-solid\s+/, "") || "fa-chart-simple",
          value: clip(item.value, 40),
          label: clip(item.label, 80),
          note: clip(item.note, 80),
          tone
        };
      }, base.program.indicators, 8)
    },
    contact: {
      title: clip(contact.title, 80) || base.contact.title,
      intro: clip(contact.intro, 280) || base.contact.intro,
      office: clip(contact.office, 80) || base.contact.office,
      address: clip(contact.address, 200) || base.contact.address,
      phone: clip(contact.phone, 40) || base.contact.phone,
      phoneValue: clip(contact.phoneValue, 40) || base.contact.phoneValue,
      email: clip(contact.email, 40) || base.contact.email,
      emailValue: clip(contact.emailValue, 80) || base.contact.emailValue
    }
  };
}

async function getPublic() {
  try {
    const rows = await query("SELECT payload FROM public_content WHERE id = 1");
    if (!rows.length) {
      const seeded = defaultPublic();
      await query("INSERT INTO public_content (id, payload) VALUES (1, ?)", [JSON.stringify(seeded)]);
      return seeded;
    }
    return sanitize(JSON.parse(rows[0].payload || "{}"));
  } catch (error) {
    return defaultPublic();
  }
}

async function savePublic(payload) {
  const next = sanitize(payload);
  await query(
    "INSERT INTO public_content (id, payload) VALUES (1, ?) ON DUPLICATE KEY UPDATE payload = VALUES(payload)",
    [JSON.stringify(next)]
  );
  return next;
}

module.exports = { defaultPublic, getPublic, savePublic, sanitize };
