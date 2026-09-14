import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

declare global {
  interface Window {
    google: any;
    googleTranslateElementInit: () => void;
  }
}

@Injectable({
  providedIn: 'root'
})
export class GoogleTranslateService {
  private readonly platformId = inject(PLATFORM_ID);
  private initialized = false;

  init(): void {
    if (!isPlatformBrowser(this.platformId) || this.initialized) {
      return;
    }

    this.initialized = true;

    // Define callback
    window.googleTranslateElementInit = () => {
      if (window.google?.translate?.TranslateElement) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: 'en,mr',
            autoDisplay: false
          },
          'google_translate_element'
        );

        // Apply saved language if Marathi
        const savedLang = localStorage.getItem('asha-language');
        if (savedLang === 'mr') {
          setTimeout(() => this.applyLanguageToSelect('mr'), 300);
        }
      }
    };

    // Inject Google Translate script if not present
    const existingScript = document.getElementById('google-translate-script');
    if (!existingScript) {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.type = 'text/javascript';
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    }
  }

  setLanguage(lang: 'en' | 'mr'): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    localStorage.setItem('asha-language', lang);

    // Set Google Translate cookie
    const cookieVal = lang === 'mr' ? '/en/mr' : '/en/en';
    const host = window.location.hostname;
    document.cookie = `googtrans=${cookieVal}; path=/;`;
    document.cookie = `googtrans=${cookieVal}; path=/; domain=${host};`;

    this.applyLanguageToSelect(lang);
  }

  private applyLanguageToSelect(lang: string, attempts = 0): void {
    const select = document.querySelector<HTMLSelectElement>('.goog-te-combo');
    if (select) {
      select.value = lang;
      select.dispatchEvent(new Event('change'));
    } else if (attempts < 10) {
      setTimeout(() => this.applyLanguageToSelect(lang, attempts + 1), 250);
    }
  }
}
