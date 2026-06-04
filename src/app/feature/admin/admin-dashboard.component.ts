import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-admin-dashboard',
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container mt-5">
      <div class="row">
        <div class="col-md-12">
          <h1>Admin Dashboard</h1>
          <div class="alert alert-warning mt-4">
            <p>Welcome to the admin dashboard. Monitor and manage the platform.</p>
          </div>
          <div class="row mt-4">
            <div class="col-md-3">
              <div class="card">
                <div class="card-body">
                  <h5 class="card-title">Total Users</h5>
                  <p class="card-text display-4">0</p>
                </div>
              </div>
            </div>
            <div class="col-md-3">
              <div class="card">
                <div class="card-body">
                  <h5 class="card-title">Total Products</h5>
                  <p class="card-text display-4">0</p>
                </div>
              </div>
            </div>
            <div class="col-md-3">
              <div class="card">
                <div class="card-body">
                  <h5 class="card-title">Total Orders</h5>
                  <p class="card-text display-4">0</p>
                </div>
              </div>
            </div>
            <div class="col-md-3">
              <div class="card">
                <div class="card-body">
                  <h5 class="card-title">Platform Revenue</h5>
                  <p class="card-text display-4">$0</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      border: 1px solid #ddd;
      border-radius: 0.25rem;
      box-shadow: 0 0.125rem 0.25rem rgba(0,0,0,0.075);
    }
  `]
})
export class AdminDashboardComponent { }
