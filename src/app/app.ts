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

  cx = 0; cy = 0;
  rx = 0; ry = 0;
  private _raf = 0;

  constructor(public svc: PortfolioService) {
    this._animateRing();
  }

  @HostListener('wheel', ['$event'])
  onWheel(e: WheelEvent) {
    if (this._wheelLock) return;
    this._wheelLock = true;
    setTimeout(() => this._wheelLock = false, 900);
    e.deltaY > 0 ? this.svc.next() : this.svc.prev();
  }

  @HostListener('keydown', ['$event'])
  onKey(e: KeyboardEvent) {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') this.svc.next();
    if (e.key === 'ArrowUp'   || e.key === 'ArrowLeft')  this.svc.prev();
  }

  @HostListener('mousemove', ['$event'])
  onMove(e: MouseEvent) {
    this.cx = e.clientX;
    this.cy = e.clientY;
  }

  @HostListener('touchstart', ['$event'])
  onTouchStart(e: TouchEvent) { this._touchY = e.touches[0].clientY; }

  @HostListener('touchend', ['$event'])
  onTouchEnd(e: TouchEvent) {
    const dy = this._touchY - e.changedTouches[0].clientY;
    if (Math.abs(dy) > 50) dy > 0 ? this.svc.next() : this.svc.prev();
  }

  private _touchY = 0;

  private _animateRing() {
    this.rx += (this.cx - this.rx) * 0.1;
    this.ry += (this.cy - this.ry) * 0.1;
  }
}
