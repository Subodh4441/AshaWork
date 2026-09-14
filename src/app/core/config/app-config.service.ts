import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface AppConfig {
  apiUrl: string;
  translationApiUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {
  private readonly platformId = inject(PLATFORM_ID);

  private config: AppConfig = {
    apiUrl: 'https://localhost:7204/api',
    translationApiUrl: 'https://localhost:7204/api/translations'
  };

  async load(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    try {
      const response = await fetch('assets/config/config.json');
      if (response.ok) {
        this.config = await response.json();
      }
    } catch (error) {
      console.warn('Unable to load application configuration, using defaults:', error);
    }
  }

  get apiUrl(): string {
    return this.config.apiUrl;
  }

  get translationApiUrl(): string {
    return this.config.translationApiUrl;
  }
}
