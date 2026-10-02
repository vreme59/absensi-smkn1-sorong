const fs = require('fs');
let file = 'd:/Coding/lomba website sekolah/smkn-1-sorong-student-hub/src/App.tsx';
let data = fs.readFileSync(file, 'utf8');

const oldSiswaView = /supabaseRole === 'siswa' \? \([\s\S]*?Kembali ke Beranda<\/button>\s*<\/div>\s*\)\s*:\s*\(/;
const newSiswaView = `supabaseRole === 'siswa' ? (
              <div className="w-full max-w-md mx-auto pb-20">
                <AttendanceScreen
                  readOnly={true}
                  students={oldStudents}
                  onUpdateStudentStatus={handleUpdateStudentStatus}
                  onMarkAllPresent={handleMarkAllPresent}
                  onOpenSubmitModal={() => setIsSubmitModalOpen(true)}
                  onSaveOfflineDraft={handleSaveOfflineDraft}
                  onViewAttachment={(student) => {
                    setSelectedStudentForAttachment(student);
                    setAttachmentModalMode('view');
                  }}
                  onEditNote={(student) => {
                    setSelectedStudentForAttachment(student);
                    setAttachmentModalMode('view'); // Just view for siswa
                  }}
                />
              </div>
            ) : (`;

data = data.replace(oldSiswaView, newSiswaView);
fs.writeFileSync(file, data);
console.log('Replaced Akses Terbatas with readOnly AttendanceScreen');
