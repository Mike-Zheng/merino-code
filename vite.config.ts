import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
// import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import AutoImport from "unplugin-auto-import/vite";
// import Components from "unplugin-vue-components/vite";
// import { createHtmlPlugin } from 'vite-plugin-html';
import path from "path";
import vueJsx from "@vitejs/plugin-vue-jsx";
import { resolve } from "path";
import vuetify from "vite-plugin-vuetify";
// https://vitejs.dev/config/

const envPrefix = "APP_";
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      imports: ["vue"]
      // resolvers: [ElementPlusResolver()]
    }),
    vuetify({ autoImport: true }),
    vueJsx({
      // options are passed on to @vue/babel-plugin-jsx
    }),
    // vueSetupExtend(),
    // Components({
    //   resolvers: [ElementPlusResolver()]
    // }),
    createSvgIconsPlugin({
      iconDirs: [path.resolve(process.cwd(), "src/icons/svg")], // icon存放的目录
      symbolId: "icon-[name]", // symbol的id
      inject: "body-last", // 插入的位置
      customDomId: "__svg__icons__dom__" // svg的id
    })
  ],
  envPrefix,
  css: {
    postcss: {
      plugins: [
        // autoprefixer()
      ]
    }
    // preprocessorOptions: {
    //   scss: {
    //     additionalData: `@import '${resolve(
    //       __dirname,
    //       "src/styles/index.scss"
    //     )}';`
    //   }
    // }
  },
  resolve: {
    alias: [
      { find: /^@\//, replacement: resolve(__dirname, "src") + "/" },
      { find: /^~/, replacement: "" },
      { find: /^vue-i18n/, replacement: "vue-i18n/dist/vue-i18n.cjs.js" }
    ],
    extensions: [".js", ".ts", ".jsx", ".tsx", ".vue", ".json"]
  }
});
