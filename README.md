# 保住肥姑妈（Figma 源文件备份）

[查看官网](https://luke.gd/figma-backup)

## 功能介绍

[![](images/intro.png)](https://luke.gd/figma-backup)

- 🏢 支持切换多个账号和企业空间
- 📜 支持备份最近/草稿箱/团队的源文件
- 📦 支持按需下载 .fig 源文件
- ☁️ 支持 [CoDesign](https://codesign.woa.com/) 源文件云备份

## 如何使用

### 安装插件

第一步：安装 [Tampermonkey 插件](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)

第二步：安装 [保住肥姑妈（Figma 源文件备份）](https://luke.gd/figma-backup/figma.user.js) 脚本

*如果你在国内无法正常访问上面的链接，可以使用以下备用链接*

- Tampermonkey 插件：[Firefox](https://addons.mozilla.org/zh-CN/firefox/addon/tampermonkey/) | [Edge](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd) | [CRX 下载](https://www.gugeapps.net/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
- 保住肥姑妈脚本：[Greasyfork](https://greasyfork.org/zh-CN/scripts/441666) | [jsDelivr](https://cdn.jsdelivr.net/gh/loo2k/figma-backup/figma.user.js)

### 视频演示

https://user-images.githubusercontent.com/469964/158935141-1dff7be2-6d3b-458a-b59b-ee0f98c0c542.mp4

## 常见问题

Q: 该脚本是否有安全问题

**A: 脚本代码完全开源，仅有数据埋点统计使用次数信息**

Q: 批量下载时可能会遇到提示是否允许下载多个文件

**A: 点击允许即可**

## 贡献代码

### 如何进行本地调试

下载代码并启动本地开发模式，启动后会在本地运行一个 `localhost:3000` 的服务

```shell
$ git clone git@github.com:loo2k/figma-backup.git
$ npm i
$ npm run dev
```

在 Tampermonkey 中创建一个临时调试用的脚本

```js
// ==UserScript==
// @name         保住肥姑妈（Figma 源文件备份）本地调试
// @namespace    figmahelper
// @version      0.1
// @description  Figma 源文件备份
// @author       Luke
// @match        *://codesign.qq.com/*
// @match        *://dev.codesign.qq.com/*
// @match        *://codesign.woa.com/*
// @match        *://test-codesign.woa.com/*
// @match        *://*.figma.com/*
// @icon         <$ICON$>
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      *://*.figma.com/*
// @connect      *://*.codesign.qq.com/*
// @require      https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.min.js
// ==/UserScript==

(function () {
  "use strict";
  if (location.href === "http://localhost:3000/") return;
  var script = document.createElement("script");
  script.type = "module";
  script.src = "http://localhost:3000/@vite/client";
  document.body.appendChild(script);
  var script2 = document.createElement("script");
  script2.type = "module";
  script2.src = "http://localhost:3000/src/main.js";
  document.body.appendChild(script2);
})();
```