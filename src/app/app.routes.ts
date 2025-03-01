import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from '@angular/fire/auth-guard';
import { permissionsGuard } from './shared/services/permissions.guard';
import { AdComponent } from './business-profile/ad/ad.component';
import { BasketComponent } from './basket/basket.component';
import { ProductPageComponent } from './product/components/product-page/product-page.component';
import { SellerPageComponent } from './seller-page/seller-page.component';
import { Type } from './shared/interfaces/user.interface';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'confirm-email',
    loadComponent: () =>
      import('./confirm-email/confirm-email.component').then((m) => m.ConfirmEmailComponent),
  },
  {
    path: 'admin',
    loadComponent: () => import('./admin/admin.component').then((m) => m.AdminComponent),
    // canActivate: [AuthGuard, permissionsGuard(Type.ADMIN)],
    children: [
      {
        path: 'products',
        loadComponent: () =>
          import('./admin/products-approve/products-approve.component').then(
            (m) => m.ProductsApproveComponent
          ),
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./admin/admin-orders/admin-orders.component').then((m) => m.AdminOrdersComponent),
      },
      {
        path: 'ads',
        loadComponent: () =>
          import('./admin/ads-approve/ads-approve.component').then((m) => m.AdsApproveComponent),
      },
      {
        path: '**',
        redirectTo: 'products',
      },
    ],
  },
  {
    path: 'registration',
    loadComponent: () =>
      import('./registration/registration.component').then((m) => m.RegistrationComponent),
  },
  {
    path: 'registration/:token',
    loadComponent: () =>
      import('./registration/registration.component').then((m) => m.RegistrationComponent),
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
    path: 'seller/:id',
    component: SellerPageComponent,
  },
  {
    path: 'profile/customer',
    loadComponent: () => import('./profile/profile.component').then((m) => m.ProfileComponent),
    canActivate: [AuthGuard, permissionsGuard(Type.CUSTOMER)],
    children: [
      {
        path: '**',
        redirectTo: 'orders',
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./profile/customer-orders/customer-orders.component').then(
            (m) => m.CustomerOrdersComponent
          ),
      },
    ],
  },
  {
    path: 'profile/business',
    loadComponent: () =>
      import('./business-profile/business-profile.component').then(
        (m) => m.BusinessProfileComponent
      ),
    canActivate: [AuthGuard, permissionsGuard(Type.BUSINESS)],
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
