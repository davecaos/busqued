import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  base: "/busqued/",
  build: {
    // The @atproto/api SDK is ~690 kB (≈130 kB gzip) and irreducible; it is
    // code-split into its own lazy chunk, so this raises the per-chunk warning
    // threshold to acknowledge that rather than flag a false positive.
    chunkSizeWarningLimit: 750,
    rollupOptions: {
      output: {
        // Split heavy dependencies into separate, cacheable vendor chunks
        // instead of shipping one large bundle.
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          if (
            /[\\/](@atproto|multiformats|@ipld|uint8arrays|cborg|@noble|graphemer|iso-datestring-validator|zod)[\\/]/.test(
              id
            )
          ) {
            return "atproto";
          }
          if (/[\\/](@chakra-ui|@emotion|@zag-js|@pandacss)[\\/]/.test(id)) {
            return "chakra";
          }
          if (/[\\/]react-icons[\\/]/.test(id)) return "icons";
          if (
            /[\\/](react|react-dom|scheduler|next-themes|use-sync-external-store)[\\/]/.test(
              id
            )
          ) {
            return "react";
          }
          return "vendor";
        },
      },
    },
  },
});
