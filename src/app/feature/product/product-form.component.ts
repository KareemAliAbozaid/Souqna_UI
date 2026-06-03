import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CategoryService } from '../../Core/service/category.service';
import { ProductService } from '../../Core/service/product.service';
import { ProductFormModel } from '../../models/product-form';
import { ICategory } from '../../models/category';
import { IProduct } from '../../models/product';
import { UpsertFormBase } from '../../shared/utils/upsert-form-base';
import { getProductImageUrls } from '../../shared/utils/product-images';
import { AssetsUrlService } from '../../Core/service/assets-url-service.service';

/** Accepted image MIME types for product photos. */
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

/** Max size per file: 5 MB. */
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

@Component({
  standalone: true,
  selector: 'app-product-form',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent
  extends UpsertFormBase<IProduct, ProductFormModel>
  implements OnInit, OnDestroy {
  form!: FormGroup;
  override isEditMode = false;
  override isLoading = false;
  override isSaving = false;
  override errorMessage: string | null = null;

  categories: ICategory[] = [];
  selectedFiles: File[] = [];
  existingImageUrls: string[] = [];
  selectedPreviewUrls: string[] = [];

  fileError: string | null = null;

  constructor(
    private fb: FormBuilder,
    route: ActivatedRoute,
    router: Router,
    private productService: ProductService,
    private categoryService: CategoryService,
    private assetsUrlService: AssetsUrlService
  ) {
    super(route, router);
  }

  ngOnInit(): void {
    this.buildForm();

    this.categoryService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.initFromRouteId({
          loadById: (id) => this.productService.getProductById(id),
          toFormModel: (product) => {
            this.existingImageUrls = getProductImageUrls(product, this.assetsUrlService.baseURL);
            return this.mapProductToForm(product);
          },
          patchForm: (model) => {
            this.form.patchValue({
              name: model.name,
              description: model.description,
              newPrice: model.newPrice,
              oldPrice: model.oldPrice,
              categoryId: model.categoryId
            });
          },
          errorMessage: 'Failed to load product.'
        });
      },
      error: (error: unknown) => {
        this.errorMessage = error instanceof Error
          ? error.message
          : 'Failed to load categories.';
      }
    });
  }

  ngOnDestroy(): void {
    // Prevent memory leaks — revoke any blob URLs that were never cleaned up.
    this.revokePreviewUrls();
  }

  buildForm(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      description: [''],
      newPrice: [0, [Validators.required, Validators.min(0.01)]],
      oldPrice: [0, [Validators.required, Validators.min(0.01)]],
      categoryId: [0, [Validators.required, Validators.min(1)]]
    });
  }

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files ? Array.from(input.files) : [];

    this.fileError = this.validateFiles(files);

    if (this.fileError) {
      // Keep any previously valid selection intact so the user isn't left with nothing.
      input.value = '';
      return;
    }

    this.revokePreviewUrls();
    this.selectedFiles = files;
    this.selectedPreviewUrls = files.map((file) => URL.createObjectURL(file));
  }

  private validateFiles(files: File[]): string | null {
    for (const file of files) {
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        return `"${file.name}" is not a supported image type. Please upload JPEG, PNG, WebP, or GIF files.`;
      }
      if (file.size > MAX_FILE_SIZE_BYTES) {
        return `"${file.name}" exceeds the 5 MB size limit.`;
      }
    }
    return null;
  }

  private revokePreviewUrls(): void {
    for (const url of this.selectedPreviewUrls) {
      URL.revokeObjectURL(url);
    }
    this.selectedPreviewUrls = [];
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (!this.isEditMode && this.selectedFiles.length === 0) {
      this.fileError = 'At least one product photo is required.';
      return;
    }

    this.fileError = null;

    const payload: ProductFormModel = {
      ...this.form.value,
      photos: this.selectedFiles
    };

    this.save({
      payload,
      create: (model) => this.productService.addProduct(model),
      update: (id, model) => this.productService.updateProduct(id, model),
      navigateTo: ['/products'],
      errorMessage: 'Failed to save product.'
    });
  }

  private mapProductToForm(product: IProduct): ProductFormModel {
    const categoryId =
      product.categoryId
      ?? this.categories.find((c) => c.name === product.categoryName)?.id
      ?? 0;

    if (categoryId === 0) {
      console.warn(
        `ProductFormComponent: could not resolve categoryId for product "${product.name}". ` +
        `categoryId=${product.categoryId}, categoryName="${product.categoryName}".`
      );
    }

    return {
      name: product.name,
      description: product.description ?? '',
      newPrice: product.newPrice,
      oldPrice: product.oldPrice,
      categoryId,
      photos: []
    };
  }

  get name() { return this.form.get('name'); }
  get description() { return this.form.get('description'); }
  get newPrice() { return this.form.get('newPrice'); }
  get oldPrice() { return this.form.get('oldPrice'); }
  get categoryId() { return this.form.get('categoryId'); }
}