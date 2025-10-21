<template>
  <section id="skills">
    <div class="container">
      <h2 class="section-title">Skills</h2>
      <p class="section-description">
        My tech stack spans frontend frameworks, 3D visualization, and modern
        development practices – always with a focus on performance.
      </p>
      <div class="tools-grid">
        <div v-for="skill in skills" :key="skill.name" class="tool-card">
          <i :class="skill.icon + ' tool-icon'"></i>
          <h3>{{ skill.name }}</h3>
          <p v-html="skill.description"></p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from "vue";

const skills = ref([
  {
    name: "AI Product Development",
    icon: "fas fa-brain",
    description:
      'Ship <span class="highlight-skill">AI product-based features</span> at <span class="highlight-skill">MyoLab AI</span>. Multi-model stack (in-house + GPT), <span class="highlight-skill">streaming UIs</span>, feature flags, and <span class="highlight-skill">lightweight evals</span> to guide product decisions. Define data contracts, error handling, and safe releases.',
  },
  {
    name: "Vue.js Ecosystem",
    icon: "fab fa-vuejs",
    description:
      'Core framework across <span class="highlight-skill">40k+ MAU apps</span>. Led <span class="highlight-skill">JSP/VanillaJS → TypeScript</span> migration at Metricool. Expert in <span class="highlight-skill">Composition API</span>, <span class="highlight-skill">Pinia</span>, and performance optimization for large-scale apps.',
  },
  {
    name: "TypeScript & Type Safety",
    icon: "fab fa-js",
    description:
      'Type safety advocate across all projects. Created <span class="highlight-skill">advanced type utilities</span> and design patterns. Champion of <span class="highlight-skill">clean API contracts</span>, versioning, and type-safe architectures for scalable codebases.',
  },
  {
    name: "3D Web & Digital Twins",
    icon: "fas fa-cube",
    description:
      'Build <span class="highlight-skill">embodied digital twins</span> with <span class="highlight-skill">Three.js</span> and <span class="highlight-skill">TresJS</span>. Optimize 3D/data-rich UX for performance across devices. Current focus at AI startup on immersive, real-time 3D visualizations.',
  },
  {
    name: "Mobile & Cross-Platform",
    icon: "fas fa-mobile-alt",
    description:
      'Built <span class="highlight-skill">Metricool mobile app</span> from scratch to production with <span class="highlight-skill">Ionic 5</span> and <span class="highlight-skill">Capacitor</span>. Native-like experiences, platform API integration, and smooth deployment workflows.',
  },
  {
    name: "Frontend Architecture",
    icon: "fas fa-project-diagram",
    description:
      'Manage <span class="highlight-skill">FrontEnd architectures</span>, define component patterns, and establish <span class="highlight-skill">development standards</span>. Experience leading migrations, coordinating <span class="highlight-skill">release trains</span>, and aligning with backend/research teams.',
  },
  {
    name: "Performance & Scale",
    icon: "fas fa-tachometer-alt",
    description:
      'Managed systems serving <span class="highlight-skill">1M+ registered users</span>. Expert in performance targets, <span class="highlight-skill">GA4/GTM instrumentation</span>, FE tracing, and optimizing for scale. Fast iterations without breaking things.',
  },
  {
    name: "DevOps & CI/CD",
    icon: "fas fa-code-branch",
    description:
      'Oversee <span class="highlight-skill">GitHub Actions</span> pipelines, automated testing, and deployment workflows. Experience with <span class="highlight-skill">Netlify</span>, <span class="highlight-skill">Azure DevOps</span>, Bitbucket Pipelines, and safe rollout strategies (A/B, gradual releases).',
  },
]);
</script>
