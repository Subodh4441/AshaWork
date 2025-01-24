import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { ApiServiceService } from '../../services/api-service.service';
import { HttpClient } from '@angular/common/http';
import { IServiceAgency } from '../../Interface/service-agency';
import { IRegion } from '../../Interface/IRegion';
import { RegionInfo } from '../../Interface/region-info';
 


  interface City {
    cityId: number;
    cityName: string;
  }

  interface State {
    stateId: number;
    stateName: string;
    cities: City[];
  }



@Component({
  selector: 'app-service-agencypopup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './service-agencypopup.component.html',
  styleUrl: './service-agencypopup.component.css'
})
export class ServiceAgencypopupComponent implements OnInit {

  serviceagency: IServiceAgency | undefined;
  regionstatecity:IRegion | undefined
  serviceAgencyName = '';
  //stateId = 0;
  stateId: any = null;

  cityId = 0;
  address = '';
  pinCode = '';
  contactName = '';
  contactMobile = '';
  contactEmail = '';
  active = 1;
  id=0;
  regions1: RegionInfo[] = [];

  regions: IRegion[] = [];
  contactEmail1: string = '';
  isGmailValid: boolean = true;

  contactMobile1: string = '';
  
  isMobileValid: boolean = true;
  isPincodeValid: boolean = true;

  states: State[] = [];
  cityName: '' | undefined
  stateName: '' | undefined
  savetext: string | undefined = "Save";
  savetext1:string | undefined= 'Add Service Agency';

  //cityOptions: string[] = []; 
  //stateOptions: string[] = [];
  cityOptions: { id: number | null | undefined, name: string | null | undefined }[] = [];
  stateOptions:any []=[]// { id: number | null | undefined, name: string | null | undefined }[] = []; // State options containing id and name
  isEditMode = false; 
  currentClientData: any; 


  

  constructor(
    private apiService: ApiServiceService,
    private toastr: ToastrService,
    private http: HttpClient,
    public dialogRef: MatDialogRef<ServiceAgencypopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}



  ngOnInit(): void {
    if (this.data) {
      this.savetext = "Update";
      this.savetext1= 'Edit Service Agency';
   
      this.isEditMode = true;
      this.currentClientData = this.data;

      // Populate fields for edit mode
      this.serviceAgencyName = this.currentClientData.serviceAgencyName;
      this.stateId = this.currentClientData.stateId;
      this.cityId = this.currentClientData.cityId;
      this.cityName=this.currentClientData.cityName;
      this.stateName=this.currentClientData.stateName;
      this.address = this.currentClientData.address;
      this.pinCode = this.currentClientData.pinCode;
      this.contactName = this.currentClientData.contactName;
      this.contactMobile = this.currentClientData.contactMobile;
      this.contactEmail = this.currentClientData.contactEmail;
      this.active = this.data.active === 1 ? 1 : 0;
      this.id=this.currentClientData.id;
      id: this.isEditMode ? this.currentClientData.id : 0
    }

    this.loadRegions(); // Assuming this is needed for dropdowns or related data
  }
 

  onClientNameInput1() {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|outlook\.com|yahoo\.com)$/;

    this.isGmailValid = emailRegex.test(this.contactEmail);
    }



    

    
 async loadRegions() {
    debugger
   await this.apiService.getServiceAgency1().subscribe(
      (data: IRegion[]) => {
        debugger
        this.regions = data;  // Store region data
       console.log(this.regions);  // Optionally log to check data
        this.stateOptions=data;
        if (this.regions && this.regions.length > 0 && this.regions[0].cities && Array.isArray(this.regions[0].cities)) {
          // Assuming you want cities from the first region
          this.cityOptions = this.regions[0].cities.map((city: { cityId: any; cityName: any; }) => ({
            id: city.cityId,   // cityId
            name: city.cityName // cityName
          }));
        } else {
          this.cityOptions = []; // Fallback if no cities found
        }
        
       
      },
      error => {
        console.error('Error loading regions:', error); // Handle errors
      }
    );

  
  }




  onStateChange(stateId: number ) {
    debugger
    // Update the stateId when a state is selected
    this.stateId = stateId;
    //alert(this.stateId )

    console.log('Selected State ID:', this.stateId);
  
    // Find the selected state object and extract its cities
    //const selectedState = this.regions.find(region => region.stateID === stateId);
    const selectedState = this.regions.find(region => region.stateId === +stateId); // Cast to number

  
    if (selectedState  && selectedState.cities) {
      debugger
      this.cityOptions = selectedState.cities.map((city: { cityId: any; cityName: any; }) => ({
        id: city.cityId,   // cityId
        name: city.cityName // cityName
      }));
    } else {
      this.cityOptions = []; // No cities if state not found
    }
  
    //this.cityId = 0; // Reset city selection
    console.log('Filtered Cities for State ID:', this.cityOptions);
  }
  



onCityChange(cityId: number) {

  debugger
  this.cityId = cityId;  // Set the selected cityId
  console.log('Selected City ID:', this.cityId);

  if (this.cityId !== null) {
    const selectedCity = this.cityOptions.find(city => city.id === this.cityId);
    console.log('Selected City Details:', selectedCity);
  }
}


  onSaveClient() {
    debugger;
    if (!this.serviceAgencyName ||   !this.cityId || !this.stateId || !this.address || !this.pinCode || !this.contactName || !this.contactMobile || !this.contactEmail || !this.active) {
      this.toastr.error("All fields must be filled out.", "Error", { timeOut: 3000 });
      return;
    }
   
    const serviceData: IServiceAgency = {
      serviceAgencyName: this.serviceAgencyName,
      stateId: this.stateId,
      cityId: this.cityId,
      address: this.address,
      pinCode: this.pinCode,
      contactName: this.contactName,
      contactMobile: this.contactMobile,
      contactEmail: this.contactEmail,
      cityName:'',
      stateName: '',
      active: this.active ? 1 : 0,
      id:this.id
    };

    if (this.isEditMode) {
      this.updateServiceAgency(serviceData);
      
    } else {
      this.addNewServiceAgency(serviceData);
    }
  }

  

  updateServiceAgency(serviceData: IServiceAgency): void {
    debugger
    console.log("Updating Service Agency:", serviceData);
    this.apiService.UpdateServiceAgency(serviceData).subscribe({
      next: (response: string) => {
        console.log("Service Agency updated successfully:", response);
        this.toastr.success("Service Agency updated successfully!", "Success", { timeOut: 3000 });
        this.dialogRef.close(response);
      },
      error: (error) => {
        console.error("Error updating Service Agency:", error);
        this.toastr.error("Service Agency with the same name  already exists!", "Error", { timeOut: 3000 });
      }
    });
  }

  addNewServiceAgency(serviceData: IServiceAgency): void {
    if (serviceData.stateId == null || serviceData.cityId == null) {
      this.toastr.error('State and City are required!', 'Error', { timeOut: 3000 });
      return; // Exit the function if validation fails
    }
    
    debugger
    console.log("Creating New Service Agency:", serviceData);
    this.apiService.addServiceAgency(serviceData).subscribe({
      next: (response: string) => {
        console.log("Service Agency created successfully:", response);
        this.toastr.success("Service Agency saved successfully!", "Success", { timeOut: 3000 });
        this.dialogRef.close(response);
      },
      error: (error) => {
        console.error("Error creating Service Agency:", error);
        this.toastr.error('Service Agency with the same name  already exists!', 'Error', { timeOut: 3000 });

        //this.toastr.error("Failed to save Service Agency. Check logs for details.", "Error", { timeOut: 3000 });
      }
    });
  }



  
  onCancel(): void {
    this.dialogRef.close(); // Close the dialog
  }
  // onClientNameInput() {
  //   // Allow only alphabetic characters
  //   this.serviceAgencyName = this.serviceAgencyName.replace(/[^a-zA-Z]/g, '');
  // }
  

  onClientNameInput() {
    debugger
    // Allow only alphabetic
    //  characters for service agency name
    const mobileRegex = /[^a-zA-Z\s]/g;
    this.isMobileValid = mobileRegex.test(this.contactMobile);
    //this.serviceAgencyName = this.serviceAgencyName.replace(/[^a-zA-Z\s]/g, '');  // Allow spaces too
    
    // Allow only numeric characters for mobile number (exactly 10 digits)
    this.contactMobile = this.contactMobile.replace(/[^0-9]/g, '');
  
    // Allow only numeric characters for pin code (exactly 6 digits)
    //this.pinCode = this.pinCode.replace(/[^0-9]/g, '');
  }

  onPinCodeKeyDown(event: KeyboardEvent) {
    // Allow numeric keys (0-9), backspace, delete, and other special keys like arrow keys
    if (
      !(
        (event.key >= '0' && event.key <= '9') ||
        event.key === 'Backspace' ||
        event.key === 'Delete' ||
        event.key === 'ArrowLeft' ||
        event.key === 'ArrowRight' ||
        event.key === 'Tab'
      )
    ) {
      event.preventDefault(); // Prevent non-numeric characters from being typed
    }
  }
  
  onPinCodeInput(event: any) {
    const value = event.target.value;
    // Remove any non-numeric characters if something is pasted or typed
    this.pinCode = value.replace(/[^0-9]/g, '');
  
    // Validate the pin code length
    this.isPincodeValid = this.pinCode.length === 6;
  }

  onMobileNoInput(event: any) {
    const value = event.target.value;
    // Remove any non-numeric characters if something is pasted or typed
    this.contactMobile = value.replace(/[^0-9]/g, '');
  
    // Validate the pin code length
    this.isMobileValid = this.contactMobile.length === 10;
  }
  
  
  
}
