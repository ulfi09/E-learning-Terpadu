import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Trash2,
  Eye,
  Download,
  Users,
  Search,
  CheckCircle2,
  XCircle,
  X,
  Upload,
  Video,
  Presentation,
  Play,
  Image as ImageIcon,
  Check,
  FileCheck,
} from 'lucide-react';
import { useLms } from '../../context/LmsContext';
import { ModuleItem } from '../../types';
import { ModuleReaderModal } from '../common/ModuleReaderModal';

export const TeacherMaterialManager: React.FC = () => {
  const { modules, courses, createModule, deleteModule, downloadModule, students } = useLms();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [auditModule, setAuditModule] = useState<ModuleItem | null>(null);
  const [previewModule, setPreviewModule] = useState<ModuleItem | null>(null);

  // Form states for new module
  const [formCourseId, setFormCourseId] = useState(courses[0]?.id || 'course_web_01');
  const [formTitle, setFormTitle] = useState('');
  const [formChapter, setFormChapter] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formContentType, setFormContentType] = useState<ModuleItem['contentType']>('pdf');
  const [formFileSize, setFormFileSize] = useState('4.2 MB');
  const [formContentText, setFormContentText] = useState('');
  const [formVideoUrl, setFormVideoUrl] = useState('');
  const [formCoverImage, setFormCoverImage] = useState(
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80'
  );
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [uploadedFileUrl, setUploadedFileUrl] = useState('');

  const coverPresets = [
    { label: 'Pemrograman / IT', url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80' },
    { label: 'Cloud & Jaringan', url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80' },
    { label: 'Video Kuliah', url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80' },
    { label: 'Slide PPT', url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80' },
    { label: 'Matematika', url: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80' },
    { label: 'Fisika & Gelombang', url: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=800&q=80' },
    { label: 'Bioteknologi', url: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=800&q=80' },
  ];

  // Handle local file upload (PPT, PDF, Video, Docx)
  const handleMaterialFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      setFormFileSize(`${sizeMb} MB`);

      // Detect content type
      const lower = file.name.toLowerCase();
      if (lower.endsWith('.ppt') || lower.endsWith('.pptx')) {
        setFormContentType('ppt');
        setFormCoverImage('https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80');
      } else if (lower.endsWith('.mp4') || lower.endsWith('.webm') || lower.endsWith('.mkv')) {
        setFormContentType('video');
        setFormCoverImage('https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80');
        // create object URL for local video playback
        const localVideoUrl = URL.createObjectURL(file);
        setFormVideoUrl(localVideoUrl);
        setUploadedFileUrl(localVideoUrl);
      } else if (lower.endsWith('.pdf')) {
        setFormContentType('pdf');
      }

      if (!formTitle.trim()) {
        const titleFromFileName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        setFormTitle(titleFromFileName);
      }
    }
  };

  // Handle custom image upload for cover
  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setFormCoverImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredModules = modules.filter((m) => {
    if (selectedCourseFilter !== 'all' && m.courseId !== selectedCourseFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        m.title.toLowerCase().includes(q) ||
        m.chapter.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formChapter.trim()) return;

    createModule({
      courseId: formCourseId,
      title: formTitle,
      chapter: formChapter,
      description: formDescription,
      contentType: formContentType,
      coverImage: formCoverImage,
      videoUrl: formVideoUrl || undefined,
      attachmentFileName: uploadedFileName || (formContentType === 'ppt' ? `${formTitle.replace(/\s+/g, '_')}.pptx` : undefined),
      attachmentFileSize: formFileSize,
      attachmentFileUrl: uploadedFileUrl || undefined,
      fileSize: formFileSize,
      textContent: formContentText || `# ${formTitle}\n\n## 1. Pendahuluan Silabus\n${formDescription}\n\n## 2. Pokok Bahasan Utama\nMateri pembelajaran komprehensif disajikan secara interaktif untuk mendukung proses belajar mengajar.`,
      downloadUrl: `/downloads/${formTitle.toLowerCase().replace(/\s+/g, '_')}.pdf`,
    });

    // Reset & close
    setShowAddModal(false);
    setFormTitle('');
    setFormChapter('');
    setFormDescription('');
    setFormContentText('');
    setFormVideoUrl('');
    setUploadedFileName('');
    setUploadedFileUrl('');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            Kelola & Publikasi Materi Pembelajaran
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Unggah modul bahan ajar berfoto, lampirkan berkas presentasi PPT, sertakan video kuliah, dan pantau daftar siswa yang telah membaca
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Materi / PPT / Video</span>
        </button>
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-3 bg-white rounded-xl border border-slate-200">
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

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari materi / PPT / video..."
            className="w-full text-xs sm:text-sm pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Module List Table with Thumbnail Photos */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-600 font-semibold">
                <th className="py-3 px-4">Foto & Materi</th>
                <th className="py-3 px-4">Mata Pelajaran</th>
                <th className="py-3 px-4 text-center">Tipe / Ukuran</th>
                <th className="py-3 px-4 text-center">Video / Lampiran</th>
                <th className="py-3 px-4 text-center">Pelacakan Baca Siswa</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredModules.map((mod) => {
                const course = courses.find((c) => c.id === mod.courseId);
                const readCount = mod.readByStudentIds.length;
                const totalStudents = students.length;
                const readPercentage = totalStudents > 0 ? Math.round((readCount / totalStudents) * 100) : 0;
                const hasVideo = Boolean(mod.videoUrl || mod.contentType === 'video');

                return (
                  <tr key={mod.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-16 h-12 rounded-lg bg-slate-900 overflow-hidden shrink-0 relative cursor-pointer group"
                          onClick={() => setPreviewModule(mod)}
                        >
                          {mod.coverImage ? (
                            <img
                              src={mod.coverImage}
                              alt={mod.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-indigo-900/30 text-indigo-400">
                              <FileText className="w-5 h-5" />
                            </div>
                          )}
                          {hasVideo && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                              <Play className="w-4 h-4 text-white fill-white" />
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 max-w-md">
                          <div
                            className="font-bold text-slate-900 hover:text-indigo-600 cursor-pointer truncate"
                            onClick={() => setPreviewModule(mod)}
                          >
                            {mod.title}
                          </div>
                          <div className="text-xs text-slate-500">{mod.chapter}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded font-mono text-xs">
                        {course?.code}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className="uppercase text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded">
                        {mod.contentType === 'ppt' ? 'Slide PPT' : mod.contentType} ({mod.fileSize})
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5 flex-wrap">
                        {hasVideo ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            <Video className="w-3 h-3" />
                            Video
                          </span>
                        ) : null}
                        {mod.attachmentFileName || mod.contentType === 'ppt' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-orange-50 text-orange-700 border border-orange-200">
                            <Presentation className="w-3 h-3" />
                            PPT / Berkas
                          </span>
                        ) : null}
                        {!hasVideo && !mod.attachmentFileName && mod.contentType !== 'ppt' && (
                          <span className="text-slate-400 text-xs">-</span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => setAuditModule(mod)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                      >
                        <Users className="w-3.5 h-3.5" />
                        <span>{readCount} / {totalStudents} Siswa ({readPercentage}%)</span>
                      </button>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setPreviewModule(mod)}
                          className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-md transition-colors"
                          title="Pratinjau Materi / Tonton Video"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => downloadModule(mod.id)}
                          className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
                          title="Unduh Berkas PDF Modul"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteModule(mod.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                          title="Hapus Modul"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Read Audit Modal */}
      {auditModule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                  Audit Pelacakan Baca Siswa
                </span>
                <h3 className="text-base font-bold text-slate-900 truncate max-w-sm">
                  {auditModule.title}
                </h3>
              </div>
              <button onClick={() => setAuditModule(null)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="text-xs text-slate-500">
                Daftar siswa di kelas beserta konfirmasi pembacaan materi:
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {students.map((student) => {
                  const hasRead = auditModule.readByStudentIds.includes(student.id);

                  return (
                    <div
                      key={student.id}
                      className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 bg-slate-50 text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <img
                          src={student.avatar}
                          alt={student.name}
                          className="w-7 h-7 rounded-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <div className="font-bold text-slate-800">{student.name}</div>
                          <div className="text-[11px] text-slate-400 font-mono">NIS: {student.nis}</div>
                        </div>
                      </div>

                      {hasRead ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-xs">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Selesai Membaca
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-slate-400 text-xs">
                          <XCircle className="w-3.5 h-3.5" />
                          Belum Akses
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t">
              <button
                onClick={() => setAuditModule(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
              >
                Tutup Audit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Module Modal: Supports File Upload (PPT, Video, PDF), Cover Images, Video Links */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-3xl max-h-[92vh] bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Publikasikan Materi Pembelajaran, PPT, atau Video
                </h3>
                <p className="text-xs text-slate-500">
                  Lengkapi informasi modul, pilih foto sampul, dan unggah berkas slide PowerPoint atau tautan video kuliah
                </p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="flex-1 overflow-y-auto space-y-4 py-4 pr-1">
              {/* File Upload Dropzone */}
              <div className="p-4 rounded-xl border-2 border-dashed border-indigo-200 bg-indigo-50/40 hover:bg-indigo-50/70 transition-colors">
                <label className="flex flex-col items-center justify-center cursor-pointer text-center space-y-2">
                  <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-xs sm:text-sm text-indigo-900">
                      Klik untuk Upload Berkas PPT, PDF, Video MP4, atau Dokumen
                    </span>
                    <p className="text-[11px] text-slate-500">
                      Mendukung .ppt, .pptx, .pdf, .mp4, .docx, .zip (Nama & ukuran terdeteksi otomatis)
                    </p>
                  </div>
                  <input
                    type="file"
                    accept=".ppt,.pptx,.pdf,.doc,.docx,.mp4,.webm,.zip"
                    onChange={handleMaterialFileUpload}
                    className="hidden"
                  />
                </label>

                {uploadedFileName && (
                  <div className="mt-3 p-2.5 rounded-lg bg-white border border-indigo-200 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-indigo-950 font-bold">
                      <FileCheck className="w-4 h-4 text-emerald-600" />
                      <span>Berkas Terlampir: {uploadedFileName}</span>
                    </div>
                    <span className="text-slate-500 font-mono font-semibold">{formFileSize}</span>
                  </div>
                )}
              </div>

              {/* Course & Chapter */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Mata Pelajaran
                  </label>
                  <select
                    value={formCourseId}
                    onChange={(e) => setFormCourseId(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white"
                  >
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.code} - {c.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Unit / Bab Silabus
                  </label>
                  <input
                    required
                    type="text"
                    value={formChapter}
                    onChange={(e) => setFormChapter(e.target.value)}
                    placeholder="Contoh: Bab 4: Arsitektur Cloud & State"
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Judul Modul Materi
                </label>
                <input
                  required
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Contoh: Slide & Video Praktikum REST API & Keamanan Token"
                  className="w-full text-xs sm:text-sm p-2.5 rounded-lg border border-slate-300 focus:border-indigo-500"
                />
              </div>

              {/* Format & File Size */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Format Konten
                  </label>
                  <select
                    value={formContentType}
                    onChange={(e) => setFormContentType(e.target.value as any)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="pdf">📄 PDF E-Book</option>
                    <option value="ppt">📊 Slide Presentasi (PowerPoint PPT/PPTX)</option>
                    <option value="video">🎥 Video Kuliah Interaktif</option>
                    <option value="document">📝 Dokumen Teks</option>
                    <option value="interactive">⚡ Simulasi Interaktif</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Ukuran File Berkas
                  </label>
                  <input
                    type="text"
                    value={formFileSize}
                    onChange={(e) => setFormFileSize(e.target.value)}
                    placeholder="4.2 MB"
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              {/* Video URL (if video or desired) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1 flex items-center justify-between">
                  <span>Tautan Video Pembelajaran (YouTube / MP4 URL)</span>
                  <span className="text-[11px] text-amber-600 font-normal">Siswa dapat langsung menonton video ini</span>
                </label>
                <div className="relative">
                  <Video className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    value={formVideoUrl}
                    onChange={(e) => setFormVideoUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=... atau direct .mp4 URL"
                    className="w-full text-xs p-2.5 pl-9 rounded-lg border border-slate-300 focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Cover Photo Chooser (Preset & Custom) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1 flex items-center justify-between">
                  <span>Foto Sampul Materi (Agar Menarik & Tidak Polos)</span>
                  <label className="text-[11px] text-indigo-600 font-semibold cursor-pointer hover:underline flex items-center gap-1">
                    <Upload className="w-3 h-3" />
                    <span>Unggah Foto dari Komputer</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverUpload}
                      className="hidden"
                    />
                  </label>
                </label>

                {/* Selected Cover Preview */}
                <div className="flex items-center gap-3 mb-2 p-2 rounded-xl bg-slate-50 border border-slate-200">
                  <img
                    src={formCoverImage}
                    alt="Cover preview"
                    className="w-24 h-16 rounded-lg object-cover shadow-xs shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-bold text-slate-800 block">Foto Sampul Terpilih</span>
                    <input
                      type="text"
                      value={formCoverImage}
                      onChange={(e) => setFormCoverImage(e.target.value)}
                      placeholder="URL Gambar..."
                      className="w-full text-[11px] p-1.5 border border-slate-300 rounded bg-white mt-1"
                    />
                  </div>
                </div>

                {/* Presets */}
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                  {coverPresets.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setFormCoverImage(preset.url)}
                      className={`relative rounded-lg overflow-hidden border-2 aspect-video transition-all ${
                        formCoverImage === preset.url
                          ? 'border-indigo-600 ring-2 ring-indigo-300 scale-102'
                          : 'border-slate-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                      <span className="absolute bottom-0 inset-x-0 bg-black/60 text-[9px] text-white text-center py-0.5 truncate px-1">
                        {preset.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Ringkasan / Abstrak Materi
                </label>
                <textarea
                  required
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Gambaran umum kompetensi yang akan dicapai siswa pada materi ini..."
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                />
              </div>

              {/* Text content markdown */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Konten Naskah Interaktif (Markdown didukung)
                </label>
                <textarea
                  rows={4}
                  value={formContentText}
                  onChange={(e) => setFormContentText(e.target.value)}
                  placeholder="# Judul Bab&#10;&#10;## 1. Konsep Dasar&#10;Tuliskan isi materi perkuliahan secara rinci di sini..."
                  className="w-full text-xs font-mono p-3 rounded-lg border border-slate-300"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
                >
                  Publikasikan Sekarang
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reader Modal Preview */}
      <ModuleReaderModal
        module={previewModule}
        onClose={() => setPreviewModule(null)}
      />
    </div>
  );
};
