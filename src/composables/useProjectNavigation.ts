import { ref } from 'vue';
import type { Project } from '../types/project';

// Global state for project modal navigation
const activeProject = ref<Project | null>(null);
const isNavigatingToProject = ref(false);

export function useProjectNavigation() {
  /**
   * Opens a project modal and optionally scrolls to projects section
   * @param project - The project to display
   * @param scrollToSection - Whether to scroll to projects section first
   */
  function openProjectModal(project: Project, scrollToSection = true) {
    if (scrollToSection) {
      // Scroll to projects section
      const projectsSection = document.getElementById('projects');
      if (projectsSection) {
        isNavigatingToProject.value = true;
        projectsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // Wait for scroll to complete before opening modal
        setTimeout(() => {
          activeProject.value = project;
          isNavigatingToProject.value = false;
        }, 800);
      } else {
        activeProject.value = project;
      }
    } else {
      activeProject.value = project;
    }
  }

  /**
   * Opens a project modal by project ID
   * @param projectId - The ID of the project to display
   * @param projects - Array of all projects
   * @param scrollToSection - Whether to scroll to projects section first
   */
  function openProjectById(projectId: string, projects: Project[], scrollToSection = true) {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      openProjectModal(project, scrollToSection);
    }
  }

  /**
   * Closes the project modal
   */
  function closeProjectModal() {
    activeProject.value = null;
  }

  return {
    activeProject,
    isNavigatingToProject,
    openProjectModal,
    openProjectById,
    closeProjectModal,
  };
}
