import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild,Input} from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import * as bootstrap from 'bootstrap';
import { ApiServiceService } from '../../services/api-service.service';
import { EncryptionService } from '../../services/encryption.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';
import { DialogModule } from 'primeng/dialog';  // For the Dialog component
import { ButtonModule } from 'primeng/button';  // For buttons (like "Save" and "Close" inside the dialog)
import { InputTextModule } from 'primeng/inputtext';  // For input fields inside the form
import { PasswordModule } from 'primeng/password';
import { trigger, transition, style, animate } from '@angular/animations';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { ClientComponent } from "../../Masters/client/client.component";

export interface ResetPasswordModel {
  loginId: any;
  currentPassword: string;
  newPassword: string;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule, FormsModule, DialogModule, ButtonModule, InputTextModule, PasswordModule, NgxSpinnerModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  template: `<div>{{ childData }}</div>`,
  animations: [
    trigger('fadeOut', [
      transition(':leave', [
        style({ opacity: 1 }),
        animate('1s', style({ opacity: 0 }))
      ])
    ])
  ]
})

export class NavbarComponent implements OnInit, OnDestroy {
  @ViewChild('profileDiv') profileDiv!: ElementRef;
  menuActive: boolean = false;
  @Input() childData: string = 'Akshay Morkar';
  userName: any;
  clildinfo ='';
  role: any;
  selectedUser: any;
  roleName:any;
  menus = [
    { title: 'Masters', links: [{ label: 'Clients', path: '/clients' }, { label: 'Products', path: '/products' }] },
    { title: 'Call Management', links: [{ label: 'Calls', path: '/calls' }] },
    { title: 'Reports', links: [{ label: 'Reports', path: '/reports' }] }
  ];
  menuVisible: boolean = false;
  exportMenuVisible: boolean = false;

  resetPasswordForm: FormGroup;
  displayResetPasswordDialog: boolean = false;
  logoutDialogVisible: boolean = false;
  isLoggingOut: boolean = false;

  constructor(private fb: FormBuilder, public apiMethodService: ApiServiceService, private encrypt: EncryptionService,private toastr: ToastrService, private authService: AuthService,private renderer: Renderer2, private router: Router,private spinner: NgxSpinnerService) {
    this.resetPasswordForm = this.fb.group({
      loginId: [{ value: this.authService.getLoginID()}],
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]]
    });
  }
 
  ngOnInit() {
    history.pushState(null, '', location.href);
    window.onpopstate = function() {
    history.pushState(null, '', location.href);
    };
    this.clildinfo = this.childData;
    this.userName = this.authService.getLoginID();
    this.renderer.listen('document', 'click', (event: MouseEvent) => {
      if (this.profileDiv && !this.profileDiv.nativeElement.contains(event.target)) {
        this.menuActive = false;
      }
    });

    this.role = this.authService.getRole();
    this.resetPasswordForm.reset({
      loginId: this.authService.getLoginID(),
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });

    this.userName = sessionStorage.getItem('userName');
    this.role = sessionStorage.getItem('role');
    this.roleName=sessionStorage.getItem('rolename');
    history.pushState(null, '', location.href);
    window.onpopstate = function() {
    history.pushState(null, '', location.href);
    };
  }

  toggleMenu(menuType: 'menu' | 'exportMenu') {
    if (menuType === 'menu') {
      this.menuVisible = !this.menuVisible;
      this.exportMenuVisible = false; // Close export menu if it's open
    } else if (menuType === 'exportMenu') {
      this.exportMenuVisible = !this.exportMenuVisible;
      this.menuVisible = false; // Close profile menu if it's open
    }
  }

test(){
  this.router.navigate(['clients'])
}
  resetPassword(): void {
    debugger;
    if (this.resetPasswordForm.invalid) {
      this.resetPasswordForm.markAllAsTouched();
      return;
    }

    const {currentPassword, newPassword, confirmPassword } = this.resetPasswordForm.value;

    if (newPassword !== confirmPassword) {
      this.resetPasswordForm.get('confirmPassword')?.setErrors({ mismatch: true });
      return;
    }

    const loginID = this.authService.getLoginID();
    if (!loginID) {
      console.error('Failed to retrieve logged-in user.');
      return;
    }
    // Prepare the payload for the API call
    const payload: ResetPasswordModel = {
      loginId: loginID,
      currentPassword: this.encrypt.encryptionAES(currentPassword.trim()).toString(),
      newPassword: this.encrypt.encryptionAES(newPassword.trim()).toString(),
    };

    // Call the API
    this.apiMethodService.resetPassword(payload).subscribe({
      next: (response) => {
        this.toastr.success(response.message, 'Success', { timeOut: 3000 });
        this.resetPasswordForm.reset();
        this.displayResetPasswordDialog = false;
      },
      error: (error) => {
        this.toastr.error(error.message || 'An error occurred while updating the password.', 'Error', { timeOut: 3000 });
      },
    });
    this.displayResetPasswordDialog = false;
  }

  get f() {
    return this.resetPasswordForm.controls;
  }

  showLogoutDialog() {
    debugger;
    this.logoutDialogVisible = true;
  }

  closeLogoutDialog() {
    this.logoutDialogVisible = false;
  }

  // Reset form on close
  resetForm(): void {
    this.resetPasswordForm.reset({
      loginId: this.authService.getLoginID(),
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    this.displayResetPasswordDialog = false;
  }

  logout() {
    this.logoutDialogVisible = false;  
    this.spinner.show();
    setTimeout(() => {
      this.authService.logout();
      this.router.navigate(['/logout']);
      this.spinner.hide();
    }, 1000);
  }
  
  ngOnDestroy() {
    this.renderer.destroy();
  }
}
