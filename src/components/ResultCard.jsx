import React from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  User, 
  GraduationCap, 
  Award, 
  QrCode, 
  Recycle, 
  AlertTriangle,
  Sparkles,
  Calendar,
  UserCheck,
  UserX
} from 'lucide-react';

export default function ResultCard({ searchResult, searchedId, onOpenPass }) {
  if (!searchedId) return null;

  // Case 1: NOT FOUND
  if (!searchResult) {
    return (
      <div class="w-full bg-slate-800/90 border border-rose-800/60 rounded-2xl p-6 sm:p-7 shadow-xl shadow-rose-950/20 text-center space-y-4 animate-fadeIn">
        <div class="w-14 h-14 bg-rose-950/80 border border-rose-700/60 text-rose-400 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <XCircle class="w-8 h-8" />
        </div>

        <div class="space-y-1.5">
          <h3 class="text-xl font-bold text-rose-400">
            ไม่พบข้อมูลรหัสนิสิตนี้ในระบบ
          </h3>
          <p class="text-slate-300 text-sm font-mono tracking-wider">
            รหัสนิสิต: <span class="bg-rose-950/80 px-2 py-0.5 rounded border border-rose-800/60 text-rose-300 font-bold">{searchedId}</span>
          </p>
        </div>

        <div class="bg-slate-900/80 rounded-xl p-4 border border-slate-700/80 text-left text-xs text-slate-300 space-y-2">
          <p class="font-semibold text-slate-200 flex items-center gap-1.5">
            <AlertTriangle class="w-4 h-4 text-amber-400 shrink-0" />
            <span>คำแนะนำเพิ่มเติม:</span>
          </p>
          <ul class="list-disc list-inside space-y-1 text-slate-400">
            <li>ตรวจสอบรหัสนิสิต 8 หลักให้อีกครั้ง</li>
            <li>หากท่านได้ส่งขยะ/แนบหลักฐานแล้ว กรุณาติดต่อคณะกรรมการจิตอาสา</li>
            <li>สายด่วนฝ่ายทะเบียนโครงการ Net-Zero: <span class="text-blue-400 font-mono font-semibold">02-123-4567</span></li>
          </ul>
        </div>
      </div>
    );
  }

  // Helper for Badge Color & Styles
  const getBadgeStyle = (status, isAttended) => {
    if (status === 'APPROVED' || isAttended) {
      return {
        bg: 'bg-emerald-950/90 border-emerald-500/60 text-emerald-300',
        dot: 'bg-emerald-400 animate-pulse',
        icon: CheckCircle2,
        iconColor: 'text-emerald-400'
      };
    }
    if (status === 'NOT_ATTENDED' || !isAttended) {
      return {
        bg: 'bg-rose-950/90 border-rose-500/60 text-rose-300',
        dot: 'bg-rose-400',
        icon: XCircle,
        iconColor: 'text-rose-400'
      };
    }
    return {
      bg: 'bg-amber-950/90 border-amber-500/60 text-amber-300',
      dot: 'bg-amber-400 animate-ping',
      icon: Clock,
      iconColor: 'text-amber-400'
    };
  };

  const badgeStyle = getBadgeStyle(searchResult.status, searchResult.isAttended);
  const StatusIcon = badgeStyle.icon;

  return (
    <div class="w-full bg-slate-800/90 backdrop-blur-xl border border-slate-700/80 rounded-2xl p-6 sm:p-7 shadow-2xl shadow-blue-950/30 space-y-6 animate-fadeIn relative overflow-hidden">
      {/* Top Card Header */}
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-700/80">
        <div class="flex items-center gap-3">
          <img 
            src={searchResult.avatar} 
            alt={searchResult.fullName}
            class="w-13 h-13 rounded-full border-2 border-blue-500/60 bg-slate-900 object-cover shadow-md"
          />
          <div>
            <div class="flex items-center gap-2">
              <span class="text-xs text-blue-400 font-medium">ข้อมูลนิสิตโครงการจิตอาสา</span>
              <span class="text-[10px] bg-blue-950 border border-blue-800 text-blue-300 px-2 py-0.5 rounded font-mono">
                {searchResult.id}
              </span>
            </div>
            <h2 class="text-xl font-bold text-white tracking-tight">
              {searchResult.fullName}
            </h2>
          </div>
        </div>

        {/* Status Badge */}
        <div class={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-semibold shadow-md ${badgeStyle.bg}`}>
          <span class={`w-2 h-2 rounded-full ${badgeStyle.dot}`}></span>
          <StatusIcon class={`w-4 h-4 ${badgeStyle.iconColor}`} />
          <span>{searchResult.statusText}</span>
        </div>
      </div>

      {/* Main Details Grid */}
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-slate-200 text-sm">
        {/* Item 1: Student ID & Year */}
        <div class="bg-slate-900/80 p-3.5 rounded-xl border border-slate-700/60 flex items-start gap-3">
          <div class="p-2 rounded-lg bg-blue-950/80 border border-blue-800/60 text-blue-400 shrink-0">
            <User class="w-4 h-4" />
          </div>
          <div>
            <p class="text-xs text-slate-400 font-medium">รหัสนิสิต / ชั้นปี</p>
            <p class="text-base font-bold font-mono text-white tracking-wider">
              {searchResult.id}
            </p>
            <p class="text-xs text-blue-300 font-medium">
              {searchResult.year}
            </p>
          </div>
        </div>

        {/* Item 2: Faculty & Major */}
        <div class="bg-slate-900/80 p-3.5 rounded-xl border border-slate-700/60 flex items-start gap-3">
          <div class="p-2 rounded-lg bg-blue-950/80 border border-blue-800/60 text-blue-400 shrink-0">
            <GraduationCap class="w-4 h-4" />
          </div>
          <div>
            <p class="text-xs text-slate-400 font-medium">คณะ / สาขาวิชา</p>
            <p class="text-sm font-semibold text-white leading-tight">
              {searchResult.faculty}
            </p>
            {searchResult.major && (
              <p class="text-xs text-slate-300 pt-0.5">
                {searchResult.major}
              </p>
            )}
          </div>
        </div>

        {/* Item 3: Attendance Status (สถานะการเข้าร่วมกิจกรรม) */}
        <div class={`p-3.5 rounded-xl border flex items-start gap-3 ${
          searchResult.isAttended 
            ? 'bg-emerald-950/30 border-emerald-800/60' 
            : 'bg-rose-950/30 border-rose-800/60'
        }`}>
          <div class={`p-2 rounded-lg shrink-0 border ${
            searchResult.isAttended
              ? 'bg-emerald-950/80 border-emerald-700/60 text-emerald-400'
              : 'bg-rose-950/80 border-rose-700/60 text-rose-400'
          }`}>
            {searchResult.isAttended ? <UserCheck class="w-4 h-4" /> : <UserX class="w-4 h-4" />}
          </div>
          <div>
            <p class="text-xs text-slate-400 font-medium">สถานะการเข้าร่วมกิจกรรม</p>
            <div class="flex items-center gap-1.5 mt-0.5">
              {searchResult.isAttended ? (
                <span class="text-sm font-bold text-emerald-300 flex items-center gap-1">
                  <CheckCircle2 class="w-4 h-4 text-emerald-400 inline shrink-0" />
                  เข้าร่วมกิจกรรม
                </span>
              ) : (
                <span class="text-sm font-bold text-rose-400 flex items-center gap-1">
                  <XCircle class="w-4 h-4 text-rose-400 inline shrink-0" />
                  ไม่ได้เข้าร่วมกิจกรรม
                </span>
              )}
            </div>
            <p class="text-[11px] text-slate-400 pt-0.5">
              {searchResult.isAttended ? 'เช็คชื่อในระบบเรียบร้อย' : 'ไม่พบข้อมูลการเช็คชื่อเข้าร่วม'}
            </p>
          </div>
        </div>

        {/* Item 4: Registration Date (วันที่ลงทะเบียน) */}
        <div class="bg-slate-900/80 p-3.5 rounded-xl border border-slate-700/60 flex items-start gap-3">
          <div class="p-2 rounded-lg bg-indigo-950/80 border border-indigo-800/60 text-indigo-400 shrink-0">
            <Calendar class="w-4 h-4" />
          </div>
          <div>
            <p class="text-xs text-slate-400 font-medium">วันที่ลงทะเบียน</p>
            <p class="text-sm font-bold text-indigo-300 mt-0.5">
              {searchResult.regDateText ? `ลงทะเบียน${searchResult.regDateText}` : 'ลงทะเบียนตามประกาศ'}
            </p>
            <p class="text-[11px] text-slate-400 pt-0.5">
              โครงการขยะแลกชั่วโมง
            </p>
          </div>
        </div>

        {/* Item 5: Volunteer Hours (Span full width for emphasis) */}
        <div class="sm:col-span-2 bg-gradient-to-r from-amber-950/30 via-slate-900/90 to-amber-950/20 p-4 rounded-xl border border-amber-800/40 flex items-center justify-between gap-3">
          <div class="flex items-center gap-3">
            <div class="p-2.5 rounded-xl bg-amber-950/80 border border-amber-800/60 text-amber-400 shrink-0">
              <Award class="w-5 h-5" />
            </div>
            <div>
              <p class="text-xs text-slate-400 font-medium">รวมชั่วโมงจิตอาสาที่ได้รับ</p>
              <p class="text-xs text-slate-400">
                {searchResult.isAttended ? 'บันทึกชั่วโมงจิตอาสาแล้ว' : 'รอการเข้าร่วมกิจกรรมเพื่อบันทึกชั่วโมง'}
              </p>
            </div>
          </div>
          <div class="text-right">
            <p class="text-2xl font-extrabold text-amber-300 font-mono tracking-tight">
              {searchResult.totalHours} <span class="text-sm font-sans font-semibold text-amber-400/90">ชั่วโมง</span>
            </p>
          </div>
        </div>
      </div>

      {/* Submissions Detail Accordion / Recycle Summary */}
      {searchResult.submissions && searchResult.submissions.length > 0 && (
        <div class="bg-slate-900/90 rounded-xl p-4 border border-slate-700/80 space-y-3">
          <p class="text-xs font-semibold text-slate-300 flex items-center gap-1.5 border-b border-slate-800 pb-2">
            <Recycle class="w-4 h-4 text-emerald-400" />
            <span>ประวัติรายการกิจกรรมจิตอาสา (รวม {searchResult.submissions.length} รอบรายการ):</span>
          </p>

          <div class="space-y-2 text-xs">
            {searchResult.submissions.map((sub, idx) => (
              <div key={idx} class="bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/50 flex flex-wrap items-center justify-between gap-2">
                <div class="flex items-center gap-2">
                  <span class="bg-indigo-950 text-indigo-300 text-[10px] font-medium px-2.5 py-0.5 rounded border border-indigo-800">
                    {sub.batch}
                  </span>
                  {sub.attended ? (
                    <span class="bg-emerald-950/90 text-emerald-300 text-[10px] font-medium px-2 py-0.5 rounded border border-emerald-800 flex items-center gap-1">
                      <CheckCircle2 class="w-3 h-3 text-emerald-400" />
                      <span>เข้าร่วมกิจกรรม</span>
                    </span>
                  ) : (
                    <span class="bg-rose-950/90 text-rose-300 text-[10px] font-medium px-2 py-0.5 rounded border border-rose-800 flex items-center gap-1">
                      <XCircle class="w-3 h-3 text-rose-400" />
                      <span>ไม่ได้เข้าร่วมกิจกรรม</span>
                    </span>
                  )}
                  <span class="text-slate-300 text-[11px]">
                    {sub.details || `บันทึกกิจกรรมจิตอาสา (${sub.regDate || 'โครงการ'})`}
                  </span>
                </div>
                <span class="text-amber-400 font-mono font-bold">
                  +{sub.hours !== undefined ? sub.hours : sub.totalHours} ชม.
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Button: Digital Pass */}
      {onOpenPass && (
        <div class="pt-2">
          <button
            onClick={() => onOpenPass(searchResult)}
            class="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-blue-900/30 flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer active:scale-[0.99]"
          >
            <QrCode class="w-4 h-4" />
            <span>เปิดบัตรรับรองจิตอาสา (Digital Volunteer Pass)</span>
          </button>
        </div>
      )}

    </div>
  );
}
