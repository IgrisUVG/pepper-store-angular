import { computed, Injectable, signal } from '@angular/core';
import { HeatLevel, Product, ProductType } from '../types/product';

export enum SortDirection {
  NEW = "sort-new",
  PRICE_ASC = "sort-price-asc",
  PRICE_DESC = "sort-price-desc",
  RATING = "sort-rating",
}

const SortFunctionByDirection = new Map<SortDirection, (a: Product, b: Product) => number>([
  [SortDirection.NEW, (a, b) => 0],
  [SortDirection.PRICE_ASC, (a, b) => a.price.value - b.price.value],
  [SortDirection.PRICE_DESC, (a, b) => b.price.value - a.price.value],
  [SortDirection.RATING, (a, b) => b.rating - a.rating],
]);

@Injectable({
  providedIn: 'root',
})
export class CatalogData {
  static DEFAULT_SORT_DIRECTION = SortDirection.NEW

  data = signal<Product[]>([])

  sortDirection = signal(CatalogData.DEFAULT_SORT_DIRECTION)

  selectedHeatLevels = signal<HeatLevel[]>([]);

  selectedProductTypes = signal<ProductType[]>([]);

  filteredData = computed(() => {
    const totalHeatLevels = Object.keys(HeatLevel).length;
    const totalProductTypes = Object.keys(ProductType).length;

    const filteredList = [...this.data()]
      // Filter by name
      .filter(() => true)
      // Filter by type
      .filter((p) => {
        if (this.selectedProductTypes().length === 0 || this.selectedProductTypes().length === totalProductTypes) {
          return true;
        }

        return this.selectedProductTypes().includes(p.type);
      })
      // Filter by heat level
      .filter((p) => {
        if (this.selectedHeatLevels().length === 0 || this.selectedHeatLevels().length === totalHeatLevels) {
          return true;
        }

        return this.selectedHeatLevels().includes(p.heatLevel);
      });

    filteredList.sort(SortFunctionByDirection.get(this.sortDirection())!);

    return filteredList;
  })

  static toggleHeatLevel(selectedHeatLevels: HeatLevel[], heatLevel: HeatLevel) {
    if (selectedHeatLevels.includes(heatLevel)) {
      return selectedHeatLevels.filter((level) => level !== heatLevel);
    }

    return [...selectedHeatLevels, heatLevel];
  }

  static toggleSelectedProductType(selectedProductTypes: ProductType[], productType: ProductType) {
    if (selectedProductTypes.includes(productType)) {
      return selectedProductTypes.filter((type) => type !== productType);
    }

    return [...selectedProductTypes, productType];
  }
}
