<template>
  <section id="articles">
    <div class="container">
      <h2 class="section-title">Articles & Talks</h2>
      <p class="section-description">
        I enjoy sharing knowledge through writing and speaking. Here's a
        selection of my tech community contributions.
      </p>
      <div class="articles-grid">
        <div
          v-for="article in articles"
          :key="article.title"
          class="article-card"
        >
          <div class="article-type">
            <i :class="article.icon"></i> {{ article.type }}
          </div>
          <h3>{{ article.title }}</h3>
          <p>{{ article.description }}</p>
          <a
            v-if="article.link"
            :href="article.link"
            class="article-link"
            target="_blank"
            style="margin-bottom: 0.5rem"
            >{{ article.linkText }} <i class="fas fa-arrow-right"></i
          ></a>
          <div class="article-meta">
            <span v-for="meta in article.meta" :key="meta">{{ meta }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from "vue";

const articles = ref([
  {
    type: "Talk",
    icon: "fas fa-video",
    title: "TypeScript: The Power of Typing",
    description:
      "Deep dive into TypeScript's type system and how it transforms code quality and maintainability in real-world applications.",
    meta: ["2023", "TypeScript", "CanariasJS"],
    link: "https://www.youtube.com/watch?v=uQLD10pQ-YM&t=1504s&ab_channel=CanariasJS",
    linkText: "Watch Talk",
  },
  {
    type: "LinkedIn Post",
    icon: "fas fa-file-alt",
    title: "Git Hooks",
    description:
      "Practical guide to automating quality checks and workflow steps using Git hooks in team environments.",
    meta: ["2022", "Git, DevOps"],
    link: "https://www.linkedin.com/posts/iru-hernandez_iru-hern%C3%A1ndez-mr-humilde-on-twitter-activity-6575796747363332096-i4GN/",
    linkText: "View Post",
  },
  {
    type: "Talk",
    icon: "fas fa-microphone",
    title: "Introduction to TypeScript",
    description:
      "Beginner-friendly TypeScript guide covering core concepts and integration with existing JavaScript projects.",
    meta: ["2022", "TypeScript", "TLP Tenerife"],
    link: "https://www.linkedin.com/posts/iru-hernandez_tlptenerife-tlpinnova-activity-6558020015348682752-ZeJM/",
    linkText: "View Post",
  },
  {
    type: "Talk",
    icon: "fas fa-video",
    title: "NuxtJS: The Vue Framework",
    description:
      "Overview of how NuxtJS enhances Vue development with SSR, file-based routing, and production optimizations.",
    meta: ["2021", "Vue.js, NuxtJS"],
    link: "https://www.youtube.com/watch?v=tJPYomVOX-s&ab_channel=CanariasJS",
    linkText: "Watch Talk",
  },
  {
    type: "Award",
    icon: "fas fa-trophy",
    title: "Premio Think Big by Fundación Telefónica",
    description:
      "Recognition for innovation in web development, highlighting my commitment to pushing web technology boundaries.",
    meta: ["2020", "Award"],
  },
  {
    type: "Award",
    icon: "fas fa-trophy",
    title: '2nd Prize in the Hackathon "Feel the Metal Power"',
    description:
      "Second place in an intense coding competition, demonstrating problem-solving skills under tight deadlines.",
    meta: ["2019", "Hackathon"],
  },
]);
</script>
