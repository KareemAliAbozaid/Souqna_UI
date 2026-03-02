import { isPlatformBrowser, NgFor } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ShopService } from '../Core/service/shop.service';
import { Pagination } from '../models/pagination';
import { IProduct } from '../models/product';

@Component({
  standalone: true,
  selector: 'app-shop',
  imports: [NgFor],
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {
  products: IProduct[] = [];

  constructor(
    private shopService: ShopService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.getProducts();
    }
  }

  getProducts() {
    this.shopService.getProducts().subscribe({
      next: (value: Pagination) => {
        this.products = value.data;
      },
      error: (err) => console.error(err)
    });
  }
}
