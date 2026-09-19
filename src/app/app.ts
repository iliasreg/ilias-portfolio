import { Component, HostListener } from '@angular/core';
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

  constructor(public svc: PortfolioService) {}

  @HostListener('wheel', ['$event'])
  onWheel(e: WheelEvent) {
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
  onTouchStart(e: TouchEvent) { this._touchY = e.touches[0].clientY; }

  @HostListener('touchend', ['$event'])
  onTouchEnd(e: TouchEvent) {
    const dy = this._touchY - e.changedTouches[0].clientY;
    if (Math.abs(dy) > 50) dy > 0 ? this.svc.next() : this.svc.prev();
  }

  private _touchY = 0;
}
