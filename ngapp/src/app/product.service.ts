import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { CategoryCount, Product, ProductPage } from './models/product';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);

  getProducts(limit: number, skip: number, q = '', category = ''): Observable<ProductPage> {
    let params = new HttpParams().set('limit', limit).set('skip', skip);
    if (q) params = params.set('q', q);
    if (category) params = params.set('category', category);
    return this.http.get<ProductPage>(`${environment.apiUrl}/products`, { params });
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${environment.apiUrl}/products/${id}`);
  }

  getCategories(): Observable<CategoryCount[]> {
    return this.http.get<CategoryCount[]>(`${environment.apiUrl}/categories`);
  }
}
