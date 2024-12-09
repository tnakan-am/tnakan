import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from '@angular/fire/auth-guard';
import { permissionsGuard } from './shared/services/permissions.guard';
import { AdComponent } from './business-profile/ad/ad.component';
import { BasketComponent } from './basket/basket.component';
import { ProductPageComponent } from './product/components/product-page/product-page.component';
import { CustomerOrdersComponent } from './profile/customer-orders/customer-orders.component';

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
    path: 'confirm-email',
    loadComponent: () =>
      import('./confirm-email/confirm-email.component').then((m) => m.ConfirmEmailComponent),
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
    path: 'product/:id',
    component: ProductPageComponent,
  },
  {
    path: 'profile/customer',
    loadComponent: () => import('./profile/profile.component').then((m) => m.ProfileComponent),
    canActivate: [AuthGuard, permissionsGuard('customer')],
    children: [
      {
        path: '**',
        redirectTo: 'orders',
      },
      {
        path: 'orders',
        component: CustomerOrdersComponent,
      },
    ],
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
        loadComponent: () =>
          import('./business-profile/products/products.component').then((m) => m.ProductsComponent),
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./business-profile/orders/orders.component').then((m) => m.OrdersComponent),
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
