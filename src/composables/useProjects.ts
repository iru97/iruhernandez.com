import { ref, computed } from 'vue';
import type { Project, ProjectsDatabase } from '../types/project';
import projectsData from '../data/projects.json';

export function useProjects() {
  const database = projectsData as ProjectsDatabase;
  const allProjects = ref<Project[]>(database.projects);

  const featuredProjects = computed(() =>
    allProjects.value.filter((p) => p.featured)
  );

  const ownedProjects = computed(() =>
    allProjects.value.filter((p) => p.type === 'owned')
  );

  const collaborativeProjects = computed(() =>
    allProjects.value.filter((p) => p.type === 'collaborative')
  );

  const getProjectById = (id: string): Project | undefined => {
    return allProjects.value.find((p) => p.id === id);
  };

  const getProjectsByCategory = (category: string): Project[] => {
    return allProjects.value.filter((p) => p.category === category);
  };

  const getProjectsByTag = (tag: string): Project[] => {
    return allProjects.value.filter((p) => p.tags.includes(tag));
  };

  // Mixed projects: intelligently interleaves owned and collaborative projects
  // Prioritizes featured projects and distributes types evenly
  const mixedProjects = computed(() => {
    const owned = [...ownedProjects.value];
    const collaborative = [...collaborativeProjects.value];
    const result: Project[] = [];

    // Interleave with ratio: ~2 owned for every 1 collaborative
    // This ensures collaborative projects are visible without overwhelming
    let ownedIndex = 0;
    let collabIndex = 0;
    let counter = 0;

    while (ownedIndex < owned.length || collabIndex < collaborative.length) {
      // Add 2 owned projects
      if (ownedIndex < owned.length) {
        result.push(owned[ownedIndex++]);
      }
      if (ownedIndex < owned.length && counter % 3 === 0) {
        result.push(owned[ownedIndex++]);
      }

      // Add 1 collaborative project
      if (collabIndex < collaborative.length) {
        result.push(collaborative[collabIndex++]);
      }

      counter++;
    }

    return result;
  });

  return {
    allProjects,
    featuredProjects,
    ownedProjects,
    collaborativeProjects,
    mixedProjects,
    getProjectById,
    getProjectsByCategory,
    getProjectsByTag,
    databaseVersion: database.version,
    lastUpdated: database.lastUpdated,
  };
}
