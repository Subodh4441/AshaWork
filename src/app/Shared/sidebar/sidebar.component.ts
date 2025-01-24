import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from '../../app.routes';
import { AppComponent } from '../../app.component';
import { ApiServiceService } from '../../services/api-service.service';
import { IPermission } from '../../Interface/IPermission';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule,CommonModule ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {
  activeAccordion: string | null = null;
  activeTab: string = 'clients'
  public permissions: any[] = [];
  hasAddPermission: boolean = false;
  hasEditPermission: boolean = false;


  clientPermissions: any = {};  // Store client-specific permissions
  otherPermissions: any[] = []; 
  //viewPermissions: any[] = [];  // Store other menu permissions
  viewPermissions: { [key: string]: boolean } = {};
  role: any;





  @Output() tabSelected = new EventEmitter<string>();

  constructor(private aPi:ApiServiceService){

  }
  selectTab(tabName: string) {
    this.activeTab = tabName; 
    this.aPi.setString(tabName)
  }

  ngOnInit() {
    this.role = sessionStorage.getItem('role');
    //this.fetchPermissions(this.role);
    if(this.viewPermissions){
      this.activeTab="clients";
    }
  } 
  
  toggleAccordion(accordionId: string) {   
      this.activeAccordion = this.activeAccordion === accordionId ? null : accordionId; 
    }  
    fetchPermissions(userId: number): void {
      this.aPi.getrolepermission(userId).subscribe(
        (response: IPermission[]) => {
          debugger
          this.permissions = response;
          console.log(response)
    
          // Create a map of view permissions with menuName as the key
          this.viewPermissions = this.permissions.reduce((acc, perm) => {
            acc[perm.menuName] = perm.can_view;
            return acc;
          }, 
          {} as { [key: string]: boolean });
    
          console.log(this.viewPermissions);
        },
        (error) => {
          console.error('Error fetching permissions:', error);
        }
      );
    }

}
