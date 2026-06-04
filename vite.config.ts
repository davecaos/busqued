import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  base: "/busqued/",
  build: {
    // The @atproto/api SDK is the single heavy dependency (~690 kB). It is
    // code-split into its own lazy async chunk via the dynamic import() in
    // createBskyAgent (src/logic/login.tsx), so it loads off the critical
    // render path. We deliberately do NOT manually split the React/Chakra/
    // Emotion vendor graph — those are deeply interdependent and manual
    // chunking introduces cross-chunk circular-dependency init errors
    // ("Cannot access X before initialization") in the production build.
    chunkSizeWarningLimit: 750,
  },
});
