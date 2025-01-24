export interface IClient{
    clientID?: number,
    clientName: string,
    clientAbbr: string,
    isActive: boolean,  
    owner: string,
    createdBy: number,
    createdDate : Date
   
}