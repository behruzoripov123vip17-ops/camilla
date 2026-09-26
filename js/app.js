/* CAMILLA Beauty Studio — app: data, i18n engine, animations, booking */
(function () {
  "use strict";

  /* ============ CONFIG ============ */
  const CONFIG = {
    instagram: "shakhlo_nails",                 // Instagram handle
    telegram: "shahloNailSTUDIO",               // Telegram username
    instagramURL: "https://www.instagram.com/shakhlo_nails",
    telegramURL: "https://t.me/shahloNailSTUDIO",
    tz: "Asia/Tashkent",
    apiBase: (document.querySelector('meta[name="camilla-api"]')?.content || window.CAMILLA_API_BASE || "").replace(/\/$/, "")
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
    // Disabled: the brush is the only custom cursor.
  }

  /* ============ BRUSH CURSOR ============ */
  function brushCursor() {
    if (RM || !window.matchMedia("(pointer:fine)").matches) return;
    const brush = $("#brushCursor");
    if (!brush) return;
    let lastSparkle = 0;
    const sparkle = (x,y) => {
      const now=performance.now();
      if(now-lastSparkle<110) return;
      lastSparkle=now;
      const p=document.createElement("span");
      p.className="brush-particle";
      const size=4+Math.random()*6;
      p.style.width=size+"px"; p.style.height=size+"px";
      p.style.left=(x-2)+"px"; p.style.top=(y-2)+"px";
      p.style.setProperty("--dx",((Math.random()-.5)*28)+"px");
      p.style.setProperty("--dy",((Math.random()-.5)*28+14)+"px");
      document.body.appendChild(p); setTimeout(()=>p.remove(),520);
    };
    document.addEventListener("mousemove",e=>{
      brush.style.opacity="1";
      brush.style.transform="translate("+(e.clientX-6)+"px,"+(e.clientY-6)+"px)";
      sparkle(e.clientX,e.clientY);
    },{passive:true});
    document.addEventListener("mouseleave",()=>brush.style.opacity="0");
    document.addEventListener("mouseenter",()=>brush.style.opacity="1");
    document.addEventListener("mouseover",e=>{
      const hit=e.target.closest("a,button,input,select,textarea,.chip,.tab,.tr,[data-tilt],.ig-item,.row-book");
      brush.classList.toggle("hovering",!!hit);
    });
    document.addEventListener("mousedown",()=>brush.classList.add("clicking"));
    document.addEventListener("mouseup",()=>brush.classList.remove("clicking"));
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
    const parallaxEls = $$("[data-parallax]");
    const spySections = ["specialist", "services", "reels", "booking", "info", "instagram", "contacts"]
      .map((id) => document.getElementById(id)).filter(Boolean);
    if (!header || !bar || !totop) return;

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
      if (barMobile) barMobile.classList.toggle("show", y > 700 && !inBook);

      // Only animate the hero parallax while it is actually near the viewport.
      if (!RM && y < innerHeight * 1.2) {
        parallaxEls.forEach((el) => {
          const factor = Number(el.dataset.parallax);
          if (Number.isFinite(factor)) el.style.transform = `translate3d(0,${y * factor}px,0)`;
        });
      }

      let cur = "";
      for (const el of spySections) {
        if (el.getBoundingClientRect().top <= innerHeight * 0.42) cur = el.id;
      }
      $$(".nav a, .mobile-menu nav a").forEach((a) =>
        a.classList.toggle("active", a.getAttribute("href") === "#" + cur)
      );
      lastY = y;
      ticking = false;
    };
    addEventListener("scroll", () => {
      if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
    }, { passive: true });
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
    const base = CONFIG.apiBase || "";
    const url = base ? base + path : path;
    const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
    const res = await fetch(url, { credentials: "include", ...options, headers });
    const text = await res.text();
    let data = {};
    try { data = text ? JSON.parse(text) : {}; } catch (_) {
      throw new Error(res.ok ? "Сервер вернул некорректный ответ" : "Сервер недоступен");
    }
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

    const nextBtn = $("#bookNext"), backBtn = $("#bookBack");
    if (!nextBtn || !backBtn) return;
    nextBtn.style.display = B.step === 5 ? "none" : "";
    backBtn.style.display = B.step === 1 ? "none" : "";
    $("#bookStepTitle").textContent = t("book.s" + B.step);
    $("#bookStepNo").textContent = String(B.step).padStart(2, "0");

    if (B.step === 1) {
      panel.innerHTML = `
        <div class="booking-stage-head">
          <div><span class="stage-kicker">01 / SERVICE</span><h4>Выберите одну услугу</h4><p>Выберите процедуру — цена и длительность появятся сразу.</p></div>
          <div class="booking-total"><span>Стоимость</span><b>${B.services.length ? nf(totalPrice()) + " сум" : "—"}</b></div>
        </div>
        <div class="booking-service-grid">
          ${SERVICES.map((s) => `
            <button type="button" class="booking-service-card ${B.services.includes(s.id) ? "is-selected" : ""}" data-pick-service="${s.id}">
              <span class="booking-service-index">${s.id.toUpperCase()}</span>
              ${s.img ? `<img src="images/${s.img}.jpg" alt="" loading="lazy">` : `<span class="booking-service-art">${s.cat === "d" ? "01" : s.cat === "p" ? "02" : "03"}</span>`}
              <span class="booking-service-body"><small>${t("cat." + s.cat)}${s.friday ? " · FRIDAY" : ""}</small><strong>${s.name[lang]}</strong><em>${fmtDur(s.dur)} · ${fmtPrice(s.price)}</em></span>
              <span class="booking-check">${B.services.includes(s.id) ? "✓" : "+"}</span>
            </button>`).join("")}
        </div>`;
    }

    if (B.step === 2) {
      const svc = serviceById(B.services[0]);
      panel.innerHTML = `
        <div class="booking-stage-head">
          <div><span class="stage-kicker">02 / DATE</span><h4>Выберите дату</h4><p>Показываются только даты, доступные для выбранной услуги.</p></div>
          <div class="booking-selected-pill">${svc ? esc(svc.name[lang]) : "Услуга не выбрана"}</div>
        </div>
        <div class="booking-date-grid">
          ${dates().map((d) => {
            const iso = isoDate(d), fri = d.getDay() === 5, dis = svc && (svc.friday ? !fri : fri);
            const wd = d.toLocaleDateString(loc(), { weekday: "short" });
            const mo = d.toLocaleDateString(loc(), { month: "short" });
            return `<button type="button" ${dis ? "disabled" : ""} class="booking-date-card ${B.date === iso ? "is-selected" : ""} ${dis ? "is-disabled" : ""}" data-pick-date="${iso}">
              <span>${wd}</span><b>${d.getDate()}</b><small>${mo}</small>
            </button>`;
          }).join("")}
        </div>`;
    }

    if (B.step === 3) {
      const d = B.date ? new Date(B.date + "T12:00:00") : null;
      const slots = d ? slotsFor(d) : [];
      panel.innerHTML = `
        <div class="booking-stage-head">
          <div><span class="stage-kicker">03 / TIME</span><h4>Выберите свободное время</h4><p>Занятые интервалы автоматически скрываются.</p></div>
          <div class="booking-selected-pill">${B.date || "Дата не выбрана"}</div>
        </div>
        <div class="booking-time-grid">
          ${slots.length ? slots.map((s) => `<button type="button" class="booking-time-card ${B.time === timeLabel(s) ? "is-selected" : ""}" data-pick-time="${timeLabel(s)}"><b>${timeLabel(s)}</b><span>${timeLabel(s + totalMinutes())}</span><small>Свободно</small></button>`).join("") : '<div class="booking-empty">На эту дату нет подходящего свободного времени.</div>'}
        </div>
        <div class="booking-hours-note"><span>09:00–18:00</span><i></i><span>перерыв 12:00–13:00</span></div>`;
    }

    if (B.step === 4) {
      panel.innerHTML = `
        <div class="booking-stage-head">
          <div><span class="stage-kicker">04 / CONTACT</span><h4>Ваши контакты</h4><p>Оставьте настоящие контактные данные для подтверждения записи.</p></div>
          <div class="form-step-mark">04</div>
        </div>
        <div class="booking-contact-form">
          <div class="booking-form-grid">
            <label class="field-card"><span>Имя и фамилия *</span><input id="bName" autocomplete="name" value="${esc(B.name)}" placeholder="Например, Алиса Каримова"></label>
            <label class="field-card"><span>Телефон или Telegram *</span><input id="bContact" name="contact" type="tel" inputmode="tel" autocomplete="tel" required value="${esc(B.contact)}" placeholder="+998 90 123 45 67 или @username"></label>
          </div>
          <label class="field-card field-wide"><span>Комментарий</span><textarea id="bComment" rows="4" placeholder="Дополнительные пожелания (необязательно)">${esc(B.comment)}</textarea></label>
          <div class="booking-privacy"><span class="privacy-dot"></span><span>Данные используются только для подтверждения записи.</span></div>
        </div>`;
    }

    if (B.step === 5) {
      const d = new Date(B.date + "T12:00:00");
      panel.innerHTML = `
        <div class="booking-final">
          <div class="booking-final-mark">✓</div>
          <span class="stage-kicker">05 / CONFIRM</span>
          <h4>Проверьте запись</h4>
          <p class="booking-final-sub">Всё готово. Перед отправкой проверьте дату, время и контакт.</p>
          <div class="booking-summary-grid">
            <div><span>Услуга</span><b>${esc(selectedServices().map((s) => s.name[lang]).join(", ") || "—")}</b></div>
            <div><span>Дата</span><b>${d.toLocaleDateString(loc(), { weekday: "long", day: "numeric", month: "long" })}</b></div>
            <div><span>Время</span><b>${esc(B.time || "—")}</b></div>
            <div><span>Стоимость</span><b>${nf(totalPrice())} сум</b></div>
            <div><span>Клиент</span><b>${esc(B.name)}</b></div>
            <div><span>Контакт</span><b>${esc(B.contact)}</b></div>
          </div>
          <div class="booking-final-actions">
            <button class="btn btn-primary" id="sendTg" type="button">Подтвердить и сохранить</button>
            <button class="btn btn-ghost" id="copyMsg" type="button">Скопировать детали</button>
          </div>
          <p class="booking-final-note">После сохранения запись появится в вашем аккаунте.</p>
        </div>`;
        sparkles($(".booking-final"));
    }

    observeReveals(panel);
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
      if (currentUser) {
        const profile = $("#profileModal");
        if (profile) { profile.classList.add("on"); profile.setAttribute("aria-hidden", "false"); loadProfile(); }
        return;
      }
      showAuth();
    });
    $("#authClose")?.addEventListener("click", () => { modal.classList.remove("on"); modal.setAttribute("aria-hidden", "true"); });
    $("#authSwitch").addEventListener("click", () => {
      const register = !card.classList.contains("register");
      card.classList.toggle("register", register);
      $("#authTitle").textContent = register ? "Создать аккаунт" : "Войти в аккаунт";
      $("#authSubmit").textContent = register ? "Зарегистрироваться" : "Войти";
      $("#authSwitch").textContent = register ? "У меня уже есть аккаунт" : "Создать аккаунт";
      $("#authPassword").autocomplete = register ? "new-password" : "current-password";
      $("#authPhone")?.closest("label")?.classList.toggle("auth-field-hidden", !register);
      $("#authPasswordConfirm")?.closest("label")?.classList.toggle("auth-field-hidden", !register);
      $("#authConsent")?.closest("label")?.classList.toggle("auth-field-hidden", !register);
    });
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      $("#authError").textContent = "";
      const register = card.classList.contains("register");
      const email = $("#authEmail").value.trim();
      const password = $("#authPassword").value;
      const name = $("#authName")?.value?.trim() || "";
      const phone = $("#authPhone")?.value?.trim() || "";
      const confirm = $("#authPasswordConfirm")?.value || "";
      const consent = $("#authConsent")?.checked !== false;
      if (register) {
        if (!/^[A-Za-zА-Яа-яЁёЎўҚқҒғҲҳІіЇї\s'-]{2,60}$/.test(name)) return ($("#authError").textContent = "Введите настоящее имя и фамилию.");
        if (!/^\+?[0-9\s()\-]{9,20}$/.test(phone)) return ($("#authError").textContent = "Введите корректный номер телефона.");
        if (!/^\S+@\S+\.\S+$/.test(email)) return ($("#authError").textContent = "Введите корректный email.");
        if (password.length < 10 || !/[A-Za-zА-Яа-я]/.test(password) || !/[0-9]/.test(password)) return ($("#authError").textContent = "Пароль: минимум 10 символов, буквы и цифры.");
        if (password !== confirm) return ($("#authError").textContent = "Пароли не совпадают.");
        if (!consent) return ($("#authError").textContent = "Подтвердите согласие с условиями.");
      } else if (!email || !password) {
        return ($("#authError").textContent = "Введите email и пароль.");
      }
      try {
        const payload = register
          ? { name, phone, email, password, language: lang }
          : { email, password, language: lang };
        const data = await api(register ? "/api/auth/register" : "/api/auth/login", { method: "POST", body: JSON.stringify(payload) });
        currentUser = data.user;
        modal.classList.remove("on");
        modal.setAttribute("aria-hidden", "true");
        if (currentUser.role === "ADMIN") { toast("Вход выполнен: администратор"); showAdmin(); }
        else toast(register ? "Аккаунт создан — продолжите запись" : "Вход выполнен");
      } catch (err) { $("#authError").textContent = err.message; }
    });
    $("#adminClose")?.addEventListener("click", () => $("#adminModal").classList.remove("on"));
    $("#profileClose")?.addEventListener("click", () => $("#profileModal")?.classList.remove("on"));
    $("#profileLogout")?.addEventListener("click", async () => {
      try { await api("/api/auth/logout", { method: "POST", body: "{}" }); } catch (_) {}
      currentUser = null;
      $("#profileModal")?.classList.remove("on");
      toast("Вы вышли из аккаунта");
    });
    $("#adminBookings")?.addEventListener("click", async (e) => {
      const button = e.target.closest("[data-admin-status]"); if (!button) return;
      try { await api("/api/admin/bookings/status", { method: "POST", body: JSON.stringify({ id: Number(button.dataset.bookingId), status: button.dataset.adminStatus }) }); toast("Статус записи обновлён"); showAdmin(); loadOccupiedBookings(); }
      catch (err) { toast(err.message); }
    });
  }

  async function loadProfile() {
    const list = $("#profileBookings");
    if (!list) return;
    list.innerHTML = "<p class=\"muted\">Загружаем ваши записи…</p>";
    try {
      const { bookings } = await api("/api/bookings");
      list.innerHTML = bookings.length ? bookings.map((b) => `<article class="admin-booking"><b>${esc(b.service_name)}</b><span>${esc(b.starts_at.replace("T", " "))}–${esc(b.ends_at.slice(11, 16))}</span><small>${esc(b.status)} · ${esc(b.contact || "")}</small></article>`).join("") : "<p class=\"muted\">Записей пока нет.</p>";
    } catch (err) { list.innerHTML = `<p class="auth-error">${esc(err.message)}</p>`; }
  }

  function music() {
    const audio = $("#siteMusic"), toggle = $("#musicToggle");
    if (!audio || !toggle) return;

    let mutedByUser = localStorage.getItem("camilla_music_off") === "1";
    let pageReady = false;

    const setState = (on) => {
      toggle.classList.toggle("playing", on);
      toggle.classList.toggle("muted", !on);
      toggle.setAttribute("aria-pressed", String(on));
      toggle.setAttribute("aria-label", on ? "Выключить музыку" : "Включить музыку");
    };

    audio.volume = 0.34;

    const play = () => {
      // Never start audio while the loading animation is still visible.
      if (!pageReady || mutedByUser) return Promise.resolve(false);
      return audio.play()
        .then(() => { setState(true); return true; })
        .catch(() => { setState(false); return false; });
    };

    toggle.addEventListener("click", () => {
      if (!pageReady) return;
      if (audio.paused) {
        mutedByUser = false;
        localStorage.removeItem("camilla_music_off");
        play();
      } else {
        mutedByUser = true;
        localStorage.setItem("camilla_music_off", "1");
        audio.pause();
        setState(false);
      }
    });

    // Loading animation has finished: now, and only now, music may start.
    window.addEventListener("camilla:ready", () => {
      pageReady = true;
      if (!mutedByUser) setTimeout(play, 180);
    }, { once: true });

    // Autoplay fallback is also locked until the loading animation is finished.
    const unlock = () => {
      if (pageReady && audio.paused && !mutedByUser) play();
    };
    ["pointerdown", "keydown", "touchstart"].forEach((event) => {
      document.addEventListener(event, unlock, { once: true, passive: true });
    });

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) audio.pause();
      else if (pageReady && !mutedByUser) play();
    });

    addEventListener("pagehide", () => {
      audio.pause();
      audio.currentTime = 0;
    }, { once: true });

    setState(false);
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
    if (!lb || !img) return;
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
    $("#catTabs")?.addEventListener("click", (e) => {
      const b = e.target.closest(".tab");
      if (!b) return;
      catFilter = b.dataset.cat;
      $$(".tab").forEach((x) => x.classList.toggle("on", x === b));
      renderCatalog();
    });
    /* search */
    const si = $("#servSearch");
    si?.addEventListener("input", () => { searchQ = si.value.trim().toLowerCase(); renderCatalog(); });

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
      if (pickS) {
        const id = pickS.dataset.pickService;
        const wasSelected = B.services[0] === id;
        B.services = wasSelected ? [] : [id];
        B.date = null; B.time = null;
        if (!wasSelected) {
          const service = serviceById(id);
          toast(service?.friday ? "Access Bars доступен по пятницам" : "Услуга выбрана ✓");
        }
        renderBookingStep();
        return;
      }
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
        if (B.step === 3 && B.date && B.time) { const mins = Number(B.time.slice(0,2))*60 + Number(B.time.slice(3,5)); if (!slotsFor(new Date(B.date + "T12:00:00")).includes(mins)) return shake("#bookPanels", "Это время уже недоступно. Выберите другой интервал."); }
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
        const msg = bookingMessage();
        if (navigator.clipboard?.writeText) {
          navigator.clipboard.writeText(msg).then(() => toast(t("book.copied"))).catch(() => toast(msg));
        } else toast(msg);
        return;
      }
      if (e.target.closest("#sendTg")) {
        if (!currentUser) return showAuth();
        if (!B.services.length || !B.date || !B.time || !B.name || !validContact(B.contact)) {
          return shake("#bookPanels", "Проверьте данные записи");
        }
        const startMinutes = Number(B.time.slice(0, 2)) * 60 + Number(B.time.slice(3, 5));
        const endTime = timeLabel(startMinutes + totalMinutes());
        const button = e.target.closest("#sendTg");
        button.disabled = true;
        button.textContent = "Сохраняем…";
        api("/api/bookings", { method: "POST", body: JSON.stringify({
          specialist_id: 1, service_id: B.services[0],
          starts_at: `${B.date}T${B.time}`, ends_at: `${B.date}T${endTime}`,
          contact: B.contact, notes: B.comment
        })})
          .then(() => {
            localStorage.setItem("camilla_last_booking", JSON.stringify({date:B.date,time:B.time,services:B.services,name:B.name,number:bookingNumber(),contact:B.contact}));
            if (navigator.clipboard?.writeText) navigator.clipboard.writeText(bookingMessage()).catch(() => {});
            loadOccupiedBookings();
            toast("Запись сохранена");
            window.open(CONFIG.telegramURL, "_blank", "noopener");
          })
          .catch((err) => { button.disabled = false; button.textContent = "Подтвердить и сохранить"; toast(err.message); });
        return;
      }


      /* burger */
      if (e.target.closest("#burger")) {
        document.body.classList.toggle("menu-open");
        return;
      }
      if (e.target.closest(".mobile-menu a")) document.body.classList.remove("menu-open");

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

    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      loader.classList.add("is-hidden");
      document.body.classList.remove("site-is-loading");
      document.body.style.overflow = "";
      window.dispatchEvent(new CustomEvent("camilla:ready"));
    };

    document.body.classList.add("site-is-loading");
    document.body.style.overflow = "hidden";

    const minTime = new Promise((resolve) => setTimeout(resolve, 1900));
    const pageReady = document.readyState === "complete"
      ? Promise.resolve()
      : new Promise((resolve) => window.addEventListener("load", resolve, { once: true }));

    Promise.all([minTime, pageReady]).then(() => {
      requestAnimationFrame(() => requestAnimationFrame(finish));
    });

    setTimeout(finish, 4800);
  }

  /* ============ HERO MOUSE DEPTH ============ */
  function heroMotion() {
    if (RM || !window.matchMedia("(pointer:fine)").matches) return;
    const hero = $(".hero");
    const cards = $$(".hero-card");
    if (!hero || !cards.length) return;

    let raf = 0, tx = 0, ty = 0, cx = 0, cy = 0;
    const render = () => {
      cx += (tx - cx) * 0.075;
      cy += (ty - cy) * 0.075;
      cards.forEach((card, index) => {
        const depth = index === 0 ? 1 : index === 1 ? 1.55 : 1.9;
        card.style.setProperty("--mx", cx * depth + "px");
        card.style.setProperty("--my", cy * depth + "px");
      });
      raf = requestAnimationFrame(render);
    };
    hero.addEventListener("pointermove", (e) => {
      const r = hero.getBoundingClientRect();
      tx = ((e.clientX - (r.left + r.width / 2)) / r.width) * 14;
      ty = ((e.clientY - (r.top + r.height / 2)) / r.height) * 10;
    }, { passive:true });
    hero.addEventListener("pointerleave", () => { tx = 0; ty = 0; }, { passive:true });
    raf = requestAnimationFrame(render);
    const stop = () => { if (raf) cancelAnimationFrame(raf); raf = 0; };
    addEventListener("pagehide", stop, { once:true });
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stop();
      else if (!raf) raf = requestAnimationFrame(render);
    });
  }

  /* ============ INIT ============ */
  function init() {
    siteLoader();
    renderMedia();
    splitHero();
    heroMotion();
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
    music();
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


/* ===== SITE 2 — MICRO INTERACTIONS v3 / PERFORMANCE SYNC ===== */
(()=>{
  const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
  if(reduce) return;

  // Keep a single lightweight scroll progress indicator. The main progress bar
  // remains untouched, so the visual language and existing CSS are preserved.
  let bar=document.querySelector(".site2-progress");
  if(!bar){
    bar=document.createElement("div");
    bar.className="site2-progress";
    document.body.appendChild(bar);
  }
  let raf=0;
  const update=()=>{
    raf=0;
    const max=document.documentElement.scrollHeight-innerHeight;
    bar.style.transform="scaleX("+(max>0?scrollY/max:0)+")";
  };
  addEventListener("scroll",()=>{if(!raf) raf=requestAnimationFrame(update)},{passive:true});
  addEventListener("resize",update,{passive:true});
  update();
})();
;
