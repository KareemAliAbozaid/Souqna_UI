import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { RouterModule } from '@angular/router';
import { of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { IProduct } from '../../models/product';
import { ProductService } from '../../Core/service/product.service';
import { getProductImageUrls } from '../../shared/utils/product-images';

@Component({
  standalone: true,
  selector: 'app-product-list',
  imports: [CommonModule, RouterModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: IProduct[] = [];
  isLoading = false;
  errorMessage: string | null = null;

  private readonly assetsBaseURL = environment.assetsBaseURL
    || (environment.baseURL.startsWith('http')
      ? environment.baseURL.replace(/\/api\/?$/i, '')
      : 'https://localhost:7186');

  constructor(
    private productService: ProductService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadProducts();
    }
  }

  loadProducts(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.productService.getAllProducts()
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (products: IProduct[]) => {
          this.products = products;
        },
        error: (error: unknown) => {
          this.errorMessage = error instanceof Error ? error.message : 'Failed to load products.';
        }
      });
  }

  getProductPrice(product: IProduct): number {
    return product.price ?? product.newPrice;
  }

  getProductImages(product: IProduct): string[] {
    return getProductImageUrls(product, this.assetsBaseURL);
  }

  onDeleteProduct(id: number): void {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    this.productService.deleteProduct(id)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        }),
        catchError((error: unknown) => {
          this.errorMessage = error instanceof Error ? error.message : 'Failed to delete product.';
          return of(void 0);
        })
      )
      .subscribe(() => {
        this.loadProducts();
      });
  }
}
