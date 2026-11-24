    let publicPage = null;
    let publicDraft = null;
    let publicTab = "hero";

    const PUBLIC_FIELD = "pub-field";
    const FOCUS_TONES = [
      ["bg-brand-blue", "bg-blue-50", "text-brand-blue"],
      ["bg-brand-orange", "bg-orange-50", "text-brand-orange"],
      ["bg-red-500", "bg-red-50", "text-red-600"],
      ["bg-cyan-500", "bg-cyan-50", "text-cyan-600"],
      ["bg-emerald-500", "bg-emerald-50", "text-emerald-600"],
      ["bg-indigo-500", "bg-indigo-50", "text-indigo-600"],
      ["bg-slate-700", "bg-slate-100", "text-slate-700"],
      ["bg-amber-500", "bg-amber-50", "text-amber-600"]
    ];
    const INDICATOR_TONES = [
      ["bg-blue-50", "text-brand-blue"],
      ["bg-orange-50", "text-brand-orange"],
      ["bg-amber-50", "text-amber-600"],
      ["bg-cyan-50", "text-cyan-600"]
    ];

    function publicIcon(name) {
      const icon = String(name || "fa-circle").replace(/^fa-solid\s+/, "");
      return icon.indexOf("fa-") === 0 ? icon : "fa-" + icon;
    }

    function setText(id, value) {
      const node = document.getElementById(id);
      if (node) node.textContent = value == null ? "" : String(value);
    }

    function paintPublicPage(data) {
      if (!data) return;
      publicPage = data;
      const hero = data.hero || {};
      setText("heroBadge", hero.badge);
      const heroTitle = document.getElementById("heroTitle");
      if (heroTitle) {
        const lines = Array.isArray(hero.title) ? hero.title : String(hero.title || "").split(/\n/);
        heroTitle.innerHTML = lines.filter(Boolean).map((line) => `<span class="block">${esc(line)}</span>`).join("");
      }
      setText("heroLead", hero.lead);

      const profile = data.profile || {};
      setText("profileKicker", profile.kicker);
      setText("profileTitle", profile.title);
      const paras = document.getElementById("profileParagraphs");
      if (paras) {
        const list = Array.isArray(profile.paragraphs) ? profile.paragraphs : [];
        paras.innerHTML = list.map((text, index) => `<p class="${index === 0 ? "font-medium leading-relaxed text-slate-800" : ""}">${esc(text)}</p>`).join("");
      }
      setText("profileVisi", profile.visi);
      const misi = document.getElementById("profileMisi");
      if (misi) {
        const items = Array.isArray(profile.misi) ? profile.misi : [];
        misi.innerHTML = items.map((item, index) => {
          const last = index === items.length - 1;
          const label = item.title ? `<span class="font-semibold text-slate-900">${esc(item.title)}</span> ` : "";
          return `<li class="relative flex gap-4 ${last ? "" : "pb-5"}">
            ${last ? "" : '<span class="absolute left-[17px] top-9 h-[calc(100%-12px)] w-px bg-slate-200"></span>'}
            <span class="relative z-10 mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-blue text-xs font-bold text-white">${String(index + 1).padStart(2, "0")}</span>
            <p class="text-sm leading-relaxed text-slate-600">${label}${esc(item.body || "")}</p>
          </li>`;
        }).join("");
      }
      const tujuan = document.getElementById("profileTujuan");
      if (tujuan) {
        const items = Array.isArray(profile.tujuan) ? profile.tujuan : [];
        tujuan.innerHTML = items.map((text, index) => `<li class="flex gap-3 rounded-2xl bg-white/10 p-4 ring-1 ring-white/10">
          <span class="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-orange text-[10px] font-bold">${index + 1}</span>
          <p class="text-sm leading-relaxed text-white/85">${esc(text)}</p>
        </li>`).join("");
      }

      const focus = data.focus || {};
      setText("focusKicker", focus.kicker);
      setText("focusTitle", focus.title);
      const focusGrid = document.getElementById("focusGrid");
      if (focusGrid) {
        const items = Array.isArray(focus.items) ? focus.items : [];
        focusGrid.innerHTML = items.map((item, index) => {
          const tone = FOCUS_TONES[index % FOCUS_TONES.length];
          return `<article class="group overflow-hidden rounded-[1.4rem] border border-slate-200/80 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div class="h-1.5 ${tone[0]}"></div>
            <div class="p-6">
              <div class="flex items-center justify-between gap-3">
                <span class="grid h-11 w-11 place-items-center rounded-2xl ${tone[1]} ${tone[2]}"><i class="fa-solid ${esc(publicIcon(item.icon))}"></i></span>
                <span class="text-xs font-bold text-slate-300">${String(index + 1).padStart(2, "0")}</span>
              </div>
              <p class="mt-4 text-[11px] font-semibold uppercase tracking-wide text-brand-orange">${esc(item.title)}</p>
              <p class="mt-2 text-sm leading-relaxed text-slate-500">${esc(item.body)}</p>
            </div>
          </article>`;
        }).join("");
      }

      const news = data.news || {};
      setText("newsKicker", news.kicker);
      setText("newsTitle", news.title);
      setText("newsLead", news.lead);
      setText("newsPeriod", news.period);
      const newsGrid = document.getElementById("newsGrid");
      if (newsGrid) {
        const items = Array.isArray(news.items) ? news.items : [];
        if (!items.length) {
          newsGrid.innerHTML = `<p class="rounded-[1.4rem] border border-dashed border-slate-200 bg-white px-6 py-10 text-sm text-slate-500">Belum ada berita yang ditayangkan.</p>`;
        } else {
          const featured = items[0];
          const rest = items.slice(1);
          const side = rest.map((item, index) => newsSideCard(item, index + 1)).join("");
          newsGrid.innerHTML = `${newsFeaturedCard(featured, 0)}${rest.length ? `<div class="grid gap-5 lg:col-span-2">${side}</div>` : ""}`;
        }
      }

      const program = data.program || {};
      setText("programKicker", program.kicker);
      setText("programTitle", program.title);
      setText("programLead", program.lead);
      const programGrid = document.getElementById("programGrid");
      if (programGrid) {
        const items = Array.isArray(program.items) ? program.items : [];
        programGrid.innerHTML = items.map((item, index) => {
          if (index === 0) {
            return `<article class="rounded-[1.4rem] bg-brand-blue p-6 text-white shadow-lg shadow-blue-950/10 transition duration-300 hover:-translate-y-1 hover:shadow-xl">
              <p class="text-xs font-semibold uppercase tracking-[0.14em] text-orange-200">${esc(item.kicker)}</p>
              <h3 class="mt-3 text-xl font-semibold">${esc(item.title)}</h3>
              <p class="mt-2 text-sm leading-relaxed text-white/75">${esc(item.body)}</p>
              <p class="mt-6 text-sm font-medium text-orange-200">${esc(item.meta)}</p>
            </article>`;
          }
          return `<article class="rounded-[1.4rem] border border-slate-200/80 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
            <p class="text-xs font-semibold uppercase tracking-[0.14em] text-brand-orange">${esc(item.kicker)}</p>
            <h3 class="mt-3 text-xl font-semibold text-slate-900">${esc(item.title)}</h3>
            <p class="mt-2 text-sm leading-relaxed text-slate-500">${esc(item.body)}</p>
            <p class="mt-6 text-sm font-semibold text-brand-blue">${esc(item.meta)}</p>
          </article>`;
        }).join("");
      }
      setText("indicatorKicker", program.indicatorKicker);
      setText("indicatorTitle", program.indicatorTitle);
      const indicatorGrid = document.getElementById("indicatorGrid");
      if (indicatorGrid) {
        const items = Array.isArray(program.indicators) ? program.indicators : [];
        indicatorGrid.innerHTML = items.map((item, index) => {
          const tone = INDICATOR_TONES[index % INDICATOR_TONES.length];
          let note = "";
          if (item.tone === "up") note = `<p class="mt-3 text-xs font-medium text-emerald-600"><i class="fa-solid fa-arrow-trend-up"></i> ${esc(item.note)}</p>`;
          else if (item.tone === "down") note = `<p class="mt-3 text-xs font-medium text-emerald-600"><i class="fa-solid fa-arrow-trend-down"></i> ${esc(item.note)}</p>`;
          else note = `<p class="mt-3 text-xs font-medium text-slate-500"><i class="fa-solid fa-circle text-[8px] text-emerald-500"></i> ${esc(item.note)}</p>`;
          return `<article class="rounded-[1.4rem] border border-slate-200/80 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div class="grid h-11 w-11 place-items-center rounded-xl ${tone[0]} ${tone[1]}"><i class="fa-solid ${esc(publicIcon(item.icon))}"></i></div>
            <p class="mt-4 text-3xl font-semibold tracking-tight text-slate-900">${esc(item.value)}</p>
            <p class="mt-1 text-sm font-medium text-slate-700">${esc(item.label)}</p>
            ${note}
          </article>`;
        }).join("");
      }

      const contact = data.contact || {};
      setText("contactTitle", contact.title);
      setText("contactIntro", contact.intro);
      setText("contactOffice", contact.office);
      setText("contactAddress", contact.address);
      setText("contactPhoneLabel", contact.phone);
      setText("contactPhone", contact.phoneValue);
      setText("contactEmailLabel", contact.email);
      setText("contactEmail", contact.emailValue);
    }

    function newsFeaturedCard(item, index) {
      return `<article data-news="${index}" tabindex="0" class="group grid cursor-pointer overflow-hidden rounded-[1.6rem] bg-white shadow-sm ring-1 ring-slate-200/80 transition duration-300 hover:-translate-y-1 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue lg:col-span-3 lg:grid-cols-2">
        <div class="relative h-56 overflow-hidden sm:h-64 lg:h-auto lg:min-h-[420px]">
          <img src="${esc(item.image)}" alt="${esc(item.title)}" class="h-full w-full object-cover transition duration-700 group-hover:scale-105">
          <span class="absolute left-4 top-4 rounded-full bg-brand-orange px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white shadow-md">Utama</span>
        </div>
        <div class="flex flex-col p-6 sm:p-8">
          <div class="flex items-center gap-3 text-xs text-slate-500">
            <span class="rounded-full bg-orange-50 px-2.5 py-1 font-semibold text-brand-orange">${esc(item.category)}</span>
            <span>${esc(item.date)}</span>
          </div>
          <h3 class="mt-4 text-2xl font-bold leading-snug text-slate-900">${esc(item.title)}</h3>
          <p class="mt-3 text-sm leading-relaxed text-slate-500">${esc(item.excerpt)}</p>
          <span class="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold text-brand-blue">Baca selengkapnya <i class="fa-solid fa-arrow-right text-xs transition duration-300 group-hover:translate-x-1"></i></span>
        </div>
      </article>`;
    }

    function newsSideCard(item, index) {
      return `<article data-news="${index}" tabindex="0" class="group flex cursor-pointer overflow-hidden rounded-[1.6rem] bg-white shadow-sm ring-1 ring-slate-200/80 transition duration-300 hover:-translate-y-1 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue">
        <div class="relative w-28 shrink-0 overflow-hidden sm:w-36">
          <img src="${esc(item.image)}" alt="${esc(item.title)}" class="h-full w-full object-cover transition duration-700 group-hover:scale-105">
        </div>
        <div class="flex min-w-0 flex-1 flex-col p-4 sm:p-5">
          <div class="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
            <span class="rounded-full bg-blue-50 px-2.5 py-1 font-semibold text-brand-blue">${esc(item.category)}</span>
            <span>${esc(item.date)}</span>
          </div>
          <h3 class="mt-3 text-base font-semibold leading-snug text-slate-900">${esc(item.title)}</h3>
          <p class="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-500">${esc(item.excerpt)}</p>
          <span class="mt-auto inline-flex items-center gap-2 pt-4 text-sm font-semibold text-brand-blue">Baca <i class="fa-solid fa-arrow-right text-xs transition duration-300 group-hover:translate-x-1"></i></span>
        </div>
      </article>`;
    }

    function openPublicNews(index) {
      const items = (publicPage && publicPage.news && publicPage.news.items) || NEWS;
      const article = items && items[index];
      if (!article) return;
      document.getElementById("newsModalImage").src = article.image;
      document.getElementById("newsModalImage").alt = article.title;
      document.getElementById("newsModalMeta").textContent = `${article.category} · ${article.date}`;
      document.getElementById("newsModalTitle").textContent = article.title;
      document.getElementById("newsModalBody").textContent = article.body;
      document.getElementById("newsModal").classList.remove("hidden-section");
    }

    async function loadPublicPage() {
      try {
        const response = await fetch("/api/public");
        if (!response.ok) return;
        paintPublicPage(await response.json());
      } catch (error) {
        return;
      }
    }

    function publicClone(data) {
      return JSON.parse(JSON.stringify(data));
    }

    function publicInput(label, name, value, rows, hint) {
      const control = rows
        ? `<textarea data-public-field="${esc(name)}" rows="${rows}" class="${PUBLIC_FIELD}">${esc(value || "")}</textarea>`
        : `<input data-public-field="${esc(name)}" value="${esc(value || "")}" class="${PUBLIC_FIELD}">`;
      return `<label class="block"><span class="pub-label">${esc(label)}</span>${control}${hint ? `<span class="pub-hint">${esc(hint)}</span>` : ""}</label>`;
    }

    function publicCard(title, body, lead) {
      return `<article class="pub-card"><div class="pub-card-head"><div><h3>${esc(title)}</h3>${lead ? `<p>${esc(lead)}</p>` : ""}</div></div><div class="pub-card-body">${body}</div></article>`;
    }

    function publicItem(attr, index, label, inner, featured) {
      return `<div ${attr} class="pub-item${featured ? " is-featured" : ""}">
        <div class="pub-item-head">
          <span class="pub-item-num">${index + 1}</span>
          <p class="pub-item-label">${esc(label)}</p>
          ${publicRemoveBtn()}
        </div>
        ${inner}
      </div>`;
    }

    function collectPublicTab() {
      if (!publicDraft) return;
      const body = document.getElementById("publicAdminBody");
      if (!body) return;
      const field = (name) => {
        const node = body.querySelector(`[data-public-field="${name}"]`);
        return node ? node.value : "";
      };
      if (publicTab === "hero") {
        publicDraft.hero.badge = field("hero.badge");
        publicDraft.hero.title = field("hero.title").split(/\n/).map((line) => line.trim()).filter(Boolean);
        publicDraft.hero.lead = field("hero.lead");
      }
      if (publicTab === "profile") {
        publicDraft.profile.kicker = field("profile.kicker");
        publicDraft.profile.title = field("profile.title");
        publicDraft.profile.paragraphs = field("profile.paragraphs").split(/\n\s*\n/).map((line) => line.trim()).filter(Boolean);
        publicDraft.profile.visi = field("profile.visi");
        publicDraft.profile.misi = [...body.querySelectorAll("[data-public-misi]")].map((row) => ({
          title: (row.querySelector('[data-public-field="title"]') || {}).value || "",
          body: (row.querySelector('[data-public-field="body"]') || {}).value || ""
        }));
        publicDraft.profile.tujuan = [...body.querySelectorAll("[data-public-tujuan]")].map((row) => (row.querySelector('[data-public-field="body"]') || {}).value || "").filter(Boolean);
      }
      if (publicTab === "focus") {
        publicDraft.focus.kicker = field("focus.kicker");
        publicDraft.focus.title = field("focus.title");
        publicDraft.focus.items = [...body.querySelectorAll("[data-public-focus]")].map((row) => ({
          title: (row.querySelector('[data-public-field="title"]') || {}).value || "",
          body: (row.querySelector('[data-public-field="body"]') || {}).value || "",
          icon: (row.querySelector('[data-public-field="icon"]') || {}).value || "fa-circle"
        }));
      }
      if (publicTab === "news") {
        publicDraft.news.kicker = field("news.kicker");
        publicDraft.news.title = field("news.title");
        publicDraft.news.lead = field("news.lead");
        publicDraft.news.period = field("news.period");
        publicDraft.news.items = [...body.querySelectorAll("[data-public-news]")].map((row) => ({
          category: (row.querySelector('[data-public-field="category"]') || {}).value || "",
          date: (row.querySelector('[data-public-field="date"]') || {}).value || "",
          title: (row.querySelector('[data-public-field="title"]') || {}).value || "",
          excerpt: (row.querySelector('[data-public-field="excerpt"]') || {}).value || "",
          body: (row.querySelector('[data-public-field="body"]') || {}).value || "",
          image: (row.querySelector('[data-public-field="image"]') || {}).value || ""
        }));
      }
      if (publicTab === "program") {
        publicDraft.program.kicker = field("program.kicker");
        publicDraft.program.title = field("program.title");
        publicDraft.program.lead = field("program.lead");
        publicDraft.program.indicatorKicker = field("program.indicatorKicker");
        publicDraft.program.indicatorTitle = field("program.indicatorTitle");
        publicDraft.program.items = [...body.querySelectorAll("[data-public-program]")].map((row) => ({
          kicker: (row.querySelector('[data-public-field="kicker"]') || {}).value || "",
          title: (row.querySelector('[data-public-field="title"]') || {}).value || "",
          body: (row.querySelector('[data-public-field="body"]') || {}).value || "",
          meta: (row.querySelector('[data-public-field="meta"]') || {}).value || ""
        }));
        publicDraft.program.indicators = [...body.querySelectorAll("[data-public-indicator]")].map((row) => ({
          icon: (row.querySelector('[data-public-field="icon"]') || {}).value || "",
          value: (row.querySelector('[data-public-field="value"]') || {}).value || "",
          label: (row.querySelector('[data-public-field="label"]') || {}).value || "",
          note: (row.querySelector('[data-public-field="note"]') || {}).value || "",
          tone: (row.querySelector('[data-public-field="tone"]') || {}).value || "neutral"
        }));
      }
      if (publicTab === "contact") {
        publicDraft.contact.title = field("contact.title");
        publicDraft.contact.intro = field("contact.intro");
        publicDraft.contact.office = field("contact.office");
        publicDraft.contact.address = field("contact.address");
        publicDraft.contact.phone = field("contact.phone");
        publicDraft.contact.phoneValue = field("contact.phoneValue");
        publicDraft.contact.email = field("contact.email");
        publicDraft.contact.emailValue = field("contact.emailValue");
      }
    }

    function publicListToolbar(kind, addLabel) {
      return `<div class="mb-3 flex items-center justify-between gap-3">
        <p class="text-sm font-semibold text-slate-900">${esc(addLabel)}</p>
        <button type="button" data-public-add="${esc(kind)}" class="pub-add"><i class="fa-solid fa-plus"></i> Tambah</button>
      </div>`;
    }

    function publicRemoveBtn() {
      return `<button type="button" data-public-remove class="pub-remove" aria-label="Hapus"><i class="fa-solid fa-trash"></i></button>`;
    }

    function renderPublicAdmin() {
      const body = document.getElementById("publicAdminBody");
      if (!body || !publicDraft) return;
      document.querySelectorAll("[data-public-tab]").forEach((button) => {
        button.classList.toggle("is-on", button.dataset.publicTab === publicTab);
      });
      if (publicTab === "hero") {
        body.innerHTML = publicCard("Teks beranda", `<div class="space-y-4">
          ${publicInput("Label kecil", "hero.badge", publicDraft.hero.badge)}
          ${publicInput("Judul", "hero.title", (publicDraft.hero.title || []).join("\n"), 4, "Satu baris judul per baris.")}
          ${publicInput("Paragraf pengantar", "hero.lead", publicDraft.hero.lead, 5)}
        </div>`, "Bagian paling atas halaman publik.");
        return;
      }
      if (publicTab === "profile") {
        const misi = (publicDraft.profile.misi || []).map((item, index) => publicItem("data-public-misi", index, "Misi " + (index + 1),
          `<div class="grid gap-3 sm:grid-cols-2">${publicInput("Judul singkat", "title", item.title)}${publicInput("Uraian", "body", item.body, 3)}</div>`)).join("");
        const tujuan = (publicDraft.profile.tujuan || []).map((item, index) => publicItem("data-public-tujuan", index, "Tujuan " + (index + 1),
          publicInput("Uraian", "body", item, 3))).join("");
        body.innerHTML = `${publicCard("Identitas platform", `<div class="grid gap-4 sm:grid-cols-2">
          ${publicInput("Label", "profile.kicker", publicDraft.profile.kicker)}
          ${publicInput("Judul", "profile.title", publicDraft.profile.title)}
          <div class="sm:col-span-2">${publicInput("Paragraf", "profile.paragraphs", (publicDraft.profile.paragraphs || []).join("\n\n"), 8, "Pisahkan tiap paragraf dengan baris kosong.")}</div>
          <div class="sm:col-span-2">${publicInput("Visi", "profile.visi", publicDraft.profile.visi, 4)}</div>
        </div>`)}
        ${publicCard("Misi", `${publicListToolbar("misi", "Daftar misi")}<div class="space-y-3">${misi || `<p class="text-sm text-slate-400">Belum ada misi.</p>`}</div>`)}
        ${publicCard("Tujuan pengembangan", `${publicListToolbar("tujuan", "Daftar tujuan")}<div class="space-y-3">${tujuan || `<p class="text-sm text-slate-400">Belum ada tujuan.</p>`}</div>`)}`;
        return;
      }
      if (publicTab === "focus") {
        const items = (publicDraft.focus.items || []).map((item, index) => publicItem("data-public-focus", index, item.title || ("Focus " + (index + 1)),
          `<div class="grid gap-3 sm:grid-cols-[1fr_11rem]">${publicInput("Nama", "title", item.title)}${publicInput("Ikon", "icon", item.icon, 0, "Contoh: fa-link")}</div>
          <div class="mt-3">${publicInput("Uraian", "body", item.body, 3)}</div>`)).join("");
        body.innerHTML = `${publicCard("Judul bagian", `<div class="grid gap-4 sm:grid-cols-2">${publicInput("Label", "focus.kicker", publicDraft.focus.kicker)}${publicInput("Judul", "focus.title", publicDraft.focus.title)}</div>`)}
        ${publicCard("Kartu 6 Focus", `${publicListToolbar("focus", "Daftar kartu")}<div class="grid gap-3 xl:grid-cols-2">${items || `<p class="text-sm text-slate-400">Belum ada kartu.</p>`}</div>`)}`;
        return;
      }
      if (publicTab === "news") {
        const items = (publicDraft.news.items || []).map((item, index) => publicItem("data-public-news", index, index === 0 ? "Berita utama" : "Berita " + (index + 1),
          `<div class="grid gap-3 sm:grid-cols-2">${publicInput("Kategori", "category", item.category)}${publicInput("Tanggal", "date", item.date)}</div>
          <div class="mt-3">${publicInput("Judul", "title", item.title)}</div>
          <div class="mt-3">${publicInput("Ringkasan", "excerpt", item.excerpt, 2)}</div>
          <div class="mt-3">${publicInput("Isi lengkap", "body", item.body, 5)}</div>
          <div class="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
            <div class="pub-thumb"><img src="${esc(item.image || "")}" alt=""></div>
            <div class="min-w-0 flex-1">${publicInput("URL gambar", "image", item.image)}</div>
            <label class="pub-upload">
              <i class="fa-solid fa-image"></i> Unggah
              <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" data-public-upload class="hidden">
            </label>
          </div>`, index === 0)).join("");
        body.innerHTML = `${publicCard("Judul bagian", `<div class="grid gap-4 sm:grid-cols-2">
          ${publicInput("Label", "news.kicker", publicDraft.news.kicker)}
          ${publicInput("Periode", "news.period", publicDraft.news.period)}
          <div class="sm:col-span-2">${publicInput("Judul", "news.title", publicDraft.news.title)}</div>
          <div class="sm:col-span-2">${publicInput("Pengantar", "news.lead", publicDraft.news.lead, 3)}</div>
        </div>`)}
        ${publicCard("Daftar berita", `${publicListToolbar("news", "Urutan tampil")}<div class="space-y-3">${items || `<p class="text-sm text-slate-400">Belum ada berita.</p>`}</div>`, "Kartu pertama menjadi berita utama.")}`;
        return;
      }
      if (publicTab === "program") {
        const items = (publicDraft.program.items || []).map((item, index) => publicItem("data-public-program", index, item.title || ("Program " + (index + 1)),
          `<div class="grid gap-3 sm:grid-cols-2">${publicInput("Label", "kicker", item.kicker)}${publicInput("Judul", "title", item.title)}</div>
          <div class="mt-3">${publicInput("Uraian", "body", item.body, 3)}</div>
          <div class="mt-3">${publicInput("Catatan / target", "meta", item.meta)}</div>`)).join("");
        const indicators = (publicDraft.program.indicators || []).map((item, index) => publicItem("data-public-indicator", index, item.label || ("Indikator " + (index + 1)),
          `<div class="grid gap-3 sm:grid-cols-2">${publicInput("Nilai", "value", item.value)}${publicInput("Label", "label", item.label)}</div>
          <div class="mt-3 grid gap-3 sm:grid-cols-3">${publicInput("Ikon", "icon", item.icon)}${publicInput("Catatan", "note", item.note)}<label class="block"><span class="pub-label">Arah catatan</span><select data-public-field="tone" class="${PUBLIC_FIELD}"><option value="up"${item.tone === "up" ? " selected" : ""}>Naik</option><option value="down"${item.tone === "down" ? " selected" : ""}>Turun</option><option value="neutral"${item.tone === "neutral" ? " selected" : ""}>Netral</option></select></label></div>`)).join("");
        body.innerHTML = `${publicCard("Judul bagian", `<div class="grid gap-4 sm:grid-cols-2">
          ${publicInput("Label", "program.kicker", publicDraft.program.kicker)}
          ${publicInput("Judul", "program.title", publicDraft.program.title)}
          <div class="sm:col-span-2">${publicInput("Pengantar", "program.lead", publicDraft.program.lead, 3)}</div>
        </div>`)}
        ${publicCard("Program", `${publicListToolbar("program", "Kartu program")}<div class="grid gap-3 xl:grid-cols-2">${items || `<p class="text-sm text-slate-400">Belum ada program.</p>`}</div>`)}
        ${publicCard("Indikator", `<div class="mb-4 grid gap-4 sm:grid-cols-2">${publicInput("Label indikator", "program.indicatorKicker", publicDraft.program.indicatorKicker)}${publicInput("Judul indikator", "program.indicatorTitle", publicDraft.program.indicatorTitle)}</div>${publicListToolbar("indicator", "Kartu indikator")}<div class="grid gap-3 xl:grid-cols-2">${indicators || `<p class="text-sm text-slate-400">Belum ada indikator.</p>`}</div>`)}`;
        return;
      }
      body.innerHTML = publicCard("Contact Us", `<div class="grid gap-4 sm:grid-cols-2">
        <div class="sm:col-span-2">${publicInput("Judul", "contact.title", publicDraft.contact.title)}</div>
        <div class="sm:col-span-2">${publicInput("Pengantar", "contact.intro", publicDraft.contact.intro, 3)}</div>
        ${publicInput("Nama kantor", "contact.office", publicDraft.contact.office)}
        ${publicInput("Alamat", "contact.address", publicDraft.contact.address, 2)}
        ${publicInput("Label telepon", "contact.phone", publicDraft.contact.phone)}
        ${publicInput("Nomor", "contact.phoneValue", publicDraft.contact.phoneValue)}
        ${publicInput("Label email", "contact.email", publicDraft.contact.email)}
        ${publicInput("Email", "contact.emailValue", publicDraft.contact.emailValue)}
      </div>`, "Alamat, telepon, dan email yang tampil di Contact Us.");
    }

    async function openPublicAdmin() {
      const note = document.getElementById("publicAdminNote");
      const error = document.getElementById("publicAdminError");
      if (note) note.classList.add("hidden-section");
      if (error) error.classList.add("hidden-section");
      try {
        const response = await fetch("/api/public");
        const data = await response.json();
        publicDraft = publicClone(data && data.hero ? data : publicPage);
      } catch (err) {
        publicDraft = publicClone(publicPage);
      }
      if (!publicDraft || !publicDraft.hero) return;
      publicTab = "hero";
      renderPublicAdmin();
    }

    function publicAdminMessage(ok, text) {
      const note = document.getElementById("publicAdminNote");
      const error = document.getElementById("publicAdminError");
      note.classList.toggle("hidden-section", !ok);
      error.classList.toggle("hidden-section", ok);
      (ok ? note : error).textContent = text;
    }

    document.getElementById("newsGrid").addEventListener("click", (event) => {
      const card = event.target.closest("[data-news]");
      if (!card) return;
      openPublicNews(Number(card.dataset.news));
    });
    document.getElementById("newsGrid").addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      const card = event.target.closest("[data-news]");
      if (!card) return;
      event.preventDefault();
      openPublicNews(Number(card.dataset.news));
    });

    document.querySelectorAll("[data-public-tab]").forEach((button) => {
      button.addEventListener("click", () => {
        collectPublicTab();
        publicTab = button.dataset.publicTab;
        renderPublicAdmin();
      });
    });

    document.getElementById("publicAdminBody").addEventListener("click", (event) => {
      const add = event.target.closest("[data-public-add]");
      const remove = event.target.closest("[data-public-remove]");
      if (add) {
        collectPublicTab();
        const kind = add.dataset.publicAdd;
        if (kind === "misi") publicDraft.profile.misi.push({ title: "", body: "" });
        if (kind === "tujuan") publicDraft.profile.tujuan.push("");
        if (kind === "focus") publicDraft.focus.items.push({ title: "", body: "", icon: "fa-circle" });
        if (kind === "news") publicDraft.news.items.push({ category: "Berita", date: "", title: "", excerpt: "", body: "", image: "/img/stock/6f0a34c6712e.jpg" });
        if (kind === "program") publicDraft.program.items.push({ kicker: "Program", title: "", body: "", meta: "" });
        if (kind === "indicator") publicDraft.program.indicators.push({ icon: "fa-chart-simple", value: "", label: "", note: "", tone: "neutral" });
        renderPublicAdmin();
      }
      if (remove) {
        collectPublicTab();
        const misi = remove.closest("[data-public-misi]");
        const tujuan = remove.closest("[data-public-tujuan]");
        const focus = remove.closest("[data-public-focus]");
        const news = remove.closest("[data-public-news]");
        const program = remove.closest("[data-public-program]");
        const indicator = remove.closest("[data-public-indicator]");
        const indexOf = (list, node) => [...document.getElementById("publicAdminBody").querySelectorAll(list)].indexOf(node);
        if (misi) publicDraft.profile.misi.splice(indexOf("[data-public-misi]", misi), 1);
        if (tujuan) publicDraft.profile.tujuan.splice(indexOf("[data-public-tujuan]", tujuan), 1);
        if (focus) publicDraft.focus.items.splice(indexOf("[data-public-focus]", focus), 1);
        if (news) publicDraft.news.items.splice(indexOf("[data-public-news]", news), 1);
        if (program) publicDraft.program.items.splice(indexOf("[data-public-program]", program), 1);
        if (indicator) publicDraft.program.indicators.splice(indexOf("[data-public-indicator]", indicator), 1);
        renderPublicAdmin();
      }
    });

    document.getElementById("publicAdminBody").addEventListener("input", (event) => {
      const field = event.target.closest('[data-public-field="image"]');
      if (!field) return;
      const thumb = field.closest("[data-public-news]") && field.closest("[data-public-news]").querySelector(".pub-thumb img");
      if (thumb) thumb.src = field.value;
    });

    document.getElementById("publicAdminBody").addEventListener("change", async (event) => {
      const input = event.target.closest("[data-public-upload]");
      if (!input || !input.files || !input.files[0]) return;
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const response = await fetch("/api/public/photo", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: file.name, data: reader.result })
          });
          const data = await response.json();
          if (!response.ok) {
            publicAdminMessage(false, data.error || "Foto belum tersimpan.");
            return;
          }
          const row = input.closest("[data-public-news]");
          const field = row && row.querySelector('[data-public-field="image"]');
          const thumb = row && row.querySelector(".pub-thumb img");
          if (field) field.value = data.url;
          if (thumb) thumb.src = data.url;
        } catch (error) {
          publicAdminMessage(false, "Foto belum tersimpan.");
        }
      };
      reader.readAsDataURL(file);
    });

    document.getElementById("publicAdminSave").addEventListener("click", async () => {
      collectPublicTab();
      try {
        const response = await fetch("/api/public", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(publicDraft)
        });
        const data = await response.json();
        if (!response.ok) {
          publicAdminMessage(false, data.error || "Konten belum tersimpan.");
          return;
        }
        publicDraft = publicClone(data);
        paintPublicPage(data);
        publicAdminMessage(true, "Halaman publik sudah diperbarui.");
      } catch (error) {
        publicAdminMessage(false, "Konten belum tersimpan.");
      }
    });

    loadPublicPage();
