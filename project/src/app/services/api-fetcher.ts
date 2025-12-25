import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

export const API_URL:{
  [key: string]: (params?: any) => string
} = {
  "PRODUCTS": () => "products?populate=image&fields[0]=id&fields[1]=documentId&fields[2]=name&fields[3]=price&fields[4]=description&fields[5]=rating&fields[6]=heatLevel&fields[7]=type",
  "PRODUCT": (documentId: string) => `products/${documentId}?populate=*`,
}

@Injectable({
  providedIn: 'root',
})
export class ApiFetcher {
  http = inject(HttpClient)

  get<T>(url: string, headers?: {}):Observable<{
    data: T,
  }> {
    return this.http.get<{
      data: T
    }>(`${environment.API_URL}/${url}`, {
      headers: {
        ...headers,
        "Authorization": `Bearer ${environment.AuthToken}`,
      }
    });
  }
}
