import {
  Injectable,
  PLATFORM_ID,
  inject,
  signal
} from '@angular/core';

import { isPlatformBrowser } from '@angular/common';
import { GoogleTranslateService } from './google-translate.service';
import { en } from '../i18n/en';
import { mr } from '../i18n/mr';

export type Language = 'en' | 'mr';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly googleTranslateService = inject(GoogleTranslateService);

  // ============================================================
  // CURRENT LANGUAGE
  // ============================================================
  currentLanguage = signal<Language>('en');

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const savedLanguage = localStorage.getItem('asha-language');
      if (savedLanguage === 'en' || savedLanguage === 'mr') {
        this.currentLanguage.set(savedLanguage);
      }
      this.googleTranslateService.init();
    }
  }

  // ============================================================
  // TRANSLATE
  // Returns translation based on current language.
  // Instant and native switching for all UI strings.
  // ============================================================
  translate(key: string): string {
    const dict = this.currentLanguage() === 'mr' ? mr : en;
    if (dict && dict[key]) {
      return dict[key];
    }
    if (en && en[key]) {
      return en[key];
    }
    const parts = key.split('.');
    return parts[parts.length - 1];
  }

  // ============================================================
  // TOGGLE LANGUAGE
  // ============================================================
  async toggleLanguage(): Promise<void> {
    const newLanguage: Language =
      this.currentLanguage() === 'en' ? 'mr' : 'en';

    await this.setLanguage(newLanguage);
  }

  // ============================================================
  // SET LANGUAGE
  // ============================================================
  async setLanguage(language: Language): Promise<void> {
    this.currentLanguage.set(language);

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('asha-language', language);
      this.googleTranslateService.setLanguage(language);
    }
  }

  async loadTranslations(): Promise<void> {
    // Dynamic translations handled natively
  }
}
