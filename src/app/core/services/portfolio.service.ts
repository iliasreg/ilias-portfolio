import { Injectable, signal, computed } from '@angular/core';
import { Project, Scene, Skill } from '../models/portfolio.models';

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


  readonly projects: Project[] = [
    {
      id: 'p01', index: '01',
      title: '4D Visualization — IFREMER',
      category: 'RESEARCH / DATA VISUALIZATION',
      year: '2026',
      stack: ['Python', 'VTK', 'PyVista', 'XSF'],
      description:
        'Development of a 4D visualization module for an instrumented platform — enabling time-based spatial tracking of sonar antennas and auxiliary sensors relative to the carrier system. Conducted during an engineering internship at IFREMER, Plouzané.',
      role: 'Engineering Intern',
    },
    {
      id: 'p02', index: '02',
      title: 'Mascaret — SysML v2 in VR',
      category: 'XR / SYSTEMS',
      year: '2025',
      stack: ['C#', 'Godot', 'Unity', 'MQTT', 'SysML v2'],
      description:
        'Implementation of SysML v2 within the Mascaret framework: XML model parsing, immersive visualization in VR environments (Godot, Unity, Unreal), and real-time property editing with MQTT-based synchronization.',
      role: 'XR Developer',
    },
    {
      id: 'p03', index: '03',
      title: 'Medical Web Platform',
      category: 'FULLSTACK / ANGULAR',
      year: '2024',
      stack: ['Angular', 'Spring Boot', 'PostgreSQL', 'EmailJS', 'WhatsApp API'],
      description:
        'Full-stack medical platform featuring a Spring Boot REST API, PostgreSQL database, and an enhanced Angular frontend. Integrated EmailJS and WhatsApp Business API for automated patient notifications.',
      role: 'Full-Stack Developer',
    },
    {
      id: 'p04', index: '04',
      title: 'Secure Self-Hosted NAS',
      category: 'INFRA / HOMELAB',
      year: '2024',
      stack: ['Raspberry Pi', 'Samba', 'Tailscale', 'Linux'],
      description:
        'Deployment of a secure personal storage server on a Raspberry Pi Zero 2 W, with Samba file sharing and remote private access via a Tailscale VPN network.',
      role: 'Personal Project',
    },
    {
      id: 'p05', index: '05',
      title: 'Round Robin HTTP Load Balancer',
      category: 'NETWORK / BACKEND',
      year: '2024',
      stack: ['Go', 'HTTP', 'Concurrency'],
      description:
        'Built a load balancer distributing HTTP requests across multiple backend services using a round-robin strategy, with concurrency handling and health-check mechanisms.',
      role: 'Technical Project',
    },
    {
      id: 'p06', index: '06',
      title: 'Robotics & Computer Vision System',
      category: 'ROBOTICS / AI',
      year: '2023',
      stack: ['ROS2', 'Python', 'OpenCV', 'STM32', 'Raspberry Pi 4'],
      description:
        'Robotic system integrating ROS2 for sensor orchestration, computer vision modules using OpenCV, and low-level communication with STM32 microcontrollers.',
      role: 'Robotics Developer',
    },
  ];


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
