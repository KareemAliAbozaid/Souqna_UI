import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { HasRoleDirective } from '../../../Core/directives/has-role.directive';
import { AuthService } from '../../../Core/service/auth.service';
import { RoleService } from '../../../Core/service/role.service';
import { UserRole } from '../../../models/user-role';

export interface NavLink {
  label: string;
  path: string;
  exact?: boolean;
  roles?: UserRole[];
}

@Component({
  standalone: true,
  selector: 'app-nav-bar',
  imports: [NgClass, NgFor, NgIf, RouterLink, RouterLinkActive, FormsModule, HasRoleDirective],
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  isCollapsed = true;
  dropdownVisible = false;
  headerSearch = '';
  isLoggedIn = false;
  userRole: UserRole | null = null;

  readonly navLinks: NavLink[] = [
    { label: 'Home', path: '/shop', exact: true },
    { label: 'Shop', path: '/shop' },
    { label: 'Categories', path: '/categories' }
  ];

  readonly customerLinks: NavLink[] = [
    { label: 'Cart', path: '/cart', roles: [UserRole.Customer] },
    { label: 'Orders', path: '/orders', roles: [UserRole.Customer] },
    { label: 'Profile', path: '/profile', roles: [UserRole.Customer] }
  ];

  readonly sellerLinks: NavLink[] = [
    { label: 'Seller Dashboard', path: '/seller/dashboard', roles: [UserRole.Seller] },
    { label: 'My Products', path: '/seller/products', roles: [UserRole.Seller] },
    { label: 'My Orders', path: '/seller/orders', roles: [UserRole.Seller] },
    { label: 'My Categories', path: '/seller/categories', roles: [UserRole.Seller] },
    { label: 'Seller Profile', path: '/seller/profile', roles: [UserRole.Seller] }
  ];

  readonly adminLinks: NavLink[] = [
    { label: 'Admin Dashboard', path: '/admin/dashboard', roles: [UserRole.Admin] },
    { label: 'Products', path: '/admin/products', roles: [UserRole.Admin] },
    { label: 'Categories', path: '/admin/categories', roles: [UserRole.Admin] },
    { label: 'Users', path: '/admin/users', roles: [UserRole.Admin] },
    { label: 'Orders', path: '/admin/orders', roles: [UserRole.Admin] },
    { label: 'Reports', path: '/admin/reports', roles: [UserRole.Admin] }
  ];

  readonly UserRole = UserRole;

  constructor(
    private router: Router,
    private authService: AuthService,
    private roleService: RoleService
  ) { }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.isLoggedIn = user !== null;
      this.userRole = user?.role || null;
    });
  }

  toggleDropdown(): void {
    this.dropdownVisible = !this.dropdownVisible;
  }

  closeNav(): void {
    this.isCollapsed = true;
    this.dropdownVisible = false;
  }

  onHeaderSearch(event: Event): void {
    event.preventDefault();
    const search = this.headerSearch.trim();

    this.router.navigate(['/shop'], {
      queryParams: search ? { search } : {}
    });

    this.closeNav();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/shop']);
    this.closeNav();
  }

  getCurrentUser(): any {
    return this.authService.getCurrentUser();
  }

  hasRole(role: UserRole | UserRole[]): boolean {
    return this.roleService.hasRole(role);
  }
}
