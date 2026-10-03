<script setup lang="ts">
import { computed, ref } from 'vue'

const isReady = ref(false)
const status = computed(() =>
  isReady.value
    ? 'The browser interaction is working.'
    : 'Use the button to check the browser setup.',
)
</script>

<template>
  <a class="skip-link" href="#content">Skip to content</a>
  <div class="page-shell">
    <header class="masthead">
      <a class="wordmark" href="/" aria-label="alexop.dev frontend starter">
        <span class="wordmark-mark" aria-hidden="true">a/</span>
        alexop.dev
      </a>
      <span class="status-chip">Vue 3 + Vite+</span>
    </header>

    <main id="content" class="hero" tabindex="-1">
      <p class="eyebrow">Frontend starter</p>
      <h1>A clean place to start.</h1>
      <p class="lede">
        Strict TypeScript, focused architecture rules, and browser-first tests are ready before the
        first feature lands.
      </p>

      <div class="proof">
        <button
          type="button"
          class="proof-button"
          :aria-pressed="isReady"
          @click="isReady = !isReady"
        >
          {{ isReady ? 'Reset browser check' : 'Check browser setup' }}
        </button>
        <p class="proof-status" aria-live="polite">{{ status }}</p>
      </div>
    </main>

    <footer class="footer">
      <span>Ready for the first feature.</span>
      <a href="https://alexop.dev">alexop.dev</a>
    </footer>
  </div>
</template>
