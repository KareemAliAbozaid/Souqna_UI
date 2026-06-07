import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { UserRole } from '../../models/user-role';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(private readonly authService: AuthService) { }

  getCurrentRole(): UserRole | null {
    const user = this.authService.getCurrentUser();
    return user ? user.role : null;
  }

  private normalizeRole(role: UserRole | string | null): string | null {
    if (!role) {
      return null;
    }
    return role.toString().trim().toUpperCase();
  }

  hasRole(role: UserRole | UserRole[]): boolean {
    const currentRole = this.normalizeRole(this.getCurrentRole());
    if (!currentRole) {
      return false;
    }

    if (Array.isArray(role)) {
      return role.some((required) => this.normalizeRole(required) === currentRole);
    }

    return this.normalizeRole(role) === currentRole;
  }

  isCustomer(): boolean {
    return this.hasRole(UserRole.Customer);
  }

  isSeller(): boolean {
    return this.hasRole(UserRole.Seller);
  }

  isAdmin(): boolean {
    return this.hasRole(UserRole.Admin);
  }

  hasAnyRole(roles: UserRole[]): boolean {
    return this.hasRole(roles);
  }

  hasAllRoles(roles: UserRole[]): boolean {
    const currentRole = this.normalizeRole(this.getCurrentRole());
    if (!currentRole) {
      return false;
    }
    return roles.every((required) => this.normalizeRole(required) === currentRole);
  }
}
