import { Component, inject, OnInit, signal } from '@angular/core';
import { API_URL, ApiFetcher } from '../../services/api-fetcher';
import { ProductFull } from '../../types/product';
import { ActivatedRoute } from '@angular/router';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-product',
  imports: [JsonPipe],
  templateUrl: './product.html',
  styleUrl: './product.css',
})
export class Product implements OnInit {
  #route = inject(ActivatedRoute)

  #apiFetcher = inject(ApiFetcher)

  isLoading = signal(true);

  data = signal<ProductFull|null>(null);

  ngOnInit(): void {
    this.#route.params.subscribe((params) => {
      this.#apiFetcher.get<ProductFull>(API_URL['PRODUCT'](params["id"])).subscribe((data) => {
        this.data.set(data.data);
        this.isLoading.set(false);
      });
    });
  }
}
