import { Component, Inject, OnInit } from '@angular/core';
import { ApiServiceService } from '../../../services/api-service.service';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IRole } from '../../../Interface/IRole';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-rolespopup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './rolespopup.component.html',
  styleUrls: ['./rolespopup.component.css'],
})
export class RolespopupComponent implements OnInit {
  searchQuery: string = '';
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;
  role: IRole[] = [];
  roleForCurrentPage: IRole[] = [];
  filteredRoleList: IRole[] = [];
  selectedRole: IRole | null = null; 
  rolesName = '';
  roleId=0;
  isedit = false;
  buttontext='';
  isActive = true;
  created_at: Date | undefined;
  updated_at: Date | undefined;
json: any;

  constructor(
    public dialogRef: MatDialogRef<RolespopupComponent>,
    private apiService: ApiServiceService,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: IRole[] = []
  ) {
    this.data = data as any;
    this.buttontext="Save";
  }

  ngOnInit(): void {
    this.fetchRoles();
  }

  // Fetch roles from the API
  fetchRoles(): void {
    this.apiService.getRoles().subscribe(
      (response) => {
        this.role = response;
        this.filteredRoleList = [...this.role];
        this.totalPages = Math.ceil(this.filteredRoleList.length / this.itemsPerPage);
        this.updatePagedData();
        console.log(response);
      },
      (error) => {
        this.toastr.error('Error while fetching roles', 'Error', { timeOut: 3000 });
        console.error('Error while fetching roles:', error);
      }
    );
  }

  // Update the data for pagination
  updatePagedData(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.roleForCurrentPage = this.filteredRoleList.slice(start, end);
    console.log('Current Page Data:', this.roleForCurrentPage);
  }

  // Handle pagination logic
  changePage(pageNumber: number): void {
    if (pageNumber >= 1 && pageNumber <= this.totalPages) {
      this.currentPage = pageNumber;
      this.updatePagedData();
    }
  }

  // Close the dialog
  onCancel(): void {
    this.dialogRef.close();
  }
  // Handle role editing
  onEditRole(role: IRole): void {
    // Set the selected role
    this.buttontext="Update";
    this.isedit=true;
   
    this.selectedRole = { ...role };  // Create a copy of the selected role
    // Populate form fields with the selected role's data
    this.roleId=this.selectedRole?.role_id;
    this.rolesName = this.selectedRole?.role_name || '';
    this.isActive = this.selectedRole?.is_active || true;
  }
  // Save the new role
  onSaveRole(): void {
    if (!this.rolesName) {
      this.toastr.error('All fields must be filled out.', 'Error', { timeOut: 3000 });
      return;
    }

    const roleData: IRole = {
      role_name: this.rolesName,
      is_active: this.isActive,
      created_at: new Date(),
      update_at: new Date(),
      role_id: this.roleId
      
    };
    if(this.isedit)
    {
       this.addEditRights(roleData);
    }
    else
    {
       this.addRolesandRights(roleData);
    }
  }

  // Call the API to add a new role
  addRolesandRights(role: IRole): void {
    this.apiService.addRolesandRights(role).subscribe(
      (newRole) => {
        this.toastr.success('Role saved successfully!', 'Success', { timeOut: 3000 });
        this.dialogRef.close(newRole);
        this.fetchRoles(); // Refresh the list after saving
      },
      (error) => {
        console.error('Error creating Role:', error);
        this.toastr.error('Failed to create role', 'Error', { timeOut: 3000 });
      }
    );
  }
  addEditRights(role: IRole): void {
    console.log(this.roleId)
    this.apiService.UpdateRoles(role).subscribe(
      (newRole) => {
        this.toastr.success('Role saved successfully!', 'Success', { timeOut: 3000 });
        this.dialogRef.close(newRole);
        this.fetchRoles(); // Refresh the list after saving
      },
      (error) => {
        console.error('Error creating Role:', error);
        this.toastr.error('Failed to create role', 'Error', { timeOut: 3000 });
      }
    );
  }
}
