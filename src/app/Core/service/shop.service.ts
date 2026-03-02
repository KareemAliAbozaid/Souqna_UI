import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pagination } from '../../models/pagination';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  private apiUrl = 'http://localhost:7186/api/';

  constructor(private http: HttpClient) { }

  getProducts() {
    return this.http.get<Pagination>(`${this.apiUrl}Products`);
  }
}