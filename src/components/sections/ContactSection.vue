<template>
  <section id="contact">
    <div class="container">
      <div class="contact">
        <div class="contact-container">
          <div class="contact-content">
            <h2 class="section-title">Contact</h2>
            <p>
              Based in the Canary Islands, but open to remote work and
              relocation opportunities (particularly USA, Australia, or Canada).
              Let's connect to discuss how we can create exceptional web
              experiences together!
            </p>
            <div class="social-links">
              <a
                href="https://github.com/iru97"
                target="_blank"
                class="tooltip-container"
              >
                <i class="fab fa-github"></i>
                <span class="tooltip">GitHub: Check my code</span>
              </a>
              <a
                href="https://linkedin.com/in/iru-hernandez"
                target="_blank"
                class="tooltip-container"
              >
                <i class="fab fa-linkedin"></i>
                <span class="tooltip">LinkedIn: Professional profile</span>
              </a>
              <a
                href="https://twitter.com/iruakabubi"
                target="_blank"
                class="tooltip-container"
              >
                <i class="fab fa-twitter"></i>
                <span class="tooltip">Twitter: Latest updates</span>
              </a>
              <a href="mailto:iruhsan@gmail.com" class="tooltip-container">
                <i class="fas fa-envelope"></i>
                <span class="tooltip">Email me directly</span>
              </a>
            </div>
          </div>

          <div class="contact-form">
            <form id="contact-form" @submit.prevent="handleSubmit">
              <div class="form-group">
                <input
                  v-model="form.name"
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Name"
                  required
                />
              </div>
              <div class="form-group">
                <input
                  v-model="form.email"
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Email"
                  required
                />
              </div>
              <div class="form-group">
                <textarea
                  v-model="form.message"
                  id="message"
                  name="message"
                  placeholder="Message"
                  required
                ></textarea>
              </div>
              <button type="submit" class="primary-btn">Send Message</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { reactive } from "vue";

const form = reactive({
  name: "",
  email: "",
  message: "",
});

const handleSubmit = () => {
  // Handle form submission
  console.log("Form submitted:", form);
  alert(`Thank you ${form.name}! Your message has been sent.`);
  form.name = "";
  form.email = "";
  form.message = "";
};
</script>
