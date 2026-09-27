import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    strictPort: true, // <- True, Если ты хочешь, чтобы Vite не переключался автоматически, а выдавал ошибку при занятом порте
  },
});
