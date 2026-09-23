/* CAMILLA Beauty Studio — app: data, i18n engine, animations, booking */
(function () {
  "use strict";

  /* ============ CONFIG ============ */
  const CONFIG = {
    instagram: "shakhlo_nails",                 // Instagram handle
    telegram: "shahloNailSTUDIO",               // Telegram username
    instagramURL: "https://www.instagram.com/shakhlo_nails",
    telegramURL: "https://t.me/shahloNailSTUDIO",
    tz: "Asia/Tashkent"
  };
  window.CAMILLA_CONFIG = CONFIG;

  const $ = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));
  const RM = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ============ SERVICE DATA ============ */
  /* price: {t:'exact'|'from'|'range'|'per'|'plus', a, b} ; dur: {h} | {m,h} | {h1,h2} */
  const SERVICES = [
    { id: "m1", cat: "m", img: "portfolio-2", price: { t: "exact", a: 70000 }, dur: { h: 2 },
      name: { ru: "Маникюр без покрытия", uz: "Qoplamasiz manikyur", en: "Manicure without coating" } },
    { id: "m2", cat: "m", img: "portfolio-1", price: { t: "from", a: 140000 }, dur: { h: 2 },
      name: { ru: "Маникюр с покрытием", uz: "Qoplamali manikyur", en: "Manicure with coating" } },
    { id: "m3", cat: "m", img: "portfolio-4", price: { t: "plus", a: 20000 }, dur: { h: 2 },
      name: { ru: "Дизайн", uz: "Dizayn", en: "Nail art design" } },
    { id: "m4", cat: "m", img: "gallery-1", price: { t: "from", a: 300000 }, dur: { h: 2 },
      name: { ru: "Наращивание ногтей", uz: "Tirnoq uzaytirish", en: "Nail extensions" } },
    { id: "m5", cat: "m", img: "portfolio-3", price: { t: "per", a: 25000 }, dur: { h: 2 },
      name: { ru: "Ремонт ногтей", uz: "Tirnoq ta'mirlash", en: "Nail repair" } },
    { id: "m6", cat: "m", img: "gallery-2", price: { t: "exact", a: 30000 }, dur: { h: 2 },
      name: { ru: "Снятие покрытия", uz: "Qoplamani yechish", en: "Coating removal" } },
    { id: "p1", cat: "p", img: null, price: { t: "range", a: 200000, b: 400000 }, dur: { h: 2 },
      name: { ru: "Педикюр", uz: "Pedikyur", en: "Pedicure" } },
    { id: "p2", cat: "p", img: null, price: { t: "exact", a: 150000 }, dur: { h: 2 },
      name: { ru: "Обработка только пальчиков", uz: "Faqat barmoqlarni ishlov berish", en: "Toe-only treatment" } },
    { id: "p3", cat: "p", img: null, price: { t: "exact", a: 150000 }, dur: { h: 2 },
      name: { ru: "Обработка пяток", uz: "Tovonlarni ishlov berish", en: "Heel treatment" } },
    { id: "p4", cat: "p", img: null, price: { t: "from", a: 250000 }, dur: { h: 2 },
      name: { ru: "Педикюр с покрытием", uz: "Qoplamali pedikyur", en: "Pedicure with coating" } },
    { id: "d1", cat: "d", img: null, price: { t: "from", a: 100000 }, dur: { m: 60 },
      name: { ru: "Глубокое бикини", uz: "Chuqur bikini", en: "Deep bikini" } },
    { id: "d2", cat: "d", img: null, price: { t: "exact", a: 30000 }, dur: { m: 30 },
      name: { ru: "Подмышки", uz: "Qo'ltiqlar", en: "Underarms" } },
    { id: "d3", cat: "d", img: null, price: { t: "exact", a: 70000 }, dur: { m: 60 },
      name: { ru: "Руки полностью", uz: "Qo'llar to'liq", en: "Full arms" } },
    { id: "d4", cat: "d", img: null, price: { t: "exact", a: 100000 }, dur: { m: 60 },
      name: { ru: "Ноги полностью", uz: "Oyoqlar to'liq", en: "Full legs" } },
    { id: "a1", cat: "a", img: "access-bars", price: { t: "exact", a: 300000 }, consultation: 500000, dur: { h: 2 }, friday: true,
      name: { ru: "Access Bars", uz: "Access Bars", en: "Access Bars" } }
  ];
  const CATS = [
    { id: "m", img: "portfolio-1", tag: "Precision / Care / Design" },
    { id: "p", img: null, tag: "Balance / Comfort / Detail" },
    { id: "d", img: null, tag: "Clean / Delicate / Smooth" },
    { id: "a", img: "access-bars", tag: "32 points / Release / Awareness" }
  ];
  const REEL_IMGS = ["portfolio-1", "portfolio-2", "portfolio-3", "portfolio-4", "story-before-after", "gallery-1", "gallery-4"];
  const GRID_IMGS = [
    ["portfolio-1", "Lavender glossy manicure close-up"],
    ["portfolio-2", "Nude manicure with line art"],
    ["portfolio-3", "Deep red manicure"],
    ["portfolio-4", "Purple floral manicure"],
    ["gallery-1", "Nail art detail"],
    ["gallery-2", "Product set with violet tones"],
    ["gallery-4", "Premium cosmetic hand composition"]
  ];

  /* ============ I18N ============ */
  let lang = localStorage.getItem("camilla_lang") || "ru";
  if (!window.I18N?.[lang]) lang = "ru";
  const t = (k) => (window.I18N[lang] && window.I18N[lang][k]) || window.I18N.ru[k] || k;
  const loc = () => ({ ru: "ru-RU", uz: "uz-UZ", en: "en-US" }[lang]);

  const nf = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  function fmtPrice(p) {
    if (lang === "ru") {
      if (p.t === "exact") return nf(p.a) + " сум";
      if (p.t === "from") return "от " + nf(p.a) + " сум";
      if (p.t === "plus") return "от +" + nf(p.a) + " сум";
      if (p.t === "range") return "от " + nf(p.a) + " до " + nf(p.b) + " сум";
      return nf(p.a) + " сум / 1 ноготь";
    }
    if (lang === "uz") {
      if (p.t === "exact") return nf(p.a) + " so'm";
      if (p.t === "from") return nf(p.a) + " so'mdan";
      if (p.t === "plus") return "+" + nf(p.a) + " so'mdan";
      if (p.t === "range") return nf(p.a) + " – " + nf(p.b) + " so'm";
      return nf(p.a) + " so'm / 1 tirnoq";
    }
    if (p.t === "exact") return nf(p.a) + " UZS";
    if (p.t === "from") return "from " + nf(p.a) + " UZS";
    if (p.t === "plus") return "from +" + nf(p.a) + " UZS";
    if (p.t === "range") return nf(p.a) + " – " + nf(p.b) + " UZS";
    return nf(p.a) + " UZS / nail";
  }
  function fmtDur(d) {
    if (d.h1) {
      return lang === "ru" ? "1–1,5 часа" : lang === "uz" ? "1–1,5 soat" : "1–1.5 h";
    }
    if (d.m) {
      return lang === "ru" ? `${d.m} минут` : lang === "uz" ? `${d.m} daqiqa` : `${d.m} min`;
    }
    return lang === "ru" ? d.h + " часа" : lang === "uz" ? d.h + " soat" : d.h + " h";
  }

  function applyI18n() {
    document.documentElement.lang = lang;
    document.title = t("meta.title");
    $('meta[name="description"]').setAttribute("content", t("meta.desc"));
    $$("[data-i18n]").forEach((el) => (el.textContent = t(el.dataset.i18n)));
    $$("[data-i18n-ph]").forEach((el) => el.setAttribute("placeholder", t(el.dataset.i18nPh)));
    $$("[data-i18n-aria]").forEach((el) => el.setAttribute("aria-label", t(el.dataset.i18nAria)));
    $$(".lang-btn").forEach((b) => b.classList.toggle("on", b.dataset.lang === lang));
    renderCatalog();
    renderBookingStep();
    renderStatus();
    renderMarquees();
  }
  function setLang(l) {
    lang = l;
    localStorage.setItem("camilla_lang", l);
    applyI18n();
  }

  /* ============ CATALOG ============ */
  let catFilter = "all";
  let searchQ = "";

  function renderCatalog() {
    const wrap = $("#cats");
    if (!wrap) return;
    const list = CATS.filter((c) => catFilter === "all" || c.id === catFilter);
    let html = "";
    list.forEach((c, ci) => {
      const rows = SERVICES.filter((s) => s.cat === c.id)
        .filter((s) => !searchQ || s.name[lang].toLowerCase().includes(searchQ));
      const visible = rows.length > 0;
      html += `
      <article class="cat ${visible ? "" : "hide"}" data-cat="${c.id}" style="--i:${ci}">
        <header class="cat-head" data-reveal="right">
          <span class="cat-num">${String(ci + 1).padStart(2, "0")}</span>
          <div>
            <h3>${t("cat." + c.id)}</h3>
          <p class="cat-tag">${c.tag}</p>${c.id === "a" ? `<p class="cat-desc">${t("cat.a.desc")}</p>` : ""}
          </div>
          ${c.img && c.id !== "p" && c.id !== "d" ? `<div class="cat-visual"><img src="images/${c.img}.jpg" alt="${t("cat." + c.id)}" loading="lazy" class="kb"></div>` : ""}
        </header>
        <div class="table" role="table">
          <div class="tr th" role="row">
            <span>${t("serv.c.no")}</span><span>${t("serv.c.service")}</span><span class="c-cat">${t("serv.c.cat")}</span><span class="c-price">${t("serv.c.price")}</span><span class="c-time">${t("serv.c.time")}</span><span class="c-book">${t("serv.c.book")}</span>
          </div>
          ${rows.map((s, i) => `
          <div class="tr ${s.consultation ? "consultation-row" : ""}" role="row" data-reveal style="--d:${i * 60}ms">
            <span class="c-no">${String(i + 1).padStart(2, "0")}</span>
            <span class="c-name">${s.img && s.cat !== "p" && s.cat !== "d" ? `<img class="thumb" src="images/${s.img}.jpg" alt="" loading="lazy">` : ""}<b>${s.name[lang]}</b>${s.friday ? '<em class="fri">FRIDAY ONLY</em>' : ""}</span>
            <span class="c-cat">${t("cat." + s.cat)}</span>
            <span class="c-price"><b>${fmtPrice(s.price)}</b>${s.consultation ? `<span class="consultation-hint">${t("serv.consultation")}: ${nf(s.consultation)} ${lang === "ru" ? "сум" : lang === "uz" ? "so'm" : "UZS"}</span>` : ""}</span>
            <span class="c-time">${fmtDur(s.dur)}</span>
            <span class="c-book"><button class="btn btn-sm row-book" data-service="${s.id}">${t("serv.book")}</button></span>
          </div>`).join("")}
        </div>
      </article>`;
    });
    const any = list.some((c) => SERVICES.some((s) => s.cat === c.id && (!searchQ || s.name[lang].toLowerCase().includes(searchQ))));
    wrap.innerHTML = html + (any ? "" : `<p class="empty">${t("serv.empty")}</p>`);
    observeReveals(wrap);
  }

  /* ============ REVEAL ON SCROLL ============ */
  let io;
  function observeReveals(scope) {
    if (!io) {
      io = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    }
    $$("[data-reveal]:not(.in)", scope).forEach((el) => {
      if (RM) { el.classList.add("in"); return; }
      io.observe(el);
    });
  }

  /* ============ HERO SPLIT TEXT ============ */
  function splitHero() {
    const h = $("#heroTitle");
    if (!h || RM) return;
    const text = h.textContent;
    h.setAttribute("aria-label", text);
    h.innerHTML = text.split(" ").map((w, i) =>
      `<span class="w" style="--wi:${i}"><span class="wi">${w}</span></span>`).join(" ");
  }

  /* ============ COUNTERS ============ */
  function counters() {
    $$("[data-count]").forEach((el) => {
      const target = +el.dataset.count;
      if (RM) { el.textContent = target; return; }
      const io2 = new IntersectionObserver((es) => {
        es.forEach((e) => {
          if (!e.isIntersecting) return;
          io2.disconnect();
          const t0 = performance.now(), dur = 1400;
          const tick = (now) => {
            const p = Math.min(1, (now - t0) / dur);
            el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        });
      }, { threshold: 0.6 });
      io2.observe(el);
    });
  }

  /* ============ CUSTOM CURSOR ============ */
  function cursor() {
    if (RM || !window.matchMedia("(pointer:fine)").matches) return;
    const dot = $(".cursor-dot"), ring = $(".cursor-ring");
    if (!dot || !ring) return;

    let x = innerWidth / 2, y = innerHeight / 2, rx = x, ry = y;
    document.addEventListener("mousemove", (e) => {
      x = e.clientX;
      y = e.clientY;
      dot.style.transform = "translate(" + x + "px," + y + "px)";
    }, { passive: true });

    const loop = () => {
      rx += (x - rx) * 0.14;
      ry += (y - ry) * 0.14;
      ring.style.transform = "translate(" + rx + "px," + ry + "px)";
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);

    document.addEventListener("mouseover", (e) => {
      const hit = e.target.closest("a,button,.chip,.tr,[data-tilt]");
      ring.classList.toggle("grow", !!hit);
    });
  }
  /* ============ BRUSH CURSOR ============ */
  function brushCursor() {
    if (RM || !window.matchMedia("(pointer:fine)").matches) return;

    const brush = $("#brushCursor");
    if (!brush) return;

    const dot = $(".cursor-dot");
    const ring = $(".cursor-ring");
    if (dot) dot.style.display = "none";
    if (ring) ring.style.display = "none";

    let visible = false;
    let lastX = 0, lastY = 0;

    const move = (e) => {
      const x = e.clientX, y = e.clientY;
      const dx = x - lastX, dy = y - lastY;
      const speed = Math.min(1, Math.hypot(dx, dy) / 32);
      const angle = Math.atan2(dy, dx) * 180 / Math.PI;

      brush.style.transform =
        "translate3d(" + (x - 7) + "px," + (y - 7) + "px,0) " +
        "rotate(" + (angle * 0.06) + "deg) " +
        "scale(" + (1 + speed * 0.06) + ")";

      if (!visible) {
        visible = true;
        brush.classList.add("on");
      }
      lastX = x; lastY = y;
    };

    document.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerover", (e) => {
      const hit = e.target.closest("a,button,input,select,textarea,.chip,.tab,.tr,[data-tilt]");
      brush.classList.toggle("hover", !!hit);
    });
    document.addEventListener("pointerleave", () => {
      visible = false;
      brush.classList.remove("on");
    });
    document.addEventListener("pointerenter", () => {
      if (visible) brush.classList.add("on");
    });
  }

  /* ============ RIPPLE (click feedback) ============ */
  function ripple() {
    document.addEventListener("pointerdown", (e) => {
      const el = e.target.closest(".btn,.chip,.tab,.lang-btn,.ig-item,.row-book");
      if (!el || RM) return;
      const r = document.createElement("span");
      const rect = el.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 2.2;
      r.className = "ripple";
      r.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - rect.left - size / 2}px;top:${e.clientY - rect.top - size / 2}px`;
      el.appendChild(r);
      setTimeout(() => r.remove(), 700);
    });
  }

  /* ============ MAGNETIC BUTTONS ============ */
  function magnetic() {
    if (RM || !window.matchMedia("(pointer:fine)").matches) return;
    $$(".magnet").forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const dx = (e.clientX - r.left - r.width / 2) / r.width;
        const dy = (e.clientY - r.top - r.height / 2) / r.height;
        el.style.transform = `translate(${dx * 14}px,${dy * 10}px)`;
      });
      el.addEventListener("mouseleave", () => { el.style.transform = ""; });
    });
  }

  /* ============ TILT CARDS ============ */
  function tilt() {
    if (RM || !window.matchMedia("(pointer:fine)").matches) return;
    $$("[data-tilt]").forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(900px) rotateY(${px * 8}deg) rotateX(${-py * 8}deg) translateY(-4px)`;
      });
      el.addEventListener("mouseleave", () => { el.style.transform = ""; });
    });
  }

  /* ============ HEADER / PROGRESS / PARALLAX ============ */
  function scrollFx() {
    const header = $("#header"), bar = $(".progress i"), totop = $("#totop"), barMobile = $(".mobile-bar");
    let lastY = 0, ticking = false;
    const onScroll = () => {
      const y = scrollY;
      const max = document.documentElement.scrollHeight - innerHeight;
      bar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
      header.classList.toggle("scrolled", y > 40);
      header.classList.toggle("hidden", y > 500 && y > lastY + 4);
      if (y < 500 || y < lastY - 4) header.classList.remove("hidden");
      totop.classList.toggle("show", y > 900);
      const bk = $("#booking");
      const inBook = bk && y + innerHeight * 0.6 > bk.offsetTop && y < bk.offsetTop + bk.offsetHeight;
      barMobile.classList.toggle("show", y > 700 && !inBook);
      /* hero parallax */
      if (y < innerHeight * 1.2 && !RM) {
        $$("[data-parallax]").forEach((el) => {
          el.style.transform = `translate3d(0, ${y * parseFloat(el.dataset.parallax)}px, 0)`;
        });
      }
      /* scrollspy */
      let cur = "";
      ["specialist", "services", "reels", "booking", "info", "instagram", "contacts"].forEach((id) => {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= innerHeight * 0.42) cur = id;
      });
      $$(".nav a, .mobile-menu nav a").forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + cur));
      lastY = y;
      ticking = false;
    };
    addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
    onScroll();
  }

  /* ============ PINNED HORIZONTAL REEL ============ */
  function reel() {
    const wrap = $(".reel-wrap"), track = $(".reel-track");
    if (!wrap || !track) return;
    if (RM) { wrap.classList.add("static"); return; }
    let ticking = false;
    const update = () => {
      const rect = wrap.getBoundingClientRect();
      const total = wrap.offsetHeight - innerHeight;
      const p = Math.min(1, Math.max(0, -rect.top / total));
      const dist = track.scrollWidth - innerWidth + 80;
      track.style.transform = `translate3d(${-p * dist}px,0,0)`;
      /* center-focus scale on reel cards */
      if (!RM) {
        Array.from(track.children).forEach((c) => {
          const r = c.getBoundingClientRect();
          const d = Math.abs(r.left + r.width / 2 - innerWidth / 2) / innerWidth;
          c.style.transform = `scale(${(1.05 - Math.min(d, 0.6) * 0.16).toFixed(3)})`;
          c.style.opacity = (1 - Math.min(d, 0.7) * 0.45).toFixed(2);
        });
      }
      const pct = $(".reel-pct");
      if (pct) pct.textContent = String(Math.round(p * 100)).padStart(2, "0") + "%";
      ticking = false;
    };
    addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    addEventListener("resize", update);
    update();
  }

  /* ============ OPEN / CLOSED STATUS ============ */
  function tashkentNow() {
    return new Date(new Date().toLocaleString("en-US", { timeZone: CONFIG.tz }));
  }
  function statusNow() {
    const d = tashkentNow();
    const h = d.getHours() + d.getMinutes() / 60;
    if (h >= 12 && h < 13) return "break";
    if (h >= 9 && h < 18) return "open";
    return "closed";
  }
  function renderStatus() {
    const s = statusNow();
    $$("[data-status]").forEach((el) => {
      el.dataset.state = s;
      el.innerHTML = `<i></i>${t("status." + s)}`;
    });
  }

  /* ============ BOOKING ============ */
  const B = { step: 1, services: [], date: null, time: null, name: "", contact: "", comment: "", bookingNo: null };
  function bookingNumber() { if (!B.bookingNo) B.bookingNo = "CAM-" + String(Date.now()).slice(-6); return B.bookingNo; }
  let weekOffset = 0;
  let currentUser = null;

  async function api(path, options = {}) {
    const res = await fetch(path, { headers: { "Content-Type": "application/json", ...(options.headers || {}) }, ...options });
    const data = res.status === 204 ? {} : await res.json();
    if (!res.ok) throw new Error(data.error || "Request failed");
    return data;
  }

  async function loadUser() {
    try { currentUser = (await api("/api/auth/me")).user; } catch (_) { currentUser = null; }
  }

  function serviceById(id) { return SERVICES.find((s) => s.id === id); }
  function selectedServices() { return B.services.map(serviceById).filter(Boolean); }
  function totalMinutes() { const service = serviceById(B.services[0]); return service ? (service.dur.m || service.dur.h * 60) : 120; }
  function totalPrice() { return selectedServices().reduce((n, s) => n + s.price.a, 0); }
  function validContact(value) {
    const v = String(value || "").trim();
    if (!v) return false;
    if (/^@[A-Za-z0-9_]{5,32}$/.test(v)) return true;
    const digits = v.replace(/\D/g, "");
    return digits.length >= 9 && digits.length <= 15;
  }
  const isoDate = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  let occupiedBookings = [];

  function dates() {
    const out = [];
    const base = tashkentNow();
    for (let i = 0; i < 14; i++) {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      out.push(d);
    }
    return out;
  }
  function timeLabel(minutes) { return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`; }
  function isOccupied(date, start, duration) {
    const day = isoDate(date), startsAt = start * 60;
    return occupiedBookings.some((booking) => booking.starts_at.slice(0, 10) === day &&
      Number(booking.starts_at.slice(11, 13)) * 60 + Number(booking.starts_at.slice(14, 16)) < startsAt + duration &&
      Number(booking.ends_at.slice(11, 13)) * 60 + Number(booking.ends_at.slice(14, 16)) > startsAt);
  }
  function slotsFor(date) {
    const duration = totalMinutes();
    if (duration === 120) return [540, 780, 900].filter((start) => !isOccupied(date, start, duration));
    const slots = [];
    for (let start = 540; start + duration <= 1080; start += 30) {
      if (start < 780 && start + duration > 720) continue;
      if (!isOccupied(date, start, duration)) slots.push(start);
    }
    return slots;
  }
  async function loadOccupiedBookings() {
    try { occupiedBookings = (await api("/api/bookings/occupied")).bookings || []; renderBookingStep(); }
    catch (_) { occupiedBookings = []; }
  }
  function renderWeekSchedule() {
    const host = $("#weekSchedule"); if (!host) return;
    const base = tashkentNow();
    const todayIso = isoDate(base);
    const clock = $("#liveClock");
    if (clock) clock.textContent = base.toLocaleTimeString(loc(), { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    const caption = $("#todayCaption");
    if (caption) caption.textContent = base.toLocaleDateString(loc(), { weekday: "long", day: "numeric", month: "long" });
    const d = base, open=540, close=1080;
    host.innerHTML = (() => {
      const duration = 120, blocks=[]; const h=timeLabel;
      const nowMinutes = base.getHours()*60 + base.getMinutes();
      for (const m of [open, 780, 900]) { const end=m+duration; if (m <= nowMinutes) continue; const selected=B.date===todayIso&&B.time===h(m), busy=isOccupied(base, m, duration); blocks.push(`<button class="week-slot ${selected?"is-selected":busy?"is-busy":"is-free"}" data-week-date="${todayIso}" data-week-time="${busy ? "" : h(m)}" ${busy ? 'data-week-busy="true"' : ""}><b>${h(m)}–${h(end)}</b><small>${selected?"Выбрано ✓":busy?"Занято":"Доступно"}</small></button>`); if (m === open) blocks.push(`<span class="week-slot is-pause"><b>12:00–13:00</b><small>Перерыв</small></span>`); }
      return `<div class="week-day today"><header><b>${d.toLocaleDateString(loc(), {weekday:"long", day:"numeric", month:"long"})}</b></header><div class="week-slots">${blocks.length ? blocks.join("") : '<em>На сегодня свободных интервалов не осталось</em>'}</div></div>`;
    })();
  }

  function renderBookingStep() {
    const panel = $("#bookPanels");
    if (!panel) return;
    $$(".step-dot").forEach((d) => {
      const n = +d.dataset.step;
      d.classList.toggle("on", n === B.step);
      d.classList.toggle("done", n < B.step);
    });
    $("#bookNext").style.display = B.step === 5 ? "none" : "";
    $("#bookBack").style.display = B.step === 1 ? "none" : "";
    $("#bookStepTitle").textContent = t("book.s" + B.step);
    $("#bookStepNo").textContent = String(B.step).padStart(2, "0");

    if (B.step === 1) {
      panel.innerHTML = `<p class="booking-hint">Маникюр, педикюр и Access Bars занимают 2 часа. Для депиляции показывается её точная длительность.</p><div class="selected-total"><b>${B.services.length ? `Выбрано: ${B.services.length} · ${fmtDur(serviceById(B.services[0]).dur)}` : "Пока ничего не выбрано"}</b><span>${nf(totalPrice())} сум</span></div><div class="chips anim">${CATS.map((c) => `
        <div class="chip-group"><h4>${t("cat." + c.id)}</h4><div class="chip-row">
        ${SERVICES.filter((s) => s.cat === c.id).map((s) => `
          <button class="chip ${B.services.includes(s.id) ? "on" : ""}" data-pick-service="${s.id}">
            <b>${s.name[lang]}</b><span>${fmtPrice(s.price)}</span>
          </button>`).join("")}
        </div></div>`).join("")}</div>`;
    }
    if (B.step === 2) {
      const svc = serviceById(B.services[0]);
      panel.innerHTML = `
        <div class="date-grid anim">${dates().map((d) => {
          // Keep the Tashkent calendar date; toISOString() would shift it in another timezone.
          // Friday is reserved for Access Bars; other services are available on the remaining days.
          const iso = isoDate(d), fri = d.getDay() === 5, dis = svc && (svc.friday ? !fri : fri);
          const wd = d.toLocaleDateString(loc(), { weekday: "short" });
          const mo = d.toLocaleDateString(loc(), { month: "short" });
          return `<button ${dis ? "disabled" : ""} class="chip date ${B.date === iso ? "on" : ""} ${dis ? "dis" : ""}" data-pick-date="${iso}">
            <span class="wd">${wd}</span><b>${d.getDate()}</b><span class="mo">${mo}</span>
          </button>`;
        }).join("")}</div>`;
    }
    if (B.step === 3) {
      const d = B.date ? new Date(B.date + "T12:00:00") : null;
      panel.innerHTML = d ? `<div class="time-grid anim">${slotsFor(d).map((s) =>
        `<button class="chip time ${B.time === timeLabel(s) ? "on" : ""}" data-pick-time="${timeLabel(s)}">${timeLabel(s)}–${timeLabel(s + totalMinutes())}</button>`).join("") || '<p class="empty">На эту дату свободного времени нет.</p>'}</div>`
        : `<p class="empty">${t("book.errDate")}</p>`;
    }
    if (B.step === 4) {
      panel.innerHTML = `<div class="form anim">
        <label><span>${t("book.name")} *</span><input id="bName" value="${esc(B.name)}" placeholder="${t("book.name")}"></label>
        <label><span>${t("book.contact")} *</span><input id="bContact" name="contact" type="tel" inputmode="tel" autocomplete="tel" required value="${esc(B.contact)}" placeholder="+998 90 123 45 67 или @username"></label>
        <label><span>${t("book.comment")}</span><textarea id="bComment" rows="3" placeholder="${t("book.comment")}">${esc(B.comment)}</textarea></label>
      </div>`;
    }
    if (B.step === 5) {
      const svc = serviceById(B.services[0]);
      const d = new Date(B.date + "T12:00:00");
      panel.innerHTML = `<div class="summary anim">
        <h4>${t("book.summary")}</h4>
        <ul>
          <li><span>${t("serv.c.service")}</span><b>${selectedServices().map((s) => s.name[lang]).join(", ") || "—"}</b></li>
          <li><span>${t("serv.c.price")}</span><b>${nf(totalPrice())} сум · ${Math.floor(totalMinutes()/60)} ч ${totalMinutes()%60 ? totalMinutes()%60 + " мин" : ""}</b></li>
          <li><span>${t("book.lDate")}</span><b>${d.toLocaleDateString(loc(), { weekday: "long", day: "numeric", month: "long" })}</b></li>
          <li><span>${t("book.lTime")}</span><b>${B.time}</b></li>
          <li><span>${t("book.name")}</span><b>${esc(B.name)}</b></li>
          ${B.contact ? `<li><span>${t("book.contact")}</span><b>${esc(B.contact)}</b></li>` : ""}
          ${B.comment ? `<li><span>${t("book.comment")}</span><b>${esc(B.comment)}</b></li>` : ""}
          <li class="booking-number"><span>Номер записи</span><b>#${bookingNumber()}</b></li>
        </ul>
        <div class="booking-contact"><span>Можете связаться с помощью этого телефона</span><a href="tel:941215444">941215444</a></div>
      </div>`;
      sparkles($(".summary"));
    }
    observeReveals(panel);
    renderWeekSchedule();
  }

  function esc(s) { return String(s || "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }

  function icon(n) {
    if (n === "tg") return '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M9.04 15.31l-.38 5.35c.54 0 .78-.23 1.06-.5l2.55-2.44 5.28 3.87c.97.53 1.66.25 1.92-.9l3.48-16.3c.31-1.44-.51-2-1.46-1.65L1.6 10.62c-1.4.55-1.38 1.33-.24 1.68l5.2 1.62L18.6 6.3c.57-.37 1.08-.17.66.2L9.04 15.31z"/></svg>';
    if (n === "ig") return '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none"/></svg>';
    if (n === "copy") return '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>';
    return "";
  }

  function bookingMessage() {
    const svcs = selectedServices();
    const d = new Date(B.date + "T12:00:00");
    const date = d.toLocaleDateString(loc(), { weekday: "long", day: "numeric", month: "long" });
    const L = {
      ru: ["Здравствуйте! Хочу записаться в CAMILLA.", `Услуги: ${svcs.map(s => s.name.ru).join(", ")}`, `Дата: ${date}`, `Время: ${B.time}`, `Имя: ${B.name}`, `Номер записи: #${bookingNumber()}`],
      uz: ["Salom! CAMILLA ga yozilmoqchiman.", `Xizmatlar: ${svcs.map(s => s.name.uz).join(", ")}`, `Sana: ${date}`, `Vaqt: ${B.time}`, `Ism: ${B.name}`, `Booking: #${bookingNumber()}`],
      en: ["Hello! I'd like to book at CAMILLA.", `Services: ${svcs.map(s => s.name.en).join(", ")}`, `Date: ${date}`, `Time: ${B.time}`, `Name: ${B.name}`, `Booking number: #${bookingNumber()}`]
    }[lang];
    if (B.contact) L.push(lang === "ru" ? `Контакт: ${B.contact}` : lang === "uz" ? `Kontakt: ${B.contact}` : `Contact: ${B.contact}`);
    if (B.comment) L.push(lang === "ru" ? `Комментарий: ${B.comment}` : lang === "uz" ? `Izoh: ${B.comment}` : `Comment: ${B.comment}`);
    return L.join("\n");
  }

  function toast(msg) {
    const box = $(".toasts");
    const el = document.createElement("div");
    el.className = "toast";
    el.textContent = msg;
    box.appendChild(el);
    requestAnimationFrame(() => el.classList.add("on"));
    setTimeout(() => { el.classList.remove("on"); setTimeout(() => el.remove(), 400); }, 3200);
  }

  function showAuth() {
    const modal = $("#authModal");
    if (!modal) return;
    modal.classList.add("on"); modal.setAttribute("aria-hidden", "false");
  }

  async function showAdmin() {
    const modal = $("#adminModal"), list = $("#adminBookings");
    if (!modal || !list) return;
    modal.classList.add("on"); modal.setAttribute("aria-hidden", "false");
    list.innerHTML = "<p class=\"muted\">Загружаем записи…</p>";
    try {
      const { bookings } = await api("/api/admin/bookings");
      list.innerHTML = bookings.length ? bookings.map((b) => `<article class="admin-booking"><b>${esc(b.service_name)}</b><span>${esc(b.starts_at.replace("T", " "))}–${esc(b.ends_at.slice(11, 16))}</span><small>${esc(b.customer_name || "Клиент")} · ${esc(b.status)}</small><div><button class="btn btn-sm btn-primary" data-admin-status="CONFIRMED" data-booking-id="${b.id}">Подтвердить</button><button class="btn btn-sm btn-ghost" data-admin-status="CANCELLED" data-booking-id="${b.id}">Отменить</button></div></article>`).join("") : "<p class=\"muted\">Записей пока нет.</p>";
    } catch (err) { list.innerHTML = `<p class="auth-error">${esc(err.message)}</p>`; }
  }

  function authEvents() {
    const modal = $("#authModal"), form = $("#authForm"), card = $(".auth-card", modal);
    if (!modal) return;
    $("#accountBtn")?.addEventListener("click", () => {
      if (currentUser?.role === "ADMIN") return showAdmin();
      if (currentUser) return toast(`${currentUser.name} · аккаунт активен`);
      showAuth();
    });
    $("#authClose").addEventListener("click", () => modal.classList.remove("on"));
    $("#authSwitch").addEventListener("click", () => {
      const register = !card.classList.contains("register");
      card.classList.toggle("register", register);
      $("#authTitle").textContent = register ? "Создать аккаунт" : "Войти в аккаунт";
      $("#authSubmit").textContent = register ? "Зарегистрироваться" : "Войти";
      $("#authSwitch").textContent = register ? "У меня уже есть аккаунт" : "Создать аккаунт";
      $("#authPassword").autocomplete = register ? "new-password" : "current-password";
    });
    form.addEventListener("submit", async (e) => {
      e.preventDefault(); $("#authError").textContent = "";
      const register = card.classList.contains("register");
      try {
        const data = await api(register ? "/api/auth/register" : "/api/auth/login", { method: "POST", body: JSON.stringify({ name: $("#authName")?.value?.trim() || "", email: $("#authEmail").value.trim(), password: $("#authPassword").value, language: lang }) });
        currentUser = data.user; modal.classList.remove("on");
        if (currentUser.role === "ADMIN") { toast("Вход выполнен: администратор"); showAdmin(); } else toast("Аккаунт готов — продолжите запись");
      } catch (err) { $("#authError").textContent = err.message; }
    });
    $("#adminClose")?.addEventListener("click", () => $("#adminModal").classList.remove("on"));
    $("#adminBookings")?.addEventListener("click", async (e) => {
      const button = e.target.closest("[data-admin-status]"); if (!button) return;
      try { await api("/api/admin/bookings/status", { method: "POST", body: JSON.stringify({ id: Number(button.dataset.bookingId), status: button.dataset.adminStatus }) }); toast("Статус записи обновлён"); showAdmin(); loadOccupiedBookings(); }
      catch (err) { toast(err.message); }
    });
  }

  /* ============ GOOGLE AUTH ============ */
  async function initGoogleAuth() {
    const host = $("#googleSignIn");
    const hint = $("#googleAuthHint");
    if (!host) return;

    let clientId = "";
    try { clientId = (await api("/api/auth/google/config")).client_id || ""; } catch (_) {}
    if (!clientId) {
      if (hint) {
        hint.hidden = false;
        hint.textContent = "Вход через Google пока не настроен владельцем сайта.";
      }
      return;
    }

    const render = () => {
      if (!window.google?.accounts?.id) return false;
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: async (response) => {
          try {
            const data = await api("/api/auth/google", {
              method: "POST",
              body: JSON.stringify({ credential: response.credential, language: lang })
            });
            currentUser = data.user;
            $("#authModal")?.classList.remove("on");
            toast(currentUser?.role === "ADMIN" ? "Вход выполнен: администратор" : "Вход через Google выполнен");
          } catch (err) {
            const error = $("#authError");
            if (error) error.textContent = err.message;
          }
        }
      });
      host.innerHTML = "";
      window.google.accounts.id.renderButton(host, {
        type: "standard", theme: "outline", size: "large",
        shape: "rectangular", width: Math.min(360, host.clientWidth || 360),
        text: "continue_with"
      });
      return true;
    };

    if (render()) return;
    let attempts = 0;
    const timer = setInterval(() => {
      if (render() || ++attempts >= 40) clearInterval(timer);
    }, 250);
  }
  function sparkles(host) {
    if (!host || RM) return;
    for (let i = 0; i < 26; i++) {
      const s = document.createElement("i");
      s.className = "spark";
      s.style.cssText = `left:${20 + Math.random() * 60}%;top:${30 + Math.random() * 40}%;--dx:${(Math.random() - 0.5) * 260}px;--dy:${-60 - Math.random() * 180}px;--dl:${Math.random() * 0.5}s;--sc:${0.5 + Math.random()}`;
      host.appendChild(s);
      setTimeout(() => s.remove(), 2200);
    }
  }

  /* ============ LIGHTBOX ============ */
  function lightbox() {
    const lb = $("#lightbox"), img = $("#lightbox img");
    document.addEventListener("click", (e) => {
      const a = e.target.closest("[data-lightbox]");
      if (a) {
        e.preventDefault();
        img.src = a.href || a.dataset.src;
        img.alt = a.dataset.alt || "";
        lb.classList.add("on");
        document.body.style.overflow = "hidden";
        return;
      }
      if (e.target.closest("#lightbox")) {
        lb.classList.remove("on");
        document.body.style.overflow = "";
      }
    });
    addEventListener("keydown", (e) => { if (e.key === "Escape") { lb.classList.remove("on"); document.body.style.overflow = ""; } });
  }

  /* ============ MARQUEES ============ */
  function renderMarquees() {
      const items = [t("footer.m"), "美", "CAMILLA", "東京", t("cat.m"), t("cat.p"), t("cat.d"), t("cat.a"), "✦"];
    const line = items.join("  •  ");
    $$(".marquee-track").forEach((tr) => { tr.innerHTML = `<span>${line}</span><span aria-hidden="true">${line}</span>`; });
    const tick = [t("cat.m"), t("cat.p"), t("cat.d"), t("cat.a")].join("  •  ");
    const tk = $(".ticker-track");
    if (tk) tk.innerHTML = `<span>${tick}  •  </span><span aria-hidden="true">${tick}  •  </span>`;
  }

  /* ============ STATIC GRID / REEL RENDER ============ */
  function renderMedia() {
    const grid = $("#igGrid");
    if (grid) grid.innerHTML = GRID_IMGS.map(([f, alt], i) => `
      <a class="ig-item" data-lightbox href="images/${f}.jpg" data-alt="${alt}" data-reveal style="--d:${i * 50}ms" aria-label="${alt}">
        <img src="images/${f}.jpg" alt="${alt}" loading="lazy">
        <span class="ig-over">${icon("ig")}</span>
      </a>`).join("");
    const reel = $("#reelTrack");
    if (reel) reel.innerHTML = REEL_IMGS.map((f, i) => `
      <figure class="reel-card" data-i="${i}">
        <img src="images/${f}.jpg" alt="CAMILLA reel frame ${i + 1}" loading="lazy" class="kb">
        <figcaption><span>${String(i + 1).padStart(2, "0")}</span> CAMILLA REEL</figcaption>
      </figure>`).join("");
  }

  /* ============ EVENTS ============ */
  function events() {
    /* language */
    $$(".lang-btn").forEach((b) => b.addEventListener("click", () => setLang(b.dataset.lang)));

    /* tabs */
    $("#catTabs").addEventListener("click", (e) => {
      const b = e.target.closest(".tab");
      if (!b) return;
      catFilter = b.dataset.cat;
      $$(".tab").forEach((x) => x.classList.toggle("on", x === b));
      renderCatalog();
    });
    /* search */
    const si = $("#servSearch");
    si.addEventListener("input", () => { searchQ = si.value.trim().toLowerCase(); renderCatalog(); });

    /* booking interactions (delegated) */
    document.addEventListener("click", (e) => {
      const busySlot = e.target.closest("[data-week-busy]");
      if (busySlot) { toast("Это время уже занято. Выберите другой свободный интервал."); return; }
      const weekSlot = e.target.closest("[data-week-time]");
      if (weekSlot) { B.date = weekSlot.dataset.weekDate; B.time = weekSlot.dataset.weekTime; B.step = 4; renderBookingStep(); return; }
      if (e.target.closest("#weekPrev")) { weekOffset--; renderWeekSchedule(); return; }
      if (e.target.closest("#weekNext")) { weekOffset++; renderWeekSchedule(); return; }
      if (e.target.closest("#weekToday")) { weekOffset=0; renderWeekSchedule(); return; }
      const pickS = e.target.closest("[data-pick-service]");
      if (pickS) { const id = pickS.dataset.pickService; B.services = B.services[0] === id ? [] : [id]; B.date = null; B.time = null; toast(serviceById(id).friday ? "Access Bars принимается только по пятницам" : "По пятницам принимается только Access Bars"); renderBookingStep(); return; }
      const pickD = e.target.closest("[data-pick-date]");
      if (pickD && !pickD.disabled) { B.date = pickD.dataset.pickDate; B.time = null; renderBookingStep(); return; }
      const pickT = e.target.closest("[data-pick-time]");
      if (pickT) { B.time = pickT.dataset.pickTime; renderBookingStep(); return; }

      const rowBook = e.target.closest(".row-book");
      if (rowBook) {
        B.services = [rowBook.dataset.service]; B.step = 2; B.date = null; B.time = null;
        document.getElementById("booking").scrollIntoView({ behavior: RM ? "auto" : "smooth" });
        renderBookingStep();
        toast(serviceById(B.services[0]).name[lang] + " ✓");
        return;
      }

      if (e.target.closest("#bookNext")) {
        if (B.step === 1 && !B.services.length) return shake("#bookPanels", t("book.errService"));
        if (B.step === 2 && !B.date) return shake("#bookPanels", t("book.errDate"));
        if (B.step === 3 && !B.time) return shake("#bookPanels", t("book.errTime"));
        if (B.step === 4) {
          B.name = $("#bName").value.trim(); B.contact = $("#bContact").value.trim(); B.comment = $("#bComment").value.trim();
          if (!B.name) return shake("#bookPanels", t("book.errName"));
          if (!validContact(B.contact)) return shake("#bookPanels", t("book.errContact"));
        }
        B.step = Math.min(5, B.step + 1);
        renderBookingStep();
        return;
      }
      if (e.target.closest("#bookBack")) { B.step = Math.max(1, B.step - 1); renderBookingStep(); return; }
      if (e.target.closest("#restart")) { Object.assign(B, { step: 1, services: [], date: null, time: null, name: "", contact: "", comment: "" }); renderBookingStep(); return; }
      if (e.target.closest("#copyMsg")) {
        navigator.clipboard.writeText(bookingMessage()).then(() => toast(t("book.copied")));
        return;
      }
      if (e.target.closest("#sendTg")) {
        if (!currentUser) return showAuth();
        const startMinutes = Number(B.time.slice(0, 2)) * 60 + Number(B.time.slice(3, 5));
        const endTime = timeLabel(startMinutes + totalMinutes());
        localStorage.setItem("camilla_last_booking", JSON.stringify({ date: B.date, time: B.time, services: B.services, name: B.name, number: bookingNumber(), contact: B.contact }));
        api("/api/bookings", { method: "POST", body: JSON.stringify({ specialist_id: 1, service_id: B.services[0], starts_at: `${B.date}T${B.time}`, ends_at: `${B.date}T${endTime}`, contact: B.contact, notes: B.comment }) })
          .then(() => { navigator.clipboard.writeText(bookingMessage()).catch(() => {}); loadOccupiedBookings(); toast("Запись сохранена"); window.open(CONFIG.telegramURL, "_blank", "noopener"); })
          .catch((err) => toast(err.message));
        return;
      }
      if (e.target.closest("#sendIg")) { navigator.clipboard.writeText(bookingMessage()).catch(() => {}); toast(t("book.copied")); return; }

      /* burger */
      if (e.target.closest("#burger")) {
        document.body.classList.toggle("menu-open");
        return;
      }
      $$(".mobile-menu a").forEach((a) => a.addEventListener("click", () => document.body.classList.remove("menu-open"), { once: true }));

      /* totop */
      if (e.target.closest("#totop")) { scrollTo({ top: 0, behavior: RM ? "auto" : "smooth" }); return; }
    });

    /* smooth anchors */
    document.addEventListener("click", (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const target = $(a.getAttribute("href"));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: RM ? "auto" : "smooth" }); }
    });
  }

  function shake(sel, msg) {
    const el = $(sel);
    el.classList.remove("shake");
    void el.offsetWidth;
    el.classList.add("shake");
    toast(msg);
  }

  /* ============ SITE LOADER ============ */
  function siteLoader() {
    const loader = $("#siteLoader");
    if (!loader) return;

    const finish = () => {
      loader.classList.add("is-hidden");
      document.body.classList.remove("site-is-loading");
      document.body.style.overflow = "";
    };

    document.body.classList.add("site-is-loading");
    document.body.style.overflow = "hidden";

    const minTime = new Promise((resolve) => setTimeout(resolve, 4350));
    const pageReady = document.readyState === "complete"
      ? Promise.resolve()
      : new Promise((resolve) => window.addEventListener("load", resolve, { once: true }));

    Promise.all([minTime, pageReady]).then(() => {
      requestAnimationFrame(() => requestAnimationFrame(finish));
    });

    // Never leave the site locked if an external animation/CDN is slow.
    setTimeout(finish, 6500);
  }

  /* ============ INIT ============ */
  function init() {
    siteLoader();
    renderMedia();
    splitHero();
    applyI18n();
    observeReveals(document);
    counters();
    cursor();
    brushCursor();
    ripple();
    magnetic();
    tilt();
    scrollFx();
    reel();
    lightbox();
    authEvents();
    initGoogleAuth();
    events();
    loadUser();
    loadOccupiedBookings();
    setInterval(() => { renderStatus(); renderWeekSchedule(); }, 1000);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
