import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
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
import { filter, switchMap } from 'rxjs';
import { AdsService } from '../../shared/services/ads.service';
import { AdPayload, Advertisement } from '../../shared/interfaces/advertisement.interface';
import { AddAdComponent } from './add-ad/add-ad.component';

@Component({
  selector: 'app-ad',
  imports: [
    MatButton,
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
  templateUrl: './ad.component.html',
  styleUrl: './ad.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdComponent {
  private readonly adsService = inject(AdsService);
  private readonly dialog = inject(MatDialog);

  readonly ads = signal<Advertisement[]>([]);
  readonly displayedColumns = ['image', 'headline', 'link', 'status', 'star'];

  constructor() {
    this.load();
  }

  openDialog(ad?: Advertisement): void {
    this.dialog
      .open<AddAdComponent, { form?: Advertisement }, AdPayload>(AddAdComponent, {
        data: { form: ad },
        width: '500px',
      })
      .afterClosed()
      .pipe(
        filter((value): value is AdPayload => !!value),
        switchMap((value) =>
          ad ? this.adsService.update(ad.id, value) : this.adsService.create(value)
        )
      )
      .subscribe(() => this.load());
  }

  delete(ad: Advertisement): void {
    this.adsService.delete(ad.id).subscribe(() => this.load());
  }

  private load(): void {
    this.adsService.getMine().subscribe((ads) => this.ads.set(ads));
  }
}
