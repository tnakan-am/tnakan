import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { StorageService } from '../../../shared/services/storage.service';
import { formErrorMessage } from '../../../shared/helpers/form-error-message';
import { AdPayload, Advertisement } from '../../../shared/interfaces/advertisement.interface';

/** Same rule as the API: an http(s) URL or a site path, never `//host` or `javascript:`. */
const LINK_PATTERN = /^(https?:\/\/|\/(?!\/))/;

@Component({
  selector: 'app-add-ad',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatIcon,
    TranslateModule,
  ],
  templateUrl: './add-ad.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddAdComponent {
  protected readonly formErrorMessage = formErrorMessage;
  private readonly dialogRef = inject(MatDialogRef<AddAdComponent, AdPayload>);
  private readonly storageService = inject(StorageService);
  readonly data = inject<{ form?: Advertisement }>(MAT_DIALOG_DATA);

  readonly form = inject(FormBuilder).nonNullable.group({
    image: ['', Validators.required],
    headline: ['', [Validators.required, Validators.maxLength(120)]],
    subheadline: [''],
    cta: ['', Validators.maxLength(40)],
    link: ['', Validators.pattern(LINK_PATTERN)],
  });

  // The upload resolves outside any template event, so OnPush needs signals here.
  readonly image = toSignal(this.form.controls.image.valueChanges, { initialValue: '' });
  readonly invalid = toSignal(this.form.statusChanges.pipe(map((s) => s !== 'VALID')), {
    initialValue: true,
  });

  constructor() {
    const ad = this.data.form;
    if (ad) {
      this.form.patchValue({
        image: ad.image,
        headline: ad.headline,
        subheadline: ad.subheadline ?? '',
        cta: ad.cta ?? '',
        link: ad.link ?? '',
      });
    }
  }

  uploadFile(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.storageService.uploadFile(file).subscribe((url) => this.form.patchValue({ image: url }));
  }

  cancel(): void {
    this.dialogRef.close();
  }

  submit(): void {
    const { image, headline, subheadline, cta, link } = this.form.getRawValue();
    // The API rejects an empty link, and null also clears a value on edit.
    this.dialogRef.close({
      image,
      headline: headline.trim(),
      subheadline: subheadline.trim() || null,
      cta: cta.trim() || null,
      link: link.trim() || null,
    });
  }
}
