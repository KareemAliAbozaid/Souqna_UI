import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CategoryService } from '../../Core/service/category.service';
import { CategoryFormModel } from '../../models/category-form';
import { ICategory } from '../../models/category';
import { UpsertFormBase } from '../../shared/utils/upsert-form-base';

@Component({
  standalone: true,
  selector: 'app-category-form',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css']
})
export class CategoryFormComponent extends UpsertFormBase<ICategory, CategoryFormModel> implements OnInit {
  form!: FormGroup;
  override isEditMode = false;
  override isLoading = false;
  override isSaving = false;
  override errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    route: ActivatedRoute,
    router: Router,
    private categoryService: CategoryService
  ) {
    super(route, router);
  }

  ngOnInit(): void {
    this.buildForm();
    this.initFromRouteId({
      loadById: (id) => this.categoryService.getCategoryById(id),
      toFormModel: (category) => ({
        name: category.name,
        description: category.description ?? ''
      }),
      patchForm: (model) => this.form.patchValue(model),
      errorMessage: 'Failed to load category.'
    });
  }

  buildForm(): void {
    const initial: CategoryFormModel = {
      name: '',
      description: ''
    };

    this.form = this.fb.group({
      name: [initial.name, [Validators.required]],
      description: [initial.description, [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload: CategoryFormModel = this.form.value;
    this.save({
      payload,
      create: (model) => this.categoryService.addCategory(model),
      update: (id, model) => this.categoryService.updateCategory(id, model),
      navigateTo: ['/categories'],
      errorMessage: 'Failed to save category.'
    });
  }

  get name() { return this.form.get('name'); }
  get description() { return this.form.get('description'); }
}

