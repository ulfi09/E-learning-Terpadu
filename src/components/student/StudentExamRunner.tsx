import React, { useState, useEffect, useRef } from 'react';
import {
  Clock,
  AlertTriangle,
  CheckCircle2,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Send,
  HelpCircle,
  FileEdit,
  X,
} from 'lucide-react';
import { Exam, ExamQuestion } from '../../types';
import { useLms } from '../../context/LmsContext';

interface StudentExamRunnerProps {
  exam: Exam;
  onClose: () => void;
}

export const StudentExamRunner: React.FC<StudentExamRunnerProps> = ({ exam, onClose }) => {
  const { submitExamAnswers } = useLms();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [flaggedDoubt, setFlaggedDoubt] = useState<Record<string, boolean>>({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Countdown timer in seconds
  const [secondsRemaining, setSecondsRemaining] = useState(exam.durationMinutes * 60);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleFinalSubmit(); // Auto-submit when time expires!
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleFinalSubmit = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    submitExamAnswers(exam.id, answers, flaggedDoubt);
  };

  const currentQuestion: ExamQuestion = exam.questions[currentIndex];

  const handleSelectOption = (optionId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionId,
    }));
  };

  const handleEssayChange = (text: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: text,
    }));
  };

  const handleToggleDoubt = () => {
    setFlaggedDoubt((prev) => ({
      ...prev,
      [currentQuestion.id]: !prev[currentQuestion.id],
    }));
  };

  // Format time
  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const isTimeCritical = secondsRemaining < 300; // Under 5 minutes

  // Question stats
  const totalQuestions = exam.questions.length;
  const answeredCount = Object.keys(answers).filter((k) => !!answers[k]?.trim()).length;
  const doubtCount = Object.values(flaggedDoubt).filter(Boolean).length;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-900 text-slate-100 font-sans">
      {/* Top Header Bar */}
      <header className="flex items-center justify-between px-6 py-3.5 bg-slate-950 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <div>
            <h1 className="text-sm sm:text-base font-bold text-white truncate max-w-md">
              {exam.title}
            </h1>
            <div className="text-xs text-slate-400">
              Soal {currentIndex + 1} dari {totalQuestions} · Bobot {currentQuestion.points} Poin
            </div>
          </div>
        </div>

        {/* Live Timer Pill */}
        <div className="flex items-center gap-4">
          <div
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg border font-mono text-sm font-bold tabular-nums ${
              isTimeCritical
                ? 'bg-rose-950/80 border-rose-600 text-rose-300 animate-pulse'
                : 'bg-slate-800 border-slate-700 text-indigo-300'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Sisa Waktu: {timeFormatted}</span>
          </div>

          <button
            onClick={() => setShowConfirmModal(true)}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-xs transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Selesaikan Ujian</span>
          </button>
        </div>
      </header>

      {/* Main Workspace Split */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Question Body */}
        <div className="flex-1 flex flex-col p-6 sm:p-8 overflow-y-auto bg-slate-900">
          <div className="max-w-3xl mx-auto w-full flex-1 flex flex-col justify-between space-y-6">
            <div>
              {/* Question metadata row */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs text-slate-400">
                <span className="font-semibold text-indigo-400 uppercase tracking-wider">
                  {currentQuestion.type === 'multiple_choice' ? 'Pilihan Ganda' : 'Soal Esai Komprehensif'}
                </span>
                <button
                  onClick={handleToggleDoubt}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                    flaggedDoubt[currentQuestion.id]
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>{flaggedDoubt[currentQuestion.id] ? 'Tandai Ragu-Ragu (Aktif)' : 'Tandai Ragu-Ragu'}</span>
                </button>
              </div>

              {/* Question Text */}
              <div className="py-6 text-base sm:text-lg text-slate-100 leading-relaxed font-medium">
                {currentQuestion.text}
              </div>

              {/* Options or Essay Area */}
              {currentQuestion.type === 'multiple_choice' && currentQuestion.options && (
                <div className="space-y-3 pt-2">
                  {currentQuestion.options.map((option, idx) => {
                    const optionLetter = String.fromCharCode(65 + idx);
                    const isSelected = answers[currentQuestion.id] === option.id;

                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => handleSelectOption(option.id)}
                        className={`w-full flex items-start gap-4 p-4 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'bg-indigo-950/40 border-indigo-500 text-white shadow-xs'
                            : 'bg-slate-800/60 border-slate-700/80 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
                        }`}
                      >
                        <span
                          className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                            isSelected
                              ? 'bg-indigo-600 text-white'
                              : 'bg-slate-700 text-slate-300'
                          }`}
                        >
                          {optionLetter}
                        </span>
                        <span className="text-sm sm:text-base leading-relaxed flex-1">
                          {option.text}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              {currentQuestion.type === 'essay' && (
                <div className="space-y-3 pt-2">
                  {currentQuestion.rubricGuidance && (
                    <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs text-slate-300">
                      <span className="font-semibold text-indigo-400 block mb-0.5">Petunjuk Rubrik Jawaban:</span>
                      {currentQuestion.rubricGuidance}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      Ketikkan Lembar Jawaban Esai Anda (Tersimpan Otomatis)
                    </label>
                    <textarea
                      rows={7}
                      value={answers[currentQuestion.id] || ''}
                      onChange={(e) => handleEssayChange(e.target.value)}
                      placeholder="Jelaskan alur pemikiran, rumus langkah komputasi, atau analisis kritis Anda di sini..."
                      className="w-full text-sm p-4 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none leading-relaxed font-sans"
                    />
                    <div className="text-[11px] text-slate-500 text-right mt-1 font-mono">
                      {(answers[currentQuestion.id] || '').length} Karakter
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Nav Prev / Next */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-800">
              <button
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 disabled:opacity-30 disabled:pointer-events-none transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Soal Sebelumnya</span>
              </button>

              <div className="text-xs text-slate-400 hidden sm:block">
                Tersimpan di memori sesi ujian
              </div>

              {currentIndex < totalQuestions - 1 ? (
                <button
                  onClick={() => setCurrentIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
                >
                  <span>Soal Selanjutnya</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => setShowConfirmModal(true)}
                  className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs transition-colors"
                >
                  <Send className="w-4 h-4" />
                  <span>Kirim Jawaban Ujian</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar: Question Palette Navigator */}
        <aside className="w-full lg:w-72 bg-slate-950 border-t lg:border-t-0 lg:border-l border-slate-800 p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
              Navigasi Nomor Soal
            </h2>

            {/* Status Legend */}
            <div className="space-y-1.5 text-xs text-slate-400 mb-5 p-3 rounded-xl bg-slate-900 border border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded bg-indigo-600 inline-block" />
                <span>Sudah Terjawab ({answeredCount})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded bg-amber-500 inline-block" />
                <span>Ragu-Ragu ({doubtCount})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded bg-slate-800 border border-slate-700 inline-block" />
                <span>Belum Dijawab ({totalQuestions - answeredCount})</span>
              </div>
            </div>

            {/* Question Buttons Grid */}
            <div className="grid grid-cols-5 gap-2">
              {exam.questions.map((q, idx) => {
                const isCurrent = currentIndex === idx;
                const isAnswered = !!answers[q.id]?.trim();
                const isDoubt = flaggedDoubt[q.id];

                let bgClass = 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700';
                if (isDoubt) {
                  bgClass = 'bg-amber-600 text-white border-amber-500 font-bold';
                } else if (isAnswered) {
                  bgClass = 'bg-indigo-600 text-white border-indigo-500 font-bold';
                }

                if (isCurrent) {
                  bgClass += ' ring-2 ring-white ring-offset-2 ring-offset-slate-950';
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-10 rounded-lg text-xs font-mono font-medium border transition-all flex items-center justify-center ${bgClass}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800 mt-6 lg:mt-0">
            <button
              onClick={() => setShowConfirmModal(true)}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-colors shadow-xs"
            >
              <Send className="w-4 h-4" />
              <span>Selesai & Kumpulkan</span>
            </button>
          </div>
        </aside>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs text-slate-900">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">
                Konfirmasi Penyerahan Ujian
              </h3>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-slate-600 mb-6">
              <p>Apakah Anda yakin ingin menyelesaikan dan mengumpulkan ujian ini?</p>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 font-medium">
                <div className="flex justify-between">
                  <span>Total Soal:</span>
                  <span className="font-mono">{totalQuestions}</span>
                </div>
                <div className="flex justify-between text-indigo-700">
                  <span>Sudah Terjawab:</span>
                  <span className="font-mono">{answeredCount}</span>
                </div>
                {doubtCount > 0 && (
                  <div className="flex justify-between text-amber-600 font-semibold">
                    <span>Masih Ragu-Ragu:</span>
                    <span className="font-mono">{doubtCount}</span>
                  </div>
                )}
                {totalQuestions - answeredCount > 0 && (
                  <div className="flex justify-between text-rose-600 font-semibold">
                    <span>Belum Dijawab:</span>
                    <span className="font-mono">{totalQuestions - answeredCount}</span>
                  </div>
                )}
              </div>
              <p className="text-[11px] text-slate-500">
                Setelah diserahkan, Anda tidak dapat mengubah jawaban lagi. Skor pilihan ganda akan langsung dikalkulasikan.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-lg hover:bg-slate-100"
              >
                Periksa Kembali
              </button>
              <button
                type="button"
                onClick={handleFinalSubmit}
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
              >
                Ya, Kumpulkan Sekarang
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
