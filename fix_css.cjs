const fs = require('fs');
let css = fs.readFileSync('d:/Coding/lomba website sekolah/smkn-1-sorong-student-hub/src/index.css', 'utf8');

const fix = `
/* Fix for Material Symbols flashing text during load */
.material-symbols-outlined {
  white-space: nowrap !important;
  word-wrap: normal !important;
  overflow: hidden !important;
  max-width: 1em !important;
  display: inline-block;
  vertical-align: bottom;
}
`;

if (!css.includes('max-width: 1em !important')) {
    fs.writeFileSync('d:/Coding/lomba website sekolah/smkn-1-sorong-student-hub/src/index.css', css + '\n' + fix);
    console.log('Re-added max-width fix');
}
