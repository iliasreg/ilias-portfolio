import { Injectable, signal, computed, WritableSignal } from '@angular/core';
import { Project, Scene, Skill } from '../models/portfolio.models';
import { HttpClient } from '@angular/common/http';

function isProject(value: unknown): value is Project {
  if (!value || typeof value !== 'object') return false;
  const item = value as Record<string, unknown>;
  return ['id', 'index', 'title', 'category', 'year', 'description'].every(key => typeof item[key] === 'string')
    && Array.isArray(item['stack']) && item['stack'].every((tag: unknown) => typeof tag === 'string')
    && ['github', 'link'].every(key => item[key] === undefined || typeof item[key] === 'string');
}

@Injectable({ providedIn: 'root' })
export class PortfolioService {

  private _scene = signal<number>(0);

  currentScene = this._scene.asReadonly();

  canGoNext = computed(() => this._scene() < this.scenes.length - 1);
  canGoPrev = computed(() => this._scene() > 0);

  readonly scenes: Scene[] = [
    { id: 0, slug: 'home',    label: 'HOME'    },
    { id: 1, slug: 'work',    label: 'WORK'    },
    { id: 2, slug: 'stack',   label: 'STACK'   },
    { id: 3, slug: 'contact', label: 'CONTACT' },
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

  loadProjects(): void {
    this.projectsLoading.set(true);
    this.projectsError.set(false);
    this.http.get<unknown>(this.API + '/projects').subscribe({
      next: (res) => {
        try {
          const body = res && typeof res === 'object' && 'body' in res ? res.body : res;
          const data: unknown = typeof body === 'string' ? JSON.parse(body) : body;
          if (!Array.isArray(data) || !data.every(isProject)) throw new Error('Invalid project feed');
          this.projects.set(data);
        } catch {
          this.projectsError.set(true);
        }
        this.projectsLoading.set(false);
      },
      error: () => {
        this.projectsError.set(true);
        this.projectsLoading.set(false);
      }
    });
  }

  readonly skills: Skill[] = [
    { name: 'Angular',            level: 88, category: 'frontend' },
    { name: 'TypeScript',         level: 86, category: 'frontend' },
    { name: 'JavaScript',         level: 84, category: 'frontend' },
    { name: 'SCSS / Tailwind',    level: 82, category: 'frontend' },
    { name: 'React / Next.js',    level: 80, category: 'frontend' },

    { name: 'Python / FastAPI',   level: 88, category: 'backend'  },
    { name: 'Spring Boot',        level: 82, category: 'backend'  },
    { name: 'Java',               level: 80, category: 'backend'  },
    { name: 'Go',                 level: 78, category: 'backend'  },
    { name: 'C / C++',            level: 78, category: 'backend'  },
    { name: 'Kotlin',             level: 76, category: 'backend'  },

    { name: 'Linux / Bash',       level: 86, category: 'cloud'    },
    { name: 'Docker',             level: 84, category: 'cloud'    },
    { name: 'CI/CD',              level: 80, category: 'cloud'    },
    { name: 'AWS',                level: 78, category: 'cloud'    },
    { name: 'CloudWatch',         level: 74, category: 'cloud'    },

    { name: 'Git',                level: 90, category: 'tools'    },
    { name: 'Maven / Gradle',     level: 74, category: 'tools'    },
    { name: 'Samba / Tailscale',  level: 74, category: 'tools'    },
    { name: 'Wireshark',          level: 72, category: 'tools'    },
    { name: 'ROS2 / MQTT',        level: 70, category: 'tools'    },

    { name: 'PostgreSQL',         level: 78, category: 'data'     },
    { name: 'MongoDB',            level: 76, category: 'data'     },
    { name: 'Oracle / SQL',       level: 74, category: 'data'     },
    { name: 'SQLite',             level: 72, category: 'data'     },
    { name: 'D3.js / Data Viz',   level: 80, category: 'data'     },
    { name: 'VTK / PyVista',      level: 78, category: 'data'     },
    { name: 'OpenCV',             level: 74, category: 'data'     },
  ];
}
