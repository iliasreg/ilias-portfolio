import { Component, HostListener, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioService } from './core/services/portfolio.service';
import { HomeComponent }    from './modules/home/home';
import { WorkComponent }    from './modules/work/work';
import { StackComponent }   from './modules/stack/stack';
import { ContactComponent } from './modules/contact/contact';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    HomeComponent,
    WorkComponent,
    StackComponent,
    ContactComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private _wheelLock = false;
  private _touch = { x: 0, y: 0, active: false };

  constructor(public svc: PortfolioService) {
    // A section always opens at its own top. On mobile the page scrolls, so
    // without this a section change leaves the reader halfway into the new one.
    effect(() => {
      this.svc.currentScene();
      if (typeof window === 'undefined') return;
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    });
  }

  @HostListener('wheel', ['$event'])
  onWheel(e: WheelEvent) {
    // Below the mobile breakpoint the page scrolls, so the wheel belongs to the
    // browser: claiming it would scroll nothing and block the section.
    if (window.matchMedia('(max-width: 850px)').matches) return;
    if (this._wheelLock || e.deltaY === 0) return;
    e.preventDefault();
    this._wheelLock = true;
    setTimeout(() => this._wheelLock = false, 900);
    e.deltaY > 0 ? this.svc.next() : this.svc.prev();
  }

  @HostListener('keydown', ['$event'])
  onKey(e: KeyboardEvent) {
    const forward = e.key === 'ArrowDown' || e.key === 'ArrowRight';
    const backward = e.key === 'ArrowUp' || e.key === 'ArrowLeft';
    if (!forward && !backward) return;
    e.preventDefault();
    forward ? this.svc.next() : this.svc.prev();
  }

  @HostListener('touchstart', ['$event'])
  onTouchStart(e: TouchEvent) {
    if (this._isInteractive(e.target)) return;
    const t = e.touches[0];
    this._touch = { x: t.clientX, y: t.clientY, active: true };
  }

  @HostListener('touchend', ['$event'])
  onTouchEnd(e: TouchEvent) {
    if (!this._touch.active) return;
    this._touch.active = false;

    const t = e.changedTouches[0];
    const dx = t.clientX - this._touch.x;
    const dy = t.clientY - this._touch.y;

    // Horizontal only, deliberately: a vertical drag is the reader scrolling the
    // section, and claiming it made the page jump between sections mid-scroll.
    if (Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy) * 1.5) return;

    dx < 0 ? this.svc.next() : this.svc.prev();
  }

  private _isInteractive(target: EventTarget | null): boolean {
    const el = target as HTMLElement | null;
    return !!el?.closest?.('a, button, input, textarea, select');
  }
}
