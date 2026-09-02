import React, { useState } from 'react';
import { Search, AlertCircle, CheckCircle2, Hash, RefreshCw } from 'lucide-react';

export default function SearchForm({ onSearch, onClear, isSearching, sampleIds }) {
  const [studentId, setStudentId] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  // Filter input: Numeric only & max 8 characters
  const handleInputChange = (e) => {
    const value = e.target.value;
    
    // Allow only numeric digits 0-9
    const numericValue = value.replace(/\D/g, '');
    
    // Limit length to 8 digits maximum
    const trimmedValue = numericValue.slice(0, 8);
    
    setStudentId(trimmedValue);

    // Validation feedback for 8 digits
    if (trimmedValue.length > 0 && trimmedValue.length < 8) {
      setErrorMsg(`กรุณากรอกรหัสนิสิตให้ครบ 8 หลัก (ปัจจุบันกรอกแล้ว ${trimmedValue.length}/8 หลัก)`);
    } else {
      setErrorMsg('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (studentId.length === 8) {
      onSearch(studentId);
    }
  };

  const handleSelectSample = (id) => {
    setStudentId(id);
    setErrorMsg('');
    onSearch(id);
  };

  const handleReset = () => {
    setStudentId('');
    setErrorMsg('');
    onClear();
  };

  // Button disabled logic: Disabled if length !== 8 or searching
  const isSubmitDisabled = studentId.length !== 8 || isSearching;

  return (
    <div class="w-full bg-slate-800/80 backdrop-blur-xl border border-slate-700/80 rounded-2xl p-5 sm:p-7 shadow-xl shadow-slate-950/40 relative overflow-hidden transition-all duration-300">
      {/* Decorative Gradient Line at top */}
      <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400"></div>

      <form onSubmit={handleSubmit} class="space-y-4">
        {/* Form Title & Label */}
        <div class="flex items-center justify-between">
          <label htmlFor="student-id-input" class="block text-sm font-semibold text-slate-200 flex items-center gap-1.5">
            <Hash class="w-4 h-4 text-blue-400" />
            <span>กรอกรหัสนิสิต (8 หลัก)</span>
            <span class="text-rose-400 text-xs">*</span>
          </label>
          <span class={`text-xs font-mono px-2 py-0.5 rounded-md border transition-colors ${
            studentId.length === 8
              ? 'bg-emerald-950/60 border-emerald-700/60 text-emerald-400'
              : 'bg-slate-900 border-slate-700 text-slate-400'
          }`}>
            {studentId.length} / 8 หลัก
          </span>
        </div>

        {/* Input Box Wrapper */}
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search class={`w-5 h-5 transition-colors ${isFocused ? 'text-blue-400' : 'text-slate-400'}`} />
          </div>

          <input
            id="student-id-input"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={8}
            value={studentId}
            onChange={handleInputChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="ตัวอย่าง: 67472299, 67347672"
            class={`w-full pl-11 pr-24 py-3.5 bg-slate-900/90 border rounded-xl text-lg font-mono tracking-widest text-white placeholder-slate-500 focus:outline-none transition-all duration-200 ${
              errorMsg
                ? 'border-rose-500/80 focus:ring-2 focus:ring-rose-500/30'
                : studentId.length === 8
                ? 'border-emerald-500/80 focus:ring-2 focus:ring-emerald-500/30'
                : 'border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30'
            }`}
            aria-label="รหัสนิสิต 8 หลัก"
          />

          {/* Quick Clear Button inside input */}
          {studentId && (
            <button
              type="button"
              onClick={handleReset}
              class="absolute inset-y-0 right-3 my-auto h-7 px-2 text-xs text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-md transition-colors flex items-center gap-1 cursor-pointer"
              title="ล้างข้อมูล"
            >
              <RefreshCw class="w-3 h-3" />
              <span>ล้าง</span>
            </button>
          )}
        </div>

        {/* Real-time Validation Message below input */}
        {errorMsg ? (
          <div class="flex items-center gap-1.5 text-xs text-rose-400 bg-rose-950/40 border border-rose-800/40 px-3 py-2 rounded-lg animate-fadeIn">
            <AlertCircle class="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        ) : studentId.length === 8 ? (
          <div class="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-3 py-1.5 rounded-lg animate-fadeIn">
            <CheckCircle2 class="w-4 h-4 shrink-0 text-emerald-400" />
            <span>รหัสนิสิตครบ 8 หลักแล้ว พร้อมสำหรับการตรวจสอบ</span>
          </div>
        ) : (
          <p class="text-xs text-slate-400 leading-relaxed">
            * ระบบรับเฉพาะตัวเลข 0-9 ความยาว 8 หลักเท่านั้น (เช่น 67472299, 67347672)
          </p>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitDisabled}
          class={`w-full py-3.5 px-6 rounded-xl font-medium text-base shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
            isSubmitDisabled
              ? 'bg-slate-700/60 text-slate-400 cursor-not-allowed border border-slate-700'
              : 'bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white border border-blue-400/30 hover:shadow-blue-600/30 hover:shadow-xl active:scale-[0.99] shine-effect'
          }`}
        >
          {isSearching ? (
            <>
              <div class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>กำลังตรวจสอบข้อมูล...</span>
            </>
          ) : (
            <>
              <Search class="w-5 h-5" />
              <span>ตรวจสอบข้อมูล</span>
            </>
          )}
        </button>
      </form>


    </div>
  );
}
