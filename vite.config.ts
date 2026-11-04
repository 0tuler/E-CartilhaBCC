import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import svgr from "vite-plugin-svgr";

// Alterado após trocar para o vite
export default defineConfig(({ command }) => {
  return {
    plugins: [react(), tailwindcss(), svgr()],
    // No GitHub Pages usa o nome do repositório, no dev local usa '/'
    base: command === "build" ? "/E-CartilhaBCC/" : "/",
  };
});
