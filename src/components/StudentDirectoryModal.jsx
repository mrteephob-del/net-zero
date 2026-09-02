import React, { useState } from 'react';
import { X, Search, UserCheck, ShieldCheck, Clock, AlertTriangle, ArrowRight, Calendar } from 'lucide-react';

export default function StudentDirectoryModal({ isOpen, onClose, students, onSelectStudent }) {
  const [filterQuery, setFilterQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('ALL');

  if (!isOpen) return null;

  const filteredStudents = students.filter(student => {
    const matchesQuery = 
      student.id.includes(filterQuery) ||
      student.fullName.includes(filterQuery) ||
      student.faculty.includes(filterQuery);
    
    const matchesStatus = statusFilter === 'ALL' || student.status === statusFilter;
    const matchesDate = dateFilter === 'ALL' || (student.regDateText && student.regDateText.includes(dateFilter));

    return matchesQuery && matchesStatus && matchesDate;
  });

  return (
    <div class="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div class="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div class="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div>
            <h3 class="text-lg font-bold text-white flex items-center gap-2">
              <span>📋 รายชื่อนิสิตโครงการจิตอาสา (ข้อมูลจริง)</span>
              <span class="text-xs font-mono bg-blue-950 border border-blue-800 text-blue-300 px-2 py-0.5 rounded-full">
                {filteredStudents.length} รายการ
              </span>
            </h3>
            <p class="text-xs text-slate-400">คลิกที่รายการรหัสนิสิตเพื่อนำไปค้นหาทันที</p>
          </div>

          <button
            onClick={onClose}
            class="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        {/* Filter Controls */}
        <div class="p-4 bg-slate-950/50 border-b border-slate-800 flex flex-col sm:flex-row gap-3">
          <div class="relative flex-1">
            <Search class="w-4 h-4 absolute left-3 top-3 text-slate-500" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="ค้นหาชื่อ, รหัสนิสิต, คณะ..."
              class="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            class="bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">วันที่ลงทะเบียนทั้งหมด</option>
            <option value="วันที่ 3">ลงทะเบียนวันที่ 3</option>
            <option value="วันที่ 4">ลงทะเบียนวันที่ 4</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            class="bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">สถานะทั้งหมด</option>
            <option value="APPROVED">อนุมัติแล้ว</option>
            <option value="PENDING">ยังไม่ถึงเกณฑ์ / รอตรวจสอบ</option>
          </select>
        </div>

        {/* Student List Scrollable */}
        <div class="p-4 overflow-y-auto space-y-2.5 flex-1 max-h-[50vh]">
          {filteredStudents.length === 0 ? (
            <div class="py-12 text-center text-slate-500 text-sm">
              ไม่พบรายชื่อที่ตรงกับเงื่อนไขการค้นหา
            </div>
          ) : (
            filteredStudents.map((student) => (
              <div
                key={student.id}
                onClick={() => {
                  onSelectStudent(student.id);
                  onClose();
                }}
                class="p-3.5 bg-slate-800/80 hover:bg-blue-950/60 border border-slate-700/70 hover:border-blue-500/60 rounded-xl transition-all duration-150 flex items-center justify-between gap-3 cursor-pointer group"
              >
                <div class="flex items-center gap-3">
                  <span class="font-mono text-sm font-bold text-blue-400 group-hover:text-blue-300 bg-slate-900 px-2.5 py-1 rounded border border-slate-700">
                    {student.id}
                  </span>
                  <div>
                    <p class="text-sm font-semibold text-slate-100 group-hover:text-white flex items-center gap-2">
                      <span>{student.fullName}</span>
                      <span class="text-[10px] text-indigo-300 bg-indigo-950 border border-indigo-800 px-2 py-0.5 rounded flex items-center gap-1 font-normal">
                        <Calendar class="w-3 h-3 text-indigo-400" />
                        <span>{student.regDateText ? `ลงทะเบียน${student.regDateText}` : 'ลงทะเบียนแล้ว'}</span>
                      </span>
                    </p>
                    <p class="text-xs text-slate-400">
                      {student.faculty} {student.major ? `• ${student.major}` : ''} ({student.year})
                    </p>
                  </div>
                </div>

                <div class="flex items-center gap-2">
                  <span class={`text-[11px] px-2.5 py-1 rounded-full font-medium border ${
                    student.status === 'APPROVED' ? 'bg-emerald-950/80 border-emerald-700 text-emerald-300' :
                    student.status === 'NEEDS_DOC' ? 'bg-teal-950/80 border-teal-700 text-teal-300' :
                    'bg-amber-950/80 border-amber-700 text-amber-300'
                  }`}>
                    {student.totalHours} {typeof student.totalHours === 'number' || (!isNaN(student.totalHours) && !String(student.totalHours).includes('ชั่วโมง')) ? 'ชม.' : ''}
                  </span>
                  <ArrowRight class="w-4 h-4 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div class="p-4 border-t border-slate-800 bg-slate-900/90 text-right">
          <button
            onClick={onClose}
            class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
}
