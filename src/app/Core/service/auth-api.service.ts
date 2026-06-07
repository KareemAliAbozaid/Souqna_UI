import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UserRole } from '../../models/user-role';

interface AuthLoginResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthApiService {
  private readonly authUrl = `${environment.baseURL}/Auth`;

  constructor(private readonly http: HttpClient) { }

  login(email: string, password: string): Observable<string> {
    return this.http.post<AuthLoginResponse>(`${this.authUrl}/login`, {
      email,
      password
    }).pipe(
      map((response) => response.token),
      catchError(this.handleError('login'))
    );
  }

  register(name: string, email: string, password: string, role: UserRole = UserRole.Customer): Observable<void> {
    return this.http.post<void>(`${this.authUrl}/register`, {
      name,
      email,
      password,
      role
    }).pipe(
      catchError(this.handleError('register'))
    );
  }

  private handleError(operation: string) {
    return (error: HttpErrorResponse) => {
      console.error(`AuthApiService.${operation} failed`, error);

      if (error.status === 0) {
        return throwError(
          () => new Error('Cannot reach the API. Ensure the backend is running and CORS/proxy is configured.')
        );
      }

      const message = typeof error.error === 'string'
        ? error.error
        : error.error?.message ?? error.message;

      return throwError(() => new Error(message || `Authentication request failed during ${operation}.`));
    };
  }
}
