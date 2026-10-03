import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { HomeComponent } from './home.component';
import { AdsService } from '../shared/services/ads.service';
import { UsersService } from '../shared/services/users.service';
import { Advertisement } from '../shared/interfaces/advertisement.interface';
import { IUser } from '../shared/interfaces/user.interface';

describe('HomeComponent', () => {
  const ad = {
    id: 'ad-1',
    image: 'https://cdn.test/a.png',
    headline: 'Fresh bread',
    subheadline: null,
    cta: 'Order',
    link: '/seller/1',
    approved: true,
  } as Advertisement;
  const business = {
    id: 'biz-1',
    image: 'https://cdn.test/b.png',
    displayName: 'Ani',
    name: '',
    company: 'Ani Bakery',
  } as IUser;

  function create(ads: Advertisement[]) {
    const usersService = jasmine.createSpyObj<UsersService>('UsersService', ['getBusinesses']);
    usersService.getBusinesses.and.returnValue(of([business]));
    TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        { provide: AdsService, useValue: { getApproved: () => of(ads) } },
        { provide: UsersService, useValue: usersService },
      ],
    }).overrideComponent(HomeComponent, { set: { imports: [], template: '' } });
    return { component: TestBed.createComponent(HomeComponent).componentInstance, usersService };
  }

  it('shows approved ads in the hero', () => {
    const { component, usersService } = create([ad]);

    expect(component.ads()).toEqual([
      {
        image: ad.image,
        headline: 'Fresh bread',
        subheadline: undefined,
        cta: 'Order',
        link: '/seller/1',
      },
    ]);
    expect(usersService.getBusinesses).not.toHaveBeenCalled();
  });

  it('falls back to businesses with the company as subtitle', () => {
    const { component } = create([]);

    expect(component.ads()).toEqual([
      {
        image: business.image!,
        headline: 'Ani',
        subheadline: 'Ani Bakery',
        cta: 'Shop now',
        link: '/seller/biz-1',
      },
    ]);
  });
});
