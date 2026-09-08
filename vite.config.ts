import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const isProduction = process.env.NODE_ENV === "production";

export default defineConfig({
  plugins: [
    react(),

    isProduction
      ? null
      : await import("vite-plugin-pwa").then((m) =>
          m.VitePWA({
            registerType: "autoUpdate",

            includeAssets: [
              "favicon.svg",
              "favicon.ico",
              "icon-192.png",
              "icon-512.png",
            ],

            manifest: {
              name: "TaskFlow",
              short_name: "TaskFlow",
              description: "Modern Task Management App",
              theme_color: "#FC563C",
              background_color: "#E9E4E0",
              display: "standalone",
              orientation: "portrait",
              start_url: "/",
              icons: [
                {
                  src: "icon-192.png",
                  sizes: "192x192",
                  type: "image/png",
                },
                {
                  src: "icon-512.png",
                  sizes: "512x512",
                  type: "image/png",
                },
              ],
            },
          })
        ),
  ].filter(Boolean),
});