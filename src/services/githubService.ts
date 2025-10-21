export interface GitHubRepo {
  name: string;
  description: string;
  html_url: string;
  homepage: string | null;
  topics: string[];
  stargazers_count: number;
  updated_at: string;
  fork: boolean;
}

export interface ProjectCard {
  name: string;
  description: string;
  tags: string[];
  icon: string;
  github?: string;
  githubTooltip?: string;
  live?: string;
}

export async function fetchGitHubRepos(username: string): Promise<GitHubRepo[]> {
  const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
  if (!response.ok) {
    throw new Error('Failed to fetch GitHub repos');
  }
  return response.json();
}

export function transformRepoToProject(repo: GitHubRepo): ProjectCard {
  return {
    name: repo.name,
    description: repo.description || 'No description available',
    tags: repo.topics.slice(0, 3),
    icon: 'fas fa-code',
    github: repo.html_url,
    live: repo.homepage || undefined
  };
}

export function getFeaturedProjects(repos: GitHubRepo[]): ProjectCard[] {
  const featured = ['datosenabierto.es', 'advanced-typescript-examples', 'three-portfolio'];
  
  return repos
    .filter(repo => !repo.fork && featured.includes(repo.name))
    .sort((a, b) => {
      const aIndex = featured.indexOf(a.name);
      const bIndex = featured.indexOf(b.name);
      return aIndex - bIndex;
    })
    .map(transformRepoToProject);
}

export function getAllProjects(repos: GitHubRepo[]): ProjectCard[] {
  return repos
    .filter(repo => !repo.fork && repo.description)
    .sort((a, b) => b.stargazers_count - a.stargazers_count || new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .map(transformRepoToProject);
}

export async function getFeaturedProjectsFromGitHub(username: string): Promise<ProjectCard[]> {
  const repos = await fetchGitHubRepos(username);
  return getFeaturedProjects(repos);
}

