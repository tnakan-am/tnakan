import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  readonly languages = [
    { code: 'en', label: 'English' },
    { code: 'rus', label: 'Русский' },
    { code: 'hy', label: 'Հայերեն' },
  ];
  readonly currentLang = signal(localStorage.getItem('lang') ?? 'hy');

  private translate = inject(TranslateService);

  setLanguage(code: string): void {
    this.translate.setDefaultLang(code);
    localStorage.setItem('lang', code);
    this.currentLang.set(code);
  }
}
