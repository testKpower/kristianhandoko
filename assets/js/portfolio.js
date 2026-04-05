(() => {
  const body = document.body;
  const revealItems = document.querySelectorAll(".reveal");
  const tiltItems = document.querySelectorAll(".tilt-card");
  const navToggle = document.querySelector(".nav-toggle");
  const siteNav = document.querySelector(".site-nav");
  const currentPath = window.location.pathname.replace(/\/+$/, "") || "/";

  const markActiveNav = () => {
    const links = document.querySelectorAll(".site-nav a");
    links.forEach((link) => {
      const href = link.getAttribute("href");
      if (!href) return;
      const cleanedHref = href.replace(/\/+$/, "") || "/";
      const isCurrent =
        currentPath === cleanedHref ||
        (cleanedHref !== "/" && currentPath.startsWith(cleanedHref + "/"));
      link.classList.toggle("active", isCurrent);
    });
  };

  const initReveal = () => {
    if (!("IntersectionObserver" in window)) {
      revealItems.forEach((el) => el.classList.add("in-view"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    revealItems.forEach((item) => observer.observe(item));
  };

  const initTilt = () => {
    const maxTilt = 8;
    tiltItems.forEach((item) => {
      item.addEventListener("mousemove", (event) => {
        const rect = item.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const rotateY = ((x / rect.width) * 2 - 1) * maxTilt;
        const rotateX = ((y / rect.height) * -2 + 1) * maxTilt;
        item.style.transform = `perspective(1100px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
      });

      item.addEventListener("mouseleave", () => {
        item.style.transform = "";
      });
    });
  };

  const initMobileNav = () => {
    if (!navToggle || !siteNav) return;
    navToggle.addEventListener("click", () => {
      const isOpen = siteNav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });
  };

  const initProjectFilter = () => {
    const filterButtons = document.querySelectorAll("[data-filter]");
    const projectCards = document.querySelectorAll("[data-category]");
    if (!filterButtons.length || !projectCards.length) return;

    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const selected = button.getAttribute("data-filter");
        filterButtons.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");

        projectCards.forEach((card) => {
          const category = card.getAttribute("data-category");
          const shouldShow = selected === "all" || category === selected;
          card.style.display = shouldShow ? "block" : "none";
        });
      });
    });
  };

  const initYear = () => {
    const el = document.querySelector("[data-year]");
    if (el) el.textContent = String(new Date().getFullYear());
  };

  markActiveNav();
  initReveal();
  initTilt();
  initMobileNav();
  initProjectFilter();
  initYear();

  body.classList.add("is-ready");
})();
