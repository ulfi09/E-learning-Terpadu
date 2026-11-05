import React, { useState } from 'react';
import {
  UploadCloud,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Award,
  ChevronRight,
  Filter,
  MessageSquare,
  Download,
} from 'lucide-react';
import { useLms } from '../../context/LmsContext';
import { Assignment } from '../../types';
import { AssignmentSubmitModal } from '../common/AssignmentSubmitModal';

export const StudentAssignments: React.FC = () => {
  const { assignments, courses, currentUser } = useLms();
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'submitted' | 'graded'>('all');
  const [activeSubmitAssignment, setActiveSubmitAssignment] = useState<Assignment | null>(null);

  const getSubmissionStatus = (a: Assignment) => {
    const sub = a.submissions.find((s) => s.studentId === currentUser.id);
    if (!sub) return 'pending';
    return sub.status; // 'submitted' | 'graded'
  };

  const filteredAssignments = assignments.filter((a) => {
    const status = getSubmissionStatus(a);
    if (filterStatus === 'all') return true;
    if (filterStatus === 'pending') return status === 'pending';
    if (filterStatus === 'submitted') return status === 'submitted';
    if (filterStatus === 'graded') return status === 'graded';
    return true;
  });

  const calculateRemainingTime = (deadlineStr: string) => {
    const deadline = new Date(deadlineStr).getTime();
    const now = new Date().getTime();
    const diff = deadline - now;

    if (diff <= 0) {
      return { text: 'Tenggat Waktu Berakhir', isOverdue: true };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) {
      return { text: `Tersisa ${days} hari ${hours} jam`, isOverdue: false };
    }
    return { text: `Tersisa ${hours} jam lagi!`, isOverdue: false };
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            Pengumpulan Tugas Berbatas Waktu
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Kelola pengiriman tugas akademik, pantau status evaluasi guru, dan tenggat waktu pengumpulan
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center p-1 bg-slate-100 rounded-lg">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              filterStatus === 'all'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Semua ({assignments.length})
          </button>
          <button
            onClick={() => setFilterStatus('pending')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              filterStatus === 'pending'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Belum Dikumpulkan
          </button>
          <button
            onClick={() => setFilterStatus('submitted')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              filterStatus === 'submitted'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Menunggu Dinilai
          </button>
          <button
            onClick={() => setFilterStatus('graded')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              filterStatus === 'graded'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Selesai Dinilai
          </button>
        </div>
      </div>

      {/* Assignment List */}
      <div className="space-y-4">
        {filteredAssignments.map((assignment) => {
          const course = courses.find((c) => c.id === assignment.courseId);
          const sub = assignment.submissions.find((s) => s.studentId === currentUser.id);
          const { text: remainingText, isOverdue } = calculateRemainingTime(assignment.deadline);

          return (
            <div
              key={assignment.id}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs hover:border-slate-300 transition-all p-5 sm:p-6 space-y-4"
            >
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-mono font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                    {course?.code}
                  </span>
                  <span className="text-slate-500">{assignment.chapter}</span>
                  <span aria-hidden="true" className="text-slate-300">·</span>
                  <span className="text-slate-500 font-medium">Bobot {assignment.weightPercentage}%</span>
                </div>

                <div className="flex items-center gap-2">
                  <div
                    className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-md ${
                      sub?.status === 'graded'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : sub?.status === 'submitted'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : isOverdue
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>
                      {sub?.status === 'graded'
                        ? 'Selesai Dinilai'
                        : sub?.status === 'submitted'
                        ? 'Menunggu Penilaian'
                        : remainingText}
                    </span>
                  </div>
                </div>
              </div>

              {/* Title & Instructions */}
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1.5">
                  {assignment.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {assignment.instructions}
                </p>
              </div>

              {/* Graded Feedback Box if Graded */}
              {sub && sub.status === 'graded' && (
                <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                      <Award className="w-4 h-4 text-emerald-600" />
                      <span>Hasil Evaluasi Pengajar</span>
                    </div>
                    <div className="text-sm font-bold text-emerald-800 font-mono">
                      Nilai: {sub.score} / {assignment.maxScore}
                    </div>
                  </div>
                  {sub.feedback && (
                    <div className="text-xs text-emerald-900 leading-relaxed bg-white/70 p-3 rounded-lg border border-emerald-100">
                      <strong>Komentar Guru:</strong> {sub.feedback}
                    </div>
                  )}
                </div>
              )}

              {/* Submission Details if Submitted */}
              {sub && sub.status === 'submitted' && (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2 truncate">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                    <div className="truncate">
                      <span className="font-semibold text-slate-900">Berkas Terkirim:</span>{' '}
                      {sub.fileName} ({sub.fileSize}) · Diserahkan {new Date(sub.submittedAt).toLocaleString('id-ID')}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {sub.fileUrl && (
                      <a
                        href={sub.fileUrl}
                        download={sub.fileName}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-2 py-1 rounded border border-indigo-200 transition-colors"
                      >
                        <Download className="w-3 h-3" />
                        <span>Unduh File</span>
                      </a>
                    )}
                    <span className="text-slate-500 font-mono text-[11px]">
                      Dalam antrean periksa
                    </span>
                  </div>
                </div>
              )}

              {/* Actions Footer */}
              <div className="flex items-center justify-between pt-2">
                <div className="text-xs text-slate-500">
                  Format berkas yang diterima: <span className="font-medium text-slate-700">{assignment.allowedFormats.join(', ')}</span>
                </div>

                <button
                  onClick={() => setActiveSubmitAssignment(assignment)}
                  className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg shadow-2xs transition-colors ${
                    sub
                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  }`}
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>{sub ? 'Kirim Ulang Jawaban' : 'Kumpulkan Tugas'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Submit Modal */}
      <AssignmentSubmitModal
        assignment={activeSubmitAssignment}
        onClose={() => setActiveSubmitAssignment(null)}
      />
    </div>
  );
};
