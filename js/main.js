/* ==========================================================================
   Kado Digital LLC — main.js
   Vanilla JS, no dependencies. Every feature is progressive enhancement:
   pages are fully readable and navigable without it.
   ========================================================================== */
(function () {
  "use strict";

  var EMAIL = "kadodigitalllc@outlook.com";
  var root = document.documentElement;
  var reduceMQ = window.matchMedia("(prefers-reduced-motion: reduce)");
  var wideMQ = window.matchMedia("(min-width: 900px) and (min-height: 560px)");

  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }
  function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }
  function onChange(mq, fn) { mq.addEventListener ? mq.addEventListener("change", fn) : mq.addListener(fn); }

  /* ---------- Logo: use the exact supplied file; neutral fallback if absent ---------- */
  $$("[data-logo]").forEach(function (wrap) {
    var img = $("img", wrap);
    if (!img) return;
    function missing() { wrap.classList.add("is-missing"); }
    if (img.complete && img.naturalWidth === 0) missing();
    img.addEventListener("error", missing);
  });

  /* ---------- Header state ---------- */
  var header = $("[data-header]");
  function headerState() { if (header) header.classList.toggle("is-scrolled", window.scrollY > 24); }

  /* ---------- Mobile navigation ---------- */
  var toggle = $("[data-nav-toggle]");
  var nav = $("[data-nav]");
  function setNav(open, returnFocus) {
    if (!toggle || !nav) return;
    toggle.setAttribute("aria-expanded", String(open));
    toggle.querySelector(".nav-toggle__label").textContent = open ? "Close" : "Menu";
    nav.classList.toggle("is-open", open);
    header.classList.toggle("is-open", open);
    document.body.classList.toggle("nav-locked", open);
    if (open) { var first = $("a", nav); if (first) first.focus(); }
    else if (returnFocus) toggle.focus();
  }
  if (toggle && nav) {
    toggle.addEventListener("click", function () { setNav(toggle.getAttribute("aria-expanded") !== "true"); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) setNav(false, true);
    });
    /* keep Tab inside the open menu (button + links) */
    document.addEventListener("keydown", function (e) {
      if (e.key !== "Tab" || !nav.classList.contains("is-open")) return;
      var items = [toggle].concat($$("a", nav));
      var first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
    $$("a", nav).forEach(function (a) { a.addEventListener("click", function () { setNav(false); }); });
    onChange(window.matchMedia("(min-width: 1041px)"), function (e) { if (e.matches) setNav(false); });
  }

  /* ---------- Cinematic scroll scenes (home) ---------- */
  var hero = $("[data-hero]");
  var heroStage = $("[data-hero-stage]");
  var scenes = $("[data-scenes]");
  var sceneEls = $$("[data-scene]");
  var railItems = $$("[data-rail] li");
  var cinematic = false;
  var ticking = false;

  function setCinematic() {
    var want = !!(hero || scenes) && wideMQ.matches && !reduceMQ.matches;
    cinematic = want;
    root.classList.toggle("js-cinematic", want);
    update();
  }

  function progress(el) {
    var r = el.getBoundingClientRect();
    var total = el.offsetHeight - window.innerHeight;
    return total > 0 ? clamp(-r.top / total, 0, 1) : 0;
  }

  function update() {
    ticking = false;
    headerState();
    if (!cinematic) return;
    if (heroStage) heroStage.style.setProperty("--p", progress(hero).toFixed(4));
    if (scenes && sceneEls.length) {
      var n = sceneEls.length;
      var p = progress(scenes);
      var pos = clamp(p * n - 0.5, 0, n - 1);
      var active = Math.round(pos);
      sceneEls.forEach(function (s, i) {
        var d = pos - i;
        var v = clamp((0.48 - Math.abs(d)) / 0.2, 0, 1); /* hold, then dip through black */
        s.style.setProperty("--v", v.toFixed(3));
        s.style.setProperty("--d", d.toFixed(3));
        /* opacity only: all scene text stays in the accessibility tree */
      });
      railItems.forEach(function (li, i) { li.classList.toggle("is-active", i === active); });
    }
  }
  function requestUpdate() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }

  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);
  onChange(reduceMQ, setCinematic);
  onChange(wideMQ, setCinematic);
  setCinematic();

  /* Keyboard users: focusing a hero button jumps to the point where it is visible */
  if (hero) {
    hero.addEventListener("focusin", function () {
      if (!cinematic) return;
      var total = hero.offsetHeight - window.innerHeight;
      var target = hero.offsetTop + total * 0.6;
      var p = progress(hero);
      if (p < 0.45 || p > 0.75) window.scrollTo(0, target);
    });
  }

  /* Subtle pointer parallax on the hero (fine pointers only) */
  if (heroStage && window.matchMedia("(pointer: fine)").matches) {
    var mx = 0, my = 0, pending = false;
    heroStage.addEventListener("pointermove", function (e) {
      if (!cinematic) return;
      mx = (e.clientX / window.innerWidth) * 2 - 1;
      my = (e.clientY / window.innerHeight) * 2 - 1;
      if (!pending) {
        pending = true;
        requestAnimationFrame(function () {
          pending = false;
          heroStage.style.setProperty("--mx", mx.toFixed(3));
          heroStage.style.setProperty("--my", my.toFixed(3));
        });
      }
    });
  }

  /* ---------- Footer year ---------- */
  $$("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---------- Print buttons ---------- */
  $$("[data-print]").forEach(function (b) { b.addEventListener("click", function () { window.print(); }); });

  /* ---------- Copy email ---------- */
  $$("[data-copy-email]").forEach(function (btn) {
    var status = document.getElementById(btn.getAttribute("aria-describedby")) || $("[data-copy-status]");
    btn.addEventListener("click", function () {
      function done(ok) {
        if (status) status.textContent = ok ? "Email address copied to your clipboard." : "Copy didn’t work here. The address is " + EMAIL + ".";
      }
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(EMAIL).then(function () { done(true); }, function () { done(false); });
      } else {
        try {
          var t = document.createElement("textarea");
          t.value = EMAIL; t.setAttribute("readonly", ""); t.style.position = "absolute"; t.style.left = "-9999px";
          document.body.appendChild(t); t.select();
          var ok = document.execCommand("copy");
          document.body.removeChild(t);
          done(ok);
        } catch (err) { done(false); }
      }
    });
  });

  /* ---------- Contact form: honest mailto hand-off (no backend) ---------- */
  var form = $("[data-contact-form]");
  if (form) {
    var topic = form.elements.topic;
    var q = new URLSearchParams(location.search).get("topic");
    if (q && topic) {
      for (var i = 0; i < topic.options.length; i++) {
        if (topic.options[i].value === q) { topic.selectedIndex = i; break; }
      }
    }
    var formStatus = $("[data-form-status]");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;
      var f = form.elements;
      var topicLabel = topic.options[topic.selectedIndex].text;
      var subject = topicLabel + " from " + f.name.value.trim();
      var body = [
        "Name: " + f.name.value.trim(),
        "Email: " + f.email.value.trim(),
        f.company.value.trim() ? "Company / organisation: " + f.company.value.trim() : "",
        "Topic: " + topicLabel,
        "",
        f.message.value.trim()
      ].filter(function (line, idx) { return line !== "" || idx === 4; }).join("\n");
      var href = "mailto:" + EMAIL + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
      if (formStatus) {
        formStatus.textContent = "Your email app should now open with this message filled in. Nothing has been sent yet: press send in your email app. If no app opened, write to " + EMAIL + " directly.";
      }
      window.location.href = href;
    });
  }

  /* ---------- Website customizer (professional-websites.html) ---------- */
  var preview = $("[data-preview]");
  var controls = $("[data-customizer]");
  if (preview && controls) {
    controls.addEventListener("change", function (e) {
      var input = e.target;
      if (input && input.name) preview.setAttribute("data-" + input.name, input.value);
    });
  }
})();
