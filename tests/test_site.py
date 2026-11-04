"""Zero-dependency release smoke tests for the static Kado website."""
import json
import re
import unittest
from pathlib import Path
from urllib.parse import urlsplit
from xml.etree import ElementTree

ROOT = Path(__file__).resolve().parents[1]
PAGES = ['index.html', 'about.html', 'projects.html', 'professional-websites.html', 'resume.html', 'contact.html', '404.html']
P = json.loads((ROOT/'data/projects.json').read_text())

def resolve_route(path):
    if path == '/': return ROOT/'index.html'
    relative = path.lstrip('/')
    candidate = ROOT/relative
    if candidate.is_file(): return candidate
    if candidate.is_dir() and (candidate/'index.html').is_file(): return candidate/'index.html'
    if (ROOT/(relative+'.html')).is_file(): return ROOT/(relative+'.html')
    return candidate

class SiteReleaseTests(unittest.TestCase):
    def test_main_pages_exist_and_have_metadata(self):
        for name in PAGES:
            with self.subTest(name=name):
                content=(ROOT/name).read_text()
                self.assertIn('<!doctype html>',content.lower())
                self.assertIn('<main id="main"',content)
                self.assertIn('rel="canonical"',content)
                self.assertIn('data-nav-toggle',content)
                self.assertIn('href="/resume"',content)
                self.assertIn('kado-cat-logo.png',content)

    def test_clean_routes_exist(self):
        for path in ['/','/about','/projects','/professional-websites','/resume','/contact','/work/memelife/','/work/algorithm-lab/']:
            with self.subTest(route=path): self.assertTrue(resolve_route(path).is_file())

    def test_local_assets_and_routes_resolve(self):
        all_html = list(ROOT.glob('*.html'))+list((ROOT/'work').glob('*/index.html'))
        for page in all_html:
            markup=page.read_text()
            # All internal href/src including static assets resolve on Cloudflare Pages.
            for link in re.findall(r'(?:href|src)="([^"]+)"',markup):
                if link.startswith(('mailto:','https:','http:','#','data:','javascript:')): continue
                path = urlsplit(link).path
                if not path: continue
                if not path.startswith('/'): self.fail(f'Relative path in {page.relative_to(ROOT)}: {link}')
                self.assertTrue(resolve_route(path).is_file(),f'Missing {link} from {page.relative_to(ROOT)}')

    def test_catalogue_integrity(self):
        ids=[p['id'] for p in P]
        self.assertEqual(len(ids),len(set(ids)))
        for p in P:
            self.assertIn(p['status'],['dev','live','exp','oss','pro'])
            self.assertIn(p['owner'],['kado','personal','professional'])
            self.assertTrue(p['summary'] and p['story'] and p['outcome'])
            self.assertTrue(resolve_route(p['projectUrl']).exists())
            self.assertIn(p['title'],resolve_route(p['projectUrl']).read_text())
            for l in p['links']:
                self.assertTrue(l['href'].startswith('https://') or l['href'].startswith('/'))
            if p['owner']=='professional': self.assertIn('not Kado',p['story']+' '+p['outcome']+' '+p['summary'])
            if p['id'] in ['memelife','photo-cleaner']:
                self.assertEqual(p['status'],'dev')

    def test_resume(self):
        content=(ROOT/'resume.html').read_text()
        for phrase in ['Kado Digital LLC','YAS Networks','NopaYar','Conformers','Abrar University','AWS Certified','/assets/mobina-saffari-resume.pdf']:
            self.assertIn(phrase,content)
        self.assertGreater((ROOT/'assets/mobina-saffari-resume.pdf').stat().st_size,2000)

    def test_sitemap(self):
        xml=ElementTree.parse(ROOT/'sitemap.xml')
        urls=[t.text for t in xml.findall('.//{http://www.sitemaps.org/schemas/sitemap/0.9}loc')]
        self.assertEqual(len(urls),6+len(P))
        self.assertIn('https://kado-digital-website.pages.dev/resume',urls)
        self.assertIn('https://kado-digital-website.pages.dev/work/photo-cleaner/',urls)

    def test_no_obsolete_placeholders(self):
        for page in ROOT.glob('*.html'):
            content=page.read_text()
            self.assertNotIn('YOUR-DOMAIN',content)
            self.assertNotIn('TODO after you have a domain',content)
            self.assertNotIn('Add the logo file at assets',content)
        self.assertFalse((ROOT/'sitemap.template.xml').exists())

    def test_project_images_exist(self):
        for p in P:
            if p.get('image'):self.assertTrue(resolve_route(p['image']).is_file())
            for g in p.get('gallery',[]):self.assertTrue(resolve_route(g['image']).is_file())

if __name__=='__main__':unittest.main()
