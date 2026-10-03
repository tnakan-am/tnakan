import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';

import { AdvertisementCarouselComponent } from './advertisement-carousel.component';

describe('AdvertisementCarouselComponent', () => {
  let component: AdvertisementCarouselComponent;
  let fixture: ComponentFixture<AdvertisementCarouselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdvertisementCarouselComponent],
      providers: [provideTranslateService()],
    }).compileComponents();

    fixture = TestBed.createComponent(AdvertisementCarouselComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('renders the CTA only when a slide has both label and link', () => {
    fixture.componentRef.setInput('items', [
      { image: 'a.png', headline: 'Text only', subheadline: 'Fresh daily' },
      { image: 'b.png', headline: 'No link', cta: 'Order' },
      { image: 'c.png', headline: 'Full', cta: 'Shop now', link: '/seller/1' },
    ]);
    fixture.detectChanges();

    const slides: HTMLElement[] = Array.from(fixture.nativeElement.querySelectorAll('.slide'));
    expect(slides.map((slide) => !!slide.querySelector('a.cta'))).toEqual([false, false, true]);
    expect(slides[0].querySelector('p')?.textContent).toBe('Fresh daily');
    expect(slides[1].querySelector('p')).toBeNull();
    expect(slides[2].querySelector('a.cta')?.getAttribute('href')).toBe('/seller/1');
  });
});
