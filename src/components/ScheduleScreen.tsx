import React, { useState } from 'react';
import { Calendar, Clock, MapPin, User, BookOpen, AlertCircle, CheckCircle } from 'lucide-react';
import { TODAY_SCHEDULE } from '../data/schedule';

export const ScheduleScreen: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState<'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Senin'>('Selasa');

  const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'] as const;

  return (
    <div className="flex flex-col w-full pb-28">
      {/* Blue Header */}
      <div className="bg-[#005fa0] text-white px-4 pt-4 pb-5 shadow-sm">
        <h2 className="text-lg font-bold font-heading">Jadwal Pelajaran XI RPL 1</h2>
        <p className="text-xs text-sky-200 mt-0.5">SMK Negeri 1 Sorong • Semester Genap 2024</p>

        {/* Day Selector Tabs */}
        <div className="flex items-center gap-1.5 mt-3 overflow-x-auto no-scrollbar">
          {days.map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                selectedDay === day
                  ? 'bg-white text-[#005fa0] shadow-sm font-bold'
                  : 'bg-white/15 text-white hover:bg-white/25'
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      {/* Schedule Items List */}
      <div className="px-4 mt-4 space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>Hari Terpilih: <strong>{selectedDay}, 14 Mei 2024</strong></span>
          <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold">
            4 Sesi Mapel
          </span>
        </div>

        {TODAY_SCHEDULE.map((item) => (
          <div
            key={item.period}
            className={`bg-white rounded-2xl p-4 shadow-sm border transition-all ${
              item.status === 'active'
                ? 'border-sky-400 ring-2 ring-sky-100 bg-sky-50/20'
                : 'border-slate-200'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-[#005fa0]/10 text-[#005fa0] font-bold text-xs flex items-center justify-center">
                  #{item.period}
                </span>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 leading-tight">
                    {item.subject}
                  </h3>
                  <span className="text-[11px] font-mono text-slate-500">Kode: {item.code}</span>
                </div>
              </div>

              {item.status === 'active' ? (
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping"></span>
                  Sedang Berlangsung
                </span>
              ) : (
                <span className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                  Mendatang
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-100 text-xs">
              <div className="flex items-center gap-1.5 text-slate-600">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{item.timeRange}</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-600">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-semibold text-slate-800">{item.room}</span>
              </div>
              <div className="col-span-2 flex items-center gap-1.5 text-slate-700 bg-slate-50 p-2 rounded-lg mt-1">
                <User className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                <span>Pengampu: <strong>{item.teacher}</strong></span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
