import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ApiServiceService } from '../../services/api-service.service';
import { ITenant } from '../../Interface/ITenant';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { MatDialog } from '@angular/material/dialog';
import { TenantpopupComponent } from '../../Popup/popup/tenantpopup/tenantpopup.component';


@Component({
  selector: 'app-tenant',
  standalone: true, 
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    TenantpopupComponent
  ], 
  templateUrl: './tenant.component.html',
  styleUrls: ['./tenant.component.css']
})
export class TenantComponent implements OnInit {
  serviceagency: ITenant[] = [];
  
  filteredtenantList: ITenant[] = [];
  tenantsForCurrentPage: ITenant[] = [];
  tenantsForPage: ITenant[] = [];
  selectedGrid: string = 'tenantName';  
  searchQuery: string = '';
  currentPage  = 1;
  totalPages = 1;
  itemsPerPage = 10;
  tenant: any;
  localStorageService: any;
 
  constructor(
    private tenantService: ApiServiceService,
    private toastr: ToastrService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadTenants();
    this.updatePagedData();
  }

  
  loadTenants(): void {
    this.tenantService.getTenantdata().subscribe({
      next: (response) => {
        this.tenantsForPage = response;
        const nonDeletedTenants = response.filter(tenant => tenant.IsDelete === false);
        this.filteredtenantList = [...this.tenantsForPage];  // Initially show all tenants
        this.totalPages = Math.ceil(this.filteredtenantList.length / this.itemsPerPage);  
        this.updatePagedData();
      },
      error: (error) => {
        this.toastr.error('Failed to load tenant data', 'Error');
      }
    });
  }
  
  

  onEditTenant(tenant: ITenant): void {
    debugger
    localStorage.setItem('isEditMode', 'true');
    const dialogRef = this.dialog.open(TenantpopupComponent, {
      width: '60%',
      data: tenant  
    });
  
    dialogRef.afterClosed().subscribe((tenant) => {
      if (tenant) {
  
        console.log('this.tenant:', this.tenant);
  
        const index = this.tenant.findIndex((t: ITenant) => t.tenantID === tenant.tenantID);
        
        if (index !== -1) {
      
          this.tenant[index] = tenant;
          this.filteredtenantList = [...this.tenant]; 
        }
        
      }
      this.loadTenants();
    });
  }    
 
  filterProducts(): void {
    if (this.searchQuery.trim() === '') {
      this.filteredtenantList = [...this.tenantsForPage];  
    } else {
      this.filteredtenantList = this.tenantsForPage.filter(tenant =>
        tenant.tenantName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        tenant.tenantHead.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        tenant.tenantEmailID.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  
    this.totalPages = Math.ceil(this.filteredtenantList.length / this.itemsPerPage);
    
    this.currentPage = 1;
  
    this.updatePagedData();
  }
  
  
  onSearchChange(): void {
    debugger
    this.filterProducts();
  }  
  changePage(pageNumber: number): void {
    if (pageNumber >= 1 && pageNumber <= this.totalPages) {
      this.currentPage = pageNumber;
      this.updatePagedData();  
    }
  }
  

  updatePagedData(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    
    this.tenantsForCurrentPage = this.filteredtenantList.slice(start, end);
    console.log('Data for Current Page:', this.tenantsForCurrentPage);
  }
  
 
 
  openAddTenant(): void {
    debugger
    console.log('Open Add Tenant Popup');
    localStorage.setItem('isEditMode', 'false');
    const dialogRef = this.dialog.open(TenantpopupComponent, {
      width: '60%',
    });

    dialogRef.afterClosed().subscribe(() => {
      this.loadTenants(); 
    });    
  }
 
onDeleteTenant(tenantID: number): void {
  debugger
  if (confirm('Are you sure you want to delete this Tenant?')) {
    this.tenantService.deleteTenant(tenantID).subscribe({
      next: (response: any) => {
        this.toastr.success('Tenant deleted successfully.', 'Success', { timeOut: 3000 });    
        this.loadTenants(); 
      },
      error: (error) => {
        console.error('Error deleting Tenant:', error);
        this.toastr.error('Failed to delete Tenant. Check logs for details.', 'Error', { timeOut: 3000 });
        this.loadTenants();
      }
    });
  }
}

  exportPDF(): void {
    const doc = new jsPDF();
    const tableHeader = ['Tenant ID', 'Tenant Name', 'Tenant Head', 'Tenant Email ID'];
    const tableData = this.filteredtenantList.map(tenant => [
      tenant.tenantID,
      tenant.tenantName,
      tenant.tenantHead,
      tenant.tenantEmailID
    ]);
  
    doc.text('Tenant List', 14, 10);
  
    (doc as any).autoTable({
      head: [tableHeader],
      body: tableData,
      startY: 20,
      styles: {
        fontSize: 10,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [22, 160, 133] // Header background color
      },
      didDrawPage: (data: { pageNumber: number }) => {
        const pageCount = doc.getNumberOfPages();
        const pageNumber = `Page ${data.pageNumber} of ${pageCount}`;
        const pageSize = doc.internal.pageSize;
        const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
        doc.text(pageNumber, 10, pageHeight - 10);
      }
    });
  
    doc.save('tenants.pdf');
  }
  

  exportExcel(): void {
    const headers = ['Tenant ID', 'Tenant Name', 'Tenant Head', 'Tenant Email ID'];
    const formattedData = this.filteredtenantList.map(tenant => [
      tenant.tenantID,
      tenant.tenantName,
      tenant.tenantHead,
      tenant.tenantEmailID
    ]);
  
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([headers, ...formattedData]);
    const range = XLSX.utils.decode_range(ws["!ref"] || "");
    for (let col = range.s.c; col <= range.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
      if (!ws[cellAddress]) continue;
      ws[cellAddress].s = { font: { bold: true } }; 
    }
    const wb: XLSX.WorkBook = { Sheets: { tenants: ws }, SheetNames: ["tenants"] };
    XLSX.writeFile(wb, "tenants.xlsx");
  }
  
}
