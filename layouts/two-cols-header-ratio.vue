<script setup lang="ts">
import { computed } from "vue";

type RatioValue = number | string | undefined;

const props = withDefaults(
  defineProps<{
    class?: string;
    layoutClass?: string;
    columns?: string;
    leftRatio?: number | string;
    rightRatio?: number | string;
  }>(),
  {
    leftRatio: 1,
    rightRatio: 1,
  },
);

const toTrackSize = (value: RatioValue): string => {
  if (typeof value === "number") {
    return `${value}fr`;
  }

  const trimmed = `${value ?? ""}`.trim();

  if (!trimmed) {
    return "1fr";
  }

  return /^\d+(\.\d+)?$/.test(trimmed) ? `${trimmed}fr` : trimmed;
};

const resolveColumns = (): string => {
  const columns = props.columns?.trim();

  if (columns) {
    const colonSeparated = columns.match(
      /^(\d+(?:\.\d+)?)\s*:\s*(\d+(?:\.\d+)?)$/,
    );

    if (colonSeparated) {
      const [, left, right] = colonSeparated;
      return `minmax(0, ${left}fr) minmax(0, ${right}fr)`;
    }

    return columns;
  }

  return `minmax(0, ${toTrackSize(props.leftRatio)}) minmax(0, ${toTrackSize(props.rightRatio)})`;
};

const gridStyle = computed(() => ({
  gridTemplateColumns: resolveColumns(),
}));
</script>

<template>
  <div
    class="slidev-layout two-cols-header-ratio h-full w-full"
    :class="props.layoutClass"
    :style="gridStyle"
  >
    <div class="col-header">
      <slot />
    </div>
    <div class="col-left" :class="props.class">
      <slot name="left" />
    </div>
    <div class="col-right" :class="props.class">
      <slot name="right" />
    </div>
    <div class="col-bottom" :class="props.class">
      <slot name="bottom" />
    </div>
  </div>
</template>

<style scoped>
.two-cols-header-ratio {
  display: grid;
  grid-template-rows: auto 1fr auto;
}

.col-header {
  grid-area: 1 / 1 / 2 / 3;
}

.col-left {
  grid-area: 2 / 1 / 3 / 2;
  min-width: 0;
}

.col-right {
  grid-area: 2 / 2 / 3 / 3;
  min-width: 0;
}

.col-bottom {
  align-self: end;
  grid-area: 3 / 1 / 3 / 3;
}
</style>
