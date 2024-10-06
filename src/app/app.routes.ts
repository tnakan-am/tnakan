import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from '@angular/fire/auth-guard';
import { permissionsGuard } from './services/permissions.guard';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'registration',
    component: RegistrationComponent,
  },
  {
    path: 'profile/customer',
    loadComponent: () => import('./profile/profile.component').then((m) => m.ProfileComponent),
    canActivate: [AuthGuard, permissionsGuard('customer')],
  },
  {
    path: 'profile/business',
    loadComponent: () =>
      import('./business-profile/business-profile.component').then(
        (m) => m.BusinessProfileComponent
      ),
    canActivate: [AuthGuard, permissionsGuard('business')],
  },
];
