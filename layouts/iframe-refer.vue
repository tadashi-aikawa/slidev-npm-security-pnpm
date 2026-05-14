<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  url: string;
  scale?: number;
  referText?: string;
}>();

const scaleInvertPercent = computed(() => `${(1 / (props.scale || 1)) * 100}%`);
</script>

<template>
  <div class="relative h-full w-full">
    <div
      relative
      :style="{ width: scaleInvertPercent, height: scaleInvertPercent }"
    >
      <iframe
        id="frame"
        class="h-full w-full"
        :src="url"
        :style="
          scale
            ? { transform: `scale(${scale})`, transformOrigin: 'top left' }
            : {}
        "
      />
    </div>
    <div class="refer-overlay">
      出典: <a :href="url">{{ referText || url }}</a>
    </div>
  </div>
</template>

<style scoped>
.refer-overlay {
  position: absolute;
  bottom: 0.5em;
  right: 1em;
  font-size: 0.4em;
  z-index: 9999;
  color: rgba(255, 255, 255, 0.85);
  background: rgba(0, 0, 0, 0.5);
  padding: 0.3em 0.6em;
  border-radius: 4px;
  pointer-events: auto;
}
.refer-overlay a {
  color: inherit;
}
</style>
