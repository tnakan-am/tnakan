import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatSidenav, MatSidenavContainer, MatSidenavContent } from '@angular/material/sidenav';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    FooterComponent,
    TranslateModule,
    NavbarComponent,
    SidebarComponent,
    MatButton,
    MatIcon,
    MatSidenav,
    MatSidenavContainer,
    MatSidenavContent,
    MatIconButton,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'tnakan';
  opened: boolean = true;

  menu = [
    {
      mainCategory: 'Alcohol',
      id: 123134654,
      subCategory: [],
    },
  ];

  constructor(private translateService: TranslateService) {
    if (localStorage.getItem('lang')) {
      translateService.setDefaultLang(localStorage.getItem('lang') as string);
    } else {
      translateService.setDefaultLang('hy');
    }
  }
}
