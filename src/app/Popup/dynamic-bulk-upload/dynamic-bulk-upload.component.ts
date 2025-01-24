// dynamic-bulk-upload.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ApiServiceService } from '../../services/api-service.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dynamic-bulk-upload',
  templateUrl: './dynamic-bulk-upload.component.html',
  styleUrls: ['./dynamic-bulk-upload.component.css']
})
export class DynamicBulkUploadComponent {
  @Input() entityType: string = '';          
  @Input() fields: string[] = [];            
  @Output() uploadSuccess: EventEmitter<void> = new EventEmitter();
  @Output() uploadFailure: EventEmitter<string> = new EventEmitter();
  selectedFile: File | null = null;
  
  file: File | null = null; 
  previewData: any[] = [];
  constructor(private dialogRef: MatDialogRef<DynamicBulkUploadComponent>,private api: ApiServiceService) {}

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      console.log('Selected file:', file.name);
    } else {
      this.selectedFile = null;
      console.warn('No file selected.');
    }
  }

  // Read and parse the file (CSV in this example)
  private previewFile(file: File): void {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const fileData = e.target.result;
      this.previewData = this.parseCSV(fileData); 
    };
    reader.readAsText(file);
  }

  // Basic CSV parsing
  private parseCSV(data: string): any[] {
    const lines = data.split('\n');
    return lines.map(line => line.split(','));
  }

  onSubmit() {
    if (!this.selectedFile) {
      alert('Please select a file before submitting.');
      return;
    }
    const formData = new FormData();
    formData.append('file', this.selectedFile, this.selectedFile.name);

    this.api.excelFileUpload(formData).subscribe(
      response => {
        alert('File uploaded successfully.');
        this.dialogRef.close('success'); 
      },
      error => {
        alert('Error uploading file.');
        console.error('Upload error:', error);
      }
    );
  }
  onCancel(): void {
    this.dialogRef.close(); // Close the dialog without any action
  }
}
