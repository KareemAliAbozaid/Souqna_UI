import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { UserRole } from '../../models/user-role';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(private authService: AuthService) { }

  getCurrentRole(): UserRole | null {
    const user = this.authService.getCurrentUser();
    return user ? user.role : null;
  }

  hasRole(role: UserRole | UserRole[]): boolean {
    const currentRole = this.getCurrentRole();
    if (!currentRole) {
      return false;
    }

    if (Array.isArray(role)) {
      return role.includes(currentRole);
    }

    return currentRole === role;
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
    const currentRole = this.getCurrentRole();
    if (!currentRole) {
      return false;
    }
    return roles.includes(currentRole);
  }
}
