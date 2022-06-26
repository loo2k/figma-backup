import { defineConfig } from 'vite'
import { createVuePlugin } from 'vite-plugin-vue2'
import pkg from './package.json'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    hmr: {
      protocol: 'ws',
      host: 'localhost',
    }
  },
  build: {
    lib: {
      entry: 'src/main.js',
      name: 'userscript',
      formats: ['iife'],
      fileName: (format) => `figma.user.js`,
    },
    rollupOptions: {
      external: ['vue', 'tdesign-vue/esm'],
      output: {
        globals: {
          vue: 'Vue',
          GM_xmlhttpRequest: 'GM_xmlhttpRequest',
        },
        inlineDynamicImports: true,
      }
    },
    minify: 'terser',
    // terserOptions: {
    //   mangle: false,
    //   format: {
    //     beautify: true
    //   }
    // }
  },
  plugins: [
    createVuePlugin(),
    (() => {
      /**
       * 如果用到了额外的 GM_functions，需要添加对应 @grant
       * 虽然可以全部不添加，但只有TamperMonkey会自动推断，其他扩展不一定
       * 在上面 extenral 声明的库，此处需要添加对应的 @require 要注意全局变量名称
       */
      const headers = `\
// ==UserScript==
// @name         保住肥姑妈（Figma 源文件备份）
// @namespace    ${pkg.name}
// @version      ${pkg.version}
// @description  ${pkg.description}
// @author       ${pkg.author}
// @match        *://codesign.qq.com/*
// @match        *://codesign.woa.com/*
// @match        *://*.figma.com/*
// @icon         https://www.google.com/s2/favicons?domain=codesign.qq.com
// @grant        GM_xmlhttpRequest
// @connect      www.figma.com
// @connect      codesign.qq.com
// @require      https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.min.js
// @require      https://cdn.jsdelivr.net/npm/tdesign-vue@0.37.0/dist/tdesign.min.js
// @updateURL    https://luke.gd/figma-backup/figma.user.js
// @downloadURL  https://luke.gd/figma-backup/figma.user.js
// ==/UserScript==

`;
      return {
        name: "inject-css",
        apply: "build", // 仅在构建模式下启用
        enforce: "post", // 在最后处理
        generateBundle(options, bundle) {
          // 从 bundle 中提取 style.css 内容，并加入到脚本中
          const keyword = "user.js";
          if (!bundle["style.css"] || bundle["style.css"].type !== "asset")
            return;
          const css = bundle["style.css"].source;
          const [, target] =
            Object.entries(bundle).find(([name]) => {
              return name.includes(keyword);
            }) ?? [];
          if (!target || target.type !== "chunk") return;
          target.code = `${headers}
(function() {
  const rules = '${css}';
  const style = document.createElement('style');
  style.innerHTML = rules;
  document.head.appendChild(style);
  ${target.code}
})();`
        },
      };
    })(),
  ],
})
