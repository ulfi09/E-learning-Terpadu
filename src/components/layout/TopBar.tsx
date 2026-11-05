import React from 'react';
import { Menu, Calendar, Sparkles, Check, AlertCircle, Info, X, LogOut } from 'lucide-react';
import { useLms } from '../../context/LmsContext';

interface TopBarProps {
  onToggleSidebar: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onToggleSidebar }) => {
  const { role, switchRole, activeNav, currentUser, toasts, removeToast, logout } = useLms();

  const getBreadcrumbTitle = () => {
    switch (activeNav) {
      case 'dashboard':
        return role === 'guru' ? 'Ringkasan Kelas & Pantauan Akademik' : 'Dashboard Progres Belajar';
      case 'students':
        return 'Manajemen Data Siswa & Rombel';
      case 'courses':
        return 'Manajemen Mata Pelajaran';
      case 'modules':
        return role === 'guru' ? 'Kelola & Publikasi Materi Ajar' : 'Modul Materi & Bahan Bacaan';
      case 'assignments':
        return role === 'guru' ? 'Manajemen Tugas & Penilaian Deadline' : 'Pengumpulan Tugas Kuliah';
      case 'exams':
        return role === 'guru' ? 'Bank Soal & Penilaian Ujian' : 'Ujian & Kuis Berbasis Timer';
      case 'grades':
        return role === 'guru' ? 'Buku Nilai (Gradebook) Otomatis' : 'Rekapitulasi Nilai & Transkrip';
      case 'attendance':
        return role === 'guru' ? 'Rekap Kehadiran Kelas Harian' : 'Presensi Harian Siswa';
      case 'forum':
        return role === 'guru' ? 'Panel Moderasi Diskusi Kelas' : 'Forum Diskusi Kolaboratif';
      default:
        return 'Sistem Akademik';
    }
  };

  const currentDateFormatted = 'Rabu, 4 November 2026';

  return (
    <>
      <header className="sticky top-0 z-30 flex items-center justify-between h-18 px-4 sm:px-6 bg-white/95 backdrop-blur-md border-b border-slate-200">
        {/* Left Section: Mobile Toggle + Breadcrumb */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 lg:hidden"
            aria-label="Buka navigasi sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-xs sm:text-sm">
            <span className="font-semibold text-slate-800 hidden sm:inline">Lentera Edu</span>
            <span className="text-slate-400 hidden sm:inline" aria-hidden="true">/</span>
            <span className="font-medium text-indigo-600 truncate max-w-[200px] sm:max-w-none">
              {getBreadcrumbTitle()}
            </span>
          </div>
        </div>

        {/* Right Section: Role Switcher, User Status & Logout */}
        <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
          {/* Academic Date & Semester */}
          <div className="hidden md:flex items-center gap-2 text-xs text-slate-500">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{currentDateFormatted}</span>
            <span aria-hidden="true">·</span>
            <span>Sem. Ganjil 2026/2027</span>
          </div>

          {/* Interactive Role Switcher Toggle */}
          <div className="flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200/80">
            <button
              onClick={() => switchRole('siswa')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all whitespace-nowrap shrink-0 ${
                role === 'siswa'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Siswa
            </button>
            <button
              onClick={() => switchRole('guru')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all whitespace-nowrap shrink-0 ${
                role === 'guru'
                  ? 'bg-white text-amber-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Guru
            </button>
          </div>

          {/* Avatar Pill */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full object-cover border border-slate-200"
              referrerPolicy="no-referrer"
            />
            <div className="hidden xl:block text-left">
              <div className="text-xs font-semibold text-slate-800 leading-tight">
                {currentUser.name}
              </div>
              <div className="text-[11px] text-slate-500">
                {role === 'guru' ? 'Pengajar' : 'Siswa'}
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition-colors shrink-0"
            title="Keluar dari akun Anda"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Keluar</span>
          </button>
        </div>
      </header>

      {/* Floating Toasts */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => {
          return (
            <div
              key={toast.id}
              className="pointer-events-auto flex items-start gap-3 p-3.5 bg-white text-slate-800 border border-slate-200 rounded-xl shadow-lg animate-in slide-in-from-bottom-2 duration-200"
            >
              <div className="mt-0.5 shrink-0">
                {toast.type === 'success' && <Check className="w-4 h-4 text-emerald-600" />}
                {toast.type === 'warning' && <AlertCircle className="w-4 h-4 text-amber-600" />}
                {toast.type === 'info' && <Info className="w-4 h-4 text-indigo-600" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-slate-900">{toast.title}</div>
                <div className="text-xs text-slate-600 mt-0.5">{toast.message}</div>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
};
