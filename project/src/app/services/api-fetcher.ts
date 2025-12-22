import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Product } from '../types/product';

export enum API_URL {
  PRODUCTS = "products?populate=*",
}

@Injectable({
  providedIn: 'root',
})
export class ApiFetcher {
  http = inject(HttpClient)

  get(url: API_URL, headers?: {}):Observable<{
    data: Product[],
  }> {
    return this.http.get<{
      data: Product[]
    }>(`${environment.API_URL}/${url}`, {
      headers: {
        ...headers,
        "Authorization": `Bearer ${environment.AuthToken}`,
      }
    });
  }
}
