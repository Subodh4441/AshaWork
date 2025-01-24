import { ChangeDetectorRef, Component } from '@angular/core';
import { ApiServiceService } from '../../services/api-service.service';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RolespopupComponent } from '../../Popup/popup/rolespopup/rolespopup.component';


import { ApiResponseModel } from '../../model/ApiResponseModel';
import { IRole } from '../../Interface/IRole';
import { IPermission } from '../../Interface/IPermission';

type Action = 'add' | 'edit' | 'view';

// Define the type for each item in actions
interface ActionTypes {
  add: boolean;
  edit: boolean;
  view: boolean;
}

interface Actions {
  [key: number]: ActionTypes;  // Use number as the key to index actions by feature_id
}
@Component({
  selector: 'app-roleandrights',
  standalone: true,
 imports: [CommonModule, FormsModule],
  templateUrl: './roleandrights.component.html',
  styleUrl: './roleandrights.component.css'
})

export class RoleandrightsComponent {
  searchQuery: string = '';
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1; 
   // Toggles for each submenu (Masters, CMS, Reports)
   showMasters = false;
    role: IRole[] = [];
    
   RoleForCurrentPage: IRole[] = [];
    filteredRoleList: IRole[] = [];
   showCms = false;
   showReports = false;
   roleandrights: number = 0;  // or some other default value

   actions: Actions = {};
   // Data for the submenu items
   mastersSubMenu: any[] = [];  // This will allow any type of data inside the array
   allSelected: boolean = false; // Tracks whether all checkboxes are selected

   cmsSubMenu = ['Add Ticket', 'Pending Ticket', 'Closed ticket'];
   reportsSubMenu = ['Ticket Report', 'Bucket Report'];
   roles = ['SuperAdmin','AccountManager', 'Technical Support', 'Clients', 'Operation','IT'];
   public permissions: any[] = [];
   selectAll: boolean = false; // State of the toggle button
   // Actions dictionary to manage Add, Edit, View permissions for each item
   //actions: { [key: string]: { add: boolean; edit: boolean; view: boolean } } = {};
 
   // Method to toggle visibility of submenus
   constructor(private apiService: ApiServiceService,private toastr: ToastrService, public dialog: MatDialog,private cdr: ChangeDetectorRef) {
    this.apiService.setString('rolesandrights');
  }
  changePage(pageNumber: number): void {
    if (pageNumber >= 1 && pageNumber <= this.totalPages) {
      this.currentPage = pageNumber;
      this.updatePagedData();
    }
  }
  ngOnInit(): void {
    
    this.fetchRoles();
    if (this.roleandrights!=0) {
      this.fetchPermissions(this.roleandrights); // Pass selected role ID to fetchPermissions
      console.log(this.roleandrights)
    } else {
      this.fetchPermissions(1);
    }
  }
  

  fetchRoles(): void {
    debugger;
    this.apiService.getRoles().subscribe(
      (response) => {
        this.role = response;
        console.log(response)
        this.filteredRoleList = [...this.role];
        this.totalPages = Math.ceil(this.filteredRoleList.length / this.itemsPerPage);
        this.fetchPermissions(this.roleandrights);
       
        this.updatePagedData();
        
        // Dynamically set roleandrights based on the response
        if (this.role.length > 0) {
          this.roleandrights = this.role[0].role_id; // Set the first role
        }

        this.cdr.markForCheck(); // Schedule change detection
        console.log('Roles updated:', this.role);
      },
      (error) => {
        console.error('Error while fetching roles:', error);
      }
    );
  }
  updatePagedData(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.RoleForCurrentPage = this.filteredRoleList.slice(start, end);
    console.log(this.RoleForCurrentPage);

  }
   toggleSubMenu(menu: string) {
     if (menu === 'masters') {
       this.showMasters = !this.showMasters;
     } else if (menu === 'cms') {
       this.showCms = !this.showCms;
     } else if (menu === 'reports') {
       this.showReports = !this.showReports;
     }
   }
   
   addRoles()
   {
         const dialogRef = this.dialog.open(RolespopupComponent, {
              width: '60%',
            });
        
              dialogRef.afterClosed().subscribe((response: string) => {
              if (response) {
                console.log("Dialog closed with response:", response);
                 
                // this.toastr.success(response, "Success", { timeOut: 3000 });
                this.fetchRoles();
                console.log("fetch roles sucess")
              }
              this.fetchRoles();
            });
   }


   onRoles()
   {

    if (this.roleandrights) {
      this.fetchPermissions(this.roleandrights); // Fetch permissions based on selected role ID
    } else {
      this.mastersSubMenu = []; // Clear permissions if no role is selected
    }

   }


toggleAction1(action: keyof ActionTypes, item: any): void {
  if (this.actions[item.feature_id]) {
    this.actions[item.feature_id][action] = !this.actions[item.feature_id][action];
  }
}

isParentFeature(item: any): boolean {
  // Return true if the item is a parent feature
  return !!item.isParent; 
}


toggleAction(action: keyof ActionTypes, item: any): void {
  if (this.actions[item.feature_id]) {
    if (action === 'view') {    
      this.actions[item.feature_id].view = true;
    } else {   
      this.actions[item.feature_id][action] = !this.actions[item.feature_id][action];
    }
  }
}

  // Select all checkboxes
  selectAllMasters(): void {
    this.allSelected = !this.allSelected;
    this.mastersSubMenu.forEach((item) => (item.selected = this.allSelected));
  }


  // saveRights1(): void { 
  //     const dataToSave: IPermission[] = this.mastersSubMenu.map((item) => {
  //     const featureId = item.feature_id; // feature_id from mastersSubMenu
  //     const permissions = this.actions[featureId] || { add: false, edit: false, view: false };
  
  //     // Return the object with all necessary fields including menuName
  //     return {
  //       role_id: this.roleandrights, // Provide the role_id (if it's constant or can be dynamic, change it accordingly)
  //       feature_id: featureId,
  //       menu_id: item.menu_id, // Assuming menu_id is available in mastersSubMenu
  //       can_add: permissions.add,
  //       can_edit: permissions.edit,
  //       can_view: permissions.view,
  //       created_at: new Date().toISOString(), // Convert Date to string (ISO format)
  //       updated_at: new Date().toISOString(), // Convert Date to string (ISO format)
  //       menuName: item.menuName
  //     };
  //   });
  
  //   console.log('Data to save:', dataToSave);
  //   this.updateUserRights(dataToSave);
  // }

  saveRights(): void {
    debugger;
  
    const dataToSave: IPermission[] = this.mastersSubMenu.map((item) => {
      // Fetch the permissions directly from the item properties
      return {
        role_id: this.roleandrights, // Assuming `roleandrights` contains the role ID
        feature_id: item.feature_id,
        menu_id: item.menu_id,
        can_add: item.can_add || false,
        can_edit: item.can_edit || false,
        can_view: item.can_view || false,
        created_at: new Date().toISOString(), // Adjust according to your backend format
        updated_at: new Date().toISOString(),
        menuName: item.menuName,
      };
    });
  
    console.log('Data to save:', dataToSave);
  
    // Pass the data to the update function
    this.updateUserRights(dataToSave);
  }
  
  
  fetchPermissions(userId: number): void {
    debugger
    this.apiService.getrolepermission(userId).subscribe(
      (response: IPermission[]) => {
        this.mastersSubMenu = response.map((item) => ({
          menuName: item.menuName,
          feature_id: item.feature_id,
          menu_id: item.menu_id,
          can_add: item.can_add,
          can_edit: item.can_edit,
          can_view: item.can_view,
        }));
  
        // Initialize actions with default permissions for each feature_id
        this.mastersSubMenu.forEach((item) => {
          this.actions[item.feature_id] = {
            add: item.can_add || false,
            edit: item.can_edit || false,
            view: item.can_view || false,
          };

            // Initialize the state for toggle actions
      this.allSelected = this.mastersSubMenu.every(
        (item) => item.can_add && item.can_edit && item.can_view
      ); // Check if all are selected


        });
      },
      (error) => {
        console.error('Error fetching permissions:', error);
      }
    );
  }

   
    updateUserRights(dataToSave:IPermission[]): void {
      debugger
    console.log("Payload to be sent to the API:", dataToSave); 
    this.apiService.updateUserRights(dataToSave).subscribe({
      next: (response: string) => {
        console.log("Rights updated successfully:", response);
        this.toastr.success("Rights updated successfully:", "Success", { timeOut: 3000 });
        
      },
      error: (error) => {
        console.error("Error updating client:", error);
        this.toastr.error("Failed to update client. Check logs for details.", "Error", { timeOut: 3000 });
      }
    });
  }

  
  toggleSelectAll(): void {
    this.allSelected = !this.allSelected; 
  
    // Update all submenu permissions based on the toggle state
    this.mastersSubMenu.forEach((item) => {
      item.can_add = this.allSelected;
      item.can_edit = this.allSelected;
      item.can_view = this.allSelected;
    });
  }


  
  // Function to toggle all permissions
  toggleAllPermissions(): void {
    this.selectAll = !this.selectAll;
    this.mastersSubMenu.forEach((item) => {
      item.can_add = this.selectAll;
      item.can_edit = this.selectAll;
      item.can_view = this.selectAll;
    });
  }

  // Function to update the toggle button state based on checkboxes
  updateSelectAllState(): void {
    this.selectAll = this.mastersSubMenu.every(
      (item) => item.can_add && item.can_edit && item.can_view
    );
  }
}
