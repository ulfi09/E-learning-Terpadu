import React from 'react';
import {
  Users,
  FileText,
  UploadCloud,
  CheckCircle2,
  CalendarCheck,
  TrendingUp,
  ArrowRight,
  Clock,
  Award,
  Sparkles,
} from 'lucide-react';
import { useLms } from '../../context/LmsContext';

export const TeacherDashboard: React.FC = () => {
  const {
    currentUser,
    courses,
    modules,
    assignments,
    exams,
    attendanceRecords,
    discussions,
    students,
    setActiveNav,
  } = useLms();

  // Teacher courses
  const teacherCourses = courses.filter((c) => c.instructorId === currentUser.id);

  // Ungraded assignment submissions count
  let ungradedSubmissionsCount = 0;
  assignments.forEach((a) => {
    a.submissions.forEach((s) => {
      if (s.status === 'submitted') {
        ungradedSubmissionsCount++;
      }
    });
  });

  // Today attendance
  const todayStr = new Date().toISOString().split('T')[0];
  const todayRecords = attendanceRecords.filter((r) => r.date === todayStr);
  const presentToday = todayRecords.filter((r) => r.status === 'hadir').length;
  const todayAttendanceRate =
    todayRecords.length > 0 ? Math.round((presentToday / todayRecords.length) * 100) : 100;

  // Unresolved discussions that might need teacher intervention
  const pendingThreads = discussions.filter((d) => !d.isResolved);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Teacher Hero Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="text-xs font-semibold text-amber-400 tracking-wider uppercase flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Dashboard Manajemen Pengajar & Akademik</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Selamat Bertugas, {currentUser.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Kelola distribusi materi silabus, jadwalkan tugas & ujian, periksa kiriman siswa, serta lakukan moderasi forum kelas secara terpusat.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveNav('modules')}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition-colors shadow-xs"
          >
            + Unggah Materi Baru
          </button>
          <button
            onClick={() => setActiveNav('assignments')}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 text-xs font-bold rounded-lg transition-colors"
          >
            Buat Tugas Baru
          </button>
        </div>
      </div>

      {/* Teacher KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Siswa Bimbingan Aktif</span>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {students.length} <span className="text-xs font-normal text-slate-400">Siswa / Rombel</span>
          </div>
          <div className="text-xs text-slate-500">Kelas XII MIPA 1 (Sains Komputasi)</div>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Tugas Butuh Penilaian</span>
            <UploadCloud className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {ungradedSubmissionsCount} <span className="text-xs font-normal text-slate-400">Kiriman Baru</span>
          </div>
          <div className="text-xs text-amber-700 font-medium">
            {ungradedSubmissionsCount > 0 ? 'Menunggu koreksi & feedback' : 'Semua kiriman telah dinilai'}
          </div>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Tingkat Kehadiran Hari Ini</span>
            <CalendarCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {todayAttendanceRate}%
          </div>
          <div className="text-xs text-slate-500">
            {presentToday} dari {todayRecords.length || students.length} siswa hadir tepat waktu
          </div>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Diskusi Butuh Respons</span>
            <FileText className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {pendingThreads.length} <span className="text-xs font-normal text-slate-400">Pertanyaan</span>
          </div>
          <div className="text-xs text-slate-500">Tandai solusi terverifikasi pengajar</div>
        </div>
      </div>

      {/* Classroom Quick Management Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Course Modules & Reader Tracking (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Materi Silabus Terkini</h2>
              <p className="text-xs text-slate-500">Pantau berapa banyak siswa yang telah membaca modul Anda</p>
            </div>
            <button
              onClick={() => setActiveNav('modules')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              <span>Kelola Seluruh Materi</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {modules.slice(0, 4).map((mod) => {
              const course = courses.find((c) => c.id === mod.courseId);
              const readCount = mod.readByStudentIds.length;
              const readRate = students.length > 0 ? Math.round((readCount / students.length) * 100) : 0;

              return (
                <div
                  key={mod.id}
                  className="p-4 rounded-xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="font-semibold text-indigo-600">{course?.code}</span>
                      <span aria-hidden="true">·</span>
                      <span>{mod.chapter}</span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 truncate">
                      {mod.title}
                    </h3>
                    <div className="text-xs text-slate-500 flex items-center gap-3">
                      <span className="uppercase font-semibold">{mod.contentType}</span>
                      <span>·</span>
                      <span>Diunduh {mod.downloadCount} kali</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0 sm:border-l sm:border-slate-100 sm:pl-4">
                    <div className="text-right">
                      <div className="text-xs text-slate-500">Dibaca Siswa</div>
                      <div className="text-sm font-bold font-mono text-slate-900">
                        {readCount} / {students.length} ({readRate}%)
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveNav('modules')}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md"
                    >
                      Audit
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Quick Actions: Submissions to Grade */}
        <div className="space-y-6">
          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-500" />
                Antrean Koreksi Tugas
              </h3>
              <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                {ungradedSubmissionsCount} Tugas
              </span>
            </div>

            <div className="space-y-3">
              {assignments.map((assignment) => {
                const pending = assignment.submissions.filter((s) => s.status === 'submitted');
                if (pending.length === 0) return null;

                return (
                  <div
                    key={assignment.id}
                    className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2 text-xs"
                  >
                    <div className="font-bold text-slate-800 line-clamp-1">
                      {assignment.title}
                    </div>
                    <div className="text-slate-500 flex justify-between">
                      <span>Tenggat: {new Date(assignment.deadline).toLocaleDateString('id-ID')}</span>
                      <span className="font-semibold text-indigo-600">{pending.length} Siswa Menunggu</span>
                    </div>
                    <button
                      onClick={() => setActiveNav('assignments')}
                      className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-semibold text-center"
                    >
                      Buka Lembar Penilaian
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Aksi Cepat Pengajar
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
              <button
                onClick={() => setActiveNav('students')}
                className="p-2.5 text-left rounded-lg bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 font-bold"
              >
                + Tambah / Kelola Siswa
              </button>
              <button
                onClick={() => setActiveNav('modules')}
                className="p-2.5 text-left rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700"
              >
                + Upload Materi / PPT
              </button>
              <button
                onClick={() => setActiveNav('exams')}
                className="p-2.5 text-left rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700"
              >
                + Buat Ujian Baru
              </button>
              <button
                onClick={() => setActiveNav('attendance')}
                className="p-2.5 text-left rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700"
              >
                Rekap Presensi
              </button>
              <button
                onClick={() => setActiveNav('grades')}
                className="p-2.5 text-left rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700"
              >
                Export Gradebook
              </button>
              <button
                onClick={() => setActiveNav('forum')}
                className="p-2.5 text-left rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700"
              >
                Moderasi Diskusi
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
