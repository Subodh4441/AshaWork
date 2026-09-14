import { Component, signal } from '@angular/core';
import { LandingComponent } from './landing/landing.component';
import {DashboardComponent} from './dashboard/dashboard.component'

@Component({
  selector: 'app-root',
  imports: [DashboardComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('AshaWork');
}
