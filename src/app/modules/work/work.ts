import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioService } from '../../core/services/portfolio.service';
import { Project } from '../../core/models/portfolio.models';

@Component({
  selector: 'app-work',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './work.html',
  styleUrl: './work.scss',
})
export class WorkComponent {
  openId: string | null = null;
  private _wheelLock = false;

  constructor(public svc: PortfolioService) {}

  @HostListener('wheel', ['$event'])
  onWheel(e: WheelEvent) {
    const archive = (e.target as HTMLElement).closest('.work') ?? e.currentTarget as HTMLElement;
    const atTop = archive.scrollTop <= 0;
    const atBottom = archive.scrollTop + archive.clientHeight >= archive.scrollHeight - 1;
    const leaving = (e.deltaY < 0 && atTop) || (e.deltaY > 0 && atBottom);

    e.stopPropagation();
    if (!leaving || this._wheelLock) return;

    e.preventDefault();
    this._wheelLock = true;
    setTimeout(() => this._wheelLock = false, 900);
    e.deltaY > 0 ? this.svc.next() : this.svc.prev();
  }

  get selectedProject(): Project | undefined {
    return this.svc.projects().find(p => p.id === this.openId);
  }

  toggle(p: Project) {
    this.openId = this.openId === p.id ? null : p.id;
    if (this.openId !== null) {
      setTimeout(() => document.querySelector<HTMLElement>('.work')?.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior }));
    }
  }

  repoLabel(url?: string): string {
    return url ? url.replace(/^https?:\/\/(www\.)?github\.com\//, '') : '';
  }

  trackById(_: number, p: Project) { return p.id; }
}
