import { Component,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './Shared/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from "./Shared/sidebar/sidebar.component";
import { ClientComponent } from "./Masters/client/client.component";
import { ApiServiceService } from './services/api-service.service';
import { ProductComponent } from "./Masters/product/product.component";
import { RegionComponent } from "./Masters/region/region.component";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'AslCms';
  showNavbar: boolean = true;
  test:boolean=true;
  isClient:boolean=false;
  isProduct:boolean=false;
  isRegion:boolean=false;
  showSidebar: boolean = true;
  ActiveTab:string='';
  // storedValue: string = '';

  constructor(private router: Router,private api:ApiServiceService) {
    this.router.events.subscribe(() => {
      // List of routes where the navbar should be hidden
      const excludedRoutes = ['/login','/logout']; 
      this.showNavbar = !excludedRoutes.includes(this.router.url);
      this.showSidebar = !excludedRoutes.includes(this.router.url);
    });
    //this.ActiveTab=this.api.getString()

    // this.storedString.getString().subscribe((value) => {
    //   this.ActiveTab = value;
    // });
  }

  ngOnInit(): void {
    // Subscribe to the observable to get updates
    // this.api.getString().subscribe((value) => {
    //   this.storedValue = value;
    // });

    history.pushState(null, '', location.href);
    window.onpopstate = function() {
    history.pushState(null, '', location.href);
    };
  }

 

  // storeString(value: string): void {
  //   this.api.setString(value);
  // }

 
}


  // onTabSelect(selectedTab:string){
  //   if(selectedTab === "clients"){
  //     this.isClient=true;
  //     this.isProduct=false;
  //     this.isRegion=false;
  //   }else if(selectedTab === "products"){
  //     this.isClient=false;
  //     this.isProduct=true;
  //     this.isRegion=false;
  //   }else if(selectedTab === "regions"){
  //     this.isClient=false;
  //     this.isProduct=false;
  //     this.isRegion=true;
  //   }
     
  // }

