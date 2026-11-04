# Deployment — Cloudflare Pages

- Production: `https://kado-digital-website.pages.dev`
- Source: `kado-digital/kado-digital-website`, `main` branch
- Framework preset: `None`
- Build command: `exit 0` (committed static output; no runtime build)
- Build output directory: `.` (repository root)
- Git integration: Cloudflare Pages automatically rebuilds on new pushes.
- Commercial services are offered; do not use a host or plan that prohibits commercial use.

Before publishing: run `python3 scripts/build_site.py`, `python3 -m unittest discover -s tests -v`, and `node --check` on the three JS modules. Inspect `/`, `/projects`, `/resume`, `/professional-websites`, `/contact`, and a `/work/<slug>/` route after deployment. Confirm original Kado branding, mobile behavior, email handoff and current project statuses.

No Cloudflare API tokens are committed or needed in this repository.
