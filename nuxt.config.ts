// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";

export default defineNuxtConfig({
  css: ["~/assets/main.scss"],
  components: [
    {
      path: "~/components",
      pathPrefix: false,
    },
  ],
  app: {
    pageTransition: { name: "page", mode: "out-in" },
  },
  devtools: { enabled: true },
  build: {
    transpile: ["vuetify"],
  },
  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook("vite:extendConfig", (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }));
      });
    },
    "@pinia/nuxt",
  ],
  pinia: {
    storesDirs: ['./stores/**'],
  },
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
});
