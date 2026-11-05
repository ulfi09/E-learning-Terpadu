import React, { useState } from 'react';
import {
  Sparkles,
  GraduationCap,
  Briefcase,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
  User,
  BookOpen,
  Video,
  FileSpreadsheet,
} from 'lucide-react';
import { useLms } from '../../context/LmsContext';
import { TEACHER_USER, STUDENT_USER } from '../../data/seedData';
import { UserProfile, UserRole } from '../../types';

export const LoginPage: React.FC = () => {
  const { login, students } = useLms();
  const [selectedRole, setSelectedRole] = useState<UserRole>('siswa');
  const [emailOrId, setEmailOrId] = useState('nadia.putri@lentera.edu');
  const [password, setPassword] = useState('password123');
  const [selectedStudentId, setSelectedStudentId] = useState(STUDENT_USER.id);

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    if (role === 'guru') {
      setEmailOrId(TEACHER_USER.email);
    } else {
      const activeStudent = students.find((s) => s.id === selectedStudentId) || students[0];
      setEmailOrId(activeStudent?.email || STUDENT_USER.email);
    }
  };

  const handleQuickStudentSelect = (studentId: string) => {
    setSelectedStudentId(studentId);
    const st = students.find((s) => s.id === studentId);
    if (st) {
      setEmailOrId(st.email);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRole === 'guru') {
      login(TEACHER_USER);
    } else {
      const matched = students.find(
        (s) => s.id === selectedStudentId || s.email === emailOrId || s.nis === emailOrId
      ) || students[0];

      const studentProfile: UserProfile = {
        id: matched?.id || STUDENT_USER.id,
        name: matched?.name || STUDENT_USER.name,
        role: 'siswa',
        email: matched?.email || STUDENT_USER.email,
        avatarUrl: matched?.avatar || STUDENT_USER.avatarUrl,
        identifier: matched?.nis || STUDENT_USER.identifier,
        className: matched?.className || STUDENT_USER.className,
      };

      login(studentProfile);
    }
  };

  const handleOneClickTeacher = () => {
    login(TEACHER_USER);
  };

  const handleOneClickStudent = (st?: (typeof students)[0]) => {
    const target = st || students[0];
    login({
      id: target.id,
      name: target.name,
      role: 'siswa',
      email: target.email,
      avatarUrl: target.avatar,
      identifier: target.nis,
      className: target.className,
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Ambient background glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center space-y-3">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600 text-white shadow-xl shadow-indigo-600/30 border border-indigo-400/30 mx-auto">
          <Sparkles className="w-8 h-8 text-indigo-200" />
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight text-white">
          Lentera Edu
        </h2>
        <p className="text-sm text-slate-400 max-w-sm mx-auto">
          Portal Sistem Informasi E-Learning Terpadu untuk Siswa & Dewan Guru
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl relative z-10">
        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          {/* Role Tabs */}
          <div className="grid grid-cols-2 p-1.5 bg-slate-950 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => handleRoleChange('siswa')}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all ${
                selectedRole === 'siswa'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Masuk sebagai Siswa</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleChange('guru')}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all ${
                selectedRole === 'guru'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Masuk sebagai Guru</span>
            </button>
          </div>

          {/* Quick 1-Click Access Cards */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Akses Cepat Instan (1-Klik):</span>
              <span className="text-[11px] text-indigo-400 font-normal">Klik foto untuk langsung masuk</span>
            </div>

            {selectedRole === 'guru' ? (
              <button
                type="button"
                onClick={handleOneClickTeacher}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-amber-500/50 transition-all text-left group"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={TEACHER_USER.avatarUrl}
                    alt={TEACHER_USER.name}
                    className="w-11 h-11 rounded-full object-cover border-2 border-amber-500/60"
                  />
                  <div>
                    <div className="font-bold text-white text-sm group-hover:text-amber-400 transition-colors">
                      {TEACHER_USER.name}
                    </div>
                    <div className="text-xs text-slate-400">
                      NIP: {TEACHER_USER.identifier} · Departemen Informatika
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-400 text-xs font-bold group-hover:bg-amber-500 group-hover:text-slate-950 transition-all">
                  <span>Masuk Guru</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </button>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                {students.slice(0, 4).map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => handleOneClickStudent(st)}
                    className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700 hover:border-indigo-500/60 text-left transition-all group"
                  >
                    <img
                      src={st.avatar}
                      alt={st.name}
                      className="w-9 h-9 rounded-full object-cover shrink-0 border border-indigo-400/40"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-xs text-white truncate group-hover:text-indigo-300">
                        {st.name}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        NIS: {st.nis}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-800 w-full" />
            <span className="bg-slate-900 px-3 text-xs text-slate-500 uppercase tracking-widest shrink-0">
              atau masuk dengan akun
            </span>
            <div className="border-t border-slate-800 w-full" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                {selectedRole === 'guru' ? 'NIP / Email Pengajar' : 'NIS / Email Siswa'}
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={emailOrId}
                  onChange={(e) => setEmailOrId(e.target.value)}
                  placeholder={selectedRole === 'guru' ? 'budi.santoso@lentera.edu' : 'nadia.putri@lentera.edu'}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Kata Sandi
                </label>
                <span className="text-[11px] text-indigo-400 hover:underline cursor-pointer">
                  Lupa sandi?
                </span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-0"
                />
                <span>Ingat saya di perangkat ini</span>
              </label>
              <span className="text-emerald-400 flex items-center gap-1 text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5" />
                Koneksi Aman SSL 256-bit
              </span>
            </div>

            <button
              type="submit"
              className={`w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 ${
                selectedRole === 'guru'
                  ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/20'
                  : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/20'
              }`}
            >
              <span>Masuk ke Lentera Edu LMS</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Highlights feature list */}
          <div className="pt-2 border-t border-slate-800/80 grid grid-cols-3 gap-2 text-center text-[11px] text-slate-400">
            <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-slate-950/40">
              <BookOpen className="w-4 h-4 text-indigo-400" />
              <span>Materi & Slide PPT</span>
            </div>
            <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-slate-950/40">
              <Video className="w-4 h-4 text-amber-400" />
              <span>Nonton Video Kuliah</span>
            </div>
            <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-slate-950/40">
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Buku Nilai & Presensi</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
