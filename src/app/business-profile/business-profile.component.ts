import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatTabLink, MatTabNav, MatTabNavPanel } from '@angular/material/tabs';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-business-profile',
  standalone: true,
  imports: [
    RouterOutlet,
    MatTabLink,
    MatTabNavPanel,
    MatTabNav,
    RouterLinkActive,
    RouterLink,
    TranslateModule,
  ],
  templateUrl: './business-profile.component.html',
  styleUrl: './business-profile.component.scss',
})
export class BusinessProfileComponent implements OnInit {
  activeLink!: string;
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
  constructor() {}

  ngOnInit() {}
}
