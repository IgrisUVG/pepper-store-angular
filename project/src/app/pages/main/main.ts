import { Component, inject, OnInit, signal } from '@angular/core';
import { CatalogData, SortDirection } from '../../services/catalog-data';
import { CurrencyPipe } from '@angular/common';
import { HeatLevel, Product, ProductType } from '../../types/product';
import { API_URL, ApiFetcher } from '../../services/api-fetcher';
import { environment } from '../../../environments/environment';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

enum SearchParamName {
  HEAT_LEVELS = "heatLevels[]",
  PRODUCT_TYPES = "productTypes[]",
  SORT_DIRECTION = "sort",
}

@Component({
  selector: 'app-main',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './main.html',
  styleUrl: './main.css',
})
export class Main implements OnInit {
  #apiFetcher = inject(ApiFetcher)

  #route = inject(ActivatedRoute)

  #router = inject(Router)

  catalog = inject(CatalogData);

  isLoading = signal<boolean>(true);

  sortDirectionName:[SortDirection, string][] = [
    [SortDirection.NEW, "New"],
    [SortDirection.PRICE_ASC, "Price Low"],
    [SortDirection.PRICE_DESC, "Price High"],
    [SortDirection.RATING, "Scoville Rating"],
  ];

  productTypeFilterName:[ProductType, string][] = [
    [ProductType.CHILLY, "Whole Chillies"],
    [ProductType.SPICE, "Ground Spices"],
    [ProductType.SAUCE, "Scorching Sauces"],
    [ProductType.BLEND, "Sadistic Blends"],
    [ProductType.EXTRACT, "Infernal Extracts"],
  ];

  heatLevelFilterName:[HeatLevel, string][] = [
    [HeatLevel.LOWEST, "Warming Up"],
    [HeatLevel.MEDIUM, "Serious Heat"],
    [HeatLevel.HIGHER, "Ring of Fire"],
    [HeatLevel.HIGH, "Legal Weapon"],
  ];

  ngOnInit(): void {
    this.#route.queryParams.subscribe((values) => {
      this.catalog.selectedHeatLevels.set(values[SearchParamName.HEAT_LEVELS] as HeatLevel[] ?? []);
      this.catalog.selectedProductTypes.set(values[SearchParamName.PRODUCT_TYPES] as ProductType[] ?? []);
      this.catalog.sortDirection.set(values[SearchParamName.SORT_DIRECTION] as SortDirection ?? CatalogData.DEFAULT_SORT_DIRECTION);
    });

    this.#apiFetcher.get<Product[]>(API_URL["PRODUCTS"]()).subscribe((data) => {
      this.catalog.data.set(data.data.map((i) => ({
        ...i,
        image: {
          ...i.image,
          url: `${environment.STATIC_URL}${i.image.url}`,
        },
      })));

      this.isLoading.set(false);
    });
  }

  onSortDirectionClick(evt: Event) {
    evt.preventDefault();

    const clickedInput = evt.target as HTMLInputElement;
    const newSortDirection = clickedInput.value as SortDirection;

    this.#router.navigate([], {
      relativeTo: this.#route,
      queryParams: {
        [SearchParamName.SORT_DIRECTION]: newSortDirection === CatalogData.DEFAULT_SORT_DIRECTION ? null : newSortDirection,
      },
      queryParamsHandling: "merge",
    });
  }

  onHeatLevelClick(evt: Event) {
    evt.preventDefault();

    const clickedInput = evt.target as HTMLInputElement;
    const checkedHeatLevel = clickedInput.value as HeatLevel;
    const newHeatLevels = CatalogData.toggleHeatLevel(this.catalog.selectedHeatLevels(), checkedHeatLevel);

    this.#router.navigate([], {
      relativeTo: this.#route,
      queryParams: {
        [SearchParamName.HEAT_LEVELS]: newHeatLevels.length === 0 ? null : newHeatLevels,
      },
      queryParamsHandling: "merge",
    });
  }

  onProductTypeClick(evt: Event) {
    evt.preventDefault();

    const clickedInput = evt.target as HTMLInputElement;
    const checkedProductType = clickedInput.value as ProductType;
    const newProductTypes = CatalogData.toggleSelectedProductType(this.catalog.selectedProductTypes(), checkedProductType);

    this.#router.navigate([], {
      relativeTo: this.#route,
      queryParams: {
        [SearchParamName.PRODUCT_TYPES]: newProductTypes.length === 0 ? null : newProductTypes,
      },
      queryParamsHandling: "merge",
    });
  }
}
