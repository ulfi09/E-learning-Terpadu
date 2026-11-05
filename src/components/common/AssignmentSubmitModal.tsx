import React, { useState, useRef } from 'react';
import {
  X,
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  FolderOpen,
  Trash2,
  Paperclip,
  Check,
} from 'lucide-react';
import { Assignment } from '../../types';
import { useLms } from '../../context/LmsContext';

interface AssignmentSubmitModalProps {
  assignment: Assignment | null;
  onClose: () => void;
}

export const AssignmentSubmitModal: React.FC<AssignmentSubmitModalProps> = ({
  assignment,
  onClose,
}) => {
  const { submitAssignment, currentUser, showToast } = useLms();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Existing submission check
  const existingSub = assignment ? assignment.submissions.find((s) => s.studentId === currentUser.id) : null;

  const [essayAnswer, setEssayAnswer] = useState(existingSub?.essayAnswer || '');
  const [studentNotes, setStudentNotes] = useState(existingSub?.studentNotes || '');
  const [selectedFileName, setSelectedFileName] = useState<string>(existingSub?.fileName || '');
  const [selectedFileSize, setSelectedFileSize] = useState<string>(existingSub?.fileSize || '');
  const [selectedFileDataUrl, setSelectedFileDataUrl] = useState<string>(existingSub?.fileUrl || '');
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!assignment) return null;

  // Determine accepted file extensions
  const formatMapping: Record<string, string> = {
    PDF: '.pdf',
    ZIP: '.zip,.rar,.7z',
    DOCX: '.docx,.doc',
    DOC: '.doc,.docx',
    JSON: '.json',
    PPTX: '.pptx,.ppt',
    XLSX: '.xlsx,.xls',
    TXT: '.txt',
  };

  const acceptExtensions = assignment.allowedFormats
    .map((fmt) => formatMapping[fmt.toUpperCase()] || `.${fmt.toLowerCase()}`)
    .join(',');

  const formatFileSize = (bytes: number): string => {
    if (bytes >= 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    }
    return `${Math.round(bytes / 1024)} KB`;
  };

  const processRealFile = (file: File) => {
    // 25 MB max size check
    if (file.size > 25 * 1024 * 1024) {
      showToast('Ukuran File Terlalu Besar', 'Maksimal ukuran berkas yang diperbolehkan adalah 25 MB.', 'warning');
      return;
    }

    setSelectedFileName(file.name);
    setSelectedFileSize(formatFileSize(file.size));

    // Read real file data URL so it can be previewed/downloaded by student & teacher
    const reader = new FileReader();
    reader.onload = () => {
      setSelectedFileDataUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    showToast('File Berhasil Dipilih', `Berkas "${file.name}" dari HP/perangkat Anda siap dikumpulkan.`);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processRealFile(file);
    }
  };

  const handleTriggerPicker = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFileName('');
    setSelectedFileSize('');
    setSelectedFileDataUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processRealFile(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!essayAnswer.trim() && !selectedFileName) {
      showToast('Mohon Lengkapi Kiriman', 'Pilih berkas dari HP Anda atau ketikkan jawaban teks.', 'warning');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      submitAssignment(assignment.id, {
        fileName: selectedFileName || 'Jawaban_Teks_Siswa.txt',
        fileSize: selectedFileSize || '2 KB',
        fileUrl: selectedFileDataUrl,
        essayAnswer,
        studentNotes,
      });
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl max-h-[92vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200">
        {/* Hidden Native File Input: triggers device native file/gallery picker on HP & desktop */}
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptExtensions || '*'}
          onChange={handleFileInputChange}
          className="hidden"
          id="real-file-upload-input"
        />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div>
            <div className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-0.5">
              {assignment.chapter}
            </div>
            <h3 className="text-lg font-bold text-slate-900 truncate">
              {assignment.title}
            </h3>
            <div className="text-xs text-slate-500 mt-0.5">
              Tenggat Waktu: {new Date(assignment.deadline).toLocaleString('id-ID')} · Bobot Nilai: {assignment.weightPercentage}%
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 p-6 overflow-y-auto space-y-5">
          {/* Instructions Box */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700">
            <span className="font-semibold text-slate-900 block mb-1">Petunjuk Tugas:</span>
            {assignment.instructions}
          </div>

          {/* Previous Submission Status if exists */}
          {existingSub && (
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
              <div>
                <span className="font-semibold">Anda sebelumnya sudah mengumpulkan tugas ini:</span>{' '}
                {new Date(existingSub.submittedAt).toLocaleString('id-ID')}. Mengunggah file baru akan memperbarui kiriman Anda.
              </div>
            </div>
          )}

          {/* Real Device File Upload Area */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Unggah File Langsung Dari HP / Perangkat
              </label>
              <span className="text-[11px] text-slate-500">
                Format: {assignment.allowedFormats.join(', ')} (Maks. 25 MB)
              </span>
            </div>

            {!selectedFileName ? (
              <div
                onClick={handleTriggerPicker}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`group cursor-pointer border-2 border-dashed rounded-xl p-6 text-center transition-all ${
                  isDragging
                    ? 'border-indigo-600 bg-indigo-50/50'
                    : 'border-slate-300 hover:border-indigo-500 bg-slate-50/70 hover:bg-indigo-50/20'
                }`}
              >
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Smartphone className="w-6 h-6 text-indigo-600 group-hover:scale-110 transition-transform" />
                  <FolderOpen className="w-6 h-6 text-slate-500 group-hover:text-indigo-600 transition-colors" />
                </div>
                <div className="text-xs font-bold text-slate-800">
                  Pilih File Asli Dari HP Anda
                </div>
                <div className="text-[11px] text-slate-500 mt-1 max-w-sm mx-auto">
                  Ketuk untuk membuka pengelola file / dokumen / galeri di HP Anda, atau seret berkas ke sini
                </div>
                <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 group-hover:border-indigo-500 rounded-lg text-xs font-semibold text-slate-700 shadow-2xs">
                  <Paperclip className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Jelajahi File HP</span>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-indigo-50/80 border border-indigo-200 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 truncate">
                    <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 truncate">
                        {selectedFileName}
                      </div>
                      <div className="text-[11px] text-indigo-700 flex items-center gap-2">
                        <span>{selectedFileSize}</span>
                        <span aria-hidden="true">·</span>
                        <span className="flex items-center gap-1 font-semibold text-emerald-700">
                          <Check className="w-3 h-3" /> Berkas Asli Terpilih
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={handleTriggerPicker}
                      className="px-2.5 py-1 text-xs font-semibold text-indigo-700 bg-white border border-indigo-200 hover:bg-indigo-100 rounded-md transition-colors"
                    >
                      Ganti File
                    </button>
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                      title="Hapus berkas ini"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {selectedFileDataUrl && selectedFileName.match(/\.(png|jpe?g|webp|gif)$/i) && (
                  <div className="pt-2 border-t border-indigo-100">
                    <span className="text-[11px] font-semibold text-slate-500 block mb-1">
                      Pratinjau Gambar:
                    </span>
                    <img
                      src={selectedFileDataUrl}
                      alt="Pratinjau Tugas"
                      className="max-h-36 rounded-lg object-contain bg-white border border-indigo-100 p-1"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Essay Answer Textarea */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Jawaban Teks / Penjelasan Metodologi
            </label>
            <textarea
              required={!selectedFileName}
              rows={4}
              value={essayAnswer}
              onChange={(e) => setEssayAnswer(e.target.value)}
              placeholder="Tuliskan intisari jawaban, ringkasan pemecahan masalah, atau lampiran tautan repo Anda di sini..."
              className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-slate-800"
            />
          </div>

          {/* Student Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Catatan Tambahan untuk Pengajar (Opsional)
            </label>
            <input
              type="text"
              value={studentNotes}
              onChange={(e) => setStudentNotes(e.target.value)}
              placeholder="Contoh: Lampiran diagram terdapat pada halaman 3 laporan."
              className="w-full text-xs sm:text-sm p-2.5 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-slate-800"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 rounded-lg hover:bg-slate-100"
            >
              Batalkan
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitting ? 'Mengunggah...' : 'Kumpulkan Tugas Sekarang'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
