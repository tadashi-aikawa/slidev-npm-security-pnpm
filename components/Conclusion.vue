<script setup lang="ts">
withDefaults(defineProps<{ overlay?: boolean }>(), { overlay: false });
</script>

<template>
  <div v-if="overlay" v-click class="slide-conclusion-overlay">
    <div class="slide-conclusion-message">
      <slot />
    </div>
  </div>
  <div v-else v-click class="slide-conclusion-message">
    <slot />
  </div>
</template>
