export interface ImageUpload {
    browserId: number;
    imagePath: string;
    duration: number;
    isActive: boolean;
    createdDate: string;  // You could use Date if you're handling it as a Date object in Angular
    endDate: string;      // Same as above, Date type if using Date objects
    tenantID: number;
  }
  