import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from "../../Shared/navbar/navbar.component";
import { SidebarComponent } from "../../Shared/sidebar/sidebar.component";
import { ClientComponent } from "../client/client.component";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RegionComponent } from "../region/region.component";
import { ProductComponent } from "../product/product.component";
import { ApiServiceService } from '../../services/api-service.service';
import { UsersComponent } from "../users/users.component";
import { BranchesComponent } from "../branches/branches.component";
import { RoleandrightsComponent } from "../roleandrights/roleandrights.component";
import { ServiceAgencyComponent } from "../service-agency/service-agency.component";
import { ExperiaComponent } from "../experia/experia.component";
import { SpareComponent } from "../spare/spare/spare.component";
import { TenantComponent } from "../tenant/tenant.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ClientComponent, RegionComponent, ProductComponent, SidebarComponent, NavbarComponent, UsersComponent, BranchesComponent, RoleandrightsComponent, ServiceAgencyComponent, ExperiaComponent, SpareComponent, TenantComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  constructor(private api:ApiServiceService){}
  showNavbar: boolean = true;
  showSidebar: boolean = true;
  storedValue: string = '';
  ngOnInit(): void {
    // this.storedValue=
    history.pushState(null, '', location.href);
    window.onpopstate = function() {
    history.pushState(null, '', location.href);
    };
    // Subscribe to the observable to get updates
    this.api.getString().subscribe((value) => {
      this.storedValue = value;
    });

  }

  storeString(value: string): void {
    this.api.setString(value);
  }

}

