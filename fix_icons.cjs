const fs = require('fs');

let html = fs.readFileSync('d:/Coding/lomba website sekolah/smkn-1-sorong-student-hub/index.html', 'utf8');

// The original tag inside the file
const searchStr = '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap" rel="stylesheet" />';

// The new tags
const replaceStr = '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap" rel="stylesheet" />\n    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block" rel="stylesheet" />';

if (html.includes(searchStr)) {
    html = html.replace(searchStr, replaceStr);
    fs.writeFileSync('d:/Coding/lomba website sekolah/smkn-1-sorong-student-hub/index.html', html);
    console.log('Fixed index.html');
} else {
    console.log('String not found in index.html');
}

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
    console.log('Fixed index.css');
}
