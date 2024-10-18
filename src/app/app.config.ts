import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
// Import the functions you need from the SDKs you need
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getAnalytics, provideAnalytics } from '@angular/fire/analytics';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { getDatabase, provideDatabase } from '@angular/fire/database';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: 'AIzaSyDpqUID1YysYu9XXu5CV5qeY4mubpKTSrw',
  authDomain: 'tnakan-23490.firebaseapp.com',
  projectId: 'tnakan-23490',
  storageBucket: 'tnakan-23490.appspot.com',
  messagingSenderId: '1007308841602',
  appId: '1:1007308841602:web:ec348bfd2e4f10b494ca9b',
  measurementId: 'G-F0TX8P6RQ8',
  databaseURL: 'https://tnakan-23490-default-rtdb.europe-west1.firebasedatabase.app', // Update this line
};

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore()),
    provideAnalytics(() => getAnalytics()),
    provideAuth(() => getAuth()),
    importProvidersFrom(HttpClientModule), // or provideHttpClient() in Angular v15
    importProvidersFrom(
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: createTranslateLoader,
          deps: [HttpClient],
        },
      })
    ),
    provideStorage(() => getStorage()),
    provideDatabase(() => getDatabase()),
    // provideFunctions(() => getFunctions()),
    // provideMessaging(() => getMessaging()),
    // providePerformance(() => getPerformance()),
  ],
};
