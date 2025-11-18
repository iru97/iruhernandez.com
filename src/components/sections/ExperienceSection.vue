<template>
  <section id="experience">
    <div class="container">
      <h2 class="section-title">Experience</h2>
      <p class="section-description">
        My career path spans diverse sectors and technologies, always focused on
        delivering robust frontend solutions.
      </p>

      <!-- Timeline Navigator -->
      <div class="timeline-navigator">
        <div class="navigator-dots">
          <button
            v-for="(job, index) in experience"
            :key="index"
            :class="['nav-dot', { active: activeIndex === index }]"
            @click="navigateToExperience(index)"
            :aria-label="`Navigate to ${job.company}`"
          >
            <span class="dot-tooltip">{{ job.company.split(' - ')[0] }}</span>
          </button>
        </div>
        <div class="navigator-info">
          <span class="experience-counter">{{ activeIndex + 1 }} / {{ experience.length }}</span>
          <div class="navigator-arrows">
            <button
              @click="navigateToExperience(activeIndex - 1)"
              :disabled="activeIndex === 0"
              aria-label="Previous experience"
            >
              <i class="fas fa-chevron-left"></i>
            </button>
            <button
              @click="navigateToExperience(activeIndex + 1)"
              :disabled="activeIndex === experience.length - 1"
              aria-label="Next experience"
            >
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Carousel Container -->
      <div class="experience-carousel">
        <transition name="fade-slide" mode="out-in">
          <div
            :key="activeIndex"
            class="experience-card"
          >
            <div class="card-content">
              <!-- Status & Duration Badges -->
              <div class="badges-row">
                <span v-if="isCurrent(experience[activeIndex].period)" class="badge badge-current">
                  <i class="fas fa-circle"></i> Current Position
                </span>
                <span class="badge badge-duration">
                  <i class="far fa-clock"></i> {{ calculateDuration(experience[activeIndex].period) }}
                </span>
              </div>

              <!-- Title & Company -->
              <h3 class="job-title">{{ experience[activeIndex].title }}</h3>
              <h4
                :class="{ 'company-link': experience[activeIndex].projectIds && experience[activeIndex].projectIds.length > 0 }"
                @click="experience[activeIndex].projectIds && experience[activeIndex].projectIds.length > 0 && handleCompanyClick(experience[activeIndex].projectIds)"
              >
                {{ experience[activeIndex].company }}
                <i v-if="experience[activeIndex].projectIds && experience[activeIndex].projectIds.length > 0" class="fas fa-external-link-alt"></i>
              </h4>
              <span class="timeline-date">
                <i class="far fa-calendar-alt"></i> {{ experience[activeIndex].period }}
              </span>

              <!-- Metrics & Highlights Section -->
              <div class="highlights-section">
                <!-- Metrics Pills (only if metrics exist) -->
                <div v-if="experience[activeIndex].metrics && experience[activeIndex].metrics.length > 0" class="metrics-row">
                  <span class="section-label">Impact Metrics</span>
                  <div class="metrics-pills">
                    <span v-for="(metric, i) in experience[activeIndex].metrics" :key="i" class="metric-pill">
                      <i class="fas fa-chart-line"></i> {{ metric }}
                    </span>
                  </div>
                </div>

                <!-- Highlight Tags (only if highlights exist) -->
                <div v-if="experience[activeIndex].highlights && experience[activeIndex].highlights.length > 0" class="highlights-row">
                  <span class="section-label">Key Achievements</span>
                  <div class="highlight-tags">
                    <span v-for="(highlight, i) in experience[activeIndex].highlights" :key="i" class="highlight-tag">
                      {{ highlight }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Summary -->
              <p class="job-summary">{{ experience[activeIndex].summary }}</p>

              <!-- Details Toggle -->
              <div class="details-toggle" @click="toggleDetails(activeIndex)">
                <span>{{ experience[activeIndex].showDetails ? 'Hide details' : 'See full details' }}</span>
                <i :class="experience[activeIndex].showDetails ? 'fas fa-chevron-up' : 'fas fa-chevron-down'"></i>
              </div>
              <transition name="expand">
                <div v-if="experience[activeIndex].showDetails" class="details-content">
                  <ul>
                    <li v-for="(detail, i) in experience[activeIndex].details" :key="i">
                      {{ detail }}
                    </li>
                  </ul>
                </div>
              </transition>

              <!-- Tech Stack -->
              <div class="tech-stack-section">
                <span class="section-label">Technologies & Tools</span>
                <div
                  v-for="(category, categoryName) in experience[activeIndex].techStack"
                  :key="categoryName"
                  class="tech-category"
                >
                  <span class="category-name">{{ categoryName }}</span>
                  <div class="tech-badges">
                    <span v-for="tech in category" :key="tech" class="tech-badge">
                      {{ tech }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useProjects } from "../../composables/useProjects";
import { useProjectNavigation } from "../../composables/useProjectNavigation";

const { allProjects } = useProjects();
const { openProjectById } = useProjectNavigation();

// Active experience tracking
const activeIndex = ref(0);
const timelineItems = ref<HTMLElement[]>([]);

// Helper function to calculate duration from period string
const calculateDuration = (period: string): string => {
  const parts = period.split(" - ");
  if (parts.length !== 2) return "";

  const startStr = parts[0].trim();
  const endStr = parts[1].trim();

  const monthMap: { [key: string]: number } = {
    Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
    Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
  };

  const parseDate = (dateStr: string): Date => {
    if (dateStr === "Present") {
      return new Date();
    }
    const [month, year] = dateStr.split(" ");
    return new Date(parseInt(year), monthMap[month], 1);
  };

  const start = parseDate(startStr);
  const end = parseDate(endStr);

  const diffMs = end.getTime() - start.getTime();
  const diffMonths = Math.round(diffMs / (1000 * 60 * 60 * 24 * 30.44));

  const years = Math.floor(diffMonths / 12);
  const months = diffMonths % 12;

  if (years === 0) {
    return `${months}mo`;
  } else if (months === 0) {
    return `${years}y`;
  } else {
    return `${years}y ${months}mo`;
  }
};

// Check if job is current
const isCurrent = (period: string): boolean => {
  return period.includes("Present");
};

const experience = ref([
  {
    period: "Aug 2024 - Present",
    title: "Technical Staff & Software Engineering",
    company: "MyoLab AI - New York, USA",
    projectIds: ["myolab-self", "myolab-demo"],
    summary:
      "Lead web-apps & cross-platform mobile front end with focus on performance, scalability, and smooth 3D/data-rich UX. Design UX flows and feature strategy for multi-model AI stack.",
    highlights: [
      "Multi-model AI Stack",
      "3D Visualization",
      "Streaming UIs",
      "Performance Optimization",
      "Feature Flags & A/B Testing",
      "GA4/GTM Analytics",
      "Data Contracts & Versioning",
      "Cross-team Collaboration",
      "UX Strategy & Product Design"
    ],
    showDetails: false,
    details: [
      "Lead the web-apps & cross-platform mobile front end with a focus on performance, scalability, and smooth 3D/data-rich UX.",
      "Designed UX flows and feature strategy for a multi-model stack (in-house models + GPT), shipped streaming UIs with flags/fallbacks, and used lightweight evals to guide AI product decisions.",
      "Defined data contracts (request/response, versioning), error handling, performance targets, and safe releases (feature flags, gradual rollouts, A/B).",
      "Partnered continuously with backend, research, and 3D; aligned release trains and quality gates; instrumented product signals (GA4/GTM + FE tracing) to steer stability and roadmap outcomes.",
    ],
    techStack: {
      "Frontend": ["Vue 3", "TypeScript", "Composition API", "Pinia", "TailwindCSS"],
      "3D & Visualization": ["Three.js", "TresJS", "Chart.js"],
      "DevOps & Tools": ["GitHub Actions", "Feature Flags", "A/B Testing"]
    },
  },
  {
    period: "Feb 2021 - Jul 2024",
    title: "Frontend Developer",
    company: "Metricool - Madrid, Spain",
    projectIds: ["metricool", "metricool-mobile"],
    summary:
      "Managed performance and scalability for 40k+ monthly active users and 1M+ registered users. Led migration from JSP/VanillaJS to robust TypeScript architecture.",
    metrics: ["40k+ MAU", "1M+ users"],
    highlights: [
      "Migration JSP → TypeScript",
      "Mobile App from Scratch",
      "Scale to Production",
      "Performance & Standards",
      "Product Team Alignment",
      "Development Standards"
    ],
    showDetails: false,
    details: [
      "Managed performance and scalability for 40k+ monthly active users and 1M+ registered users.",
      "Led the migration from JSP/VanillaJS to a robust FrontEnd architecture with TypeScript, enabling scale, performance improvements, and development standards.",
      "Built the mobile application from scratch to production and enhanced the web platform to meet evolving market (and new social media) demands.",
      "Collaborated closely with a multidisciplinary product team, aligning development with company goals and KPIs.",
    ],
    techStack: {
      "Frontend": ["Vue.js", "TypeScript", "Vuex"],
      "Mobile": ["Ionic", "Capacitor"],
      "Styling": ["Tailwind", "Custom Design System"],
      "Tools": ["Git", "Bitbucket"]
    },
  },
  {
    period: "Feb 2020 - Feb 2021",
    title: "Frontend Developer",
    company: "Sngular - Madrid, Spain",
    summary:
      "Engineered responsive user interfaces with Angular 9+ and PostCSS. Integrated components across brand teams on a unified platform.",
    highlights: [
      "Server-Side Rendering (SSR)",
      "Multi-brand Platform",
      "Component Architecture",
      "Code Standards & Review",
      "Cross-brand Coordination",
      "Responsive UI Engineering"
    ],
    showDetails: false,
    details: [
      "Engineered responsive user interfaces with Angular 9+ and PostCSS.",
      "Integrated components with a core team while coordinating across brand teams on a unified platform and adapting to specific brand details.",
      "Contributed to server-side rendering (SSR), adding code standards and code review rules.",
    ],
    techStack: {
      "Frontend": ["Angular 9+", "Component Architecture"],
      "Styling": ["PostCSS", "Custom Styling Systems"],
      "Architecture": ["SSR", "Performance Optimization"],
      "Tools": ["Git", "Bitbucket", "CI/CD"]
    },
  },
  {
    period: "Mar 2018 - Feb 2020",
    title: "FullStack Developer",
    company:
      "ULTEBRA Solutions · Atos · Sirokko - Tenerife & Gran Canaria, Spain",
    summary:
      "Progressed from junior to solid mid-level engineer, establishing coding standards, version control discipline, and delivery habits that shaped a current FE-focused path.",
    highlights: [
      "Junior → Mid-level Growth",
      "End-to-end FullStack",
      "Clean Architecture",
      "Code Review Practices",
      "Reusable UI Patterns",
      "Multi-database Experience",
      "Team Workflow Improvement"
    ],
    showDetails: false,
    details: [
      "Built and maintained web apps end-to-end: front end (Angular 2+, Vue.js, Ionic) and back-end services (.NET Core, Spring Boot, Rails) with relational databases (SQL Server, MySQL, Oracle, PostgreSQL).",
      "Adopted clean component architectures, reusable UI patterns, and code review practices; improved team workflows with Git, Trello/Slack, and Azure DevOps.",
      "Delivered features from spec to production across small products and larger enterprise contexts.",
    ],
    techStack: {
      "Frontend": ["Angular 2+", "Vue.js", "Ionic"],
      "Backend": [".NET Core", "Spring Boot", "Rails"],
      "Database": ["SQL Server", "MySQL", "Oracle", "PostgreSQL"],
      "Tools": ["Git", "Azure DevOps", "Trello", "Slack"]
    },
  },
]);

const toggleDetails = (index: number) => {
  experience.value[index].showDetails = !experience.value[index].showDetails;
};

const handleCompanyClick = (projectIds: string[]) => {
  // Open the first project (or could show a menu if multiple)
  if (projectIds.length > 0) {
    openProjectById(projectIds[0], allProjects.value, true);
  }
};

// Navigate to specific experience (carousel mode)
const navigateToExperience = (index: number) => {
  if (index < 0 || index >= experience.value.length) return;
  activeIndex.value = index;
};

// Keyboard navigation
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
    event.preventDefault();
    const nextIndex = Math.min(activeIndex.value + 1, experience.value.length - 1);
    navigateToExperience(nextIndex);
  } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
    event.preventDefault();
    const prevIndex = Math.max(activeIndex.value - 1, 0);
    navigateToExperience(prevIndex);
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
});
</script>

<style scoped>
.company-link {
  cursor: pointer;
  color: var(--primary);
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.company-link:hover {
  color: var(--accent);
  text-decoration: underline;
}

.company-link i {
  font-size: 0.8em;
  opacity: 0.7;
}
</style>
