<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    image?: string;
    backgroundSize?: string;
    backgroundPosition?: string;
  }>(),
  {
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
);

const resolveAssetUrl = (url: string): string => {
  if (url.startsWith("/")) {
    return `${import.meta.env.BASE_URL}${url.slice(1)}`;
  }

  return url;
};

const style = computed(() => ({
  backgroundImage: props.image
    ? `url("${resolveAssetUrl(props.image)}")`
    : undefined,
  backgroundRepeat: "no-repeat",
  backgroundPosition: props.backgroundPosition,
  backgroundSize: props.backgroundSize,
}));
</script>

<template>
  <div class="slidev-layout h-full w-full" :style="style">
    <slot />
  </div>
</template>
