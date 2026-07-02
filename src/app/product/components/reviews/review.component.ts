import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxStarsModule } from 'ngx-stars';
import { Review } from '../../../shared/interfaces/reviews.interface';
import { STAR_COLOR } from '../../../shared/constants/theme';

@Component({
  selector: 'app-review',
  standalone: true,
  imports: [CommonModule, NgxStarsModule],
  templateUrl: './review.component.html',
  styleUrl: './review.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewComponent {
  readonly starColor = STAR_COLOR;
  @Input() review!: Review;
}
