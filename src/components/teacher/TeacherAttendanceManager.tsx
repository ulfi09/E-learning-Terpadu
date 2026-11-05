import React, { useState } from 'react';
import {
  CalendarCheck,
  CheckCircle2,
  Clock,
  MapPin,
  Search,
  Filter,
  Check,
  X,
  AlertCircle,
  UserPlus,
} from 'lucide-react';
import { useLms } from '../../context/LmsContext';
import { AttendanceStatus } from '../../types';

export const TeacherAttendanceManager: React.FC = () => {
  const {
    attendanceRecords,
    courses,
    updateAttendanceByTeacher,
    recordStudentAttendance,
    showToast,
    students,
    setActiveNav,
  } = useLms();

  const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?.id || 'course_web_01');
  const [selectedDate, setSelectedDate] = useState('2026-11-04');
  const [searchQuery, setSearchQuery] = useState('');

  const selectedCourse = courses.find((c) => c.id === selectedCourseId) || courses[0];

  // Roster combined with attendance records for this date & course
  const studentRoster = students.map((student) => {
    const existing = attendanceRecords.find(
      (r) => r.courseId === selectedCourse.id && r.date === selectedDate && r.studentId === student.id
    );

    const status: AttendanceStatus = existing ? existing.status : 'hadir';

    return {
      student,
      recordId: existing?.id,
      status,
      time: existing?.time || '07:50 WIB',
      location: existing?.location || 'Lab Komputasi 3',
      notes: existing?.notes || 'Presensi kelas terverifikasi',
    };
  }).filter((r) =>
    r.student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.student.nis.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const hadirCount = studentRoster.filter((r) => r.status === 'hadir').length;
  const izinCount = studentRoster.filter((r) => r.status === 'izin').length;
  const sakitCount = studentRoster.filter((r) => r.status === 'sakit').length;
  const alpaCount = studentRoster.filter((r) => r.status === 'alpa').length;
  const attendanceRate =
    studentRoster.length > 0 ? Math.round((hadirCount / studentRoster.length) * 100) : 100;

  const handleChangeStatus = (
    studentId: string,
    recordId: string | undefined,
    newStatus: AttendanceStatus
  ) => {
    if (recordId) {
      updateAttendanceByTeacher(recordId, newStatus, `Diubah oleh pengajar (${newStatus.toUpperCase()})`);
    } else {
      // Create new record for this student
      recordStudentAttendance(selectedCourse.id, newStatus, `Presensi dicatat pengajar (${newStatus.toUpperCase()})`);
    }
  };

  const handleMarkAllPresent = () => {
    studentRoster.forEach((r) => {
      handleChangeStatus(r.student.id, r.recordId, 'hadir');
    });
    showToast('Presensi Massal Sukses', 'Semua siswa di rombel ini telah ditandai Hadir.');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            Manajemen Absensi & Presensi Kelas
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Rekap kehadiran harian kelas XII MIPA 1, validasi pengajuan izin/sakit, dan kontrol status siswa
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button
            onClick={() => setActiveNav('students')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200 transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Tambah Murid</span>
          </button>
          <button
            onClick={handleMarkAllPresent}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
          >
            <Check className="w-4 h-4" />
            <span>Tandai Semua Siswa Hadir</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <div className="text-xs text-slate-500">Tingkat Hadir Sesi Ini</div>
          <div className="text-2xl font-bold text-emerald-600 font-mono tabular-nums">
            {attendanceRate}%
          </div>
          <div className="text-xs text-slate-400">{hadirCount} Siswa Hadir</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <div className="text-xs text-slate-500">Izin Resmi</div>
          <div className="text-2xl font-bold text-amber-600 font-mono tabular-nums">
            {izinCount}
          </div>
          <div className="text-xs text-slate-400">Dispensasi / Tugas Luar</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <div className="text-xs text-slate-500">Sakit</div>
          <div className="text-2xl font-bold text-blue-600 font-mono tabular-nums">
            {sakitCount}
          </div>
          <div className="text-xs text-slate-400">Surat Dokter</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <div className="text-xs text-slate-500">Alpa / Tanpa Keterangan</div>
          <div className="text-2xl font-bold text-rose-600 font-mono tabular-nums">
            {alpaCount}
          </div>
          <div className="text-xs text-slate-400">Perlu tindak lanjut wali kelas</div>
        </div>
      </div>

      {/* Filter Row: Course & Date */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-3 bg-white rounded-xl border border-slate-200">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider pl-1">
              Matkul:
            </span>
            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 focus:border-indigo-500"
            >
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code} - {c.title}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Tanggal:
            </span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="text-xs font-medium text-slate-800 bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5"
            />
          </div>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari siswa di kelas..."
            className="w-full text-xs pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Attendance Roster Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">
            Daftar Kehadiran Siswa Kelas XII MIPA 1 ({studentRoster.length} Siswa)
          </h3>
          <span className="text-xs text-slate-500 font-mono">
            {selectedDate} · {selectedCourse.room}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-600 font-semibold">
                <th className="py-3 px-4">Siswa</th>
                <th className="py-3 px-4">Waktu & Lokasi</th>
                <th className="py-3 px-4 text-center">Status Kehadiran</th>
                <th className="py-3 px-4">Catatan / Validasi Pengajar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {studentRoster.map((item) => {
                return (
                  <tr key={item.student.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={item.student.avatar}
                          alt={item.student.name}
                          className="w-8 h-8 rounded-full object-cover shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <div className="font-bold text-slate-900">{item.student.name}</div>
                          <div className="text-xs text-slate-400 font-mono">NIS: {item.student.nis}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-xs">
                      <div className="font-semibold text-slate-800">{item.time}</div>
                      <div className="text-slate-500">{item.location}</div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex items-center p-1 bg-slate-100 rounded-lg gap-1">
                        <button
                          onClick={() => handleChangeStatus(item.student.id, item.recordId, 'hadir')}
                          className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                            item.status === 'hadir'
                              ? 'bg-emerald-600 text-white shadow-2xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Hadir
                        </button>
                        <button
                          onClick={() => handleChangeStatus(item.student.id, item.recordId, 'izin')}
                          className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                            item.status === 'izin'
                              ? 'bg-amber-600 text-white shadow-2xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Izin
                        </button>
                        <button
                          onClick={() => handleChangeStatus(item.student.id, item.recordId, 'sakit')}
                          className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                            item.status === 'sakit'
                              ? 'bg-blue-600 text-white shadow-2xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Sakit
                        </button>
                        <button
                          onClick={() => handleChangeStatus(item.student.id, item.recordId, 'alpa')}
                          className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                            item.status === 'alpa'
                              ? 'bg-rose-600 text-white shadow-2xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Alpa
                        </button>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-500">
                      {item.notes}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
