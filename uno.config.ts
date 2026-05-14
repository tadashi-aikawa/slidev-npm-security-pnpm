import { defineConfig } from "unocss";

export default defineConfig({
  theme: {
    colors: {
      // primaryはthemeConfigが優先されるので不要
      secondary: "var(--color-secondary)",
      dimmed: "var(--color-dimmed)",
      "main-reverse": "var(--color-main-reverse)",
    },
  },
  safelist: ["i-vscode-icons:file-type-lua"],
});
