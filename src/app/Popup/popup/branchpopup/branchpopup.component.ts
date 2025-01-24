import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IClient } from '../../../Interface/IClient';
import { IRegion } from '../../../Interface/IRegion';
import { ApiServiceService } from '../../../services/api-service.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { IBranch } from '../../../Interface/IBranch';
import { IServiceAgencies } from '../../../Interface/IServiceAgencies';
import { IProduct } from '../../../Interface/IProduct';

@Component({
  selector: 'app-branchpopup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './branchpopup.component.html',
  styleUrl: './branchpopup.component.css'
})
export class BranchpopupComponent {
  ranch: IBranch | undefined;
  id = 0;
  mktfNo = '';
  machineID = '';
  clientName = '';
  product = '';
  countryName = '';
  stateName = '';
  cityName = '';
  areaClass = '';
  branchCode = '';
  branchName = '';
  serviceAgency = '';
  installationDate = new Date();
  accountManager = '';
  ipAddress = '';
  siteType = '';
  subnetMask = '';
  macAddress = '';
  branchAddress = '';
  isEditMode = false; 
  currentBranchData: any;
  countryid: number = 0;
  isEditEnable: Boolean=false;
  clientList: IClient[] = [];  
  countryList: IRegion[] = [];  
  stateList: IRegion[] = [];
  branchList: IBranch[] = []; 
  productList: IProduct[] =[]; 
  cityList: IRegion[] =[];
  ServiceagencyList: IServiceAgencies[] = [];    
  selectedCountry: number = 0;
  selectedState: string = ''; 
  selectedServiceAgency: string='';
  selectedCountryId: number | null = null;
  selectedStateId: number | null = null;
  selectedCityId: number | null = null;
  branchData: any = {};

  areaClassList: { Classid: string; Classname: string }[] = [
    { Classid: 'A', Classname: 'Area Class A' },
    { Classid: 'B', Classname: 'Area Class B' },
    { Classid: 'C', Classname: 'Area Class C' },
  ];
  constructor(private apiService: ApiServiceService,private toastr: ToastrService,private http: HttpClient,public dialogRef: MatDialogRef<BranchpopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

    ngOnInit() {
      this.isEditEnable=true;
      this.getClientNames();
      this.getServiceAgencyNames();
      this.getProductNames();
      this.getCountries();
      
      if (this.data && this.data.branch) {
        console.log("Fetch update data: "+this.data && this.data.branch);
        this.isEditMode = true;
        this.currentBranchData = this.data.branch;
        console.log("current Branch Data: ",this.currentBranchData);
        this.populateBranchFields(this.currentBranchData);
        
      }
      else {
        this.isEditMode = false;
      }
      this.getClientNames();
      this.getServiceAgencyNames();
      this.getProductNames()
      this.getCountries();
      
    }

    getCountries(): void {
      this.apiService.getCountry().subscribe({
        next: (response: IRegion[]) => {
          this.countryList = response;
        },
        error: (error) => {
          console.error('Error fetching countries:', error);
          this.toastr.error('Failed to fetch countries.', 'Error');
        },
      });
    }
    // onCountryChange(event: Event): void {
    //   const target = event.target as HTMLSelectElement;
    //   this.countryName = target.value;
    
    //   this.stateList = [];
    //   this.cityList = [];
    //   this.stateName = '';
    //   this.cityName = '';
    
    //   const selectedCountry  = this.countryList.find(
    //     (country) => country.countryid === this.countryid
    //   );

    //   console.log("selectedCountry",selectedCountry);
    //   if (selectedCountry && selectedCountry.countryid !== undefined) {
    //     this.getStatesByCountry(selectedCountry.countryid);
    //   } else {
    //     console.error('Selected country does not have a valid country ID.');
    //     this.toastr.error('Invalid country selected.', 'Error');
    //   }
    // }

    onCountryChange(event: Event): void {
             const target = event.target as HTMLSelectElement;  
                  this.selectedCountryId = Number(target.value);  
                          this.stateList = [];       this.cityList = []; 
                                this.selectedStateId = null;       
                                   if (this.selectedCountryId) {    
                                         this.getStatesByCountry(this.selectedCountryId); 
                                              } 
    }

 getStatesByCountry(countryId: number): void { 
  this.apiService.getStatesByCountry(countryId).subscribe({ 
    next: (response: IRegion[]) => { 
      this.stateList = response; 
    }, error: (error) => {
      console.error('Error fetching states:', error); 
      this.toastr.error('Failed to fetch states.', 'Error');
    }, });
    }
    
    
    onStateChange(event: Event): void {
      const target = event.target as HTMLSelectElement;
      this.stateName = target.value;
    
      this.cityList = [];
      this.cityName = '';
    
      const selectedState = this.stateList.find(
        (state) => state.stateName === this.stateName
      );
    
      if (selectedState && selectedState.stateID !== undefined) {
        this.getCitiesByState(selectedState.stateID);
      }
    }
    getCitiesByState(stateId: number): void {
      this.apiService.getCityByStates(stateId).subscribe({
        next: (response: IRegion[]) => {
          this.cityList = response;
        },
        error: (error) => {
          console.error('Error fetching cities:', error);
          this.toastr.error('Failed to fetch cities.', 'Error');
        },
      });
    }
    getClientNames(): void {
      this.apiService.getClients().subscribe({
        next: (response: IClient[]) => { 
          this.clientList = response;
        },
        error: (error) => {
          console.error('Error fetching client names:', error);
          this.toastr.error('Failed to fetch client names.', 'Error', { timeOut: 3000 });
        }
      });
    }

    getProductNames(): void {
      this.apiService.getProducts().subscribe({
        next: (response: IProduct[]) => { 
          this.productList = response;
        },
        error: (error) => {
          console.error('Error fetching client names:', error);
          this.toastr.error('Failed to fetch client names.', 'Error', { timeOut: 3000 });
        }
      });
    }
    getServiceAgencyNames(): void {
      this.apiService.getAllserviceAgency().subscribe({
        next: (response: IServiceAgencies[]) => {
          this.ServiceagencyList = response;
        },
        error: (error) => {
          console.error('Error fetching service agencies:', error);
          this.toastr.error('Failed to fetch service agencies.', 'Error', { timeOut: 3000 });
        }
      });
    }

    populateBranchFields(branchData: IBranch): void {
      console.log("Fetch branchData: ", branchData);
      this.id = branchData.id;
      this.mktfNo = branchData.mktfNo || '';
      this.machineID = branchData.machineID || '';
      this.clientName = branchData.clientName || '';
      this.product = branchData.product || '';
      this.countryName = branchData.countryName || '';
      this.stateName = branchData.stateName || '';
      this.cityName = branchData.cityName || '';
      this.areaClass = branchData.areaClass || '';
      this.branchCode = branchData.branchCode || '';
      this.branchName = branchData.branchName || '';
      this.serviceAgency = branchData.serviceAgency || '';
      this.installationDate = branchData.installationDate || '';
      this.accountManager = branchData.accountManager || '';
      this.ipAddress = branchData.ipAddress || '';
      this.siteType = branchData.siteType || '';
      this.subnetMask = branchData.subnetMask || '';
      this.macAddress = branchData.macAddress || '';
      this.branchAddress = branchData.branchAddress || '';
    }
    onSaveBranch(): void {
      if (!this.machineID || !this.clientName || !this.branchName) {
        this.toastr.error('All fields must be filled out.', 'Error', { timeOut: 3000 });
        return;
      }
    
      const branchData: IBranch = {
        id: this.id, 
        mktfNo: this.mktfNo,
        machineID: this.machineID,
        clientName: this.clientName,
        product: this.product,
        countryName:this.countryName,
        stateName: this.stateName,
        cityName: this.cityName,
        areaClass: this.areaClass,
        branchCode: this.branchCode,
        branchName: this.branchName,
        serviceAgency: this.serviceAgency,
        installationDate: this.installationDate,
        accountManager: this.accountManager,
        ipAddress: this.ipAddress,
        siteType: this.siteType,
        subnetMask: this.subnetMask,
        macAddress: this.macAddress,
        branchAddress: this.branchAddress,
        TenantID:1
      };
    
      if (this.isEditMode) {
        console.log("Edit Data: "+branchData);
        this.updateBranch(branchData);
      } else {
        this.addNewBranch(branchData);
      }
    }
    
    addNewBranch(branchData: IBranch): void {
      this.apiService.addBranch(branchData).subscribe({
        next: (response) => {
          this.toastr.success('Branch added successfully!', 'Success', { timeOut: 3000 });
          this.dialogRef.close('Branch added successfully!');
          this.resetForm(); 
        },
        error: (error) => {
          console.error('Error adding branch:', error);
          this.toastr.error('Failed to add branch.', 'Error', { timeOut: 3000 });
        },
      });
    }
    
    updateBranch(branchData: IBranch): void {
      this.apiService.updateBranch(branchData).subscribe({
        next: (response) => {
          this.toastr.success('Branch updated successfully!', 'Success', { timeOut: 3000 });
          this.dialogRef.close('Branch updated successfully!');
          this.resetForm(); 
        },
        error: (error) => {
          console.error('Error updating branch:', error);
          this.toastr.error('Failed to update branch.', 'Error', { timeOut: 3000 });
        },
      });
    }
    
    resetForm(): void {
      this.id = 0;
      this.mktfNo = '';
      this.machineID = '';
      this.clientName = '';
      this.product = '';
      this.countryName = '',
      this.stateName = '';
      this.cityName = '';
      this.areaClass = '';
      this.branchCode = '';
      this.branchName = '';
      this.serviceAgency = '';
      this.installationDate = new Date();
      this.accountManager = '';
      this.ipAddress = '';
      this.siteType = '';
      this.subnetMask = '';
      this.macAddress = '';
      this.branchAddress = '';
      this.isEditMode = false; 
    }
    
   onCancel(): void {
      this.dialogRef.close();
    }
}
