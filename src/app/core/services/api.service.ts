import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConfigService } from '../config/app-config.service';
import { HomeVisit, CreateHomeVisitRequest } from '../models/home-visit.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(AppConfigService);

  getHomeVisits(language: string): Observable<HomeVisit[]> {
    const params = new HttpParams().set('language', language);
    return this.http.get<HomeVisit[]>(
      `${this.config.apiUrl}/home-visits`,
      { params }
    );
  }

  createHomeVisit(request: CreateHomeVisitRequest): Observable<HomeVisit> {
    return this.http.post<HomeVisit>(
      `${this.config.apiUrl}/home-visits`,
      request
    );
  }
}
