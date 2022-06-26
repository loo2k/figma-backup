const fs = require('fs-extra');

const main = async () => {
  const userscript = fs.readFileSync('./dist/figma.user.js', 'utf8');
  
  // 对 figma.user.js 进行处理
  fs.writeFileSync('./dist/figma.user.js', userscript.replace(/\n';/g, '\';'));

  // 复制需要发布的内容到 dist 文件夹
  fs.copySync('./index.html', './dist/index.html');
  fs.copySync('./images', './dist/images');

  // 复制一份到根目录
  fs.copySync('./dist/figma.user.js', './figma.user.js');
}

try {
  main();
} catch (error) {
  console.error(error);
}