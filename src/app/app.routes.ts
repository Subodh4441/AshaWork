import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { UsersComponent } from './Masters/users/users.component';
import { RoleComponent } from './Masters/roles/roles.component';
import { ScreensComponent } from './Masters/screens/screens.component';
import { ContentsComponent } from './Masters/contents/contents.component';
import { CampaignComponent } from './Masters/campaign/campaign.component';
import { DashboardComponent } from './Masters/dashboard/dashboard.component';
import { ReportsComponent } from './Masters/reports/reports.component';
import { testComponent } from './test/test.component';
import { LogoutComponent } from './logout/logout.component';
import { ClientComponent } from './Masters/client/client.component';
import { ProductComponent } from './Masters/product/product.component';
import { RegionComponent } from './Masters/region/region.component';
import { SpareComponent } from './Masters/spare/spare/spare.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'clients', component: ClientComponent },
    { path: 'products', component: ProductComponent },
    { path: 'regions', component: RegionComponent },
    { path: 'users', component: UsersComponent }, 
    { path: 'roles', component: RoleComponent }, 
    { path: 'screens', component: ScreensComponent }, 
    { path: 'contents', component: ContentsComponent }, 
    { path: 'campaign', component: CampaignComponent }, 
    { path: 'dashboard', component: DashboardComponent }, 
    { path: 'reports', component: ReportsComponent },
    { path: "logout", component: LogoutComponent }, 
    { path: 'test', component: testComponent },
    { path: 'spare', component: SpareComponent }
];
  export class AppRoutingModule { }
