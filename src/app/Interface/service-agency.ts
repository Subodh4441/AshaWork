export interface IServiceAgency {
    id: number;
    serviceAgencyName: string;
    stateId: number;
    cityId: number;
    address: string;
    pinCode: string;
    contactName: string;
    contactMobile: string;
    contactEmail: string;
    active: number;
    cityName: '' | undefined
    stateName: '' | undefined
  }
  