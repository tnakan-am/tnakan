import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';

import { routes } from './app.routes';
import { FALLBACK_LANG } from './shared/i18n/languages';
import { apiInterceptor } from './shared/http/api.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([apiInterceptor])),
    provideTranslateService({
      loader: provideTranslateHttpLoader({ prefix: './assets/i18n/', suffix: '.json' }),
    }),
    // Activating the language from a component constructor races the first render: the
    // translate pipe evaluates while the bundle is still loading, caches the empty result
    // and never re-renders. Resolving it here blocks bootstrap until the strings exist.
    // A stored language that no longer ships (an older build used other codes) must not
    // take the app down with it, so fall back rather than letting bootstrap reject.
    provideAppInitializer(async () => {
      const translate = inject(TranslateService);
      translate.setFallbackLang(FALLBACK_LANG);
      const stored = localStorage.getItem('lang');
      try {
        await firstValueFrom(translate.use(stored ?? FALLBACK_LANG));
      } catch {
        localStorage.removeItem('lang');
        await firstValueFrom(translate.use(FALLBACK_LANG)).catch(() => undefined);
      }
    }),
  ],
};
