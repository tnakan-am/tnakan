import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatMenu,
    MatIcon,
    MatMenuTrigger,
    MatIconButton,
    MatMenuItem,
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  constructor(private translateService: TranslateService) {
    translateService.setDefaultLang('hy');
  }

  changeLanguage(language: string) {
    // Change the language
    this.translateService.use(language);
    console.log('Language changed to:', language);
  }
}
