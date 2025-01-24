import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, catchError, EMPTY, throwError, BehaviorSubject } from 'rxjs';
import { ApiResponseModel } from '../model/ApiResponseModel';
import { UserCredential } from '../model/UserCredential';
import { ConfigJSONService } from './config-json.service';
import { IClient } from '../Interface/IClient';
import { IProduct } from '../Interface/IProduct';
import { IRegion } from '../Interface/IRegion';
import { IUser } from '../Interface/IUser';
import { IServiceAgencies } from '../Interface/IServiceAgencies';
import { IBranch } from '../Interface/IBranch';
import { IRole } from '../Interface/IRole';
import { IServiceAgency } from '../Interface/service-agency';
import { ImageUpload } from '../Interface/IUploadImage';
import { ISpare } from '../Interface/ISpare';
import { ICarouselSlide } from '../Interface/IcarouselSlide';
import { IRoleFeature } from '../Interface/IRoleFeature';
import { ITenant } from '../Interface/ITenant';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {
 
  constructor(private http: HttpClient, private configJSONService: ConfigJSONService) 
  { 
  } 
  // private apiUrl = 'https://localhost:44373/api/Client/AddClient';
  

  // private storedString: string = '';
  private stringSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  // // Method to store a string
  // setString(value: string): void {
  //   this.storedString = value;
  // }
 // Method to set a new string
 setString(value: string): void {
  this.stringSubject.next(value);
}

  // Method to retrieve the stored string
  // getString(): string {
  //   return this.storedString;
  // }

 // Method to get the observable for the string
 getString(): Observable<string> {
  return this.stringSubject.asObservable();
}

ValidateUser(userCredential: UserCredential): Observable<any> { 
  debugger
  const url = `api/Account/login?Username=${userCredential.UserName}&Password=${userCredential.Password}`;

  return this.http.post(this.configJSONService.appconfigdata.apiUrl + url, null, { responseType: 'json' })  // Set responseType to 'json' to automatically parse JSON
    .pipe(
      map(response => {
        // Now the response includes the token, status, user, and message
        return response;  // You can return the entire response or access specific properties
      }),
      catchError(error => {
        if (error.status === 404 && error.error === 'User not found') {
          return throwError('User not found');
        }
        return throwError('Something went wrong. Please try again.');
      })
    );
}

  public BulkUpload(bulkuploadData: any): Observable<ApiResponseModel> {
    // Set the headers, e.g., for JSON data
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',  // Ensure the server understands JSON format
      'Accept': 'application/json'
    });

    // Send the POST request with the file data
    return this.http.post<ApiResponseModel>(this.configJSONService.appconfigdata.apiUrl + "api/Client/UploadFile", bulkuploadData, { headers })
      .pipe(
        map(response => response),  // Handle response
        catchError(error => {
          console.error('Upload failed:', error);
          return throwError(error);  // Return an error in case of failure
        })
      );
  }
  public GetAllUsers(): Observable<ApiResponseModel> {
    return this.http.get<ApiResponseModel>(this.configJSONService.appconfigdata.apiUrl + "api/User/getusers")
      .pipe(
        map(response => response),
        catchError(error => {
          //return EMPTY;
          return throwError(error);
        })
      );
  }
  public updateProduct(product: IProduct): Observable<IProduct> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
  
    return this.http.put<IProduct>(`${this.configJSONService.appconfigdata.apiUrl}api/Product/${product.productId}`, product, { headers })
      .pipe(
        map(response => response),
        catchError(error => {
          console.error('Product update failed:', error);
          return throwError(error); // Return error if update fails
        })
      );
  }

  public addClient(client: IClient): Observable<string> { // Expecting a text response
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
  
    console.log(client);
  
    return this.http.post(`${this.configJSONService.appconfigdata.apiUrl}api/Client/AddClient`, client, {
      headers,
      responseType: 'text' // Indicate the response is plain text
    }).pipe(
      map((response: string) => {
        console.log("Add Client API Response:", response);
        return response; // Returning the plain text response
      }),
      catchError(error => {
        console.error("Client creation failed:", error);
        return throwError(() => new Error(error.message || "Unknown error occurred"));
      })
    );
  }
  
  public UpdateClient(client: IClient): Observable<string> { // Expecting a text response
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
  
    console.log(client);
  
    return this.http.post(`${this.configJSONService.appconfigdata.apiUrl}api/Client/UpdateClient`, client, {
      headers,
      responseType: 'text' // Indicate the response is plain text
    }).pipe(
      map((response: string) => {
        console.log("Update Client API Response:", response);
        return response; // Returning the plain text response
      }),
      catchError(error => {
        console.error("Client updation failed:", error);
        return throwError(() => new Error(error.message || "Unknown error occurred"));
      })
    );
  }

  
  
  public addProduct(product: IProduct): Observable<IProduct> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',  // Ensure the server understands JSON format
      'Accept': 'application/json'
    });
  
    // Send the POST request with the product data
    return this.http.post<IProduct>(`${this.configJSONService.appconfigdata.apiUrl}api/Product`, product, { headers })
      .pipe(
        map(response => response),  // Handle response
        catchError(error => {
          console.error('Product creation failed:', error);
          return throwError(error);  // Return error if something goes wrong
        })
      );
    }
 
    
 
  
  // public deleteUser(userId: number): Observable<any> {
  //   return this.http.delete(`${this.configJSONService.appconfigdata.apiUrl}api/User/deleteuser/${userId}`, { responseType: 'text' })
  //   .pipe(
  //     map(response => response),
  //     catchError(error => {
  //       return throwError(error);
  //     })
  //   );
  // }
  
  public changeStatus(userDetails: any): Observable<any> {
    return this.http.put(`${this.configJSONService.appconfigdata.apiUrl}api/User/changeStatus`, userDetails)
    .pipe(
      map(response => response),
      catchError(error => {
        return throwError(error);
      })
    );
  }

  public updateStatus(userId: number, status: boolean): Observable<any> {
    return this.http.put(`${this.configJSONService.appconfigdata.apiUrl}api/User/updateStatus`, null, {
      params: {
        userId: userId.toString(),
        status: status
      }
    })
    .pipe(
      map(response => response),
      catchError(error => {
        return throwError(error);
      })
    );
  }
  
  // public changePassword(userDetails: any): Observable<any> {
  //   return this.http.put(this.configJSONService.appconfigdata.apiUrl + "api/User/changePassword", userDetails)
  //   .pipe(
  //     map(response => response),
  //     catchError(error => {
  //       return throwError(error);
  //     })
  //   );
  // }


  // public changePassword(LoginID:number|undefined,oldPassword:string,newPassword:string,confirmPassword:string): Observable<any> {
  //   const url = this.configJSONService.appconfigdata.apiUrl + `api/User/ChangePassword?UserID=${LoginID}&oldPassword=${oldPassword}&newPassword=${newPassword}&confirmPassword=${confirmPassword}`; 
  //   return this.http.post(url, '').pipe(
  //     map((response) => response),
  //     catchError((error) => throwError(error))
  //   );
  // }

  public changePassword(userDetails: any): Observable<any> {
    const url = `${this.configJSONService.appconfigdata.apiUrl}api/Account/ChangePassword`;
    const params = new HttpParams()
      .set('UserID', userDetails.UserID)
      .set('oldPassword', userDetails.oldPassword)
      .set('newPassword', userDetails.newPassword)
      .set('confirmPassword', userDetails.confirmPassword);
  
    return this.http.post(url, {}, { params }).pipe(
      map((response) => response),
      catchError((error) => throwError(error))
    );
  }
  
  
  public resetPassword(userDetails: any): Observable<any> {
    return this.http.put(this.configJSONService.appconfigdata.apiUrl + "api/User/resetPassword?", userDetails)
      .pipe(
        map(response => response),
        catchError(error => {
          const errorMessage = error?.error?.message || 'An error occurred while resetting the password.';
          return throwError(() => new Error(errorMessage));
        })
      );
  }
  
  // // Role API
  public GetAllRoles(): Observable<ApiResponseModel> {
    return this.http.get<ApiResponseModel>(this.configJSONService.appconfigdata.apiUrl + "api/Role/GetRole")
      .pipe(
        map(response => response),
        catchError(error => {
          return throwError(error);
        })
      );
  }
 
  public AddRole(roleData: any): Observable<ApiResponseModel> {
    return this.http.post<ApiResponseModel>(this.configJSONService.appconfigdata.apiUrl + "api/Role/AddRole", roleData)
      .pipe(map(response => response),
        catchError(error => { 
          return throwError(error); 
        })
      );
  }
  //  BulkUpload(clientData: any[]): Observable<any> {
  //  const apiUrl = 'https://localhost:44373/api/Client/UploadFile';  // Replace with actual API URL
  //   return this.http.post(apiUrl, { data: clientData });  // Assuming the data is sent in a 'data' object
  // }
  //  public BulkUpload(bulkuploadData: any): Observable<ApiResponseModel> {
  //   return this.http.post<ApiResponseModel>(this.configJSONService.appconfigdata.apiUrl + "api/Client/UploadFile", bulkuploadData)
  //     .pipe(map(response => response),
  //        catchError(error => { 
  //         return throwError(error); 
  //       })
  //     );
  //  } 
 
  public GetRoleById(roleId: number): Observable<ApiResponseModel> {
    const url = `${this.configJSONService.appconfigdata.apiUrl}api/Role/GetRoleById?roleId=${roleId}`;
    return this.http.get<ApiResponseModel>(url)
      .pipe(
        map(response => response),
        catchError(error => {
          return throwError(error);
        })
      );
  }
 
  public DeleteRole(roleId: number): Observable<boolean> {
    return this.http.post<boolean>(`${this.configJSONService.appconfigdata.apiUrl}api/Role/DeleteRole`, roleId)
      .pipe(map(response => response),
        catchError(error => { 
          return throwError(error);
        })
      );
  }

  public EditRole(roleId: number, upadteRoleDetails: any): Observable<boolean> {
    const url = `${this.configJSONService.appconfigdata.apiUrl}api/Role/UpdateRole`
    return this.http.post<boolean>(url, upadteRoleDetails, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      params: { roleId: roleId }
    }).pipe(map(response => response),
      catchError(error => { 
        return throwError(error);
      })
    );
  }
 
  public UpdateRoleStatus(roleId: number, isActive: boolean): Observable<boolean> {
    const url = `${this.configJSONService.appconfigdata.apiUrl}api/Role/updateStatus?roleId=${roleId}&isActive=${isActive}`;
    return this.http.post<boolean>(url, null).pipe(
      map(response => response),
      catchError(error => {
        return throwError(error);
      })
    );
  }
 
  public GetAllPermissions(roleId: number): Observable<ApiResponseModel> {
    const url = `${this.configJSONService.appconfigdata.apiUrl}api/Role/GetAllMenuPermissions?roleId=${roleId}`;
    return this.http.get<ApiResponseModel>(url)
      .pipe(map(response => response),
        catchError(error => { 
          return throwError(error);
        })
      );
  }
 
  public SavePermissions(permissionsPayload: any): Observable<boolean> {
    const url = `${this.configJSONService.appconfigdata.apiUrl}api/Role/SaveMenuPermission`;
    return this.http.post<boolean>(url, permissionsPayload).pipe(
      map(response => response),
      catchError(error => {
        return throwError(error);
      })
    );
  }
 
  getClients(): Observable<IClient[]> {
    const url = `${this.configJSONService.appconfigdata.apiUrl}api/Client`;
    return this.http.get<IClient[]>(url);
  }

  
  getRoles(): Observable<IRole[]> {
    debugger
    const url = `${this.configJSONService.appconfigdata.apiUrl}api/Role/GetRoles`;
    return this.http.get<IRole[]>(url);
  }
  getProducts(): Observable<IProduct[]> {
    const url = `${this.configJSONService.appconfigdata.apiUrl}api/Product`;
    return this.http.get<IProduct[]>(url);
  }
 
  public addRolesandRights(role: IRole): Observable<IRole> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',  // Ensure the server understands JSON format
      'Accept': 'application/json'
    });
  
    // Send the POST request with the product data
    return this.http.post<IRole>(`${this.configJSONService.appconfigdata.apiUrl}api/Role/AddRoles`, role, { headers })
      .pipe(
        map(response => response),  // Handle response
        catchError(error => {
          console.error('Product creation failed:', error);
          return throwError(error);  // Return error if something goes wrong
        })
      );
    }
    
  getRegions(): Observable<IRegion[]> {
    const url = `${this.configJSONService.appconfigdata.apiUrl}api/Region/GetCountriesStatesAndCitys`;
    return this.http.get<IRegion[]>(url);
  }
  public UpdateRoles(role: IRole): Observable<string> { // Expecting a text response
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
  
    console.log(role);
  
    return this.http.post(`${this.configJSONService.appconfigdata.apiUrl}api/Role/UpdateRole`, role, {
      headers,
      responseType: 'text' // Indicate the response is plain text
    }).pipe(
      map((response: string) => {
        console.log("Update Client API Response:", response);
        return response; // Returning the plain text response
      }),
      catchError(error => {
        console.error("Client updation failed:", error);
        return throwError(() => new Error(error.message || "Unknown error occurred"));
      })
    );
  }
  getCountry(): Observable<IRegion[]> {
    const url = `${this.configJSONService.appconfigdata.apiUrl}api/Region/GetCountries`;
    return this.http.get<IRegion[]>(url);
  }

  
  getState(): Observable<IRegion[]> {
    const url = `${this.configJSONService.appconfigdata.apiUrl}api/Region/GetStates`;
    return this.http.get<IRegion[]>(url);
  }

  getCity(): Observable<IRegion[]> {
    const url = `${this.configJSONService.appconfigdata.apiUrl}api/Region/GetCountriesStatesAndCitys`;
    return this.http.get<IRegion[]>(url);
  }

  getCountriesAndStates(): Observable<IRegion[]> {
    const url = `${this.configJSONService.appconfigdata.apiUrl}api/Region/GetCountriesAndStates`;
    return this.http.get<IRegion[]>(url);
  }

  excelFileUpload(formData: FormData): Observable<any> {
    return this.http.post(this.configJSONService.appconfigdata.apiUrl + "api/Product/upload-excel", formData)
    .pipe(map(response => response),
    catchError(error => { 
      return throwError(error); 
    })
  );
  }

  // addCountry(): Observable<IRegion[]> {
  //   const url = `${this.configJSONService.appconfigdata.apiUrl}api/Region/AddCountry`;
  //   return this.http.get<IRegion[]>(url);
  // }

  // addState(): Observable<IRegion[]> {
  //   const url = `${this.configJSONService.appconfigdata.apiUrl}api/Region/AddState`;
  //   return this.http.get<IRegion[]>(url);
  // }

  // addCity(): Observable<IRegion[]> {
  //   const url = `${this.configJSONService.appconfigdata.apiUrl}api/Region/AddCity`;
  //   return this.http.get<IRegion[]>(url);
  // }

  addUpdateCountry(countryId: number, name: string): Observable<IRegion[]> {
    const url = `${this.configJSONService.appconfigdata.apiUrl}api/Region/AddCountry`;
    const body = { countryId, name };
    return this.http.post<IRegion[]>(url, body);
  }
  
  addUpdateState(countryId: number, stateId: number, name: string): Observable<IRegion[]> {
    const url = `${this.configJSONService.appconfigdata.apiUrl}api/Region/AddState?countryId=${countryId}`;
    const body = { stateId, name, countryId };
    return this.http.post<IRegion[]>(url, body);
  }
  
  addUpdateCity(stateId: number, cityId: number, name: string): Observable<IRegion[]> {
    const url = `${this.configJSONService.appconfigdata.apiUrl}api/Region/AddCity?stateId=${stateId}`;
    const body = { cityId, name, stateId };
    return this.http.post<IRegion[]>(url, body);
  }
  
  // async post(endpoint: string, payload: any): Promise<any> {
  //   return this.http.post(`${this.configJSONService.appconfigdata.apiUrl}`+endpoint, payload).toPromise();
  // }

  async post(endpoint: string, payload: any): Promise<any> {
    try {
      const response = await this.http
        .post(`${this.configJSONService.appconfigdata.apiUrl}${endpoint}`, payload, { responseType: 'text' })
        .toPromise();
      console.log('API call successful:', response);
      return response; // Return the string response
    } catch (error) {
      console.error('API call failed:', error);
      throw error; // Rethrow the error for further handling
    }
  }

  // Add or Update a user
  addUpdateUser(user: IUser): Observable<IUser[]> {
    const url = `${this.configJSONService.appconfigdata.apiUrl}api/Region/AddCountry`;// POST to add or update user
    return this.http
      .post<IUser[]>(url, user)
      .pipe(catchError(this.handleError));  // Error handling
  }

// Get all users
getUsers(): Observable<IUser[]> {
  return this.http
    .get<any>( `${this.configJSONService.appconfigdata.apiUrl}api/User`) 
    .pipe(catchError(this.handleError));
}

// Get a user by ID
getUserById(userId: number): Observable<any> {
  const url = `${this.configJSONService.appconfigdata.apiUrl}api/User/${userId}`;
  return this.http
    .get<any>(url)
    .pipe(catchError(this.handleError));
}

addUser(user: IUser): Observable<any> {
  console.log('Adding user:', user);  
  return this.http
    .post<any>(`${this.configJSONService.appconfigdata.apiUrl}api/User/AddUser`, user, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
    .pipe(catchError(this.handleError));
}
 

updateUser(user: IUser): Observable<any> {
  console.log('Updating user:', user); 
  return this.http
    .put<any>(`${this.configJSONService.appconfigdata.apiUrl}api/User`, user, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
    .pipe(catchError(this.handleError));
}
 

// Delete a user by ID
deleteUser(userId: number): Observable<void> {
  const url = `${this.configJSONService.appconfigdata.apiUrl}api/User/${userId}`;
  return this.http
    .delete<void>(url)
    .pipe(catchError(this.handleError));  // Error handling
}

// Error handling method
private handleError(error: any): Observable<never> {
  console.error('An error occurred:', error);
  // Customize error handling as per your requirements
  throw new Error('Something went wrong; please try again later.');
}
getAllBranches(): Observable<IBranch[]> {
  const url = `${this.configJSONService.appconfigdata.apiUrl}api/Branch`;
  return this.http.get<IBranch[]>(url);
}

getAllserviceAgency(): Observable<IServiceAgencies[]> {
  const url = `${this.configJSONService.appconfigdata.apiUrl}api/ServiceAgency`;
  return this.http.get<IServiceAgencies[]>(url);
}

addBranch(branch: IBranch): Observable<any> {
  const url = `${this.configJSONService.appconfigdata.apiUrl}api/Branch`;
  console.log("Get addBranch API url: "+url);
  return this.http.post<IBranch>(url, branch);
}

public updateBranch(branches: IBranch): Observable<any> {
  return this.http.put(this.configJSONService.appconfigdata.apiUrl + "api/Branch/"+`${branches.id}`, branches)
  .pipe(map(response => response),catchError(error => {return throwError(error);}));
}

getStatesByCountry(countryId: number): Observable<IRegion[]> {
  const url = `${this.configJSONService.appconfigdata.apiUrl}api/Region/stateBycountry/${countryId}`;
  return this.http.get<IRegion[]>(url);
}

getCityByStates(stateId: number): Observable<IRegion[]> {
  const url = `${this.configJSONService.appconfigdata.apiUrl}api/Region/cityByState/${stateId}`;
  return this.http.get<IRegion[]>(url);
}


public UpdateServiceAgency(service: IServiceAgency): Observable<any> {
  debugger// Expecting a text response
  const headers = new HttpHeaders({
   
    'Content-Type': 'application/json',  // Ensure the server understands JSON format
    'Accept': 'application/json'
  });

  console.log(service);

  return this.http.post(`${this.configJSONService.appconfigdata.apiUrl}api/ServiceAgency/UpdateServiceAgency`, service, {
    headers,
    responseType: 'text' // Indicate the response is plain text
  }).pipe(
    map((response: string) => {
      console.log("Update Service Agency API Response:", response);
      return response; // Returning the plain text response
    }),
    catchError(error => {
      console.error("Service Agency updation failed:", error);
      return throwError(() => new Error(error.message || "Unknown error occurred"));
    })
  );
}


 //------------  Add Service Agency  
 public addServiceAgency(service: IServiceAgency): Observable<any> {
  debugger;

  const headers = new HttpHeaders({
   
    'Content-Type': 'application/json',  // Ensure the server understands JSON format
    'Accept': 'application/json'
 
  });

  console.log(service);

  return this.http.post(`${this.configJSONService.appconfigdata.apiUrl}api/ServiceAgency`, service, {headers,
responseType: 'text'}).pipe(
      map(Response => {
        return Response;
      }),
    catchError(error => {
      //return EMPTY;
      return throwError(error);
    })
  );  

     
}

getServiceAgency1(): Observable<IRegion[]> {
  debugger
  const url = `${this.configJSONService.appconfigdata.apiUrl}api/Region/GetStatesAndCities`;
  return this.http.get<IRegion[]>(url);
}
getServiceAgency(): Observable<IServiceAgency[]> {
  debugger
  const url = `${this.configJSONService.appconfigdata.apiUrl}api/ServiceAgency`;
  return this.http.get<IServiceAgency[]>(url);
}

addImageUpload(imageUpload: ImageUpload): Observable<ImageUpload> {
  debugger
  const headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });
  console.log('Sending Image Upload:', imageUpload);
  return this.http.post<ImageUpload>(`${this.configJSONService.appconfigdata.apiUrl}api/ImageUpload/AddImageUpload`, imageUpload, { headers });
}




getsparevariant():Observable<ISpare[]>{
  debugger
  return this.http.get<any>( `${this.configJSONService.appconfigdata.apiUrl}api/Spare/GetSpareList`) 
    .pipe(catchError(this.handleError));


}

public addSpareVariant(sparevarinatData: ISpare): Observable<any> {
  debugger // Expecting a text response
  const headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  console.log(sparevarinatData);

  return this.http.post(`${this.configJSONService.appconfigdata.apiUrl}api/Spare/AddSpareVariant`, sparevarinatData, {
    headers,
    responseType: 'text' // Indicate the response is plain text
  }).pipe(
    map((response: string) => {
      console.log("Add Client API Response:", response);
      return response; // Returning the plain text response
    }),
    catchError(error => {
      console.error("Client creation failed:", error);
      return throwError(() => new Error(error.message || "Unknown error occurred"));
    })
  );
}



public updateSpareVariant(sparevarinatData: ISpare): Observable<any> {
  debugger // Expecting a text response
  const headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  console.log(sparevarinatData);

  return this.http.post(`${this.configJSONService.appconfigdata.apiUrl}api/Spare/UpdateSpareVariant`, sparevarinatData, {
    headers,
    responseType: 'text' // Indicate the response is plain text
  }).pipe(
    map((response: string) => {
      console.log("UpdateSpareVariant API Response:", response);
      return response; // Returning the plain text response
    }),
    catchError(error => {
      console.error("UpdateSpareVariant creation failed:", error);
      return throwError(() => new Error(error.message || "Unknown error occurred"));
    })
  );
}


// Delete a SpareVariant by ID
deleteSpareVariant(sparevariantId: number): Observable<any> {
  debugger
  const url = `${this.configJSONService.appconfigdata.apiUrl}api/Spare/${sparevariantId}`;
  return this.http
    .delete<void>(url)
    .pipe(catchError(this.handleError));  // Error handling

}



getspare():Observable<ISpare[]>{
  debugger
  return this.http.get<any>( `${this.configJSONService.appconfigdata.apiUrl}api/Spare/GetSpareNameList`) 
    .pipe(catchError(this.handleError));


}


public addSpareName(spareData: ISpare): Observable<any> {
  debugger // Expecting a text response
  const headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  console.log(spareData);

  return this.http.post(`${this.configJSONService.appconfigdata.apiUrl}api/Spare/AddSpare`, spareData, {
    headers,
    responseType: 'text' // Indicate the response is plain text
  }).pipe(
    map((response: string) => {
      console.log("Add Client API Response:", response);
      return response; // Returning the plain text response
    }),
    catchError(error => {
      console.error("Client creation failed:", error);
      return throwError(() => new Error(error.message || "Unknown error occurred"));
    })
  );
}




public updateSpareName(spareData: ISpare): Observable<any> {
  debugger
  debugger // Expecting a text response
  const headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  console.log(spareData);

  return this.http.post(`${this.configJSONService.appconfigdata.apiUrl}api/Spare/UpdateSpare`, spareData, {
    headers,
    responseType: 'text' // Indicate the response is plain text
  }).pipe(
    map((response: string) => {
      console.log("UpdateSpareVariant API Response:", response);
      return response; // Returning the plain text response
    }),
    catchError(error => {
      console.error("UpdateSpareVariant creation failed:", error);
      return throwError(() => new Error(error.message || "Unknown error occurred"));
    })
  );
}


// Delete a SpareVariant by ID
deleteSpare(spareId: number): Observable<any> {
  debugger
  const url = `${this.configJSONService.appconfigdata.apiUrl}api/Spare/spare/${spareId}`;
  return this.http
    .delete<void>(url)
    .pipe(catchError(this.handleError));  // Error handling

}
getAllImages():Promise<ICarouselSlide[]|undefined>  {
  return this.http.get<ICarouselSlide[]>( `${this.configJSONService.appconfigdata.apiUrl}api/ImageUpload/GetAllImagesAsBase64`).toPromise(); // Make a GET request
}


// fetchBrowserObjects(): Promise<ICarouselSlide[]> {
//   const apiUrl = 'https://your-api-url.com/endpoint'; // Replace with your API endpoint
//   return this.http.get<BrowserSlide[]>(apiUrl).toPromise();
// }



getUserListByRoleName(rolename: string): Observable<IUser[]> {
  debugger
  const url = `${this.configJSONService.appconfigdata.apiUrl}api/User/GetRolesByRoleName/${rolename}`;
  return this.http.get<IUser[]>(url);
}

getAllRoleList(): Observable<IRole[]> {
  const url = `${this.configJSONService.appconfigdata.apiUrl}api/Role/GetAllRoles`;
  return this.http.get<IRole[]>(url);
}


getrolepermission(userID: number): Observable<any> {
  debugger
 
  const url = `${this.configJSONService.appconfigdata.apiUrl}api/Role/GetRoleFeatures/${userID}`;
  return this.http.get<void>(url).pipe(catchError(this.handleError));  

}

updateUserRights(dataToSave: IRoleFeature[]): Observable<any> {
  debugger
  
  console.log(dataToSave);
  if (!dataToSave) {
    console.error('No data found for menuName "Clients".');
    return throwError(() => new Error('No data to save.'));
  }
  console.log('Filtered Data:', dataToSave); 
  return this.http.post(`${this.configJSONService.appconfigdata.apiUrl}api/Role/UpdateRoleFeatures`, dataToSave, {
    headers: new HttpHeaders({'Content-Type': 'application/json'}),
    responseType: 'text'
  }).pipe(
    map((response: string) => {
      console.log("API Response:", response);
      return response;
    }),
    catchError(error => {
      console.error("Error during API call:", error);
      return throwError(() => new Error(error.message || "Unknown error occurred"));
    })
  );
}

getTenantdata(): Observable<ITenant[]> {
  return this.http.get<any>(`${this.configJSONService.appconfigdata.apiUrl}api/Tenant/GetTenantList`)
    .pipe(catchError(this.handleError));
}
deleteTenant(tenantID: number): Observable<any> {
  debugger
  const url = `${this.configJSONService.appconfigdata.apiUrl}api/Tenant/${tenantID}`; 
  return this.http
    .delete<void>(url)  
    .pipe(catchError(this.handleError));  
}
 
public addTenant(tenant: ITenant): Observable<ITenant> {
  debugger
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',  
    'Accept': 'application/json'
  });
 
  return this.http.post<ITenant>(`${this.configJSONService.appconfigdata.apiUrl}api/Tenant/AddTenant`, tenant, { headers })
    .pipe(
      map(response => response),  
      catchError(error => {
        console.error('Tenant creation failed:', error);
        return throwError(error);  
      })
    );
}
 
 
 
  // Method to update a tenant by ID
  updateTenant(tenantId: number, tenantData: ITenant): Observable<any> {
    debugger
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
 
    // Call the PUT API with tenant ID and data
    return this.http.put(`${this.configJSONService.appconfigdata.apiUrl}api/Tenant/${tenantId}`, tenantData, {
      headers,
      responseType: 'text' // Expecting a plain text response
    }).pipe(
      map((response: string) => {
        console.log("UpdateTenant API Response:", response);
        return response; // Returning the plain text response
      }),
      catchError((error) => {
        console.error("Error updating tenant:", error);
        return throwError(() => new Error(error.message || "Unknown error occurred"));
      })
    );
  }

}
