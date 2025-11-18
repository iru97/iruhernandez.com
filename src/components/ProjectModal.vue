<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="modal-overlay" @click="handleOverlayClick">
        <div class="modal-container" @click.stop>
          <!-- Close Button -->
          <button class="modal-close" @click="close" aria-label="Close modal">
            <i class="fas fa-times"></i>
          </button>

          <!-- Modal Content -->
          <div class="modal-content">
            <!-- Header -->
            <div class="modal-header">
              <div class="modal-header-content">
                <div class="header-top">
                  <div>
                    <div class="project-type-badge" :class="`badge-${project?.type}`">
                      {{ getTypeBadgeText(project?.type) }}
                    </div>
                    <h2 class="modal-title">{{ project?.name }}</h2>
                    <p class="modal-subtitle">{{ project?.shortDescription }}</p>
                  </div>
                  <!-- Full Logo (if available) -->
                  <img
                    v-if="project?.logoFull"
                    :src="project.logoFull"
                    :alt="`${project.name} logo`"
                    class="header-logo"
                  />
                </div>
              </div>

              <!-- Quick Actions -->
              <div class="modal-actions">
                <a
                  v-if="project?.liveUrl"
                  :href="project.liveUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="action-button primary"
                >
                  <i class="fas fa-external-link-alt"></i>
                  <span>Visit Site</span>
                </a>
                <a
                  v-if="project?.github"
                  :href="project.github.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="action-button secondary"
                >
                  <i class="fab fa-github"></i>
                  <span>View Code</span>
                </a>
              </div>
            </div>

            <!-- Image Gallery (only show if images exist and are not placeholder) -->
            <div v-if="hasValidImages" class="modal-gallery">
              <div class="gallery-main">
                <img
                  :src="currentImage.url"
                  :alt="currentImage.alt"
                  class="gallery-image"
                />
              </div>
              <div v-if="project.images && project.images.length > 1" class="gallery-thumbnails">
                <button
                  v-for="(image, index) in project.images"
                  :key="index"
                  class="thumbnail"
                  :class="{ active: currentImageIndex === index }"
                  @click="currentImageIndex = index"
                >
                  <img :src="image.url" :alt="image.alt" />
                </button>
              </div>
            </div>

            <!-- Details Grid -->
            <div class="modal-details">
              <!-- Left Column: Description & Features -->
              <div class="details-main">
                <!-- Description -->
                <section class="detail-section">
                  <h3 class="section-title">
                    <i class="fas fa-info-circle"></i>
                    About
                  </h3>
                  <p class="description-text">{{ project?.fullDescription }}</p>
                </section>

                <!-- Role & Contribution (for collaborative projects) -->
                <section v-if="project?.role" class="detail-section">
                  <h3 class="section-title">
                    <i class="fas fa-user-tie"></i>
                    My Role
                  </h3>
                  <p class="role-badge">{{ project.role }}</p>
                  <p v-if="project.contribution" class="contribution-text">
                    {{ project.contribution }}
                  </p>
                  <div v-if="project.teamSize || project.duration" class="meta-info">
                    <span v-if="project.teamSize" class="meta-item">
                      <i class="fas fa-users"></i>
                      Team of {{ project.teamSize }}
                    </span>
                    <span v-if="project.duration" class="meta-item">
                      <i class="fas fa-clock"></i>
                      {{ project.duration }}
                    </span>
                  </div>
                </section>

                <!-- Features -->
                <section v-if="project?.features && project.features.length > 0" class="detail-section">
                  <h3 class="section-title">
                    <i class="fas fa-star"></i>
                    Key Features
                  </h3>
                  <ul class="features-list">
                    <li v-for="(feature, index) in project.features" :key="index">
                      <i class="fas fa-check-circle"></i>
                      <span>{{ feature }}</span>
                    </li>
                  </ul>
                </section>

                <!-- Additional Links -->
                <section v-if="project?.additionalLinks && project.additionalLinks.length > 0" class="detail-section">
                  <h3 class="section-title">
                    <i class="fas fa-link"></i>
                    Links
                  </h3>
                  <div class="links-grid">
                    <a
                      v-for="(link, index) in project.additionalLinks"
                      :key="index"
                      :href="link.url"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="link-item"
                    >
                      <i :class="link.icon"></i>
                      <span>{{ link.label }}</span>
                    </a>
                  </div>
                </section>
              </div>

              <!-- Right Column: Tech & Meta -->
              <div class="details-sidebar">
                <!-- Tech Stack -->
                <section v-if="project?.techStack && project.techStack.length > 0" class="detail-section">
                  <h3 class="section-title">
                    <i class="fas fa-code"></i>
                    Tech Stack
                  </h3>
                  <div class="tech-stack">
                    <span v-for="tech in project.techStack" :key="tech" class="tech-badge">
                      {{ tech }}
                    </span>
                  </div>
                </section>

                <!-- Tags -->
                <section v-if="project?.tags && project.tags.length > 0" class="detail-section">
                  <h3 class="section-title">
                    <i class="fas fa-tags"></i>
                    Tags
                  </h3>
                  <div class="tags-list">
                    <span v-for="tag in project.tags" :key="tag" class="tag">
                      {{ tag }}
                    </span>
                  </div>
                </section>

                <!-- GitHub Stats -->
                <section v-if="project?.github" class="detail-section">
                  <h3 class="section-title">
                    <i class="fab fa-github"></i>
                    Repository Stats
                  </h3>
                  <div class="github-stats">
                    <div class="stat-item">
                      <i class="fas fa-star"></i>
                      <span class="stat-value">{{ project.github.stars }}</span>
                      <span class="stat-label">Stars</span>
                    </div>
                    <div class="stat-item">
                      <i class="fas fa-code-branch"></i>
                      <span class="stat-value">{{ project.github.forks }}</span>
                      <span class="stat-label">Forks</span>
                    </div>
                    <div v-if="project.github.language" class="stat-item">
                      <i class="fas fa-code"></i>
                      <span class="stat-value">{{ project.github.language }}</span>
                      <span class="stat-label">Language</span>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>

          <!-- Navigation Arrows -->
          <button
            v-if="hasPrevious"
            class="nav-arrow nav-prev"
            @click="navigatePrevious"
            aria-label="Previous project"
          >
            <i class="fas fa-chevron-left"></i>
          </button>
          <button
            v-if="hasNext"
            class="nav-arrow nav-next"
            @click="navigateNext"
            aria-label="Next project"
          >
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import type { Project } from '../types/project';

interface Props {
  project: Project | null;
  allProjects?: Project[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
  close: [];
  navigate: [projectId: string];
}>();

const isOpen = computed(() => !!props.project);
const currentImageIndex = ref(0);

// Check if project has valid images (not placeholder)
const hasValidImages = computed(() => {
  if (!props.project?.images || props.project.images.length === 0) return false;
  const firstImage = props.project.images[0];
  return firstImage && !firstImage.url.includes('placeholder');
});

const currentImage = computed(() => {
  if (!props.project?.images || props.project.images.length === 0) {
    return { url: '/projects/placeholder.jpg', alt: 'No image available', type: 'screenshot' as const };
  }
  return props.project.images[currentImageIndex.value];
});

// Navigation
const currentProjectIndex = computed(() => {
  if (!props.project || !props.allProjects) return -1;
  return props.allProjects.findIndex((p) => p.id === props.project!.id);
});

const hasPrevious = computed(() => currentProjectIndex.value > 0);
const hasNext = computed(() => {
  return currentProjectIndex.value >= 0 && currentProjectIndex.value < (props.allProjects?.length || 0) - 1;
});

function navigatePrevious() {
  if (hasPrevious.value && props.allProjects) {
    emit('navigate', props.allProjects[currentProjectIndex.value - 1].id);
  }
}

function navigateNext() {
  if (hasNext.value && props.allProjects) {
    emit('navigate', props.allProjects[currentProjectIndex.value + 1].id);
  }
}

// Close handlers
function close() {
  emit('close');
}

function handleOverlayClick(event: MouseEvent) {
  if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
    close();
  }
}

function handleEscape(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    close();
  }
}

function handleArrowKeys(event: KeyboardEvent) {
  if (event.key === 'ArrowLeft' && hasPrevious.value) {
    navigatePrevious();
  } else if (event.key === 'ArrowRight' && hasNext.value) {
    navigateNext();
  }
}

// Reset image index when project changes
watch(() => props.project, () => {
  currentImageIndex.value = 0;
});

// Lock body scroll when modal is open
watch(isOpen, (open) => {
  if (open) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
});

// Keyboard event listeners
onMounted(() => {
  document.addEventListener('keydown', handleEscape);
  document.addEventListener('keydown', handleArrowKeys);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape);
  document.removeEventListener('keydown', handleArrowKeys);
  document.body.style.overflow = '';
});

// Utilities
function getTypeBadgeText(type?: 'owned' | 'contributed' | 'collaborative') {
  const labels = {
    owned: 'Personal Project',
    contributed: 'Contribution',
    collaborative: 'Professional',
  };
  return type ? labels[type] : '';
}

function handleImageError(event: Event) {
  const img = event.target as HTMLImageElement;
  img.src = '/projects/placeholder.jpg';
}
</script>

<style scoped>
/* Modal Overlay & Container */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  overflow-y: auto;
}

.modal-container {
  position: relative;
  background-color: var(--bg-primary);
  border-radius: var(--border-radius-lg);
  max-width: 1100px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  margin: 0 60px; /* Espacio para las flechas */
}

.modal-content {
  padding: 2rem;
}

/* Close Button */
.modal-close {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  width: 40px;
  height: 40px;
  border: none;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  transition: all 0.3s ease;
  z-index: 10;
}

.modal-close:hover {
  background-color: var(--accent);
  transform: rotate(90deg);
}

/* Header */
.modal-header {
  margin-bottom: 1.5rem;
}

.modal-header-content {
  margin-bottom: 1rem;
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;
}

.header-logo {
  max-height: 80px;
  max-width: 250px;
  object-fit: contain;
  flex-shrink: 0;
}

.project-type-badge {
  display: inline-block;
  padding: 0.5rem 1.25rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border: 2px solid;
}

.badge-owned {
  background-color: rgba(25, 114, 120, 0.15);
  color: var(--primary);
  border-color: var(--primary);
}

.badge-collaborative {
  background-color: rgba(196, 69, 54, 0.15);
  color: var(--accent);
  border-color: var(--accent);
}

.dark-theme .badge-owned {
  background-color: rgba(25, 114, 120, 0.2);
  color: #4db6ac;
  border-color: #4db6ac;
}

.dark-theme .badge-collaborative {
  background-color: rgba(196, 69, 54, 0.2);
  color: #ef9a9a;
  border-color: #ef9a9a;
}

.badge-contributed {
  background-color: rgba(40, 61, 59, 0.2);
  color: var(--secondary);
}

.modal-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 0.75rem 0;
  line-height: 1.2;
}

.modal-subtitle {
  font-size: 1.25rem;
  color: var(--text-secondary);
  margin: 0;
}

/* Actions */
.modal-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.action-button {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1.75rem;
  border-radius: var(--border-radius);
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.action-button.primary {
  background-color: var(--primary);
  color: white;
}

.action-button.primary:hover {
  background-color: #156166;
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(25, 114, 120, 0.3);
}

.action-button.secondary {
  background-color: transparent;
  color: var(--text-primary);
  border-color: var(--border-color);
}

.action-button.secondary:hover {
  border-color: var(--primary);
  color: var(--primary);
  transform: translateY(-2px);
}

/* Gallery */
.modal-gallery {
  margin-bottom: 1.5rem;
}

.gallery-main {
  width: 100%;
  height: 400px;
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  background-color: var(--bg-secondary);
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.gallery-image {
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  object-fit: contain;
}

.gallery-thumbnails {
  display: flex;
  gap: 0.75rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
}

.thumbnail {
  flex-shrink: 0;
  width: 100px;
  height: 70px;
  border-radius: var(--border-radius);
  overflow: hidden;
  border: 3px solid transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  background: none;
  padding: 0;
}

.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top center;
}

.thumbnail:hover {
  border-color: var(--primary);
  opacity: 0.8;
}

.thumbnail.active {
  border-color: var(--primary);
}

/* Details Grid */
.modal-details {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 2rem;
}

.detail-section {
  margin-bottom: 1.5rem;
}

.detail-section:last-child {
  margin-bottom: 0;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0 0 1rem 0;
  color: var(--text-primary);
}

.section-title i {
  color: var(--primary);
  font-size: 1.1rem;
}

.description-text {
  font-size: 1.1rem;
  line-height: 1.8;
  color: var(--text-secondary);
  margin: 0;
}

/* Role & Contribution */
.role-badge {
  display: inline-block;
  background-color: rgba(25, 114, 120, 0.15);
  color: var(--primary);
  padding: 0.5rem 1.25rem;
  border-radius: var(--border-radius);
  font-weight: 600;
  margin-bottom: 1rem;
}

.contribution-text {
  font-size: 1.05rem;
  line-height: 1.7;
  color: var(--text-secondary);
  margin-bottom: 1rem;
}

.meta-info {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-secondary);
  font-size: 0.95rem;
}

.meta-item i {
  color: var(--primary);
}

/* Features List */
.features-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 0.875rem;
}

.features-list li {
  display: flex;
  align-items: flex-start;
  gap: 0.875rem;
  font-size: 1.05rem;
  line-height: 1.6;
  color: var(--text-secondary);
}

.features-list i {
  color: var(--primary);
  margin-top: 0.3rem;
  flex-shrink: 0;
}

/* Links Grid */
.links-grid {
  display: grid;
  gap: 0.75rem;
}

.link-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background-color: var(--bg-secondary);
  border-radius: var(--border-radius);
  text-decoration: none;
  color: var(--text-primary);
  transition: all 0.3s ease;
  font-weight: 500;
}

.link-item:hover {
  background-color: var(--primary);
  color: white;
  transform: translateX(4px);
}

.link-item i {
  font-size: 1.1rem;
}

/* Tech Stack */
.tech-stack {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.tech-badge {
  padding: 0.6rem 1.1rem;
  background-color: rgba(25, 114, 120, 0.12);
  color: var(--text-primary);
  border-radius: var(--border-radius);
  font-size: 0.95rem;
  font-weight: 500;
  border: 1px solid rgba(25, 114, 120, 0.2);
}

/* Tags */
.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  padding: 0.5rem 0.95rem;
  background-color: var(--bg-secondary);
  color: var(--text-secondary);
  border-radius: 15px;
  font-size: 0.875rem;
}

/* GitHub Stats */
.github-stats {
  display: grid;
  gap: 1rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem;
  background-color: var(--bg-secondary);
  border-radius: var(--border-radius);
}

.stat-item i {
  color: var(--primary);
  font-size: 1.25rem;
}

.stat-value {
  font-weight: 700;
  font-size: 1.15rem;
  color: var(--text-primary);
  margin-right: 0.25rem;
}

.stat-label {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

/* Navigation Arrows */
.nav-arrow {
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  width: 50px;
  height: 50px;
  border: none;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  transition: all 0.3s ease;
  z-index: 10000;
  backdrop-filter: blur(4px);
}

.nav-arrow:hover {
  background-color: var(--primary);
  transform: translateY(-50%) scale(1.1);
}

.nav-prev {
  left: 1rem;
}

.nav-next {
  right: 1rem;
}

/* Transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transition: transform 0.3s ease;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.95);
}

/* Responsive */
@media (max-width: 1024px) {
  .modal-details {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .modal-container {
    margin: 0 50px;
  }

  .nav-arrow {
    width: 44px;
    height: 44px;
    font-size: 1.1rem;
  }
}

@media (max-width: 768px) {
  .modal-overlay {
    padding: 0;
  }

  .modal-container {
    max-height: 100vh;
    border-radius: 0;
    margin: 0;
  }

  .modal-content {
    padding: 1.5rem 1rem;
  }

  .modal-header {
    margin-bottom: 1rem;
  }

  .modal-title {
    font-size: 1.75rem;
  }

  .modal-subtitle {
    font-size: 1rem;
  }

  .header-top {
    flex-direction: column;
    gap: 1rem;
  }

  .header-logo {
    max-height: 60px;
    max-width: 200px;
    align-self: flex-start;
  }

  .gallery-main {
    height: 250px;
  }

  .modal-actions {
    flex-direction: column;
  }

  .action-button {
    width: 100%;
    justify-content: center;
  }

  .nav-arrow {
    display: none;
  }

  .detail-section {
    margin-bottom: 1.25rem;
  }

  .modal-details {
    gap: 1rem;
  }
}
</style>
