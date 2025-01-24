import { CommonModule } from '@angular/common';
import { Component, OnInit, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PopupComponent } from '../../Popup/popup/popup.component';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { IRegion } from '../../Interface/IRegion';
import { ApiServiceService } from '../../services/api-service.service';
import { IPermission } from '../../Interface/IPermission';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-region',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './region.component.html',
  styleUrls: ['./region.component.css'],
})
export class RegionComponent implements OnInit {
  constructor(public dialog: MatDialog, private apiService: ApiServiceService) {}

  regionCategories = [
    { value: 'City', label: 'City' },
    { value: 'State', label: 'State' },
    { value: 'Country', label: 'Country' },
  ];

  isMenuActive: boolean = false;  
  selectedOption: string = '';
  selectedRegionCategory: string = 'City';
  searchQuery: string = '';
  regionList: IRegion[] = [];
  regionForCurrentPage: IRegion[] = [];
  buttonLabel = 'City'; 

  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;
  public permissions: any[] = [];
  hasAddPermission: boolean = false;
  hasEditPermission: boolean = false;


  regionPermissions: any = {};  // Store client-specific permissions
  otherPermissions: any[] = [];  // Store other menu permissions
  roleID:any;


  filteredRegionList: Partial<IRegion>[] = [];

  ngOnInit() {
    //this.updateButtonLabel();
    // this.filteredRegionList = [...this.regionList];
    this.filteredRegionList = this.getUniqueRecords(this.regionList);
    this.totalPages = Math.ceil(this.filteredRegionList.length / this.itemsPerPage);
    this.fetchRegions();
    this.updatePagedData();
    this.roleID = sessionStorage.getItem('role');
    this.fetchPermissions(this.roleID);
  }

  getUniqueRecords(regions: any[]): any[] {
    return regions.filter((value, index, self) => 
      index === self.findIndex((t) => (
        t.countryName === value.countryName  // Compare based on countryName
      ))
    );
  }

  onRegionCategoryChange(): void {
    this.updateButtonLabel();
  }
  updateButtonLabel(): void {
    const selectedCategory = this.regionCategories.find(
      category => category.value === this.selectedRegionCategory
    );
    this.buttonLabel = selectedCategory ? `Add ${selectedCategory.label}` : 'Add Region';
  }
  // Toggle the dropdown menu
  toggleMenu(event: Event): void {
    event.stopPropagation(); // Prevent triggering the window click
    this.isMenuActive = !this.isMenuActive;
  }

  // Close the menu when clicking outside
  @HostListener('window:click', ['$event'])
  closeMenu(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.classList.contains('dropdown-button')) {
      this.isMenuActive = false;
    }
  }

  // Change page function
  changePage(pageNumber: number): void {
    if (pageNumber >= 1 && pageNumber <= this.totalPages) {
      this.currentPage = pageNumber;
      this.updatePagedData(); // Update data after changing the page
    }
  }

  // Update paginated data
  updatePagedData(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.regionForCurrentPage = this.filteredRegionList.slice(start, end);
  }

  // Open popup for adding a region
  openAddRegionPopup(): void {
    const dialogRef = this.dialog.open(PopupComponent, {
      width: '60%',
      data:   this.regionList 
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('Dialog closed');
      if (result) {
        // Add new region (assumes result matches IRegion structure)
        this.regionList.push(result);
        this.filterRegionList(); // Reapply filter to include the new region
        //this.filteredRegionList = this.getUniqueRecords(this.regionList);
        this.filteredRegionList = this.regionList
      .map((region) => region.countryName) 
      .filter((value, index, self) => self.indexOf(value) === index) 
      .map((countryName) => ({ countryName })); 

        this.totalPages = Math.ceil(this.filteredRegionList.length / this.itemsPerPage);
      
      }
      this.fetchRegions();
      this.updatePagedData();
   
    });
  }






  // Filter region list based on the selected category
  filterRegionList(): void {
    switch (this.selectedRegionCategory) {
      case 'City':
        this.filteredRegionList = this.regionList.map((region) => ({
          countryName: region.countryName,
          stateName: region.stateName,
          cityName: region.cityName,
        }));
        break;

      case 'Country':
        this.filteredRegionList = this.regionList
      .map((region) => region.countryName) 
      .filter((value, index, self) => self.indexOf(value) === index) 
      .map((countryName) => ({ countryName })); 
        break;

      case 'State':
        this.filteredRegionList = this.regionList.map((region) => ({
          countryName: region.countryName,
          stateName: region.stateName,
        }));
        break;

      default:
        this.filteredRegionList = this.getUniqueRecords(this.regionList);
        break;
    }

    // Recalculate total pages and reset to the first page
    this.totalPages = Math.ceil(this.filteredRegionList.length / this.itemsPerPage);
    this.currentPage = 1;  // Reset to the first page after filtering
    this.updatePagedData();  // Update the displayed data
  }

  // Export the filtered list to PDF
  exportPDF(): void {
    const doc = new jsPDF();

    let tableHeader: string[] = [];
    let tableData: any[] = [];

    switch (this.selectedRegionCategory) {
      case 'Country':
        tableHeader = ['Country'];
        tableData = this.filteredRegionList.map((region) => [region.countryName]);
        break;

      case 'State':
        tableHeader = ['Country', 'State'];
        tableData = this.filteredRegionList.map((region) => [region.countryName, region.stateName]);
        break;

      case 'City':
        tableHeader = ['Country', 'State', 'City'];
        tableData = this.filteredRegionList.map((region) => [region.countryName, region.stateName, region.cityName]);
        break;
    }

    doc.text('Region List', 14, 10);

    (doc as any).autoTable({
      head: [tableHeader],
      body: tableData,
      startY: 20,
    });

    doc.save('regions.pdf');
  }

  // Export the filtered list to Excel
  exportExcel(): void {
    const headers: string[] = [];
    const data: any[] = [];

    switch (this.selectedRegionCategory) {
      case 'Country':
        headers.push('Country');
        data.push(...this.filteredRegionList.map((region) => [region.countryName]));
        break;

      case 'State':
        headers.push('Country', 'State');
        data.push(...this.filteredRegionList.map((region) => [region.countryName, region.stateName]));
        break;

      case 'City':
        headers.push('Country', 'State', 'City');
        data.push(...this.filteredRegionList.map((region) => [region.countryName, region.stateName, region.cityName]));
        break;
    }

    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([headers, ...data]);
    const wb: XLSX.WorkBook = { Sheets: { Regions: ws }, SheetNames: ['Regions'] };

    XLSX.writeFile(wb, 'Regions.xlsx');
  }

  onSearchChange(): void {
    const query = this.searchQuery.toLowerCase().trim(); 
    
    if (query) {
      this.filteredRegionList = this.regionList.filter(region => {
        if(this.selectedRegionCategory == 'Country'){
          return (
            (region.countryName && region.countryName.toLowerCase().includes(query)) 
            // ||(region.stateName && region.stateName.toLowerCase().includes(query)) ||
            // (region.cityName && region.cityName.toLowerCase().includes(query))
          );
        }
        if(this.selectedRegionCategory == 'City'){
          return (
            // (region.countryName && region.countryName.toLowerCase().includes(query)) ||
            // (region.stateName && region.stateName.toLowerCase().includes(query)) ||
            (region.cityName && region.cityName.toLowerCase().includes(query))
          );
        }
        if(this.selectedRegionCategory == 'State'){
          return (
            // (region.countryName && region.countryName.toLowerCase().includes(query)) ||
            (region.stateName && region.stateName.toLowerCase().includes(query)) 
            // ||(region.cityName && region.cityName.toLowerCase().includes(query))
          );
        }
      
        return (
          (region.countryName && region.countryName.toLowerCase().includes(query)) ||
          (region.stateName && region.stateName.toLowerCase().includes(query)) ||
          (region.cityName && region.cityName.toLowerCase().includes(query))
        );
      });
    } else {
      this.filteredRegionList = this.getUniqueRecords(this.regionList);  
      
      this.filteredRegionList.sort((a, b) => {
        const countryNameA = a.countryName || '';
        const countryNameB = b.countryName || '';
        return countryNameA.localeCompare(countryNameB);
      });
    }

    // Recalculate total pages after filtering
    this.totalPages = Math.ceil(this.filteredRegionList.length / this.itemsPerPage);
    this.currentPage = 1;  // Reset to first page after search
    this.updatePagedData(); // Update displayed data after filtering
  }

  // Fetch regions from the API
  // fetchRegions(): void {
  //   this.apiService.getRegions().subscribe(
  //     (data) => {
  //       console.log('Fetched regions:', data);
  //       this.regionList = data;
  //       this.filteredRegionList = [...this.regionList];
  //       this.totalPages = Math.ceil(this.filteredRegionList.length / this.itemsPerPage);
        
  //       // Sort the regions safely, providing a fallback if countryName is undefined
  //       this.filteredRegionList.sort((a, b) => {
  //         const countryNameA = a.countryName || '';  // Fallback to an empty string if countryName is undefined
  //         const countryNameB = b.countryName || '';  // Same for b
          
  //         return countryNameA.localeCompare(countryNameB);
  //       });
        
  //       this.updatePagedData();  // Update the displayed data
  //     },
  //     (error) => {
  //       console.error('Error fetching regions:', error);
  //     }
  //   );
  // }
  

  // Open popup for editing a region

  fetchRegions(): void {
    this.apiService.getRegions().subscribe(
      (data) => {
        console.log('Fetched regions:', data);
        this.regionList = data;
  
        // Filter for unique countries based on countryName
        this.filteredRegionList = this.getUniqueCountries(this.regionList);
  
        this.totalPages = Math.ceil(this.filteredRegionList.length / this.itemsPerPage);
  
        // Sort the regions safely, providing a fallback if countryName is undefined
        this.filteredRegionList.sort((a, b) => {
          const countryNameA = a.countryName || '';  // Fallback to an empty string if countryName is undefined
          const countryNameB = b.countryName || '';  // Same for b
          
          return countryNameA.localeCompare(countryNameB);
        });
  
        this.updatePagedData();  // Update the displayed data
      },
      (error) => {
        console.error('Error fetching regions:', error);
      }
    );
  }
  
  // Helper function to get unique countries
  getUniqueCountries(regions: any[]): any[] {
    const uniqueCountries = regions
      .map((region) => region.countryName)  // Get all country names
      .filter((value, index, self) => self.indexOf(value) === index)  // Remove duplicates
  
    // Return the filtered list of unique country records
    return regions.filter((region) => uniqueCountries.includes(region.countryName));
  }
  

  editRegion(region: IRegion): void {
  region.category=this.selectedRegionCategory;
  const dialogRef = this.dialog.open(PopupComponent, {
    width: '60%',
    data: { region }
    });

  dialogRef.afterClosed().subscribe((updatedRegion) => {
    if (updatedRegion) {
      // Find the index of the region being edited
      const index = this.regionList.findIndex(
        (r) => r.countryName === region.countryName && 
               r.stateName === region.stateName && 
               r.cityName === region.cityName
      );

      if (index !== -1) {
        // Update the region in the list
        this.regionList[index] = updatedRegion;
        this.filterRegionList(); // Reapply filter to reflect updated data
      }
    }

    this.fetchRegions();
    this.filteredRegionList = this.getUniqueRecords(this.regionList);
    this.totalPages = Math.ceil(this.filteredRegionList.length / this.itemsPerPage);
    this.updatePagedData();
  });
}

fetchPermissions(userId: number): void {
  debugger
  this.apiService.getrolepermission(userId).subscribe(
    (response: IPermission[]) => {
      this.permissions = response;

      // Extract the permissions for menu_id = 1
      this.regionPermissions = response.find(item => item.menuName === "Regions");

      // Extract the permissions for all other menu_ids
      this.otherPermissions = response.filter(item => item.menuName !== "Regions");

      // Determine if the user has permission to add/edit clients
      this.hasAddPermission = this.regionPermissions ? this.regionPermissions.can_add : false;
      this.hasEditPermission = this.regionPermissions ? this.regionPermissions.can_edit : false;
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
                  text: 'You do not have permission to add or edit Regions Details!',
                  timer: 1500
                });
                return;
    } else {
      // Proceed with the intended action
      this.openAddRegionPopup() ;
    }
  }


  handleeditClick(region: IRegion): void {
    debugger
    if (!this.hasEditPermission) {
     Swal.fire({
                 icon: 'warning',
                 title: 'No Rights',
                 text: 'You do not have permission to add or edit Regions Details!',
                 timer: 1500
               });
               return;
    } else {
      // Proceed with the intended action
      this.editRegion(region) ;
    }
  }

}
