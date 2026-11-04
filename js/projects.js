/**
 * Kado Digital — project catalogue
 *
 * The only content source is /data/projects.json. This module renders cards on the
 * homepage and the filterable projects index; static detail pages are generated
 * from the same data by scripts/build_site.py. No framework or remote API.
 */
(() => {
  'use strict';

  const DATA_URL = '/data/projects.json';
  const GROUPS = [
    ['all', 'All work'], ['games', 'Games'], ['mobile', 'Mobile apps'],
    ['web', 'Web experiences'], ['devtools', 'Developer tools'],
    ['ai', 'AI / research'], ['cloud', 'Cloud / full-stack']
  ];
  const OWNER = {
    kado: 'Kado Digital product', personal: 'Independent / personal work',
    professional: 'Professional employment experience'
  };
  const STATUS = {
    dev: 'In development', live: 'Public website',
    exp: 'Research / prototype', oss: 'Public code',
    pro: 'Experience summary'
  };
  const html = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);
  const safeLink = (value) => {
    if (!value) return '';
    if (/^https:\/\//i.test(value) || /^\/(?!\/)/.test(value)) return value;
    return '';
  };

  function artwork(project) {
    if (project.image) {
      return `<img src="${html(project.image)}" alt="${html(project.imageAlt || project.title)}" loading="lazy" decoding="async" width="800" height="520">`;
    }
    if (project.art === 'merge') {
      return `<div class="thumb__merge" aria-hidden="true">${Array.from({length: 20}, (_, i) => `<span class="${[2, 7, 8, 13, 18].includes(i) ? 'hot' : [3, 12, 17, 19].includes(i) ? 'warm' : ''}"></span>`).join('')}</div>`;
    }
    if (project.art === 'swipe') {
      return '<div class="thumb__swipe" aria-hidden="true"><span></span><span></span></div>';
    }
    if (project.art === 'cinema') {
      return '<div class="thumb__cinema" aria-hidden="true"><span></span><span></span><span></span></div>';
    }
    if (project.art === 'code') {
      return '<div class="thumb__code" aria-hidden="true"><span></span><span></span><span></span><span></span><span></span></div>';
    }
    return '<div class="thumb__glyph" aria-hidden="true"><span>◆</span><i></i><i></i></div>';
  }

  function card(project, featured) {
    const status = STATUS[project.status] ?? 'Project';
    const owner = OWNER[project.owner] ?? 'Project';
    const heading = featured ? 'h3' : 'h2';
    const source = (project.links || []).find((link) => safeLink(link.href));
    return `
      <article class="work" id="work-${html(project.id)}">
        <div class="work__inner">
          <a class="thumb thumb--linked" href="${html(project.projectUrl)}" aria-label="Explore ${html(project.title)}">
            ${artwork(project)}
          </a>
          <div class="work__body">
            <div class="work__meta">
              <span class="chip chip--status-${html(project.status)}">${html(status)}</span>
              <span class="chip chip--owner ${project.owner === 'kado' ? 'chip--kado' : ''}">${html(owner)}</span>
            </div>
            <${heading}><a class="work__title-link" href="${html(project.projectUrl)}">${html(project.title)}</a></${heading}>
            <p>${html(project.summary)}</p>
            ${featured ? '' : `<p class="work__tech">${html(project.tech.join(' · '))}</p>`}
            <div class="work__links">
              <a class="text-link" href="${html(project.projectUrl)}">Explore project</a>
              ${source && !featured ? `<a class="text-link" href="${html(source.href)}" ${source.external ? 'target="_blank" rel="noopener noreferrer"' : ''}>${html(source.label)}${source.external ? '<span class="visually-hidden"> (opens in a new tab)</span>' : ''}</a>` : ''}
            </div>
          </div>
        </div>
      </article>`;
  }

  function setFailure() {
    document.querySelectorAll('[data-featured-work], [data-project-panel]').forEach((container) => {
      container.innerHTML = '<p class="lead">The project list could not load. <a class="text-link" href="https://github.com/kado-digital">Explore the Kado Digital GitHub organization instead</a>.</p>';
      container.removeAttribute('aria-busy');
    });
  }

  function renderFeatured(projects) {
    const target = document.querySelector('[data-featured-work]');
    if (!target) return;
    target.innerHTML = projects.filter((project) => project.featured).map((project) => card(project, true)).join('');
    target.removeAttribute('aria-busy');
  }

  function renderProjects(projects) {
    const tabs = document.querySelector('[data-project-tabs]');
    const panel = document.querySelector('[data-project-panel]');
    const status = document.querySelector('[data-project-status]');
    if (!tabs || !panel) return;

    tabs.innerHTML = GROUPS.map(([id, label]) =>
      `<button type="button" class="tab" role="tab" id="tab-${id}" data-cat="${id}" aria-controls="project-panel" aria-selected="false" tabindex="-1">${label}</button>`
    ).join('');
    const buttons = Array.from(tabs.querySelectorAll('[role="tab"]'));
    const known = GROUPS.map(([id]) => id);

    function show(category, updateHash = true) {
      const chosen = known.includes(category) ? category : 'all';
      buttons.forEach((tab) => {
        const selected = tab.dataset.cat === chosen;
        tab.setAttribute('aria-selected', String(selected));
        tab.tabIndex = selected ? 0 : -1;
      });
      panel.setAttribute('aria-labelledby', `tab-${chosen}`);
      const filtered = projects.filter((project) => chosen === 'all' || project.categories.includes(chosen));
      panel.innerHTML = `<div class="work-grid">${filtered.map((project) => card(project, false)).join('')}</div>`;
      if (status) status.textContent = `Showing ${filtered.length} of ${projects.length} projects${chosen === 'all' ? '.' : ' in ' + GROUPS.find(([id]) => id === chosen)[1] + '.'}`;
      panel.removeAttribute('aria-busy');
      if (updateHash) {
        const suffix = chosen === 'all' ? '' : `#${chosen}`;
        history.replaceState(null, '', location.pathname + location.search + suffix);
      }
    }
    tabs.addEventListener('click', (event) => {
      const button = event.target.closest('[role="tab"]');
      if (button) show(button.dataset.cat);
    });
    tabs.addEventListener('keydown', (event) => {
      const current = buttons.indexOf(document.activeElement);
      if (current < 0) return;
      let next = current;
      if (event.key === 'ArrowRight') next = (current + 1) % buttons.length;
      else if (event.key === 'ArrowLeft') next = (current + buttons.length - 1) % buttons.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = buttons.length - 1;
      else return;
      event.preventDefault();
      buttons[next].focus();
      show(buttons[next].dataset.cat);
    });
    function fromLocation() {
      const anchor = decodeURIComponent(location.hash.slice(1));
      // Legacy #work-project links remain valid when shared or bookmarked.
      show(known.includes(anchor) ? anchor : 'all', false);
      if (anchor.startsWith('work-')) {
        requestAnimationFrame(() => document.getElementById(anchor)?.scrollIntoView({block: 'start'}));
      }
    }
    window.addEventListener('hashchange', fromLocation);
    window.addEventListener('popstate', fromLocation);
    fromLocation();
  }

  async function init() {
    if (!document.querySelector('[data-featured-work], [data-project-tabs]')) return;
    try {
      const response = await fetch(DATA_URL, {cache: 'no-cache'});
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const projects = await response.json();
      if (!Array.isArray(projects)) throw new Error('Invalid catalogue');
      renderFeatured(projects);
      renderProjects(projects);
    } catch (error) {
      console.warn('Kado catalogue load failed:', error);
      setFailure();
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
