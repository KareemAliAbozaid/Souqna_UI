import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-seller-profile',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mt-5">
      <div class="row">
        <div class="col-md-8 offset-md-2">
          <h1>Seller Profile</h1>
          <div class="card mt-4">
            <div class="card-body">
              <h5 class="card-title">Profile Information</h5>
              <form>
                <div class="mb-3">
                  <label for="name" class="form-label">Store Name</label>
                  <input type="text" class="form-control" id="name" placeholder="Your Store Name">
                </div>
                <div class="mb-3">
                  <label for="email" class="form-label">Email</label>
                  <input type="email" class="form-control" id="email" placeholder="your@email.com">
                </div>
                <div class="mb-3">
                  <label for="phone" class="form-label">Phone</label>
                  <input type="tel" class="form-control" id="phone" placeholder="Your Phone Number">
                </div>
                <div class="mb-3">
                  <label for="description" class="form-label">Store Description</label>
                  <textarea class="form-control" id="description" rows="3" placeholder="Describe your store..."></textarea>
                </div>
                <button type="submit" class="btn btn-primary">Save Changes</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class SellerProfileComponent { }
