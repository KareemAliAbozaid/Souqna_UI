import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-admin-products',
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container mt-5">
      <div class="row">
        <div class="col-md-12">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h1>All Products</h1>
            <a routerLink="/products/new" class="btn btn-primary">Add Product</a>
          </div>
          <div class="alert alert-info">
            <p>Manage all products on the platform.</p>
          </div>
          <div class="table-responsive">
            <table class="table table-striped">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Seller</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colspan="7" class="text-center">No products found</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdminProductsComponent { }
