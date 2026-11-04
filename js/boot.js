/** Add the progressive-enhancement class before CSS can flash a different layout. */
((root) => {
  'use strict';
  root.classList.add('js');
  try {
    if (root.hasAttribute('data-cinematic') &&
        matchMedia('(min-width: 900px) and (min-height: 560px)').matches &&
        !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      root.classList.add('js-cinematic');
    }
  } catch (_) { /* The readable, non-cinematic layout is always the fallback. */ }
})(document.documentElement);
