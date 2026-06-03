import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-seller-orders',
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container mt-5">
      <div class="row">
        <div class="col-md-12">
          <h1>My Orders</h1>
          <div class="alert alert-info mt-4">
            <p>Track and manage orders from your customers.</p>
          </div>
          <div class="table-responsive">
            <table class="table table-striped">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colspan="6" class="text-center">No orders found</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `
})
export class SellerOrdersComponent { }
