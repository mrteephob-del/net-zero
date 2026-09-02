import React, { useEffect } from 'react';
import { X, QrCode, CheckCircle2, Download, Printer, ShieldCheck, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function PassCardModal({ student, isOpen, onClose }) {
  useEffect(() => {
    if (isOpen && student) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    }
  }, [isOpen, student]);

  if (!isOpen || !student) return null;

  return (
    <div class="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div class="bg-gradient-to-b from-slate-900 via-slate-900 to-blue-950 border border-blue-600/40 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          class="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
        >
          <X class="w-5 h-5" />
        </button>

        {/* Digital Pass Header */}
        <div class="p-6 text-center space-y-2 border-b border-slate-800 bg-blue-950/40">
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-600 text-emerald-300 text-xs font-semibold">
            <Award class="w-3.5 h-3.5" />
            <span>ใบรับรองชั่วโมงจิตอาสา (Volunteer Pass)</span>
          </div>
          <h3 class="text-xl font-extrabold text-white">
            โครงการขยะแลกชั่วโมง Net-Zero
          </h3>
          <p class="text-xs text-slate-400">
            ระบบรับรองการบันทึกชั่วโมงจิตอาสาประจำปีการศึกษา 2569
          </p>
        </div>

        {/* Pass Ticket Body */}
        <div class="p-6 space-y-6 text-center">
          {/* Avatar & Student Info */}
          <div class="flex flex-col items-center space-y-2">
            <img
              src={student.avatar}
              alt={student.fullName}
              class="w-20 h-20 rounded-full border-4 border-blue-500 shadow-xl object-cover bg-slate-900"
            />
            <h4 class="text-lg font-bold text-white">
              {student.fullName}
            </h4>
            <div class="flex items-center gap-2">
              <span class="font-mono text-sm font-bold bg-slate-800 text-blue-300 px-3 py-1 rounded-lg border border-slate-700">
                รหัส: {student.id}
              </span>
              <span class="text-xs font-bold text-amber-300 bg-amber-950 px-2.5 py-1 rounded-lg border border-amber-800 font-mono">
                {student.totalHours} {typeof student.totalHours === 'number' || (!isNaN(student.totalHours) && !String(student.totalHours).includes('ชั่วโมง')) ? 'ชม.' : ''}
              </span>
            </div>
            <p class="text-xs text-slate-400 pt-1">
              {student.faculty} • {student.major} ({student.year})
            </p>
          </div>

          {/* QR Code Graphic Box */}
          <div class="bg-white p-4 rounded-2xl w-48 h-48 mx-auto shadow-inner flex flex-col items-center justify-center border-4 border-blue-600/30 relative">
            <svg class="w-36 h-36" viewBox="0 0 100 100">
              <path fill="#0f172a" d="M0,0 h30 v30 h-30 z M10,10 h10 v10 h-10 z M70,0 h30 v30 h-30 z M80,10 h10 v10 h-10 z M0,70 h30 v30 h-30 z M10,80 h10 v10 h-10 z M35,10 h5 v5 h-5 z M45,15 h10 v5 h-10 z M35,30 h25 v5 h-25 z M35,45 h15 v5 h-15 z M55,45 h10 v15 h-10 z M70,45 h15 v5 h-15 z M35,65 h10 v10 h-10 z M50,70 h20 v5 h-20 z M75,70 h20 v5 h-20 z M35,85 h30 v10 h-30 z M75,85 h15 v10 h-15 z M70,35 h25 v5 h-25 z" />
            </svg>
            <span class="text-[9px] font-mono text-slate-600 mt-1 font-bold">
              NETZERO-VOLUNTEER-{student.id}
            </span>
          </div>

          {/* Security Stamp */}
          <div class="flex items-center justify-center gap-1.5 text-xs text-slate-400 bg-slate-900/60 py-2 px-4 rounded-xl border border-slate-800">
            <ShieldCheck class="w-4 h-4 text-emerald-400" />
            <span>รับรองข้อมูลโดย โครงการขยะแลกชั่วโมงจิตอาสา</span>
          </div>
        </div>

        {/* Pass Card Footer Buttons */}
        <div class="p-4 border-t border-slate-800 bg-slate-950/80 flex gap-3">
          <button
            onClick={() => window.print()}
            class="flex-1 py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Printer class="w-4 h-4 text-slate-400" />
            <span>พิมพ์เอกสาร</span>
          </button>
          <button
            onClick={onClose}
            class="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>ปิดหน้าต่าง</span>
          </button>
        </div>
      </div>
    </div>
  );
}
