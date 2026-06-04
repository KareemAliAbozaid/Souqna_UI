import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-checkout',
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="container mt-5">
      <div class="row">
        <div class="col-md-12">
          <h1>Checkout</h1>
          <div class="row mt-4">
            <div class="col-md-8">
              <div class="card">
                <div class="card-header">
                  <h5>Shipping Information</h5>
                </div>
                <div class="card-body">
                  <form>
                    <div class="mb-3">
                      <label for="address" class="form-label">Address</label>
                      <input type="text" class="form-control" id="address" placeholder="Your Address">
                    </div>
                    <div class="mb-3">
                      <label for="city" class="form-label">City</label>
                      <input type="text" class="form-control" id="city" placeholder="City">
                    </div>
                    <div class="mb-3">
                      <label for="postal" class="form-label">Postal Code</label>
                      <input type="text" class="form-control" id="postal" placeholder="Postal Code">
                    </div>
                  </form>
                </div>
              </div>
              <div class="card mt-3">
                <div class="card-header">
                  <h5>Payment Information</h5>
                </div>
                <div class="card-body">
                  <form>
                    <div class="mb-3">
                      <label for="cardname" class="form-label">Name on Card</label>
                      <input type="text" class="form-control" id="cardname" placeholder="Name on Card">
                    </div>
                    <div class="mb-3">
                      <label for="cardnumber" class="form-label">Card Number</label>
                      <input type="text" class="form-control" id="cardnumber" placeholder="Card Number">
                    </div>
                    <div class="row">
                      <div class="col-md-6">
                        <div class="mb-3">
                          <label for="expiry" class="form-label">Expiry Date</label>
                          <input type="text" class="form-control" id="expiry" placeholder="MM/YY">
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="mb-3">
                          <label for="cvv" class="form-label">CVV</label>
                          <input type="text" class="form-control" id="cvv" placeholder="CVV">
                        </div>
                      </div>
                    </div>
                  </form>
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
                  <button class="btn btn-success w-100">Place Order</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CheckoutComponent { }
