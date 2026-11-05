import React from 'react';
import {
  Award,
  CalendarCheck,
  BookOpen,
  Clock,
  ArrowRight,
  UploadCloud,
  CheckCircle2,
  FileText,
  AlertCircle,
  TrendingUp,
  MapPin,
} from 'lucide-react';
import { useLms } from '../../context/LmsContext';

export const StudentDashboard: React.FC = () => {
  const {
    currentUser,
    courses,
    modules,
    assignments,
    exams,
    attendanceRecords,
    overallGpa,
    overallAttendanceRate,
    completedModulesCount,
    setActiveNav,
    recordStudentAttendance,
  } = useLms();

  const todayStr = new Date().toISOString().split('T')[0];
  const todayAttendance = attendanceRecords.find(
    (r) => r.studentId === currentUser.id && r.date === todayStr
  );

  // Pending assignments
  const pendingAssignments = assignments.filter((a) => {
    const sub = a.submissions.find((s) => s.studentId === currentUser.id);
    return !sub;
  });

  // Upcoming published exams
  const upcomingExams = exams.filter((e) => {
    const sub = e.submissions.find((s) => s.studentId === currentUser.id);
    return e.isPublished && !sub;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Hero Welcome Card */}
      <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 text-white shadow-xl">
        <div className="absolute inset-0 z-0">
          <img
            src="/src/assets/images/hero_elearning_cover_1793791074135.jpg"
            alt="Perpustakaan Akademik"
            className="w-full h-full object-cover opacity-25"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-transparent" />
        </div>

        <div className="relative z-10 p-6 sm:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl space-y-2">
            <div className="text-xs font-semibold text-indigo-400 tracking-wider uppercase">
              Tahun Akademik 2026/2027 · Semester Ganjil
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Selamat datang kembali, {currentUser.name}!
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Pantau silabus kuliah, kumpulkan tugas berbatas waktu, dan ikuti ujian berbasis timer otomatis dengan evaluasi transparan.
            </p>
          </div>

          {/* Quick Attendance Widget */}
          <div className="bg-slate-800/80 backdrop-blur-md p-4 sm:p-5 rounded-xl border border-slate-700/80 shrink-0 w-full md:w-80 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium flex items-center gap-1.5">
                <CalendarCheck className="w-4 h-4 text-indigo-400" />
                Presensi Hari Ini
              </span>
              <span className="font-mono text-slate-400">Rabu, 4 Nov</span>
            </div>

            {todayAttendance ? (
              <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <div>
                  <div className="font-bold">Kehadiran Terverifikasi</div>
                  <div className="text-[11px] text-emerald-400/80">
                    Status: {todayAttendance.status.toUpperCase()} ({todayAttendance.time})
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="text-xs text-slate-300">
                  Anda belum mengisi presensi mandiri untuk hari ini.
                </div>
                <button
                  onClick={() => recordStudentAttendance('course_web_01', 'hadir')}
                  className="w-full py-2 px-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
                >
                  Presensi Hadir Sekarang
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* KPI Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Indeks Prestasi Kumulatif</span>
            <Award className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {overallGpa} <span className="text-sm font-normal text-slate-400">/ 4.00</span>
          </div>
          <div className="text-xs text-slate-500">
            Predikat: <span className="font-semibold text-indigo-600">Sangat Memuaskan</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Tingkat Kehadiran Kelas</span>
            <CalendarCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {overallAttendanceRate}%
          </div>
          <div className="text-xs text-slate-500">
            Target kehadiran minimal 80% terpenuhi
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Modul Materi Selesai</span>
            <BookOpen className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {completedModulesCount} <span className="text-sm font-normal text-slate-400">/ {modules.length} Bab</span>
          </div>
          <div className="text-xs text-slate-500">
            {Math.round((completedModulesCount / (modules.length || 1)) * 100)}% kurikulum tuntas
          </div>
        </div>

        {/* Metric 4 */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Tugas Aktif Berjalan</span>
            <UploadCloud className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {pendingAssignments.length} <span className="text-sm font-normal text-slate-400">Tugas</span>
          </div>
          <div className="text-xs text-slate-500">
            {pendingAssignments.length > 0 ? 'Perhatikan batas tenggat' : 'Semua tugas telah diserahkan'}
          </div>
        </div>
      </div>

      {/* Main Content Split: Course Cards & Action Reminders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Enrolled Courses (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Mata Pelajaran Aktif</h2>
              <p className="text-xs text-slate-500">Silabus semester ini yang sedang Anda tempuh</p>
            </div>
            <button
              onClick={() => setActiveNav('courses')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              <span>Lihat Semua</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {courses.map((course) => {
              const courseModules = modules.filter((m) => m.courseId === course.id);
              const readCount = courseModules.filter((m) =>
                m.readByStudentIds.includes(currentUser.id)
              ).length;
              const progressPercent = courseModules.length > 0 ? Math.round((readCount / courseModules.length) * 100) : 0;

              return (
                <div
                  key={course.id}
                  className="rounded-xl bg-white border border-slate-200 shadow-2xs overflow-hidden flex flex-col justify-between hover:border-indigo-300 transition-colors"
                >
                  {course.coverImage && (
                    <div className="relative h-28 w-full bg-slate-900 overflow-hidden">
                      <img
                        src={course.coverImage}
                        alt={course.title}
                        className="w-full h-full object-cover opacity-85"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                      <div className="absolute top-2 left-2 flex items-center gap-1.5">
                        <span className="font-mono font-bold text-[11px] text-white bg-indigo-600/90 px-2 py-0.5 rounded">
                          {course.code}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="p-4">
                    {!course.coverImage && (
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-2 font-mono">
                        <span>{course.code}</span>
                        <span>{course.credits} SKS</span>
                      </div>
                    )}
                    <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-1 mb-1">
                      {course.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mb-3">
                      {course.description}
                    </p>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-slate-100">
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-slate-600">
                        <span>Progres Membaca</span>
                        <span className="font-mono">{progressPercent}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-indigo-600 h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                      <span>{course.instructorName}</span>
                      <button
                        onClick={() => setActiveNav('modules')}
                        className="font-semibold text-indigo-600 hover:underline"
                      >
                        Buka Materi
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Panel & Deadlines (1 Col) */}
        <div className="space-y-6">
          {/* Urgent Deadlines Card */}
          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-rose-500" />
                Tenggat Tugas Terdekat
              </h3>
              <span className="text-xs text-slate-400 font-mono">Prioritas</span>
            </div>

            {pendingAssignments.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-500">
                Tidak ada tugas mendesak saat ini. Luar biasa!
              </div>
            ) : (
              <div className="space-y-3">
                {pendingAssignments.slice(0, 3).map((a) => {
                  return (
                    <div
                      key={a.id}
                      className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 space-y-1.5"
                    >
                      <div className="text-xs font-bold text-slate-800 line-clamp-1">
                        {a.title}
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span>Batas: {new Date(a.deadline).toLocaleDateString('id-ID')}</span>
                        <span className="font-semibold text-rose-600">Bobot {a.weightPercentage}%</span>
                      </div>
                      <button
                        onClick={() => setActiveNav('assignments')}
                        className="w-full py-1.5 text-center text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-white border border-slate-200 rounded-md transition-colors"
                      >
                        Kumpulkan Tugas
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Active Exams Card */}
          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-600" />
                Ujian Siap Dikerjakan
              </h3>
              <span className="text-xs text-slate-400 font-mono">Live Timer</span>
            </div>

            {upcomingExams.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-500">
                Tidak ada ujian yang sedang berlangsung saat ini.
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingExams.map((e) => {
                  return (
                    <div
                      key={e.id}
                      className="p-3.5 rounded-lg bg-indigo-50/60 border border-indigo-100 space-y-2"
                    >
                      <div className="text-xs font-bold text-indigo-950 line-clamp-1">
                        {e.title}
                      </div>
                      <div className="flex items-center justify-between text-xs text-indigo-800/80">
                        <span>Durasi: {e.durationMinutes} Menit</span>
                        <span>{e.questions.length} Soal</span>
                      </div>
                      <button
                        onClick={() => setActiveNav('exams')}
                        className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-colors shadow-2xs"
                      >
                        Buka Ruang Ujian
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
