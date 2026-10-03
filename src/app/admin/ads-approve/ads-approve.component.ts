import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
} from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';
import { AdsService } from '../../shared/services/ads.service';
import { Advertisement } from '../../shared/interfaces/advertisement.interface';

@Component({
  selector: 'app-ads-approve',
  imports: [
    MatIconButton,
    MatIcon,
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatCell,
    MatCellDef,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    TranslateModule,
  ],
  templateUrl: './ads-approve.component.html',
  styleUrl: './ads-approve.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdsApproveComponent {
  private readonly adsService = inject(AdsService);

  readonly ads = signal<Advertisement[]>([]);
  readonly displayedColumns = ['image', 'headline', 'subheadline', 'link', 'status', 'star'];

  constructor() {
    this.load();
  }

  toggleApproval(ad: Advertisement): void {
    this.adsService.approve(ad.id, !ad.approved).subscribe(() => this.load());
  }

  delete(ad: Advertisement): void {
    this.adsService.delete(ad.id).subscribe(() => this.load());
  }

  private load(): void {
    this.adsService.getAll().subscribe((ads) => this.ads.set(ads));
  }
}
