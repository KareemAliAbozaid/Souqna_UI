import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Pagination } from '../../models/pagination';
import { IProduct } from '../../models/product';
import { ShopParams } from '../../models/shop-params';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  private readonly baseUrl = environment.baseURL;

  constructor(private http: HttpClient) { }

  getProducts(params: ShopParams): Observable<Pagination<IProduct>> {
    let httpParams = new HttpParams()
      .set('pageNumber', params.pageNumber)
      .set('pageSize', params.pageSize);

    if (params.categoryId > 0) {
      httpParams = httpParams.set('categoryId', params.categoryId);
    }

    if (params.search?.trim()) {
      httpParams = httpParams.set('search', params.search.trim());
    }

    return this.http
      .get<Pagination<IProduct>>(`${this.baseUrl}/Products`, { params: httpParams })
      .pipe(catchError((error) => this.handleError(error, 'getProducts')));
  }

  private handleError(error: HttpErrorResponse, operation: string) {
    console.error(`ShopService ${operation} failed`, error);

    if (error.status === 0) {
      return throwError(
        () => new Error(
          'Cannot reach the API. Ensure the backend is running on https://localhost:7186 and restart the app with ng serve.'
        )
      );
    }

    const message = typeof error.error === 'string'
      ? error.error
      : error.error?.message ?? error.message;

    return throwError(() => new Error(message || 'Failed to load products.'));
  }
}
