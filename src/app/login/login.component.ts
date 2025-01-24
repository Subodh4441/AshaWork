import { Component, AfterViewInit, OnDestroy, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserCredential } from '../model/UserCredential';
import { ApiServiceService } from '../services/api-service.service';
import { EncryptionService } from '../services/encryption.service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../Shared/navbar/navbar.component';
import { CarouselComponent } from '../carousel/carousel.component';


@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [FormsModule,NgxSpinnerModule,CommonModule,CarouselComponent],
  template :`<app-navbar [childData]="this.usernameValue"></app-navbar>`,
})
export class LoginComponent implements AfterViewInit {
  usernameValue: string = '';
  passwordValue: string = '';
  usernameError: any;
  passwordError: any;
  commonError: any;
  isPasswordVisible: boolean = false;

 

 
  constructor(private router: Router, private apiService: ApiServiceService,private encrypt: EncryptionService,private spinner: NgxSpinnerService){}

  ngOnInit():void{
    history.pushState(null, '', location.href);
    window.onpopstate = function() {
    history.pushState(null, '', location.href);
    };
     }

  ngAfterViewInit(): void {
    // This method can be used if you need to perform any actions after the view initializes
  }

  // onInputChange(event: Event): void {
  //   const input = event.target as HTMLInputElement;
  // }

  onInputChange(event: Event): void {
    this.passwordValue = (event.target as HTMLInputElement).value;
  }

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible; // Toggle visibility
  }

  focusinp(inp: string): void {
    if (inp === 'usr') {
        document.getElementById('username')?.focus();
    } else if (inp === 'pass') {
        document.getElementById('password')?.focus();
    } else {
        document.getElementById('username')?.focus();
    }
  }

  login(): void {
    this.spinner.show();
    this.commonError = '';

    let uc = new UserCredential();
    uc.UserName = this.usernameValue;
    uc.Password = this.passwordValue;
    // uc.Password = this.encrypt.encryptionAES(this.passwordValue.trim()).toString();
  
    // Validate empty fields before calling the API
    if (!this.usernameValue || !this.passwordValue) {
      this.spinner.hide();
      this.commonError = 'Username and Password are required';
      return;
    }
  
    this.apiService.ValidateUser(uc).subscribe(
      (response) => {
        debugger
        console.log(response);
        if (response && response.token && response.user) {  // Check if response contains both token and user data
          const token = response.token;
          const user = response.user;
          
          // Store token in localStorage
          localStorage.setItem('token', token);
          localStorage.setItem('user', user);
          
          // Optionally, store user data (you can choose how you want to store user data)
          sessionStorage.setItem('userName', user.userName);
          sessionStorage.setItem('userID', user.userID);
          sessionStorage.setItem('role', user.roleID);
          sessionStorage.setItem('rolename', user.roleName);
          sessionStorage.setItem('tenantID', user.tenantID);
          sessionStorage.setItem('tenantName', user.tenantName);
          sessionStorage.setItem('userDetails', JSON.stringify(user)); // Storing full user object
          
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
            this.spinner.hide();
          }, 1000);
        }
      },
      (error) => {
        this.spinner.hide();
        console.log(error);
        if (error === 'User not found') {
          this.commonError = 'Invalid credentials. User not found.';
        } else {
          this.commonError = 'Something went wrong. Please try again.';
        }
      }
    );
    
    // Optionally hide the spinner after a timeout if the subscription doesn't resolve quickly
    setTimeout(() => {
      this.spinner.hide();
    }, 1000);
    
  }
  
}
