import React, { useState } from 'react';
import {
  UploadCloud,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Award,
  Users,
  Search,
  MessageSquare,
  X,
  Download,
} from 'lucide-react';
import { useLms } from '../../context/LmsContext';
import { Assignment, AssignmentSubmission } from '../../types';

export const TeacherAssignmentManager: React.FC = () => {
  const { assignments, courses, createAssignment, gradeAssignment } = useLms();

  const [selectedCourseFilter, setSelectedCourseFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeGradingModal, setActiveGradingModal] = useState<{
    assignment: Assignment;
    submission: AssignmentSubmission;
  } | null>(null);

  // Form states for new assignment
  const [newCourseId, setNewCourseId] = useState(courses[0]?.id || 'course_web_01');
  const [newTitle, setNewTitle] = useState('');
  const [newChapter, setNewChapter] = useState('');
  const [newInstructions, setNewInstructions] = useState('');
  const [newDeadline, setNewDeadline] = useState('2026-11-15T23:59');
  const [newWeight, setNewWeight] = useState(25);
  const [newMaxScore, setNewMaxScore] = useState(100);

  // Grading form states
  const [gradingScore, setGradingScore] = useState(90);
  const [gradingFeedback, setGradingFeedback] = useState('');

  const filteredAssignments = assignments.filter((a) => {
    if (selectedCourseFilter !== 'all' && a.courseId !== selectedCourseFilter) return false;
    return true;
  });

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    createAssignment({
      courseId: newCourseId,
      title: newTitle,
      chapter: newChapter || 'Bab Silabus Terkini',
      instructions: newInstructions,
      deadline: newDeadline,
      maxScore: Number(newMaxScore),
      weightPercentage: Number(newWeight),
      allowedFormats: ['PDF', 'ZIP', 'DOCX'],
    });

    setShowCreateModal(false);
    setNewTitle('');
    setNewInstructions('');
  };

  const openGradingModal = (assignment: Assignment, submission: AssignmentSubmission) => {
    setActiveGradingModal({ assignment, submission });
    setGradingScore(submission.score ?? 90);
    setGradingFeedback(submission.feedback ?? 'Analisis yang sangat komprehensif dan implementasi algoritma tepat.');
  };

  const handleSaveGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeGradingModal) return;

    gradeAssignment(
      activeGradingModal.assignment.id,
      activeGradingModal.submission.id,
      Number(gradingScore),
      gradingFeedback
    );

    setActiveGradingModal(null);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            Manajemen Tugas & Penilaian Deadline
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Terbitkan tugas kuliah, tetapkan batas waktu penyerahan, dan lakukan koreksi berkas siswa
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Tugas Baru</span>
        </button>
      </div>

      {/* Filter Row */}
      <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider pl-1">
            Filter Mata Pelajaran:
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
          Total {filteredAssignments.length} Tugas Dikelola
        </div>
      </div>

      {/* Assignments and Submissions Accordion / Cards */}
      <div className="space-y-6">
        {filteredAssignments.map((assignment) => {
          const course = courses.find((c) => c.id === assignment.courseId);
          const submittedCount = assignment.submissions.length;
          const gradedCount = assignment.submissions.filter((s) => s.status === 'graded').length;

          return (
            <div
              key={assignment.id}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs space-y-4 p-6"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-mono font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                    {course?.code}
                  </span>
                  <span className="text-slate-500">{assignment.chapter}</span>
                  <span className="text-slate-300">·</span>
                  <span className="text-slate-600 font-semibold">Bobot {assignment.weightPercentage}%</span>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1 font-mono">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    Deadline: {new Date(assignment.deadline).toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 mb-1">
                  {assignment.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {assignment.instructions}
                </p>
              </div>

              {/* Submissions List Section */}
              <div className="pt-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  <span>Kiriman Jawaban Siswa ({submittedCount} Terkumpul · {gradedCount} Selesai Dinilai)</span>
                </div>

                {assignment.submissions.length === 0 ? (
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-center text-xs text-slate-400">
                    Belum ada siswa yang mengumpulkan tugas ini.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {assignment.submissions.map((sub) => {
                      return (
                        <div
                          key={sub.id}
                          className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900">{sub.studentName}</span>
                              <span className="text-[11px] text-slate-400 font-mono">NIS: {sub.studentNis}</span>
                              <span className="text-[11px] text-slate-400">· Dikirim {new Date(sub.submittedAt).toLocaleString('id-ID')}</span>
                            </div>
                            {sub.fileName && (
                              <div className="text-indigo-600 font-medium flex items-center gap-2">
                                <FileText className="w-3.5 h-3.5 shrink-0" />
                                <span>{sub.fileName} ({sub.fileSize})</span>
                                {sub.fileUrl && (
                                  <a
                                    href={sub.fileUrl}
                                    download={sub.fileName}
                                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 hover:bg-emerald-100 transition-colors"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <Download className="w-3 h-3" />
                                    <span>Unduh File Asli</span>
                                  </a>
                                )}
                              </div>
                            )}
                            {sub.essayAnswer && (
                              <div className="text-slate-600 text-[11px] line-clamp-1 italic">
                                "{sub.essayAnswer}"
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            {sub.status === 'graded' ? (
                              <div className="text-right">
                                <div className="text-[11px] text-slate-500">Nilai Diberikan:</div>
                                <div className="font-bold font-mono text-emerald-700 text-sm">
                                  {sub.score} / {assignment.maxScore}
                                </div>
                              </div>
                            ) : (
                              <span className="inline-block px-2.5 py-1 text-[11px] font-semibold rounded bg-amber-50 text-amber-800 border border-amber-200">
                                Butuh Koreksi
                              </span>
                            )}

                            <button
                              onClick={() => openGradingModal(assignment, sub)}
                              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors"
                            >
                              {sub.status === 'graded' ? 'Ubah Nilai' : 'Beri Nilai & Ulasan'}
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

      {/* Grading Modal */}
      {activeGradingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                  Evaluasi Tugas Mahasiswa
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  {activeGradingModal.submission.studentName}
                </h3>
              </div>
              <button
                onClick={() => setActiveGradingModal(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 text-xs space-y-1.5 text-slate-700">
              <div><strong>Tugas:</strong> {activeGradingModal.assignment.title}</div>
              <div>
                <strong>Berkas Siswa:</strong> {activeGradingModal.submission.fileName || 'Jawaban Teks Langsung'}
                {activeGradingModal.submission.fileSize ? ` (${activeGradingModal.submission.fileSize})` : ''}
              </div>
              {activeGradingModal.submission.fileUrl && (
                <div className="pt-1">
                  <a
                    href={activeGradingModal.submission.fileUrl}
                    download={activeGradingModal.submission.fileName || 'Berkas_Tugas_Siswa'}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Unduh & Buka Berkas Asli Siswa</span>
                  </a>
                </div>
              )}
              {activeGradingModal.submission.essayAnswer && (
                <div className="p-2 bg-white rounded border border-slate-200 mt-1 max-h-32 overflow-y-auto">
                  <span className="font-bold block text-slate-500 mb-0.5">Naskah Jawaban:</span>
                  {activeGradingModal.submission.essayAnswer}
                </div>
              )}
            </div>

            <form onSubmit={handleSaveGrade} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Skor Nilai Siswa (Skala 0 - {activeGradingModal.assignment.maxScore})
                </label>
                <input
                  required
                  type="number"
                  min={0}
                  max={activeGradingModal.assignment.maxScore}
                  value={gradingScore}
                  onChange={(e) => setGradingScore(Number(e.target.value))}
                  className="w-full text-base font-bold font-mono p-2.5 rounded-lg border border-slate-300 focus:border-indigo-500 text-indigo-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Umpan Balik / Catatan Konstruktif Pengajar
                </label>
                <textarea
                  rows={3}
                  value={gradingFeedback}
                  onChange={(e) => setGradingFeedback(e.target.value)}
                  placeholder="Berikan masukan perbaikan mengenai struktur solusi..."
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setActiveGradingModal(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
                >
                  Simpan Nilai ke Gradebook
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Assignment Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Buat Tugas Kuliah Baru
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAssignment} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
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
                    Unit / Bab
                  </label>
                  <input
                    type="text"
                    value={newChapter}
                    onChange={(e) => setNewChapter(e.target.value)}
                    placeholder="Contoh: Bab 2: Arsitektur Cloud"
                    className="w-full p-2.5 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase mb-1">
                  Judul Tugas
                </label>
                <input
                  required
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Contoh: Proyek Desain Basis Data & Normalisasi 3NF"
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-sm font-semibold"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 uppercase mb-1">
                    Tenggat (Deadline)
                  </label>
                  <input
                    type="datetime-local"
                    value={newDeadline}
                    onChange={(e) => setNewDeadline(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 uppercase mb-1">
                    Bobot Nilai (%)
                  </label>
                  <input
                    type="number"
                    value={newWeight}
                    onChange={(e) => setNewWeight(Number(e.target.value))}
                    className="w-full p-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 uppercase mb-1">
                    Skor Maksimum
                  </label>
                  <input
                    type="number"
                    value={newMaxScore}
                    onChange={(e) => setNewMaxScore(Number(e.target.value))}
                    className="w-full p-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase mb-1">
                  Instruksi & Rubrik Penilaian
                </label>
                <textarea
                  required
                  rows={4}
                  value={newInstructions}
                  onChange={(e) => setNewInstructions(e.target.value)}
                  placeholder="Rincian ketentuan pengerjaan tugas, batasan format file, dan standar kriteria penilaian..."
                  className="w-full p-2.5 rounded-lg border border-slate-300"
                />
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
                  Terbitkan Tugas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
