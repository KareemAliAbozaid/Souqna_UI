# Role-Based Navigation - Quick Reference Guide

## 🚀 Quick Start

### Test the System with Demo Service

```typescript
import { DemoAuthService } from './Core/service/demo-auth.service';

@Component({...})
export class AppComponent {
  constructor(private demoAuth: DemoAuthService) {
    // Login as different roles for testing
    this.demoAuth.loginAsCustomer();
    // this.demoAuth.loginAsSeller();
    // this.demoAuth.loginAsAdmin();
    // this.demoAuth.logout();
  }
}
```

## 📋 Available Routes

### Public Routes (No Authentication Required)
```
/shop                   # Main storefront
/categories             # Browse categories
/product/:id            # Product details
```

### Customer Routes (Must be logged in as Customer)
```
/cart                   # Shopping cart
/checkout               # Checkout page
/orders                 # View orders
/profile                # User profile
```

### Seller Routes (Must be logged in as Seller)
```
/seller/dashboard       # Seller dashboard
/seller/products        # Manage products
/seller/orders          # Manage orders
/seller/categories      # Manage categories
/seller/profile         # Seller profile
```

### Admin Routes (Must be logged in as Admin)
```
/admin/dashboard        # Admin dashboard
/admin/products         # Manage all products
/admin/categories       # Manage all categories
/admin/users            # User management
/admin/orders           # Order management
/admin/reports          # Analytics & reports
```

## 🔐 Using the Directive

### Show/Hide Based on Role

```html
<!-- Single Role -->
<button *appHasRole="'ADMIN'" class="btn btn-danger">
  Delete User
</button>

<!-- Multiple Roles (OR logic) -->
<a *appHasRole="['SELLER', 'ADMIN']" routerLink="/products">
  Manage Products
</a>

<!-- Customer Specific -->
<div *appHasRole="'CUSTOMER'">
  <a routerLink="/cart">
    <i class="material-icons">shopping_cart</i>
  </a>
</div>
```

## 🛡️ Using Services in Components

### Check Current User's Role

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
    // Get current user
    const user = this.authService.getCurrentUser();
    console.log(user?.name, user?.email, user?.role);

    // Check if user is admin
    if (this.roleService.isAdmin()) {
      // Do admin-only logic
    }

    // Check for specific role
    if (this.roleService.hasRole(UserRole.Seller)) {
      // Do seller logic
    }

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

## 🎯 Role Definitions

```typescript
export enum UserRole {
  Customer = 'CUSTOMER',  // Shoppers
  Seller = 'SELLER',      // Merchants
  Admin = 'ADMIN'         // Platform Administrators
}
```

## 📡 Integration with Backend API

Replace the mock login in `AuthService.login()`:

```typescript
// Before (mock token)
login(token: string): User | null {
  const user = this.decodeToken(token);
  // ...
}

// After (real API call)
login(credentials: { email: string; password: string }): Observable<User | null> {
  return this.http.post<{ token: string }>('/api/auth/login', credentials)
    .pipe(
      map(response => this.decodeAndStore(response.token)),
      catchError(error => {
        console.error('Login failed:', error);
        return of(null);
      })
    );
}
```

## 🔄 User Flow

```
User visits /shop (public)
    ↓
User clicks "Login"
    ↓
User enters credentials
    ↓
AuthService.login() called with JWT token
    ↓
Token decoded → User object created
    ↓
User stored in localStorage
    ↓
currentUser$ observable emits new user
    ↓
NavBar updates with role-specific items
    ↓
User can now access role-specific routes
```

## ⚙️ How It Works

### 1. Authentication Flow
```
JWT Token → Decoded → User Extracted → Stored Locally → Observable Updated
```

### 2. Authorization Flow
```
Route Access Attempted → Guard Checks Role → Allowed or Redirected
```

### 3. UI Update Flow
```
currentUser$ Emits → HasRoleDirective Updates → Template Re-renders
```

## 🔧 Common Tasks

### Display User Name in NavBar
```html
<span *ngIf="isLoggedIn">
  Welcome, {{ getCurrentUser()?.name }}!
</span>
```

### Logout User
```typescript
logout() {
  this.authService.logout();
  this.router.navigate(['/shop']);
}
```

### Check if Logged In
```typescript
if (this.authService.isLoggedIn()) {
  // User is logged in
}
```

### Get Current Role
```typescript
const role = this.roleService.getCurrentRole();
```

## 📝 Token Format (JWT)

The token is decoded as follows:

```
Header.Payload.Signature

Payload contains:
{
  "sub": "user-id",
  "email": "user@example.com",
  "name": "User Name",
  "role": "CUSTOMER|SELLER|ADMIN",
  "iat": 1234567890,    // Issued at
  "exp": 1234654290     // Expires at
}
```

## 💾 Local Storage

The system stores:
- `currentUser` - User object (JSON)
- `jwtToken` - JWT token string

Clear when logging out automatically.

## 🚨 Troubleshooting

### Routes not accessible after login?
- Check if role matches required role for route
- Verify JWT token is valid (not expired)
- Check browser console for error messages

### NavBar not updating?
- Ensure HasRoleDirective is imported in component
- Check that currentUser$ is emitting
- Verify role string matches UserRole enum

### Directive not hiding elements?
- Check syntax: `*appHasRole="'ROLE_NAME'"`
- Verify role matches current user's role
- Check browser console for errors

## 📚 Full Documentation

See `ROLE_BASED_NAVIGATION_README.md` for comprehensive guide including:
- Architecture overview
- Service API reference
- Component integration examples
- Backend API integration guide
- Security best practices
- Testing strategies

## 🎓 Learning Resources

- Angular Functional Guards: https://angular.io/guide/router#preventing-unauthorized-access
- RxJS Observables: https://rxjs.dev/guide/observable
- JWT: https://tools.ietf.org/html/rfc8949
- Security: https://owasp.org/www-project-top-ten/

---

**Need Help?** Check the main documentation or the code comments in the services and guards for detailed explanations.
