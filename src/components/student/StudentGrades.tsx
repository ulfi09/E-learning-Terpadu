import React, { useState } from 'react';
import { Award, TrendingUp, Printer, CheckCircle2, BookOpen, AlertCircle } from 'lucide-react';
import { useLms } from '../../context/LmsContext';

export const StudentGrades: React.FC = () => {
  const { studentGradeSummaries, overallGpa, currentUser, showToast } = useLms();
  const [showPrintModal, setShowPrintModal] = useState(false);

  const handlePrint = () => {
    setShowPrintModal(true);
    showToast('Pratinjau Cetak Siap', 'Transkrip nilai siap dicetak atau disimpan sebagai dokumen PDF resmi.');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            Rekapitulasi Nilai & Transkrip Akademik
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Kompilasi nilai transparan berdasarkan bobot tugas (40%), ujian ber-timer (40%), dan presensi (20%)
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg shadow-2xs transition-colors"
        >
          <Printer className="w-4 h-4 text-slate-500" />
          <span>Cetak Lembar Nilai</span>
        </button>
      </div>

      {/* GPA Summary Hero Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6 border border-slate-800">
        <div className="space-y-2">
          <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
            Akumulasi Hasil Pembelajaran
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Indeks Prestasi Kumulatif (IPK): {overallGpa}
          </div>
          <p className="text-xs text-slate-300">
            Status Evaluasi: <span className="font-semibold text-emerald-400">Sangat Memuaskan (Cum Laude Track)</span> · 14 SKS Selesai
          </p>
        </div>

        <div className="flex items-center gap-6 sm:border-l sm:border-slate-800 sm:pl-8">
          <div>
            <div className="text-xs text-slate-400">Total Matkul</div>
            <div className="text-xl font-bold font-mono">{studentGradeSummaries.length}</div>
          </div>
          <div>
            <div className="text-xs text-slate-400">Rata-rata Kelas</div>
            <div className="text-xl font-bold font-mono text-emerald-400">92.4</div>
          </div>
          <div>
            <div className="text-xs text-slate-400">Predikat</div>
            <div className="text-xl font-bold font-mono text-indigo-400">A</div>
          </div>
        </div>
      </div>

      {/* Gradebook Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">
            Rincian Buku Nilai Siswa
          </h2>
          <span className="text-xs text-slate-400">Semester Ganjil 2026/2027</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-600 font-semibold">
                <th className="py-3 px-4">Kode & Mata Pelajaran</th>
                <th className="py-3 px-4 text-center">Tugas (40%)</th>
                <th className="py-3 px-4 text-center">Ujian (40%)</th>
                <th className="py-3 px-4 text-center">Presensi (20%)</th>
                <th className="py-3 px-4 text-center font-bold text-slate-900">Nilai Akhir</th>
                <th className="py-3 px-4 text-center">Huruf Mutu</th>
                <th className="py-3 px-4">Keterangan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {studentGradeSummaries.map((item) => {
                return (
                  <tr key={item.courseId} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-4 font-medium text-slate-900">
                      <div className="font-bold">{item.courseTitle}</div>
                      <div className="text-xs text-slate-400 font-mono">{item.courseCode}</div>
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono tabular-nums">
                      {item.assignmentAverage}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono tabular-nums">
                      {item.examAverage}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono tabular-nums">
                      {item.attendancePercentage}%
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono tabular-nums font-bold text-indigo-700">
                      {item.finalScore}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-block px-2.5 py-1 text-xs font-bold font-mono rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">
                        {item.letterGrade}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 text-xs text-emerald-700 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {item.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Print / Export Report Modal */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-white rounded-2xl p-8 shadow-2xl border border-slate-200 space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">LENTERA EDU ACADEMY</h3>
                <div className="text-xs text-slate-500">Transkrip Nilai Akademik Resmi Siswa</div>
              </div>
              <button
                onClick={() => setShowPrintModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 text-xs space-y-1">
              <div><strong>Nama Siswa:</strong> {currentUser.name}</div>
              <div><strong>Nomor Induk Siswa (NIS):</strong> {currentUser.identifier}</div>
              <div><strong>Kelas / Program:</strong> {currentUser.className}</div>
              <div><strong>Semester:</strong> Ganjil 2026/2027</div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="font-bold text-slate-800">Ringkasan Nilai:</div>
              {studentGradeSummaries.map((s) => (
                <div key={s.courseId} className="flex justify-between py-1 border-b border-slate-100">
                  <span>{s.courseTitle} ({s.courseCode})</span>
                  <span className="font-mono font-bold">{s.finalScore} ({s.letterGrade})</span>
                </div>
              ))}
              <div className="flex justify-between pt-2 text-sm font-bold text-indigo-900">
                <span>Indeks Prestasi Kumulatif (IPK):</span>
                <span>{overallGpa} / 4.00</span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                onClick={() => setShowPrintModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Tutup
              </button>
              <button
                onClick={() => {
                  window.print();
                  setShowPrintModal(false);
                }}
                className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
              >
                Cetak Halaman Ini
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
