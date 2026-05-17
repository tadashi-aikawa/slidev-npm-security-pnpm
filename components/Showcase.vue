<script setup lang="ts">
defineProps<{
  sizeClass: string;
  gapClass: string;
  sources: {
    name: string;
    url: string;
  }[];
}>();
</script>

<template>
  <div class="flex justify-center">
    <div
      v-for="source in sources"
      :key="source.name"
      class="flex flex-col items-center"
      :class="gapClass"
    >
      <img :src="source.url" :alt="source.name" :class="sizeClass" />
      {{ source.name }}
    </div>
  </div>
</template>
