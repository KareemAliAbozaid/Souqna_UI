import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-customer-profile',
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="container mt-5">
      <div class="row">
        <div class="col-md-8 offset-md-2">
          <h1>My Profile</h1>
          <div class="card mt-4">
            <div class="card-body">
              <h5 class="card-title">Profile Information</h5>
              <form>
                <div class="mb-3">
                  <label for="name" class="form-label">Full Name</label>
                  <input type="text" class="form-control" id="name" placeholder="Your Full Name">
                </div>
                <div class="mb-3">
                  <label for="email" class="form-label">Email</label>
                  <input type="email" class="form-control" id="email" placeholder="your@email.com">
                </div>
                <div class="mb-3">
                  <label for="phone" class="form-label">Phone Number</label>
                  <input type="tel" class="form-control" id="phone" placeholder="Your Phone Number">
                </div>
                <button type="submit" class="btn btn-primary">Save Changes</button>
              </form>
            </div>
          </div>
          <div class="card mt-4">
            <div class="card-body">
              <h5 class="card-title">Change Password</h5>
              <form>
                <div class="mb-3">
                  <label for="oldpwd" class="form-label">Current Password</label>
                  <input type="password" class="form-control" id="oldpwd" placeholder="Current Password">
                </div>
                <div class="mb-3">
                  <label for="newpwd" class="form-label">New Password</label>
                  <input type="password" class="form-control" id="newpwd" placeholder="New Password">
                </div>
                <div class="mb-3">
                  <label for="confirmpwd" class="form-label">Confirm Password</label>
                  <input type="password" class="form-control" id="confirmpwd" placeholder="Confirm Password">
                </div>
                <button type="submit" class="btn btn-primary">Change Password</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CustomerProfileComponent { }
