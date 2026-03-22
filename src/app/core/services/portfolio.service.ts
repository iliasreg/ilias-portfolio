import { Injectable, signal, computed, WritableSignal } from '@angular/core';
import { Project, Scene, Skill } from '../models/portfolio.models';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class PortfolioService {

  private _scene = signal<number>(0);

  currentScene = this._scene.asReadonly();

  canGoNext = computed(() => this._scene() < this.scenes.length - 1);
  canGoPrev = computed(() => this._scene() > 0);

  readonly scenes: Scene[] = [
    { id: 0, slug: 'init',    label: '_INIT'    },
    { id: 1, slug: 'work',    label: '_WORK'    },
    { id: 2, slug: 'stack',   label: '_STACK'   },
    { id: 3, slug: 'contact', label: '_CONTACT' },
  ];

  goTo(n: number): void {
    this._scene.set(Math.max(0, Math.min(n, this.scenes.length - 1)));
  }

  next(): void { if (this.canGoNext()) this.goTo(this._scene() + 1); }
  prev(): void { if (this.canGoPrev()) this.goTo(this._scene() - 1); }
  get current(): number { return this._scene(); }


  projects = signal<Project[]>([]);
  projectsLoading = signal(true);
  projectsError = signal(false);

  private readonly API = 'https://57ks7zsm79.execute-api.us-east-1.amazonaws.com/prod'; 

  constructor(private http: HttpClient){
    this.loadProjects();
  }

  private loadProjects(){
    this.http.get<any>(this.API + '/projects').subscribe({
      next: (res) => {
        const data = typeof res.body === 'string' ? JSON.parse(res.body) : res;
        this.projects.set(data);
        this.projectsLoading.set(false);
      },
      error: () => {
        this.projectsError.set(true);
        this.projectsLoading.set(false);
      }
    });
  }

  readonly skills: Skill[] = [
    // Frontend
    { name: 'Angular',        level: 88, category: 'frontend' },
    { name: 'React',          level: 75, category: 'frontend' },
    { name: 'TypeScript',     level: 85, category: 'frontend' },
    { name: 'CSS / SCSS',     level: 80, category: 'frontend' },
    // Backend
    { name: 'Spring Boot',    level: 82, category: 'backend'  },
    { name: 'Node.js',        level: 78, category: 'backend'  },
    { name: 'Python / Flask', level: 85, category: 'backend'  },
    { name: 'Java / C#',      level: 80, category: 'backend'  },
    { name: 'PostgreSQL',     level: 75, category: 'backend'  },
    // Cloud
    { name: 'Docker',         level: 82, category: 'cloud'    },
    { name: 'Kubernetes',     level: 68, category: 'cloud'    },
    { name: 'AWS',            level: 65, category: 'cloud'    },
    { name: 'CI/CD',          level: 78, category: 'cloud'    },
    // Tools
    { name: 'Git',            level: 90, category: 'tools'    },
    { name: 'Linux / Bash',   level: 85, category: 'tools'    },
    { name: 'Wireshark',      level: 72, category: 'tools'    },
    { name: 'Prometheus',     level: 65, category: 'tools'    },
    // Data
    { name: 'TensorFlow',     level: 65, category: 'data'     },
    { name: 'VTK / PyVista',  level: 75, category: 'data'     },
    { name: 'OpenCV',         level: 72, category: 'data'     },
  ];
}
