import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr'; // To display success/error messages
import { ApiServiceService } from '../../services/api-service.service';
import { CommonModule } from '@angular/common';
import { IUser } from '../../Interface/IUser';
import { MatDialog } from '@angular/material/dialog';
import { UserPopupComponent } from '../../Popup/popup/user-popup/user-popup.component';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { Password } from 'primeng/password';
import { IPermission } from '../../Interface/IPermission';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
   standalone: true,
  imports: [CommonModule, FormsModule]
})
export class UsersComponent implements OnInit {
  users: IUser[] = []; // To hold the user records
  searchQuery: string = ''; // To bind the search query
  addUserForm: FormGroup; // Form for adding/editing users
  roles: string[] = ['Admin', 'User', 'Manager']; // Example roles, fetch these from backend
  groups: string[] = ['Group A', 'Group B']; // Example groups, fetch these from backend
  tenants: any[] = []; // List of tenants fetched from the backend
  filteredUserList: IUser[] = [];

    // Pagination variables
    currentPage: number = 1;
    totalPages: number = 1;
    itemsPerPage = 10;  
    usersForCurrentPage: IUser[] = [];
    showPopup: boolean = false;
    selectedUser: IUser | null = null;

    public permissions: any[] = [];
    hasAddPermission: boolean = false;
    hasEditPermission: boolean = false;
  
  
    userPermissions: any = {};  // Store client-specific permissions
    otherPermissions: any[] = [];  // Store other menu permissions
    roleID:any;

    
    
  constructor(private fb: FormBuilder, private apiService: ApiServiceService, private toastr: ToastrService,public dialog: MatDialog) {
    this.addUserForm = this.fb.group({
      loginId: ['', Validators.required],
      userName: ['', Validators.required],
      roleName: ['', Validators.required],
      employeeId: ['', Validators.required],
      email: [''],
      mobile: ['', Validators.required],
      branchUserGroup: ['', Validators.required],
      tenantName: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadUsers();
    this.updatePagedData();
    this.roleID = sessionStorage.getItem('role');
    this.fetchPermissions(this.roleID);
  }

  loadUsers(): void {
    this.apiService.getUsers().subscribe((response: any) => {
      if (response &&  Array.isArray(response.data)) {
        this.users = response.data;  
		 this.filteredUserList = [...this.users];
		  this.totalPages = Math.ceil(this.filteredUserList.length / this.itemsPerPage);
		  this.updatePagedData(); 
      } else {
        this.toastr.warning('No users found');
      }
    },
    error => {
      this.toastr.error('Failed to load users');
      console.error('Error loading users:', error);
    }
  );
  }


  // Search users based on the search query
  onSearch(): void {
    if (this.searchQuery) {
      this.users = this.users.filter(user => user.userName.toLowerCase().includes(this.searchQuery.toLowerCase()));
    } else {
      this.loadUsers(); // Reload all users if search query is empty
    }
  }

  // Add new user
  onAddUser(): void {
    this.addUserForm.reset();
    // Open modal or navigate to the Add User page
  }

  // Save new user
  onSaveUser(): void {
    if (this.addUserForm.valid) {
      this.apiService.addUser(this.addUserForm.value).subscribe(() => {
        this.toastr.success('User added successfully');
        this.loadUsers();
      }, error => {
        this.toastr.error('Failed to add user');
      });
    } else {
      this.toastr.error('Please fill all required fields');
    }
  }

  onEditUser(user: IUser): void {

    const dialogRef = this.dialog.open(UserPopupComponent, {
      width: '60%',
       data: user,
    });
  
    dialogRef.afterClosed().subscribe(() => {
      this.loadUsers();
      console.log('Dialog closed');
    });
   
  }

  // Update existing user
  onUpdateUser(user: IUser): void {
    // if (this.addUserForm.valid) {
      if (user) {
      this.apiService.updateUser(user).subscribe(() => {
        this.toastr.success('User updated successfully');
        this.loadUsers();
      }, error => {
        this.toastr.error('Failed to update user');
      });
    }
  }

  onChangePassword(userID: number | undefined): void {
    if (userID === undefined) {
      console.warn('Invalid user ID for password change');
      return;  // Early exit or handle the undefined case
    }
  
    const dialogRef = this.dialog.open(UserPopupComponent, {
      width: '60%',
       data: {userID:userID,password:"true"},
    });
  
    dialogRef.afterClosed().subscribe(() => {
      this.loadUsers();
      console.log('Dialog closed');
    });
   
  }

  // Delete user
  onDeleteUser(userId: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.apiService.deleteUser(userId).subscribe(() => {
        this.toastr.success('User deleted successfully');
        this.loadUsers();
      }, error => {
        this.toastr.error('Failed to delete user');
      });
    }
  }

  // Bulk upload users (logic to be implemented)
  onBulkUpload(): void {
    // Logic to handle bulk upload
  }


  // openAddUser(): void {
  //   this.selectedUser = null; // For adding a new user
  //   this.showPopup = true;
  // }

  
  openAddUser(): void {
  const dialogRef = this.dialog.open(UserPopupComponent, {
    width: '60%',
    // data:   this.regionList 
  });

  dialogRef.afterClosed().subscribe((result) => {
    this.loadUsers();
    console.log('Dialog closed');
  });
}



  openEditUser(user: IUser): void {
    this.selectedUser = user; 
    this.showPopup = true;
  }

  saveUser(user: IUser): void {
    if (this.selectedUser) {
      const index = this.users.findIndex(u => u.userID === user.userID);
      if (index !== -1) this.users[index] = user;
    } else {
      this.users.push(user);
    }
  }

  closePopup(): void {
    this.showPopup = false;
  }
    
// onSearchChange() {
//   this.filterUsers();
// }

 // Search functionality
//  onSearchChange(): void {
//   const query = this.searchQuery.toLowerCase().trim();  // Normalize the query to lowercase and remove leading/trailing spaces
  
//   if (query) {
//     this.filteredUserList = this.users.filter(user => {
//       return (
//         (user.userName && user.userName.toLowerCase().includes(query)) ||
//         (user.displayName && user.displayName.toLowerCase().includes(query)) ||
//         (user.mobileNumber && user.mobileNumber.toLowerCase().includes(query))
//       );
//     });
//   } else {
//     // If no query, reset to full list and optionally sort
//     this.filteredUserList = [...this.filteredUserList];  // Reset to the full list of regions
    
//     // Optional: Sort regions by countryName as a default behavior when no query is entered
//     this.filteredUserList.sort((a, b) => {
//       const countryNameA = a.userName || '';
//       const countryNameB = b.userName || '';
//       return countryNameA.localeCompare(countryNameB);
//     });
//   }

//   // Recalculate total pages after filtering
//   this.totalPages = Math.ceil(this.filteredUserList.length / this.itemsPerPage);
//   this.currentPage = 1;  // Reset to first page after search
//   this.updatePagedData(); // Update displayed data after filtering
// }

onSearchChange() {
  this.filterUsers();
}

//   filterUsers() {
//   this.filteredUserList = this.users.filter(user =>
//     user.userName.toLowerCase().includes(this.searchQuery.toLowerCase())
//   );
//   this.totalPages = Math.ceil(this.filteredUserList.length / this.itemsPerPage);
//   this.currentPage = 1;  
//   this.updatePagedData(); 
// }

filterUsers() {
  this.filteredUserList = this.users.filter(user =>
    user.userName.toLowerCase().includes(this.searchQuery.toLowerCase())
  );
  this.totalPages = Math.ceil(this.filteredUserList.length / this.itemsPerPage);
  this.currentPage = 1;  
  this.updatePagedData(); 
}

 
  updatePagedData() {
  const start = (this.currentPage - 1) * this.itemsPerPage;
  const end = start + this.itemsPerPage;
  this.usersForCurrentPage = this.filteredUserList.slice(start, end);
}

changePage(pageNumber: number) {
  if (pageNumber >= 1 && pageNumber <= this.totalPages) {
    this.currentPage = pageNumber;
    this.updatePagedData();
  }
}

  exportPDF(): void {
    const doc = new jsPDF();
    const tableHeader = ['Login ID', 'User Name', 'Role Name', 'Mobile Number','Employee ID','Status'];
    const tableData = this.users.map(user => [
      user.userID,
      user.userName,
      user.roleID,
      user.mobileNumber,
      user.employeeCode,
      user.isActive
    ]);

    doc.text('User List', 14, 10);

    (doc as any).autoTable({
      head: [tableHeader],
      body: tableData,
      startY: 20, 
      styles: {
        fontSize: 10,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [22, 160, 133] 
      },
      didDrawPage: (data: { pageNumber: number }) => {
        const pageCount = doc.getNumberOfPages();
        const pageNumber = `Page ${data.pageNumber} of ${pageCount}`;
        const pageSize = doc.internal.pageSize;
        const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
        doc.text(pageNumber, 10, pageHeight - 10);
      }
    });

    doc.save('users.pdf');
  }

  exportExcel(): void {
    const headers = ['Login ID', 'User Name', 'Role Name', 'Mobile Number','Employee ID','Status'];
    const formattedData = this.users.map(user => [
      user.userID,
      user.userName,
      user.roleID,
      user.mobileNumber,
      user.employeeCode,
      user.isActive
    ]);

    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([headers, ...formattedData]);
    const range = XLSX.utils.decode_range(ws["!ref"] || "");
    for (let col = range.s.c; col <= range.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col }); 
      if (!ws[cellAddress]) continue;
      ws[cellAddress].s = { font: { bold: true } }; 
    }
    const wb: XLSX.WorkBook = { Sheets: { clients: ws }, SheetNames: ["clients"] };
    XLSX.writeFile(wb, "users.xlsx");
  }
  

  fetchPermissions(userId: number): void {
    debugger
    this.apiService.getrolepermission(userId).subscribe(
      (response: IPermission[]) => {
        this.permissions = response;
  
        // Extract the permissions for menu_id = 1
        this.userPermissions = response.find(item => item.menuName === "Users");
  
        // Extract the permissions for all other menu_ids
        this.otherPermissions = response.filter(item => item.menuName !== "Users");
  
        // Determine if the user has permission to add/edit clients
        this.hasAddPermission = this.userPermissions ? this.userPermissions.can_add : false;
        this.hasEditPermission = this.userPermissions ? this.userPermissions.can_edit : false;
      },
      (error) => {
        console.error('Error fetching permissions:', error);
      }
    );
  }


  handleClick(): void {
      debugger
      if (!this.hasAddPermission) {
       Swal.fire({
                    icon: 'warning',
                    title: 'No Rights',
                    text: 'You do not have permission to add or edit Users Details!',
                    timer: 1500
                  });
                  return;
      } else {
        // Proceed with the intended action
        this.openAddUser() ;
      }
    }
  
  
    handleeditClick(user: IUser): void {
      debugger
      if (!this.hasEditPermission) {
     Swal.fire({
                  icon: 'warning',
                  title: 'No Rights',
                  text: 'You do not have permission to add or edit Users Details!',
                  timer: 1500
                });
                return;
      } else {
        // Proceed with the intended action
        this.onEditUser(user) ;
      }
    }
}
