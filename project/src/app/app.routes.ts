import { Routes } from '@angular/router';
import { Main } from './pages/main/main';
import { Product } from './pages/product/product';

export const routes: Routes = [
  {
    path: "",
    component: Main,
  },
  {
    path: "products/:id",
    component: Product,
  },
  {
    path: "products",
    redirectTo: "/",
  },
];
