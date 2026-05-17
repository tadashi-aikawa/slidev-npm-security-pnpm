<script setup lang="ts">
import { cva } from "class-variance-authority";

const chapters = [
  "はじめに",
  "4つのサプライチェーン攻撃対策",
  "おわりに",
] as const;

type ChapterState = "current" | "done" | "upcoming";

const props = defineProps<{
  /** 1はじまり */
  activeChapter?: number | undefined;
}>();

const getChapterState = (index: number): ChapterState => {
  if (props.activeChapter && index === props.activeChapter - 1) {
    return "current";
  }

  if (props.activeChapter && index < props.activeChapter - 1) {
    return "done";
  }

  return "upcoming";
};

const chapterBadge = cva(
  "flex size-16 items-center justify-center rounded-full border p-2 font-bold",
  {
    variants: {
      state: {
        current: "bg-primary text-main-reverse border-primary",
        done: "text-dimmed border-dimmed border-dashed",
        upcoming: "text-primary border-primary border-dashed",
      },
    },
    defaultVariants: {
      state: "upcoming",
    },
  },
);

const chapterText = cva("", {
  variants: {
    state: {
      current: "text-primary font-bold",
      done: "text-dimmed",
      upcoming: "text-primary",
    },
  },
  defaultVariants: {
    state: "upcoming",
  },
});
</script>

<template>
  <div class="slidev-layout chapter-divider-layout">
    <div
      class="left-pane bg-primary text-main-reverse flex flex-col items-center justify-center gap-4 font-bold"
    >
      <span class="text-[1.05em]">
        {{ props.activeChapter ? "Chapter" : "Agenda" }}
      </span>
      <span v-if="props.activeChapter" class="text-[1.75em]"
        >0{{ props.activeChapter }}</span
      >
    </div>

    <div class="right-pane flex flex-col gap-12">
      <div
        v-for="(item, index) in chapters"
        :key="`${index}-${item}`"
        class="flex items-center gap-4"
      >
        <span :class="chapterBadge({ state: getChapterState(index) })">
          0{{ index + 1 }}
        </span>
        <span :class="chapterText({ state: getChapterState(index) })">
          {{ item }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chapter-divider-layout {
  padding: 0;
  margin: 0;
  display: grid;
  grid-template:
    "left ... ..... ..." 1.5em
    "left ... right ..." 1fr
    "left ... ..... ..." 1.5em
    / 20% 5% 72.5% 7.5%;
}

.left-pane {
  grid-area: left;
}

.right-pane {
  grid-area: right;
}
</style>
