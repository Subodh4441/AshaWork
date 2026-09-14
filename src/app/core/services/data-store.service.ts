import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HomeVisit, CreateHomeVisitRequest } from '../models/home-visit.model';
import { FamilyRecord } from '../models/family-record.model';
import { SurveyEntry } from '../models/survey-entry.model';
import { PregnancyRecord } from '../models/pregnancy-record.model';
import { TranslationService } from './translation-service';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class DataStoreService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly translationService = inject(TranslationService);
  private readonly apiService = inject(ApiService);

  // Storage keys for offline-first persistent database
  private readonly VISITS_KEY = 'asha_db_visits';
  private readonly FAMILIES_KEY = 'asha_db_families';
  private readonly SURVEYS_KEY = 'asha_db_surveys';
  private readonly PREGNANCIES_KEY = 'asha_db_pregnancies';

  // Master signals (ALWAYS strictly stored in English)
  readonly homeVisits = signal<HomeVisit[]>([]);
  readonly families = signal<FamilyRecord[]>([]);
  readonly surveys = signal<SurveyEntry[]>([]);
  readonly pregnancies = signal<PregnancyRecord[]>([]);

  constructor() {
    this.initDatabase();
  }

  private initDatabase(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    // Load or seed Home Visits
    const savedVisits = localStorage.getItem(this.VISITS_KEY);
    if (savedVisits) {
      try {
        this.homeVisits.set(JSON.parse(savedVisits));
      } catch {
        this.seedVisits();
      }
    } else {
      this.seedVisits();
    }

    // Load or seed Families
    const savedFamilies = localStorage.getItem(this.FAMILIES_KEY);
    if (savedFamilies) {
      try {
        this.families.set(JSON.parse(savedFamilies));
      } catch {
        this.seedFamilies();
      }
    } else {
      this.seedFamilies();
    }

    // Load or seed Surveys
    const savedSurveys = localStorage.getItem(this.SURVEYS_KEY);
    if (savedSurveys) {
      try {
        this.surveys.set(JSON.parse(savedSurveys));
      } catch {
        this.seedSurveys();
      }
    } else {
      this.seedSurveys();
    }

    // Load or seed Pregnancies
    const savedPregnancies = localStorage.getItem(this.PREGNANCIES_KEY);
    if (savedPregnancies) {
      try {
        this.pregnancies.set(JSON.parse(savedPregnancies));
      } catch {
        this.seedPregnancies();
      }
    } else {
      this.seedPregnancies();
    }
  }

  // -------------------------------------------------------------
  // SEED DATA (Clean English defaults)
  // -------------------------------------------------------------
  private seedVisits(): void {
    const defaultVisits: HomeVisit[] = [
      {
        id: 1,
        visitDate: '2026-09-10',
        ashaName: 'Sunita Patil',
        village: 'Pimpalgaon',
        familyName: 'Kulkarni Family',
        visitType: 'Immunisation',
        notes: 'Administered polio and DPT booster.'
      },
      {
        id: 2,
        visitDate: '2026-09-12',
        ashaName: 'Sunita Patil',
        village: 'Shivajinagar',
        familyName: 'Jadhav Family',
        visitType: 'Antenatal check',
        notes: 'BP checked (118/76), iron supplements provided.'
      }
    ];
    this.saveVisits(defaultVisits);
  }

  private seedFamilies(): void {
    const defaultFamilies: FamilyRecord[] = [
      {
        id: 1,
        familyName: 'Kulkarni Family',
        headOfFamily: 'Ramesh Kulkarni',
        village: 'Pimpalgaon',
        address: 'House No 12, Main Road',
        members: 5,
        pregnantWomen: 1,
        childrenUnderFive: 2
      },
      {
        id: 2,
        familyName: 'Jadhav Family',
        headOfFamily: 'Sanjay Jadhav',
        village: 'Shivajinagar',
        address: 'Near Water Tank',
        members: 4,
        pregnantWomen: 0,
        childrenUnderFive: 1
      }
    ];
    this.saveFamilies(defaultFamilies);
  }

  private seedSurveys(): void {
    const defaultSurveys: SurveyEntry[] = [
      {
        id: 1,
        date: '2026-09-08',
        surveyType: 'Nutrition',
        familyName: 'Kulkarni Family',
        findings: 'Under-5 child weight in green zone.'
      },
      {
        id: 2,
        date: '2026-09-11',
        surveyType: 'General health',
        familyName: 'Jadhav Family',
        findings: 'Clean drinking water access verified.'
      }
    ];
    this.saveSurveys(defaultSurveys);
  }

  private seedPregnancies(): void {
    const defaultPregnancies: PregnancyRecord[] = [
      {
        id: 1,
        name: 'Anjali Kulkarni',
        age: 24,
        husbandName: 'Ramesh Kulkarni',
        village: 'Pimpalgaon',
        lmpDate: '2026-04-15',
        ancVisits: 3,
        highRisk: false
      },
      {
        id: 2,
        name: 'Pooja Shinde',
        age: 29,
        husbandName: 'Mahesh Shinde',
        village: 'Shivajinagar',
        lmpDate: '2026-02-10',
        ancVisits: 4,
        highRisk: true
      }
    ];
    this.savePregnancies(defaultPregnancies);
  }

  // -------------------------------------------------------------
  // SAVE METHODS (STRICT ENGLISH PERSISTENCE)
  // -------------------------------------------------------------
  private saveVisits(visits: HomeVisit[]): void {
    this.homeVisits.set(visits);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.VISITS_KEY, JSON.stringify(visits));
    }
  }

  private saveFamilies(families: FamilyRecord[]): void {
    this.families.set(families);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.FAMILIES_KEY, JSON.stringify(families));
    }
  }

  private saveSurveys(surveys: SurveyEntry[]): void {
    this.surveys.set(surveys);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.SURVEYS_KEY, JSON.stringify(surveys));
    }
  }

  private savePregnancies(pregnancies: PregnancyRecord[]): void {
    this.pregnancies.set(pregnancies);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.PREGNANCIES_KEY, JSON.stringify(pregnancies));
    }
  }

  // -------------------------------------------------------------
  // PUBLIC ADD METHODS (CONVERT TO ENGLISH BEFORE SAVING)
  // -------------------------------------------------------------

  async addHomeVisit(draft: {
    visitDate: string;
    ashaName: string;
    village: string;
    familyName: string;
    visitType: string;
    notes: string;
  }): Promise<HomeVisit> {
    // Translate any Marathi text input to English before storing in database
    const [ashaName, village, familyName, visitType, notes] = await Promise.all([
      this.translationService.ensureEnglish(draft.ashaName),
      this.translationService.ensureEnglish(draft.village),
      this.translationService.ensureEnglish(draft.familyName),
      this.translationService.ensureEnglish(draft.visitType),
      this.translationService.ensureEnglish(draft.notes)
    ]);

    const newVisit: HomeVisit = {
      id: Date.now(),
      visitDate: draft.visitDate,
      ashaName,
      village,
      familyName,
      visitType,
      notes
    };

    const updated = [newVisit, ...this.homeVisits()];
    this.saveVisits(updated);

    // Also sync to backend API in English
    const request: CreateHomeVisitRequest = {
      ...newVisit,
      language: 'en'
    };
    this.apiService.createHomeVisit(request).subscribe({
      next: () => console.log('Home visit synced with backend in English'),
      error: () => console.log('Stored in local database in English')
    });

    return newVisit;
  }

  async addFamily(draft: {
    familyName: string;
    headOfFamily: string;
    village: string;
    address: string;
    members: number;
    pregnantWomen: number;
    childrenUnderFive: number;
  }): Promise<FamilyRecord> {
    const [familyName, headOfFamily, village, address] = await Promise.all([
      this.translationService.ensureEnglish(draft.familyName),
      this.translationService.ensureEnglish(draft.headOfFamily),
      this.translationService.ensureEnglish(draft.village),
      this.translationService.ensureEnglish(draft.address)
    ]);

    const newFamily: FamilyRecord = {
      id: Date.now(),
      familyName,
      headOfFamily,
      village,
      address,
      members: Number(draft.members) || 1,
      pregnantWomen: Number(draft.pregnantWomen) || 0,
      childrenUnderFive: Number(draft.childrenUnderFive) || 0
    };

    const updated = [newFamily, ...this.families()];
    this.saveFamilies(updated);
    return newFamily;
  }

  async addSurvey(draft: {
    date: string;
    surveyType: string;
    familyName: string;
    findings: string;
  }): Promise<SurveyEntry> {
    const [surveyType, familyName, findings] = await Promise.all([
      this.translationService.ensureEnglish(draft.surveyType),
      this.translationService.ensureEnglish(draft.familyName),
      this.translationService.ensureEnglish(draft.findings)
    ]);

    const newSurvey: SurveyEntry = {
      id: Date.now(),
      date: draft.date,
      surveyType,
      familyName,
      findings
    };

    const updated = [newSurvey, ...this.surveys()];
    this.saveSurveys(updated);
    return newSurvey;
  }

  async addPregnancy(draft: {
    name: string;
    age: number;
    husbandName: string;
    village: string;
    lmpDate: string;
    ancVisits: number;
    highRisk: boolean;
  }): Promise<PregnancyRecord> {
    const [name, husbandName, village] = await Promise.all([
      this.translationService.ensureEnglish(draft.name),
      this.translationService.ensureEnglish(draft.husbandName),
      this.translationService.ensureEnglish(draft.village)
    ]);

    const newPregnancy: PregnancyRecord = {
      id: Date.now(),
      name,
      age: Number(draft.age) || 18,
      husbandName,
      village,
      lmpDate: draft.lmpDate,
      ancVisits: Number(draft.ancVisits) || 0,
      highRisk: Boolean(draft.highRisk)
    };

    const updated = [newPregnancy, ...this.pregnancies()];
    this.savePregnancies(updated);
    return newPregnancy;
  }
}
