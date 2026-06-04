import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { RoleService } from '../service/role.service';
import { UserRole } from '../../models/user-role';

export const adminGuard: CanActivateFn = (route, state) => {
  const roleService = inject(RoleService);
  const router = inject(Router);

  if (roleService.hasRole(UserRole.Admin)) {
    return true;
  }

  console.warn('Access denied: Admin role required');
  router.navigate(['/']);
  return false;
};
