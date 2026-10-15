import { Component, model } from '@angular/core';

@Component({
  selector: 'store-slidder',
  imports: [],
  templateUrl: './slidder.component.html',
  styleUrl: './slidder.component.css',
})
export class SlidderComponent {
  slidderValue= model(0);
}
