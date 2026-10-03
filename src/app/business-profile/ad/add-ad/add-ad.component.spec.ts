import { TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { provideTranslateService } from '@ngx-translate/core';

import { AddAdComponent } from './add-ad.component';
import { StorageService } from '../../../shared/services/storage.service';
import { Advertisement } from '../../../shared/interfaces/advertisement.interface';

describe('AddAdComponent', () => {
  let dialogRef: jasmine.SpyObj<MatDialogRef<AddAdComponent>>;

  function create(form?: Advertisement) {
    dialogRef = jasmine.createSpyObj<MatDialogRef<AddAdComponent>>('MatDialogRef', ['close']);
    TestBed.configureTestingModule({
      imports: [AddAdComponent],
      providers: [
        provideTranslateService(),
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: MAT_DIALOG_DATA, useValue: { form } },
        { provide: StorageService, useValue: {} },
      ],
    });
    const fixture = TestBed.createComponent(AddAdComponent);
    fixture.detectChanges();
    return fixture.componentInstance;
  }

  it('sends blank optional fields as null', () => {
    const component = create();
    component.form.patchValue({ image: 'https://cdn.test/a.png', headline: ' Bread ', cta: ' ' });

    component.submit();

    expect(dialogRef.close).toHaveBeenCalledWith({
      image: 'https://cdn.test/a.png',
      headline: 'Bread',
      subheadline: null,
      cta: null,
      link: null,
    });
  });

  it('accepts site paths and http(s) links only', () => {
    const link = create().form.controls.link;

    for (const ok of ['/seller/1', 'https://tnakan.am']) {
      link.setValue(ok);
      expect(link.valid).withContext(ok).toBeTrue();
    }
    for (const bad of ['//evil.test', 'javascript:alert(1)', 'seller/1']) {
      link.setValue(bad);
      expect(link.valid).withContext(bad).toBeFalse();
    }
  });

  it('prefills the form when editing', () => {
    const component = create({
      image: 'https://cdn.test/a.png',
      headline: 'Bread',
      subheadline: null,
      cta: 'Order',
      link: null,
    } as Advertisement);

    expect(component.form.getRawValue()).toEqual({
      image: 'https://cdn.test/a.png',
      headline: 'Bread',
      subheadline: '',
      cta: 'Order',
      link: '',
    });
    expect(component.invalid()).toBeFalse();
  });
});
