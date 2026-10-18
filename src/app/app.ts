import { Component, ElementRef, afterNextRender, DestroyRef, inject } from '@angular/core';
import { PortfolioService } from './core/services/portfolio.service';
import { initializeCut } from './cut-browser';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  readonly svc = inject(PortfolioService);
  private readonly root = inject(ElementRef<HTMLElement>);
  private readonly destroy = inject(DestroyRef);
  readonly sides = [7, 58, 18, 61, 9, 54, 16, 60];

  constructor() {
    afterNextRender(() => {
      const cleanup = initializeCut(this.root.nativeElement);
      this.destroy.onDestroy(cleanup);
    });
  }

  safeLink(value: string | undefined): string | null {
    if (!value) return null;
    try {
      const url = new URL(value);
      return ['https:', 'http:'].includes(url.protocol) ? url.href : null;
    } catch { return null; }
  }
}
