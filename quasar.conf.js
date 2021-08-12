/* eslint-disable @typescript-eslint/no-var-requires */
const { configure } = require("quasar/wrappers");

module.exports = configure((ctx) => ({
  supportTS: {
    tsCheckerConfig: {
      eslint: {
        enabled: true,
        files: "./src/**/*.{ts,tsx,js,jsx,vue}"
      }
    }
  },
  boot: ["i18n", "axios"],
  css: ["app.scss"],
  extras: ["mdi-v5", "roboto-font", "material-icons", "material-icons-outlined"],
  build: {
    vueRouterMode: "history"
  },
  devServer: {
    https: false,
    port: 8080,
    open: true
  },
  framework: {
    config: {
      notify: {
        //
      }
    },
    plugins: ["Notify"]
  },
  animations: [],
  ssr: {
    pwa: false,
    prodPort: 3000,
    maxAge: 1000 * 60 * 60 * 24 * 30,
    middlewares: [ctx.prod ? "compression" : "", "render"]
  },
  pwa: {
    workboxPluginMode: "GenerateSW",
    workboxOptions: {},
    manifest: {
      name: "FinApp",
      short_name: "FinApp",
      description: "App for tracking personal finances.",
      display: "standalone",
      orientation: "portrait",
      background_color: "#ffffff",
      theme_color: "#027be3",
      icons: [
        {
          src: "icons/icon-128x128.png",
          sizes: "128x128",
          type: "image/png"
        },
        {
          src: "icons/icon-192x192.png",
          sizes: "192x192",
          type: "image/png"
        },
        {
          src: "icons/icon-256x256.png",
          sizes: "256x256",
          type: "image/png"
        },
        {
          src: "icons/icon-384x384.png",
          sizes: "384x384",
          type: "image/png"
        },
        {
          src: "icons/icon-512x512.png",
          sizes: "512x512",
          type: "image/png"
        }
      ]
    }
  }
}));
