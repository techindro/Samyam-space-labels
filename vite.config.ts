import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev
export default defineConfig(({ mode }) => ({
  server: {
    host: true,
    port: 8080,
    hmr: {
      overlay: false,
    },
  },

  preview: {
    host: true,
    strictPort: true,
    allowedHosts: [
      "samyam-space-labels-1.onrender.com",
      ".onrender.com"
    ]
  },
  plugins: [react()],
  optimizeDeps: {
    esbuildOptions: {
      sourcemap: false,
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));

