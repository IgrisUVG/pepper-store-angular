import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

export enum API_URL {
  PRODUCTS = "products?populate=*",
}

@Injectable({
  providedIn: 'root',
})
export class ApiFetcher {
  http = inject(HttpClient)

  get(url: API_URL, headers?: {}) {
    return this.http.get(`${environment.API_URL}/${url}`, {
      headers: {
        ...headers,
        "Authorization": `Bearer ${environment.AuthToken}`,
      }
    });
  }
}
