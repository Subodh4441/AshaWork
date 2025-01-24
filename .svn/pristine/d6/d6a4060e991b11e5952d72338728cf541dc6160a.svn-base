import { Component, OnInit } from '@angular/core';
import * as bootstrap from 'bootstrap';
import { ApiResponseModel } from '../../model/ApiResponseModel';
import { CommonModule } from '@angular/common';
import { ApiServiceService } from '../../services/api-service.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-role',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.css'
})
export class RoleComponent implements OnInit {

  ngOnInit(): void {
    //throw new Error('Method not implemented.');
    this.GetRoleDetails();
  }

  roleDetailsList: any = [];
  rolePermission: { roleId: number, menuID: number, menuName: '', isAdd: boolean, isEdit: boolean, isDisplay: boolean }[] = [];
  currentRoleId: number = 0
  menuID: number = 0
  newRole = {
    rolename: '',
    ismoderator: false
  }
  filteredRoles: any[] = [];
  searchQuery: string = '';
  isActive = false;
  page: number = 1; // Current page number

  constructor(public apiMethodService: ApiServiceService, private router: Router, private toastr: ToastrService) { }

  onUserClick() {
    this.router.navigate(['/users']);
  }

  // Method to filter roles based on search query
  searchTable() {
    debugger;
    if (!this.searchQuery) {
      this.filteredRoles = this.roleDetailsList;
    } else {
      this.filteredRoles = this.roleDetailsList.filter((role: { roleName: string }) => {
        // Check that roleName exists and is a string.
        return role.roleName && role.roleName.toLowerCase().includes(this.searchQuery.toLowerCase());
      });
    }
  }

  openModal(modalId: string) {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    } else {
      console.error(`Modal with ID ${modalId}  not found`);
    }
  }

  closeModal(modalId: string) {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide(); // Close the modal
      }
    } else {
      console.error(`Modal with ID ${modalId} not found`);
    }
  }
  openAddRoleModel() {
    this.openModal('addRoleModal');
  }
  openDeleteRoleModal(roleId: number) {
    this.currentRoleId = roleId; // Set the selected userId
    this.openModal('deleteRoleModal');
  }
  openEditRoleModel(roleId: number) {
    this.currentRoleId = roleId;
    this.apiMethodService.GetRoleById(this.currentRoleId).subscribe(
      (data: ApiResponseModel) => {
        if (Array.isArray(data) && data.length > 0) {
          const roleDetails = data[0];
          this.newRole = {
            rolename: roleDetails.roleName,
            ismoderator: roleDetails.isModerator 
          };
          this.openModal('editRoleModal');
        } else {
          console.error('No roles found in ResponseData');
          this.toastr.error('No roles found for this ID', 'Error', { timeOut: 3000 });
        }
      },
      (error) => {
        console.error('Error fetching role data:', error);
        this.toastr.error('Failed to load role details', 'Error', { timeOut: 3000 });
      }
    );
  }
  
  openChangeStatusModal(roleId: any, isActive: boolean) {
    debugger
    this.currentRoleId = roleId;
    this.isActive = isActive;
    this.openModal('changeStatusModal');
  }

  openRolePermissionModel(roleId: number) {
    this.currentRoleId = roleId;
    this.openModal('rolePermissionModal');
    this.GetRolePermissions();
  }

  GetRoleDetails() {
    this.apiMethodService.GetAllRoles().subscribe((data: { ResponseData: any; }) => {
      this.roleDetailsList = data;
      this.filteredRoles = [...this.roleDetailsList];
      console.log(this.roleDetailsList);

    })
  }

  onAddRole() {
    this.apiMethodService.AddRole(this.newRole).subscribe(
      (response) => {
        this.toastr.success('Role added successfully!', "Success", {
          timeOut: 3000,
          positionClass: 'toast-bottom-center' 
        });
        this.GetRoleDetails();
      },
      (error) => {
        this.toastr.error('Error adding role. Please try again later.', "Error", {
          timeOut: 3000,
          positionClass: 'toast-bottom-center' 
        });

      }
    );
    this.closeModal('addRoleModal');
  }

  deleteRole(roleId: number): void {
    this.apiMethodService.DeleteRole(roleId).subscribe(
      (response) => {
        this.toastr.success('Role deleted successfully!', "Success", {
          timeOut: 3000,
          positionClass: 'toast-bottom-center' 
        });
        this.GetRoleDetails();
      },
      (error) => {
        this.toastr.error('Error while deleting role!', "Error", {
          timeOut: 3000,
          positionClass: 'toast-bottom-center' 
        });
      }
    );
    this.closeModal('deleteRoleModal');
  }

  onEditRole(): void {
    debugger
    this.apiMethodService.EditRole(this.currentRoleId, this.newRole).subscribe(
      (response) => {
        this.toastr.success('Role details updated successfully!', "Success", {
          timeOut: 3000,
          positionClass: 'toast-bottom-center' 
        });
        this.GetRoleDetails();
      },
      (error) => {
        this.toastr.error('An error occurred while updating the role', "Error", {
          timeOut: 3000,
          positionClass: 'toast-bottom-center' 
        });
        console.error('Error Updating role:', error);
      }
    );
    this.closeModal('editRoleModal');
    this.GetRoleDetails();
  }

  updateStatus() {
    debugger;
    if (this.currentRoleId) {
      const roleId = this.currentRoleId;
      const isActive = !this.isActive;

      this.apiMethodService.UpdateRoleStatus(roleId, isActive).subscribe(
        (response) => {
          this.toastr.success('Role status updated successfully!', 'Success', { timeOut: 3000 });
          this.GetRoleDetails();
        },
        (error) => {
          this.toastr.error('An error occurred while updating the role status', 'Error', { timeOut: 3000 });
          console.error('Error deleting role:', error);
        }
      );
      this.closeModal('changeStatusModal');
      this.GetRoleDetails();
    }
  }

  GetRolePermissions() {
    debugger
    this.apiMethodService.GetAllPermissions(this.currentRoleId).subscribe((data: any) => {
      debugger
      this.rolePermission = [];
      if (data && data.length > 0) {
        for (let i = 0; i < data.length; i++) {
          debugger
          const permission = data[i];
          this.rolePermission.push({
            roleId: permission.roleId,
            menuID: permission.menuID,
            menuName: permission.menuName,
            isAdd: permission.isAdd,
            isEdit: permission.isEdit,
            isDisplay: permission.isDisplay
          });
        }
      }
    });
  }

  onSavePermissions(): void {
    debugger
    const permissionsPayload = this.rolePermission.map(permission => ({
      roleId: this.currentRoleId,
      menuID: permission.menuID,
      isAdd: permission.isAdd,
      isEdit: permission.isEdit,
      isDisplay: permission.isDisplay
    }));

    this.apiMethodService.SavePermissions(permissionsPayload).subscribe(
      (response) => {
        this.toastr.success('Role permissions updated successfully!', 'Success', { timeOut: 3000 });
      },
      (error) => {
        this.toastr.error('An error occurred while updating the role permissions', 'Error', { timeOut: 3000 });
        console.error('Error Updating role:', error);
      }
    );
    this.closeModal('rolePermissionModal');
  }
}
