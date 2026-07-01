import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { NotificationsService } from './notifications.service';
import { NotificationsSocketService } from './notifications-socket.service';
import { AuthService } from './auth.service';
import { Order, Status } from '../interfaces/order.interface';
import { environment } from '../../../environments/environment';

describe('NotificationsService', () => {
  let service: NotificationsService;
  let httpMock: HttpTestingController;

  const vendorId = 'vendor-1';
  const order = {
    id: 'order-1',
    orderId: 'order-1',
    products: [{ id: 'row-1', productId: 'cat-1', vendorId, status: Status.seen }],
  } as unknown as Order;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NotificationsService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: { currentUser: () => ({ id: vendorId }) } },
        {
          provide: NotificationsSocketService,
          useValue: { notifications: () => [], newOrders: () => [] },
        },
      ],
    });
    service = TestBed.inject(NotificationsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('PATCHes each vendor product status using its catalog productId', async () => {
    const promise = service.changeProductsStatus(order, Status.processing);

    const req = httpMock.expectOne(`${environment.apiUrl}/orders/order-1/products/cat-1/status`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ status: Status.processing });

    req.flush({});
    await promise;
  });
});
