import React, { useState } from 'react';
import {
  Award,
  Download,
  Printer,
  Search,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  UserPlus,
} from 'lucide-react';
import { useLms } from '../../context/LmsContext';

export const TeacherGradebook: React.FC = () => {
  const { courses, assignments, exams, attendanceRecords, showToast, students, setActiveNav } = useLms();
  const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?.id || 'course_web_01');
  const [searchQuery, setSearchQuery] = useState('');
  const [showRosterPrintModal, setShowRosterPrintModal] = useState(false);

  const selectedCourse = courses.find((c) => c.id === selectedCourseId) || courses[0];

  // Calculate grades for each peer student in this selected course
  const studentRows = students.map((student) => {
    // Assignments
    const courseAssignments = assignments.filter((a) => a.courseId === selectedCourse.id);
    let totalAssScore = 0;
    let assCount = 0;
    courseAssignments.forEach((a) => {
      const sub = a.submissions.find((s) => s.studentId === student.id);
      if (sub && sub.score !== undefined) {
        totalAssScore += sub.score;
        assCount++;
      }
    });

    // Default realistic scores if mock student hasn't submitted yet
    const assignmentScore =
      assCount > 0
        ? Math.round(totalAssScore / assCount)
        : student.id === 'siswa_nadia_01'
        ? 95
        : 84;

    // Exams
    const courseExams = exams.filter((e) => e.courseId === selectedCourse.id);
    let totalExamScore = 0;
    let examCount = 0;
    courseExams.forEach((e) => {
      const sub = e.submissions.find((s) => s.studentId === student.id);
      if (sub && sub.totalScore !== undefined) {
        totalExamScore += Math.round((sub.totalScore / (sub.maxScore || 100)) * 100);
        examCount++;
      }
    });

    const examScore =
      examCount > 0
        ? Math.round(totalExamScore / examCount)
        : student.id === 'siswa_nadia_01'
        ? 97
        : 86;

    // Attendance
    const studentAtt = attendanceRecords.filter(
      (r) => r.courseId === selectedCourse.id && r.studentId === student.id
    );
    const presentCount = studentAtt.filter((r) => r.status === 'hadir').length;
    const attendancePercentage =
      studentAtt.length > 0
        ? Math.round((presentCount / studentAtt.length) * 100)
        : student.id === 'siswa_nadia_01'
        ? 96
        : 88;

    // Weighted final: 40% Tugas + 40% Ujian + 20% Presensi
    const finalScore = Math.round(assignmentScore * 0.4 + examScore * 0.4 + attendancePercentage * 0.2);

    let letterGrade = 'A';
    let status = 'Lulus Sangat Memuaskan';

    if (finalScore >= 92) {
      letterGrade = 'A';
      status = 'Lulus Sangat Memuaskan';
    } else if (finalScore >= 85) {
      letterGrade = 'A-';
      status = 'Lulus Sangat Memuaskan';
    } else if (finalScore >= 80) {
      letterGrade = 'B+';
      status = 'Lulus Memuaskan';
    } else if (finalScore >= 75) {
      letterGrade = 'B';
      status = 'Lulus Memuaskan';
    } else if (finalScore >= 70) {
      letterGrade = 'B-';
      status = 'Lulus';
    } else {
      letterGrade = 'C+';
      status = 'Perlu Perbaikan';
    }

    return {
      student,
      assignmentScore,
      examScore,
      attendancePercentage,
      finalScore,
      letterGrade,
      status,
    };
  }).filter((row) =>
    row.student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    row.student.nis.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleExportCsv = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'NIS,Nama Siswa,Tugas (40%),Ujian (40%),Presensi (20%),Nilai Akhir,Huruf Mutu,Status Kelulusan\n';

    studentRows.forEach((r) => {
      csvContent += `"${r.student.nis}","${r.student.name}",${r.assignmentScore},${r.examScore},${r.attendancePercentage}%,${r.finalScore},"${r.letterGrade}","${r.status}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Gradebook_${selectedCourse.code}_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Ekspor Berhasil', `File CSV Buku Nilai ${selectedCourse.code} telah diunduh.`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            Buku Nilai (Gradebook) Otomatis
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Kalkulasi komposit otomatis berbobot: 40% Tugas, 40% Ujian, dan 20% Presensi Kehadiran
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveNav('students')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200 transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Tambah Murid</span>
          </button>
          <button
            onClick={() => setShowRosterPrintModal(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg shadow-2xs transition-colors"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Cetak Rekap</span>
          </button>
          <button
            onClick={handleExportCsv}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Ekspor CSV Rapor</span>
          </button>
        </div>
      </div>

      {/* Course & Filter Strip */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-3 bg-white rounded-xl border border-slate-200">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider pl-1">
            Mata Pelajaran:
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

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari siswa / NIS..."
            className="w-full text-xs pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Gradebook Matrix Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="text-xs">
            <span className="font-bold text-slate-900 block sm:inline mr-2">
              Buku Nilai Kelas XII MIPA 1
            </span>
            <span className="text-slate-500 font-mono">
              ({selectedCourse.code} · {selectedCourse.title})
            </span>
          </div>
          <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
            Bobot Terstandarisasi
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-600 font-semibold">
                <th className="py-3 px-4">Nama Siswa & NIS</th>
                <th className="py-3 px-4 text-center">Tugas Rata-rata (40%)</th>
                <th className="py-3 px-4 text-center">Ujian Rata-rata (40%)</th>
                <th className="py-3 px-4 text-center">Presensi (20%)</th>
                <th className="py-3 px-4 text-center font-bold text-slate-900 bg-slate-100/60">
                  Nilai Akhir
                </th>
                <th className="py-3 px-4 text-center">Huruf Mutu</th>
                <th className="py-3 px-4">Status Kelulusan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {studentRows.map((r) => {
                return (
                  <tr key={r.student.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={r.student.avatar}
                          alt={r.student.name}
                          className="w-7 h-7 rounded-full object-cover shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <div className="font-bold text-slate-900">{r.student.name}</div>
                          <div className="text-xs text-slate-400 font-mono">NIS: {r.student.nis}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono tabular-nums">
                      {r.assignmentScore}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono tabular-nums">
                      {r.examScore}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono tabular-nums">
                      {r.attendancePercentage}%
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono tabular-nums font-bold text-indigo-700 bg-indigo-50/30">
                      {r.finalScore}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-block px-2.5 py-1 text-xs font-bold font-mono rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">
                        {r.letterGrade}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 text-xs text-emerald-700 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {r.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Print Classroom Roster Modal */}
      {showRosterPrintModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-3xl bg-white rounded-2xl p-8 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">REKAPITULASI NILAI KELAS</h3>
                <div className="text-xs text-slate-500">
                  {selectedCourse.code} · {selectedCourse.title} - Semester Ganjil 2026/2027
                </div>
              </div>
              <button
                onClick={() => setShowRosterPrintModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <table className="w-full text-left border">
                <thead>
                  <tr className="bg-slate-100 border-b">
                    <th className="p-2">NIS</th>
                    <th className="p-2">Nama Siswa</th>
                    <th className="p-2 text-center">Tugas</th>
                    <th className="p-2 text-center">Ujian</th>
                    <th className="p-2 text-center">Presensi</th>
                    <th className="p-2 text-center font-bold">Nilai Akhir</th>
                    <th className="p-2 text-center">Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {studentRows.map((r) => (
                    <tr key={r.student.id} className="border-b">
                      <td className="p-2 font-mono">{r.student.nis}</td>
                      <td className="p-2 font-bold">{r.student.name}</td>
                      <td className="p-2 text-center">{r.assignmentScore}</td>
                      <td className="p-2 text-center">{r.examScore}</td>
                      <td className="p-2 text-center">{r.attendancePercentage}%</td>
                      <td className="p-2 text-center font-bold">{r.finalScore}</td>
                      <td className="p-2 text-center font-mono font-bold">{r.letterGrade}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t">
              <button
                onClick={() => setShowRosterPrintModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Tutup
              </button>
              <button
                onClick={() => {
                  window.print();
                  setShowRosterPrintModal(false);
                }}
                className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
              >
                Cetak Lembar Nilai
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
