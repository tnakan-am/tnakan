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
    provideAppInitializer(() => {
      const translate = inject(TranslateService);
      translate.setFallbackLang('hy');
      return firstValueFrom(translate.use(localStorage.getItem('lang') ?? 'hy'));
    }),
  ],
};
