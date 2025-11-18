<template>
  <section id="experience">
    <div class="container">
      <h2 class="section-title">Experience</h2>
      <p class="section-description">
        My career path spans diverse sectors and technologies, always focused on
        delivering robust frontend solutions.
      </p>
      <div class="timeline">
        <div
          v-for="(job, index) in experience"
          :key="index"
          class="timeline-item"
        >
          <span class="timeline-date">{{ job.period }}</span>
          <div class="timeline-content">
            <h3>{{ job.title }}</h3>
            <h4
              :class="{ 'company-link': job.projectIds && job.projectIds.length > 0 }"
              @click="job.projectIds && job.projectIds.length > 0 && handleCompanyClick(job.projectIds)"
            >
              {{ job.company }}
              <i v-if="job.projectIds && job.projectIds.length > 0" class="fas fa-external-link-alt"></i>
            </h4>
            <p>{{ job.summary }}</p>
            <div class="details-toggle" @click="toggleDetails(index)">
              See details
              <i
                :class="
                  job.showDetails ? 'fas fa-chevron-up' : 'fas fa-chevron-down'
                "
              ></i>
            </div>
            <div class="details-content" :class="{ active: job.showDetails }">
              <ul>
                <li v-for="(detail, i) in job.details" :key="i">
                  {{ detail }}
                </li>
              </ul>
            </div>
            <div class="tech-stack">
              <i
                v-for="tech in job.techIcons"
                :key="tech.class"
                :class="tech.class + ' tooltip-container'"
                :title="tech.title"
              >
                <span class="tooltip">{{ tech.tooltip }}</span>
              </i>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useProjects } from "../../composables/useProjects";
import { useProjectNavigation } from "../../composables/useProjectNavigation";

const { allProjects } = useProjects();
const { openProjectById } = useProjectNavigation();

const experience = ref([
  {
    period: "Aug 2024 - Present",
    title: "Technical Staff & Software Engineering",
    company: "MyoLab AI - New York, USA",
    projectIds: ["myolab-self", "myolab-demo"],
    summary:
      "Lead web-apps & cross-platform mobile front end with focus on performance, scalability, and smooth 3D/data-rich UX. Design UX flows and feature strategy for multi-model AI stack.",
    showDetails: true,
    details: [
      "Lead the web-apps & cross-platform mobile front end with a focus on performance, scalability, and smooth 3D/data-rich UX.",
      "Designed UX flows and feature strategy for a multi-model stack (in-house models + GPT), shipped streaming UIs with flags/fallbacks, and used lightweight evals to guide AI product decisions.",
      "Defined data contracts (request/response, versioning), error handling, performance targets, and safe releases (feature flags, gradual rollouts, A/B).",
      "Partnered continuously with backend, research, and 3D; aligned release trains and quality gates; instrumented product signals (GA4/GTM + FE tracing) to steer stability and roadmap outcomes.",
    ],
    techIcons: [
      {
        class: "fab fa-vuejs",
        title: "Vue 3",
        tooltip: "Vue 3, Composition API, Pinia",
      },
      {
        class: "fab fa-js",
        title: "TypeScript",
        tooltip: "TypeScript, Type-safe APIs",
      },
      {
        class: "fas fa-cube",
        title: "Three.js",
        tooltip: "Three.js, TresJS, 3D visualization",
      },
      {
        class: "fas fa-chart-bar",
        title: "Chart.js",
        tooltip: "Chart.js, Data visualization",
      },
      {
        class: "fab fa-github",
        title: "GitHub Actions",
        tooltip: "GitHub Actions, CI/CD pipelines",
      },
      {
        class: "fab fa-css3-alt",
        title: "TailwindCSS",
        tooltip: "TailwindCSS, Responsive design",
      },
    ],
  },
  {
    period: "Feb 2021 - Jul 2024",
    title: "Frontend Developer",
    company: "Metricool - Madrid, Spain",
    projectIds: ["metricool", "metricool-mobile"],
    summary:
      "Managed performance and scalability for 40k+ monthly active users and 1M+ registered users. Led migration from JSP/VanillaJS to robust TypeScript architecture.",
    showDetails: false,
    details: [
      "Managed performance and scalability for 40k+ monthly active users and 1M+ registered users.",
      "Led the migration from JSP/VanillaJS to a robust FrontEnd architecture with TypeScript, enabling scale, performance improvements, and development standards.",
      "Built the mobile application from scratch to production and enhanced the web platform to meet evolving market (and new social media) demands.",
      "Collaborated closely with a multidisciplinary product team, aligning development with company goals and KPIs.",
    ],
    techIcons: [
      {
        class: "fab fa-vuejs",
        title: "Vue.js",
        tooltip: "Vue.js, Vuex, Core architecture",
      },
      {
        class: "fab fa-js",
        title: "TypeScript",
        tooltip: "TypeScript integration",
      },
      {
        class: "fas fa-mobile-alt",
        title: "Ionic",
        tooltip: "Ionic, Capacitor, Mobile deployment",
      },
      {
        class: "fab fa-css3-alt",
        title: "Tailwind",
        tooltip: "Tailwind, Custom design system",
      },
      {
        class: "fab fa-git-alt",
        title: "Git",
        tooltip: "Git, Bitbucket, Workflow management",
      },
    ],
  },
  {
    period: "Feb 2020 - Feb 2021",
    title: "Frontend Developer",
    company: "Sngular - Madrid, Spain",
    summary:
      "Engineered responsive user interfaces with Angular 9+ and PostCSS. Integrated components across brand teams on a unified platform.",
    showDetails: false,
    details: [
      "Engineered responsive user interfaces with Angular 9+ and PostCSS.",
      "Integrated components with a core team while coordinating across brand teams on a unified platform and adapting to specific brand details.",
      "Contributed to server-side rendering (SSR), adding code standards and code review rules.",
    ],
    techIcons: [
      {
        class: "fab fa-angular",
        title: "Angular 9+",
        tooltip: "Angular 9+, Component architecture",
      },
      {
        class: "fab fa-css3-alt",
        title: "PostCSS",
        tooltip: "PostCSS, Custom styling systems",
      },
      {
        class: "fab fa-git-alt",
        title: "Git",
        tooltip: "Git workflows, Branching strategies",
      },
      {
        class: "fab fa-bitbucket",
        title: "Bitbucket",
        tooltip: "Bitbucket, CI integrations",
      },
      {
        class: "fas fa-server",
        title: "SSR",
        tooltip: "Server-side rendering, Performance optimization",
      },
    ],
  },
  {
    period: "Mar 2018 - Feb 2020",
    title: "FullStack Developer",
    company:
      "ULTEBRA Solutions · Atos · Sirokko - Tenerife & Gran Canaria, Spain",
    summary:
      "Progressed from junior to solid mid-level engineer, establishing coding standards, version control discipline, and delivery habits that shaped a current FE-focused path.",
    showDetails: false,
    details: [
      "Built and maintained web apps end-to-end: front end (Angular 2+, Vue.js, Ionic) and back-end services (.NET Core, Spring Boot, Rails) with relational databases (SQL Server, MySQL, Oracle, PostgreSQL).",
      "Adopted clean component architectures, reusable UI patterns, and code review practices; improved team workflows with Git, Trello/Slack, and Azure DevOps.",
      "Delivered features from spec to production across small products and larger enterprise contexts.",
    ],
    techIcons: [
      {
        class: "fab fa-vuejs",
        title: "Vue.js",
        tooltip: "Vue.js, Frontend interfaces",
      },
      {
        class: "fab fa-angular",
        title: "Angular",
        tooltip: "Angular 2+, Component architecture",
      },
      {
        class: "fab fa-java",
        title: "Java",
        tooltip: "Spring Boot, Backend services",
      },
      {
        class: "fas fa-database",
        title: "SQL",
        tooltip: "SQL Server, MySQL, Oracle, PostgreSQL",
      },
      {
        class: "fab fa-git-alt",
        title: "Git",
        tooltip: "Git, Azure DevOps, Version control",
      },
    ],
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
