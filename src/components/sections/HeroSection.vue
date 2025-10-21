<template>
  <section id="home" class="hero visible">
    <div class="container">
      <div class="hero-content">
        <h1>Iru Hernández</h1>
        <p class="hero-description">
          Frontend Developer with
          <span class="highlight">+7 years</span> building fast, user-friendly
          apps with <span class="highlight">modern JavaScript</span>. I ship
          <span class="highlight">AI product-based features</span>, including
          <span class="highlight">3D features</span> related to embodied digital
          twins, using lightweight experiments and eval harnesses to guide
          decisions—always moving quickly without breaking things. I manage
          <span class="highlight">FrontEnd architectures</span>, BackEnd
          communication (clean API contracts, streaming UIs, flags, safe
          rollouts) and decide what to ship, how to roll out, and when to
          iterate. From the beautiful Canary Islands, open to
          <span class="highlight">relocation</span>.
        </p>

        <!-- Mobile container -->
        <div class="hero-mobile-flex-container">
          <div class="profile-image-mobile mobile-only">
            <img src="../../assets/profile-pic.jpg" alt="Iru Hernández" />
          </div>
          <p class="hero-mobile-description">
            Frontend Developer with <span class="highlight">+7 years</span>
            building fast, user-friendly apps with
            <span class="highlight">modern JavaScript</span>. I ship
            <span class="highlight">AI product-based features</span>, including
            <span class="highlight">3D features</span> related to embodied
            digital twins, using lightweight experiments and eval harnesses to
            guide decisions—always moving quickly without breaking things. I
            manage <span class="highlight">FrontEnd architectures</span>,
            BackEnd communication (clean API contracts, streaming UIs, flags,
            safe rollouts) and decide what to ship, how to roll out, and when to
            iterate. From the beautiful Canary Islands, open to
            <span class="highlight">relocation</span>.
          </p>
        </div>

        <div class="tech-badges">
          <span>Tech Stack</span>
          <div class="badges-container">
            <span class="tech-badge tooltip-container">
              <i class="fab fa-vuejs"></i> Vue.js
              <span class="tooltip">Vue.js, Composition API, Pinia</span>
            </span>
            <span class="tech-badge tooltip-container">
              <i class="fas fa-code"></i> TypeScript
              <span class="tooltip">TypeScript, Type Safety</span>
            </span>
            <span class="tech-badge tooltip-container">
              <i class="fas fa-brain"></i> AI Product
              <span class="tooltip">Multi-model AI, Streaming UIs, Evals</span>
            </span>
            <span class="tech-badge tooltip-container">
              <i class="fas fa-cube"></i> Three.js
              <span class="tooltip"
                >Three.js, 3D visualization, Digital twins</span
              >
            </span>
            <span class="tech-badge tooltip-container">
              <i class="fab fa-css3-alt"></i> TailwindCSS
              <span class="tooltip">TailwindCSS, Modern CSS</span>
            </span>
            <span class="tech-badge tooltip-container">
              <i class="fas fa-mobile-alt"></i> Mobile
              <span class="tooltip">Ionic, Capacitor, Cross-platform</span>
            </span>
          </div>
        </div>

        <!-- Stats desktop -->
        <div class="stats-container desktop-only">
          <div class="stat-item">
            <div id="years-of-experience" class="stat-number" data-count="7">
              {{ yearsAnimated }}
            </div>
            <div class="stat-label">Years of<br />Experience</div>
          </div>
          <div class="stat-item">
            <div class="stat-number" data-count="25">{{ reposAnimated }}</div>
            <div class="stat-label">GitHub<br />Repositories</div>
          </div>
          <div class="stat-item">
            <div class="stat-number" data-count="6">
              {{ companiesAnimated }}
            </div>
            <div class="stat-label">Companies<br />Worked With</div>
          </div>
        </div>

        <!-- Stats mobile -->
        <div class="stats-profile-container">
          <div class="stats-container mobile-only">
            <div class="stat-item">
              <div class="stat-number" data-count="7">{{ yearsAnimated }}</div>
              <div class="stat-label">Years of<br />Experience</div>
            </div>
            <div class="stat-item">
              <div class="stat-number" data-count="25">{{ reposAnimated }}</div>
              <div class="stat-label">GitHub<br />Repositories</div>
            </div>
            <div class="stat-item">
              <div class="stat-number" data-count="6">
                {{ companiesAnimated }}
              </div>
              <div class="stat-label">Companies<br />Worked With</div>
            </div>
          </div>
        </div>

        <div class="social-links">
          <a
            href="https://github.com/iru97"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div class="tooltip-container">
              <i class="fab fa-github"></i>
              <span class="tooltip">GitHub</span>
            </div>
          </a>
          <a
            href="https://linkedin.com/in/iru-hernandez"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div class="tooltip-container">
              <i class="fab fa-linkedin"></i>
              <span class="tooltip">LinkedIn</span>
            </div>
          </a>
          <a
            href="https://twitter.com/iruakabubi"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div class="tooltip-container">
              <i class="fab fa-twitter"></i>
              <span class="tooltip">Twitter</span>
            </div>
          </a>
          <a href="mailto:iruhsan@gmail.com">
            <div class="tooltip-container">
              <i class="fas fa-envelope"></i>
              <span class="tooltip">Email</span>
            </div>
          </a>
        </div>
      </div>
      <div class="hero-image">
        <div class="profile-image">
          <img src="../../assets/profile-pic.jpg" alt="Iru Hernández" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

const yearsAnimated = ref("0");
const reposAnimated = ref("0");
const companiesAnimated = ref("0");

const animateNumber = (
  target: number,
  callback: (value: string) => void,
  isYears = false
) => {
  const duration = 1500;
  const frameDuration = 1000 / 60;
  const totalFrames = Math.round(duration / frameDuration);
  const increment = target / totalFrames;

  let currentFrame = 0;
  let value = 0;

  const animation = setInterval(() => {
    currentFrame++;
    value += increment;

    if (currentFrame === totalFrames) {
      clearInterval(animation);
      callback(isYears ? `+ ${target}` : target.toString());
    } else {
      callback(Math.floor(value).toString());
    }
  }, frameDuration);
};

onMounted(() => {
  // Animate stats
  setTimeout(() => {
    animateNumber(7, (val) => (yearsAnimated.value = val), true);
    animateNumber(25, (val) => (reposAnimated.value = val));
    animateNumber(6, (val) => (companiesAnimated.value = val));
  }, 500);
});
</script>
