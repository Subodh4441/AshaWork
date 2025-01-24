import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { ApplicationConfig } from '../model/ApplicationConfigModel';

@Injectable({
  providedIn: 'root'
})
export class ConfigJSONService {
  private appConfigData: ApplicationConfig | null = null;

  constructor(private http: HttpClient) {}

  async loadConfig(): Promise<void> {
    try {
      const data = await firstValueFrom(this.http.get<ApplicationConfig>('assets/config.json'));
      this.appConfigData = data;
    } catch (error) {
      console.error('Could not load config.json', error);
      throw error;
    }
  }

  get appconfigdata(): ApplicationConfig {
    if (!this.appConfigData) {
      throw new Error('Configuration data is not loaded. Please load it before accessing.');
    }
    return this.appConfigData;
  }
}
