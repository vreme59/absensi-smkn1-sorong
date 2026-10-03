const fs = require('fs');

let file = 'd:/Coding/lomba website sekolah/smkn-1-sorong-student-hub/src/components/EditProfileScreen.tsx';
let data = fs.readFileSync(file, 'utf8');

// 1. Remove viewMode state
data = data.replace(/const \[viewMode, setViewMode\] = useState<.*?>\('mobile'\);\n/, '');

// 2. Replace the top wrapper up to {/* Navigation Bar */}
// We match from `return (` up to `{/* Navigation Bar */}`
const startRegex = /return \([\s\S]*?\{\/\* Navigation Bar \*\/\}/;
const newStart = `return (
    <div className="w-full min-h-screen bg-slate-50 flex flex-col relative pb-20 selection:bg-[#005fa0] selection:text-white">
      {/* Navigation Bar */}`;
data = data.replace(startRegex, newStart);

// 3. Remove the extra closing </div> at the end.
// Currently it ends with:
//         </div>
//       </div>
//     </div>
//   );
// }
// We replaced two opening divs (`min-h-screen` and `Main Container Card`) with ONE opening div (`w-full min-h-screen`).
// So we need to remove ONE closing div at the end.
const endRegex = /<\/div>\s*<\/div>\s*\);\s*\}/;
const newEnd = `</div>\n  );\n}`;
data = data.replace(endRegex, newEnd);

fs.writeFileSync(file, data);
console.log('Cleaned up device mock wrappers');
