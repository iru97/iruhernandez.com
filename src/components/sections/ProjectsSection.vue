<template>
  <section id="projects">
    <div class="container">
      <div class="projects-header">
        <div class="projects-header-content">
          <h2 class="section-title">Projects</h2>
          <p class="section-description">
            A showcase of my work across web applications, 3D graphics, data visualization, and professional collaborations.
          </p>
        </div>
        <a
          href="https://github.com/iru97"
          target="_blank"
          class="view-all-link"
        >
          <i class="fab fa-github"></i>
          <span>View all on GitHub</span>
        </a>
      </div>

      <div
        class="projects-carousel"
        ref="carousel"
        @mousedown="startDrag"
        @mousemove="drag"
        @mouseup="endDrag"
        @mouseleave="endDrag"
      >
        <div
          v-for="(project, index) in infiniteProjects"
          :key="`${project.id}-${index}`"
          class="project-card"
          :class="{
            'is-center': index === centerIndex,
            [`card-${project.type}`]: true
          }"
          @click="openProject(project)"
        >
          <!-- Project Image with Overlay -->
          <div class="project-image" :class="{ 'no-image': !hasValidThumbnail(project) }">
            <!-- Logo overlay (top right) -->
            <div v-if="project.logo" class="project-logo">
              <img :src="project.logo" :alt="`${project.name} logo`" />
            </div>

            <img
              v-if="hasValidThumbnail(project)"
              :src="project.thumbnail"
              :alt="`${project.name} preview`"
              class="project-thumbnail"
              @error="handleImageError"
              loading="lazy"
            />
            <div v-else class="no-image-placeholder">
              <i class="fas fa-image"></i>
              <span>No preview available</span>
            </div>
            <div v-if="hasValidThumbnail(project)" class="image-overlay">
              <div class="overlay-content">
                <i class="fas fa-search-plus overlay-icon"></i>
                <span class="overlay-text">View Details</span>
              </div>
            </div>

            <!-- Badge Indicators -->
            <div class="project-badges">
              <!-- Project Type Badge -->
              <span v-if="project.type === 'owned'" class="badge badge-personal">
                <i class="fas fa-user"></i>
                Personal
              </span>
              <span v-else class="badge badge-professional">
                <i class="fas fa-briefcase"></i>
                Professional
              </span>
              <!-- Live Status Badge -->
              <span v-if="project.liveUrl" class="badge badge-live">
                <i class="fas fa-globe"></i>
                Live
              </span>
            </div>
          </div>

          <!-- Project Content -->
          <div class="project-content">
            <div class="project-header">
              <h3>{{ project.name }}</h3>
              <div class="project-links" @click.stop>
                <a
                  v-if="project.github"
                  :href="project.github.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="link-icon"
                  title="View on GitHub"
                >
                  <i class="fab fa-github"></i>
                </a>
                <a
                  v-if="project.liveUrl"
                  :href="project.liveUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="link-icon"
                  title="Visit live site"
                >
                  <i class="fas fa-external-link-alt"></i>
                </a>
              </div>
            </div>

            <p class="project-description">{{ project.shortDescription }}</p>

            <!-- Tech Stack Preview -->
            <div class="tech-preview">
              <span
                v-for="(tech, i) in project.techStack.slice(0, 3)"
                :key="i"
                class="tech-tag"
              >
                {{ tech }}
              </span>
              <span v-if="project.techStack.length > 3" class="tech-more">
                +{{ project.techStack.length - 3 }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Project Categories Filter (optional enhancement) -->
      <div class="projects-footer">
        <div class="project-count">
          Showing {{ allProjects.length }} projects
        </div>
      </div>
    </div>

    <!-- Project Modal -->
    <ProjectModal
      :project="selectedProject"
      :allProjects="allProjects"
      @close="closeProject"
      @navigate="navigateToProject"
    />
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useProjects } from '../../composables/useProjects';
import { useProjectNavigation } from '../../composables/useProjectNavigation';
import ProjectModal from '../ProjectModal.vue';
import type { Project } from '../../types/project';

const { allProjects, mixedProjects } = useProjects();
const { activeProject, closeProjectModal } = useProjectNavigation();

const carousel = ref<HTMLElement | null>(null);
const centerIndex = ref(0);
const isDragging = ref(false);
const startX = ref(0);
const scrollLeft = ref(0);
const selectedProject = ref<Project | null>(null);

// Sync global project navigation with local modal state
watch(activeProject, (newProject) => {
  if (newProject) {
    selectedProject.value = newProject;
  }
});

// Crear array infinito repitiendo los proyectos 5 veces para efecto loop
const infiniteProjects = computed(() => {
  return [
    ...mixedProjects.value,
    ...mixedProjects.value,
    ...mixedProjects.value,
    ...mixedProjects.value,
    ...mixedProjects.value,
  ];
});

// Modal handlers
function openProject(project: Project) {
  // Find the original project (not the repeated one)
  const originalProject = allProjects.value.find((p) => p.id === project.id);
  selectedProject.value = originalProject || null;
}

function closeProject() {
  selectedProject.value = null;
  closeProjectModal();
}

function navigateToProject(projectId: string) {
  const project = allProjects.value.find((p) => p.id === projectId);
  selectedProject.value = project || null;
}

// Check if project has valid thumbnail (not placeholder or missing)
function hasValidThumbnail(project: Project): boolean {
  return !!project.thumbnail && !project.thumbnail.includes('placeholder');
}

// Image error handler
function handleImageError(event: Event) {
  const img = event.target as HTMLImageElement;
  // Hide image if it fails to load (don't show broken placeholder)
  img.style.display = 'none';
  const parent = img.parentElement;
  if (parent && parent.classList.contains('project-image')) {
    // Keep the container but with minimal styling
    parent.style.background = '#f0f0f0';
  }
}

// Funcionalidad de arrastre (drag)
const startDrag = (event: MouseEvent) => {
  if (!carousel.value) return;
  isDragging.value = true;
  startX.value = event.pageX - carousel.value.offsetLeft;
  scrollLeft.value = carousel.value.scrollLeft;
  carousel.value.style.scrollBehavior = 'auto';
};

const drag = (event: MouseEvent) => {
  if (!isDragging.value || !carousel.value) return;
  event.preventDefault();
  const x = event.pageX - carousel.value.offsetLeft;
  const walk = (x - startX.value) * 2;
  carousel.value.scrollLeft = scrollLeft.value - walk;
};

const endDrag = () => {
  if (carousel.value) {
    isDragging.value = false;
    carousel.value.style.scrollBehavior = 'smooth';
  }
};

// Centrar el carousel al inicio (empezar en el set del medio)
onMounted(() => {
  if (carousel.value) {
    const cardWidth =
      carousel.value.querySelector('.project-card')?.clientWidth || 0;
    const gap = 24; // 1.5rem = 24px
    const singleSetWidth = (cardWidth + gap) * mixedProjects.value.length;
    const startPosition = singleSetWidth * 2; // Empezar en el tercer set (índice 2)

    setTimeout(() => {
      if (carousel.value) {
        carousel.value.scrollLeft = startPosition;
      }
    }, 100);

    let isResetting = false;
    let scrollTimeout: number;

    // Detectar cuando llegas al final o inicio para hacer loop
    const handleInfiniteScroll = () => {
      if (!carousel.value || isResetting) return;

      const maxScroll =
        carousel.value.scrollWidth - carousel.value.clientWidth;
      const currentScroll = carousel.value.scrollLeft;

      // Si estás en el primer set (cerca del inicio absoluto)
      if (currentScroll < singleSetWidth) {
        isResetting = true;
        carousel.value.style.scrollBehavior = 'auto';
        carousel.value.scrollLeft = currentScroll + singleSetWidth * 2;
        setTimeout(() => {
          isResetting = false;
        }, 50);
      }
      // Si estás en el último set (cerca del final absoluto)
      else if (currentScroll > singleSetWidth * 3) {
        isResetting = true;
        carousel.value.style.scrollBehavior = 'auto';
        carousel.value.scrollLeft = currentScroll - singleSetWidth * 2;
        setTimeout(() => {
          isResetting = false;
        }, 50);
      }
    };

    carousel.value.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = window.setTimeout(handleInfiniteScroll, 50);
    });

    // Agregar listener del wheel con mejor compatibilidad
    const wheelHandler = (e: WheelEvent) => {
      if (!carousel.value) return;

      // Solo interceptar si es scroll vertical (no horizontal del trackpad)
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        e.stopPropagation();

        // Aplicar scroll horizontal suave
        carousel.value.scrollBy({
          left: e.deltaY,
          behavior: 'auto',
        });
      }
    };

    carousel.value.addEventListener('wheel', wheelHandler, { passive: false });
  }
});
</script>

<style scoped>
.projects-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  gap: 2rem;
}

.projects-header-content {
  flex: 1;
  max-width: 70%;
}

.section-title {
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 1.2rem 0;
}

.section-description {
  color: var(--text-secondary);
  margin: 0;
  font-size: 1rem;
  line-height: 1.6;
}

.view-all-link {
  font-size: 0.95rem;
  color: var(--primary);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.2rem;
  border: 1.5px solid var(--primary);
  border-radius: 6px;
  transition: all 0.3s ease;
  font-weight: 500;
  white-space: nowrap;
  flex-shrink: 0;
}

.view-all-link:hover {
  background-color: var(--primary);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(25, 114, 120, 0.3);
}

.projects-carousel {
  display: flex;
  gap: 1.5rem;
  overflow-x: auto;
  overflow-y: hidden;
  scroll-behavior: smooth;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  padding: 0 0 2rem;
  margin: 0 calc(-50vw + 50%);
  padding-left: calc(50vw - 50%);
  padding-right: calc(50vw - 50%);
  cursor: grab;
  user-select: none;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.projects-carousel:active {
  cursor: grabbing;
  scroll-snap-type: none;
}

.projects-carousel::-webkit-scrollbar {
  display: none;
}

/* Project Card */
.project-card {
  flex: 0 0 420px;
  width: 420px;
  min-width: 420px;
  max-width: 420px;
  height: 395px; /* Altura aumentada para acomodar tech badges en 2 líneas */
  scroll-snap-align: center;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: 0.7;
  transform: scale(0.92);
  display: flex;
  flex-direction: column;
  background-color: var(--bg-primary);
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  position: relative;
}

/* Different styles for project types */
.project-card.card-owned {
  border: 4px solid transparent;
  border-top-color: transparent;
}

.project-card.card-collaborative {
  border: 4px solid rgba(196, 69, 54, 0.4);
}

.project-card.card-owned:hover,
.project-card.card-owned.is-center {
  border-color: var(--primary);
}

.project-card.card-collaborative:hover,
.project-card.card-collaborative.is-center {
  border-color: var(--accent);
}

.project-card.is-center,
.project-card:hover {
  opacity: 1;
  transform: scale(1);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1);
}

/* Project Image */
.project-image {
  position: relative;
  width: 100%;
  height: 180px;
  flex-shrink: 0;
  overflow: hidden;
  background: #f8f9fa;
  display: flex;
  align-items: flex-start;
  justify-content: center;
}

.dark-theme .project-image {
  background: #1a1a1a;
}

.project-image.no-image {
  display: flex;
  align-items: center;
  justify-content: center;
}

.no-image-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  color: var(--text-secondary);
  opacity: 0.5;
}

.no-image-placeholder i {
  font-size: 3rem;
}

.no-image-placeholder span {
  font-size: 0.9rem;
  font-weight: 500;
}

/* Project Logo (top right corner) */
.project-logo {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 70px;
  height: 70px;
  background: rgba(255, 255, 255, 0.98);
  border-radius: 10px;
  padding: 0.6rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.dark-theme .project-logo {
  background: rgba(20, 20, 20, 0.98);
  border-color: rgba(255, 255, 255, 0.1);
}

.project-logo img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.project-thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top center;
  transition: transform 0.4s ease;
}

.project-card:hover .project-thumbnail {
  transform: scale(1.05);
}

/* Image Overlay */
.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.1) 0%,
    rgba(0, 0, 0, 0.6) 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.project-card:hover .image-overlay {
  opacity: 1;
}

.overlay-content {
  text-align: center;
  color: white;
  transform: translateY(10px);
  transition: transform 0.3s ease;
}

.project-card:hover .overlay-content {
  transform: translateY(0);
}

.overlay-icon {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.overlay-text {
  display: block;
  font-weight: 600;
  font-size: 1.1rem;
}

/* Badges */
.project-badges {
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  z-index: 1;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.badge-personal {
  background-color: rgba(25, 114, 120, 0.95);
  color: white;
  font-weight: 700;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  padding: 0.45rem 0.85rem;
  font-size: 0.82rem;
}

.badge-professional {
  background-color: rgba(196, 69, 54, 0.95);
  color: white;
  font-weight: 700;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  padding: 0.45rem 0.85rem;
  font-size: 0.82rem;
}

.badge-live {
  background-color: #10b981;
  color: white;
  font-weight: 700;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  padding: 0.45rem 0.85rem;
  font-size: 0.82rem;
}

/* Content */
.project-content {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 1rem;
  gap: 0.75rem;
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.project-header h3 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.3;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.project-links {
  display: flex;
  gap: 0.75rem;
  flex-shrink: 0;
}

.link-icon {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  text-decoration: none;
  font-size: 1.1rem;
  transition: all 0.3s ease;
}

.link-icon:hover {
  background-color: var(--primary);
  color: white;
  transform: scale(1.1);
}

.project-description {
  margin: 0;
  font-size: 1rem;
  line-height: 1.6;
  color: var(--text-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  flex: 0 0 auto;
}

/* Tech Preview */
.tech-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
}

.tech-tag {
  padding: 0.4rem 0.8rem;
  background-color: #e0f2f1;
  color: #00695c;
  border: 1.5px solid #00897b;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 700;
  white-space: nowrap;
  letter-spacing: 0.3px;
}

.dark-theme .tech-tag {
  background-color: rgba(0, 150, 136, 0.15);
  color: #4db6ac;
  border-color: #00897b;
}

.tech-more {
  padding: 0.4rem 0.8rem;
  background-color: #f5f5f5;
  color: #616161;
  border: 1.5px solid #9e9e9e;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.3px;
}

.dark-theme .tech-more {
  background-color: rgba(158, 158, 158, 0.15);
  color: #bdbdbd;
  border-color: #757575;
}

/* Footer */
.projects-footer {
  margin-top: 2rem;
  text-align: center;
}

.project-count {
  color: var(--text-secondary);
  font-size: 0.95rem;
  font-weight: 500;
}

/* Responsive */
@media (max-width: 1200px) {
  .project-card {
    flex: 0 0 380px;
    width: 380px;
    min-width: 380px;
    max-width: 380px;
    height: 385px;
  }

  .project-image {
    height: 160px;
  }
}

@media (max-width: 768px) {
  .projects-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .projects-header-content {
    max-width: 100%;
  }

  .section-title {
    font-size: 1.8rem;
  }

  .view-all-link {
    align-self: flex-start;
    font-size: 0.85rem;
    padding: 0.5rem 1rem;
  }

  .projects-carousel {
    padding: 1rem 1rem 2rem;
    margin: 0 -1rem;
  }

  .project-card {
    flex: 0 0 300px;
    width: 300px;
    min-width: 300px;
    max-width: 300px;
    height: 375px;
  }

  .project-image {
    height: 140px;
  }

  .project-logo {
    width: 40px;
    height: 40px;
    padding: 0.35rem;
  }

  .project-logo {
    width: 40px;
    height: 40px;
    padding: 0.35rem;
  }

  .project-content {
    padding: 0.85rem;
    gap: 0.5rem;
  }

  .project-header h3 {
    font-size: 1.15rem;
  }

  .project-description {
    font-size: 0.85rem;
  }

  .tech-tag,
  .tech-more {
    font-size: 0.7rem;
    padding: 0.3rem 0.6rem;
    font-weight: 700;
  }
}
</style>
