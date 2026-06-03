import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { RouterModule } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { IProduct } from '../../models/product';
import { ProductService } from '../../Core/service/product.service';
import { getProductImageUrls } from '../../shared/utils/product-images';
import { AssetsUrlService } from '../../Core/service/assets-url-service.service';

interface ProductViewModel extends IProduct {
  imageUrls: string[];
  displayPrice: number;
}

@Component({
  standalone: true,
  selector: 'app-product-list',
  imports: [CommonModule, RouterModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: ProductViewModel[] = [];
  isLoading = false;
  errorMessage: string | null = null;

  pendingDeleteId: number | null = null;

  constructor(
    private productService: ProductService,
    private assetsUrlService: AssetsUrlService,
    @Inject(PLATFORM_ID) private platformId: object
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
      .pipe(finalize(() => { this.isLoading = false; }))
      .subscribe({
        next: (products: IProduct[]) => {
          this.products = this.toViewModels(products);
        },
        error: (error: unknown) => {
          this.errorMessage = error instanceof Error
            ? error.message
            : 'Failed to load products.';
        }
      });
  }

  onDeleteRequest(id: number): void {
    this.pendingDeleteId = id;
  }

  onDeleteCancel(): void {
    this.pendingDeleteId = null;
  }

  onDeleteConfirm(): void {
    if (this.pendingDeleteId === null) return;

    const id = this.pendingDeleteId;
    this.pendingDeleteId = null;
    this.isLoading = true;
    this.errorMessage = null;

    this.productService.deleteProduct(id)
      .pipe(finalize(() => { this.isLoading = false; }))
      .subscribe({
        next: () => this.loadProducts(),
        error: (error: unknown) => {
          this.errorMessage = error instanceof Error
            ? error.message
            : 'Failed to delete product.';
        }
      });
  }

  private toViewModels(products: IProduct[]): ProductViewModel[] {
    return products.map((p) => ({
      ...p,
      imageUrls: getProductImageUrls(p, this.assetsUrlService.baseURL),
      displayPrice: p.price ?? p.newPrice
    }));
  }
}