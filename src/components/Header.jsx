import React from 'react';
import { Users, Recycle, RefreshCw, Sheet } from 'lucide-react';

export default function Header({ onOpenDirectory, totalStudents, isSyncing, onSync, sheetStatus }) {
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

      {/* Live Google Sheets Connection & Action Chips */}
      <div class="flex flex-wrap items-center justify-center gap-2 pt-1">
        {/* Sync Status Badge */}
        <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900/90 border border-slate-700/80 text-slate-300 text-xs">
          <span class={`w-2 h-2 rounded-full ${isSyncing ? 'bg-amber-400 animate-ping' : sheetStatus?.isLive ? 'bg-emerald-400' : 'bg-blue-400'}`}></span>
          <span class="text-[11px] text-slate-300">
            {isSyncing ? 'กำลังซิงค์ข้อมูล...' : sheetStatus?.isLive ? 'Google Sheets (สด Real-time)' : 'ข้อมูลในระบบ'}
          </span>
          <button
            onClick={onSync}
            disabled={isSyncing}
            title="กดเพื่อดึงข้อมูลล่าสุดจาก Google Sheets"
            class="ml-1 p-1 hover:bg-slate-800 rounded transition cursor-pointer text-slate-400 hover:text-blue-300 disabled:opacity-50"
          >
            <RefreshCw class={`w-3 h-3 ${isSyncing ? 'animate-spin text-blue-400' : ''}`} />
          </button>
        </div>

        {/* Directory Button */}
        <button
          onClick={onOpenDirectory}
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700/90 text-slate-300 hover:text-white text-xs font-medium border border-slate-700 transition-all duration-200 shadow-sm active:scale-95 cursor-pointer"
        >
          <Users class="w-3.5 h-3.5 text-blue-400" />
          <span>ดูรายชื่อนิสิต ({totalStudents} คน)</span>
        </button>
      </div>
    </header>
  );
}
