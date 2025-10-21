<template>
  <section id="projects">
    <div class="container">
      <div class="projects-header">
        <div class="projects-header-content">
          <h2 class="section-title">Projects</h2>
          <p class="section-description">
            My projects reflect my passion for clean code, modern tech, and
            growth.
          </p>
        </div>
        <a
          href="https://github.com/iru97"
          target="_blank"
          class="view-all-link"
        >
          <i class="fab fa-github"></i>
          <span>View all</span>
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
          :key="`${project.name}-${index}`"
          class="project-card"
          :class="{ 'is-center': index === centerIndex }"
        >
          <div class="project-image">
            <div class="project-placeholder">
              <i :class="project.icon"></i>
            </div>
          </div>
          <div class="project-content">
            <div class="project-header">
              <h3>{{ project.name }}</h3>
              <div class="project-links">
                <a
                  v-if="project.github"
                  :href="project.github"
                  target="_blank"
                  rel="noopener noreferrer"
                  @click.stop
                >
                  <i class="fab fa-github"></i>
                </a>
                <a
                  v-if="project.live"
                  :href="project.live"
                  target="_blank"
                  rel="noopener noreferrer"
                  @click.stop
                >
                  <i class="fas fa-external-link-alt"></i>
                </a>
              </div>
            </div>
            <p>{{ project.description }}</p>
            <div class="tags">
              <span v-for="tag in project.tags" :key="tag">{{ tag }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";

const carousel = ref<HTMLElement | null>(null);
const centerIndex = ref(0);
const isDragging = ref(false);
const startX = ref(0);
const scrollLeft = ref(0);

const projects = ref([
  {
    name: "Lab - Experimental Projects",
    description:
      "Personal laboratory for testing new technologies, prototypes, and experimental features.",
    tags: ["Vue 3", "TypeScript", "Vite"],
    icon: "fas fa-flask",
    live: "https://lab.iruhernandez.com",
  },
  {
    name: "Advanced TypeScript Examples",
    description:
      "Collection of advanced TypeScript patterns and type-system features for production apps.",
    tags: ["TypeScript", "JavaScript"],
    icon: "fas fa-code",
    github: "https://github.com/iru97/advanced-typescript-examples",
    githubTooltip: "View repository: advanced-typescript-examples",
  },
  {
    name: "Datos en Abierto",
    description:
      "Vue 3 app transforming Spanish government data into accessible visualizations.",
    tags: ["Vue 3", "TypeScript", "APIs"],
    icon: "fas fa-database",
    github: "https://github.com/iru97/datosenabierto.es",
    githubTooltip: "View repository: datosenabierto.es",
    live: "https://datosenabiertos.es/",
  },
  {
    name: "Three.js Portfolio",
    description:
      "3D portfolio showcase built with Three.js featuring interactive animations and WebGL effects.",
    tags: ["Three.js", "WebGL", "JavaScript"],
    icon: "fas fa-cube",
    github: "https://github.com/iru97/three-portfolio",
    githubTooltip: "View repository: three-portfolio",
  },
  {
    name: "Vue Three.js Integration",
    description:
      "Vue components for Three.js integration with reactive bindings and scene management.",
    tags: ["Vue", "Three.js", "Components"],
    icon: "fas fa-cubes",
    github: "https://github.com/iru97/vue-threejs",
    githubTooltip: "View repository: vue-threejs",
  },
  {
    name: "Nuxt Pokemon App",
    description:
      "Server-side rendered Pokemon application built with Nuxt.js and external APIs.",
    tags: ["Nuxt", "Vue", "SSR"],
    icon: "fas fa-gamepad",
    github: "https://github.com/iru97/nuxtpokeapp",
    githubTooltip: "View repository: nuxtpokeapp",
  },
]);

// Crear array infinito repitiendo los proyectos 5 veces para efecto loop
const infiniteProjects = computed(() => {
  return [
    ...projects.value,
    ...projects.value,
    ...projects.value,
    ...projects.value,
    ...projects.value,
  ];
});

// Manejar scroll con rueda del mouse (convertir vertical a horizontal)
const handleWheel = (event: WheelEvent) => {
  if (!carousel.value) return;

  // Usar deltaY para scroll vertical y deltaX para scroll horizontal (trackpad)
  const delta =
    Math.abs(event.deltaY) > Math.abs(event.deltaX)
      ? event.deltaY
      : event.deltaX;

  // Aplicar scroll horizontal
  carousel.value.scrollLeft += delta;
};

// Funcionalidad de arrastre (drag)
const startDrag = (event: MouseEvent) => {
  if (!carousel.value) return;
  isDragging.value = true;
  startX.value = event.pageX - carousel.value.offsetLeft;
  scrollLeft.value = carousel.value.scrollLeft;
  carousel.value.style.scrollBehavior = "auto";
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
    carousel.value.style.scrollBehavior = "smooth";
  }
};

// Centrar el carousel al inicio (empezar en el set del medio)
onMounted(() => {
  if (carousel.value) {
    const cardWidth =
      carousel.value.querySelector(".project-card")?.clientWidth || 0;
    const gap = 24; // 1.5rem = 24px
    const singleSetWidth = (cardWidth + gap) * projects.value.length;
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
        carousel.value.style.scrollBehavior = "auto";
        carousel.value.scrollLeft = currentScroll + singleSetWidth * 2;
        setTimeout(() => {
          isResetting = false;
        }, 50);
      }
      // Si estás en el último set (cerca del final absoluto)
      else if (currentScroll > singleSetWidth * 3) {
        isResetting = true;
        carousel.value.style.scrollBehavior = "auto";
        carousel.value.scrollLeft = currentScroll - singleSetWidth * 2;
        setTimeout(() => {
          isResetting = false;
        }, 50);
      }
    };

    carousel.value.addEventListener("scroll", () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = window.setTimeout(handleInfiniteScroll, 50);
    });

    // Agregar listener del wheel con mejor compatibilidad para Chrome
    const wheelHandler = (e: WheelEvent) => {
      if (!carousel.value) return;

      // Solo interceptar si es scroll vertical (no horizontal del trackpad)
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        e.stopPropagation();

        // Aplicar scroll horizontal suave
        carousel.value.scrollBy({
          left: e.deltaY,
          behavior: "auto",
        });
      }
    };

    carousel.value.addEventListener("wheel", wheelHandler, { passive: false });
  }
});
</script>

<style scoped>
.projects-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
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
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.view-all-link:hover span,
.view-all-link:hover i {
  color: white;
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
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

.projects-carousel:active {
  cursor: grabbing;
  scroll-snap-type: none;
}

/* Ocultar scrollbar completamente */
.projects-carousel::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}

.project-card {
  flex: 0 0 420px;
  width: 420px;
  min-width: 420px;
  max-width: 420px;
  height: 300px;
  scroll-snap-align: center;
  transition: all 0.3s ease;
  opacity: 0.6;
  transform: scale(0.92);
  display: flex;
  flex-direction: column;
}

.project-card * {
  pointer-events: auto;
}

.project-card.is-center,
.project-card:hover {
  opacity: 1;
  transform: scale(1);
}

/* Forzar tamaño consistente en la imagen */
.project-card .project-image {
  width: 100%;
  height: 140px;
  flex-shrink: 0;
}

.project-card .project-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Contenido con altura fija */
.project-card .project-content {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 1.4rem 1.6rem;
  gap: 0.85rem;
  overflow: hidden;
}

.project-card .project-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1.3rem;
}

.project-card .project-content h3 {
  margin: 0;
  font-size: 1.45rem;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  flex: 1;
}

.project-card .project-content p {
  margin: 0;
  font-size: 1.1rem;
  line-height: 1.6;
  flex: 0 0 auto;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.project-card .tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
  align-content: flex-start;
  flex: 0 0 auto;
  margin-top: auto;
}

.project-card .tags span {
  font-size: 0.95rem;
  padding: 0.45rem 0.9rem;
  white-space: nowrap;
}

.project-card .project-links {
  display: flex;
  gap: 1rem;
  flex-shrink: 0;
}

.project-card .project-links a {
  font-size: 1.35rem;
}

/* Responsive */
@media (max-width: 1200px) {
  .project-card {
    flex: 0 0 380px;
    width: 380px;
    min-width: 380px;
    max-width: 380px;
    height: 290px;
  }

  .project-card .project-image {
    height: 130px;
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
    height: 310px;
  }

  .project-card .project-image {
    height: 110px;
  }

  .project-card .project-content {
    padding: 0.8rem 0.9rem;
    gap: 0.55rem;
  }

  .project-card .project-content h3 {
    font-size: 1rem;
  }

  .project-card .project-content p {
    font-size: 0.8rem;
  }

  .project-card .tags span {
    font-size: 0.65rem;
    padding: 0.25rem 0.5rem;
  }
}
</style>

