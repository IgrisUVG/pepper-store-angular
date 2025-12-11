import { Component, inject } from '@angular/core';
import { Checkbox } from '../../components/checkbox/checkbox';
import { CatalogData, SortDirection } from '../../services/catalog-data';
import { CurrencyPipe } from '@angular/common';
import { HeatLevel, ProductType } from '../../types/product';

@Component({
  selector: 'app-main',
  imports: [Checkbox, CurrencyPipe],
  templateUrl: './main.html',
  styleUrl: './main.css',
})
export class Main {
  catalog = inject(CatalogData);

  sortDirectionName = [
    [SortDirection.NEW, "New"],
    [SortDirection.PRICE_ASC, "Price Low"],
    [SortDirection.PRICE_DESC, "Price High"],
    [SortDirection.RATING, "Scoville Rating"],
  ];

  productTypeFilterName = [
    [ProductType.CHILLY, "Whole Chillies"],
    [ProductType.SPICE, "Ground Spices"],
    [ProductType.SAUCE, "Scorching Sauces"],
    [ProductType.BLEND, "Sadistic Blends"],
    [ProductType.EXTRACT, "Infernal Extracts"],
  ];

  heatLevelFilterName = [
    [HeatLevel.LOWEST, "Warming Up"],
    [HeatLevel.MEDIUM, "Serious Heat"],
    [HeatLevel.HIGHER, "Ring of Fire"],
    [HeatLevel.HIGH, "Legal Weapon"],
  ];

  onSortDirectionChange(evt: Event) {
    const clickedInput = evt.target as HTMLInputElement;
    const newSortDirection = clickedInput.value as SortDirection;
    this.catalog.sortDirection.set(newSortDirection)
  }

  onHeatLevelChange(evt: Event) {
    const clickedInput = evt.target as HTMLInputElement;
    const checkedHeatLevel = clickedInput.value as HeatLevel;
    this.catalog.toggleHeatLevel(checkedHeatLevel);
  }

  onProductTypeChange(evt: Event) {
    const clickedInput = evt.target as HTMLInputElement;
    const checkedProductType = clickedInput.value as ProductType;
    this.catalog.toggleSelectedProductType(checkedProductType);
  }
}
