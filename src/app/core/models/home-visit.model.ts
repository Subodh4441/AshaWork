export interface HomeVisit {
  id: number;
  visitDate: string;
  ashaName: string;
  village: string;
  familyName: string;
  visitType: string;
  notes: string;
}

export interface CreateHomeVisitRequest {
  visitDate: string;
  ashaName: string;
  village: string;
  familyName: string;
  visitType: string;
  notes: string;
  language: string;
}
