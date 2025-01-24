import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiServiceService } from '../../services/api-service.service';
import { IBranch } from '../../Interface/IBranch';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { MatDialog } from '@angular/material/dialog';
import { BranchpopupComponent } from '../../Popup/popup/branchpopup/branchpopup.component';
import { DynamicBulkUploadComponent } from '../../Popup/dynamic-bulk-upload/dynamic-bulk-upload.component';
import { ToastrService } from 'ngx-toastr';
import { IPermission } from '../../Interface/IPermission';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-branches',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './branches.component.html',
  styleUrl: './branches.component.css'
})
export class BranchesComponent {
  branch: IBranch[] = [];
  filteredBranchList: IBranch[] = [];
  branchesForCurrentPage: IBranch[] = [];
  searchQuery: string = '';

  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;

  public permissions: any[] = [];
  hasAddPermission: boolean = false;
  hasEditPermission: boolean = false;


  branchPermissions: any = {};  // Store client-specific permissions
  otherPermissions: any[] = [];  // Store other menu permissions
  roleID:any;


    constructor(private apiService: ApiServiceService, private toastr: ToastrService, public dialog: MatDialog) {
    this.apiService.setString('branches');
  }

  ngOnInit(): void {
    this.fetchBranches();
    this.updatePagedData();
    this.roleID = sessionStorage.getItem('role');
    this.fetchPermissions(this.roleID)
  }
  
  fetchBranches(): void {
    this.apiService.getAllBranches().subscribe(
      (data) => {
        console.log('Fetched Branch Data:', data); 
        this.branch = data;
        this.filteredBranchList = [...this.branch];
        this.totalPages = Math.ceil(this.filteredBranchList.length / this.itemsPerPage);
        this.updatePagedData();
      },
      (error) => {
        console.error('Error fetching branches:', error);
      }
    );
  }
  
  filterBranches() {
    this.filteredBranchList = this.branch.filter(branch =>
      branch.machineID.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      branch.clientName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      branch.product.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      branch.stateName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      branch.cityName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      branch.areaClass.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      branch.branchCode.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      branch.branchName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      branch.serviceAgency.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      branch.accountManager.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      branch.ipAddress.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      branch.siteType.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      branch.ipAddress.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
    this.totalPages = Math.ceil(this.filteredBranchList.length / this.itemsPerPage);
    this.currentPage = 1;
    this.updatePagedData();
  }

  onSearchChange() {
    this.filterBranches();
  }

  
  updatePagedData() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.branchesForCurrentPage = this.filteredBranchList.slice(start, end);
  }

  changePage(pageNumber: number) {
    if (pageNumber >= 1 && pageNumber <= this.totalPages) {
      this.currentPage = pageNumber;
      this.updatePagedData();
    }
  }
  
  openAddBranchPopup() {
    const dialogRef = this.dialog.open(BranchpopupComponent, {
      width: '60%',
    });

    dialogRef.afterClosed().subscribe((response: string) => {
      if (response) {
        console.log("Dialog closed with response:", response);
        this.fetchBranches();
        // this.toastr.success(response, "Success", { timeOut: 3000 });
      } 
      // else {
      //   this.toastr.success('Something went wrong!', "Error", { timeOut: 3000 });
      //  // this.toastr.error('Something went wrong!', "Error", { timeOut: 3000 });
      // }
    });
  }
  openbulkPopup(uploadType: 'product' | 'branch') {
    const dialogRef = this.dialog.open(DynamicBulkUploadComponent, {
      width: '60%',
      data: { uploadType }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed');
    });
  }

  openEditBranchPopup(branch: IBranch) {
    const dialogRef = this.dialog.open(BranchpopupComponent, {
      width: '60%',
      data: { branch }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.fetchBranches();
        const index = this.branch.findIndex(b => b.id === result.Id);
        if (index !== -1) {
          this.branch[index] = result;
          this.filteredBranchList = [...this.branch];
          this.updatePagedData();
        }
      }
    });
  }

   
    
  exportPDF(): void {
  const doc = new jsPDF();

  const tableHeader = ['Machine ID', 'Client Name', 'Branch Name', 'Service Agency', 'Branch Code', 'IP Address', 'Branch Address'];

  const tableData = this.branch.map(branch => [
    branch.machineID, 
    branch.clientName,
    branch.branchName,
    branch.serviceAgency,
    branch.branchCode,
    branch.ipAddress,
    branch.branchAddress
  ]);
  doc.text('Branch List', 14, 10);

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

  doc.save('branches.pdf');
}

    
exportExcel(): void {
  const headers = ["MACHINE ID", "CLIENT NAME", "BRANCH NAME", "SERVICE AGENCY", "BRANCH CODE", "IP ADDRESS", "BRANCH ADDRESS"];

  const formattedData = this.branch.map(branch => [
    branch.machineID,
    branch.clientName,
    branch.branchName,
    branch.serviceAgency,
    branch.branchCode,
    branch.ipAddress,
    branch.branchAddress
  ]);

  const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([headers, ...formattedData]);

  const range = XLSX.utils.decode_range(ws["!ref"] || "");
  for (let col = range.s.c; col <= range.e.c; col++) {
    const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
    if (!ws[cellAddress]) continue;
    ws[cellAddress].s = { font: { bold: true } };
  }

  const wb: XLSX.WorkBook = { Sheets: { branches: ws }, SheetNames: ["branches"] };

  XLSX.writeFile(wb, "branches.xlsx");
}


fetchPermissions(userId: number): void {
  debugger
  this.apiService.getrolepermission(userId).subscribe(
    (response: IPermission[]) => {
      this.permissions = response;

      // Extract the permissions for menu_id = 1
      this.branchPermissions = response.find(item => item.menuName === "Branches");

      // Extract the permissions for all other menu_ids
      this.otherPermissions = response.filter(item => item.menuName!== "Branches");

      // Determine if the user has permission to add/edit clients
      this.hasAddPermission = this.branchPermissions ? this.branchPermissions.can_add : false;
      this.hasEditPermission = this.branchPermissions ? this.branchPermissions.can_edit : false;
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
             text: 'You do not have permission to add or edit Branches!',
             timer: 1500
           });
           return;
    } else {
      // Proceed with the intended action
      this.openAddBranchPopup() ;
    }
  }


  handleeditClick(branch: IBranch): void {
    debugger
    if (!this.hasEditPermission) {
       Swal.fire({
             icon: 'warning',
             title: 'No Rights',
             text: 'You do not have permission to add or edit Branches!',
             timer: 1500
           });
           return;
    } else {
      // Proceed with the intended action
      this.openEditBranchPopup(branch) ;
    }
  }
}

