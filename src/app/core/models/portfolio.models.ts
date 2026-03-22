export interface Project {
  id: string;
  index: string;
  title: string;
  category: string;
  year: string;
  stack: string[];
  description: string;
  role: string;
  link?: string;
}

export interface Skill {
  name: string;
  level: number;
  category: 'frontend' | 'backend' | 'cloud' | 'tools' | 'data';
}

export interface Scene {
  id: number;
  slug: string;
  label: string;
}
