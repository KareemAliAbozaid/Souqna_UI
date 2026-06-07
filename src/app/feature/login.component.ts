import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../Core/service/auth.service';
import { AuthApiService } from '../Core/service/auth-api.service';

@Component({
    standalone: true,
    selector: 'app-login',
    imports: [CommonModule, FormsModule, RouterLink],
    template: `
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card shadow-sm">
            <div class="card-header">
              <h3 class="mb-0">Login</h3>
            </div>
            <div class="card-body">
              <p class="text-muted">Login with your registered email and password.</p>

              <form (ngSubmit)="submit()">
                <div class="mb-3">
                  <label class="form-label">Email</label>
                  <input type="email" class="form-control" [(ngModel)]="email" name="email" required />
                </div>
                <div class="mb-3">
                  <label class="form-label">Password</label>
                  <input type="password" class="form-control" [(ngModel)]="password" name="password" required />
                </div>

                <div *ngIf="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>
                <button class="btn btn-primary w-100" type="submit">Login</button>
              </form>

              <div class="mt-3 text-center">
                <small class="text-muted">Don't have an account yet?</small>
                <div><a routerLink="/register">Create an account</a></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
    email = '';
    password = '';
    errorMessage = '';

    constructor(
        @Inject(AuthApiService) private readonly authApiService: AuthApiService,
        private readonly authService: AuthService,
        private readonly router: Router
    ) { }

    submit(): void {
        this.errorMessage = '';

        if (!this.email.trim() || !this.password.trim()) {
            this.errorMessage = 'Please enter both email and password.';
            return;
        }

        this.authApiService.login(this.email.trim(), this.password).subscribe({
            next: (token) => {
                const user = this.authService.login(token);
                if (!user) {
                    this.errorMessage = 'Login succeeded but the token could not be processed.';
                    return;
                }
                this.router.navigate(['/shop']);
            },
            error: (error) => {
                this.errorMessage = error?.message ?? 'Login failed. Please verify your credentials.';
            }
        });
    }
}
