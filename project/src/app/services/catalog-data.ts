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

  #data: Product[] = [
    {
      id: "01",
      name: "Ghost Pepper Powder",
      price: {
        value: 6.66,
        currency: "USD",
      },
      description: "A lingering heat that will haunt you",
      image: "/products/pepper-01.png",
      rating: 5,
      heatLevel: HeatLevel.HIGHER,
      type: ProductType.SPICE,
    },
    {
      id: "02",
      name: "Mango Habanero Mercy Sauce",
      price: {
        value: 8.5,
        currency: "USD",
      },
      description: " Lures you in with sweetness, then bites",
      image: "/products/pepper-02.png",
      rating: 8,
      heatLevel: HeatLevel.MEDIUM,
      type: ProductType.SAUCE,
    },
    {
      id: "03",
      name: "Trinidad Scorpion Venom",
      price: {
        value: 12.99,
        currency: "EUR",
      },
      description: "A blistering sting you won't forget",
      image: "/products/pepper-03.png",
      rating: 7,
      heatLevel: HeatLevel.HIGH,
      type: ProductType.CHILLY,
    },
    {
      id: "04",
      name: "The Abyss - Pure Evil Extract",
      price: {
        value: 25.00,
        currency: "GBP",
      },
      description: "One drop is a crime. Use with caution",
      image: "/products/pepper-04.png",
      rating: 3,
      heatLevel: HeatLevel.HIGH,
      type: ProductType.EXTRACT,
    },
    {
      id: "05",
      name: `"Why Did I Do This?" Hot Salt`,
      price: {
        value: 16.333333331,
        currency: "EUR",
      },
      description: "A salty, crunchy path to pure regret",
      image: "/products/pepper-05.png",
      rating: 9,
      heatLevel: HeatLevel.LOWEST,
      type: ProductType.BLEND,
    },
  ]

  sortDirection = signal(CatalogData.DEFAULT_SORT_DIRECTION)

  selectedHeatLevels = signal<HeatLevel[]>([]);

  filteredData = computed(() => {
    const newList = [...this.#data];

    const filteredList = newList.filter(() => true);

    filteredList.sort(SortFunctionByDirection.get(this.sortDirection())!);

    return filteredList;
  })
}
