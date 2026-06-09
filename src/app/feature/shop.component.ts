import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { CategoryService } from '../Core/service/category.service';
import { ShopService } from '../Core/service/shop.service';
import { environment } from '../../environments/environment';
import { ICategory } from '../models/category';
import { IProduct } from '../models/product';
import { ShopParams } from '../models/shop-params';
import { getProductImageUrls } from '../shared/utils/product-images';

@Component({
  standalone: true,
  selector: 'app-shop',
  imports: [CommonModule, FormsModule],
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit, OnDestroy {
  products: IProduct[] = [];
  categories: ICategory[] = [];
  searchTerm = '';
  shopParams: ShopParams = {
    pageNumber: 1,
    pageSize: 10,   // ← 10 products per page
    categoryId: 0,
    search: ''
  };
  totalPages = 0;
  totalCount = 0;
  isLoading = false;
  errorMessage: string | null = null;
  readonly brokenImageKeys = new Set<string>();
  readonly activeImageIndex: Record<number, number> = {};

  private readonly assetsBaseURL = this.resolveAssetsBaseUrl();
  private querySub?: Subscription;

  private resolveAssetsBaseUrl(): string {
    if (environment.assetsBaseURL) {
      return environment.assetsBaseURL;
    }
    if (environment.baseURL.startsWith('http')) {
      return environment.baseURL.replace(/\/api\/?$/i, '');
    }
    return 'https://localhost:7186';
  }

  constructor(
    private shopService: ShopService,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  // -----------------------------------------------------------------
  // Lifecycle
  // -----------------------------------------------------------------

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadCategories();
      this.querySub = this.route.queryParamMap.subscribe((params) => {
        const search = params.get('search') ?? '';
        this.searchTerm = search;
        this.shopParams.search = search;
        this.shopParams.pageNumber = 1;
        this.getProducts();
      });
    }
  }

  ngOnDestroy(): void {
    this.querySub?.unsubscribe();
  }

  // -----------------------------------------------------------------
  // Computed
  // -----------------------------------------------------------------

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  get showingCount(): number {
    return this.products.length;
  }

  // -----------------------------------------------------------------
  // Data
  // -----------------------------------------------------------------

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (categories) => { this.categories = categories; },
      error: (error: unknown) => { console.error(error); }
    });
  }

  getProducts(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.shopService.getProducts(this.shopParams)
      .pipe(finalize(() => { this.isLoading = false; }))
      .subscribe({
        next: (result) => {
          this.brokenImageKeys.clear();
          this.products = result.data ?? [];
          this.products.forEach((p) => (this.activeImageIndex[p.id] = 0));
          this.totalPages = result.totalPages;
          this.totalCount = result.totalCount;
          this.shopParams.pageNumber = result.pageNumber;
        },
        error: (error: unknown) => {
          this.errorMessage = this.resolveErrorMessage(error, 'Failed to load products.');
        }
      });
  }

  // -----------------------------------------------------------------
  // User actions
  // -----------------------------------------------------------------

  onCategorySelected(categoryId: number): void {
    this.shopParams.categoryId = categoryId;
    this.shopParams.pageNumber = 1;
    this.getProducts();
  }

  onPageChanged(page: number): void {
    if (page < 1 || page > this.totalPages || page === this.shopParams.pageNumber) return;
    this.shopParams.pageNumber = page;
    this.getProducts();
  }

  onSearch(): void {
    this.shopParams.search = this.searchTerm.trim();
    this.shopParams.pageNumber = 1;
    this.getProducts();
  }

  onResetSearch(): void {
    this.searchTerm = '';
    this.shopParams.search = '';
    this.shopParams.pageNumber = 1;
    this.getProducts();
  }

  // -----------------------------------------------------------------
  // Image helpers
  // -----------------------------------------------------------------

  getProductPrice(product: IProduct): number {
    return product.price ?? product.newPrice;
  }

  getProductImages(product: IProduct): string[] {
    const urls = getProductImageUrls(product, this.assetsBaseURL);
    console.log('IMAGE URLS', urls);
    return urls;
  }

  getVisibleImages(product: IProduct): string[] {
    return this.getProductImages(product).filter(
      (_, i) => !this.brokenImageKeys.has(this.imageKey(product.id, i))
    );
  }

  hasProductImages(product: IProduct): boolean {
    return this.getVisibleImages(product).length > 0;
  }

  getActiveIndex(productId: number): number {
    return this.activeImageIndex[productId] ?? 0;
  }

  setActiveImage(productId: number, index: number): void {
    this.activeImageIndex[productId] = index;
  }

  nextImage(product: IProduct): void {
    const images = this.getVisibleImages(product);
    if (images.length <= 1) return;
    const current = this.getActiveIndex(product.id);
    this.activeImageIndex[product.id] = (current + 1) % images.length;
  }

  prevImage(product: IProduct): void {
    const images = this.getVisibleImages(product);
    if (images.length <= 1) return;
    const current = this.getActiveIndex(product.id);
    this.activeImageIndex[product.id] = (current - 1 + images.length) % images.length;
  }

  onImageError(productId: number, index: number): void {
    this.brokenImageKeys.add(this.imageKey(productId, index));
  }

  // -----------------------------------------------------------------
  // Private helpers
  // -----------------------------------------------------------------

  private imageKey(productId: number, index: number): string {
    return `${productId}-${index}`;
  }

  private resolveErrorMessage(error: unknown, fallback: string): string {
    return error instanceof Error ? error.message : fallback;
  }
}