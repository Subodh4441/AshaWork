import {
  Component,
  OnInit,
  PLATFORM_ID,
  inject,
  signal
} from '@angular/core';

import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  LanguageService
} from '../core/services/language.service';
import {
  TranslationService
} from '../core/services/translation-service';
import {
  DataStoreService
} from '../core/services/data-store.service';

import {
  HomeVisit
} from '../core/models/home-visit.model';
import {
  FamilyRecord
} from '../core/models/family-record.model';
import {
  SurveyEntry as SurveyRecord
} from '../core/models/survey-entry.model';
import {
  PregnancyRecord
} from '../core/models/pregnancy-record.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  readonly languageService = inject(LanguageService);
  private readonly translationService = inject(TranslationService);
  private readonly dataStore = inject(DataStoreService);
  private readonly platformId = inject(PLATFORM_ID);

  // ============================================================
  // ACTIVE SECTION
  // ============================================================
  activeSection = signal<string>('visits');

  // ============================================================
  // SIDEBAR SECTIONS
  // ============================================================
  sections = [
    { id: 'visits', label: 'sidebar.visits' },
    { id: 'families', label: 'sidebar.families' },
    { id: 'surveys', label: 'sidebar.surveys' },
    { id: 'pregnancy', label: 'sidebar.pregnancy' },
    { id: 'report', label: 'sidebar.report' }
  ];

  // ============================================================
  // MOBILE SIDEBAR STATE
  // ============================================================
  sidebarOpen = signal<boolean>(false);

  toggleSidebar(): void {
    this.sidebarOpen.set(!this.sidebarOpen());
  }

  closeSidebar(): void {
    this.sidebarOpen.set(false);
  }

  // ============================================================
  // DISPLAYED DATA SIGNALS (LANGUAGE AWARE)
  // When language is 'mr', these hold Marathi data.
  // When 'en', these hold English data.
  // ============================================================
  homeVisits = signal<HomeVisit[]>([]);
  families = signal<FamilyRecord[]>([]);
  surveys = signal<SurveyRecord[]>([]);
  pregnancies = signal<PregnancyRecord[]>([]);

  // ============================================================
  // HOME VISITS DRAFT & TYPES
  // ============================================================
  visitTypes: string[] = [
    'Immunisation',
    'Antenatal check',
    'Postnatal check',
    'General health',
    'Nutrition follow-up'
  ];

  visitDraft = {
    visitDate: this.getToday(),
    ashaName: '',
    village: '',
    familyName: '',
    visitType: 'General health',
    notes: ''
  };

  // ============================================================
  // FAMILY RECORDS DRAFT
  // ============================================================
  familyDraft = {
    familyName: '',
    headOfFamily: '',
    village: '',
    address: '',
    members: 1,
    pregnantWomen: 0,
    childrenUnderFive: 0
  };

  // ============================================================
  // SURVEYS DRAFT & TYPES
  // ============================================================
  surveyTypes: string[] = [
    'General health',
    'Nutrition',
    'Family planning',
    'Child health',
    'Maternal health'
  ];

  surveyDraft = {
    date: this.getToday(),
    surveyType: 'General health',
    familyName: '',
    findings: ''
  };

  // ============================================================
  // PREGNANCY DRAFT
  // ============================================================
  pregnancyDraft = {
    name: '',
    age: 18,
    husbandName: '',
    village: '',
    lmpDate: '',
    ancVisits: 0,
    highRisk: false
  };

  // ============================================================
  // MONTH LABEL
  // ============================================================
  get monthLabel(): string {
    const language = this.languageService.currentLanguage();
    const locale = language === 'mr' ? 'mr-IN' : 'en-IN';

    return new Intl.DateTimeFormat(locale, {
      month: 'long',
      year: 'numeric'
    }).format(new Date());
  }

  // ============================================================
  // INITIALIZATION
  // ============================================================
  async ngOnInit(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    await this.refreshDisplayedData();
  }

  // ============================================================
  // REFRESH DISPLAYED DATA ACCORDING TO ACTIVE LANGUAGE
  // Database stores English only.
  // When in Marathi, dynamic AI/bilingual translation renders
  // all data in Marathi!
  // ============================================================
  async refreshDisplayedData(): Promise<void> {
    const lang = this.languageService.currentLanguage();
    const storedVisits = this.dataStore.homeVisits();
    const storedFamilies = this.dataStore.families();
    const storedSurveys = this.dataStore.surveys();
    const storedPregnancies = this.dataStore.pregnancies();

    if (lang === 'mr') {
      const [mrVisits, mrFamilies, mrSurveys, mrPregnancies] = await Promise.all([
        Promise.all(storedVisits.map(v => this.translationService.translateVisitToMarathi(v))),
        Promise.all(storedFamilies.map(f => this.translationService.translateFamilyToMarathi(f))),
        Promise.all(storedSurveys.map(s => this.translationService.translateSurveyToMarathi(s))),
        Promise.all(storedPregnancies.map(p => this.translationService.translatePregnancyToMarathi(p)))
      ]);

      this.homeVisits.set(mrVisits);
      this.families.set(mrFamilies);
      this.surveys.set(mrSurveys);
      this.pregnancies.set(mrPregnancies);
    } else {
      // English: strictly display canonical English records from the database
      this.homeVisits.set(storedVisits);
      this.families.set(storedFamilies);
      this.surveys.set(storedSurveys);
      this.pregnancies.set(storedPregnancies);
    }
  }

  // ============================================================
  // LANGUAGE TOGGLE
  // ============================================================
  async toggleLanguage(): Promise<void> {
    await this.languageService.toggleLanguage();
    await this.refreshDisplayedData();
  }

  // ============================================================
  // SECTION CHANGE
  // ============================================================
  setSection(section: string): void {
    this.activeSection.set(section);
    this.closeSidebar();
  }

  // ============================================================
  // ADD HOME VISIT
  // Stores strictly in English in the database.
  // ============================================================
  async addVisit(): Promise<void> {
    if (!this.visitDraft.visitDate || !this.visitDraft.familyName) {
      return;
    }

    await this.dataStore.addHomeVisit(this.visitDraft);
    this.resetVisitForm();
    await this.refreshDisplayedData();
  }

  private resetVisitForm(): void {
    this.visitDraft = {
      visitDate: this.getToday(),
      ashaName: '',
      village: '',
      familyName: '',
      visitType: 'General health',
      notes: ''
    };
  }

  // ============================================================
  // ADD FAMILY
  // Stores strictly in English in the database.
  // ============================================================
  async addFamily(): Promise<void> {
    if (!this.familyDraft.familyName.trim()) {
      return;
    }

    await this.dataStore.addFamily(this.familyDraft);
    this.resetFamilyForm();
    await this.refreshDisplayedData();
  }

  private resetFamilyForm(): void {
    this.familyDraft = {
      familyName: '',
      headOfFamily: '',
      village: '',
      address: '',
      members: 1,
      pregnantWomen: 0,
      childrenUnderFive: 0
    };
  }

  // ============================================================
  // ADD SURVEY
  // Stores strictly in English in the database.
  // ============================================================
  async addSurvey(): Promise<void> {
    if (!this.surveyDraft.familyName.trim()) {
      return;
    }

    await this.dataStore.addSurvey(this.surveyDraft);
    this.resetSurveyForm();
    await this.refreshDisplayedData();
  }

  private resetSurveyForm(): void {
    this.surveyDraft = {
      date: this.getToday(),
      surveyType: 'General health',
      familyName: '',
      findings: ''
    };
  }

  // ============================================================
  // ADD PREGNANCY
  // Stores strictly in English in the database.
  // ============================================================
  async addPregnancy(): Promise<void> {
    if (!this.pregnancyDraft.name.trim()) {
      return;
    }

    await this.dataStore.addPregnancy(this.pregnancyDraft);
    this.resetPregnancyForm();
    await this.refreshDisplayedData();
  }

  private resetPregnancyForm(): void {
    this.pregnancyDraft = {
      name: '',
      age: 18,
      husbandName: '',
      village: '',
      lmpDate: '',
      ancVisits: 0,
      highRisk: false
    };
  }

  // ============================================================
  // EXPECTED DUE DATE
  // ============================================================
  expectedDueDate(lmpDate: string): string {
    if (!lmpDate) {
      return '';
    }

    const date = new Date(lmpDate);
    if (Number.isNaN(date.getTime())) {
      return '';
    }

    // 280 days from LMP
    date.setDate(date.getDate() + 280);

    const language = this.languageService.currentLanguage();
    return new Intl.DateTimeFormat(
      language === 'mr' ? 'mr-IN' : 'en-IN'
    ).format(date);
  }

  // ============================================================
  // MONTH END REPORT STATS
  // ============================================================
  visitsThisMonth(): number {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return this.homeVisits().filter(v => {
      const date = new Date(v.visitDate);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    }).length;
  }

  surveysThisMonth(): number {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return this.surveys().filter(s => {
      const date = new Date(s.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    }).length;
  }

  familiesTotal(): number {
    return this.families().length;
  }

  pregnanciesTracked(): number {
    return this.pregnancies().length;
  }

  highRiskPregnancies(): number {
    return this.pregnancies().filter(p => p.highRisk).length;
  }

  // ============================================================
  // DROPDOWN & VALUE TRANSLATION
  // ============================================================
  translateValue(value: string): string {
    if (!value) {
      return '';
    }
    if (this.languageService.currentLanguage() === 'mr') {
      return this.translationService.ensureMarathiSync(value);
    }
    return this.translationService.ensureEnglishSync(value);
  }

  private getToday(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
