import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MatTab, MatTabContent, MatTabGroup } from '@angular/material/tabs';
import { AuthService } from '../shared/services/auth.service';
import { IUser, Type } from '../shared/interfaces/user.interface';
import { CustomerFormComponent } from './customer-form/customer-form.component';
import { BusinessFormComponent } from './business-form/business-form.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [
    TranslateModule,
    MatTab,
    MatTabContent,
    MatTabGroup,
    CustomerFormComponent,
    BusinessFormComponent,
  ],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss',
})
export class RegistrationComponent implements OnInit {
  loader: boolean = false;
  token: boolean = false;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.token = this.route.snapshot.params['token'];
    this.route.params.subscribe((params) => {
      if (params['token']) {
        this.token = params['token'];
      }
    });
  }

  fireAuthentication(formValue: IUser) {
    const { email, password } = formValue;
    if (!email || !password || this.loader) {
      return;
    }
    this.loader = true;
    this.authService
      .signUp({ ...formValue, type: this.token ? Type.ADMIN : formValue.type })
      .subscribe({
        next: () => (this.loader = false),
        error: () => (this.loader = false),
      });
  }
}
