export interface IUser {
    userID?: number;          
    userName: string;        
    password: string;        
    created: Date;         
    roleID: number;            
    clientID: number;         
    isActive: boolean;        
    roleName?: string;        
    displayName: string;     
    mobileNumber: string;   
    emailID: string;          
    employeeCode: number;    
    branchID: number;        
    branchGroupID: number;    
    TenantID?:number;
    MultipleTenantID?:string;
  }
  