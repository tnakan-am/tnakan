import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';

import { AdsApproveComponent } from './ads-approve.component';
import { AdsService } from '../../shared/services/ads.service';
import { Advertisement } from '../../shared/interfaces/advertisement.interface';

describe('AdsApproveComponent', () => {
  let fixture: ComponentFixture<AdsApproveComponent>;
  let adsService: jasmine.SpyObj<AdsService>;
  const ad = { id: 'ad-1', headline: 'Fresh bread', approved: false } as Advertisement;

  beforeEach(() => {
    adsService = jasmine.createSpyObj<AdsService>('AdsService', ['getAll', 'approve', 'delete']);
    adsService.getAll.and.returnValue(of([ad]));
    adsService.approve.and.returnValue(of({ ...ad, approved: true }));
    adsService.delete.and.returnValue(of({ success: true }));

    TestBed.configureTestingModule({
      imports: [AdsApproveComponent],
      providers: [provideTranslateService(), { provide: AdsService, useValue: adsService }],
    });
    fixture = TestBed.createComponent(AdsApproveComponent);
    fixture.detectChanges();
  });

  it('lists all ads for moderation', () => {
    expect(adsService.getAll).toHaveBeenCalledWith();
    expect(fixture.nativeElement.textContent).toContain('Fresh bread');
  });

  it('toggles approval and reloads', () => {
    fixture.componentInstance.toggleApproval(ad);

    expect(adsService.approve).toHaveBeenCalledWith('ad-1', true);
    expect(adsService.getAll).toHaveBeenCalledTimes(2);
  });

  it('deletes and reloads', () => {
    fixture.componentInstance.delete(ad);

    expect(adsService.delete).toHaveBeenCalledWith('ad-1');
    expect(adsService.getAll).toHaveBeenCalledTimes(2);
  });
});
