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
