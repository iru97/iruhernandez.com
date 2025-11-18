export type ProjectType = 'owned' | 'contributed' | 'collaborative';
export type ProjectCategory = 'web-app' | '3d-graphics' | 'mobile' | 'data-viz' | 'tool' | 'ai-platform' | 'saas';

export interface GitHubMetadata {
  url: string;
  stars: number;
  forks: number;
  language: string;
  lastUpdate: string;
  topics: string[];
}

export interface ProjectImage {
  url: string;
  alt: string;
  type: 'screenshot' | 'logo' | 'diagram' | 'demo';
}

export interface ProjectLink {
  label: string;
  url: string;
  icon: string;
}

export interface Project {
  id: string;
  name: string;
  shortDescription: string;
  fullDescription: string;

  // Visual assets
  thumbnail: string;
  logo?: string; // Logo simple/icono para cards (cuadrado)
  logoFull?: string; // Logo completo con texto para modal (puede ser rectangular)
  images: ProjectImage[];
  video?: string;

  // Metadata
  type: ProjectType;
  category: ProjectCategory;
  featured: boolean;
  tags: string[];
  techStack: string[];

  // Links
  github?: GitHubMetadata;
  liveUrl?: string;
  documentation?: string;
  additionalLinks?: ProjectLink[];

  // Detailed info
  features: string[];
  challenges?: string[];
  achievements?: string[];

  // Contribution info (for collaborative projects)
  role?: string;
  contribution?: string;
  teamSize?: number;
  duration?: string;

  // Timestamps
  startDate?: string;
  endDate?: string;
  lastUpdated: string;
}

export interface ProjectsDatabase {
  version: string;
  lastUpdated: string;
  projects: Project[];
}
