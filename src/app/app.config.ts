import { ApplicationConfig, inject, provideAppInitializer, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { LOCALE_ID } from '@angular/core';
import { UrlSerializer, provideRouter, withInMemoryScrolling, withRouterConfig } from '@angular/router';
import { routes } from './app.routes';
import { LocaleService } from './i18n/locale.service';
import { LocalizedUrlSerializer } from './i18n/localized-url-serializer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withInMemoryScrolling({
      anchorScrolling: 'enabled',
      scrollPositionRestoration: 'enabled'
    }), withRouterConfig({ defaultQueryParamsHandling: 'merge' })),
    provideHttpClient(),
    { provide: UrlSerializer, useClass: LocalizedUrlSerializer },
    provideAppInitializer(() => inject(LocaleService).load()),
    { provide: LOCALE_ID, useFactory: () => inject(LocaleService).language },
  ],
};
