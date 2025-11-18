<template>
  <div id="app">
    <!-- Header / Toolbar -->
    <header>
      <div class="toolbar">
        <a href="#home" class="tool-icon tooltip-container">
          <i class="fas fa-home"></i>
          <span class="tooltip">About Me</span>
        </a>
        <a href="#projects" class="tool-icon tooltip-container">
          <i class="fas fa-code-branch"></i>
          <span class="tooltip">Projects</span>
        </a>
        <a href="#experience" class="tool-icon tooltip-container">
          <i class="fas fa-briefcase"></i>
          <span class="tooltip">Experience</span>
        </a>
        <a href="#skills" class="tool-icon tooltip-container">
          <i class="fas fa-tools"></i>
          <span class="tooltip">Skills</span>
        </a>
        <a href="#articles" class="tool-icon tooltip-container">
          <i class="fas fa-newspaper"></i>
          <span class="tooltip">Articles & Talks</span>
        </a>
        <a href="#contact" class="tool-icon tooltip-container">
          <i class="fas fa-envelope"></i>
          <span class="tooltip">Contact</span>
        </a>
        <button
          class="theme-toggle tool-icon"
          id="theme-toggle"
          @click="toggleTheme"
        >
          <i :class="isDark ? 'fas fa-sun' : 'fas fa-moon'"></i>
        </button>
        <a
          href="https://lab.iruhernandez.com"
          target="_blank"
          rel="noopener noreferrer"
          class="tool-icon lab-icon"
        >
          <i class="fas fa-flask"></i>
        </a>
      </div>
    </header>

    <!-- Hero Section -->
    <HeroSection />

    <!-- Projects Section -->
    <ProjectsSection />

    <!-- Experience Section -->
    <ExperienceSection />

    <!-- Skills Section -->
    <SkillsSection />

    <!-- Articles & Talks Section -->
    <ArticlesSection />

    <!-- Contact Section -->
    <ContactSection />

    <!-- Footer -->
    <footer>
      <div class="container">
        <p>
          &copy; {{ new Date().getFullYear() }} Iru Hernández. All rights
          reserved.
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import HeroSection from "./components/sections/HeroSection.vue";
import ProjectsSection from "./components/sections/ProjectsSection.vue";
import ExperienceSection from "./components/sections/ExperienceSection.vue";
import SkillsSection from "./components/sections/SkillsSection.vue";
import ArticlesSection from "./components/sections/ArticlesSection.vue";
import ContactSection from "./components/sections/ContactSection.vue";
import { useCustomCursor } from "./composables/useCustomCursor";

const isDark = ref(false);

const toggleTheme = () => {
  isDark.value = !isDark.value;
  document.body.classList.toggle("dark-theme");
  localStorage.setItem("theme", isDark.value ? "dark" : "light");
};

// Initialize custom cursor
useCustomCursor();

onMounted(() => {
  // Initialize theme
  const savedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
    isDark.value = true;
    document.body.classList.add("dark-theme");
  }
});
</script>
