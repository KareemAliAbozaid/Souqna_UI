import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-cart',
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container mt-5">
      <div class="row">
        <div class="col-md-12">
          <h1>Shopping Cart</h1>
          <div class="row mt-4">
            <div class="col-md-8">
              <div class="card">
                <div class="card-body">
                  <table class="table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Total</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td colspan="5" class="text-center">Your cart is empty</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="card">
                <div class="card-header">
                  <h5>Order Summary</h5>
                </div>
                <div class="card-body">
                  <p>Subtotal: $0.00</p>
                  <p>Shipping: $0.00</p>
                  <p>Tax: $0.00</p>
                  <hr>
                  <p class="h5">Total: $0.00</p>
                  <a routerLink="/checkout" class="btn btn-primary w-100">Proceed to Checkout</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CartComponent { }
