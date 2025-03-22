import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatTabLink, MatTabNav, MatTabNavPanel } from '@angular/material/tabs';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-admin',
  imports: [
    RouterOutlet,
    MatTabLink,
    MatTabNav,
    MatTabNavPanel,
    RouterLinkActive,
    TranslateModule,
    RouterLink,
  ],
  standalone: true,
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class AdminComponent {
  links = [
    {
      path: 'products',
    },
    {
      path: 'orders',
    },
    {
      path: 'ad',
    },
  ];
  activeLink?: string;

  constructor() {}
}
