// WeddingTale — interactions

(function () {
  const header = document.querySelector(".site-header");
  const nav = document.querySelector(".main-nav");
  const toggle = document.querySelector(".nav-toggle");

  // header background on scroll
  const onScroll = () => {
    header.classList.toggle("scrolled", window.scrollY > 40);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // mobile nav
  if (toggle) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.classList.toggle("open", open);
      document.body.style.overflow = open ? "hidden" : "";
    });
    nav.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        nav.classList.remove("open");
        toggle.classList.remove("open");
        document.body.style.overflow = "";
      })
    );
  }

  // hero slideshow — crossfade between backgrounds (preloaded so the fade never stalls)
  const slides = document.querySelectorAll(".hero-slides .hero-bg");
  if (slides.length > 1 && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    slides.forEach((s) => {
      const url = s.style.backgroundImage.match(/url\(["']?([^"')]+)/);
      if (url) new Image().src = url[1];
    });
    let current = 0;
    setInterval(() => {
      slides[current].classList.remove("active");
      current = (current + 1) % slides.length;
      slides[current].classList.add("active");
    }, 5500);
  }

  // scroll reveal
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("in"));
  }

  // lightbox
  const lightbox = document.querySelector(".lightbox");
  if (lightbox) {
    const lbImg = lightbox.querySelector("img");
    const items = Array.from(document.querySelectorAll("[data-lightbox]"));
    let idx = 0;

    const show = (i) => {
      idx = (i + items.length) % items.length;
      lbImg.src = items[idx].getAttribute("href");
    };
    const open = (i) => {
      show(i);
      lightbox.classList.add("open");
      document.body.style.overflow = "hidden";
    };
    const close = () => {
      lightbox.classList.remove("open");
      document.body.style.overflow = "";
    };

    items.forEach((a, i) =>
      a.addEventListener("click", (e) => {
        e.preventDefault();
        open(i);
      })
    );

    lightbox.querySelector(".lb-close").addEventListener("click", close);
    lightbox.querySelector(".lb-prev").addEventListener("click", () => show(idx - 1));
    lightbox.querySelector(".lb-next").addEventListener("click", () => show(idx + 1));
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) close();
    });
    document.addEventListener("keydown", (e) => {
      if (!lightbox.classList.contains("open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") show(idx - 1); // RTL: right = previous
      if (e.key === "ArrowLeft") show(idx + 1);
    });
  }

  // contact form (front-end only)
  const form = document.querySelector(".contact-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      form.querySelectorAll("input, textarea, button").forEach((el) => (el.disabled = true));
      form.querySelector(".form-success").style.display = "block";
    });
  }
})();
