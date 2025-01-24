import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { ApiServiceService } from '../../../../services/api-service.service';
import { FormBuilder, FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ISpare } from '../../../../Interface/ISpare';
import { catchError, map, Observable, of } from 'rxjs';

@Component({
  selector: 'app-sparepopup',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './sparepopup.component.html',
  styleUrl: './sparepopup.component.css'
})
export class SparepopupComponent implements OnInit {

  sparevariant: string = '';
  sparevariantId: number | undefined;
  sparename: string = '';
  spareID!: number; 
  isActive: boolean = true;
  spares: { spareVariantID: number; spareName: string }[] = [];
  currentSpareVariantData: any;
  isEditMode = false; // To track whether we are editing or creating
  savetext: string | undefined="Save";
  isSpareVariantIdInvalid: boolean = false;




constructor(private fb: FormBuilder, private apiService: ApiServiceService, private toastr: ToastrService,public dialog: MatDialog,public dialogRef: MatDialogRef<SparepopupComponent>, @Inject(MAT_DIALOG_DATA) public data:any){}
  ngOnInit(): void {

    if (this.data == null) {
      this.savetext = "Save";
    }
    else if (this.data) {
      this.savetext = "Update";
    }
    console.log(this.data);
    this.getsparelist();
debugger
console.log("Spare variant data:", this.data.sparevariantData);
    if (this.data && this.data.sparevariantData) {
      this.isEditMode = true;
      this.currentSpareVariantData = this.data.sparevariantData;
      this.sparevariantId = this.currentSpareVariantData.spareVariantID;
      this.sparename = this.currentSpareVariantData.spareName;
      this.sparevariant = this.currentSpareVariantData.spareVariant;
      this.isActive = this.currentSpareVariantData.isActive;
    }
    this.getsparevariantlist();
    this.getsparelist();



  }


  getsparevariantlist(): void {
    debugger
      this.apiService.getsparevariant().subscribe((response: any) => {
        // Check if the response contains users data
        console.log(response)
        this.spares = response;  // Bind the users array from response.Data    
      },
      error => {
        this.toastr.error('Failed to load users');
        console.error('Error loading users:', error);
      }
    );
    }

    onCancel(): void {
      this.dialogRef.close(); // Close the dialog
    }



    onSaveSpareVariant() {
      debugger;
    
      if (!this.sparevariantId || !this.sparevariant || !this.sparename) {
        this.toastr.error("All fields must be filled out.", "Error", { timeOut: 3000 });
        return;
      }
    
      const spareVariantData: ISpare = {
        spareVariantID: this.sparevariantId,
        spareVariant: this.sparevariant,
        spareName: this.sparename,
        isActive: this.isActive,
        spareID: this.spareID,
        createdBy: 0,
        createdDate: new Date(),
      };
    
      // this.checkDuplicate(spareVariantData).subscribe(isDuplicate => {
      //   if (isDuplicate) {
      //     this.toastr.error('Duplicate Spare Variant Name or Spare Variant ID detected!', 'Error', { timeOut: 3000 });
      //     return;
      //   }
    
        if (this.isEditMode) {
          this.updateSpareVariant(spareVariantData);
        } else {
          this.addSpareVariant(spareVariantData);
        }
      // });
    }
    
     addSpareVariant(sparevarinatData: ISpare): void {
      debugger
         console.log("Payload to be sent to the API:", sparevarinatData); 
         this.apiService.addSpareVariant(sparevarinatData).subscribe({
           next: (response: string) => {
             console.log("sparevarinatData saved successfully:", response);
             this.toastr.success("SpareVariant saved successfully.", "Success", { timeOut: 3000 });

             this.dialogRef.close(response); 
           },
           error: (error) => {
             console.error("Error creating sparevarinatData:", error);
             this.toastr.error("Failed to save sparevarinat. Check logs for details.", "Error", { timeOut: 3000 });
           }
         });

       }


       updateSpareVariant(sparevarinatData: ISpare): void {
        debugger
           console.log("Payload to be sent to the API:", sparevarinatData); 
           this.apiService.updateSpareVariant(sparevarinatData).subscribe({
             next: (response: string) => {
          
               console.log("sparevarinatData updated successfully:", response);
               this.toastr.success("SpareVariant Updated successfully.", "Success", { timeOut: 3000 });
  
               this.dialogRef.close(response); 
               this.getsparevariantlist();
             },
             error: (error) => {
               console.error("Error updating SpareVariantData:", error);
               this.toastr.error("Failed to update SpareVariant. Check logs for details.", "Error", { timeOut: 3000 });
               this.getsparevariantlist();
             }
           });
  
         }

  // Fetch spare names list
  getsparelist(): void {
    this.apiService.getspare().subscribe(
      (response: any) => {
        this.spares = response;  
        
        
      },
      error => {
        this.toastr.error('Failed to load spare names');
        console.error('Error loading spare names:', error);
      }
    );
  }

  checkDuplicate1(spareVariantData: ISpare): Observable<boolean> {
    return this.apiService.getsparevariant().pipe(
      map((spareVariants: ISpare[]) => {
        console.log('Current Spare Variant Data:', spareVariantData);
        console.log('Existing Spare Variants:', spareVariants);
  
        // Convert spareVariantID to a number (if it's a string)
        spareVariantData.spareVariantID = Number(spareVariantData.spareVariantID);
  
        // Check for duplicates based on spareVariant and spareVariantID
        return spareVariants.some(spare => {
          // Ensure both are numbers for comparison
          const existingSpareVariantID = Number(spare.spareVariantID);
  
          // Case-insensitive comparison for spareVariant
          const currentSpareVariant = spareVariantData.spareVariant.trim().toLowerCase();
          const existingSpareVariant = spare.spareVariant.trim().toLowerCase();
  
          // Exclude current spareVariantID from duplicate check (if editing the same record)
          const isDuplicate = (currentSpareVariant === existingSpareVariant || spareVariantData.spareVariantID === existingSpareVariantID) &&
                              spareVariantData.spareVariantID !== existingSpareVariantID;
  
          console.log('Duplicate Check:', isDuplicate);
          return isDuplicate;
        });
      }),
      catchError(() => {
        // Handle errors gracefully
        this.toastr.error('Error while checking for duplicates!', 'Error', { timeOut: 3000 });
        return of(false); // Assume no duplicates if there's an error
      })
    );
  }
  
  checkDuplicate(spareVariantData: ISpare): Observable<boolean> {
    return this.apiService.getsparevariant().pipe(
      map((spareVariants: ISpare[]) => {
        console.log('Current Spare Variant Data:', spareVariantData);
        console.log('Existing Spare Variants:', spareVariants);
  
        // Convert spareVariantID to a number if it exists, else set it to null for new records
        const newSpareVariantID = spareVariantData.spareVariantID ? Number(spareVariantData.spareVariantID) : null;
  
        return spareVariants.some(spare => {
          // Convert existing spareVariantID to number
          const existingSpareVariantID = spare.spareVariantID ? Number(spare.spareVariantID) : null;
  
          // Normalize the spareVariant names to lowercase and trim any leading/trailing spaces
          const currentSpareVariant = spareVariantData.spareVariant.trim().toLowerCase();
          const existingSpareVariant = spare.spareVariant.trim().toLowerCase();
  
          console.log('Comparing spareVariant:', currentSpareVariant, 'with', existingSpareVariant);
          console.log('Comparing spareVariantID:', newSpareVariantID, 'with', existingSpareVariantID);
  
          // Check for duplicates:
          return (
            // Case 1: If only spareVariantID is changed, but spareVariant name is the same
            (existingSpareVariantID !== newSpareVariantID && currentSpareVariant === existingSpareVariant) ||
  
            // Case 2: If only spareVariant name is changed, but spareVariantID is the same
            (existingSpareVariantID === newSpareVariantID && currentSpareVariant !== existingSpareVariant) ||
  
            // Case 3: If both spareVariantID and spareVariant are changed and the combination already exists
            (existingSpareVariantID !== newSpareVariantID && currentSpareVariant === existingSpareVariant)
          );
        });
      }),
      catchError(() => {
        // Handle errors gracefully
        this.toastr.error('Error while checking for duplicates!', 'Error', { timeOut: 3000 });
        return of(false); // Assume no duplicates if there's an error
      })
    );
  }
  
  
  
  onSpareVariantInput(): void {
   
  
    // Capitalize the first letter
    if (this.sparevariant) {
      this.sparevariant = this.sparevariant
        .toLowerCase() // Convert the rest of the string to lowercase
        .replace(/^\w/, (match) => match.toUpperCase()); // Capitalize the first letter
    }
  }
  
  
 
}
