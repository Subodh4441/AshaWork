import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormsModule } from '@angular/forms';
import { ApiServiceService } from '../../../services/api-service.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { ISpare } from '../../../Interface/ISpare';
import { CommonModule } from '@angular/common';
import { SparepopupComponent } from '../../../Popup/popup/sparepopup/sparepopup/sparepopup.component';
import { SparenamepopupComponent } from '../../../Popup/popup/sparepopup/sparenamepopup/sparenamepopup/sparenamepopup.component';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { IPermission } from '../../../Interface/IPermission';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-spare',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './spare.component.html',
  styleUrl: './spare.component.css'
})
export class SpareComponent implements OnInit {
  selectedGrid: string = 'spareVariant';  // Default grid is spareVariant
  spares: ISpare[] = []; // For spare variant grid
  sparesname: ISpare[] = []; // For spare name grid
  searchQuery: string = ''; // Search query for filtering
  filteredSpareList: ISpare[] = []; // Filtered list for pagination
  spareList: any[] = []; 
  sparesForCurrentPage: ISpare[] = []; 

  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;

  public permissions: any[] = [];
  hasAddPermission: boolean = false;
  hasEditPermission: boolean = false;


  sparePermissions: any = {};  // Store client-specific permissions
  otherPermissions: any[] = [];  // Store other menu permissions
  roleID:any;


  constructor(
    private fb: FormBuilder,
    private apiService: ApiServiceService,
    private toastr: ToastrService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    //this.getsparevariantlist();
    this.updatePagedData();
    //this.getsparelist();
    this.onGridChange();
    this.roleID = sessionStorage.getItem('role');
    this.fetchPermissions(this.roleID);
  }

  setSelectedGrid(grid: string): void {
    this.selectedGrid = grid;
    this.onGridChange();
  }

  // Handle grid selection change
  onGridChange(): void {
    if (this.selectedGrid === 'spareName') {
      // Apply logic for spare names
      this.getsparelist();
    } else {
      // Apply logic for spare variants
      this.getsparevariantlist();
    }
  }

  // Fetch spare variant list
  getsparevariantlist(): void {
    this.apiService.getsparevariant().subscribe(
      (response: any) => {
        console.log(response)
        this.spares = response;  // Bind the spare variant array from response
        this.filteredSpareList = [...this.spares];  // Reset filtered list
        this.totalPages = Math.ceil(this.filteredSpareList.length / this.itemsPerPage);
        this.updatePagedData();
      },
      error => {
        // this.toastr.error('Failed to load spare variants');
        console.error('Error loading spares:', error);
      }
    );
  }

  // Fetch spare names list
  getsparelist(): void {
    this.apiService.getspare().subscribe(
      (response: any) => {
        console.log(response)
        this.sparesname = response;  // Bind the spare names array from response
        this.filteredSpareList = [...this.sparesname]; // Reset filtered list
        this.totalPages = Math.ceil(this.filteredSpareList.length / this.itemsPerPage);
        this.updatePagedData();
      },
      error => {
        // this.toastr.error('Failed to load spare names');
        console.error('Error loading spare names:', error);
      }
    );
  }

  // Update filtered data for pagination
  updatePagedData() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.sparesForCurrentPage = this.filteredSpareList.slice(start, end);
  }

  // Change the page when pagination occurs
  changePage(pageNumber: number) {
    if (pageNumber >= 1 && pageNumber <= this.totalPages) {
      this.currentPage = pageNumber;
      this.updatePagedData();
    }
  }

  // Search functionality
  onSearchChange() {
    this.filterSpare();
  }
  filterSpare(): void {

    if (this.selectedGrid === 'spareVariant')
      {   
      this.filteredSpareList = this.spares.filter(spare =>
      spare.spareName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      spare.spareVariant.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  
    this.totalPages = Math.ceil(this.filteredSpareList.length / this.itemsPerPage);
    this.currentPage = 1;  
    this.updatePagedData(); 
  }
  
  
    
    else
    {

      this.filteredSpareList = this.sparesname.filter(spare =>
        spare.spareName.toLowerCase().includes(this.searchQuery.toLowerCase()) 
      );
  
      this.totalPages = Math.ceil(this.filteredSpareList.length / this.itemsPerPage);
      this.currentPage = 1;  
      this.updatePagedData();
    }
 
  }
  
  
  

  // Opens the appropriate popup based on the selected grid
  openAddPopup(): void {
    if (this.selectedGrid === 'spareVariant') {
      const dialogRef = this.dialog.open(SparepopupComponent, { width: '600px' });
      dialogRef.afterClosed().subscribe((response: string) => {
        if (response) {
          this.getsparevariantlist();  // Reload the list if needed
          //  this.toastr.success("Spare varient added successfully", 'Success', { timeOut: 3000 });
        }
        //  else {
        //   this.toastr.error('Something went wrong!', 'Error', { timeOut: 3000 });
        // }
      });
    } else if (this.selectedGrid === 'spareName') {
      const dialogRef = this.dialog.open(SparenamepopupComponent, { width: '600px' });
      dialogRef.afterClosed().subscribe((response: string) => {
        if (response) {
          this.getsparelist();
          // this.toastr.success(response, 'Success', { timeOut: 3000 });
        } 
        // else {
        //   this.toastr.error('Something went wrong!', 'Error', { timeOut: 3000 });
        // }
      });
    }
  }

  openEditClientPopup(sparevariantData: ISpare) {
    debugger
    
    const dialogRef = this.dialog.open(SparepopupComponent, {
      width: '600px',
      data: { sparevariantData }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getsparevariantlist();
        const index = this.spares.findIndex(s => s.spareVariantID === result.spareVariantID);
        if (index !== -1) {
          this.spares[index] = result;
          this.filteredSpareList = [...this.spares];  
          this.updatePagedData();  
        }
      }
    });
  }


  openEditClientPopupSpareName(sparenameData: ISpare) {
    debugger
    
    const dialogRef = this.dialog.open(SparenamepopupComponent, {
      width: '600px',
      data: { sparenameData }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getsparelist();
        const index = this.spares.findIndex(s => s.spareVariantID === result.spareVariantID);
        if (index !== -1) {
          this.spares[index] = result;
          this.filteredSpareList = [...this.spares];  
          this.updatePagedData();  
        }
      }
    });
  }

  // Delete Spare Variant
  onDeleteSpareVariant(sparevariantId: number): void {
    if (confirm('Are you sure you want to delete this Spare Variant?')) {
      this.apiService.deleteSpareVariant(sparevariantId).subscribe({
        next: (response: string) => {
          this.toastr.success('Spare Variant deleted successfully.', 'Success', { timeOut: 3000 });
          this.getsparevariantlist();
        },
        error: (error) => {
          console.error('Error deleting Spare Variant:', error);
          this.toastr.error('Failed to delete Spare Variant. Check logs for details.', 'Error', { timeOut: 3000 });
        }
      });
    }
  }


   // Delete Spare Variant
   onDeleteSpare(spareId: number): void {
    if (confirm('Are you sure you want to delete this Spare?')) {
      this.apiService.deleteSpare(spareId).subscribe({
        next: (response: string) => {
          this.toastr.success('Spare  deleted successfully.', 'Success', { timeOut: 3000 });
          this.getsparelist();
        },
        error: (error) => {
          console.error('Error deleting Spare:', error);
          this.toastr.error('Failed to delete Spare. Check logs for details.', 'Error', { timeOut: 3000 });
        }
      });
    }
  }


  exportPDF(): void {
    debugger
    const doc = new jsPDF();
  
    // Define the table header for both views
    let tableHeader;
    let tableData;
  
    if (this.selectedGrid === 'spareVariant') {
      // If "spareVariant" is selected, use these headers and data
      tableHeader = ['SpareVariant ID', 'SpareVariant Name', 'Spare Name', 'IsActive'];
      tableData = this.spares.map(spare => [
        spare.spareVariantID,
        spare.spareVariant,
        spare.spareName,
        spare.isActive
      ]);

      doc.text('SpareVariant List', 14, 10);
  
    // Auto-table for PDF
    (doc as any).autoTable({
      head: [tableHeader],
      body: tableData,
      startY: 20,
      styles: {
        fontSize: 10,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [22, 160, 133],
      },
      didDrawPage: (data: { pageNumber: number }) => {
        const pageCount = doc.getNumberOfPages();
        const pageNumber = `Page ${data.pageNumber} of ${pageCount}`;
        const pageSize = doc.internal.pageSize;
        const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
        doc.text(pageNumber, 10, pageHeight - 10);
      }
    });
  
    doc.save('SpareVariant.pdf');
    } else if (this.selectedGrid === 'spareName') {
      // If "spareName" is selected, use these headers and data
      tableHeader = ['Spare Name','IsActive'];
      tableData = this.sparesname.map(sparesname => [
        sparesname.spareName,
        sparesname.isActive
      ]);

      doc.text('Spares List', 14, 10);
  
    // Auto-table for PDF
    (doc as any).autoTable({
      head: [tableHeader],
      body: tableData,
      startY: 20,
      styles: {
        fontSize: 10,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [22, 160, 133],
      },
      didDrawPage: (data: { pageNumber: number }) => {
        const pageCount = doc.getNumberOfPages();
        const pageNumber = `Page ${data.pageNumber} of ${pageCount}`;
        const pageSize = doc.internal.pageSize;
        const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
        doc.text(pageNumber, 10, pageHeight - 10);
      }
    });
  
    doc.save('Spares.pdf');
    }  
  }
  
  exportExcel(): void {
    if (this.selectedGrid === 'spareVariant') {
      const headers = ['Spare Variant ID', 'Spare Variant Name', 'Spare Name', 'IsActive']; 
      const formattedData = this.spares.map(spare => [
        spare.spareVariantID,
        spare.spareVariant,
        spare.spareName,
        spare.isActive
      ]);
  
      const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([headers, ...formattedData]);
      const range = XLSX.utils.decode_range(ws["!ref"] || "");
      
      // Style the headers (bold font)
      for (let col = range.s.c; col <= range.e.c; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
        if (!ws[cellAddress]) continue;
        ws[cellAddress].s = { font: { bold: true } }; 
      }
  
      const wb: XLSX.WorkBook = { Sheets: { clients: ws }, SheetNames: ["clients"] };
      XLSX.writeFile(wb, "SpareVariant.xlsx");
  
    } else if (this.selectedGrid === 'spareName') {
      const headers = ['Spare Name', 'IsActive'];
      const formattedData = this.sparesname.map(spareName => [
        spareName.spareName,
        spareName.isActive
      ]);
  
      const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([headers, ...formattedData]);
      const range = XLSX.utils.decode_range(ws["!ref"] || "");
      
      // Style the headers (bold font)
      for (let col = range.s.c; col <= range.e.c; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
        if (!ws[cellAddress]) continue;
        ws[cellAddress].s = { font: { bold: true } }; 
      }
  
      const wb: XLSX.WorkBook = { Sheets: { clients: ws }, SheetNames: ["clients"] };
      XLSX.writeFile(wb, "SpareName.xlsx"); // Changed file name to "SpareName.xlsx" to match the context
    }
  }
  


  fetchPermissions(userId: number): void {
    debugger
    this.apiService.getrolepermission(userId).subscribe(
      (response: IPermission[]) => {
        this.permissions = response;
  
        // Extract the permissions for menu_id = 1
        this.sparePermissions = response.find(item => item.menuName === "Spares");
  
        // Extract the permissions for all other menu_ids
        this.otherPermissions = response.filter(item => item.menuName !== "Spares");
  
        // Determine if the user has permission to add/edit clients
        this.hasAddPermission = this.sparePermissions ? this.sparePermissions.can_add : false;
        this.hasEditPermission = this.sparePermissions ? this.sparePermissions.can_edit : false;
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
          text: 'You do not have permission to add or edit Spares Details!',
          timer: 1500
        });
        return;
      } else {
        // Proceed with the intended action
        this.openAddPopup() ;
      }
    }
  
  
    handleeditClick(sparevariantData: ISpare): void {
      debugger
      if (!this.hasEditPermission) {
       Swal.fire({
                         icon: 'warning',
                         title: 'No Rights',
                         text: 'You do not have permission to add or edit Spares Details!',
                         timer: 1500
                       });
                       return;
      } else {
        // Proceed with the intended action
        this.openEditClientPopup(sparevariantData) ;
      }
    }

    handleDeleteClick(spareVariantID: number): void {
      debugger;
      if (!this.hasEditPermission) {
       Swal.fire({
                         icon: 'warning',
                         title: 'No Rights',
                         text: 'You do not have permission to add or edit Client Details!',
                         timer: 1500
                       });
                       return;
      } else {
        // Proceed with the intended action
        this.onDeleteSpareVariant(spareVariantID);
      }
    }
    
    
  
  
}
