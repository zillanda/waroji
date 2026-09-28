import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5174,
    strictPort: true, // <- True, Если ты хочешь, чтобы Vite не переключался автоматически, а выдавал ошибку при занятом порте
  },
});
