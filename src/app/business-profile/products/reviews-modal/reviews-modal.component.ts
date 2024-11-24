import { Component, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle,
} from '@angular/material/card';
import { Review } from '../../../shared/interfaces/reviews.interface';
import { MatIcon } from '@angular/material/icon';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-reviews-modal',
  standalone: true,
  imports: [
    MatDialogContent,
    MatDialogTitle,
    TranslateModule,
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatCardSubtitle,
    MatCardTitle,
    MatIcon,
    DecimalPipe,
  ],
  templateUrl: './reviews-modal.component.html',
  styleUrl: './reviews-modal.component.scss',
})
export class ReviewsModalComponent {
  readonly dialogRef = inject(MatDialogRef<ReviewsModalComponent>);
  readonly data = inject<{ reviews: Review[]; avgReview: number; numberReview: number }>(
    MAT_DIALOG_DATA
  );

  constructor() {}
}
