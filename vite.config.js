import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/auth": "http://localhost:3000",
      "/users": "http://localhost:3000",
      "/hosts": "http://localhost:3000",
      "/properties": "http://localhost:3000",
      "/bookings": "http://localhost:3000",
      "/reviews": "http://localhost:3000",
    },
  },
});
