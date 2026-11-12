import { APP_BASE_HREF, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from '../src/app/app.component';
import { appConfig } from '../src/app/app.config';
import { languageAtLocation } from '../src/app/i18n/content-urls';
import { languageFromUrl } from '../src/app/i18n/languages';
import { AVAILABLE_LANGUAGES } from '../src/app/i18n/available-languages.generated';

const url = new URL(window.location.href);
if (!url.hash) {
  let preferred = 'en';
  try { preferred = localStorage.getItem('ih_extension_language') || preferred; } catch { /* Use English. */ }
  const requested = languageFromUrl(url.searchParams.get('lang') || preferred);
  url.hash = '/?lang=' + (AVAILABLE_LANGUAGES.includes(requested) ? requested : 'en');
}
url.searchParams.set('lang', languageAtLocation(url));
window.history.replaceState(window.history.state, '', url);

function externalUrl(link: HTMLAnchorElement): string | null {
  const href = link.getAttribute('href');
  if (!href) return null;
  const destination = new URL(href, document.baseURI);
  return ['http:', 'https:', 'mailto:', 'tel:'].includes(destination.protocol) ? destination.href : null;
}

// Keep external citations and book metadata, without opening network destinations.
function preventExternalNavigation(event: Event): void {
  const link = (event.target as Element | null)?.closest<HTMLAnchorElement>('a');
  if (link && externalUrl(link)) {
    event.preventDefault();
    event.stopImmediatePropagation();
  }
}
document.addEventListener('click', preventExternalNavigation, true);
document.addEventListener('auxclick', preventExternalNavigation, true);

new MutationObserver(() => {
  for (const link of document.querySelectorAll<HTMLAnchorElement>('a[href]')) {
    const href = externalUrl(link);
    if (!href) continue;
    link.dataset['offlineUrl'] = href;
    link.title = href;
    link.removeAttribute('href');
    link.removeAttribute('target');
    link.setAttribute('aria-disabled', 'true');
    link.classList.add('offline-external-link');
    if (link.closest('.article-body-part, .blog-body')) {
      const reference = document.createElement('span');
      reference.className = 'offline-source-url';
      reference.textContent = ` (${href})`;
      link.after(reference);
    }
  }
}).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['href'] });

bootstrapApplication(AppComponent, {
  providers: [
    ...appConfig.providers,
    { provide: APP_BASE_HREF, useValue: '' },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
  ],
}).catch(error => console.error(error));
