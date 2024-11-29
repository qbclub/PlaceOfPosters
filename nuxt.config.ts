// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";

export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE,
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL,
    },
  },

  // plugins: [
  //   { src: '~/plugins/yandex-metrika.js', mode: 'client' }
  // ],
  nitro: {
    compressPublicAssets: {
      brotli: true
    }
  },
  css: ["~/assets/main.scss"],

  components: [
    {
      path: "~/components",
      pathPrefix: false,
    },
  ],

  app: {
    pageTransition: { name: "page", mode: "out-in" },
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1',
      link: [
        { rel: "icon", type: "image/png", href: "/favicon.ico" }
      ]
    }
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
    "@vite-pwa/nuxt",
    '@nuxtjs/robots',
    '@nuxtjs/sitemap',

  ],

  robots: {
    groups: [
      { userAgent: '*', disallow: ['/Admin', '/Cabinet', '/Info', '/Manager', '/Frame'], allow: '/' },// Для всех поисковых ботов
      // {sitemap: `${process.env.NUXT_PUBLIC_SITE_URL}/sitemap.xml`}, // Указание ссылки на карту сайта
      // {host: process.env.NUXT_PUBLIC_SITE_URL},
    ]
  },

  sitemap: {
    // hostname: process.env.NUXT_PUBLIC_SITE_URL, // Ensure siteUrl is set in your .env file
    // gzip: true, // Enable gzip compression for the sitemap
    // include: [
    // ],
    exclude: ['/Admin/**', '/Cabinet/**', '/Info/**', '/Manager/**', '/Frame/**', '/FramePost', '/Auth', '/Reg', '/HelloPage', '/AddPrice', '/CreatePoster', '/ForgotPassword'], // Exclude unwanted routes
    defaults: {
      changefreq: 'daily',
      priority: 0.8,
      lastmod: new Date().toISOString(), // Set last modification date
    }
  },

  pwa: {
    registerType: 'autoUpdate',
    includeAssets: ['favicon.svg', 'favicon.ico', 'robots.txt', 'images/apple-touch-icon.png'],
    manifest: {
      name: 'PlPo:место для афиш',
      short_name: 'PlPo',
      description: 'PlPo - место для ваших афиш',
      theme_color: '#ffffff',
      background_color: "#ffffff",
      display: "standalone",
      icons: [
        {
          src: 'android-chrome-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: 'android-chrome-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
        {
          src: 'apple-touch-icon.png',
          sizes: '180x180',
          type: 'image/png',
        },

        {
          src: 'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable',
        }
      ]
    }
  },

  pinia: {
    storesDirs: ["./stores/**"],
  },

  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },

    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
          silenceDeprecations: ['legacy-js-api'],
        },
      },
    }

  },

  routeRules: {
    "/createposter": { ssr: false },
    "/cabinet/**": { ssr: false },
    "/posters": { ssr: false },
  },

  compatibilityDate: '2024-11-27',
});