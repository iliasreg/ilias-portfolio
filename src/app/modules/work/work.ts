import { Component } from '@angular/core';
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

  constructor(public svc: PortfolioService) {}

  toggle(p: Project) {
    this.openId = this.openId === p.id ? null : p.id;
  }

  trackById(_: number, p: Project) { return p.id; }
}
