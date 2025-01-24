
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiServiceService } from '../../services/api-service.service';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { MatDialog } from '@angular/material/dialog';
import { DynamicBulkUploadComponent } from '../../Popup/dynamic-bulk-upload/dynamic-bulk-upload.component';
import { ToastrService } from 'ngx-toastr';
import { IServiceAgency } from '../../Interface/service-agency';
import { ServiceAgencypopupComponent } from '../../Popup/service-agencypopup/service-agencypopup.component';
import { IPermission } from '../../Interface/IPermission';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-service-agency',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './service-agency.component.html',
  styleUrl: './service-agency.component.css'
})
export class ServiceAgencyComponent {


  serviceagency: IServiceAgency[] = [];
  filteredServiceAgencyList: IServiceAgency[] = [];
  serviceForCurrentPage: IServiceAgency[] = [];
  searchQuery: string = '';
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1; 
 
  public permissions: any[] = [];
  hasAddPermission: boolean = false;
  hasEditPermission: boolean = false;


  clientPermissions: any = {};  // Store client-specific permissions
  otherPermissions: any[] = [];  // Store other menu permissions
  roleID: any;


  
  constructor(private api: ApiServiceService, public dialog: MatDialog,private toastr: ToastrService) {
    this.api.setString('service-agency');
  }

  ngOnInit(): void {
    this.fetchServiceAgency();
    this.updatePagedData();

    this.roleID = sessionStorage.getItem('role');
    this.fetchPermissions(this.roleID);

    history.pushState(null, '', location.href);
    window.onpopstate = function() {
      history.pushState(null, '', location.href); 
    };
  }
  
    changePage(pageNumber: number): void {
      debugger
      if (pageNumber >= 1 && pageNumber <= this.totalPages) {
        this.currentPage = pageNumber;
        this.updatePagedData();
      }
    } 
  
    updatePagedData(): void {
      debugger
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      this.serviceForCurrentPage = this.filteredServiceAgencyList.slice(start, end);
      console.log('Data for Current Page:',this.serviceForCurrentPage);
  
    }
  
    fetchServiceAgency(): void {
      this.api.getServiceAgency().subscribe(
        (response) => {
          debugger
          this.serviceagency = response;
          this.filteredServiceAgencyList = [...this.serviceagency];
          this.totalPages = Math.ceil(this.filteredServiceAgencyList.length / this.itemsPerPage);
           this.updatePagedData(); 
          
          console.log('Fetched Service Agencies:', this.filteredServiceAgencyList);
        },
        (error) => {
    this.toastr.error('Error while fetching service Agency', 'Error', { timeOut: 3000 });
          console.error('Error while fetching Service Agency:', error);
        }
      );
    }
  
    filterProducts(): void {
      debugger
      this.filteredServiceAgencyList = this.serviceagency.filter(serviceagency =>
        serviceagency.serviceAgencyName.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
      this.totalPages = Math.ceil(this.filteredServiceAgencyList.length / this.itemsPerPage);
      this.currentPage = 1; 
      this.updatePagedData(); 
    }
  
    onSearchChange(): void {
      this.filterProducts();
    }
    openbulkPopup(product:string) {
      const dialogRef = this.dialog.open(DynamicBulkUploadComponent, {
        width: '600px',
      });
  
      dialogRef.afterClosed().subscribe(result => {
        console.log('Dialog closed');
        this.fetchServiceAgency();  
      });
    }
    openAddServiceAgencyPopup(): void {
      const dialogRef = this.dialog.open(ServiceAgencypopupComponent, {
        width: '600px',
      });
  
      dialogRef.afterClosed().subscribe(() => {
        this.fetchServiceAgency(); 
      });
    }
  
   

    openEditServiceAgencyPopup(serviceAgency: IServiceAgency): void {
      const dialogRef = this.dialog.open(ServiceAgencypopupComponent, {
        width: '600px',
        data: serviceAgency // Pass the object directly
      });
    
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.fetchServiceAgency(); // Refresh if there's a result
          const index = this.serviceagency.findIndex(sa => sa.id === result.id);
          if (index !== -1) {
            this.serviceagency[index] = result; // Update the local array
            this.filteredServiceAgencyList = [...this.serviceagency];
            this.updatePagedData();
          }
        }
      });
    }
    



    exportPDF(): void {
      const doc = new jsPDF();
      const tableHeader =  ['serviceAgencyName', 'stateId', 'cityId','address','pinCode','contactName','contactMobile','contactEmail','active'];
      const tableData = this.serviceagency.map(serviceagency => [
        serviceagency.serviceAgencyName,
        serviceagency.stateId,
        serviceagency.cityId,
        serviceagency.cityName,
        serviceagency.stateName,
        serviceagency.address,
        serviceagency.pinCode,
        serviceagency.contactName,
        serviceagency.contactMobile,
        serviceagency.contactEmail,
        serviceagency.active
      ]);
  
      doc.text('Service Agency List', 14, 10);
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
      doc.save('ServiceAgency.pdf');
    } 
    

    exportExcel(): void {
      debugger;
      const headers = ['Service Agency Name', 'State ID', 'City ID', 'Address', 'Pin Code', 'Contact Name', 'Contact Mobile', 'Contact Email', 'Active'];
      
      
      const formattedData = this.serviceagency.map(serviceAgency => [ 
        serviceAgency.serviceAgencyName,
        serviceAgency.stateId,
        serviceAgency.cityId,
        serviceAgency.address,
        serviceAgency.pinCode,
        serviceAgency.contactName,
        serviceAgency.contactMobile,
        serviceAgency.contactEmail,
        serviceAgency.active ? 'Yes' : 'No' // Convert boolean to readable format
      ]);
    
      // Combine headers and data
      const worksheetData = [headers, ...formattedData];
    
      // Create worksheet
      const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(worksheetData);
    
      // Apply styles to headers
      const range = XLSX.utils.decode_range(ws["!ref"] || "");
      for (let col = range.s.c; col <= range.e.c; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col }); // First row (header row)
        if (!ws[cellAddress]) continue;
        ws[cellAddress].s = { font: { bold: true } }; // Apply bold styling to the header
      }
    
      // Create workbook
      const wb: XLSX.WorkBook = { Sheets: { ServiceAgency: ws }, SheetNames: ["ServiceAgency"] };
    
      // Write the workbook to a file
      XLSX.writeFile(wb, "ServiceAgency.xlsx");
    }

    updateServiceAgency(serviceAgency: IServiceAgency): void {
      // Ensure the active property is correctly set to either 0 or 1
      const updatedServiceAgency = {
        ...serviceAgency,
        active: serviceAgency.active === 1 ? 1 : 0  // Ensure active is either 1 or 0
      };
   
      this.api.UpdateServiceAgency(updatedServiceAgency).subscribe({
        next: (response) => {
          console.log('Service Agency updated successfully:', response);
          this.toastr.success('Service Agency updated successfully!', 'Success', { timeOut: 3000 });
        },
        error: (error) => {
          console.error('Error updating Service Agency:', error);
          this.toastr.error('Failed to update Service Agency. Check logs for details.', 'Error', { timeOut: 3000 });
        }
      });
    }
    

    fetchPermissions(userId: number): void {
        debugger
        debugger
        this.api.getrolepermission(userId).subscribe(
          (response: IPermission[]) => {
            this.permissions = response;
      
            // Extract the permissions for menu_id = 1
            this.clientPermissions = response.find(item => item.menuName === "Service Agency");
      
            // Extract the permissions for all other menu_ids
            this.otherPermissions = response.filter(item => item.menuName !== "Service Agency");
      
            // Determine if the user has permission to add/edit clients
            this.hasAddPermission = this.clientPermissions ? this.clientPermissions.can_add : false;
            this.hasEditPermission = this.clientPermissions ? this.clientPermissions.can_edit : false;
          },
          (error) => {
            console.error('Error fetching permissions:', error);
          }
        );
      }
      
      canAddClient(): boolean {
        return this.clientPermissions && this.clientPermissions.can_add;
      }
    
      canEditClient(): boolean {
        return this.clientPermissions && this.clientPermissions.can_edit;
      }
    
    
      handleClick(): void {
        debugger
        if (!this.hasAddPermission) {
          Swal.fire({
                           icon: 'warning',
                           title: 'No Rights',
                           text: 'You do not have permission to add or edit Client Details!',
                           timer: 1500
                         });
                         return;
        } else {
          // Proceed with the intended action
          this.openAddServiceAgencyPopup() ;
        }
      }
    
    
      handleeditClick(serviceAgency: IServiceAgency): void {
        debugger
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
          this.openEditServiceAgencyPopup(serviceAgency) ;
        }
      }
}
