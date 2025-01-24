import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, Input, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiServiceService } from '../../../services/api-service.service';
import { ITenant } from '../../../Interface/ITenant';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-tenantpopup',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './tenantpopup.component.html',
  styleUrls: ['./tenantpopup.component.css'],
})
export class TenantpopupComponent {

  tenantID: number | undefined;
  tenantName: string = '';
  tenantHead: string = '';
  tenantEmailID: string = '';
  isPopupVisible: boolean = true;
  isEditMode: boolean = false; 
  @Output() saveTenant = new EventEmitter<any>();
  @Output() closePopup = new EventEmitter<void>();
  tenantData1: any;
  isGmailValid: boolean = true;
  savetext: string | undefined = "Save";
  savetext1:string | undefined= 'Add Tenant';


  constructor(private tenantService: ApiServiceService, private toastr: ToastrService, private dialog: MatDialog,public dialogRef: MatDialogRef<TenantpopupComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any) {}


  ngOnInit(): void {
 
   //  console.log(this.data )
    debugger
    if (this.data ) {
      this.savetext = "Update";
      this.savetext1= 'Edit Tenant';
      this.isEditMode = true;
      const tenantData1 = this.data; 
      this.tenantName = tenantData1.tenantName; 
      this.tenantHead = tenantData1.tenantHead;
      this.tenantEmailID = tenantData1.tenantEmailID;
      this.tenantID = tenantData1.tenantID;
    }
  }

  
  
  onSaveTenant(): void {
    debugger
   
    if (!this.tenantName || !this.tenantHead || !this.tenantEmailID) {
      alert('Please fill all required fields.');
      return;
    }

    const tenantData: ITenant = {
      
     
        tenantID: this.isEditMode ? this.tenantID! : 0,
     
      tenantName: this.tenantName,
      tenantHead: this.tenantHead,
      tenantEmailID: this.tenantEmailID,
      IsDelete: false
    };
    const isEditMode = localStorage.getItem('isEditMode');
    if (isEditMode == "true") {
      this.updateTenantData(tenantData);
    } else {
      this.addTenant(tenantData);
    }
  } 

  
  addTenant(tenantData: ITenant): void {
    debugger
    this.tenantService.addTenant(tenantData).subscribe(
      (response) => {
        this.toastr.success("Tenant Name Add successfully.", "Success", { timeOut: 3000 });   
        this.saveTenant.emit(response);
        this.isPopupVisible = false;
        this.closePopup.emit();
        this.dialog.closeAll();
      },
      (error) => {
        console.error('Error adding tenant:', error);
        
        if (error.status === 400 && error.error) {
          
          this.toastr.error(error.error, "Error", { timeOut: 3000 });
          this.isPopupVisible = false;
          this.dialog.closeAll();
        } else {
         
          this.toastr.error('Tenant with the same name  already exists!.', 'Error', { timeOut: 5000 });
        }
        
      } 
    );
  }
  onClientNameInput1() {
    const gmailRegex =/^[a-zA-Z0-9._%+-]+@(gmail\.com|outlook\.com|yahoo\.com)$/;
    this.isGmailValid = gmailRegex.test(this.tenantEmailID);
    }



  updateTenantData(tenantData: ITenant): void {
    debugger
    this.tenantService.updateTenant(this.tenantID!, tenantData).subscribe({
      next: (response: any) => {
        this.toastr.success("Tenant Name Updated successfully.", "Success", { timeOut: 3000 });       
        this.saveTenant.emit(response);
        this.dialog.closeAll();
      },
      error: (error) => {
        console.error('Error updating tenant:', error);
        this.dialog.closeAll();
        if (error.status === 400 && error.error) {
          
          this.toastr.error(error.error, "Error", { timeOut: 3000 });
         
        } else {
         
          this.toastr.error('Tenant with the same name  already exists!', 'Error', { timeOut: 5000 });
        }
        
      },
    });
  }


  onCancel(): void {
    this.isPopupVisible = false;
    this.closePopup.emit();
    this.dialog.closeAll();
  }


  resetForm(): void {
    this.tenantName = '';
    this.tenantHead = '';
    this.tenantEmailID = '';
  }
}
