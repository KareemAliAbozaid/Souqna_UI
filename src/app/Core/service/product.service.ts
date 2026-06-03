import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../../models/api-response';
import { Pagination } from '../../models/pagination';
import { IProduct } from '../../models/product';
import { ProductFormModel } from '../../models/product-form';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly baseUrl = environment.baseURL;
  private readonly resourceUrl = `${this.baseUrl}/Products`;

  constructor(private http: HttpClient) { }

  getAllProducts(pageNumber = 1, pageSize = 50): Observable<IProduct[]> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber)
      .set('pageSize', pageSize);

    return this.http
      .get<Pagination<IProduct>>(this.resourceUrl, { params })
      .pipe(
        map((response) => response.data ?? []),
        catchError((error) => this.handleError(error, 'getAllProducts'))
      );
  }

  getProductById(id: number): Observable<IProduct> {
    return this.http
      .get<ApiResponse<IProduct>>(`${this.resourceUrl}/${id}`)
      .pipe(
        map((response) => {
          if (!response.data) {
            throw new Error(response.message || 'Product not found.');
          }
          return response.data;
        }),
        catchError((error) => this.handleError(error, 'getProductById'))
      );
  }

  addProduct(model: ProductFormModel): Observable<void> {
    return this.http
      .post<ApiResponse>(this.resourceUrl, this.toFormData(model))
      .pipe(
        map(() => void 0),
        catchError((error) => this.handleError(error, 'addProduct'))
      );
  }

  updateProduct(id: number, model: ProductFormModel): Observable<void> {
    return this.http
      .put<ApiResponse>(this.resourceUrl, this.toFormData(model, id))
      .pipe(
        map(() => void 0),
        catchError((error) => this.handleError(error, 'updateProduct'))
      );
  }

  deleteProduct(id: number): Observable<void> {
    return this.http
      .delete<ApiResponse>(`${this.resourceUrl}/${id}`)
      .pipe(
        map(() => void 0),
        catchError((error) => this.handleError(error, 'deleteProduct'))
      );
  }

  private toFormData(model: ProductFormModel, id?: number): FormData {
    const formData = new FormData();

    if (id !== undefined) {
      formData.append('Id', String(id));
    }

    formData.append('Name', model.name);
    formData.append('Description', model.description ?? '');
    formData.append('NewPrice', String(model.newPrice));
    formData.append('OldPrice', String(model.oldPrice));
    formData.append('CategoryId', String(model.categoryId));

    for (const file of model.photos ?? []) {
      formData.append('Photos', file, file.name);
    }

    return formData;
  }

  private handleError(error: HttpErrorResponse, operation: string) {
    console.error(`ProductService ${operation} failed`, error);

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
