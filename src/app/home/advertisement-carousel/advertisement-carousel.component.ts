import { AfterViewInit, ChangeDetectionStrategy, Component, Input, OnDestroy } from '@angular/core';
import { interval, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatAnchor } from '@angular/material/button';
import { CarouselItem } from '../../shared/interfaces/carusel-item.interface';

/**
 * A lightweight, fully‑responsive hero slider similar to amazon.com.
 *
 * ‑ Autoplay (5 s) with pause‑on‑hover
 * ‑ Keyboard navigation (←/→)
 * ‑ SR‑friendly (buttons have aria‑labels)
 * ‑ No external deps
 */
@Component({
  selector: 'app-advertisement-carousel',
  templateUrl: './advertisement-carousel.component.html',
  styleUrls: ['./advertisement-carousel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatAnchor],
})
export class AdvertisementCarouselComponent implements AfterViewInit, OnDestroy {
  /** Array of slides */
  @Input() items: CarouselItem[] = [];

  /** Autoplay interval in ms (default 5000) */
  @Input() interval = 5000;

  active = 0;

  private readonly destroy$ = new Subject<void>();
  private paused = false;

  ngAfterViewInit(): void {
    interval(this.interval)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (!this.paused) {
          this.next();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  next(): void {
    this.active = (this.active + 1) % this.items.length;
  }

  prev(): void {
    this.active = (this.active - 1 + this.items.length) % this.items.length;
  }

  goTo(i: number): void {
    this.active = i;
  }

  /** Pause on mouse enter / focus */
  pause(): void {
    this.paused = true;
  }

  /** Resume on mouse leave / blur */
  play(): void {
    this.paused = false;
  }

  /** Allow ← / → keyboard control */
  onKey(event: KeyboardEvent): void {
    if (event.key === 'ArrowLeft') {
      this.prev();
    }
    if (event.key === 'ArrowRight') {
      this.next();
    }
  }
}
