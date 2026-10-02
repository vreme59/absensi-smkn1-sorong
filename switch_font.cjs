const fs = require('fs');

let html = fs.readFileSync('d:/Coding/lomba website sekolah/smkn-1-sorong-student-hub/index.html', 'utf8');
const searchStr = '<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block" rel="stylesheet" />';
html = html.replace(searchStr, '');
fs.writeFileSync('d:/Coding/lomba website sekolah/smkn-1-sorong-student-hub/index.html', html);
console.log('Removed remote font from index.html');

let css = fs.readFileSync('d:/Coding/lomba website sekolah/smkn-1-sorong-student-hub/src/index.css', 'utf8');

const localFontCSS = `
@font-face {
  font-family: 'Material Symbols Outlined';
  font-style: normal;
  font-weight: 100 700;
  src: url('/fonts/material-symbols-outlined.woff2') format('woff2');
  font-display: block;
}

.material-symbols-outlined {
  font-family: 'Material Symbols Outlined' !important;
  font-weight: normal;
  font-style: normal;
  font-size: 24px;
  line-height: 1;
  letter-spacing: normal;
  text-transform: none;
  display: inline-block;
  white-space: nowrap;
  word-wrap: normal;
  direction: ltr;
  -webkit-font-feature-settings: 'liga';
  -webkit-font-smoothing: antialiased;
}
`;

if (!css.includes("url('/fonts/material-symbols-outlined.woff2')")) {
   // Also remove my old fix
   css = css.replace(/\/\* Fix for Material Symbols flashing text during load \*\/[\s\S]*?vertical-align: bottom;\r?\n}/, '');
   fs.writeFileSync('d:/Coding/lomba website sekolah/smkn-1-sorong-student-hub/src/index.css', localFontCSS + '\n' + css);
   console.log('Added local font CSS to index.css');
}
