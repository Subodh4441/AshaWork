import { APP_INITIALIZER, ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { ConfigJSONService } from './services/config-json.service';

function initializeApp(configJSONService: ConfigJSONService): () => Promise<void> {
  return () => configJSONService.loadConfig();
}

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),provideHttpClient(), provideAnimationsAsync(), provideAnimations(), importProvidersFrom(
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
      closeButton: false,
      progressBar: true,
    })
  ), ConfigJSONService,
  {
    provide: APP_INITIALIZER,
    useFactory: initializeApp,
    deps: [ConfigJSONService],
    multi: true
  }, provideAnimationsAsync()]
};
