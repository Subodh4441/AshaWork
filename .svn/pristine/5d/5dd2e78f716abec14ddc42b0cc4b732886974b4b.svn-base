import { Component, Inject } from '@angular/core';
import { ISpare } from '../../../../../Interface/ISpare';
import { FormBuilder, FormsModule } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ApiServiceService } from '../../../../../services/api-service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sparenamepopup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sparenamepopup.component.html',
  styleUrl: './sparenamepopup.component.css'
})
export class SparenamepopupComponent {


  sparename: string = '';  // Spare Name input field
  isActive: boolean = true;  // Active checkbox
  spareID!: number;  // Spare ID (if needed)
  spares: { spareVariantID: number; spareName: string }[] = [];  // Spare names list
  isEditMode: boolean = false;  // Flag for edit mode
  savetext: string | undefined="Save";

  constructor(
    private fb: FormBuilder,
    private apiService: ApiServiceService,
    private toastr: ToastrService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<SparenamepopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    console.log(this.data)

    if (this.data == null) {
      this.savetext = "Save";
    }
    else if (this.data) {
      this.savetext = "Update";
    }
    debugger
    if (this.data && this.data.sparenameData) {
      this.isEditMode = true;
      const spareData = this.data.sparenameData;
      this.sparename = spareData.spareName;
      this.isActive = spareData.isActive;
      this.spareID=spareData.spareID
    }
  }

  onCancel(): void {
    this.dialogRef.close();  // Close the dialog
  }

  // Method for saving Spare Name
  onSaveSpareName(): void {
    if ( !this.sparename ) {
      this.toastr.error("All fields must be filled out.", "Error", { timeOut: 3000 });
      return; 
    }   
    const spareData:ISpare = {
     spareVariantID: this.spareID,
     spareVariant: '',
     spareName: this.sparename,
     isActive: this.isActive,
     spareID:this.spareID,
     
      createdBy: 1,
      createdDate: new Date()
    };
   console.log(spareData);
   if (this.isEditMode) {
     this.updateSpare(spareData);
    } else {
      this.addSpareName(spareData);
 
    }
    }

 
  

  //Method for adding Spare Name
  addSpareName(spareData: ISpare): void {
    this.apiService.addSpareName(spareData).subscribe({
      next: (response: string) => {
        this.toastr.success("Spare Name added successfully.", "Success", { timeOut: 3000 });
        this.dialogRef.close(response);  // Close the dialog and pass data back
      },
      error: (error) => {
        console.error("Error adding Spare Name:", error);
        this.toastr.error("Failed to add Spare Name. Please try again.", "Error", { timeOut: 3000 });
      }
    });
  }

  // Method for updating Spare Name
  updateSpare(spareData: ISpare): void {
    debugger
    this.apiService.updateSpareName(spareData).subscribe({
      next: (response: string) => {
        this.toastr.success("Spare Name updated successfully.", "Success", { timeOut: 3000 });
        this.dialogRef.close(response);  // Close the dialog and pass data back
      },
      error: (error) => {
        console.error("Error updating Spare Name:", error);
        this.toastr.error("Failed to update Spare Name. Please try again.", "Error", { timeOut: 3000 });
      }
    });
  }

  onSpareVariantName(): void {
   
  
    // Capitalize the first letter
    if (this.sparename) {
      this.sparename = this.sparename
        .toLowerCase() // Convert the rest of the string to lowercase
        .replace(/^\w/, (match) => match.toUpperCase()); // Capitalize the first letter
    }
  }

}
