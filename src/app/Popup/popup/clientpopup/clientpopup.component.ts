import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IClient } from '../../../Interface/IClient';
import { ApiServiceService } from '../../../services/api-service.service';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { IUser } from '../../../Interface/IUser';

@Component({
  selector: 'app-clientpopup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './clientpopup.component.html',
  styleUrl: './clientpopup.component.css'
})
export class ClientpopupComponent implements OnInit {
  client: IClient | undefined;
  clientName = '';
  clientID = 0;
  isActive=true;
  clientAbbr = '';
  userID=0;
  timediff=9.0;
  remark='';
  prodcutowner='';
  savetext: string | undefined = "Save";
 CreatedDate=Date.now;
  projectOwner: string = '';
  selectproductowner = 'Select Product Owner';
  // owner = ['Akash Eknath Nichit', 'Sumit Mhaiskar', 'Nikita Kamlesh Kale', 'Sandesh Kisan Kadam','Dusmanta Sahu'];
  owner: string[] = [];
  projectOwnerSelected: string[] = [];
  isEditMode = false; // To track whether we are editing or creating
  currentClientData: any; // To hold the current client data for editing
  selectedProjectOwner: string = '';
 
  constructor( private apiService: ApiServiceService,private toastr: ToastrService,private http: HttpClient,
    public dialogRef: MatDialogRef<ClientpopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any
  ) {}

  ngOnInit() {
    if (this.data && this.data.client) {
    this.savetext = "Update";
      this.isEditMode = true;
      this.currentClientData = this.data.client;
      this.clientID = this.currentClientData.clientID;
      this.clientName = this.currentClientData.clientName;
      this.clientAbbr = this.currentClientData.clientAbbr;
      this.projectOwner = this.currentClientData.owner;
      this.isActive = this.currentClientData.isActive;
      this.selectproductowner = this.currentClientData.owner;
      this.projectOwnerSelected = this.currentClientData.owner;
      this.selectedProjectOwner =  this.currentClientData.owner;
      this.prodcutowner =  this.currentClientData.owner;
      this.projectOwner = this.currentClientData.owner;
    if (!this.owner.includes(this.projectOwner)) {
      this.owner.push(this.projectOwner); 
    }
    }
    this.getUserListByRoleName('');
  }

  onProjectOwner() {
    this.selectedProjectOwner = this.projectOwner;
  }
  onSave(): void {
    // Send the updated client data back to the parent component
    this.dialogRef.close(this.client);
  }

  // onSaveClient() {
    
  //   if (!this.clientName || !this.clientAbbr || !this.selectedProjectOwner) {
  //     this.toastr.error("All fields must be filled out.", "Error", { timeOut: 3000 });
  //     return; 
  //   }   
  //   const clientData:IClient = {
  //     clientID: this.clientID,
  //     clientName: this.clientName,
  //     clientAbbr: this.clientAbbr,
  //     isActive: this.isActive,
  //     owner: this.selectedProjectOwner?.toString() || '', 
  //     createdBy: 0,
  //     createdDate: new Date()
  //   };
  //   this.checkDuplicateClient().subscribe(isDuplicate =>{
  //     if(isDuplicate)
  //     {
  //       this.toastr.error('Client with the same name or abbreviation already exists!', 'Error', { timeOut: 3000 });
  //       this.clientName = '';
  //      this.clientAbbr = '';
  //        return; // Stop the save process
  //     }
  //   })
  //   if (this.isEditMode) {
     
  //   //   this.checkDuplicateProduct().subscribe(isDuplicate => {
  //   //   if (isDuplicate) {
  //   //     this.toastr.error('Product with the same name or abbreviation already exists!', 'Error', { timeOut: 3000 });
  //   //     this.productName = '';
  //   //     this.productAbbr = '';
  //   //     return; // Stop the save process
  //   //   }
  //   // });
  //    this.UpdateClient(clientData);
  //   } else {
  //     this.addNewClient(clientData);
  //   }
  // }
  // checkDuplicateClient(): Observable<boolean> {
  //   // Only perform duplicate check when not in edit mode (i.e., adding a product)
  //   if (this.isEditMode) {
  //     return new Observable(observer => observer.next(false)); // No check when in edit mode
  //   } 
  
  //   // Perform duplicate check only for add mode
  //   return this.apiService.getClients().pipe(
  //     map((clients: IClient[]) => {
  //       return clients.some((client: IClient) => 
  //         // Check if client name is the same (ignore case)
  //         client.clientName.toLowerCase() === this.clientName.toLowerCase() || 
  
  //         // Check if client abbreviation is the same (ignore case)
  //         client.clientAbbr.toLowerCase() === this.clientAbbr.toLowerCase()
  //       );
  //     }),
  //     catchError(() => {
  //       return of(false);
  //     })
  //   );
  // }
  

  onSaveClient() {
    debugger;
   
    // Validate required fields
    if (!this.clientName || !this.clientAbbr || !this.selectedProjectOwner) {
      this.toastr.error("All fields must be filled out.", "Error", { timeOut: 3000 });
      return;
    }
   
    const clientData: IClient = {
      clientID: this.clientID,
      clientName: this.clientName,
      clientAbbr: this.clientAbbr,
      isActive: this.isActive,
      owner: this.selectedProjectOwner?.toString() || '',
      createdBy: 0,
      createdDate: new Date()
    };
   
    // Check for duplicates and handle saving logic
    this.checkDuplicateClient(clientData).subscribe(isDuplicate => {
      if (isDuplicate) {
        this.toastr.error('Client with the same name or abbreviation already exists!', 'Error', { timeOut: 3000 });
        this.clientName = '';
        this.clientAbbr = '';
        return; // Stop the save process
      }
   
      // Proceed with adding or updating the client
      if (this.isEditMode) {
        this.UpdateClient(clientData);
      } else {
        this.addNewClient(clientData);
      }
    });
  }
   
  checkDuplicateClient(clientData: IClient): Observable<boolean> {
    return this.apiService.getClients().pipe(
      map((clients: IClient[]) => {
        return clients.some(client => 
          // Check for duplicate name or abbreviation (case-insensitive)
          (client.clientName.toLowerCase() === clientData.clientName.toLowerCase() || 
           client.clientAbbr.toLowerCase() === clientData.clientAbbr.toLowerCase()) &&
          client.clientID !== clientData.clientID // Exclude the current client in edit mode
        );
      }),
      catchError(() => {
        // Handle errors gracefully
        this.toastr.error('Error while checking for duplicates!', 'Error', { timeOut: 3000 });
        return of(false); // Assume no duplicates if there's an error
      })
    );
  }

  UpdateClient(clientData: IClient): void {
    console.log("Payload to be sent to the API:", clientData); 
    this.apiService.UpdateClient(clientData).subscribe({
      next: (response: string) => {
        this.dialogRef.close(response); 
      },
      error: (error) => {
        console.error("Error while updating client:", error);
        this.toastr.error('Error while updating client!', "Error", {
          timeOut: 3000,
          positionClass: 'toast-bottom-center' 
        });
      }
    });
  }
 
  getUserListByRoleName(rolename: string): void {
    rolename = rolename || 'product owner';
    this.apiService.getUserListByRoleName(rolename).subscribe({
      next: (response: IUser[]) => {
        this.owner = response.map(user => user.userName); 
      },
      error: (error) => {
        console.error("Error fetching users:", error);
      }
    });
  }

  addNewClient(clientData: IClient): void {
    console.log("Payload to be sent to the API:", clientData); 
    this.apiService.addClient(clientData).subscribe({
      next: (response: string) => {
        console.log("Client added successfully:", response);
        this.toastr.success(response, "Success", {timeOut: 3000});
        this.dialogRef.close(response); 
      },
      error: (error) => {
        console.error("Error creating client:", error);
        // this.toastr.error('Error while aading client!', "Error", {
        //   timeOut: 3000,
        //   positionClass: 'toast-bottom-center' 
        // });
        this.toastr.error("Failed to save client. Check logs for details.", "Error", { timeOut: 3000 });
      }
    });
  }
  
  
    
    onCancel(): void {
      this.dialogRef.close(); // Close the dialog
    }
    

  onStateChange() {
    // State change logic here
  }

  onClientAbbrChange(value: string): void {
    this.clientAbbr = value.toUpperCase().replace(/\s+/g, '');
  }

  onClientNameInput(): void {
    // Allow only alphabetic characters
    this.clientName = this.clientName.replace(/[^a-zA-Z\s]/g, '');
 
    // Capitalize first letter after space
    if (this.clientName) {
      this.clientName = this.clientName
        .toLowerCase() // Ensure everything is lowercase initially
        .replace(/\b\w/g, (match) => match.toUpperCase()); // Capitalize first letter of each word
    }
  }


}
