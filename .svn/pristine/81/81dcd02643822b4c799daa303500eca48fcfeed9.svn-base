import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ApiServiceService } from '../../../services/api-service.service';
import { ToastrService } from 'ngx-toastr';
import { IUser } from '../../../Interface/IUser'; // Import IUser interface
import { IRole } from '../../../Interface/IRole';
 
@Component({
  selector: 'app-user-popup',
  templateUrl: './user-popup.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrls: ['./user-popup.component.css']
})
export class UserPopupComponent implements OnInit {
  @Input() user: IUser | null = null; // Input for editing existing user
  @Output() closePopup = new EventEmitter<void>();
  @Output() saveUser = new EventEmitter<IUser>();
 
  LoginID?:number=0;
  userName:string='';
  RoleName:number=0;
  BranchUserGroup:number=0;
  EmployeeID:number=0;
  EmailID:string='';
  MobileNumber:string='';
  DisplayName:string='';
  IsUpdateEnable:boolean=false;
  isChangePassword: boolean = false;
  newPassword:string='';
  oldPassword:string='';
  confirmPassword:string='';
  isActive:boolean=true;
  // RoleList: string[] = [];
  RoleList: { id?: number; name: string }[] = [];
 
  constructor(
    private apiService: ApiServiceService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<UserPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IUser
  ) {
    if(data!=null){
      if(data.password==="true"){
        this.isChangePassword=true;
        this.LoginID=data.userID;
        return;
      }
    this.LoginID=data.userID;
    this.userName = data.userName
    this.RoleName=data.roleID;
    this.BranchUserGroup=data.branchGroupID;
    this.EmployeeID= data.employeeCode;
    this.EmailID= data.emailID;
    this.MobileNumber=data.mobileNumber;
    this.DisplayName= data.displayName;
    this.isActive= data.isActive;
    this.IsUpdateEnable=true;
 
  }
  }
 
  ngOnInit(): void {
    this.getUserListByRoleName();
  }
 
  getUserListByRoleName(): void {
  
    this.apiService.getAllRoleList().subscribe({
      next: (response: IRole[]) => {
        console.log(response);
        // this.RoleList = response.map(rolename => rolename.role_name); // Assuming `UserName` is the property for user names

        this.RoleList = Array.from(
          new Map(
            response
              .filter(
                item => item.is_active === true
              )
              .map(item => [item.role_id, { id: item.role_id!, name: item.role_name! }])
          ).values()
        );
        console.log(this.RoleList);


      },
      error: (error) => {
        console.error("Error fetching users:", error);
      }
    });
  }


  save(): void {
    if (!this.isFormValid()) {
      this.toastr.error('Please fill all mandatory fields.');
      return;
    }
    const userData: IUser = {
      userID: this.LoginID,
      userName: this.userName ?? '',
      password: this.user ? this.user.password : 'vision_13',
      created: this.user?.created ?? new Date(),
      roleID: this.RoleName ?? 0,
      clientID: 0,
      isActive: this.isActive,
      // remarks: '',
      displayName:  this.userName ?? '',
      mobileNumber: this.MobileNumber ?? '',
      emailID: this.EmailID ?? '',
      employeeCode: this.EmployeeID ?? 0,
      branchID: this.user?.branchID ?? 0,
      branchGroupID: this.BranchUserGroup ?? 0,
      TenantID:1,
      MultipleTenantID:''
      
    };
 
    if (this.IsUpdateEnable) {
     
      this.apiService.updateUser(userData).subscribe(
        () => {
          this.toastr.success('User updated successfully!');
          this.closePopup.emit();
          this.onCancel()
        },
        () => {
          this.toastr.error('Failed to update user.');
          this.onCancel()
        }
      );
    } else {
     
      this.apiService.addUser(userData).subscribe(
        () => {
          this.toastr.success('User added successfully!');
          this.closePopup.emit();
          this.onCancel()
        },
        () => {
          this.toastr.error('Failed to add user.');
          this.onCancel()
        }
      );
    }
  }
 
  onCancel(): void {
    this.dialogRef.close();
  }
 
  isFormValid(): boolean {
    return !!(
      this.userName &&
      this.RoleName &&
      this.BranchUserGroup &&
      this.EmployeeID
    );
  }
 
  getRoleIdByName(roleName: string): number {
    const roles: { [key: string]: number } = {
      Admin: 1,
      User: 2
    };
    return roles[roleName] || 0;
  }
 
  getBranchGroupIdByName(branchUserGroup: string): number {
    const groups: { [key: string]: number } = {
      'Group A': 101,
      'Group B': 102
    };
    return groups[branchUserGroup] || 0;
  }
 
  savePassword(): void {
      if (!this.oldPassword || !this.newPassword || !this.confirmPassword) {
        this.toastr.warning('All fields are required!');
        return;
      }
 
      if (this.newPassword !== this.confirmPassword) {
        this.toastr.warning('New Password and Confirm Password do not match!');
        return;
      }
 
      const passwordPayload = {
        UserID: this.LoginID,
        oldPassword: this.oldPassword,
        newPassword: this.newPassword,
        confirmPassword: this.confirmPassword,
      };
 
      this.apiService.changePassword(passwordPayload).subscribe(
        (response) => {
          this.toastr.success('Password changed successfully!');
          this.onCancel();
        },
        (error) => {
          console.error('Error changing password:', error);
          this.toastr.error('Failed to change password!');
          this.onCancel();
        }
      );
 
  }
 
}
 