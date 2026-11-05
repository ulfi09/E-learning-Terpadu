import {
  LayoutDashboard,
  BookOpen,
  FileText,
  UploadCloud,
  CheckCircle2,
  Award,
  CalendarCheck,
  MessageSquare,
  Sparkles,
  ArrowRightLeft,
  X,
  GraduationCap,
  Briefcase,
  Users,
  LogOut,
} from 'lucide-react';
import { useLms } from '../../context/LmsContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { role, switchRole, activeNav, setActiveNav, currentUser, logout } = useLms();

  const studentNavItems = [
    { id: 'dashboard', label: 'Dashboard Progres', icon: LayoutDashboard },
    { id: 'courses', label: 'Mata Pelajaran', icon: BookOpen },
    { id: 'modules', label: 'Modul & Materi Baca', icon: FileText },
    { id: 'assignments', label: 'Pengumpulan Tugas', icon: UploadCloud },
    { id: 'exams', label: 'Sistem Ujian Ber-Timer', icon: CheckCircle2 },
    { id: 'grades', label: 'Rekapitulasi Nilai', icon: Award },
    { id: 'attendance', label: 'Presensi Harian', icon: CalendarCheck },
    { id: 'forum', label: 'Forum Diskusi', icon: MessageSquare },
  ];

  const teacherNavItems = [
    { id: 'dashboard', label: 'Dashboard Kelas', icon: LayoutDashboard },
    { id: 'students', label: 'Data & Tambah Siswa', icon: Users },
    { id: 'modules', label: 'Kelola & Upload Materi', icon: FileText },
    { id: 'assignments', label: 'Manajemen Tugas & Deadline', icon: UploadCloud },
    { id: 'exams', label: 'Bank Soal & Penilaian Ujian', icon: CheckCircle2 },
    { id: 'grades', label: 'Gradebook & Nilai Otomatis', icon: Award },
    { id: 'attendance', label: 'Manajemen Absensi Siswa', icon: CalendarCheck },
    { id: 'forum', label: 'Panel Moderasi Forum', icon: MessageSquare },
  ];

  const navItems = role === 'guru' ? teacherNavItems : studentNavItems;

  const handleNavClick = (id: string) => {
    setActiveNav(id);
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Main Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col w-72 bg-slate-900 border-r border-slate-800 text-slate-300 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between h-18 px-6 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-indigo-600 text-white font-bold shadow-xs">
              <Sparkles className="w-5 h-5 text-indigo-200" />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-white block">
                Lentera Edu
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {role === 'guru' ? 'Portal Pengajar' : 'Portal Siswa'}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 lg:hidden"
            aria-label="Tutup Menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role Switcher Banner */}
        <div className="p-4 mx-3 my-3 rounded-lg bg-slate-800/60 border border-slate-700/50">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-slate-400">Mode Sistem Aktif</span>
            <span
              className={`font-semibold ${
                role === 'guru' ? 'text-amber-400' : 'text-indigo-400'
              }`}
            >
              {role === 'guru' ? 'Guru / Pengajar' : 'Siswa Aktif'}
            </span>
          </div>
          <button
            onClick={() => switchRole(role === 'siswa' ? 'guru' : 'siswa')}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-medium text-white bg-slate-700 hover:bg-slate-600 rounded-md transition-colors shadow-xs"
          >
            <ArrowRightLeft className="w-3.5 h-3.5 text-slate-300" />
            <span>Ganti ke Mode {role === 'siswa' ? 'Guru' : 'Siswa'}</span>
          </button>
        </div>

        {/* Navigation List */}
        <div className="flex-1 px-3 py-2 overflow-y-auto space-y-1">
          <div className="px-3 pb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Menu Pembelajaran
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all text-left ${
                  isActive
                    ? 'bg-indigo-600/90 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? 'text-white' : 'text-slate-400'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}

          {/* Logout Navigation Item */}
          <div className="pt-3 mt-2 border-t border-slate-800/80 px-3 pb-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Akun & Sesi
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all text-left text-rose-300 hover:text-white hover:bg-rose-900/30 border border-rose-900/20"
          >
            <LogOut className="w-4 h-4 shrink-0 text-rose-400" />
            <span>Keluar / Logout Akun</span>
          </button>
        </div>

        {/* Current User Card & Logout */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 space-y-2">
          <div className="flex items-center gap-3">
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              className="w-10 h-10 rounded-full object-cover border border-slate-700 shrink-0"
              referrerPolicy="no-referrer"
            />
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold text-white truncate">
                {currentUser.name}
              </div>
              <div className="text-xs text-slate-400 truncate flex items-center gap-1.5">
                {role === 'guru' ? (
                  <>
                    <Briefcase className="w-3 h-3 text-amber-400 shrink-0" />
                    <span>NIP: {currentUser.identifier}</span>
                  </>
                ) : (
                  <>
                    <GraduationCap className="w-3 h-3 text-indigo-400 shrink-0" />
                    <span>{currentUser.className}</span>
                  </>
                )}
              </div>
            </div>

            <button
              onClick={logout}
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors shrink-0"
              title="Keluar / Logout"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
