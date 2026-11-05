import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  Award,
  ArrowRight,
  BookOpen,
  FileText,
  Eye,
  X,
  HelpCircle,
  RotateCcw,
} from 'lucide-react';
import { useLms } from '../../context/LmsContext';
import { Exam, ExamSubmission } from '../../types';
import { StudentExamRunner } from './StudentExamRunner';

export const StudentExams: React.FC = () => {
  const {
    exams,
    courses,
    currentUser,
    activeExamIdForRunner,
    startExamRunner,
    closeExamRunner,
    resetStudentExamSubmission,
  } = useLms();

  const [reviewExam, setReviewExam] = useState<{ exam: Exam; submission: ExamSubmission } | null>(
    null
  );

  // If exam runner is currently active
  const runningExam = exams.find((e) => e.id === activeExamIdForRunner);
  if (runningExam) {
    return <StudentExamRunner exam={runningExam} onClose={closeExamRunner} />;
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            Sistem Ujian & Kuis Berbasis Timer
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Evaluasi terstruktur dengan penghitung waktu mundur otomatis, soal pilihan ganda, dan esai interaktif
          </p>
        </div>
      </div>

      {/* Exam Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {exams.map((exam) => {
          const course = courses.find((c) => c.id === exam.courseId);
          const submission = exam.submissions.find((s) => s.studentId === currentUser.id);
          const isSubmitted = !!submission;

          return (
            <div
              key={exam.id}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-mono font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                    {course?.code}
                  </span>
                  <div className="flex items-center gap-1.5 font-medium text-slate-600">
                    <Clock className="w-3.5 h-3.5 text-indigo-500" />
                    <span>{exam.durationMinutes} Menit Timer</span>
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-900 leading-snug mb-1.5">
                    {exam.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {exam.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 p-3 rounded-lg bg-slate-50 text-xs text-slate-600">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Jumlah Pertanyaan:</span>
                    <span className="font-semibold text-slate-800">
                      {exam.questions.length} Soal (PG & Esai)
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Nilai KKM Kelulusan:</span>
                    <span className="font-semibold text-slate-800">
                      {exam.passingScore} Poin
                    </span>
                  </div>
                </div>

                {/* Submission Result Snippet if already submitted */}
                {isSubmitted && (
                  <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-100 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-indigo-950 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Status: Ujian Telah Dikerjakan
                      </span>
                      <span className="font-bold text-indigo-900 font-mono text-sm">
                        Skor: {submission.totalScore} / {submission.maxScore}
                      </span>
                    </div>
                    <div className="text-slate-600">
                      Diserahkan pada: {new Date(submission.submittedAt).toLocaleString('id-ID')}
                    </div>
                    {submission.teacherNotes && (
                      <div className="text-[11px] text-slate-700 bg-white p-2.5 rounded border border-indigo-100">
                        <strong>Catatan Pengajar:</strong> {submission.teacherNotes}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Batas Akhir: {new Date(exam.deadline).toLocaleDateString('id-ID')}
                </span>

                {isSubmitted ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setReviewExam({ exam, submission })}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-indigo-700 bg-white border border-indigo-200 hover:bg-indigo-50 rounded-lg shadow-2xs transition-colors"
                      title="Lihat rincian lembar jawaban dan skor per soal"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Ulas Hasil</span>
                    </button>
                    <button
                      onClick={() => {
                        resetStudentExamSubmission(exam.id);
                        startExamRunner(exam.id);
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-300 shadow-2xs"
                      title="Kerjakan ulang ujian dengan butir soal terbaru dari guru"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-slate-600" />
                      <span>Kerjakan Ulang</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => startExamRunner(exam.id)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
                  >
                    <span>Mulai Kerjakan Ujian</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Review Modal */}
      {reviewExam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-3xl max-h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
              <div>
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                  Ulasan Hasil Pengerjaan
                </span>
                <h3 className="text-lg font-bold text-slate-900">
                  {reviewExam.exam.title}
                </h3>
                <div className="text-xs text-slate-500 mt-0.5">
                  Total Perolehan: {reviewExam.submission.totalScore} dari {reviewExam.submission.maxScore} Poin
                </div>
              </div>
              <button
                onClick={() => setReviewExam(null)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 p-6 overflow-y-auto space-y-6">
              {reviewExam.exam.questions.map((q, idx) => {
                const studentAns = reviewExam.submission.answers[q.id];
                const scoreAwarded = reviewExam.submission.questionScores[q.id] || 0;

                return (
                  <div
                    key={q.id}
                    className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3"
                  >
                    <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-200">
                      <span className="font-bold text-slate-700">Soal {idx + 1}</span>
                      <span className="font-mono font-semibold">
                        Nilai: {scoreAwarded} / {q.points} Poin
                      </span>
                    </div>

                    <p className="text-sm font-medium text-slate-900 leading-relaxed">
                      {q.text}
                    </p>

                    {q.type === 'multiple_choice' && q.options && (
                      <div className="space-y-2 pt-1 text-xs">
                        {q.options.map((opt) => {
                          const isStudentPick = Boolean(
                            studentAns === opt.id ||
                            (studentAns && opt.id.toLowerCase() === studentAns.toLowerCase())
                          );
                          const isCorrectPick = Boolean(
                            opt.id === q.correctOptionId ||
                            (opt.id === 'opt_a' && (q.correctOptionId === 'A' || q.correctOptionId === 'opt_a')) ||
                            (opt.id === 'opt_b' && (q.correctOptionId === 'B' || q.correctOptionId === 'opt_b')) ||
                            (opt.id === 'opt_c' && (q.correctOptionId === 'C' || q.correctOptionId === 'opt_c')) ||
                            (opt.id === 'opt_d' && (q.correctOptionId === 'D' || q.correctOptionId === 'opt_d'))
                          );

                          let badgeClass = 'border-slate-200 bg-white text-slate-700';
                          if (isCorrectPick) {
                            badgeClass = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold';
                          } else if (isStudentPick && !isCorrectPick) {
                            badgeClass = 'border-rose-400 bg-rose-50 text-rose-900';
                          }

                          return (
                            <div
                              key={opt.id}
                              className={`p-3 rounded-lg border flex items-center justify-between gap-2 ${badgeClass}`}
                            >
                              <span>{opt.text}</span>
                              {isStudentPick && (
                                <span className="text-[11px] font-bold text-slate-500">
                                  (Pilihan Anda)
                                </span>
                              )}
                              {isCorrectPick && (
                                <span className="text-[11px] font-bold text-emerald-700">
                                  ✓ Kunci Benar Terverifikasi
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {q.type === 'essay' && (
                      <div className="space-y-2 pt-1">
                        <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs text-slate-800 leading-relaxed">
                          <span className="font-semibold block text-slate-500 mb-1">Jawaban Anda:</span>
                          {studentAns || <span className="italic text-slate-400">Tidak ada jawaban</span>}
                        </div>
                      </div>
                    )}

                    {q.explanation && (
                      <div className="p-3 rounded-lg bg-indigo-50 border border-indigo-100 text-xs text-indigo-900 leading-relaxed">
                        <strong>Pembahasan:</strong> {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between p-4 border-t border-slate-200 bg-slate-50">
              <button
                onClick={() => {
                  const examId = reviewExam.exam.id;
                  setReviewExam(null);
                  resetStudentExamSubmission(examId);
                  startExamRunner(examId);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-2xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Kerjakan Ulang Ujian Ini</span>
              </button>

              <button
                onClick={() => setReviewExam(null)}
                className="px-5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100"
              >
                Tutup Ulasan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
