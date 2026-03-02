import { isPlatformBrowser, NgClass, NgFor } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, NgModule, OnInit, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { IProduct } from './models/product';
import { Pagination } from './models/pagination';
import { NavBarComponent } from './shared/componants/nav-bar/nav-bar.component';
import { ShopComponent } from './feature/shop.component';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [NavBarComponent, ShopComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {


  constructor(
    private http: HttpClient) { }

  ngOnInit(): void {

  }


}