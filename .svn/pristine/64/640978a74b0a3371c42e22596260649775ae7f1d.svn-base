import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IRegion } from '../../Interface/IRegion';
import { ApiServiceService } from '../../services/api-service.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css'],
})
export class PopupComponent implements OnInit {
  selectRegion = ['Country', 'State', 'City'];
  countries: { id?: number; name: string }[] = [];
  states: { id?: number; name: string }[] = [];
  cities: { id?: number; name: string }[] = [];

  singleCountries: { id: number; name: string } = { id: 0, name: '' };
  singleStates: { id: number; name: string } =  { id: 0, name: '' };
  singleCities: { id: number; name: string } =  { id: 0, name: '' };

  selectedRegion: string = '';
  // selectedRegion: 'Country' | 'State' | 'City' | '' = '';
  selectedCountry: { id?: number; name?: string } | null = null;
  selectedState: { id?: number; name?: string } | null = null;
  selectedCity: { id?: number; name?: string } | null = null;
  selectedCategory:string= "" ;
  receivedData: IRegion[] = [];

  regionName = '';
  // regionPlaceholder = 'Enter region name';
  isCityVisible = false;
  isStateVisible = false;
  isEditEnable= false;
  currentRegionData: any;
  savetext: string | undefined = "Save";
  constructor(
    public dialogRef: MatDialogRef<PopupComponent>,
    private apiService: ApiServiceService,
     private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: IRegion[]
  ) {}

  ngOnInit(): void {
    this.selectedCountry = null;
    this.selectedState= null;
    this.selectedCity= null;
    console.log(this.data);
    var regionData:any = this.data; // Access the region data passed from the parent
  if (regionData && this.data.length==undefined) {
    this.savetext = "Update";
    this.isEditEnable = true;
    this.selectedCategory= regionData.region.category;
    this.selectedRegion= regionData.region.category;

    if (regionData.region.countryName) {
      this.selectedCountry = { id: regionData.region.countryid, name: regionData.region.countryName };
      this.singleCountries = { id: regionData.region.countryid, name: regionData.region.countryName };
    }
    
    if (regionData.region.stateName) {
      this.selectedState = { id: regionData.region.stateID, name: regionData.region.stateName };
      this.singleStates = { id: regionData.region.stateID, name: regionData.region.stateName };
    }

    if (regionData.region.cityName) {
      this.selectedCity = { id: regionData.region.cityID, name: regionData.region.cityName };
      this.singleCities = { id: regionData.region.cityID, name: regionData.region.cityName };
    }

    if (regionData.region.category=='Country') {
      this.regionName = regionData.region.countryName;
    } else if (regionData.region.category === 'State') {
      this.regionName = regionData.region.stateName;
    } else if (regionData.region.category === 'City') {
      this.regionName = regionData.region.cityName;
    }

// alert( this.selectedCountry?.id);
// alert( this.selectedState?.id);
// alert( this.selectedCity?.id);
    
  }
}
  
  prepareCountries(): void {
    this.countries = Array.from(
      new Map(
        this.data
          .filter(item => item.countryId && item.countryName)
          .map(item => [item.countryId, { id: item.countryId!, name: item.countryName! }])
      ).values()
    );
  }

  prepareStates(): void {
    if (!this.selectedCountry) {
      this.states = [];
      return;
    }
    const countryId = this.selectedCountry.id;
    this.states = Array.from(
      new Map(
        this.data
          .filter(
            item => item.countryId === countryId && item.stateID && item.stateName
          )
          .map(item => [item.stateID, { id: item.stateID!, name: item.stateName! }])
      ).values()
    );
  }

  prepareCities(): void {
    if (!this.selectedState) {
      this.cities = [];
      return;
    }
    const stateId = this.singleStates.id;
    this.cities = Array.from(
      new Map(
        this.data
          .filter(
            item => item.stateID === stateId && item.cityID && item.cityName
          )
          .map(item => [item.cityID, { id: item.cityID!, name: item.cityName! }])
      ).values()
    );
  }


  
  onRegionChange(): void {
    debugger;
    this.regionName = ''; // Clear the input field
    if (this.selectedRegion === 'Country') {
      // Prepare for Country input only
      this.prepareCountries();
      this.resetDropdowns(true, false, false);
    } else if (this.selectedRegion === 'State') {
      // Show Country dropdown and State input
      this.prepareCountries();
      this.resetDropdowns(false, true, false);
    } else if (this.selectedRegion === 'City') {
      // Show Country and State dropdowns and City input
      this.prepareCountries();
      this.prepareStates();
      this.resetDropdowns(false, true, true);
    }
  }
  
  onCountryChange(): void {
    debugger;
    if (this.selectedRegion === 'State' || this.selectedRegion === 'City') {
      this.prepareStates();
    }
    this.resetDropdowns(false, true, this.selectedRegion === 'City');
  }
  
  onStateChange(): void {
    if (this.selectedRegion === 'City') {
      this.prepareCities();
    }
    this.resetDropdowns(false, false, true);
  }
  
  resetDropdowns(
    resetCountry: boolean,
    resetState: boolean,
    resetCity: boolean
  ): void {
    if (resetCountry) {
      this.selectedCountry = null;
      this.states = [];
      this.cities = [];
    }
    if (resetState) {
      this.selectedState = null;
      this.cities = [];
    }
    if (resetCity) {
      this.selectedCity = null;
    }
    this.isStateVisible = resetState || resetCity;
    this.isCityVisible = resetCity;
  }
  
  async onSave(): Promise<void> {
    debugger;
    try {
      // Determine the API endpoint and payload based on the selected region
      let endpoint: string = '';
      let payload: any = {};
  
      if (this.selectedRegion === 'Country') {
        // Add new country
        endpoint = 'api/Region/addCountry';
        payload = {
          name: this.regionName, // Pass the state name
          countryId: this.singleCountries.id // Pass the selected country's ID
        };
      } else if (this.selectedRegion === 'State') {
        // Add new state
        if (!this.selectedCountry) {
          console.error('Please select a country before adding a state.');
          return;
        }
        endpoint = 'api/Region/addState';
        payload = {
          name: this.regionName, 
          stateId: this.singleStates.id, // Pass the selected state's ID
        };
      } else if (this.selectedRegion === 'City') {
        // Add new city
        if (!this.selectedState) {
          console.error('Please select a state before adding a city.');
          return;
        }
        endpoint = 'api/Region/addCity';
        payload = {
          name: this.regionName, // Pass the city name
          stateId: this.singleStates.id, // Pass the selected state's ID
          cityId: this.singleCities.id
        };
      } else {
        console.error('Invalid region selected.');
        return;
      }
  
      // Call the API with async/await
      const response = await this.apiService.post(endpoint, payload);
      console.log('API call successful:', response);
      // this.toastr.success(response, 'Success', { timeOut: 3000 });
      this.dialogRef.close();
  
    } catch (error) {
      // this.toastr.error("Something went wrong!", 'Error', { timeOut: 3000 });
      console.error('Error occurred during API call:', error);
    } 
  }
  

  onCancel(): void {
    this.dialogRef.close();
  }

  filteredCountries(): { id?: number; name: string }[] {
    if (this.isEditEnable && this.selectedCountry) {
      return this.countries.filter(
        country => country.id === this.selectedCountry?.id || this.isEditEnable
      );
    }
    return this.countries;
    // return this.countries;
  }
  
  filteredStates(): { id?: number; name: string }[] {
    if (this.isEditEnable && this.selectedState) {
      return this.states.filter(
        state => state.id === this.selectedState?.id || this.isEditEnable
      );
    }
    return this.states;
  }
  
  filteredCities(): { id?: number; name: string }[] {
    if (this.isEditEnable && this.selectedCity) {
      return this.cities.filter(
        city => city.id === this.selectedCity?.id || this.isEditEnable
      );
    }
    return this.cities;
  }


  clearSelectedCountry(): void {
    this.selectedCountry = null;
    this.states = [];
    this.cities = [];
  }

  clearSelectedState(): void {
    this.selectedState = null;
    this.cities = [];
  }

  clearSelectedCity(): void {
    this.selectedCity = null;
  }
  
}
