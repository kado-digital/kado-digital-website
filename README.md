# Kado Digital LLC — official studio website

An independent software studio's public home, showcasing Kado-owned products,
professional website services and founder Mobina Saffari's **separate** personal
engineering work. Live at **https://kado-digital-website.pages.dev**.

## What visitors can open

| Route | Content |
| --- | --- |
| `/` | Cinematic home / original orange cat brand |
| `/about` | Studio story, ownership and founder |
| `/projects` | Accessible project filters and status labels |
| `/work/<project>/` | Dedicated, shareable project case study pages |
| `/professional-websites` | Services + interactive (illustrative) site customizer |
| `/resume` | Founder profile, education, timeline, certifications, PDF |
| `/contact` | Mailto handoff, with clear *not yet sent* disclosure |

Navigation uses real static HTML routes, not a client-side SPA or catch-all rewrite.
Cloudflare Pages redirects `about.html` to `/about` automatically. Project details
live in `work/<slug>/index.html`, so direct links and refresh work.

## Architecture

```
index.html, about.html, projects.html, ...     static, semantic HTML
work/<slug>/index.html                     generated static case-study pages
data/projects.json                         single source of truth for project facts
js/boot.js                                 minimal before-paint enhancement flag
js/main.js                                 navigation, motion, forms and customizer
js/projects.js                             fetch/render/filter project catalogue
css/styles.css                             cinematic design system and original scenes
css/portfolio.css                          founder/resume and project layouts
assets/                                    original Kado mark, founder art, own screenshots
scripts/build_site.py                      generate case studies, resume, sitemap & sync nav
sitemap.xml, robots.txt                    search-engine paths
_headers                                   basic security-oriented response headers
assets/mobina-saffari-resume.pdf           print-friendly founder resume
```

**No build dependencies.** HTML, CSS and JavaScript are committed as ready-to-host
files. Cloudflare Pages can keep the current build command `exit 0` and output
folder `.`. Every push to `main` updates production automatically.

The homepage design is intentionally cinematic on larger screens, but native
scrolling is never hijacked and the content is readable on mobile or when
`prefers-reduced-motion` is enabled. A semantic 404 page prevents broken routes
from being silently served as the homepage.

## Working on the site

1. Edit copy for normal pages in their `.html` file.
2. For project status, descriptions, technology, ownership or external links,
   edit **only** `data/projects.json`.
3. Regenerate the case study pages, resume and sitemap with:

   ```bash
   python3 scripts/build_site.py
   ```

4. Validate before committing:

   ```bash
   python3 -m unittest discover -s tests -v
   node --check js/boot.js
   node --check js/main.js
   node --check js/projects.js
   ```

5. Commit changes to the project GitHub organization; Cloudflare Pages will
   redeploy from the production branch.

The build script uses `index.html` as the source for the site-wide header and
footer. It synchronizes these into the other root pages for consistency.

## Media and ownership

- **Kado Digital LLC:** The orange cat brand, studio website, MemeLife game
  concept, MemeLife site and Photo Cleaner product development.
- **Independent founder:** VS Code AI Assistant, Algorithm Lab, Parse Platform,
  Django Boards, graduate speech research and private design prototypes.
- **Employer experience:** RAG/cloud experience is only described at a high
  level; no YAS Networks or customer-owned code, screenshots, configurations
  or confidential data is reproduced.

Images labelled as website screenshots are captures of Kado's own rendered web
pages. The optimization visualization is an **illustrative plot** of a public
benchmark, not an app screenshot. Other thumbnails are abstract CSS art,
not fabricated photos or live product screenshots. MemeLife and Photo Cleaner
are not represented as released apps.

## Links and communications

Contact email: `kadodigitalllc@outlook.com`. The contact form is a `mailto:`
composer and **does not send or store submissions**. The website quotes custom
websites per contract rather than presenting fixed prices.

For a custom domain, update canonical/Open Graph URLs, `BASE` in
`scripts/build_site.py`, `sitemap.xml`, `robots.txt`, then redeploy. Avoid
publishing private credentials, real client data or source code from employers.
