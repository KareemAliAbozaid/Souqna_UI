import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { User, UserRole } from '../../models/user-role';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly currentUserSubject = new BehaviorSubject<User | null>(null);
  public readonly currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    @Inject(PLATFORM_ID) private readonly platformId: Object
  ) {
    if (this.isBrowser()) {
      this.initializeUser();
    }
  }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  private initializeUser(): void {
    const user = this.getUserFromStorage();

    if (user) {
      this.currentUserSubject.next(user);
    }
  }

  private getUserFromStorage(): User | null {

    if (!this.isBrowser()) {
      return null;
    }

    try {
      const userJson = localStorage.getItem('currentUser');

      if (!userJson) {
        return null;
      }

      return JSON.parse(userJson) as User;
    } catch (error) {
      console.error('Error reading user from storage:', error);
      return null;
    }
  }

  login(token: string): User | null {
    try {

      const user = this.decodeToken(token);

      if (!user) {
        return null;
      }

      if (this.isBrowser()) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('jwtToken', token);
      }

      this.currentUserSubject.next(user);

      return user;

    } catch (error) {
      console.error('Error logging in:', error);
      return null;
    }
  }

  logout(): void {

    if (this.isBrowser()) {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('jwtToken');
    }

    this.currentUserSubject.next(null);
  }

  private decodeToken(token: string): User | null {

    try {

      const parts = token.split('.');

      if (parts.length !== 3) {
        throw new Error('Invalid token format');
      }

      const payload: any = JSON.parse(
        this.decodeBase64(parts[1])
      );

      if (this.isTokenExpired(payload.exp)) {
        return null;
      }

      const role =
        payload.role ??
        payload.Role ??
        payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

      const normalizedRole = this.normalizeRole(role);

      if (!normalizedRole) {
        throw new Error(`Invalid role: ${role}`);
      }

      return {
        id: payload.sub ?? payload.UserId,
        email: payload.email ?? payload.Email,
        name: payload.name ?? payload.email ?? payload.Email,
        role: normalizedRole,
        token
      };

    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  private normalizeRole(role: string): UserRole | null {

    if (!role) {
      return null;
    }

    switch (role.toLowerCase()) {

      case 'admin':
        return UserRole.Admin;

      case 'seller':
        return UserRole.Seller;

      case 'customer':
        return UserRole.Customer;

      default:
        return null;
    }
  }

  private decodeBase64(value: string): string {

    if (typeof globalThis.atob === 'function') {
      return globalThis.atob(value);
    }

    const bufferCtor = (globalThis as any).Buffer;

    if (bufferCtor !== undefined) {
      return bufferCtor
        .from(value, 'base64')
        .toString('binary');
    }

    throw new Error(
      'Base64 decoding is not available in this environment'
    );
  }

  private isTokenExpired(exp: number): boolean {
    return exp * 1000 < Date.now();
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getToken(): string | null {

    if (!this.isBrowser()) {
      return null;
    }

    return localStorage.getItem('jwtToken');
  }

  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  hasRole(role: string): boolean {

    const user = this.currentUserSubject.value;

    if (!user) {
      return false;
    }

    return user.role.toLowerCase() === role.toLowerCase();
  }

  isAdmin(): boolean {
    return this.hasRole('Admin');
  }

  isSeller(): boolean {
    return this.hasRole('Seller');
  }

  isCustomer(): boolean {
    return this.hasRole('Customer');
  }
}