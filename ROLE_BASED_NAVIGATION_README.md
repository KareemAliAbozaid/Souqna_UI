# Role-Based Navigation System for Angular E-Commerce Application

This document describes the complete role-based navigation system implemented for the Souqna e-commerce application.

## Overview

The application now supports three distinct user roles with separate navigation paths and restricted access:

1. **Customer** - Shoppers who browse products, manage cart, place orders
2. **Seller** - Merchants who manage their products, categories, and orders
3. **Admin** - Platform administrators who manage all users, products, categories, and view analytics

## Architecture Components

### 1. Core Models (`src/app/models/user-role.ts`)

- **UserRole Enum** - Defines the three roles: Customer, Seller, Admin
- **User Interface** - Contains user data: id, email, name, role, token
- **JwtPayload Interface** - Represents decoded JWT token structure

### 2. Authentication Service (`src/app/Core/service/auth.service.ts`)

Handles JWT token management and user authentication:

```typescript
// Login with JWT token
authService.login(token: string): User | null

// Get current user
authService.getCurrentUser(): User | null

// Check if user is logged in
authService.isLoggedIn(): boolean

// Get stored JWT token
authService.getToken(): string | null

// Logout user
authService.logout(): void

// Observable stream of current user
authService.currentUser$: Observable<User | null>
```

### 3. Role Service (`src/app/Core/service/role.service.ts`)

Provides role-based authorization checks:

```typescript
// Check if current user has a specific role or roles
roleService.hasRole(role: UserRole | UserRole[]): boolean

// Check if user is Customer
roleService.isCustomer(): boolean

// Check if user is Seller
roleService.isSeller(): boolean

// Check if user is Admin
roleService.isAdmin(): boolean

// Get current user's role
roleService.getCurrentRole(): UserRole | null
```

### 4. Route Guards

#### CustomerGuard (`src/app/Core/guards/customer.guard.ts`)
Restricts routes to customers only:
```typescript
{ path: 'cart', component: CartComponent, canActivate: [customerGuard] }
```

#### SellerGuard (`src/app/Core/guards/seller.guard.ts`)
Restricts routes to sellers only:
```typescript
{ path: 'seller', canActivate: [sellerGuard], children: [...] }
```

#### AdminGuard (`src/app/Core/guards/admin.guard.ts`)
Restricts routes to admins only:
```typescript
{ path: 'admin', canActivate: [adminGuard], children: [...] }
```

#### AuthGuard (`src/app/Core/guards/auth.guard.ts`)
Ensures user is logged in:
```typescript
{ path: 'profile', canActivate: [authGuard] }
```

### 5. HasRole Directive (`src/app/Core/directives/has-role.directive.ts`)

Structural directive to show/hide elements based on user role:

```html
<!-- Show element only for customers -->
<div *appHasRole="'CUSTOMER'">
  Customer-only content
</div>

<!-- Show element for multiple roles -->
<div *appHasRole="['SELLER', 'ADMIN']">
  Seller and Admin content
</div>
```

### 6. JWT Interceptor (`src/app/Core/interceptors/jwt.interceptor.ts`)

Automatically adds JWT token to all HTTP requests:
```
Authorization: Bearer {token}
```

## Routing Structure

### Public Routes
```
/shop              - Shop/Home page (public)
/categories        - Category listing (public)
/product/:id       - Product details (public)
```

### Customer Routes (protected by customerGuard + authGuard)
```
/cart              - Shopping cart
/checkout          - Checkout process
/orders            - Order history
/profile           - Customer profile
```

### Seller Routes (protected by sellerGuard + authGuard)
```
/seller/dashboard  - Seller dashboard
/seller/products   - Manage seller products
/seller/orders     - Manage seller orders
/seller/categories - Manage seller categories
/seller/profile    - Seller profile
```

### Admin Routes (protected by adminGuard + authGuard)
```
/admin/dashboard   - Admin dashboard
/admin/products    - Manage all products
/admin/categories  - Manage all categories
/admin/users       - User management
/admin/orders      - Order management
/admin/reports     - Analytics and reports
```

### CRUD Routes (protected by authGuard)
```
/products          - Product list (admin/seller)
/products/new      - Add new product
/products/:id/edit - Edit product
/categories/list   - Categories list
/categories/new    - Add new category
/categories/:id/edit - Edit category
```

## Navigation Components

### Updated NavBar Component
The navbar component now:
- Shows/hides navigation items based on user role
- Displays role-specific menus (Seller Menu, Admin Menu)
- Shows user information in dropdown
- Provides logout functionality
- Displays customer-specific cart icon

Navigation visibility:
- **All Users**: Home, Shop, Categories, Search
- **Customers**: Cart, Orders
- **Sellers**: Seller Dashboard, My Products, My Orders, My Categories
- **Admins**: Admin Dashboard, Products, Categories, Users, Orders, Reports

## Using the Demo Auth Service

For testing purposes, use the `DemoAuthService`:

```typescript
import { DemoAuthService } from './Core/service/demo-auth.service';

export class TestComponent {
  constructor(private demoAuth: DemoAuthService) {}

  loginAsCustomer() {
    this.demoAuth.loginAsCustomer();
    // User is now logged in as Customer
  }

  loginAsSeller() {
    this.demoAuth.loginAsSeller();
    // User is now logged in as Seller
  }

  loginAsAdmin() {
    this.demoAuth.loginAsAdmin();
    // User is now logged in as Admin
  }

  logout() {
    this.demoAuth.logout();
  }
}
```

## Using the Role Directive

```html
<!-- Single role check -->
<button *appHasRole="'ADMIN'" class="btn btn-danger">
  Delete User
</button>

<!-- Multiple roles check (shows if user has ANY of the roles) -->
<a *appHasRole="['SELLER', 'ADMIN']" routerLink="/products">
  Manage Products
</a>

<!-- Nested with *ngIf for complex logic -->
<div *ngIf="isLoggedIn">
  <div *appHasRole="'CUSTOMER'">
    <p>Welcome, Customer!</p>
  </div>
</div>
```

## Using Guards in Routes

```typescript
import { customerGuard } from './Core/guards/customer.guard';
import { sellerGuard } from './Core/guards/seller.guard';
import { adminGuard } from './Core/guards/admin.guard';
import { authGuard } from './Core/guards/auth.guard';

const routes: Routes = [
  {
    path: 'cart',
    component: CartComponent,
    canActivate: [authGuard, customerGuard]
  },
  {
    path: 'seller',
    canActivate: [authGuard, sellerGuard],
    children: [...]
  },
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    children: [...]
  }
];
```

## Using the Role Service in Components

```typescript
import { RoleService } from './Core/service/role.service';
import { AuthService } from './Core/service/auth.service';

@Component({...})
export class MyComponent implements OnInit {
  constructor(
    private roleService: RoleService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Check current user's role
    const currentRole = this.roleService.getCurrentRole();

    // Check if user has specific role
    if (this.roleService.isAdmin()) {
      // Admin-only logic
    }

    // Get current user data
    const user = this.authService.getCurrentUser();
    console.log(user?.name, user?.email, user?.role);

    // Subscribe to user changes
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        console.log('User logged in:', user);
      } else {
        console.log('User logged out');
      }
    });
  }
}
```

## Integration with Backend API

To integrate with your backend API:

1. Replace the mock token generation in `AuthService.login()` with an API call:

```typescript
login(credentials: { email: string, password: string }): Observable<User | null> {
  return this.http.post<{ token: string }>('/api/auth/login', credentials)
    .pipe(
      map(response => this.decodeAndStore(response.token))
    );
}
```

2. Update the `DemoAuthService` calls in your login form component:

```typescript
onLogin(credentials: { email: string; password: string }) {
  this.authService.login(credentials).subscribe(user => {
    if (user) {
      this.router.navigate(['/']);
    }
  });
}
```

## Storage and Security

The authentication system uses `localStorage` to persist:
- `currentUser` - User data object
- `jwtToken` - JWT token string

For production:
1. Consider using `sessionStorage` instead of `localStorage`
2. Implement token refresh mechanism
3. Add CSRF protection
4. Use HttpOnly cookies for token storage (if possible)
5. Implement proper session expiration
6. Add HTTPS enforcement

## Testing the Implementation

1. **Login as Customer**:
   - Navigate to `/cart` - Should work
   - Navigate to `/seller/dashboard` - Should redirect to home
   - Navigate to `/admin/dashboard` - Should redirect to home

2. **Login as Seller**:
   - Navigate to `/seller/dashboard` - Should work
   - Navigate to `/cart` - Should redirect to home
   - Navigate to `/admin/dashboard` - Should redirect to home

3. **Login as Admin**:
   - Navigate to `/admin/dashboard` - Should work
   - All routes should be accessible except customer routes (for non-customers)

4. **Check NavBar**:
   - NavBar items should change based on logged-in user's role
   - Dropdowns should show role-specific items

## File Structure

```
src/app/
├── Core/
│   ├── service/
│   │   ├── auth.service.ts
│   │   ├── role.service.ts
│   │   ├── demo-auth.service.ts
│   │   └── ...
│   ├── guards/
│   │   ├── auth.guard.ts
│   │   ├── customer.guard.ts
│   │   ├── seller.guard.ts
│   │   └── admin.guard.ts
│   ├── directives/
│   │   └── has-role.directive.ts
│   ├── interceptors/
│   │   └── jwt.interceptor.ts
│   └── models/
├── feature/
│   ├── customer/
│   │   ├── cart.component.ts
│   │   ├── checkout.component.ts
│   │   ├── customer-orders.component.ts
│   │   └── customer-profile.component.ts
│   ├── seller/
│   │   ├── seller-dashboard.component.ts
│   │   ├── seller-products.component.ts
│   │   ├── seller-orders.component.ts
│   │   ├── seller-categories.component.ts
│   │   └── seller-profile.component.ts
│   ├── admin/
│   │   ├── admin-dashboard.component.ts
│   │   ├── admin-products.component.ts
│   │   ├── admin-categories.component.ts
│   │   ├── admin-users.component.ts
│   │   ├── admin-orders.component.ts
│   │   └── admin-reports.component.ts
│   └── ...
├── shared/
│   └── componants/
│       └── nav-bar/
│           ├── nav-bar.component.ts
│           └── nav-bar.component.html
├── models/
│   └── user-role.ts
├── app.routes.ts
└── app.config.ts
```

## Next Steps

1. Implement backend API endpoints for authentication
2. Create login/register pages
3. Add password reset functionality
4. Implement refresh token mechanism
5. Add user management features
6. Connect role-based dashboard components to actual data
7. Add error handling and toast notifications
8. Implement proper logging and monitoring

## References

- Angular 20 Documentation: https://angular.io/docs
- JWT Best Practices: https://tools.ietf.org/html/rfc8949
- OWASP Security Guidelines: https://owasp.org/www-project-top-ten/
