import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { AppConfigService } from '../config/app-config.service';
import {
  TranslationResponse,
  BatchTranslationResponse
} from '../models/translation.model';
import { HomeVisit } from '../models/home-visit.model';
import { FamilyRecord } from '../models/family-record.model';
import { SurveyEntry } from '../models/survey-entry.model';
import { PregnancyRecord } from '../models/pregnancy-record.model';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(AppConfigService);
  private readonly platformId = inject(PLATFORM_ID);

  // Standard ASHA & Healthcare vocabulary (bidirectional)
  private readonly enToMrDictionary: Record<string, string> = {
    // Visit types
    'Immunisation': 'लसीकरण',
    'Antenatal check': 'प्रसूतीपूर्व तपासणी',
    'Postnatal check': 'प्रसूतीनंतरची तपासणी',
    'General health': 'सामान्य आरोग्य',
    'Nutrition follow-up': 'पोषण पाठपुरावा',

    // Survey types
    'Nutrition': 'पोषण',
    'Family planning': 'कुटुंब नियोजन',
    'Child health': 'बाल आरोग्य',
    'Maternal health': 'माता आरोग्य',

    // Common indicators
    'High risk': 'उच्च जोखीम',
    'Normal risk': 'सामान्य',
    'Yes': 'होय',
    'No': 'नाही'
  };

  private readonly mrToEnDictionary: Record<string, string> = {};

  constructor() {
    // Build reverse dictionary
    for (const [en, mr] of Object.entries(this.enToMrDictionary)) {
      this.mrToEnDictionary[mr] = en;
    }
  }

  hasDevanagari(text: string): boolean {
    return /[\u0900-\u097F]/.test(text);
  }

  private getCacheKey(text: string, src: string, target: string): string {
    return `asha_trans_${src}_${target}_${text.trim()}`;
  }

  private cacheTranslation(text: string, src: string, target: string, translated: string): void {
    if (isPlatformBrowser(this.platformId)) {
      try {
        localStorage.setItem(this.getCacheKey(text, src, target), translated);
      } catch {
        // Ignore quota exceptions
      }
    }
  }

  async translate(
    text: string,
    sourceLanguage = 'en',
    targetLanguage = 'mr'
  ): Promise<string> {
    if (!text?.trim()) {
      return '';
    }

    const trimmed = text.trim();

    if (sourceLanguage === targetLanguage) {
      return trimmed;
    }

    // Check pre-configured dictionaries first
    if (sourceLanguage === 'en' && targetLanguage === 'mr' && this.enToMrDictionary[trimmed]) {
      return this.enToMrDictionary[trimmed];
    }
    if (sourceLanguage === 'mr' && targetLanguage === 'en' && this.mrToEnDictionary[trimmed]) {
      return this.mrToEnDictionary[trimmed];
    }

    if (isPlatformBrowser(this.platformId)) {
      const cached = localStorage.getItem(this.getCacheKey(trimmed, sourceLanguage, targetLanguage));
      if (cached) {
        return cached;
      }
    }

    // 1. Attempt configured backend translation API if reachable
    try {
      if (this.config.translationApiUrl) {
        const response = await firstValueFrom(
          this.http.post<TranslationResponse>(
            this.config.translationApiUrl,
            { text: trimmed, sourceLanguage, targetLanguage }
          )
        );
        if (response?.text) {
          this.cacheTranslation(trimmed, sourceLanguage, targetLanguage, response.text);
          return response.text;
        }
      }
    } catch {
      // Backend not running, proceed to free AI translation
    }

    // 2. Free AI translation via MyMemory API
    try {
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(trimmed)}&langpair=${sourceLanguage}|${targetLanguage}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        const translated = data?.responseData?.translatedText;
        if (translated && !translated.startsWith('MYMEMORY WARNING:')) {
          this.cacheTranslation(trimmed, sourceLanguage, targetLanguage, translated);
          return translated;
        }
      }
    } catch (error) {
      console.warn('Free translation fallback failed:', error);
    }

    return trimmed;
  }

  // Ensures text is strictly in English before database storage
  async ensureEnglish(text: string): Promise<string> {
    if (!text?.trim()) {
      return '';
    }
    const trimmed = text.trim();

    // Check if in reverse dictionary
    if (this.mrToEnDictionary[trimmed]) {
      return this.mrToEnDictionary[trimmed];
    }

    // If it contains Marathi/Devanagari characters, translate to English
    if (this.hasDevanagari(trimmed)) {
      return await this.translate(trimmed, 'mr', 'en');
    }

    return trimmed;
  }

  // Translates English text to Marathi for UI display
  async ensureMarathi(text: string): Promise<string> {
    if (!text?.trim()) {
      return '';
    }
    const trimmed = text.trim();

    if (this.enToMrDictionary[trimmed]) {
      return this.enToMrDictionary[trimmed];
    }

    if (this.hasDevanagari(trimmed)) {
      return trimmed;
    }

    return await this.translate(trimmed, 'en', 'mr');
  }

  ensureMarathiSync(text: string): string {
    if (!text) return '';
    const trimmed = text.trim();
    return this.enToMrDictionary[trimmed] || trimmed;
  }

  ensureEnglishSync(text: string): string {
    if (!text) return '';
    const trimmed = text.trim();
    return this.mrToEnDictionary[trimmed] || trimmed;
  }

  // -------------------------------------------------------------
  // RECORD LEVEL TRANSLATIONS (FOR DISPLAY IN MARATHI)
  // -------------------------------------------------------------

  async translateVisitToMarathi(v: HomeVisit): Promise<HomeVisit> {
    const [village, familyName, visitType, notes, ashaName] = await Promise.all([
      this.ensureMarathi(v.village),
      this.ensureMarathi(v.familyName),
      this.ensureMarathi(v.visitType),
      this.ensureMarathi(v.notes),
      this.ensureMarathi(v.ashaName)
    ]);

    return {
      ...v,
      village,
      familyName,
      visitType,
      notes,
      ashaName
    };
  }

  async translateFamilyToMarathi(f: FamilyRecord): Promise<FamilyRecord> {
    const [familyName, headOfFamily, village, address] = await Promise.all([
      this.ensureMarathi(f.familyName),
      this.ensureMarathi(f.headOfFamily),
      this.ensureMarathi(f.village),
      this.ensureMarathi(f.address)
    ]);

    return {
      ...f,
      familyName,
      headOfFamily,
      village,
      address
    };
  }

  async translateSurveyToMarathi(s: SurveyEntry): Promise<SurveyEntry> {
    const [surveyType, familyName, findings] = await Promise.all([
      this.ensureMarathi(s.surveyType),
      this.ensureMarathi(s.familyName),
      this.ensureMarathi(s.findings)
    ]);

    return {
      ...s,
      surveyType,
      familyName,
      findings
    };
  }

  async translatePregnancyToMarathi(p: PregnancyRecord): Promise<PregnancyRecord> {
    const [name, husbandName, village] = await Promise.all([
      this.ensureMarathi(p.name),
      this.ensureMarathi(p.husbandName),
      this.ensureMarathi(p.village)
    ]);

    return {
      ...p,
      name,
      husbandName,
      village
    };
  }

  async translateBatch(
    texts: string[],
    sourceLanguage = 'en',
    targetLanguage = 'mr'
  ): Promise<Record<string, string>> {
    if (!texts.length) {
      return {};
    }

    const result: Record<string, string> = {};
    for (const text of texts) {
      result[text] = await this.translate(text, sourceLanguage, targetLanguage);
    }

    return result;
  }
}
