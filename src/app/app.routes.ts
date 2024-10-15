import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from '@angular/fire/auth-guard';
import { permissionsGuard } from './services/permissions.guard';
import { ProductsComponent } from './business-profile/products/products.component';
import { AdComponent } from './business-profile/ad/ad.component';
import { OrdersComponent } from './business-profile/orders/orders.component';
import { BasketComponent } from './basket/basket.component';

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
    path: 'basket',
    component: BasketComponent,
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
    children: [
      {
        path: 'products',
        component: ProductsComponent,
      },
      {
        path: 'orders',
        component: OrdersComponent,
      },
      {
        path: 'ad',
        component: AdComponent,
      },
      {
        path: '**',
        redirectTo: 'products',
      },
    ],
  },
  {
    path: 'settings',
    loadComponent: () => import('./settings/settings.component').then((m) => m.SettingsComponent),
    canActivate: [AuthGuard],
  },
];
