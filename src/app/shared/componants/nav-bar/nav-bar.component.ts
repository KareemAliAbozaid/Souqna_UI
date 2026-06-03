import { NgClass, NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

export interface NavLink {
  label: string;
  path: string;
  exact?: boolean;
}

@Component({
  standalone: true,
  selector: 'app-nav-bar',
  imports: [NgClass, NgFor, RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent {
  isCollapsed = true;
  dropdownVisible = false;
  headerSearch = '';

  readonly navLinks: NavLink[] = [
    { label: 'Home', path: '/shop', exact: true },
    { label: 'Products', path: '/products' },
    { label: 'Categories', path: '/categories' }
  ];

  constructor(private router: Router) { }

  toggleDropdown(): void {
    this.dropdownVisible = !this.dropdownVisible;
  }

  closeNav(): void {
    this.isCollapsed = true;
    this.dropdownVisible = false;
  }

  onHeaderSearch(event: Event): void {
    event.preventDefault();
    const search = this.headerSearch.trim();

    this.router.navigate(['/shop'], {
      queryParams: search ? { search } : {}
    });

    this.closeNav();
  }
}
