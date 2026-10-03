import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { provideTranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';

import { AdComponent } from './ad.component';
import { AdsService } from '../../shared/services/ads.service';
import { AdPayload, Advertisement } from '../../shared/interfaces/advertisement.interface';

describe('AdComponent', () => {
  let fixture: ComponentFixture<AdComponent>;
  let adsService: jasmine.SpyObj<AdsService>;
  let dialogResult: AdPayload | undefined;
  const ad = { id: 'ad-1', headline: 'Fresh bread', approved: false } as Advertisement;
  const payload: AdPayload = {
    image: 'https://cdn.test/a.png',
    headline: 'Fresh bread',
    subheadline: null,
    cta: null,
    link: null,
  };

  beforeEach(() => {
    adsService = jasmine.createSpyObj<AdsService>('AdsService', [
      'getMine',
      'create',
      'update',
      'delete',
    ]);
    adsService.getMine.and.returnValue(of([ad]));
    adsService.create.and.returnValue(of(ad));
    adsService.update.and.returnValue(of(ad));
    adsService.delete.and.returnValue(of({ success: true }));

    TestBed.configureTestingModule({
      imports: [AdComponent],
      providers: [
        provideTranslateService(),
        { provide: AdsService, useValue: adsService },
        {
          provide: MatDialog,
          useValue: { open: () => ({ afterClosed: () => of(dialogResult) }) },
        },
      ],
    });
    fixture = TestBed.createComponent(AdComponent);
    fixture.detectChanges();
  });

  it('lists own ads', () => {
    expect(fixture.componentInstance.ads()).toEqual([ad]);
    expect(fixture.nativeElement.textContent).toContain('Fresh bread');
  });

  it('creates a new ad and reloads', () => {
    dialogResult = payload;
    fixture.componentInstance.openDialog();

    expect(adsService.create).toHaveBeenCalledWith(payload);
    expect(adsService.getMine).toHaveBeenCalledTimes(2);
  });

  it('updates an existing ad', () => {
    dialogResult = payload;
    fixture.componentInstance.openDialog(ad);

    expect(adsService.update).toHaveBeenCalledWith('ad-1', payload);
  });

  it('does nothing when the dialog is cancelled', () => {
    dialogResult = undefined;
    fixture.componentInstance.openDialog();

    expect(adsService.create).not.toHaveBeenCalled();
  });
});
