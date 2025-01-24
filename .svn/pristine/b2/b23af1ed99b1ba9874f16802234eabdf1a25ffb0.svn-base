import { Component } from '@angular/core';
import { ImageUpload } from '../../Interface/IUploadImage'; // Define the ImageUpload interface
import { ApiServiceService } from '../../services/api-service.service'; // Your API service
import { FormsModule, NgForm } from '@angular/forms'; // Import NgForm
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { IPermission } from '../../Interface/IPermission';

@Component({
  selector: 'app-experia',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './experia.component.html',
  styleUrls: ['./experia.component.css']
})
export class ExperiaComponent {
  imageUpload: ImageUpload = {
    browserId: 0,
    imagePath: '',
    duration: 20,
    isActive: true,
    createdDate: new Date().toISOString(),
    endDate: new Date().toISOString(),
    tenantID: 1
  };
  successMessage: string | undefined;
  errorMessage: string | undefined;


  public permissions: any[] = [];
  hasAddPermission: boolean = false;
  hasEditPermission: boolean = false;


  clientPermissions: any = {};  // Store client-specific permissions
  otherPermissions: any[] = [];  // Store other menu permissions
  roleID: any;

  constructor(private apiservice: ApiServiceService, private toastr: ToastrService) {}
  

  ngOnInit(): void {
 
    this.roleID = sessionStorage.getItem('role');
    this.fetchPermissions(this.roleID);
        // we  use  for this to  unable to work back space in customerInfo page in browser
        history.pushState(null, '', location.href);
        window.onpopstate = function() {
        history.pushState(null, '', location.href);
        };
       
  }


  onImageChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imageUpload.imagePath = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(imageUploadForm: NgForm) {
    // Check if the user does not have permission to add or edit
    if (!this.hasAddPermission || !this.hasEditPermission) {
      Swal.fire({
        icon: 'warning',
        title: 'No Rights',
        text: 'You do not have permission to add or edit images!',
        timer: 1500
      });
      return;  // Exit the function if no rights
    }
  
    // If the user has permission, proceed with the image upload
    if (this.imageUpload.isActive == null) {
      this.imageUpload.isActive = false;
    }
    console.log('Form Submitted', this.imageUpload);
  
    this.apiservice.addImageUpload(this.imageUpload).subscribe(
      (response) => {
        console.log('Image upload successful', response);
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Image uploaded successfully!',
          showConfirmButton: false,
          timer: 1500
        });
  
        // Reset the form
        imageUploadForm.resetForm();
        const fileInput = document.getElementById('imageInput') as HTMLInputElement;
        if (fileInput) {
          fileInput.value = ''; // Clear the file input
        }
      },
      (error) => {
        console.error('Error uploading image', error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Error uploading image. Please try again!',
          timer: 1500
        });
  
        // Clear file input in case of error
        const fileInput = document.getElementById('imageInput') as HTMLInputElement;
        if (fileInput) {
          fileInput.value = ''; // Clear the file input
        }
      }
    );
  }
  

  fetchPermissions(userId: number): void {
      debugger
      debugger
      this.apiservice.getrolepermission(userId).subscribe(
        (response: IPermission[]) => {
          this.permissions = response;
    
          // Extract the permissions for menu_id = 1
          this.clientPermissions = response.find(item => item.menuName === "Experia");
    
          // Extract the permissions for all other menu_ids
          this.otherPermissions = response.filter(item => item.menuName !== "Experia");
    
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
  
  
    
  
  
    

}
