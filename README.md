# Kado Digital LLC — website

A static, dependency-free website for Kado Digital LLC: plain HTML5, CSS and vanilla JavaScript.
No frameworks, no build step, no external fonts, CDNs or paid services.

## Review-build changes (November 4, 2026)

- Added the user's original orange Kado cat logo as `assets/kado-cat-logo-black.png` (exact unmodified uploaded image).
- Derived a transparent version for the site chrome/hero as `assets/kado-cat-logo.png`, preserving its silhouette and colors against black.
- Matched the CSS accent to the logo's sampled orange and shortened the mobile hero text entrance delay.
- Populated resume links, known employment details, schools, certifications and accreditations from user-provided profile/CV information. **Confirm all dates and public resume wording before launch.**
- Corrected public GitHub project links and descriptions. Added clearly labelled website prototypes, without claiming live releases or public source.
- Moved the placeholder sitemap to `sitemap.template.xml` so a live deployment won't publish `YOUR-DOMAIN.com` as real metadata. Add a valid `sitemap.xml` and update `robots.txt` after choosing the domain.
- The contact form still launches the visitor’s email app, not a server-submitted enquiry.
- Hosting: this is a commercial studio site. Confirm commercial hosting terms; Vercel Hobby is not suitable.

## File tree

```
kado-digital-site/
├── index.html                    Cinematic homepage
├── about.html                    Studio story, vision, founder
├── resume.html                   Mobina Saffari's resume (print-friendly)
├── projects.html                 Filterable, labelled project collection
├── professional-websites.html    Commercial website service + live customizer
├── contact.html                  Email links + mailto hand-off form
├── 404.html                      Not-found page (Vercel / Cloudflare / Netlify pick it up automatically)
├── css/styles.css                All styles, including print and reduced-motion rules
├── js/main.js                    Navigation, cinematic scroll scenes, form, customizer
├── js/projects.js                Project data (single source of truth) + filter tabs
├── assets/
│   ├── kado-cat-logo.png         Transparent original cat mark (included)
│   ├── kado-cat-logo-black.png   Unmodified original (included)
│   └── founder-orange-avatar.png Optional founder portrait (included)
├── robots.txt
├── sitemap.template.xml
└── README.md
```

No `vercel.json` is included because none is needed.

## 1. Logo (already included in this review build)

The site now includes the exact original cat emblem, including an unchanged black-background copy. No additional image or redrawing is needed. The transparent derivative improves the hero against the near-black website background.

## 2. Preview locally

Double-clicking `index.html` works. For the most accurate preview (the logo light-sweep mask needs http), run a local server from the project folder:

```
python3 -m http.server 8000
```

Then open http://localhost:8000.

## 3. Put it on GitHub

1. Create a new repository (for example `kado-digital-site`) on GitHub, under the `kado-digital` organisation if you like.
2. Upload every file and folder above to the repository root (drag-and-drop in GitHub's web UI works), or:

```
git init
git add .
git commit -m "Kado Digital website"
git branch -M main
git remote add origin https://github.com/kado-digital/kado-digital-site.git
git push -u origin main
```

## 4. Deploy

### Important: hosting terms for a business site

Vercel's free **Hobby** plan is limited to personal, non-commercial use. This is a business website that advertises paid services, so it should not be assumed compliant on Hobby. Choose one of these instead, and check each provider's current terms yourself before launch:

**Option A: Vercel Pro (paid, commercial use allowed)**
1. Sign in at vercel.com, upgrade or create a Pro team.
2. Add New → Project → import the GitHub repository.
3. Framework preset: **Other**. Build command: leave empty. Output directory: leave empty (root).
4. Deploy, then add your domain under Project → Settings → Domains.

**Option B: Cloudflare Pages (free plan; review current terms for commercial use)**
1. Cloudflare dashboard → Workers & Pages → Create → Pages → Connect to Git.
2. Pick the repository. Framework preset: **None**. Build command: empty. Build output directory: `/`.
3. Save and deploy, then add a custom domain.

Other static hosts (Netlify, GitHub Pages and similar) also work with no changes; confirm their terms permit a commercial site.

Every push to `main` redeploys automatically on either option.

## 5. After you have a domain

After choosing a domain, replace `https://YOUR-DOMAIN.com` in `sitemap.template.xml`, rename it to `sitemap.xml`, add that sitemap URL to `robots.txt`, and change `og:image` in each page’s `<head>` to an absolute URL (e.g. `https://your-domain.com/assets/kado-cat-logo-black.png`). Then submit it to search engines.

## 6. Replace placeholder content

The review build populated the resume and project details that were supported by profile/CV data. **Verify them before launch.** The remaining production choices are:

| Where | What remains |
|---|---|
| `resume.html` | Confirm dates, contact details, professional experience wording, and credential names |
| `assets/` | Add genuine product screenshots when available (no fabricated screenshots) |
| `sitemap.template.xml`, `robots.txt`, `<head>` | Add final public domain and absolute Open Graph image URLs |
| `resume.html` | Optional real PDF download, if you supply the finished document |

### Editing projects

All projects live in the `PROJECTS` array at the top of `js/projects.js`. Each entry has an owner (`kado`, `personal`, `professional`), a status (`dev`, `live`, `exp`, `oss`, `pro`), categories and links. Set `featured: true` to show it on the homepage. To replace a CSS thumbnail with a real screenshot, add `image: "assets/file.webp"` and `imageAlt: "description"`.

### Editing the header or footer

The header and footer are repeated in each HTML page (that's what keeps the site build-free). If you change a nav link, update it in all seven HTML files; a find-and-replace across the folder does it in one go.

### Contact form

There is no backend. The form validates the fields, then opens the visitor's own email app with the message pre-filled, and tells them plainly that nothing has been sent yet. The direct `mailto:` link and a copy-address button sit beside it. If you later want on-site submissions, connect a form service of your choice, then update the note and status text in `contact.html` and `js/main.js` so they stay truthful.

## How the motion works

- **Hero:** on load, an orange glint flares, the logo emerges, and a light sweep crosses it. On wide screens, scrolling (normal native scrolling, never hijacked) brings in the studio name, the statement and the buttons, then fades the stage into the next scene. A subtle pointer parallax shifts the background layers.
- **Expertise scenes:** three pinned scenes (Products, Websites, Engineering) crossfade through black with layered parallax art as you scroll.
- **Fallbacks:** on screens narrower than 900 px or shorter than 560 px, with `prefers-reduced-motion`, or without JavaScript, everything renders as a normal readable page with no pinned sections. All scene text stays in the accessibility tree at all times. Tabbing into the hero buttons scrolls them into their visible state.
- **Page transitions:** cross-document View Transitions in supporting browsers; other browsers navigate normally.

## Preview and testing checklist

- [x] Logo file added; header, hero, footer, favicon and 404 page reference it
- [ ] Homepage on desktop: glint → logo → scroll reveals title, statement, buttons → three scenes crossfade → Selected work
- [ ] Homepage on a phone: no pinned sections, all text readable, no sideways scrolling
- [ ] OS "reduce motion" turned on: no scroll-linked animation, content fully visible
- [ ] Menu button on mobile/tablet opens and closes; Escape closes it and returns focus
- [ ] Keyboard only: skip link works, focus rings visible on every link/button/tab/field, hero buttons become visible when focused
- [ ] Projects: tabs filter correctly; arrow keys, Home and End move between tabs; `projects.html#games` opens the Games tab
- [ ] Professional Websites: every customizer option changes the preview; both CTAs go to the contact page with the right topic
- [ ] Contact: empty submit shows validation; valid submit opens your email app with subject and body; status message appears; copy button works on https
- [ ] Resume: Print button opens the print dialog; print preview is black on white
- [ ] Every nav and footer link works on every page; external links open in a new tab
- [x] No JavaScript errors in desktop/mobile local rendering checks
- [ ] Lighthouse (Chrome DevTools) run on each page for performance, accessibility, SEO
- [ ] After deploy: visit a made-up URL to confirm the 404 page

## Self-review notes

Two review passes were run in headless Chromium at 1440 × 900 and 390 × 844, with a temporary stand-in image used only to check layout (it is not included).

Pass 1 found and fixed: scene crossfades overlapped two scenes' text mid-transition (now dip through black); hidden scenes were removed from the accessibility tree (now opacity-only, always readable by screen readers); the logo fallback lost its rotation after the reveal animation.

Pass 2 confirmed: no horizontal overflow on any page at either size; no JavaScript errors; mobile menu, Escape and focus return; tab filtering, keyboard navigation and deep links; customizer; contact validation, mailto hand-off and topic pre-selection; reduced-motion fallback; keyboard focus in the hero; print layout; all internal links and anchors resolve; one `h1` per page.

Outstanding: confirm resume details; improve cinematic product visuals; supply real project screenshots; set the domain; run Lighthouse and real-device checks (iOS Safari, Android Chrome) after deploying.
