<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { parseHealthResponse } from '@workspace/contracts'
const status = ref('Checking API…')
async function checkHealth() {
  status.value = 'Checking API…'
  try {
    const response = await fetch('/api/health')
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const health = parseHealthResponse(await response.json())
    status.value = `API status: ${health.status}`
  } catch {
    status.value = 'API unavailable'
  }
}
onMounted(checkHealth)
</script>
<template>
  <main>
    <p class="eyebrow">Fullstack starter</p>
    <h1>Browser to API, proven.</h1>
    <p role="status">{{ status }}</p>
    <button
      type="button"
      @click="checkHealth"
    >
      Retry API
    </button>
  </main>
</template>
