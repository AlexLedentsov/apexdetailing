(() => {
  const BOT_TOKEN = "";
  const CHAT_ID = "";

  const phrases = [
    "ЭСТЕТИКА ЧИСТОГО МЕТАЛЛА",
    "БЕЗУПРЕЧНЫЙ КОНТУР",
    "КУЛЬТ ДЕТАЛЕЙ",
    "ЗАЩИТА ТВОЕГО СТАТУСА",
  ];

  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  if (gsap && ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

  const title = document.getElementById("hero-title");
  const media = document.querySelector(".hero-media");
  const stage = document.getElementById("photo-stage");
  const slides = Array.from(document.querySelectorAll(".photo-slide"));
  const images = slides.map((slide) => slide.querySelector("img")).filter(Boolean);
  const finalTitle = document.getElementById("hero-final-title");
  const finalMeta = document.getElementById("hero-final-meta");
  const cta = document.getElementById("hero-cta");
  const video = document.querySelector(".hero-video");
  const serviceCards = Array.from(document.querySelectorAll(".service-card"));

  let phraseTimer = 0;
  let phraseIndex = 0;

  const stopPhrases = () => {
    window.clearInterval(phraseTimer);
    phraseTimer = 0;
  };

  const showPhrase = () => {
    if (!title || !gsap) return;
    title.textContent = phrases[phraseIndex];
    gsap.fromTo(
      title,
      { yPercent: 100, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 0.8, ease: "power4.out" }
    );
  };

  const startPhrases = () => {
    if (!gsap) return;
    stopPhrases();
    phraseIndex = 0;
    if (title) gsap.set(title, { yPercent: 100, opacity: 0 });
    showPhrase();
    phraseTimer = window.setInterval(() => {
      if (!title) return;
      gsap.to(title, {
        yPercent: -100,
        opacity: 0,
        duration: 0.45,
        ease: "power4.in",
        onComplete: () => {
          phraseIndex += 1;
          if (phraseIndex >= phrases.length) {
            stopPhrases();
            return;
          }
          showPhrase();
        },
      });
    }, 3200);
  };

  if (gsap && media && finalTitle && slides.length >= 5) {
    if (ScrollTrigger && serviceCards.length) {
      gsap.set(serviceCards, { y: 40, opacity: 0 });
      gsap.to(serviceCards, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: "#services",
          start: "top 78%",
        },
      });
    }

    const bentoCards = Array.from(document.querySelectorAll(".bento-card"));
    if (ScrollTrigger && bentoCards.length) {
      gsap.set(bentoCards, { y: 40, opacity: 0 });
      gsap.to(bentoCards, {
        y: 0,
        opacity: 1,
        duration: 0.85,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: "#standards",
          start: "top 78%",
        },
      });
    }

    const reviewsCarousel = document.getElementById("reviews-carousel");
    if (ScrollTrigger && reviewsCarousel) {
      gsap.set(reviewsCarousel, { y: 36, opacity: 0 });
      gsap.to(reviewsCarousel, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: "#trust",
          start: "top 80%",
        },
      });
    }

    const resetSlides = () => {
      slides.forEach((slide, i) => {
        gsap.set(slide, {
          clipPath: "inset(100% 0% 0% 0%)",
          zIndex: i + 1,
        });
      });
      gsap.set(images, { scale: 1.15, filter: "brightness(1)" });
    };

    resetSlides();
    if (stage) gsap.set(stage, { opacity: 0 });
    gsap.set(finalTitle, { yPercent: 100, opacity: 0 });
    gsap.set(finalMeta, { y: 16, opacity: 0 });
    gsap.set(cta, { y: 16, opacity: 0 });

    const tl = gsap.timeline();
    const videoEnd = 12.9;
    const wipe = 0.18;
    const hold = 0.12;

    tl.to(media, { opacity: 0, duration: 0.6, ease: "power2.inOut" }, videoEnd);
    if (stage) tl.to(stage, { opacity: 1, duration: 0.2, ease: "none" }, videoEnd + 0.45);

    slides.forEach((slide, i) => {
      const at = videoEnd + 0.65 + i * (wipe + hold);
      const img = images[i];

      tl.to(
        slide,
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: wipe,
          ease: "power3.inOut",
        },
        at
      );

      if (img) {
        tl.fromTo(
          img,
          { scale: 1.15 },
          { scale: 1, duration: wipe, ease: "power2.out" },
          at
        );
      }
    });

    const fifthAt = videoEnd + 0.65 + 4 * (wipe + hold);
    const finaleAt = fifthAt + wipe;

    tl.addLabel("finale", finaleAt);

    if (images[4]) {
      tl.to(
        images[4],
        { filter: "brightness(0.35)", duration: 0.6, ease: "power2.out" },
        "finale"
      );
    }

    tl.fromTo(
      finalTitle,
      { yPercent: 100, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 1.2, ease: "power4.out" },
      "finale+=0.15"
    );

    tl.fromTo(
      finalMeta,
      { y: 16, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.45, ease: "power2.out" },
      "finale+=0.55"
    );

    tl.to(cta, { y: 0, opacity: 1, duration: 0.4, ease: "power2.out" }, "finale+=0.7");

    const replay = () => {
      if (video) {
        video.currentTime = 0;
        video.play().catch(() => {});
      }
      resetSlides();
      if (stage) gsap.set(stage, { opacity: 0 });
      gsap.set(media, { opacity: 1 });
      gsap.set(finalTitle, { yPercent: 100, opacity: 0 });
      gsap.set(finalMeta, { y: 16, opacity: 0 });
      gsap.set(cta, { y: 16, opacity: 0 });
      startPhrases();
      tl.restart();
    };

    startPhrases();
    tl.eventCallback("onComplete", stopPhrases);

    document.getElementById("hero-replay")?.addEventListener("click", replay);
    document.getElementById("hero-skip")?.addEventListener("click", () => {
      stopPhrases();
      if (stage) gsap.set(stage, { opacity: 1 });
      slides.forEach((slide, i) => {
        gsap.set(slide, { clipPath: "inset(0% 0% 0% 0%)", zIndex: i + 1 });
      });
      gsap.set(images, { scale: 1 });
      if (images[4]) gsap.set(images[4], { filter: "brightness(0.35)" });
      tl.seek("finale");
      tl.play();
    });
  }

  const money = (n) =>
    `${Math.round(n)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, " ")} ₽`;

  const formatHours = (hours) => {
    if (!hours) return "Выберите услуги для расчёта срока";
    if (hours <= 8) return `Ориентировочный срок: ${hours} ч`;
    const days = Math.ceil(hours / 8);
    return `Ориентировочный срок: ${days} ${days === 1 ? "день" : days < 5 ? "дня" : "дней"}`;
  };

  const classButtons = Array.from(document.querySelectorAll(".quote-class"));
  const serviceInputs = Array.from(document.querySelectorAll('input[name="service"]'));
  const sumEl = document.getElementById("quote-sum");
  const timeEl = document.getElementById("quote-time");
  const toast = document.getElementById("toast");
  let activeCoef = 1;
  let activeClass = "Седан / Купе";

  const updateQuote = () => {
    let base = 0;
    let hours = 0;
    serviceInputs.forEach((input) => {
      if (!input.checked) return;
      base += Number(input.dataset.price || 0);
      hours += Number(input.dataset.hours || 0);
    });
    const total = base * activeCoef;
    if (sumEl) sumEl.textContent = money(total);
    if (timeEl) timeEl.textContent = formatHours(hours);
    return { total, hours, base };
  };

  classButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      classButtons.forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      activeCoef = Number(btn.dataset.coef || 1);
      activeClass = btn.dataset.class || activeClass;
      updateQuote();
    });
  });

  serviceInputs.forEach((input) => {
    input.addEventListener("change", updateQuote);
  });

  updateQuote();

  const scrollToQuote = (serviceKey) => {
    if (serviceKey) {
      const input = serviceInputs.find((el) => el.value === serviceKey);
      if (input) {
        input.checked = true;
        updateQuote();
      }
    }
    document.getElementById("quote")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  document.querySelectorAll("[data-scroll-quote]").forEach((btn) => {
    btn.addEventListener("click", () => scrollToQuote());
  });

  document.querySelectorAll("[data-service]").forEach((btn) => {
    btn.addEventListener("click", () => scrollToQuote(btn.getAttribute("data-service")));
  });

  const phoneInput = document.getElementById("quote-phone");
  const maskPhone = (value) => {
    const digits = value.replace(/\D/g, "").replace(/^8/, "7").slice(0, 11);
    let out = "+7";
    if (digits.length > 1) out += ` (${digits.slice(1, 4)}`;
    if (digits.length >= 4) out += digits.length > 4 ? ") " : ")";
    if (digits.length > 4) out += digits.slice(4, 7);
    if (digits.length > 7) out += `-${digits.slice(7, 9)}`;
    if (digits.length > 9) out += `-${digits.slice(9, 11)}`;
    return out;
  };

  phoneInput?.addEventListener("input", () => {
    phoneInput.value = maskPhone(phoneInput.value);
  });

  const showToast = (text) => {
    if (!toast) return;
    toast.textContent = text;
    toast.hidden = false;
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => {
      toast.hidden = true;
    }, 4200);
  };

  const buildTelegramMessage = ({ name, phone, car, services, total, hours }) => {
    const list = services.length ? services.join("\n") : "— не выбраны —";
    return [
      "Новая заявка Forge Automotive",
      `Имя: ${name}`,
      `Телефон: ${phone}`,
      `Авто: ${car}`,
      `Класс: ${activeClass} (x${activeCoef})`,
      "Услуги:",
      list,
      `Итого: ${money(total)}`,
      formatHours(hours),
    ].join("\n");
  };

  const sendToTelegram = async (text) => {
    if (!BOT_TOKEN || !CHAT_ID) return { ok: false, demo: true };
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text,
      }),
    });
    return { ok: res.ok, demo: false };
  };

  document.getElementById("quote-form")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const name = document.getElementById("quote-name")?.value.trim() || "";
    const phone = document.getElementById("quote-phone")?.value.trim() || "";
    const car = document.getElementById("quote-car")?.value.trim() || "";
    if (!name || !phone || !car) {
      showToast("Заполните имя, телефон и модель авто");
      return;
    }

    const selected = serviceInputs
      .filter((input) => input.checked)
      .map((input) => {
        const label = input.closest(".quote-service")?.querySelector("span")?.textContent || input.value;
        return `• ${label} — ${money(Number(input.dataset.price || 0))}`;
      });

    const { total, hours } = updateQuote();
    const text = buildTelegramMessage({ name, phone, car, services: selected, total, hours });

    try {
      const result = await sendToTelegram(text);
      showToast(
        result.demo || result.ok
          ? "Заявка принята! Менеджер свяжется с вами в течение 5 минут"
          : "Не удалось отправить. Попробуйте ещё раз"
      );
      if (result.demo || result.ok) event.target.reset();
      updateQuote();
    } catch (err) {
      showToast("Заявка принята! Менеджер свяжется с вами в течение 5 минут");
      event.target.reset();
      updateQuote();
    }
  });

  document.getElementById("to-top")?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  const initReviewsCarousel = () => {
    const root = document.getElementById("reviews-carousel");
    const track = document.getElementById("reviews-track");
    const viewport = root?.querySelector(".reviews-viewport");
    const progressEl = document.getElementById("reviews-progress");
    const prevBtn = document.getElementById("reviews-prev");
    const nextBtn = document.getElementById("reviews-next");
    if (!root || !track || !viewport) return;

    const slides = Array.from(track.querySelectorAll("[data-review-slide]"));
    if (!slides.length) return;

    const gap = 14;
    let index = 0;
    let dragX = 0;
    let startX = 0;
    let startY = 0;
    let dragging = false;
    let locked = false;
    let step = 0;
    let visible = 3;
    let maxIndex = 0;

    const getVisibleCount = () => {
      const w = window.innerWidth;
      if (w <= 767) return 1;
      if (w <= 1100) return 2;
      return 3;
    };

    const pad = (n) => String(n).padStart(2, "0");

    const measure = () => {
      visible = getVisibleCount();
      maxIndex = Math.max(0, slides.length - visible);
      if (index > maxIndex) index = maxIndex;
      const viewportWidth = viewport.clientWidth;
      step = (viewportWidth - gap * (visible - 1)) / visible + gap;
    };

    const apply = (animate = true) => {
      if (!animate) track.classList.add("is-dragging");
      else track.classList.remove("is-dragging");
      const offset = -index * step + dragX;
      track.style.transform = `translate3d(${offset}px, 0, 0)`;
      slides.forEach((slide, i) => {
        const inView = i >= index && i < index + visible;
        slide.setAttribute("aria-hidden", inView ? "false" : "true");
      });
      if (progressEl) {
        progressEl.textContent = `${pad(index + 1)} / ${pad(slides.length)}`;
      }
      if (prevBtn) prevBtn.disabled = index <= 0;
      if (nextBtn) nextBtn.disabled = index >= maxIndex;
    };

    const goTo = (next, animate = true) => {
      index = Math.max(0, Math.min(maxIndex, next));
      dragX = 0;
      apply(animate);
    };

    const onPointerDown = (event) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      dragging = true;
      locked = false;
      startX = event.clientX;
      startY = event.clientY;
      dragX = 0;
      track.classList.add("is-dragging");
      viewport.classList.add("is-grabbing");
      try {
        track.setPointerCapture(event.pointerId);
      } catch (_) {}
    };

    const onPointerMove = (event) => {
      if (!dragging) return;
      const dx = event.clientX - startX;
      const dy = event.clientY - startY;
      if (!locked) {
        if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 8) {
          dragging = false;
          dragX = 0;
          viewport.classList.remove("is-grabbing");
          apply(true);
          return;
        }
        if (Math.abs(dx) > 8) locked = true;
      }
      if (!locked) return;
      event.preventDefault();
      const base = -index * step;
      const proposed = base + dx;
      const clamped = Math.max(-maxIndex * step, Math.min(0, proposed));
      dragX = clamped - base;
      apply(false);
    };

    const onPointerUp = () => {
      if (!dragging && dragX === 0) {
        viewport.classList.remove("is-grabbing");
        return;
      }
      dragging = false;
      viewport.classList.remove("is-grabbing");
      const threshold = Math.max(40, step * 0.22);
      if (dragX <= -threshold) goTo(index + 1);
      else if (dragX >= threshold) goTo(index - 1);
      else goTo(index);
    };

    measure();
    apply(false);

    prevBtn?.addEventListener("click", () => goTo(index - 1));
    nextBtn?.addEventListener("click", () => goTo(index + 1));

    track.addEventListener("pointerdown", onPointerDown);
    track.addEventListener("pointermove", onPointerMove);
    track.addEventListener("pointerup", onPointerUp);
    track.addEventListener("pointercancel", onPointerUp);
    track.addEventListener("lostpointercapture", onPointerUp);

    root.setAttribute("tabindex", "0");
    root.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goTo(index - 1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        goTo(index + 1);
      }
    });

    window.addEventListener("resize", () => {
      measure();
      apply(false);
    });
  };

  initReviewsCarousel();

  document.querySelectorAll(".faq-item").forEach((item) => {
    const btn = item.querySelector(".faq-q");
    const panel = item.querySelector(".faq-a");
    if (!btn || !panel) return;

    btn.addEventListener("click", () => {
      const open = item.classList.contains("is-open");
      document.querySelectorAll(".faq-item.is-open").forEach((other) => {
        if (other === item) return;
        other.classList.remove("is-open");
        other.querySelector(".faq-q")?.setAttribute("aria-expanded", "false");
        const otherPanel = other.querySelector(".faq-a");
        if (otherPanel && gsap) gsap.to(otherPanel, { height: 0, duration: 0.35, ease: "power2.inOut" });
        else if (otherPanel) otherPanel.style.height = "0px";
      });

      if (open) {
        item.classList.remove("is-open");
        btn.setAttribute("aria-expanded", "false");
        if (gsap) gsap.to(panel, { height: 0, duration: 0.35, ease: "power2.inOut" });
        else panel.style.height = "0px";
        return;
      }

      item.classList.add("is-open");
      btn.setAttribute("aria-expanded", "true");
      const target = panel.scrollHeight;
      if (gsap) gsap.fromTo(panel, { height: 0 }, { height: target, duration: 0.4, ease: "power2.out" });
      else panel.style.height = `${target}px`;
    });
  });
})();
