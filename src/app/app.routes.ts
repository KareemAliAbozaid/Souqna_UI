import { Routes } from '@angular/router';
import { ShopComponent } from './feature/shop.component';
import { ProductListComponent } from './feature/product/product-list.component';
import { ProductFormComponent } from './feature/product/product-form.component';
import { CategoryListComponent } from './feature/category/category-list.component';
import { CategoryFormComponent } from './feature/category/category-form.component';
import { customerGuard } from './Core/guards/customer.guard';
import { sellerGuard } from './Core/guards/seller.guard';
import { adminGuard } from './Core/guards/admin.guard';
import { authGuard } from './Core/guards/auth.guard';


// Seller Components
import { SellerDashboardComponent } from './feature/seller/seller-dashboard.component';
import { SellerProductsComponent } from './feature/seller/seller-products.component';
import { SellerOrdersComponent } from './feature/seller/seller-orders.component';
import { SellerCategoriesComponent } from './feature/seller/seller-categories.component';
import { SellerProfileComponent } from './feature/seller/seller-profile.component';

// Admin Components
import { AdminDashboardComponent } from './feature/admin/admin-dashboard.component';
import { AdminProductsComponent } from './feature/admin/admin-products.component';
import { AdminCategoriesComponent } from './feature/admin/admin-categories.component';
import { AdminUsersComponent } from './feature/admin/admin-users.component';
import { AdminOrdersComponent } from './feature/admin/admin-orders.component';
import { AdminReportsComponent } from './feature/admin/admin-reports.component';

// Customer Components
import { CartComponent } from './feature/customer/cart.component';
import { CheckoutComponent } from './feature/customer/checkout.component';
import { CustomerOrdersComponent } from './feature/customer/customer-orders.component';
import { CustomerProfileComponent } from './feature/customer/customer-profile.component';
import { LoginComponent } from './feature/login.component';
import { RegisterComponent } from './feature/register.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'shop'
  },
  {
    path: 'shop',
    component: ShopComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'product/:id',
    component: ProductListComponent
  },
  {
    path: 'categories',
    component: CategoryListComponent
  },

  // Customer Routes
  {
    path: 'cart',
    component: CartComponent,
    canActivate: [authGuard, customerGuard]
  },
  {
    path: 'checkout',
    component: CheckoutComponent,
    canActivate: [authGuard, customerGuard]
  },
  {
    path: 'orders',
    component: CustomerOrdersComponent,
    canActivate: [authGuard, customerGuard]
  },
  {
    path: 'profile',
    component: CustomerProfileComponent,
    canActivate: [authGuard, customerGuard]
  },

  // Seller Routes
  {
    path: 'seller',
    canActivate: [authGuard, sellerGuard],
    children: [
      {
        path: 'dashboard',
        component: SellerDashboardComponent
      },
      {
        path: 'products',
        component: SellerProductsComponent
      },
      {
        path: 'orders',
        component: SellerOrdersComponent
      },
      {
        path: 'categories',
        component: SellerCategoriesComponent
      },
      {
        path: 'profile',
        component: SellerProfileComponent
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },

  // Admin Routes
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    children: [
      {
        path: 'dashboard',
        component: AdminDashboardComponent
      },
      {
        path: 'products',
        component: AdminProductsComponent
      },
      {
        path: 'categories',
        component: AdminCategoriesComponent
      },
      {
        path: 'users',
        component: AdminUsersComponent
      },
      {
        path: 'orders',
        component: AdminOrdersComponent
      },
      {
        path: 'reports',
        component: AdminReportsComponent
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },

  // Admin/Seller CRUD Routes (Products and Categories)
  {
    path: 'products',
    component: ProductListComponent,
    canActivate: [authGuard]
  },
  {
    path: 'products/new',
    component: ProductFormComponent,
    canActivate: [authGuard]
  },
  {
    path: 'products/:id/edit',
    component: ProductFormComponent,
    canActivate: [authGuard]
  },
  {
    path: 'categories/list',
    component: CategoryListComponent,
    canActivate: [authGuard]
  },
  {
    path: 'categories/new',
    component: CategoryFormComponent,
    canActivate: [authGuard]
  },
  {
    path: 'categories/:id/edit',
    component: CategoryFormComponent,
    canActivate: [authGuard]
  },

  {
    path: '**',
    redirectTo: 'shop'
  }
];


