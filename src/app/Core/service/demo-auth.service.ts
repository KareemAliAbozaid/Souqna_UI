import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { User, UserRole } from '../../models/user-role';

/**
 * Demo service for testing the role-based authentication system.
 * This service provides mock JWT tokens for different roles.
 * 
 * Usage in component:
 * constructor(private demoAuth: DemoAuthService) {}
 * 
 * ngOnInit() {
 *   this.demoAuth.loginAsCustomer();
 *   // or
 *   this.demoAuth.loginAsSeller();
 *   // or
 *   this.demoAuth.loginAsAdmin();
 * }
 */
@Injectable({
  providedIn: 'root'
})
export class DemoAuthService {

  constructor(private authService: AuthService) { }

  /**
   * Creates a mock JWT token for the given role.
   * In production, this would come from an API endpoint.
   */
  private createMockToken(role: UserRole): string {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({
      sub: 'user-' + Math.random(),
      email: `${role.toLowerCase()}@example.com`,
      name: `${role} User`,
      role: role,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 86400 // 24 hours
    }));
    const signature = btoa('mock-signature');
    return `${header}.${payload}.${signature}`;
  }

  loginAsCustomer(): User | null {
    const token = this.createMockToken(UserRole.Customer);
    return this.authService.login(token);
  }

  loginAsSeller(): User | null {
    const token = this.createMockToken(UserRole.Seller);
    return this.authService.login(token);
  }

  loginAsAdmin(): User | null {
    const token = this.createMockToken(UserRole.Admin);
    return this.authService.login(token);
  }

  logout(): void {
    this.authService.logout();
  }
}
