import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxStarsModule } from 'ngx-stars';
import { Review } from '../../../shared/interfaces/reviews.interface';

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [CommonModule, NgxStarsModule],
  templateUrl: './reviews.component.html',
  styleUrl: './reviews.component.scss',
})
export class ReviewsComponent {
  @Input() reviews!: Review[];
}
