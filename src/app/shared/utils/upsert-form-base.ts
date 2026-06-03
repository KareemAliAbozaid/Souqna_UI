import { ActivatedRoute, Router } from '@angular/router';
import { finalize, Observable } from 'rxjs';

export abstract class UpsertFormBase<TLoaded, TFormModel extends object> {
  isEditMode = false;
  isLoading = false;
  isSaving = false;
  errorMessage: string | null = null;

  protected entityId: number | null = null;

  protected constructor(
    protected readonly route: ActivatedRoute,
    protected readonly router: Router
  ) { }

  protected initFromRouteId(options: {
    loadById: (id: number) => Observable<TLoaded>;
    toFormModel: (loaded: TLoaded) => TFormModel;
    patchForm: (model: TFormModel) => void;
    errorMessage?: string;
  }): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam) {
      return;
    }

    const parsed = Number(idParam);
    if (!Number.isFinite(parsed)) {
      this.errorMessage = 'Invalid id in URL.';
      return;
    }

    this.isEditMode = true;
    this.entityId = parsed;

    this.isLoading = true;
    this.errorMessage = null;

    options.loadById(parsed)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (loaded) => {
          options.patchForm(options.toFormModel(loaded));
        },
        error: (error: unknown) => {
          this.errorMessage =
            error instanceof Error ? error.message : (options.errorMessage ?? 'Failed to load item.');
        }
      });
  }

  protected save(options: {
    payload: TFormModel;
    create: (payload: TFormModel) => Observable<unknown>;
    update: (id: number, payload: TFormModel) => Observable<unknown>;
    navigateTo: any[];
    errorMessage?: string;
  }): void {
    this.isSaving = true;
    this.errorMessage = null;

    const request$ =
      this.isEditMode && this.entityId !== null
        ? options.update(this.entityId, options.payload)
        : options.create(options.payload);

    request$
      .pipe(finalize(() => (this.isSaving = false)))
      .subscribe({
        next: () => {
          this.router.navigate(options.navigateTo);
        },
        error: (error: unknown) => {
          this.errorMessage =
            error instanceof Error ? error.message : (options.errorMessage ?? 'Failed to save item.');
        }
      });
  }
}

