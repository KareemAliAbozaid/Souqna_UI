import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ICategory } from '../../models/category';
import { CategoryFormModel } from '../../models/category-form';
import { ApiResponse } from '../../models/api-response';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private readonly baseUrl = environment.baseURL;
  private readonly resourceUrl = `${this.baseUrl}/Categories`;

  constructor(private http: HttpClient) { }

  getAllCategories(): Observable<ICategory[]> {
    return this.http
      .get<ApiResponse<ICategory[]>>(this.resourceUrl)
      .pipe(
        map((response) => response.data ?? []),
        catchError((error) => this.handleError(error, 'getAllCategories'))
      );
  }

  getCategoryById(id: number): Observable<ICategory> {
    return this.http
      .get<ApiResponse<ICategory>>(`${this.resourceUrl}/${id}`)
      .pipe(
        map((response) => {
          if (!response.data) {
            throw new Error(response.message || 'Category not found.');
          }
          return response.data;
        }),
        catchError((error) => this.handleError(error, 'getCategoryById'))
      );
  }

  addCategory(model: CategoryFormModel): Observable<void> {
    return this.http
      .post<ApiResponse>(this.resourceUrl, {
        id: 0,
        name: model.name,
        description: model.description
      })
      .pipe(
        map(() => void 0),
        catchError((error) => this.handleError(error, 'addCategory'))
      );
  }

  updateCategory(id: number, model: CategoryFormModel): Observable<void> {
    return this.http
      .put<ApiResponse>(`${this.resourceUrl}/${id}`, {
        id,
        name: model.name,
        description: model.description
      })
      .pipe(
        map(() => void 0),
        catchError((error) => this.handleError(error, 'updateCategory'))
      );
  }

  deleteCategory(id: number): Observable<void> {
    return this.http
      .delete<ApiResponse>(`${this.resourceUrl}/${id}`)
      .pipe(
        map(() => void 0),
        catchError((error) => this.handleError(error, 'deleteCategory'))
      );
  }

  private handleError(error: HttpErrorResponse, operation: string) {
    console.error(`CategoryService ${operation} failed`, error);

    if (error.status === 0) {
      return throwError(
        () => new Error('Cannot reach the API. Ensure the backend is running and CORS/proxy is configured.')
      );
    }

    const message = typeof error.error === 'string'
      ? error.error
      : error.error?.message ?? error.message;

    return throwError(() => new Error(message || 'An unexpected error occurred while communicating with the server.'));
  }
}
