import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { RoleService } from '../service/role.service';
import { UserRole } from '../../models/user-role';

export const customerGuard: CanActivateFn = (route, state) => {
  const roleService = inject(RoleService);
  const router = inject(Router);

  if (roleService.hasRole(UserRole.Customer)) {
    return true;
  }

  console.warn('Access denied: Customer role required');
  router.navigate(['/shop']);
  return false;
};
