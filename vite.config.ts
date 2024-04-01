import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
    createSvgIconsPlugin({
      iconDirs: [path.resolve(process.cwd(), "src/icons/svg")], // icon存放的目录
      symbolId: "icon-[name]", // symbol的id
      inject: "body-last", // 插入的位置
      customDomId: "__svg__icons__dom__", // svg的id
    }),
  ],
  css: {
    postcss: {
      plugins: [
        // autoprefixer()
      ]
    },
    preprocessorOptions: {
      scss: {
        additionalData: `@import "src/assets/style/variable.scss";@import "src/assets/style/mixin.scss";`,
      },
      less: {
        modifyVars: {
          "primary-color": "#d14424",
          "text-color": "#41464b",
          "font-size-base": "13px",
          "border-radius-base": "2px",
        },
        javascriptEnabled: true,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
    extensions: [".js", ".ts", ".jsx", ".tsx", ".vue", ".json"],
  },
});
