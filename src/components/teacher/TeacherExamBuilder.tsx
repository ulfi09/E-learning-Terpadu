import React, { useState } from 'react';
import {
  CheckCircle2,
  Plus,
  Clock,
  Eye,
  Trash2,
  Edit,
  Award,
  Users,
  Search,
  BookOpen,
  HelpCircle,
  X,
  Send,
  Check,
  FileQuestion,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { useLms } from '../../context/LmsContext';
import { Exam, ExamQuestion, ExamSubmission } from '../../types';

export const TeacherExamBuilder: React.FC = () => {
  const {
    exams,
    courses,
    createExam,
    updateExamQuestions,
    deleteExam,
    togglePublishExam,
    gradeExamSubmission,
    showToast,
  } = useLms();

  const [selectedCourseFilter, setSelectedCourseFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [managingExam, setManagingExam] = useState<Exam | null>(null);
  const [activeEssayGradingModal, setActiveEssayGradingModal] = useState<{
    exam: Exam;
    submission: ExamSubmission;
  } | null>(null);

  // ==========================================
  // CREATE NEW EXAM FORM STATE
  // ==========================================
  const [newCourseId, setNewCourseId] = useState(courses[0]?.id || 'course_web_01');
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newDuration, setNewDuration] = useState(30);
  const [newPassingScore, setNewPassingScore] = useState(75);
  const [newDeadline, setNewDeadline] = useState('2026-11-20T18:00');
  const [newExamQuestions, setNewExamQuestions] = useState<ExamQuestion[]>([]);

  // ==========================================
  // SHARED QUESTION BUILDER STATE (for both new & existing exam)
  // ==========================================
  const [qType, setQType] = useState<'multiple_choice' | 'essay'>('multiple_choice');
  const [qText, setQText] = useState('');
  const [qPoints, setQPoints] = useState(25);
  const [qOptA, setQOptA] = useState('');
  const [qOptB, setQOptB] = useState('');
  const [qOptC, setQOptC] = useState('');
  const [qOptD, setQOptD] = useState('');
  const [qCorrectOpt, setQCorrectOpt] = useState<'opt_a' | 'opt_b' | 'opt_c' | 'opt_d'>('opt_a');
  const [qExplanation, setQExplanation] = useState('');
  const [qRubric, setQRubric] = useState('');
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);

  // Essay grading form state
  const [essayScores, setEssayScores] = useState<Record<string, number>>({});
  const [essayTeacherNotes, setEssayTeacherNotes] = useState('');

  const filteredExams = exams.filter((e) => {
    if (selectedCourseFilter !== 'all' && e.courseId !== selectedCourseFilter) return false;
    return true;
  });

  const resetQuestionForm = () => {
    setQType('multiple_choice');
    setQText('');
    setQPoints(25);
    setQOptA('');
    setQOptB('');
    setQOptC('');
    setQOptD('');
    setQCorrectOpt('opt_a');
    setQExplanation('');
    setQRubric('');
    setEditingQuestionId(null);
  };

  // Build a validated question object
  const buildCurrentQuestion = (): ExamQuestion | null => {
    if (!qText.trim()) {
      showToast('Teks Soal Kosong', 'Ketikkan teks pertanyaan terlebih dahulu.', 'warning');
      return null;
    }

    if (qType === 'multiple_choice') {
      if (!qOptA.trim() || !qOptB.trim()) {
        showToast('Opsi Pilihan Belum Lengkap', 'Minimal masukkan teks untuk Opsi A dan Opsi B.', 'warning');
        return null;
      }

      return {
        id: editingQuestionId || `q_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        type: 'multiple_choice',
        text: qText.trim(),
        options: [
          { id: 'opt_a', text: qOptA.trim() },
          { id: 'opt_b', text: qOptB.trim() },
          { id: 'opt_c', text: qOptC.trim() || 'Pilihan C' },
          { id: 'opt_d', text: qOptD.trim() || 'Pilihan D' },
        ],
        correctOptionId: qCorrectOpt,
        points: Number(qPoints) || 20,
        explanation: qExplanation.trim() || 'Kunci jawaban telah diverifikasi sesuai silabus pengajar.',
      };
    } else {
      return {
        id: editingQuestionId || `q_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        type: 'essay',
        text: qText.trim(),
        points: Number(qPoints) || 20,
        rubricGuidance: qRubric.trim() || 'Rubrik penilaian esai terstandarisasi pengajar.',
      };
    }
  };

  // Add question to NEW exam creation modal
  const handleAddQuestionToNewExam = () => {
    const q = buildCurrentQuestion();
    if (!q) return;

    if (editingQuestionId) {
      setNewExamQuestions((prev) => prev.map((item) => (item.id === editingQuestionId ? q : item)));
    } else {
      setNewExamQuestions((prev) => [...prev, q]);
    }
    resetQuestionForm();
    showToast('Soal Ditambahkan', 'Butir soal baru berhasil dimasukkan ke daftar ujian.');
  };

  // Add or update question in EXISTING exam
  const handleAddQuestionToExistingExam = () => {
    if (!managingExam) return;
    const q = buildCurrentQuestion();
    if (!q) return;

    let updatedQuestions: ExamQuestion[];
    if (editingQuestionId) {
      updatedQuestions = managingExam.questions.map((item) => (item.id === editingQuestionId ? q : item));
    } else {
      updatedQuestions = [...managingExam.questions, q];
    }

    updateExamQuestions(managingExam.id, updatedQuestions);
    setManagingExam({ ...managingExam, questions: updatedQuestions });
    resetQuestionForm();
  };

  const handleEditQuestionClick = (q: ExamQuestion) => {
    setEditingQuestionId(q.id);
    setQType(q.type);
    setQText(q.text);
    setQPoints(q.points);
    if (q.type === 'multiple_choice' && q.options) {
      const optA = q.options.find((o) => o.id === 'opt_a')?.text || q.options[0]?.text || '';
      const optB = q.options.find((o) => o.id === 'opt_b')?.text || q.options[1]?.text || '';
      const optC = q.options.find((o) => o.id === 'opt_c')?.text || q.options[2]?.text || '';
      const optD = q.options.find((o) => o.id === 'opt_d')?.text || q.options[3]?.text || '';
      setQOptA(optA);
      setQOptB(optB);
      setQOptC(optC);
      setQOptD(optD);

      let normalizedCorrect: 'opt_a' | 'opt_b' | 'opt_c' | 'opt_d' = 'opt_a';
      if (q.correctOptionId === 'opt_b' || q.correctOptionId === 'B' || q.correctOptionId === q.options[1]?.id) {
        normalizedCorrect = 'opt_b';
      } else if (q.correctOptionId === 'opt_c' || q.correctOptionId === 'C' || q.correctOptionId === q.options[2]?.id) {
        normalizedCorrect = 'opt_c';
      } else if (q.correctOptionId === 'opt_d' || q.correctOptionId === 'D' || q.correctOptionId === q.options[3]?.id) {
        normalizedCorrect = 'opt_d';
      } else {
        normalizedCorrect = 'opt_a';
      }
      setQCorrectOpt(normalizedCorrect);
      setQExplanation(q.explanation || '');
    } else {
      setQRubric(q.rubricGuidance || '');
    }
  };

  const handleDeleteQuestionFromExisting = (questionId: string) => {
    if (!managingExam) return;
    const updated = managingExam.questions.filter((q) => q.id !== questionId);
    updateExamQuestions(managingExam.id, updated);
    setManagingExam({ ...managingExam, questions: updated });
  };

  const handleCreateExamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      showToast('Judul Ujian Diperlukan', 'Masukkan judul ujian terlebih dahulu.', 'warning');
      return;
    }

    if (newExamQuestions.length === 0) {
      showToast('Soal Masih Kosong', 'Tambahkan minimal 1 butir soal ke dalam ujian baru ini.', 'warning');
      return;
    }

    createExam({
      courseId: newCourseId,
      title: newTitle.trim(),
      description: newDescription.trim() || 'Evaluasi pembelajaran terjadwal.',
      durationMinutes: Number(newDuration),
      passingScore: Number(newPassingScore),
      deadline: newDeadline,
      isPublished: true,
      questions: newExamQuestions,
    });

    setShowCreateModal(false);
    setNewTitle('');
    setNewDescription('');
    setNewExamQuestions([]);
    resetQuestionForm();
  };

  const openEssayGrading = (exam: Exam, submission: ExamSubmission) => {
    setActiveEssayGradingModal({ exam, submission });
    setEssayScores(submission.questionScores || {});
    setEssayTeacherNotes(submission.teacherNotes || 'Analisis jawaban esai telah dikoreksi dengan seksama.');
  };

  const handleSaveEssayGrading = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeEssayGradingModal) return;

    gradeExamSubmission(
      activeEssayGradingModal.exam.id,
      activeEssayGradingModal.submission.id,
      essayScores,
      essayTeacherNotes
    );

    setActiveEssayGradingModal(null);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            Bank Soal & Manajemen Sistem Ujian
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Kelola butir soal dan kunci jawaban terverifikasi, sinkronisasi otomatis ke portal siswa, dan periksa lembar esai
          </p>
        </div>

        <button
          onClick={() => {
            resetQuestionForm();
            setNewExamQuestions([]);
            setShowCreateModal(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Ujian & Bank Soal Baru</span>
        </button>
      </div>

      {/* Filter Row */}
      <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider pl-1">
            Mata Pelajaran:
          </span>
          <select
            value={selectedCourseFilter}
            onChange={(e) => setSelectedCourseFilter(e.target.value)}
            className="text-xs font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">Semua Mata Pelajaran</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.code} - {c.title}
              </option>
            ))}
          </select>
        </div>

        <div className="text-xs text-slate-500 font-mono">
          {filteredExams.length} Ujian Terdaftar
        </div>
      </div>

      {/* Exams List Cards */}
      <div className="space-y-6">
        {filteredExams.map((exam) => {
          const course = courses.find((c) => c.id === exam.courseId);
          const mcQuestions = exam.questions.filter((q) => q.type === 'multiple_choice');
          const essayQuestions = exam.questions.filter((q) => q.type === 'essay');
          const totalPoints = exam.questions.reduce((sum, q) => sum + q.points, 0);

          return (
            <div
              key={exam.id}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs space-y-4 p-6"
            >
              {/* Exam Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-mono font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                    {course?.code}
                  </span>
                  <span className="text-slate-400">·</span>
                  <span className="font-medium text-slate-700 flex items-center gap-1 font-mono">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {exam.durationMinutes} Menit Timer
                  </span>
                  <span className="text-slate-400">·</span>
                  <span className="text-slate-600 font-semibold">
                    {exam.questions.length} Butir Soal ({mcQuestions.length} PG, {essayQuestions.length} Esai · Total {totalPoints} Poin)
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => togglePublishExam(exam.id)}
                    className={`px-3 py-1 text-xs font-semibold rounded-md border transition-colors ${
                      exam.isPublished
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-slate-100 text-slate-600 border-slate-300'
                    }`}
                  >
                    {exam.isPublished ? '● Publikasi Aktif' : '○ Draf (Non-aktif)'}
                  </button>

                  <button
                    onClick={() => deleteExam(exam.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                    title="Hapus Ujian"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 mb-1">
                  {exam.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {exam.description}
                </p>
              </div>

              {/* Manage Questions Button Bar */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-indigo-50/60 border border-indigo-100">
                <div className="text-xs text-indigo-950 flex items-center gap-2">
                  <FileQuestion className="w-4 h-4 text-indigo-600" />
                  <span>
                    Bank Soal Ujian: <strong>{exam.questions.length} Butir Soal Terpasang</strong> (Kunci jawaban diverifikasi otomatis saat siswa submit)
                  </span>
                </div>

                <button
                  onClick={() => {
                    resetQuestionForm();
                    setManagingExam(exam);
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-colors shadow-2xs"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Kelola Soal & Kunci Jawaban</span>
                </button>
              </div>

              {/* Submissions by Students */}
              <div className="pt-2">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Lembar Jawaban Siswa ({exam.submissions.length} Pengumpulan)
                </h4>

                {exam.submissions.length === 0 ? (
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-center text-xs text-slate-400">
                    Belum ada siswa yang menyelesaikan sesi ujian ini.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {exam.submissions.map((sub) => {
                      return (
                        <div
                          key={sub.id}
                          className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 font-bold text-slate-900">
                              <span>{sub.studentName}</span>
                              <span className="font-mono text-slate-400 text-[11px]">
                                Diserahkan {new Date(sub.submittedAt).toLocaleTimeString('id-ID')}
                              </span>
                            </div>
                            <div className="text-slate-500 text-[11px]">
                              Total Skor: <strong className="text-indigo-600 font-mono text-sm">{sub.totalScore}</strong> / {sub.maxScore} Poin
                              {sub.isGraded ? ' (Selesai Dinilai)' : ' (Menunggu Koreksi Esai)'}
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => openEssayGrading(exam, sub)}
                              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors"
                            >
                              Koreksi Lembar Jawaban & Esai
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* MODAL: MANAGE QUESTIONS & VERIFIED ANSWER KEYS FOR EXISTING EXAM           */}
      {/* ========================================================================= */}
      {managingExam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs">
          <div className="w-full max-w-4xl max-h-[92vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
              <div>
                <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                  Bank Soal & Kunci Jawaban Resmi Pengajar
                </span>
                <h3 className="text-lg font-bold text-slate-900">
                  {managingExam.title}
                </h3>
                <div className="text-xs text-slate-500 mt-0.5">
                  Total {managingExam.questions.length} Butir Soal · Soal yang ada di sini sama persis dengan yang dikerjakan siswa
                </div>
              </div>
              <button
                onClick={() => {
                  setManagingExam(null);
                  resetQuestionForm();
                }}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Existing Questions List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Daftar Butir Soal Terpasang ({managingExam.questions.length} Soal)
                  </h4>
                  <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Kunci Jawaban Terverifikasi
                  </span>
                </div>

                {managingExam.questions.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-400">
                    Belum ada butir soal pada ujian ini. Silakan tambahkan butir soal di bawah.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {managingExam.questions.map((q, idx) => {
                      return (
                        <div
                          key={q.id}
                          className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3 text-xs"
                        >
                          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900 text-sm">
                                No {idx + 1}.
                              </span>
                              <span className="px-2 py-0.5 rounded font-semibold text-[11px] uppercase bg-indigo-50 text-indigo-700 border border-indigo-200">
                                {q.type === 'multiple_choice' ? 'Pilihan Ganda' : 'Esai'}
                              </span>
                              <span className="font-mono text-slate-500 font-semibold">
                                ({q.points} Poin)
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => handleEditQuestionClick(q)}
                                className="px-2.5 py-1 text-xs font-semibold text-indigo-700 bg-white border border-indigo-200 hover:bg-indigo-50 rounded-md transition-colors"
                              >
                                Edit Soal Ini
                              </button>
                              <button
                                onClick={() => handleDeleteQuestionFromExisting(q.id)}
                                className="p-1 text-slate-400 hover:text-rose-600 rounded"
                                title="Hapus Soal"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <p className="text-sm font-medium text-slate-900 leading-relaxed">
                            {q.text}
                          </p>

                          {q.type === 'multiple_choice' && q.options && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                              {q.options.map((opt, optIdx) => {
                                const letter = String.fromCharCode(65 + optIdx);
                                const isCorrect = opt.id === q.correctOptionId;

                                return (
                                  <div
                                    key={opt.id}
                                    className={`p-2.5 rounded-lg border flex items-center justify-between gap-2 ${
                                      isCorrect
                                        ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-semibold'
                                        : 'bg-white border-slate-200 text-slate-700'
                                    }`}
                                  >
                                    <div className="flex items-center gap-2 truncate">
                                      <span
                                        className={`w-5 h-5 rounded flex items-center justify-center font-bold text-xs shrink-0 ${
                                          isCorrect
                                            ? 'bg-emerald-600 text-white'
                                            : 'bg-slate-200 text-slate-700'
                                        }`}
                                      >
                                        {letter}
                                      </span>
                                      <span className="truncate">{opt.text}</span>
                                    </div>
                                    {isCorrect && (
                                      <span className="text-[10px] bg-emerald-600 text-white px-1.5 py-0.5 rounded font-bold shrink-0">
                                        ✓ KUNCI BENAR
                                      </span>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}

                          {q.explanation && (
                            <div className="p-2 rounded bg-indigo-50 border border-indigo-100 text-[11px] text-indigo-900">
                              <strong>Pembahasan Kunci:</strong> {q.explanation}
                            </div>
                          )}

                          {q.rubricGuidance && (
                            <div className="p-2 rounded bg-slate-100 border border-slate-200 text-[11px] text-slate-700">
                              <strong>Panduan Rubrik Esai:</strong> {q.rubricGuidance}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Form to Add / Edit Question to Existing Exam */}
              <div className="p-5 rounded-2xl bg-indigo-50/80 border border-indigo-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-indigo-950 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    <span>
                      {editingQuestionId ? 'Ubah Butir Soal Terpilih' : '+ Tambah Butir Soal Baru ke Ujian Ini'}
                    </span>
                  </h4>
                  {editingQuestionId && (
                    <button
                      onClick={resetQuestionForm}
                      className="text-xs font-semibold text-rose-600 hover:underline"
                    >
                      Batalkan Edit
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                      Tipe Pertanyaan
                    </label>
                    <select
                      value={qType}
                      onChange={(e) => setQType(e.target.value as any)}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white"
                    >
                      <option value="multiple_choice">Pilihan Ganda (Kunci Otomatis)</option>
                      <option value="essay">Esai (Koreksi Rubrik Pengajar)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                      Bobot Poin
                    </label>
                    <input
                      type="number"
                      min={5}
                      max={100}
                      value={qPoints}
                      onChange={(e) => setQPoints(Number(e.target.value))}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white font-mono font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Kalimat Pertanyaan Soal
                  </label>
                  <textarea
                    rows={3}
                    value={qText}
                    onChange={(e) => setQText(e.target.value)}
                    placeholder="Tuliskan pertanyaan ujian di sini secara jelas..."
                    className="w-full text-xs sm:text-sm p-3 rounded-lg border border-slate-300 bg-white focus:border-indigo-500 outline-none"
                  />
                </div>

                {qType === 'multiple_choice' ? (
                  <div className="space-y-3 pt-1 border-t border-indigo-100">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 uppercase">
                        Opsi Pilihan Jawaban & Kunci Benar:
                      </span>
                      <span className="text-[11px] text-indigo-700 font-semibold">
                        Pilih radio button pada opsi yang merupakan KUNCI BENAR
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Option A */}
                      <div className={`p-3 rounded-xl border bg-white ${qCorrectOpt === 'opt_a' ? 'border-emerald-500 ring-1 ring-emerald-500' : 'border-slate-300'}`}>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="correctOptSelect"
                              checked={qCorrectOpt === 'opt_a'}
                              onChange={() => setQCorrectOpt('opt_a')}
                              className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                            />
                            <span className="text-xs font-bold text-slate-900">Opsi A</span>
                          </label>
                          {qCorrectOpt === 'opt_a' && (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                              ✓ Kunci Benar
                            </span>
                          )}
                        </div>
                        <input
                          type="text"
                          required
                          value={qOptA}
                          onChange={(e) => setQOptA(e.target.value)}
                          placeholder="Teks Opsi A..."
                          className="w-full text-xs p-2 rounded border border-slate-200"
                        />
                      </div>

                      {/* Option B */}
                      <div className={`p-3 rounded-xl border bg-white ${qCorrectOpt === 'opt_b' ? 'border-emerald-500 ring-1 ring-emerald-500' : 'border-slate-300'}`}>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="correctOptSelect"
                              checked={qCorrectOpt === 'opt_b'}
                              onChange={() => setQCorrectOpt('opt_b')}
                              className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                            />
                            <span className="text-xs font-bold text-slate-900">Opsi B</span>
                          </label>
                          {qCorrectOpt === 'opt_b' && (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                              ✓ Kunci Benar
                            </span>
                          )}
                        </div>
                        <input
                          type="text"
                          required
                          value={qOptB}
                          onChange={(e) => setQOptB(e.target.value)}
                          placeholder="Teks Opsi B..."
                          className="w-full text-xs p-2 rounded border border-slate-200"
                        />
                      </div>

                      {/* Option C */}
                      <div className={`p-3 rounded-xl border bg-white ${qCorrectOpt === 'opt_c' ? 'border-emerald-500 ring-1 ring-emerald-500' : 'border-slate-300'}`}>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="correctOptSelect"
                              checked={qCorrectOpt === 'opt_c'}
                              onChange={() => setQCorrectOpt('opt_c')}
                              className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                            />
                            <span className="text-xs font-bold text-slate-900">Opsi C</span>
                          </label>
                          {qCorrectOpt === 'opt_c' && (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                              ✓ Kunci Benar
                            </span>
                          )}
                        </div>
                        <input
                          type="text"
                          value={qOptC}
                          onChange={(e) => setQOptC(e.target.value)}
                          placeholder="Teks Opsi C..."
                          className="w-full text-xs p-2 rounded border border-slate-200"
                        />
                      </div>

                      {/* Option D */}
                      <div className={`p-3 rounded-xl border bg-white ${qCorrectOpt === 'opt_d' ? 'border-emerald-500 ring-1 ring-emerald-500' : 'border-slate-300'}`}>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="correctOptSelect"
                              checked={qCorrectOpt === 'opt_d'}
                              onChange={() => setQCorrectOpt('opt_d')}
                              className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                            />
                            <span className="text-xs font-bold text-slate-900">Opsi D</span>
                          </label>
                          {qCorrectOpt === 'opt_d' && (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                              ✓ Kunci Benar
                            </span>
                          )}
                        </div>
                        <input
                          type="text"
                          value={qOptD}
                          onChange={(e) => setQOptD(e.target.value)}
                          placeholder="Teks Opsi D..."
                          className="w-full text-xs p-2 rounded border border-slate-200"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                        Pembahasan & Rasional Kunci Jawaban
                      </label>
                      <input
                        type="text"
                        value={qExplanation}
                        onChange={(e) => setQExplanation(e.target.value)}
                        placeholder="Contoh: Mengapa opsi tersebut merupakan jawaban yang benar..."
                        className="w-full text-xs p-2.5 rounded border border-slate-300 bg-white"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                      Panduan Rubrik Penilaian Esai
                    </label>
                    <textarea
                      rows={2}
                      value={qRubric}
                      onChange={(e) => setQRubric(e.target.value)}
                      placeholder="Kriteria penilaian dan poin penting yang harus dijawab siswa..."
                      className="w-full text-xs p-2.5 rounded border border-slate-300 bg-white"
                    />
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleAddQuestionToExistingExam}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
                >
                  {editingQuestionId ? 'Simpan Pembaruan Butir Soal Ini' : 'Tambahkan Butir Soal ke Bank Ujian'}
                </button>
              </div>
            </div>

            <div className="flex justify-end p-4 border-t border-slate-200 bg-slate-50">
              <button
                onClick={() => {
                  setManagingExam(null);
                  resetQuestionForm();
                }}
                className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
              >
                Selesai & Tutup Pengelola Soal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CREATE BRAND NEW EXAM                                               */}
      {/* ========================================================================= */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs">
          <div className="w-full max-w-3xl max-h-[92vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
              <div>
                <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                  Pembuatan Evaluasi Baru
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  Penyusun Ujian & Bank Soal Terpadu
                </h3>
              </div>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  resetQuestionForm();
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateExamSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 uppercase mb-1">
                    Mata Pelajaran
                  </label>
                  <select
                    value={newCourseId}
                    onChange={(e) => setNewCourseId(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 bg-white"
                  >
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.code} - {c.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 uppercase mb-1">
                    Durasi Timer (Menit)
                  </label>
                  <input
                    type="number"
                    min={5}
                    max={180}
                    value={newDuration}
                    onChange={(e) => setNewDuration(Number(e.target.value))}
                    className="w-full p-2.5 rounded-lg border border-slate-300 font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase mb-1">
                  Judul Ujian
                </label>
                <input
                  required
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Contoh: Kuis 03: Query Relasional & Perancangan Arsitektur Basis Data"
                  className="w-full p-2.5 rounded-lg border border-slate-300 font-semibold text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 uppercase mb-1">
                    Batas Akhir (Deadline)
                  </label>
                  <input
                    type="datetime-local"
                    value={newDeadline}
                    onChange={(e) => setNewDeadline(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 uppercase mb-1">
                    Nilai KKM Kelulusan (Poin)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={newPassingScore}
                    onChange={(e) => setNewPassingScore(Number(e.target.value))}
                    className="w-full p-2.5 rounded-lg border border-slate-300 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase mb-1">
                  Deskripsi / Petunjuk Pengerjaan
                </label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Petunjuk teknis pengerjaan ujian untuk siswa..."
                  className="w-full p-2.5 rounded-lg border border-slate-300"
                />
              </div>

              {/* Added Questions List for New Exam */}
              <div className="pt-2 border-t space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 uppercase">
                    Daftar Butir Soal Terpasang ({newExamQuestions.length} Soal)
                  </span>
                  <span className="text-slate-500 font-mono">
                    Total Poin: {newExamQuestions.reduce((s, q) => s + q.points, 0)}
                  </span>
                </div>

                {newExamQuestions.length === 0 ? (
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center text-slate-400">
                    Belum ada soal ditambahkan. Gunakan formulir di bawah untuk menambahkan soal.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {newExamQuestions.map((q, idx) => (
                      <div
                        key={q.id}
                        className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between gap-3"
                      >
                        <div className="truncate flex-1">
                          <span className="font-bold text-slate-900 mr-1.5">No {idx + 1}.</span>
                          <span className="font-medium text-slate-800 truncate">{q.text}</span>
                          <span className="text-indigo-600 font-mono text-[11px] ml-2">
                            ({q.type === 'multiple_choice' ? 'PG' : 'Esai'} · {q.points} Poin)
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setNewExamQuestions((prev) => prev.filter((item) => item.id !== q.id))}
                          className="text-rose-500 hover:text-rose-700 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Subform to add question to new exam */}
                <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200 space-y-3">
                  <span className="font-bold text-indigo-950 block">
                    + Tambahkan Butir Soal ke Ujian Ini
                  </span>

                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={qType}
                      onChange={(e) => setQType(e.target.value as any)}
                      className="p-2 rounded border border-indigo-200 bg-white"
                    >
                      <option value="multiple_choice">Pilihan Ganda (PG)</option>
                      <option value="essay">Esai</option>
                    </select>
                    <input
                      type="number"
                      placeholder="Poin Soal"
                      value={qPoints}
                      onChange={(e) => setQPoints(Number(e.target.value))}
                      className="p-2 rounded border border-indigo-200 bg-white font-mono font-bold"
                    />
                  </div>

                  <input
                    type="text"
                    placeholder="Tuliskan pertanyaan soal..."
                    value={qText}
                    onChange={(e) => setQText(e.target.value)}
                    className="w-full p-2 rounded border border-indigo-200 bg-white font-medium"
                  />

                  {qType === 'multiple_choice' ? (
                    <div className="space-y-2 pt-1">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div className="p-2 rounded border bg-white flex items-center gap-2">
                          <input
                            type="radio"
                            name="correctOptSelectNew"
                            checked={qCorrectOpt === 'opt_a'}
                            onChange={() => setQCorrectOpt('opt_a')}
                          />
                          <input
                            type="text"
                            placeholder="Opsi A..."
                            value={qOptA}
                            onChange={(e) => setQOptA(e.target.value)}
                            className="w-full p-1 border-0 focus:outline-none"
                          />
                        </div>
                        <div className="p-2 rounded border bg-white flex items-center gap-2">
                          <input
                            type="radio"
                            name="correctOptSelectNew"
                            checked={qCorrectOpt === 'opt_b'}
                            onChange={() => setQCorrectOpt('opt_b')}
                          />
                          <input
                            type="text"
                            placeholder="Opsi B..."
                            value={qOptB}
                            onChange={(e) => setQOptB(e.target.value)}
                            className="w-full p-1 border-0 focus:outline-none"
                          />
                        </div>
                        <div className="p-2 rounded border bg-white flex items-center gap-2">
                          <input
                            type="radio"
                            name="correctOptSelectNew"
                            checked={qCorrectOpt === 'opt_c'}
                            onChange={() => setQCorrectOpt('opt_c')}
                          />
                          <input
                            type="text"
                            placeholder="Opsi C..."
                            value={qOptC}
                            onChange={(e) => setQOptC(e.target.value)}
                            className="w-full p-1 border-0 focus:outline-none"
                          />
                        </div>
                        <div className="p-2 rounded border bg-white flex items-center gap-2">
                          <input
                            type="radio"
                            name="correctOptSelectNew"
                            checked={qCorrectOpt === 'opt_d'}
                            onChange={() => setQCorrectOpt('opt_d')}
                          />
                          <input
                            type="text"
                            placeholder="Opsi D..."
                            value={qOptD}
                            onChange={(e) => setQOptD(e.target.value)}
                            className="w-full p-1 border-0 focus:outline-none"
                          />
                        </div>
                      </div>

                      <input
                        type="text"
                        placeholder="Pembahasan kunci jawaban terverifikasi..."
                        value={qExplanation}
                        onChange={(e) => setQExplanation(e.target.value)}
                        className="w-full p-2 rounded border border-indigo-200 bg-white"
                      />
                    </div>
                  ) : (
                    <input
                      type="text"
                      placeholder="Panduan rubrik penilaian esai..."
                      value={qRubric}
                      onChange={(e) => setQRubric(e.target.value)}
                      className="w-full p-2 rounded border border-indigo-200 bg-white"
                    />
                  )}

                  <button
                    type="button"
                    onClick={handleAddQuestionToNewExam}
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-bold transition-colors"
                  >
                    + Masukkan Soal Ini ke Ujian
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
                >
                  Simpan & Terbitkan Ujian
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ESSAY GRADING MODAL                                                       */}
      {/* ========================================================================= */}
      {activeEssayGradingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs">
          <div className="w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                  Koreksi Lembar Jawaban & Rubrik Ujian
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  {activeEssayGradingModal.submission.studentName}
                </h3>
              </div>
              <button
                onClick={() => setActiveEssayGradingModal(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEssayGrading} className="flex-1 overflow-y-auto space-y-4 py-4 pr-1">
              {activeEssayGradingModal.exam.questions.map((q, idx) => {
                const ans = activeEssayGradingModal.submission.answers[q.id] || '';
                const currentScore = essayScores[q.id] ?? 0;
                const isMc = q.type === 'multiple_choice';
                const isCorrect = isMc && ans === q.correctOptionId;

                return (
                  <div key={q.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2 text-xs">
                    <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                      <span className="font-bold text-slate-800">
                        Soal {idx + 1} ({isMc ? 'Pilihan Ganda' : 'Esai'})
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-500">Poin:</span>
                        <input
                          type="number"
                          min={0}
                          max={q.points}
                          value={currentScore}
                          onChange={(e) =>
                            setEssayScores((prev) => ({
                              ...prev,
                              [q.id]: Number(e.target.value),
                            }))
                          }
                          className="w-16 p-1 border rounded text-center font-mono font-bold bg-white"
                        />
                        <span className="text-slate-400">/ {q.points}</span>
                      </div>
                    </div>

                    <p className="text-slate-900 font-medium">{q.text}</p>

                    <div className="p-2.5 rounded bg-white border border-slate-200 text-slate-700">
                      <span className="text-slate-400 block font-semibold text-[11px] mb-0.5">Jawaban Siswa:</span>
                      {ans ? (
                        <div>
                          {isMc ? (
                            <div className="flex items-center gap-2">
                              <span>Pilihan: <strong>{ans.toUpperCase()}</strong></span>
                              {isCorrect ? (
                                <span className="text-emerald-700 font-bold">✓ Benar</span>
                              ) : (
                                <span className="text-rose-700 font-bold">✗ Salah (Kunci: {q.correctOptionId?.toUpperCase()})</span>
                              )}
                            </div>
                          ) : (
                            ans
                          )}
                        </div>
                      ) : (
                        <span className="italic text-slate-400">Kosong</span>
                      )}
                    </div>

                    {q.rubricGuidance && (
                      <div className="text-[11px] text-indigo-700 bg-indigo-50 p-2 rounded">
                        <strong>Panduan Rubrik:</strong> {q.rubricGuidance}
                      </div>
                    )}
                  </div>
                );
              })}

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Catatan Evaluasi / Ulasan Pengajar
                </label>
                <textarea
                  rows={3}
                  value={essayTeacherNotes}
                  onChange={(e) => setEssayTeacherNotes(e.target.value)}
                  placeholder="Catatan menyeluruh mengenai performa siswa pada ujian ini..."
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setActiveEssayGradingModal(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
                >
                  Simpan Nilai Akhir Ujian
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
