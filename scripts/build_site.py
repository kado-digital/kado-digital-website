#!/usr/bin/env python3
"""Generate the static project case studies, founder resume and sitemap.

Run from the repository root: python3 scripts/build_site.py
Output is committed to GitHub so Cloudflare Pages needs no build command.
Only standard-library Python is used. Project facts live in data/projects.json.
"""
from __future__ import annotations
import html
import json
import re
from pathlib import Path
from xml.sax.saxutils import escape as xml_escape

ROOT = Path(__file__).resolve().parents[1]
BASE = 'https://kado-digital-website.pages.dev'
DATA = json.loads((ROOT/'data/projects.json').read_text())

def esc(value: object) -> str:
    return html.escape(str(value), quote=True)

def strip_current(markup: str) -> str:
    return markup.replace(' aria-current="page"', '')

homepage = (ROOT/'index.html').read_text()
HEADER = re.search(r'<header class="site-header".*?</header>', homepage, re.S).group()
FOOTER = re.search(r'<footer class="site-footer".*?</footer>', homepage, re.S).group()

def base_head(title: str, description: str, path: str, *, noindex: bool = False, social: str = '/assets/kado-cat-logo-black.png') -> str:
    title, description = esc(title), esc(description)
    if not path.startswith('/'): raise ValueError('Canonical paths must start with /')
    social_url = BASE + social
    return f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{title}</title>
<meta name="description" content="{description}">
{'<meta name="robots" content="noindex">' if noindex else ''}
<link rel="canonical" href="{BASE}{esc(path)}">
<meta name="theme-color" content="#0A0A0B">
<meta name="color-scheme" content="dark">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Kado Digital LLC">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{description}">
<meta property="og:url" content="{BASE}{esc(path)}">
<meta property="og:image" content="{esc(social_url)}">
<meta property="og:image:alt" content="Kado Digital: geometric orange cat logo">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" type="image/png" href="/assets/kado-cat-logo.png">
<link rel="apple-touch-icon" href="/assets/kado-cat-logo.png">
<link rel="stylesheet" href="/css/styles.css">
<link rel="stylesheet" href="/css/portfolio.css">
<script src="/js/boot.js"></script>
<script src="/js/main.js" defer></script>
</head>
'''

def shell(title: str, description: str, path: str, body: str, current: str = '/projects', social: str = '/assets/kado-cat-logo-black.png') -> str:
    header = strip_current(HEADER)
    header = header.replace(f'href="{current}"', f'href="{current}" aria-current="page"', 1)
    return base_head(title, description, path, social=social) + '<body>\n<a class="skip-link" href="#main">Skip to content</a>\n' + header + '\n<main id="main">\n' + body + '\n</main>\n' + FOOTER + '\n</body>\n</html>\n'

STATUS = {'dev': 'In development', 'live': 'Live website', 'exp':'Experimental / concept', 'oss':'Public source', 'pro':'Employment experience'}
OWNERS = {'kado':'Kado Digital LLC','personal':'Independent / personal','professional':'Professional employment · not Kado property'}

def media(project):
    if not project.get('image'):
        return f'<div class="case-art case-art--{esc(project["art"])}" aria-label="Abstract illustration, not a product screenshot" role="img"><span class="case-art__glyph">{("⌘" if project["art"] == "code" else "◆")}</span><span class="case-art__line"></span></div>'
    return f'<figure class="case-visual"><img src="{esc(project["image"])}" alt="{esc(project.get("imageAlt") or project["title"])}" width="1200" height="750"><figcaption>{esc(project.get("imageAlt") or "Actual project image")}</figcaption></figure>'

def case_study(project):
    p = project
    path = f'/work/{p["slug"]}/'
    technology = ''.join(f'<li>{esc(x)}</li>' for x in p['tech'])
    features = ''.join(f'<li>{esc(x)}</li>' for x in p['details'])
    external = ''.join(f'<a class="btn btn--ghost" href="{esc(link["href"])}" target="_blank" rel="noopener noreferrer">{esc(link["label"])}<span class="visually-hidden"> (opens in a new tab)</span></a>' for link in p['links'] if link.get('external') and link.get('href', '').startswith('https://'))
    gallery = ''
    if p['gallery']:
        inner=''.join(f'<figure class="case-gallery__item"><img loading="lazy" decoding="async" src="{esc(g["image"])}" alt="{esc(g["alt"])}" width="1200" height="760"><figcaption>{esc(g["caption"])} </figcaption></figure>' for g in p['gallery'])
        gallery=f'<section class="section section--tight" aria-labelledby="gallery-title"><div class="wrap"><h2 class="h-section" id="gallery-title">From the workbench</h2><div class="case-gallery">{inner}</div></div></section>'
    note = {'kado':'This is a Kado Digital LLC project. Development status is shown above.', 'personal':'This is independent work by the founder, not company-owned Kado software.', 'professional':'Experience from employment is described only at a high level. No employer or customer source code is shared.'}[p['owner']]
    body=f'''
<section class="page-intro case-intro">
  <div class="wrap">
    <nav class="breadcrumbs" aria-label="Breadcrumb"><ol><li><a href="/">Home</a></li><li><a href="/projects">Projects</a></li><li><span aria-current="page">{esc(p['title'])}</span></li></ol></nav>
    <p class="eyebrow">{esc(p.get('heroLabel') or 'PROJECT')}</p>
    <div class="case-hero">
      <div class="case-hero__copy">
        <h1 class="h-display">{esc(p['title'])}</h1>
        <p class="lead">{esc(p['summary'])}</p>
        <div class="case-facts"><span class="chip">{esc(OWNERS[p['owner']])}</span><span class="chip chip--status-{esc(p['status'])}">{esc(STATUS[p['status']])}</span><span class="chip">{esc(p['year'])}</span></div>
        <div class="btn-row"><a class="btn" href="/contact?topic=project">Discuss a similar project</a>{external}</div>
      </div>
      <div class="case-hero__media">{media(p)}</div>
    </div>
  </div>
</section>
<section class="section section--char" aria-labelledby="story-title"><div class="wrap case-grid"><div><p class="eyebrow">01 / THE IDEA</p><h2 class="h-section" id="story-title">What it is</h2></div><div><p class="lead">{esc(p['story'])}</p></div></div></section>
<section class="section section--tight" aria-labelledby="approach-title"><div class="wrap case-grid"><div><p class="eyebrow">02 / THE BUILD</p><h2 class="h-section" id="approach-title">How it works</h2></div><div><p class="lead">{esc(p['approach'])}</p><ul class="checklist">{features}</ul><h3 class="case-subhead">Tools and technologies</h3><ul class="case-tags">{technology}</ul></div></div></section>
<section class="section section--char" aria-labelledby="outcome-title"><div class="wrap case-grid"><div><p class="eyebrow">03 / STATUS</p><h2 class="h-section" id="outcome-title">Where it stands</h2></div><div><p class="lead">{esc(p['outcome'])}</p><p class="source-note">{esc(note)}</p></div></div></section>
{gallery}
<section class="section cta-band"><div class="wrap"><h2>Explore another project</h2><p>More Kado products, developer tools and independent experiments are collected in one place.</p><div class="btn-row"><a class="btn" href="/projects">Browse all projects</a><a class="btn btn--ghost" href="/resume">Meet the founder</a></div></div></section>
'''
    return shell(f'{p["title"]} | Kado Digital project',p['summary'],path,body,social=p.get('image') or '/assets/kado-cat-logo-black.png')

def resume():
    body='''
<section class="page-intro founder-intro" aria-labelledby="resume-title"><div class="wrap">
  <nav class="breadcrumbs" aria-label="Breadcrumb"><ol><li><a href="/">Home</a></li><li><span aria-current="page">Founder resume</span></li></ol></nav>
  <div class="founder-hero">
    <div class="founder-hero__copy"><p class="eyebrow">THE FOUNDER / RESUME</p><h1 class="h-display" id="resume-title">Mobina<br><span class="accent">Saffari.</span></h1>
      <p class="lead">Cloud Administrator · Full-stack developer · Applied AI · Founder of Kado Digital LLC.</p>
      <p class="muted">An engineering background across frontend, backend and AWS, with graduate work in artificial intelligence and an independent software studio focused on useful, thoughtful products.</p>
      <div class="btn-row no-print"><a class="btn" href="/assets/mobina-saffari-resume.pdf" download>Download resume PDF</a><button class="btn btn--ghost" type="button" data-print>Print this page</button><a class="btn btn--ghost" href="/contact">Contact Mobina</a></div>
    </div>
    <div class="founder-hero__art"><img src="/assets/founder-orange-avatar.webp" alt="Orange geometric vector portrait of Mobina in the Kado visual style" width="960" height="960"></div>
  </div>
</div></section>
<section class="section section--tight" aria-labelledby="resume-profile-title"><div class="wrap founder-layout">
  <aside class="founder-sidebar" aria-label="Profile and skills">
    <div class="founder-sidebar__card"><p class="eyebrow">CONNECT</p><h2 id="resume-profile-title">Find me online</h2>
      <ul class="founder-contact"><li><a href="mailto:mbnsfr@gmail.com">Email Mobina</a></li><li><a href="https://github.com/mbnsfr" target="_blank" rel="noopener noreferrer">Personal GitHub ↗</a></li><li><a href="https://github.com/kado-digital" target="_blank" rel="noopener noreferrer">Kado Digital GitHub ↗</a></li><li><a href="https://www.linkedin.com/in/mobina-saffari/" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a></li><li><a href="https://www.credly.com/users/mobina-saffari/badges/credly" target="_blank" rel="noopener noreferrer">Verified credentials ↗</a></li></ul>
    </div>
    <div class="founder-sidebar__card"><p class="eyebrow">WHAT I WORK WITH</p><h2>Technical toolkit</h2>
      <div class="skill-group"><h3>Cloud & operations</h3><p>AWS, Docker, Linux, Terraform, CI/CD, observability, Splunk</p></div>
      <div class="skill-group"><h3>Full-stack</h3><p>Python, JavaScript, TypeScript, React, Django, FastAPI, Node.js, PHP, Laravel, SQL, PostgreSQL, MongoDB</p></div>
      <div class="skill-group"><h3>AI & research</h3><p>RAG, speech emotion recognition, Conformers, PyTorch, TensorFlow, experimental multi-agent systems</p></div>
      <div class="skill-group"><h3>Products</h3><p>Flutter, Godot, product prototyping, responsive websites and accessible UI</p></div>
    </div>
  </aside>
  <div class="founder-content">
    <section class="founder-section" id="experience" aria-labelledby="experience-title"><p class="eyebrow">01 / CAREER</p><h2 class="h-section" id="experience-title">Experience</h2>
      <div class="timeline">
        <article class="timeline__item"><p class="timeline__date">July 2026 — present</p><h3>Founder & Owner</h3><p class="timeline__org">Kado Digital LLC · Virginia</p><p>Leading the direction, design and development of independent apps, games and bespoke professional websites. Current projects include MemeLife and Photo Cleaner, both in development.</p><p><a class="text-link" href="/projects#mobile">See Kado’s products</a></p></article>
        <article class="timeline__item"><p class="timeline__date">May 2026 — present</p><h3>Cloud Administrator</h3><p class="timeline__org">YAS Networks · United States</p><p>AWS infrastructure operations, monitoring, reliability and troubleshooting, with engineering experience around web applications and retrieval-augmented generation. Employer and customer systems remain confidential and separate from Kado Digital.</p></article>
        <article class="timeline__item"><p class="timeline__date">September — December 2023</p><h3>Teaching Assistant</h3><p class="timeline__org">K. N. Toosi University of Technology</p><p>Supported university coursework and students with technical assignments and individualized learning guidance.</p></article>
        <article class="timeline__item"><p class="timeline__date">December 2021 — February 2022</p><h3>Senior Frontend Developer</h3><p class="timeline__org">Professional web-development role · Tehran</p><p>Frontend development with JavaScript and modern web technologies, collaborating on user-facing features and implementation.</p></article>
        <article class="timeline__item"><p class="timeline__date">September 2019 — August 2021</p><h3>Web Developer</h3><p class="timeline__org">NopaYar Company · Tehran</p><p>Worked on Petrofolio, Dadrah, School and related web projects, contributing to React/JavaScript frontends, PHP/Laravel implementations, Parse Server integrations, testing and maintenance. These were employer projects, not Kado Digital products.</p></article>
      </div>
      <details class="career-more"><summary>Earlier customer-facing experience</summary><p>Roles with Verizon, The Home Depot and Safeway developed skills in communication, customer service, collaboration and problem-solving alongside a technical career.</p></details>
    </section>
    <section class="founder-section" id="early-web" aria-labelledby="early-web-title"><p class="eyebrow">CAREER FOUNDATIONS / 2019–2021</p><h2 class="h-section" id="early-web-title">Earlier web projects</h2>
      <p class="muted">Contributions described in my historical CV. Petrofolio, School, Dadrah and Online Menu were professional assignments, not Kado Digital products. The children's website was an academic project.</p>
      <div class="resume-projects">
        <div class="resume-project-static"><strong>Dadrah website · 2020–2021</strong><span>PHP/Laravel, JavaScript, SQL, Bootstrap and interface maintenance, testing and support.</span></div>
        <div class="resume-project-static"><strong>Petrofolio website · 2020</strong><span>React, Redux, TypeScript, Parse Server and Docker; frontend features and routing.</span></div>
        <div class="resume-project-static"><strong>School website · 2020</strong><span>React/TypeScript frontend development, maintenance and testing with Parse Server.</span></div>
        <div class="resume-project-static"><strong>Online Menu project · 2021</strong><span>Frontend application work using JavaScript, React and Redux.</span></div>
        <div class="resume-project-static"><strong>Children's educational website · 2020</strong><span>Bachelor's capstone: a full-stack learning and entertainment website built with React, Node.js, Parse Server and Docker.</span></div>
      </div>
    </section>
    <section class="founder-section" id="education" aria-labelledby="education-title"><p class="eyebrow">02 / EDUCATION</p><h2 class="h-section" id="education-title">Education & research</h2>
      <div class="qualification"><div><h3>Master’s in Artificial Intelligence</h3><p>K. N. Toosi University of Technology</p></div><span>2021–2024</span></div><p class="muted">Research: speech emotion recognition using Conformers and pretrained speech representations.</p>
      <div class="qualification"><div><h3>Bachelor’s in Computer Engineering</h3><p>Abrar University</p></div><span>2017–2021</span></div><p class="muted">Graduated as a top student (GPA 18.55/20). Capstone: an educational and entertainment website for children, developed with React, Parse Server, Node.js and Docker.</p>
    </section>
    <section class="founder-section" id="certifications" aria-labelledby="certifications-title"><p class="eyebrow">03 / CERTIFICATIONS</p><h2 class="h-section" id="certifications-title">Credentials</h2>
      <div class="credential"><div><h3>AWS Certified Solutions Architect — Associate</h3><p>Professional certification</p></div><span>AWS</span></div>
      <div class="credential"><div><h3>AWS Certified Cloud Practitioner</h3><p>Professional certification</p></div><span>AWS</span></div>
      <div class="credential"><div><h3>AWS Partner sales & technical accreditations</h3><p>Partner training credentials (distinct from AWS certifications)</p></div><span>Training</span></div>
      <div class="credential"><div><h3>Splunk accreditations</h3><p>Sales, cloud, observability and technical training badges</p></div><span>Training</span></div>
      <p class="credly-note">Current credential records and verification: <a class="text-link" href="https://www.credly.com/users/mobina-saffari/badges/credly" target="_blank" rel="noopener noreferrer">Credly profile ↗</a></p>
    </section>
    <section class="founder-section" id="portfolio" aria-labelledby="portfolio-title"><p class="eyebrow">04 / SELECTED WORK</p><h2 class="h-section" id="portfolio-title">Selected engineering projects</h2>
      <div class="resume-projects"><a href="/work/vscode-ai-assistant/"><strong>VS Code AI Coding Assistant</strong><span>Multi-agent planning, implementation and review</span></a><a href="/work/algorithm-lab/"><strong>Algorithm Lab</strong><span>Numerical computing, optimization and transport</span></a><a href="/work/parse-platform/"><strong>Parse Platform</strong><span>React, Express, Parse Server and MongoDB</span></a><a href="/work/memelife/"><strong>MemeLife</strong><span>Original mobile merge game in development</span></a><a href="/work/photo-cleaner/"><strong>Photo Cleaner</strong><span>Privacy-minded mobile photo review prototype</span></a><a href="/work/speech-emotion-research/"><strong>Speech emotion research</strong><span>Conformers and pretrained audio representations</span></a></div>
      <p class="source-note">Personal code, Kado-owned products and work performed for employers are identified separately on their respective project pages.</p>
    </section>
  </div>
</div></section>
<section class="section cta-band no-print"><div class="wrap"><p class="eyebrow">THE NEXT CONVERSATION</p><h2>Interested in working together?</h2><p>For consulting, development projects or a professional connection, reach out directly.</p><div class="btn-row"><a class="btn" href="/contact">Contact Kado Digital</a><a class="btn btn--ghost" href="https://www.linkedin.com/in/mobina-saffari/" target="_blank" rel="noopener noreferrer">Connect on LinkedIn</a></div></div></section>
'''
    return shell('Mobina Saffari | Cloud, Full-stack & AI Engineer — Resume', 'Professional resume of Mobina Saffari, cloud administrator, full-stack developer, graduate AI researcher and founder of Kado Digital LLC.', '/resume', body, current='/resume', social='/assets/founder-orange-avatar.png')

def sync_shared_shell():
    """Keep nav/footer identical across hand-authored root pages.

    index.html is the source of truth for shared site chrome. This is executed
    locally before each release; generated files are committed and deployed as-is.
    """
    for name, active in [
        ('about.html', '/about'),
        ('projects.html', '/projects'),
        ('professional-websites.html', '/professional-websites'),
        ('contact.html', '/contact'),
        ('404.html', None),
    ]:
        file = ROOT/name
        content = file.read_text()
        header = strip_current(HEADER)
        if active:
            header = header.replace(f'href="{active}"', f'href="{active}" aria-current="page"', 1)
        content = re.sub(r'<header class="site-header".*?</header>', lambda _: header, content, count=1, flags=re.S)
        content = re.sub(r'<footer class="site-footer".*?</footer>', lambda _: FOOTER, content, count=1, flags=re.S)
        file.write_text(content)

def sitemap():
    paths=['/','/about','/projects','/professional-websites','/resume','/contact'] + [f'/work/{p["slug"]}/' for p in DATA]
    rows='\n'.join(f'  <url><loc>{xml_escape(BASE + p)}</loc></url>' for p in paths)
    (ROOT/'sitemap.xml').write_text('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+rows+'\n</urlset>\n')
    (ROOT/'robots.txt').write_text('User-agent: *\nAllow: /\n\nSitemap: '+BASE+'/sitemap.xml\n')

if __name__ == '__main__':
    sync_shared_shell()
    ids=set()
    for project in DATA:
        if project['id'] in ids: raise ValueError('Duplicate project id')
        ids.add(project['id'])
        target=ROOT/'work'/project['slug']/'index.html'
        target.parent.mkdir(parents=True,exist_ok=True)
        target.write_text(case_study(project))
    (ROOT/'resume.html').write_text(resume())
    sitemap()
    print(f'Generated {len(DATA)} case-study routes, founder resume and sitemap')
