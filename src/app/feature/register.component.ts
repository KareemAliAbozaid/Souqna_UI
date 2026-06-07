import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthApiService } from '../Core/service/auth-api.service';
import { UserRole } from '../models/user-role';

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card shadow-sm">
            <div class="card-header">
              <h3 class="mb-0">Register</h3>
            </div>
            <div class="card-body">
              <form (ngSubmit)="submit()">
                <div class="mb-3">
                  <label class="form-label">Name</label>
                  <input type="text" class="form-control" [(ngModel)]="name" name="name" required />
                </div>
                <div class="mb-3">
                  <label class="form-label">Email</label>
                  <input type="email" class="form-control" [(ngModel)]="email" name="email" required />
                </div>
                <div class="mb-3">
                  <label class="form-label">Password</label>
                  <input type="password" class="form-control" [(ngModel)]="password" name="password" required />
                </div>
                <div *ngIf="message" class="alert alert-info">{{ message }}</div>
                <button class="btn btn-primary w-100" type="submit">Register</button>
              </form>
              <div class="mt-3 text-center">
                <small class="text-muted">Already have an account?</small>
                <div><a routerLink="/login">Login</a></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  message = '';

  constructor(
    @Inject(AuthApiService) private readonly authApiService: AuthApiService,
    private readonly router: Router
  ) {}

  submit(): void {
    this.message = '';

    if (!this.name.trim() || !this.email.trim() || !this.password.trim()) {
      this.message = 'Please fill in all fields to complete registration.';
      return;
    }

    this.authApiService.register(this.name.trim(), this.email.trim(), this.password, UserRole.Customer)
      .subscribe({
        next: () => {
          this.router.navigate(['/login']);
        },
        error: (error) => {
          this.message = error?.message ?? 'Registration failed. Please try again.';
        }
      });
  }
}
