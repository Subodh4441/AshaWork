import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  getDecodedToken(): any | null {
    const token = localStorage.getItem('token'); // Fetch the JWT token from localStorage or other storage
    if (token) {
      try {
        return jwtDecode(token);
      } catch (error) {
        console.error('Invalid token', error);
        return null;
      }
    }
    return null;
  }

  getLoginID(): string | null {
    const decodedToken = this.getDecodedToken();
    return decodedToken?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || null;
  }

  getUserName(): string | null {
    const decodedToken = this.getDecodedToken();
    return decodedToken?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/userdata'] || null;
  }

  getRole(): string | null {
    const decodedToken = this.getDecodedToken();
    return decodedToken?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || null;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.clear();
    sessionStorage.clear();
  }
}
