import React, { useState } from 'react';
import Header from './components/Header';
import SearchForm from './components/SearchForm';
import ResultCard from './components/ResultCard';
import StudentDirectoryModal from './components/StudentDirectoryModal';
import PassCardModal from './components/PassCardModal';
import { MOCK_STUDENTS } from './data/studentsMock';
import { CheckCircle2, ShieldCheck, Clock, Users, ExternalLink } from 'lucide-react';

export default function App() {
  const [students, setStudents] = useState(MOCK_STUDENTS);
  const [searchedId, setSearchedId] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  
  // Modals state
  const [isDirectoryOpen, setIsDirectoryOpen] = useState(false);
  const [passStudent, setPassStudent] = useState(null);

  // Search Logic
  const handleSearch = (studentId) => {
    setIsSearching(true);
    setSearchedId(studentId);
    
    // Simulate swift network lookup
    setTimeout(() => {
      const found = students.find((s) => s.id === studentId);
      setSearchResult(found || null);
      setIsSearching(false);
      setHasSearched(true);
    }, 400);
  };

  const handleClear = () => {
    setSearchedId('');
    setSearchResult(null);
    setHasSearched(false);
  };

  // Quick stats calculation
  const totalStudents = students.length;
  const approvedCount = students.filter(s => s.status === 'APPROVED').length;
  const totalVolunteerHours = Math.round(students.reduce((sum, s) => sum + (s.totalHoursNumeric || 0), 0) * 10) / 10;

  return (
    <div class="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white font-['Prompt',sans-serif]">
      {/* Background Subtle Gradient Blobs */}
      <div class="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-blue-900/20 via-indigo-900/10 to-transparent blur-3xl pointer-events-none -z-10"></div>

      {/* Main Centered Container */}
      <main class="w-full max-w-lg mx-auto px-4 sm:px-6 py-8 sm:py-12 flex-1 flex flex-col items-center justify-center">
        
        {/* Application Header */}
        <Header 
          onOpenDirectory={() => setIsDirectoryOpen(true)}
          totalStudents={totalStudents}
        />

        {/* Core Search Form Component */}
        <SearchForm 
          onSearch={handleSearch}
          onClear={handleClear}
          isSearching={isSearching}
          sampleIds={students}
        />

        {/* Display Result Card (Conditional Render) */}
        {hasSearched && !isSearching && (
          <div class="w-full mt-6">
            <ResultCard 
              searchedId={searchedId}
              searchResult={searchResult}
              onOpenPass={(st) => setPassStudent(st)}
            />
          </div>
        )}

        {/* System Summary Stats Counter Chips */}
        <div class="w-full grid grid-cols-3 gap-2 sm:gap-3 mt-8 pt-6 border-t border-slate-800/80">
          <div class="bg-slate-900/70 border border-slate-800 p-2.5 rounded-xl text-center">
            <p class="text-[11px] text-slate-400 font-medium">นิสิตทั้งหมด</p>
            <p class="text-base font-bold text-blue-400 font-mono">{totalStudents} คน</p>
          </div>
          <div class="bg-slate-900/70 border border-slate-800 p-2.5 rounded-xl text-center">
            <p class="text-[11px] text-slate-400 font-medium">ผ่านการอนุมัติ</p>
            <p class="text-base font-bold text-emerald-400 font-mono">{approvedCount} คน</p>
          </div>
          <div class="bg-slate-900/70 border border-slate-800 p-2.5 rounded-xl text-center">
            <p class="text-[11px] text-slate-400 font-medium">รวมชั่วโมงสะสม</p>
            <p class="text-base font-bold text-amber-400 font-mono">{totalVolunteerHours} ชม.</p>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer class="w-full py-5 text-center text-xs text-slate-400 border-t border-slate-900 bg-slate-950/80">
        <div class="max-w-lg mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© 2026 ระบบตรวจสอบสถานะผู้เข้าร่วมกิจกรรมนิสิต</span>
          <button 
            onClick={() => setIsDirectoryOpen(true)}
            class="text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>ดูรหัสนิสิตทั้งหมด</span>
            <ExternalLink class="w-3 h-3" />
          </button>
        </div>
      </footer>

      {/* Directory Modal */}
      <StudentDirectoryModal 
        isOpen={isDirectoryOpen}
        onClose={() => setIsDirectoryOpen(false)}
        students={students}
        onSelectStudent={handleSearch}
      />

      {/* Pass Card Digital Modal */}
      <PassCardModal 
        student={passStudent}
        isOpen={!!passStudent}
        onClose={() => setPassStudent(null)}
      />
    </div>
  );
}
