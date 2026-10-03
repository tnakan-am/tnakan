import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { AdsService } from './ads.service';
import { AdPayload } from '../interfaces/advertisement.interface';
import { environment } from '../../../environments/environment';

describe('AdsService', () => {
  let service: AdsService;
  let httpMock: HttpTestingController;
  const base = `${environment.apiUrl}/ads`;
  const payload: AdPayload = {
    image: 'https://cdn.test/a.png',
    headline: 'Fresh bread',
    subheadline: null,
    cta: 'Order',
    link: '/seller/1',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AdsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('reads approved, own and admin lists', () => {
    service.getApproved().subscribe();
    httpMock.expectOne({ method: 'GET', url: base }).flush([]);

    service.getMine().subscribe();
    httpMock.expectOne({ method: 'GET', url: `${base}/mine` }).flush([]);

    service.getAll().subscribe();
    httpMock.expectOne({ method: 'GET', url: `${base}/admin` }).flush([]);

    service.getAll(false).subscribe();
    const filtered = httpMock.expectOne({ method: 'GET', url: `${base}/admin?approved=false` });
    expect(filtered.request.params.get('approved')).toBe('false');
    filtered.flush([]);
  });

  it('creates and updates with the ad payload', () => {
    service.create(payload).subscribe();
    const create = httpMock.expectOne({ method: 'POST', url: base });
    expect(create.request.body).toEqual(payload);
    create.flush({});

    service.update('ad-1', payload).subscribe();
    const update = httpMock.expectOne({ method: 'PATCH', url: `${base}/ad-1` });
    expect(update.request.body).toEqual(payload);
    update.flush({});
  });

  it('approves and deletes by id', () => {
    service.approve('ad-1', true).subscribe();
    const approve = httpMock.expectOne({ method: 'PATCH', url: `${base}/ad-1/approve` });
    expect(approve.request.body).toEqual({ approved: true });
    approve.flush({});

    service.delete('ad-1').subscribe();
    httpMock.expectOne({ method: 'DELETE', url: `${base}/ad-1` }).flush({ success: true });
  });
});
