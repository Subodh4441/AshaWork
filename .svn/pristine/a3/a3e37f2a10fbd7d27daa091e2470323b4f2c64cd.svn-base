import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-tabset',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tabset.component.html',
  styleUrl: './tabset.component.css'
})
export class TabsetComponent implements OnInit {
  @Input() tabs: { id: string; label: string; content: string }[] = [];
  @Input() activeTabId: string = '';

  selectedTabId: string = '';

  ngOnInit(): void {
    // Set the default active tab
    this.selectedTabId = this.activeTabId || (this.tabs.length > 0 ? this.tabs[0].id : '');
  }

  selectTab(tabId: string): void {
    this.selectedTabId = tabId;
  }
  dynamicTabs = [
    { id: 'user', label: 'User', content: 'User tab content.' },
    { id: 'role', label: 'Role', content: 'Role tab content.' }
  ];

  defaultActiveTab = 'user';
}
