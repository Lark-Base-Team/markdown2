import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import monacoEditorPlugin from 'vite-plugin-monaco-editor';
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // monacoEditorPlugin({
    //   languageWorkers: ['editorWorkerService', 'typescript'],
    //   customWorkers: [
    //     {
    //       label: 'typescript',
    //       entry: 'monaco-editor/esm/vs/language/typescript/ts.worker.js'
    //     }
    //   ]
    // })
  ],
  optimizeDeps: {
    exclude: ['monaco-editor']
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"), // 设置 `@` 指向 `src` 目录
    },
  },
  base: "./",
  // css:{
  //   postcss:"./postcss.config.js"
  // }
});
