// @ts-check
import { defineConfig, envField } from "astro/config";

import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

import vercel from "@astrojs/vercel";

// https://astro.build/config
export default defineConfig({
  vite: {
    resolve: {
      dedupe: ["react", "react-dom"],
    },
  },

  env: {
    schema: {
      SPOTIFY_CLIENT_ID: envField.string({context: "server", access: "public"}),
      SPOTIFY_CLIENT_SECRET: envField.string({context: "server", access: "secret"}),
      SPOTIFY_REFRESH_TOKEN: envField.string({context: "server", access: "secret"}),
    },
    validateSecrets: true
  },

  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    react({
      experimentalReactChildren: true,
      babel: {
        plugins: ["babel-plugin-react-compiler"],
      },
    }),
    mdx(),
    sitemap(),
  ],

  adapter: vercel(),
});