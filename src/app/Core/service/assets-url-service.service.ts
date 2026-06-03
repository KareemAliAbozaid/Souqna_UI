import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AssetsUrlService {
  readonly baseURL: string = environment.assetsBaseURL
    || (environment.baseURL.startsWith('http')
      ? environment.baseURL.replace(/\/api\/?$/i, '')
      : 'https://localhost:7186');
}