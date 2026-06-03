import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User, UserRole, JwtPayload } from '../../models/user-role';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    this.initializeUser();
  }

  private initializeUser(): void {
    const user = this.getUserFromStorage();
    if (user) {
      this.currentUserSubject.next(user);
    }
  }

  private getUserFromStorage(): User | null {
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
      if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('jwtToken', token);
        this.currentUserSubject.next(user);
        return user;
      }
      return null;
    } catch (error) {
      console.error('Error logging in:', error);
      return null;
    }
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('jwtToken');
    this.currentUserSubject.next(null);
  }

  private decodeToken(token: string): User | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid token format');
      }

      const payload = JSON.parse(atob(parts[1])) as JwtPayload;

      if (!this.isTokenExpired(payload.exp)) {
        return {
          id: payload.sub,
          email: payload.email,
          name: payload.name,
          role: payload.role,
          token: token
        };
      }
      return null;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  private isTokenExpired(exp: number): boolean {
    return exp * 1000 < Date.now();
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getToken(): string | null {
    return localStorage.getItem('jwtToken');
  }

  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }
}
