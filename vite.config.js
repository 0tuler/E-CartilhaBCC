import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ command }) => {
  return {
    plugins: [react(), tailwindcss()],
    // No GitHub Pages usa o nome do repositório, no dev local usa '/'
    base: command === "build" ? "/TrabGrupoHabSoc/" : "/",
  };
});
