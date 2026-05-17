<!-- components/CharacterBubble.vue -->
<script setup lang="ts">
defineProps<{
  image: string;
  imageWidth?: string;
  imageHeight?: string;
  imageGap?: string;
  name?: string;
  position?: "left" | "right";
}>();
</script>

<template>
  <div
    class="character-bubble"
    :class="position ?? 'left'"
    :style="{ gap: imageGap ?? '1.2rem' }"
  >
    <img
      class="character"
      :src="image"
      :style="{
        width: imageWidth ? `${imageWidth}px` : 'auto',
        height: imageHeight ? `${imageHeight}px` : 'auto',
      }"
    />

    <div class="bubble">
      <div v-if="name" class="name">{{ name }}</div>
      <div class="text">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped>
.character-bubble {
  display: flex;
  align-items: flex-start;
  margin: 2rem 0;
}

.character-bubble.right {
  flex-direction: row-reverse;
}

.character {
  object-fit: contain;
}

.bubble {
  position: relative;
  max-width: 800px;
  padding: 1rem 1.4rem;
  border-radius: 1.2rem;
  background: white;
  box-shadow: 0 4px 24px rgb(0 0 0 / 18%);
  font-size: 2rem;
  line-height: 1.6;
}

.bubble::before {
  content: "";
  position: absolute;
  top: 28px;
  width: 0;
  height: 0;
  border: 14px solid transparent;
}

.left .bubble::before {
  left: -26px;
  border-right-color: white;
}

.right .bubble::before {
  right: -26px;
  border-left-color: white;
}

.name {
  margin-bottom: 0.25rem;
  font-weight: 700;
  font-size: 1.3rem;
}
</style>
