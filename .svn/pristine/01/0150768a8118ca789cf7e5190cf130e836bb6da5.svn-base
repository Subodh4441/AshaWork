import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiServiceService } from '../../services/api-service.service';
import { IClient } from '../../Interface/IClient';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { MatDialog } from '@angular/material/dialog';
import { ClientpopupComponent } from '../../Popup/popup/clientpopup/clientpopup.component';
import { BulkuploadpopupComponent } from '../../Popup/bulkuploadpopup/bulkuploadpopup.component';
import { ToastrService } from 'ngx-toastr';
import { IPermission } from '../../Interface/IPermission';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-client',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit {

  client: IClient[] = [];
  filteredClientList: IClient[] = [];
  clientsForCurrentPage: IClient[] = []; 
  searchQuery: string = '';
  clientName: string = '';
  selectedClientType: string = '';
  clientTypes: string[] = ['Corporate', 'Individual'];

  public permissions: any[] = [];
  hasAddPermission: boolean = false;
  hasEditPermission: boolean = false;

  clientPermissions: any = {};  // Store client-specific permissions
  otherPermissions: any[] = [];  // Store other menu permissions
  roleID: any;

  currentPage = 1;
  itemsPerPage = 10;  
  totalPages = 1; 

  constructor(private apiService: ApiServiceService,private toastr: ToastrService, public dialog: MatDialog) {
    this.apiService.setString('clients');
  }

  ngOnInit(): void {
    this.roleID = sessionStorage.getItem('role');
    this.fetchClients();
    this.fetchPermissions(this.roleID);
    this.updatePagedData();
        // we  use  for this to  unable to work back space in customerInfo page in browser
        history.pushState(null, '', location.href);
        window.onpopstate = function() {
        history.pushState(null, '', location.href);
        };
  }

  fetchClients(): void {
    this.apiService.getClients().subscribe(
      (data) => {
        console.log("fetchClients response",data);
        console.log(" this.client response", this.client);
        console.log(" filteredClientList response", this.filteredClientList);
       
        this.client = data;
        this.filteredClientList = [...this.client];  
        this.totalPages = Math.ceil(this.filteredClientList.length / this.itemsPerPage);
        this.updatePagedData();
      },
      (error) => {
        console.error('Error fetching clients:', error);
      }
    );
  }

  filterClients() {
    this.filteredClientList = this.client.filter(client =>
      client.clientName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      client.clientAbbr.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      client.owner.toLowerCase().includes(this.searchQuery.toLowerCase()) 

    );

    this.totalPages = Math.ceil(this.filteredClientList.length / this.itemsPerPage);
    this.currentPage = 1;  
    this.updatePagedData(); 
  }

  onSearchChange() {
    this.filterClients();
  }

  updatePagedData() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.clientsForCurrentPage = this.filteredClientList.slice(start, end);
  }

  changePage(pageNumber: number) {
    if (pageNumber >= 1 && pageNumber <= this.totalPages) {
      this.currentPage = pageNumber;
      this.updatePagedData();
    }
  }

  openAddClientPopup1() {
    const dialogRef = this.dialog.open(ClientpopupComponent);

      dialogRef.afterClosed().subscribe((response: string) => {
      if (response) {
        console.log("Dialog closed with response:", response);
        this.fetchClients();
        // this.toastr.success(response, "Success", { timeOut: 3000 });
        this.toastr.success(response, "Success", {
          timeOut: 3000,
          positionClass: 'toast-bottom-center' // This sets the position to the bottom center
        });
      }
      else{
        // this.toastr.error('Something went wrong!', "Error", { timeOut: 3000 });
        // this.toastr.error('Something went wrong!', "Error", {
        //   timeOut: 3000,
        //   positionClass: 'toast-bottom-center' // This sets the position to the bottom center
        // });
      }
    });
  }
  openAddClientPopup() {
    const dialogRef = this.dialog.open(ClientpopupComponent, {
      width: '600px',
    });

      dialogRef.afterClosed().subscribe((response: string) => {
      if (response) {
        console.log("Dialog closed with response:", response);
        this.fetchClients();
        // this.toastr.success(response, "Success", {
        //   timeOut: 3000,
        //   positionClass: 'toast-bottom-center' 
        // });
       // this.toastr.success(response, "Success", { timeOut: 3000 });
      }
      // else{
      //   this.toastr.success('Something went wrong!', "Error", {
      //     timeOut: 3000,
      //     positionClass: 'toast-bottom-center' 
      //   });
      //  // this.toastr.error('Something went wrong!', "Error", { timeOut: 3000 });
      // }
    });
  }


  openbulkPopup() {
    const dialogRef = this.dialog.open(BulkuploadpopupComponent, {
      width: '60%',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed');
      // this.fetchClients();  
    });
  }

  openEditClientPopup1(client: IClient) {
    const dialogRef = this.dialog.open(ClientpopupComponent, {
      width: '60%',
      data: { client } 
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.fetchClients();
        const index = this.client.findIndex(c => c.clientID === result.clientId);
        if (index !== -1) {
          this.client[index] = result;
          this.filteredClientList = [...this.client];  
          this.updatePagedData();  
        }
      }
    });
  }
  openEditClientPopup(client: IClient): void {

    if (!this.hasEditPermission) {
      alert('You do not have permission to edit this client.');
      return;
    }
    const dialogRef = this.dialog.open(ClientpopupComponent, {
      width: '600px',
      data: { client } 
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.fetchClients();
        const index = this.client.findIndex(c => c.clientID === result.clientId);
        if (index !== -1) {
          this.client[index] = result;
          this.filteredClientList = [...this.client];  
          this.updatePagedData();  
        }
        this.toastr.success('Client updated successfully!', "Success", {
          timeOut: 3000,
          positionClass: 'toast-bottom-center' 
        });
      }
    });
  }


  exportPDF(): void {
    const doc = new jsPDF();

    // Prepare the table header and data
    const tableHeader = ['Client Name', 'Client ABBR', 'Status', 'Project Owner'];
    const tableData = this.client.map(client => [
      client.clientName,
      client.clientAbbr,
      client.isActive ? 'Active' : 'Inactive',
      client.owner
    ]);

    // Add a title to the PDF
    doc.text('Client List', 14, 10);

    // Add the table using autoTable
    (doc as any).autoTable({
      head: [tableHeader],
      body: tableData,
      startY: 20, // Starting Y position for the table
      styles: {
        fontSize: 10, // Font size
        cellPadding: 3, // Cell padding
      },
      headStyles: {
        fillColor: [22, 160, 133] // Table header background color
      },
      didDrawPage: (data: { pageNumber: number }) => {
        // Add page numbers
        const pageCount = doc.getNumberOfPages();
        const pageNumber = `Page ${data.pageNumber} of ${pageCount}`;
        const pageSize = doc.internal.pageSize;
        const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
        doc.text(pageNumber, 10, pageHeight - 10);
      }
    });

    // Save the PDF
    doc.save('clients.pdf');
  }

  exportExcel(): void {
    // Define the headers
    const headers = ["CLIENT NAME", "CLIENT ABBR", "STATUS", "PROJECT OWNER"];

    // Format the data
    const formattedData = this.client.map(client => [
      client.clientName,
      client.clientAbbr,
      client.isActive ? "ACTIVE" : "INACTIVE",
      client.owner
    ]);

    // Create a worksheet from the headers and data
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([headers, ...formattedData]);

    // Style the headers (first row)
    const range = XLSX.utils.decode_range(ws["!ref"] || "");
    for (let col = range.s.c; col <= range.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col }); // First row cells
      if (!ws[cellAddress]) continue;
      ws[cellAddress].s = { font: { bold: true } }; // Set the font to bold
    }

    // Create the workbook and add the worksheet
    const wb: XLSX.WorkBook = { Sheets: { clients: ws }, SheetNames: ["clients"] };

    // Export the workbook to a file
    XLSX.writeFile(wb, "clients.xlsx");
  }



  fetchPermissions(userId: number): void {
    debugger
    debugger
    this.apiService.getrolepermission(userId).subscribe(
      (response: IPermission[]) => {
        this.permissions = response;
  
        // Extract the permissions for menu_id = 1
        this.clientPermissions = response.find(item => item.menuName === "Clients");
  
        // Extract the permissions for all other menu_ids
        this.otherPermissions = response.filter(item => item.menuName !== "Clients");
  
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
      this.openAddClientPopup() ;
    }
  }


  handleeditClick(client: IClient): void {
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
      this.openEditClientPopup(client) ;
    }
  }

}
