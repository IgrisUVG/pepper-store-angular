import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-checkbox',
  imports: [],
  templateUrl: './checkbox.html',
  styleUrl: './checkbox.css',
})
export class Checkbox {
  @Input() name: string = ""
  @Input() value: string = ""
  @Input() label: string = ""
}
