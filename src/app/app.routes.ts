import { Routes } from '@angular/router';
import { ShopComponent } from './feature/shop.component';
import { ProductListComponent } from './feature/product/product-list.component';
import { ProductFormComponent } from './feature/product/product-form.component';
import { CategoryListComponent } from './feature/category/category-list.component';
import { CategoryFormComponent } from './feature/category/category-form.component';

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
    path: 'products',
    component: ProductListComponent
  },
  {
    path: 'products/new',
    component: ProductFormComponent
  },
  {
    path: 'products/:id/edit',
    component: ProductFormComponent
  },
  {
    path: 'categories',
    component: CategoryListComponent
  },
  {
    path: 'categories/new',
    component: CategoryFormComponent
  },
  {
    path: 'categories/:id/edit',
    component: CategoryFormComponent
  },
  {
    path: '**',
    redirectTo: 'shop'
  }
];


