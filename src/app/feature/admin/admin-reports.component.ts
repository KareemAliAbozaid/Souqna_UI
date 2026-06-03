import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-admin-reports',
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container mt-5">
      <div class="row">
        <div class="col-md-12">
          <h1>Reports & Analytics</h1>
          <div class="alert alert-info mt-4">
            <p>View platform analytics and generate reports.</p>
          </div>
          <div class="row mt-4">
            <div class="col-md-6">
              <div class="card">
                <div class="card-header">
                  <h5>Sales Report</h5>
                </div>
                <div class="card-body">
                  <p>Total Sales: $0</p>
                  <p>Total Orders: 0</p>
                  <p>Average Order Value: $0</p>
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="card">
                <div class="card-header">
                  <h5>User Report</h5>
                </div>
                <div class="card-body">
                  <p>Total Users: 0</p>
                  <p>Customers: 0</p>
                  <p>Sellers: 0</p>
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
export class AdminReportsComponent { }
