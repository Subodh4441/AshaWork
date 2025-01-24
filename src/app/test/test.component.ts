import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, TableModule,ButtonModule,
    RouterModule
  ],
  templateUrl: './test.component.html',
  styleUrl: './test.component.css'
})
export class testComponent {

  users = [
    { username: 'Admin', loginId: 'admin', role: 'Admin', active: true },
    { username: 'ayush', loginId: '45869', role: 'Admin', active: true },
    { username: 'Gaurav', loginId: 'Gaurav1', role: 'Checker', active: true },
    { username: 'Pogba', loginId: 'Pogba', role: 'Maker', active: false },
    { username: 'Test8', loginId: '4556', role: 'Admin', active: true },
    { username: 'Admin', loginId: 'admin', role: 'Admin', active: true },
    { username: 'admin', loginId: '4444', role: 'Admin', active: true },
    { username: 'abc', loginId: '45869', role: 'Admin', active: true },
    { username: 'fdf', loginId: 'fdf', role: 'Admin', active: true },
    { username: 'abcd', loginId: 'abcd', role: 'Checker', active: true },
    { username: 'haresh', loginId: 'haresh', role: 'Client', active: true },
    { username: 'Pogba', loginId: 'Pogba', role: 'Maker', active: true },
    { username: 'Pogba7', loginId: 'Pogba5', role: 'Maker', active: false },
    { username: 'Ramesh', loginId: 'ramesh.kumat', role: 'Admin', active: true },
    { username: 'Test8', loginId: '4556', role: 'Admin', active: false },
  ];

  deleteUser(user: any) {
    console.log('Deleting user:', user);
    // Add logic for deleting user
  }

  changePassword(user: any) {
    console.log('Changing password for:', user);
    // Add logic for changing password
  }

  editUser(user: any) {
    console.log('Editing user:', user);
    // Add logic for editing user
  }
}
