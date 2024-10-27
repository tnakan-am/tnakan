import { Component } from '@angular/core';
import { MatAnchor } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatTab, MatTabContent, MatTabGroup } from '@angular/material/tabs';
import { FirebaseAuthService } from '../shared/services/firebase-auth.service';
import { IUser } from '../shared/interfaces/user.interface';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { CustomerFormComponent } from './customer-form/customer-form.component';
import { BusinessFormComponent } from './business-form/business-form.component';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [
    RouterLink,
    TranslateModule,
    MatTab,
    MatTabContent,
    MatTabGroup,
    MatAnchor,
    MatProgressSpinner,
    CustomerFormComponent,
    BusinessFormComponent,
  ],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss',
})
export class RegistrationComponent {
  loader: boolean = false;

  constructor(private fireAuthService: FirebaseAuthService) {}

  fireAuthentication(formValue: IUser) {
    const { email, password } = formValue;
    if (!email || !password || this.loader) {
      return;
    }
    this.loader = true;
    this.fireAuthService
      .signUp(formValue)
      .then(() => (this.loader = false))
      .catch(() => (this.loader = false))
      .finally(() => (this.loader = false));
  }
}
