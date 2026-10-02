const fs = require('fs');
let file = 'd:/Coding/lomba website sekolah/smkn-1-sorong-student-hub/src/App.tsx';
let data = fs.readFileSync(file, 'utf8');

data = data.replace("onEditNote={(student) => {\n                    setSelectedStudentForAttachment(student);\n                    setAttachmentModalMode('view'); // Just view for siswa\n                  }}", "onEditNote={(student) => {\n                    setSelectedStudentForAttachment(student);\n                    setAttachmentModalMode('view'); // Just view for siswa\n                  }}\n                  isDraftSavedOffline={isDraftSavedOffline}\n                  onNavigateHome={() => setCurrentTab('beranda')}\n                  containerWidthClass=\"max-w-md mx-auto\"");

fs.writeFileSync(file, data);
console.log('Fixed missing props in App.tsx');
