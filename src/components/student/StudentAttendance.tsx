import React, { useState } from 'react';
import {
  CalendarCheck,
  MapPin,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Calendar,
  Send,
} from 'lucide-react';
import { useLms } from '../../context/LmsContext';

export const StudentAttendance: React.FC = () => {
  const {
    attendanceRecords,
    courses,
    currentUser,
    recordStudentAttendance,
    overallAttendanceRate,
  } = useLms();

  const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?.id || 'course_web_01');
  const [permissionType, setPermissionType] = useState<'izin' | 'sakit'>('izin');
  const [permissionNote, setPermissionNote] = useState('');
  const [showPermissionModal, setShowPermissionModal] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0];

  const studentRecords = attendanceRecords.filter((r) => r.studentId === currentUser.id);
  const todayRecord = studentRecords.find((r) => r.date === todayStr);

  const handleSelfCheckIn = () => {
    recordStudentAttendance(selectedCourseId, 'hadir', 'Presensi mandiri (Geolokasi Lab Komputasi 3)');
  };

  const handleSendPermission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!permissionNote.trim()) return;
    recordStudentAttendance(selectedCourseId, permissionType, permissionNote);
    setShowPermissionModal(false);
    setPermissionNote('');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            Presensi & Absensi Harian Siswa
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Pencatatan kehadiran kuliah secara digital, validasi geolokasi, dan pengajuan surat izin/sakit
          </p>
        </div>

        <div className="flex items-center gap-2 p-2 px-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Tingkat Kehadiran: {overallAttendanceRate}%</span>
        </div>
      </div>

      {/* Today Check-in Hero Widget */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
              Status Presensi Hari Ini
            </span>
            <h2 className="text-lg font-bold text-slate-900">
              Rabu, 4 November 2026
            </h2>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Clock className="w-4 h-4 text-slate-400" />
            <span>Jam Operasional: 07:00 - 17:00 WIB</span>
          </div>
        </div>

        {todayRecord ? (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">
                ✓
              </div>
              <div>
                <div className="text-sm font-bold">
                  Kehadiran Anda Telah Berhasil Dicatat!
                </div>
                <div className="text-xs text-emerald-700">
                  Status: <strong className="uppercase">{todayRecord.status}</strong> · Pukul {todayRecord.time} · Lokasi: {todayRecord.location}
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowPermissionModal(true)}
              className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 underline self-start sm:self-auto"
            >
              Ubah atau Ajukan Izin / Sakit
            </button>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="space-y-1 text-center sm:text-left">
              <div className="text-sm font-bold text-slate-900">
                Pilih Mata Pelajaran untuk Melakukan Presensi:
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                <span>Geolokasi terdeteksi di Kampus (Radius 50m Presisi Tinggi)</span>
              </div>
              <div className="pt-2">
                <select
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  className="text-xs font-semibold text-slate-800 bg-white border border-slate-300 rounded-lg p-2 focus:border-indigo-500"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.code} - {c.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowPermissionModal(true)}
                className="px-4 py-2.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
              >
                Pengajuan Izin / Sakit
              </button>
              <button
                onClick={handleSelfCheckIn}
                className="px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
              >
                Presensi Hadir Sekarang
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Attendance History Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">
            Riwayat Presensi Akademik Siswa
          </h3>
          <span className="text-xs text-slate-500 font-mono">Total {studentRecords.length} Sesi Terdata</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-600 font-semibold">
                <th className="py-3 px-4">Tanggal & Waktu</th>
                <th className="py-3 px-4">Mata Pelajaran</th>
                <th className="py-3 px-4">Lokasi Presensi</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4">Catatan Verifikasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {studentRecords.map((r) => {
                const course = courses.find((c) => c.id === r.courseId);

                let badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200';
                if (r.status === 'izin') badgeColor = 'bg-amber-50 text-amber-800 border-amber-200';
                if (r.status === 'sakit') badgeColor = 'bg-blue-50 text-blue-800 border-blue-200';
                if (r.status === 'alpa') badgeColor = 'bg-rose-50 text-rose-800 border-rose-200';

                return (
                  <tr key={r.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-mono">
                      <div className="font-semibold text-slate-900">{r.date}</div>
                      <div className="text-[11px] text-slate-400">{r.time}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{course?.title}</div>
                      <div className="text-xs text-slate-400 font-mono">{course?.code}</div>
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-600">
                      {r.location}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded-md border uppercase ${badgeColor}`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-500">
                      {r.notes || '-'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Permission Modal */}
      {showPermissionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Formulir Pengajuan Izin / Sakit
              </h3>
              <button
                onClick={() => setShowPermissionModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSendPermission} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Jenis Pengajuan
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPermissionType('izin')}
                    className={`py-2 text-xs font-semibold rounded-lg border text-center transition-colors ${
                      permissionType === 'izin'
                        ? 'bg-amber-50 border-amber-500 text-amber-800'
                        : 'border-slate-300 text-slate-600'
                    }`}
                  >
                    Izin Acara Resmi
                  </button>
                  <button
                    type="button"
                    onClick={() => setPermissionType('sakit')}
                    className={`py-2 text-xs font-semibold rounded-lg border text-center transition-colors ${
                      permissionType === 'sakit'
                        ? 'bg-blue-50 border-blue-500 text-blue-800'
                        : 'border-slate-300 text-slate-600'
                    }`}
                  >
                    Sakit (Kondisi Medis)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Mata Pelajaran
                </label>
                <select
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.code} - {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Keterangan Alasan & Bukti
                </label>
                <textarea
                  required
                  rows={3}
                  value={permissionNote}
                  onChange={(e) => setPermissionNote(e.target.value)}
                  placeholder="Sebutkan alasan izin atau keterangan diagnosa dokter..."
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-indigo-500 outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowPermissionModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
                >
                  Kirim Pengajuan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
