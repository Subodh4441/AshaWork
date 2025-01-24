import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IProduct } from '../../../Interface/IProduct'; 
import { CommonModule } from '@angular/common';
import { ApiServiceService } from '../../../services/api-service.service';
import { map, Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-productpopup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './productpopup.component.html',
  styleUrls: ['./productpopup.component.css']
})
export class ProductpopupComponent {
  product: IProduct = { productId: 0, prodName: '', prodAbbr: '' }; // Default for new product
  productName = '';
  productAbbr = '';
  savetext: string | undefined="Save";
  isEditMode = false; // To track whether we are editing or creating

  constructor(
    public dialogRef: MatDialogRef<ProductpopupComponent>,
    private toastr: ToastrService,
    private api: ApiServiceService, 
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data == null) {
      this.savetext = "Save";
    }
    else if (data.product) {
      this.savetext = "Update";
      this.isEditMode = true;
      this.product = { ...data.product }; // Clone the product to ensure we're not modifying the original object
    }
  }

  ngOnInit(): void {
    this.productName = this.product.prodName || '';
    this.productAbbr = this.product.prodAbbr || '';
  }

  onClientNameInput(): void {
    this.productName = this.productName.replace(/[^a-zA-Z]/g, '');
  }

  checkDuplicateProduct(): Observable<boolean> {
    if (this.isEditMode) {
      return new Observable(observer => observer.next(false)); 
    }

    return this.api.getProducts().pipe(
      map(products => {
        return products.some(product => 
          (product.prodName.toLowerCase() === this.productName.toLowerCase()) || 
          product.prodAbbr.toLowerCase() === this.productAbbr.toLowerCase()
        );
      })
    );
  }

  onSaveProduct(): void {
    const productData: IProduct = {
      productId: this.product.productId || 0, 
      prodName: this.productName,
      prodAbbr: this.productAbbr,
    };

    this.checkDuplicateProduct().subscribe(isDuplicate => {
      if (isDuplicate) {
        this.toastr.error('Product with the same name or abbreviation already exists!', 'Error', { timeOut: 3000 });
        this.productName = '';
        this.productAbbr = '';
        return; 
      }

      if (this.isEditMode) {
        // Logic for updating the existing product
        console.log("Updating product data:", productData);
        this.api.updateProduct(productData).subscribe(
          updatedProduct => {
            console.log('Product updated successfully:', updatedProduct);
            this.toastr.success('Product updated successfully', "Success", {timeOut: 3000});
  
            this.dialogRef.close(updatedProduct);
          },
          error => {
            console.error('Error updating product:', error);
            this.toastr.error('Error while updating product:'+ error, 'Error', { timeOut: 3000 });
          }
        );
      } else {
        debugger;
        console.log("Saving new product:", productData);
        this.api.addProduct(productData).subscribe(
          newProduct => {
            this.toastr.success('Product added successfully!', 'Success', { timeOut: 3000 });
            this.dialogRef.close(newProduct);
          },
          error => {
            console.error('Error while adding product:', error);
          }
        );
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
