import react from "@vitejs/plugin-react";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  root: ".",
  base: "./",
  build: {
    outDir: "dist-react",
    emptyOutDir: true,
    rollupOptions: {
      input: resolve(__dirname, "react.html")
    }
  },
  server: {
    port: 5173,
    open: "/react.html"
  }
});
