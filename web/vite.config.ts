import { defineConfig } from "vite";
import { skybridge } from "skybridge/web";
import react from "@vitejs/plugin-react";

export default defineConfig({
  root: import.meta.dirname,
  plugins: [skybridge(), react()],
});
