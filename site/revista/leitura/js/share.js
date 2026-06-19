'use strict';

import { CONFIG, ARTICLE_SLUGS } from './config.js';
import { getPage } from './flip-controller.js';
import { el } from './dom.js';

function findSlugForPage(pageIndex) {
  let best = null;
  for (const [slug, page] of Object.entries(ARTICLE_SLUGS)) {
    const p = page - 1;
    if (p <= pageIndex && (best == null || p > best.page)) {
      best = { slug, page: p };
    }
  }
  return best && best.slug;
}

function buildShareUrl() {
  if (CONFIG.READER_CONTEXT === 'biblioteca' && CONFIG.DOC_SLUG) {
    const url = new URL('/biblioteca/documento/', location.origin);
    url.searchParams.set('slug', CONFIG.DOC_SLUG);
    const page = getPage();
    if (page > 0) url.searchParams.set('page', String(page + 1));
    return url.toString();
  }

  const url = new URL(location.href);
  url.searchParams.delete('pdf');
  url.searchParams.delete('title');
  const page = getPage();
  const slug = findSlugForPage(page);
  if (slug) {
    url.searchParams.set('artigo', slug);
    url.searchParams.delete('page');
  } else if (page > 0) {
    url.searchParams.set('page', String(page + 1));
    url.searchParams.delete('artigo');
  }
  return url.toString();
}

function showCopied() {
  if (!el.shareBtn) return;
  const prev = el.shareBtn.textContent;
  el.shareBtn.textContent = 'Link copiado!';
  setTimeout(() => {
    el.shareBtn.textContent = prev;
  }, 1800);
}

export function initShare() {
  if (!el.shareBtn || CONFIG.ALLOW_SHARE === false) {
    if (el.shareBtn) el.shareBtn.style.display = 'none';
    return;
  }

  el.shareBtn.addEventListener('click', async () => {
    const link = buildShareUrl();
    const title = CONFIG.MAGAZINE.name || 'Revista IRC';
    try {
      if (navigator.share) {
        await navigator.share({ title, url: link });
        return;
      }
    } catch {
      /* cancel or unsupported */
    }
    try {
      await navigator.clipboard.writeText(link);
      showCopied();
    } catch {
      window.prompt('Copie o link:', link);
    }
  });
}
