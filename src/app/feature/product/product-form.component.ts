import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CategoryService } from '../../Core/service/category.service';
import { ProductService } from '../../Core/service/product.service';
import { ProductFormModel } from '../../models/product-form';
import { ICategory } from '../../models/category';
import { IProduct } from '../../models/product';
import { UpsertFormBase } from '../../shared/utils/upsert-form-base';
import { environment } from '../../../environments/environment';
import { getProductImageUrls } from '../../shared/utils/product-images';

@Component({
  standalone: true,
  selector: 'app-product-form',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent extends UpsertFormBase<IProduct, ProductFormModel> implements OnInit {
  form!: FormGroup;
  override isEditMode = false;
  override isLoading = false;
  override isSaving = false;
  override errorMessage: string | null = null;
  categories: ICategory[] = [];
  selectedFiles: File[] = [];
  existingImageUrls: string[] = [];
  selectedPreviewUrls: string[] = [];
  photosRequiredError = false;

  private readonly assetsBaseURL = environment.assetsBaseURL
    || (environment.baseURL.startsWith('http')
      ? environment.baseURL.replace(/\/api\/?$/i, '')
      : 'https://localhost:7186');

  constructor(
    private fb: FormBuilder,
    route: ActivatedRoute,
    router: Router,
    private productService: ProductService,
    private categoryService: CategoryService
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
            this.existingImageUrls = getProductImageUrls(product, this.assetsBaseURL);
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
        this.errorMessage = error instanceof Error ? error.message : 'Failed to load categories.';
      }
    });
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
    this.selectedFiles = input.files ? Array.from(input.files) : [];
    this.photosRequiredError = false;
    this.revokePreviewUrls();
    this.selectedPreviewUrls = this.selectedFiles.map((file) => URL.createObjectURL(file));
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
      this.photosRequiredError = true;
      return;
    }

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
    const categoryId = product.categoryId
      ?? this.categories.find((c) => c.name === product.categoryName)?.id
      ?? 0;

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
