import { Directive, Input, TemplateRef, ViewContainerRef, OnDestroy, OnInit } from '@angular/core';
import { RoleService } from '../service/role.service';
import { UserRole } from '../../models/user-role';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '../service/auth.service';

@Directive({
  standalone: true,
  selector: '[appHasRole]'
})
export class HasRoleDirective implements OnInit, OnDestroy {
  private requiredRoles: UserRole[] = [];
  private destroy$ = new Subject<void>();

  @Input()
  set appHasRole(roles: UserRole | UserRole[] | string | string[]) {
    this.requiredRoles = Array.isArray(roles)
      ? (roles as UserRole[])
      : [(roles as UserRole)];
    this.updateView();
  }

  constructor(
    private templateRef: TemplateRef<void>,
    private viewContainer: ViewContainerRef,
    private roleService: RoleService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.authService.currentUser$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.updateView();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateView(): void {
    if (this.roleService.hasRole(this.requiredRoles)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
