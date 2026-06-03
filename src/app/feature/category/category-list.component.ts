import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { RouterModule } from '@angular/router';
import { of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { CategoryService } from '../../Core/service/category.service';
import { ICategory } from '../../models/category';

@Component({
  standalone: true,
  selector: 'app-category-list',
  imports: [CommonModule, RouterModule],
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit {
  categories: ICategory[] = [];
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private categoryService: CategoryService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadCategories();
    }
  }
  loadCategories(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.categoryService.getAllCategories()
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (categories: ICategory[]) => {
          this.categories = categories;
          console.log('categories', this.categories);
        },
        error: (error: unknown) => {
          this.errorMessage = error instanceof Error ? error.message : 'Failed to load categories.';
        }
      });
  }
  onDeleteCategory(id: number): void {
    if (!confirm('Are you sure you want to delete this category?')) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    this.categoryService.deleteCategory(id)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        }),
        catchError((error: unknown) => {
          this.errorMessage = error instanceof Error ? error.message : 'Failed to delete category.';
          return of(void 0);
        })
      )
      .subscribe(() => {
        this.loadCategories();
      });
  }
}

