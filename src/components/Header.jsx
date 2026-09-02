import React from 'react';
import { Award, Users, Sparkles, Recycle } from 'lucide-react';

export default function Header({ onOpenDirectory, totalStudents }) {
  return (
    <header class="w-full text-center space-y-3 mb-8">
      {/* Top Tagline Badge */}
      <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/80 border border-blue-800/60 text-blue-300 text-xs font-medium backdrop-blur-md shadow-sm">
        <Recycle class="w-4 h-4 text-emerald-400 animate-spin-slow" />
        <span>ระบบตรวจสอบชั่วโมงจิตอาสา โครงการขยะแลกชั่วโมง</span>
        <span class="bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded-full text-[10px] font-semibold border border-emerald-700/60">
          Net-Zero
        </span>
      </div>

      {/* Main Title */}
      <div class="space-y-2">
        <h1 class="text-2xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-blue-200 tracking-tight">
          ตรวจสอบสถานะผู้เข้าร่วมกิจกรรม
        </h1>
        <p class="text-slate-400 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
          กรอกรหัสนิสิต 8 หลัก เพื่อตรวจสอบชั่วโมงจิตอาสาและรายการขยะรีไซเคิลที่ได้รับการอนุมัติ
        </p>
      </div>

      {/* Action Chips */}
      <div class="flex items-center justify-center gap-3 pt-1">
        <button
          onClick={onOpenDirectory}
          class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700/90 text-slate-300 hover:text-white text-xs font-medium border border-slate-700 transition-all duration-200 shadow-sm active:scale-95 cursor-pointer"
        >
          <Users class="w-3.5 h-3.5 text-blue-400" />
          <span>ดูรายชื่อนิสิตทั้งหมด ({totalStudents} รายการ)</span>
        </button>
      </div>
    </header>
  );
}
