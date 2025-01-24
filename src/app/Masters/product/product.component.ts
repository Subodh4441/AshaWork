import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiServiceService } from '../../services/api-service.service';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { IProduct } from '../../Interface/IProduct';
import { ProductpopupComponent } from '../../Popup/popup/productpopup/productpopup.component';
import { MatDialog } from '@angular/material/dialog';
import { BulkuploadpopupComponent } from '../../Popup/bulkuploadpopup/bulkuploadpopup.component';
import { DynamicBulkUploadComponent } from '../../Popup/dynamic-bulk-upload/dynamic-bulk-upload.component';
import { ToastrService } from 'ngx-toastr';
import { IPermission } from '../../Interface/IPermission';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
  template: `<app-dynamic-bulk-upload
               [entityType]="'Product'"
               [fields]="clientFields"
               (uploadSuccess)="handleUploadSuccess()"
               (uploadFailure)="handleUploadFailure($event)">
             </app-dynamic-bulk-upload>`
})
export class ProductComponent implements OnInit {

  clientFields: string[] = ['Client ID', 'Client Name', 'Contact Email', 'Phone'];

  product: IProduct[] = [];
  filteredProductList: IProduct[] = [];
  productForCurrentPage: IProduct[] = [];
  searchQuery: string = '';
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1; 

  public permissions: any[] = [];
  hasAddPermission: boolean = false;
  hasEditPermission: boolean = false;

  productPermissions: any = {};  // Store client-specific permissions
  otherPermissions: any[] = [];  // Store other menu permissions
  roleID:any;

  constructor(private api: ApiServiceService, public dialog: MatDialog,private toastr: ToastrService) {
    this.api.setString('products');
  }

  ngOnInit(): void {
    this.fetchProducts();

    this.roleID = sessionStorage.getItem('role');

    this.fetchPermissions(this.roleID);
  }
  handleUploadSuccess(): void {
    //this.toastr.success('Product data uploaded successfully!', 'Success', { timeOut: 3000 });

    this.toastr.success('Product data uploaded successfully!', "Success", {
      timeOut: 3000,
      positionClass: 'toast-bottom-center' // This sets the position to the bottom center
    });

  }

  handleUploadFailure(message: string): void {
//  this.toastr.error('Upload failed', 'Error', { timeOut: 3000 });
 this.toastr.error('Product data uploaded successfully!', "Error", {
  timeOut: 3000,
  positionClass: 'toast-bottom-center' // This sets the position to the bottom center
});
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
    this.productForCurrentPage = this.filteredProductList.slice(start, end);
    console.log(this.productForCurrentPage);

  }

  fetchProducts(): void {
    this.api.getProducts().subscribe(
      (response) => {
        this.product = response;
        this.filteredProductList = [...this.product];
        this.totalPages = Math.ceil(this.filteredProductList.length / this.itemsPerPage);
        this.updatePagedData(); 
      },
      (error) => {
  this.toastr.error('Error while fetching products', 'Error', { timeOut: 3000 });
        console.error('Error while fetching products:', error);
      }
    );
  }

  filterProducts(): void {
    this.filteredProductList = this.product.filter(product =>
      product.prodName.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
    this.totalPages = Math.ceil(this.filteredProductList.length / this.itemsPerPage);
    this.currentPage = 1; 
    this.updatePagedData(); 
  }

  onSearchChange(): void {
    this.filterProducts();
  }
  openbulkPopup(product:string) {
    const dialogRef = this.dialog.open(DynamicBulkUploadComponent, {
      width: '60%',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed');
      this.fetchProducts();  
    });
  }
  openAddProductPopup(): void {
    const dialogRef = this.dialog.open(ProductpopupComponent, {
      width: '60%',
    });

    dialogRef.afterClosed().subscribe(() => {
      this.fetchProducts(); 
    });
  }

 
  openEditProductPopup(product: IProduct): void {
    const dialogRef = this.dialog.open(ProductpopupComponent, {
      width: '60%',
      data: { product }  
    });

    dialogRef.afterClosed().subscribe(result => {
      this.fetchProducts(); 
    });
  }

  exportPDF(): void {
    const doc = new jsPDF();
    const tableHeader = [ 'Product Name', 'Product ABBR'];
    const tableData = this.product.map(product => [
      product.prodName,
      product.prodAbbr,
    ]);

    doc.text('Product List', 14, 10);
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
    doc.save('products.pdf');
  }

  exportExcel(): void {
    const headers = [ "PRODUCT NAME", "PRODUCT ABBR"];
    const formattedData = this.product.map(product => [
      product.prodName,
      product.prodAbbr,
    ]);
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([headers, ...formattedData]);
    const range = XLSX.utils.decode_range(ws["!ref"] || "");
    for (let col = range.s.c; col <= range.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
      if (!ws[cellAddress]) continue;
      ws[cellAddress].s = { font: { bold: true } };
    }
    const wb: XLSX.WorkBook = { Sheets: { products: ws }, SheetNames: ["products"] };
    XLSX.writeFile(wb, "products.xlsx");
  }


  fetchPermissions(userId: number): void {
    debugger
    this.api.getrolepermission(userId).subscribe(
      (response: IPermission[]) => {
        this.permissions = response;
  
        // Extract the permissions for menu_id = 1
        this.productPermissions = response.find(item => item.menuName === "Products");
  
        // Extract the permissions for all other menu_ids
        this.otherPermissions = response.filter(item => item.menuName !== "Products");
  
        // Determine if the user has permission to add/edit clients
        this.hasAddPermission = this.productPermissions ? this.productPermissions.can_add : false;
        this.hasEditPermission = this.productPermissions ? this.productPermissions.can_edit : false;
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
               text: 'You do not have permission to add or edit Product Details!',
               timer: 1500
             });
             return;
      } else {
        // Proceed with the intended action
        this.openAddProductPopup() ;
      }
    }
  
  
    handleeditClick(product: IProduct): void {
      debugger
      if (!this.hasEditPermission) {
      Swal.fire({
              icon: 'warning',
              title: 'No Rights',
              text: 'You do not have permission to add or edit Product Details!',
              timer: 1500
            });
            return;
      } else {
        // Proceed with the intended action
        this.openEditProductPopup(product) ;
      }
    }
  
}
