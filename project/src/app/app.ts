import { Component } from '@angular/core';
import { AppHeader } from './layout/header/header';
import { AppFooter } from './layout/footer/footer';
import { Checkbox } from './components/checkbox/checkbox';

@Component({
  selector: 'app-root',
  imports: [/*RouterOutlet, */AppHeader, AppFooter, Checkbox],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}
