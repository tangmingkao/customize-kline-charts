import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import tailWindcss from "tailwindcss";
import autoPrefixer from "autoprefixer";

export default ({ mode }) =>
  defineConfig({
    server: {
      host: "0.0.0.0",
      port: 8099,
      cors: true,
      open: true,
      proxy: {
        "/v2/": {
          target: "https://futures.bytrade.cc/",
          ws: true,
          secure: true,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/v2/, ""),
        },
      },
    },
    preview: {
      open: false,
    },
    plugins: [vue()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    define: {
      "process.env": loadEnv(mode, process.cwd()),
      global: {},
    },
    css: {
      preprocessorOptions: {
        scss: {
          // 引入elementui变量和自定义scss变量
          additionalData: (content: any, loaderContext: any) => {
            if (
              loaderContext.endsWith("assets/scss/element-variables.scss") ||
              loaderContext.endsWith("assets/scss/common-variables.scss") ||
              loaderContext.endsWith("assets/scss/reset.scss")
            ) {
              return content;
            }
            return `@use '@/assets/scss/element-variables.scss' as *; ${content}`;
          },
        },
      },
      postcss: {
        plugins: [
          tailWindcss,
          autoPrefixer,
          // 移除打包element时的@charset警告
          {
            postcssPlugin: "internal:charset-removal",
            AtRule: {
              charset: (atRule) => {
                if (atRule.name === "charset") {
                  atRule.remove();
                }
              },
            },
          },
        ],
      },
    },
  });
