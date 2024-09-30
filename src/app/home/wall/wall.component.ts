import { Component } from '@angular/core';
import { CardItemComponent } from './card-item/card-item.component';

@Component({
  selector: 'app-wall',
  standalone: true,
  imports: [CardItemComponent],
  templateUrl: './wall.component.html',
  styleUrl: './wall.component.css',
})
export class WallComponent {
  products = (new Array(8)).map(value => ({id: Math.random()}));

  constructor() {
    this.products = ([1,2,3,4,5,6,7,8]).map(value => ({id:value}));
  }
}
