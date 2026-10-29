import {
  ApplicationConfig,
  LOCALE_ID,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection
} from '@angular/core';
import { registerLocaleData } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import localeFrCa from '@angular/common/locales/fr-CA';

// Nombres affichés à la française : 3,5 et 1 000
registerLocaleData(localeFrCa);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(),
    { provide: LOCALE_ID, useValue: 'fr-CA' }
  ]
};
