import { Component, Inject,Input,EventEmitter, Output  } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IClient } from '../../Interface/IClient';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as XLSX from 'xlsx'; 
import { ApiServiceService } from '../../services/api-service.service';
import { NgxSpinnerService } from 'ngx-spinner'; 
import { CommonModule } from '@angular/common';  
import { IProduct } from '../../Interface/IProduct';
import { IRegion } from '../../Interface/IRegion';

@Component({
  selector: 'app-bulkuploadpopup',
  templateUrl: './bulkuploadpopup.component.html',
  styleUrls: ['./bulkuploadpopup.component.css']
})

export class BulkuploadpopupComponent {
  @Input() entityType: string = '';   
  @Input() fields: string[] = [];  
  @Output() uploadSuccess: EventEmitter<void> = new EventEmitter();
  @Output() uploadFailure: EventEmitter<string> = new EventEmitter();
  client: IClient | undefined;
  product: IProduct | undefined;
  region: IRegion | undefined;
  fileupload: File | undefined; 
  selectedFileData: any[] = []; 
  downloadtemplate = '';
  projectOwner = '';
  selectproductowner = 'Select Product Owner';
  owner = ['Akash Eknath Nichit', 'Sumit Mhaiskar', 'Nikita Kamlesh Kale', 'Sandesh Kisan Kadam'];
  projectOwnerSelected: string[] = [];
  isEditMode = false; 
  currentClientData: any;
  isUploading = false; 

  constructor(
    private apiService: ApiServiceService,
    public dialogRef: MatDialogRef<BulkuploadpopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private httpclient: HttpClient,
    private spinner: NgxSpinnerService 
  ) {
    this.apiService.setString('bulkupload');
  }

  onFileUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.fileupload = file;
      this.parseFile(file); 
      console.log('File uploaded:', file);
    }
  }

  parseFile(file: File) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      this.selectedFileData = XLSX.utils.sheet_to_json(firstSheet);  
      console.log('Parsed File Data:', this.selectedFileData);
    };
    reader.readAsBinaryString(file); 
  }

  onSave(): void {
    // this.dialogRef.close(this.client);  
  }

  onCancel() {
    this.dialogRef.close();
  }

  onUpload() {
    if (!this.fileupload) {
      console.log('No file to upload');
      return;
    }

    this.isUploading = true; 
    this.spinner.show();

    const formData = new FormData();
    formData.append('file', this.fileupload, this.fileupload.name);  
    formData.append('clientData', JSON.stringify(this.selectedFileData));

    this.uploadDataToAPI(formData).subscribe(
      (response) => {
        console.log('Upload successful', response);
        this.isUploading = false; 
        this.spinner.hide(); 
        this.dialogRef.close();
      },
      (error) => {
        console.error('Upload failed', error);
        this.isUploading = false; 
        this.spinner.hide();
      }
    );
  }

  uploadDataToAPI(formData: FormData): Observable<any> {
    return this.apiService.BulkUpload(formData).pipe(
      // Handle response if needed
    );
  }
}
