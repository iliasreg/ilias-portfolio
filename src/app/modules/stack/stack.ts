import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioService } from '../../core/services/portfolio.service';
import { Skill } from '../../core/models/portfolio.models';

@Component({
  selector: 'app-stack',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stack.html',
  styleUrl: './stack.scss',
})
export class StackComponent {
  skills: Skill[];
  categories = ['ALL', 'FRONTEND', 'BACKEND', 'CLOUD', 'TOOLS', 'DATA'];

  activeFilter = signal<string>('ALL');

  filtered = computed(() => {
    const f = this.activeFilter();
    return f === 'ALL'
      ? this.skills
      : this.skills.filter(s => s.category.toUpperCase() === f);
  });

  constructor(public svc: PortfolioService) {
    this.skills = svc.skills;
  }

  setFilter(f: string) { this.activeFilter.set(f); }
}
