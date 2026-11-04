/* ==========================================================================
   Kado Digital LLC — projects.js
   Single source of truth for every project shown on the site.
   Edit the PROJECTS array to add, remove or update work. The homepage
   ("featured: true") and projects.html both render from this list.

   owner:   "kado"         = owned by Kado Digital LLC
            "personal"     = Mobina Saffari's personal / open-source work
            "professional" = anonymised experience from employment (not Kado IP)
   status:  "dev" | "live" | "exp" | "oss" | "pro"  (labels below)
   art:     CSS-built thumbnail style (no fake screenshots). Swap for a real
            image later by adding  image: "assets/your-file.webp", imageAlt: "…"
   ========================================================================== */
(function () {
  "use strict";

  var OWNER_LABELS = {
    kado: "Kado Digital product",
    personal: "Personal project",
    professional: "Professional experience"
  };
  var STATUS_LABELS = {
    dev: "In development",
    live: "Publicly viewable",
    exp: "Experimental, unpublished",
    oss: "Open source",
    pro: "Anonymised case study"
  };
  var CATEGORIES = [
    { id: "all", label: "All work" },
    { id: "games", label: "Games" },
    { id: "mobile", label: "Mobile Apps" },
    { id: "web", label: "Web Experiences" },
    { id: "devtools", label: "Developer Tools" },
    { id: "ai", label: "AI / Research" },
    { id: "cloud", label: "Cloud / Full-stack" }
  ];

  var PROJECTS = [
    {
      id: "memelife",
      title: "MemeLife",
      owner: "kado",
      status: "dev",
      categories: ["games", "mobile"],
      featured: true,
      art: "merge",
      summary: "A mobile merge game built in Godot, Kado Digital’s first original game.",
      details: [
        "Merge-based progression designed for short, satisfying sessions",
        "Built with the Godot engine for mobile",
        "Not yet released on any app store"
      ],
      tech: ["Godot", "Mobile"],
      links: []
    },
    {
      id: "memelife-site",
      title: "MemeLife cinematic website",
      owner: "kado",
      status: "live",
      categories: ["web"],
      featured: true,
      art: "cinema",
      summary: "The companion website for MemeLife: pinned full-screen scenes, layered parallax and scroll-directed storytelling.",
      details: [
        "Scroll-linked motion and crossfading scenes",
        "Layered foreground, midground and background",
        "The storytelling approach this site builds on"
      ],
      tech: ["HTML", "CSS", "JavaScript"],
      links: [{ label: "Visit the MemeLife website", href: "https://memelife-game.vercel.app", external: true }]
    },
    {
      id: "photo-cleaner",
      title: "Photo Cleaner",
      owner: "kado",
      status: "dev",
      categories: ["mobile"],
      featured: true,
      art: "swipe",
      summary: "A local-first Flutter app for clearing out a photo library quickly, without ever deleting by accident.",
      details: [
        "Swipe right to keep a photo, left to queue it for deletion",
        "Review the queue and confirm before anything is deleted",
        "Photos stay on the device: local-first by design"
      ],
      tech: ["Flutter", "Dart"],
      links: []
    },
    {
      id: "vscode-ai-assistant",
      title: "VS Code AI coding assistant",
      owner: "personal",
      status: "exp",
      categories: ["devtools", "ai"],
      featured: true,
      art: "code",
      summary: "An experimental multi-agent coding assistant for Visual Studio Code. A personal research project, not a published extension.",
      details: [
        "Explores coordinating several AI agents on one coding task",
        "Not published on the VS Code Marketplace"
      ],
      tech: ["VS Code extension", "Multi-agent AI"],
      links: [{ label: "View the source on GitHub", href: "https://github.com/mbnsfr/vscode-ai-assistant", external: true }]
    },
    {
      id: "algorithm-lab",
      title: "Algorithm Lab",
      owner: "personal",
      status: "oss",
      categories: ["devtools"],
      featured: false,
      art: "repo",
      summary: "Interactive scientific-computing demonstrations for optimization benchmarks, optimal transport, and ChiMerge discretization.",
      details: ["Django-based numerical experiments and visualizations", "Docker development workflow and automated tests"],
      tech: ["Python", "Django", "NumPy", "SciPy", "Docker"],
      links: [{ label: "View Algorithm Lab on GitHub", href: "https://github.com/mbnsfr/Algorithm-Lab", external: true }]
    },
    {
      id: "parse-platform",
      title: "Parse Platform",
      owner: "personal",
      status: "oss",
      categories: ["cloud"],
      featured: false,
      art: "repo",
      summary: "Multilingual full-stack starter with a typed data-filter builder, Parse API, health checks, and Dockerized development.",
      details: ["React frontend with Express and Parse Server API", "MongoDB persistence, CI, tests and secure development configuration"],
      tech: ["React", "Express", "Parse Server", "MongoDB", "Docker"],
      links: [{ label: "View Parse Platform on GitHub", href: "https://github.com/mbnsfr/Parse-Platform", external: true }]
    },
    {
      id: "django-boards",
      title: "Django Boards",
      owner: "personal",
      status: "oss",
      categories: ["cloud"],
      featured: false,
      art: "repo",
      summary: "A Django discussion-board application with environment-based security, health checks, tests, CI, and containerization.",
      details: ["Production-minded deployment configuration", "Docker Compose and GitHub Actions verification"],
      tech: ["Python", "Django", "Docker", "GitHub Actions"],
      links: [{ label: "View Django Boards on GitHub", href: "https://github.com/mbnsfr/Django-Boards", external: true }]
    },
    {
      id: "flooring-studio-demo",
      title: "Designe Flooring Studio (website concept)",
      owner: "personal",
      status: "exp",
      categories: ["web"],
      featured: false,
      art: "cinema",
      summary: "A customizable React website concept for a premium flooring and interior-design business, designed as a portfolio demonstration.",
      details: ["Service, project, materials and contact pages", "Responsive interface with editable demo content", "Not a client launch; source repository is private"],
      tech: ["React", "JavaScript", "Ant Design"],
      links: []
    },
    {
      id: "custom-portal-prototype",
      title: "Custom business website platform (prototype)",
      owner: "personal",
      status: "exp",
      categories: ["web", "cloud"],
      featured: false,
      art: "code",
      summary: "A role-based web application prototype for content management, client communications and project quoting.",
      details: ["React and FastAPI with PostgreSQL", "Administrator, writer and client roles", "Prototype requires further production hardening; not offered as a live service"],
      tech: ["React", "FastAPI", "PostgreSQL", "Docker"],
      links: []
    },
    {
      id: "cloud-rag",
      title: "Cloud infrastructure and RAG systems",
      owner: "professional",
      status: "pro",
      categories: ["cloud", "ai"],
      featured: false,
      art: "cloud",
      summary: "Experience from Mobina’s professional role in AWS cloud engineering and retrieval-augmented generation (RAG). Described as skills only: no employer or customer systems, names or details are shown, and this work is not Kado Digital property.",
      details: [
        "Designing and operating workloads on AWS",
        "Building retrieval-augmented generation pipelines",
        "Full-stack development around cloud services"
      ],
      tech: ["AWS", "RAG", "Full-stack"],
      links: []
    }
  ];

  /* ---------- Rendering ---------- */
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function artHTML(p) {
    if (p.image) {
      return '<img src="' + esc(p.image) + '" alt="' + esc(p.imageAlt || "") + '" loading="lazy" width="800" height="600">';
    }
    var i, out = "";
    switch (p.art) {
      case "merge":
        var hot = [2, 7, 8, 13, 18], warm = [3, 12, 17, 19];
        out = '<div class="thumb__merge">';
        for (i = 0; i < 20; i++) out += '<span class="' + (hot.indexOf(i) > -1 ? "hot" : warm.indexOf(i) > -1 ? "warm" : "") + '"></span>';
        return out + "</div>";
      case "swipe":
        return '<div class="thumb__swipe"><span></span><span></span></div>';
      case "cinema":
        return '<div class="thumb__cinema"><span></span><span></span><span></span></div>';
      case "code":
        return '<div class="thumb__code"><span></span><span></span><span></span><span></span><span></span><span></span></div>';
      case "cloud":
        return '<svg class="thumb__svg" viewBox="0 0 200 140" aria-hidden="true" focusable="false">' +
          '<line x1="40" y1="70" x2="100" y2="30"/><line x1="40" y1="70" x2="100" y2="110"/>' +
          '<line class="hot" x1="100" y1="30" x2="160" y2="70"/><line x1="100" y1="110" x2="160" y2="70"/>' +
          '<rect x="22" y="56" width="36" height="28"/><rect x="82" y="16" width="36" height="28"/>' +
          '<rect x="82" y="96" width="36" height="28"/><rect class="fill" x="142" y="56" width="36" height="28"/></svg>';
      default: /* repo */
        return '<svg class="thumb__svg" viewBox="0 0 200 140" aria-hidden="true" focusable="false">' +
          '<line x1="30" y1="100" x2="170" y2="100"/><path d="M70 100 C 70 60, 110 50, 130 50"/>' +
          '<path class="hot" d="M130 50 C 150 50, 160 70, 160 100"/>' +
          '<circle cx="30" cy="100" r="9"/><circle cx="70" cy="100" r="9"/><circle cx="130" cy="50" r="9"/>' +
          '<circle class="fill" cx="160" cy="100" r="9"/></svg>';
    }
  }

  function cardHTML(p, headingLevel, opts) {
    var h = "h" + headingLevel;
    var ownerClass = p.owner === "kado" ? "chip chip--owner chip--kado" : "chip chip--owner";
    var html = '<article class="work" id="work-' + esc(p.id) + '"><div class="work__inner">' +
      '<div class="thumb" aria-hidden="true">' + artHTML(p) + "</div>" +
      '<div class="work__body"><div class="work__meta">' +
      '<span class="chip chip--status-' + esc(p.status) + '">' + esc(STATUS_LABELS[p.status]) + "</span>" +
      '<span class="' + ownerClass + '">' + esc(OWNER_LABELS[p.owner]) + "</span></div>" +
      "<" + h + ">" + esc(p.title) + "</" + h + ">" +
      "<p>" + esc(p.summary) + "</p>";
    if (opts.details && p.details.length) {
      html += '<ul class="work__details">' + p.details.map(function (d) { return "<li>" + esc(d) + "</li>"; }).join("") + "</ul>";
    }
    if (p.tech.length) html += '<p class="work__tech">Built with: ' + esc(p.tech.join(", ")) + "</p>";
    if (p.links.length) {
      html += '<div class="work__links">' + p.links.map(function (l) {
        return '<a class="text-link" href="' + esc(l.href) + '"' +
          (l.external ? ' target="_blank" rel="noopener"' : "") + ">" + esc(l.label) +
          (l.external ? '<span class="visually-hidden"> (opens in a new tab)</span>' : "") + "</a>";
      }).join("") + "</div>";
    } else if (opts.homeLink) {
      html += '<div class="work__links"><a class="text-link" href="projects.html#work-' + esc(p.id) + '">More about ' + esc(p.title) + "</a></div>";
    }
    return html + "</div></div></article>";
  }

  /* Homepage featured list */
  function renderFeatured() {
    var el = document.querySelector("[data-featured-work]");
    if (!el) return;
    el.innerHTML = PROJECTS.filter(function (p) { return p.featured; })
      .map(function (p) { return cardHTML(p, 3, { details: false, homeLink: true }); }).join("");
  }

  /* Projects page: accessible tabs (WAI-ARIA tabs pattern, automatic activation) */
  function renderProjectsPage() {
    var tablist = document.querySelector("[data-project-tabs]");
    var panel = document.querySelector("[data-project-panel]");
    var status = document.querySelector("[data-project-status]");
    if (!tablist || !panel) return;

    tablist.innerHTML = CATEGORIES.map(function (c, i) {
      return '<button class="tab" type="button" role="tab" id="tab-' + c.id + '" data-cat="' + c.id +
        '" aria-controls="project-panel" aria-selected="' + (i === 0) + '" tabindex="' + (i === 0 ? "0" : "-1") + '">' + esc(c.label) + "</button>";
    }).join("");
    var tabs = Array.prototype.slice.call(tablist.querySelectorAll('[role="tab"]'));

    function show(cat, fromLoad) {
      tabs.forEach(function (t) {
        var on = t.getAttribute("data-cat") === cat;
        t.setAttribute("aria-selected", on);
        t.tabIndex = on ? 0 : -1;
      });
      panel.setAttribute("aria-labelledby", "tab-" + cat);
      var list = PROJECTS.filter(function (p) { return cat === "all" || p.categories.indexOf(cat) > -1; });
      panel.innerHTML = list.length
        ? '<div class="work-grid">' + list.map(function (p) { return cardHTML(p, 2, { details: true }); }).join("") + "</div>"
        : '<p class="empty">Nothing in this category yet. Choose another tab to see more work.</p>';
      if (status) {
        var label = CATEGORIES.filter(function (c) { return c.id === cat; })[0].label;
        status.textContent = "Showing " + list.length + " of " + PROJECTS.length + " projects" + (cat === "all" ? "." : " in " + label + ".");
      }
      if (!fromLoad && history.replaceState) {
        history.replaceState(null, "", cat === "all" ? location.pathname : location.pathname + "#" + cat);
      }
    }

    tablist.addEventListener("click", function (e) {
      var t = e.target.closest('[role="tab"]');
      if (t) show(t.getAttribute("data-cat"));
    });
    tablist.addEventListener("keydown", function (e) {
      var i = tabs.indexOf(document.activeElement);
      if (i < 0) return;
      var next = null;
      if (e.key === "ArrowRight") next = tabs[(i + 1) % tabs.length];
      else if (e.key === "ArrowLeft") next = tabs[(i - 1 + tabs.length) % tabs.length];
      else if (e.key === "Home") next = tabs[0];
      else if (e.key === "End") next = tabs[tabs.length - 1];
      if (next) {
        e.preventDefault();
        next.focus();
        show(next.getAttribute("data-cat"));
      }
    });

    /* Deep links: projects.html#games selects a tab; #work-id scrolls to a project */
    var hash = location.hash.replace("#", "");
    var startCat = CATEGORIES.some(function (c) { return c.id === hash; }) ? hash : "all";
    show(startCat, true);
    if (hash.indexOf("work-") === 0) {
      var target = document.getElementById(hash);
      if (target) requestAnimationFrame(function () { target.scrollIntoView(); });
    }
  }

  function init() { renderFeatured(); renderProjectsPage(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();

  window.KADO_PROJECTS = PROJECTS;
})();
