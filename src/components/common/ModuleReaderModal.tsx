import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Download,
  CheckCircle2,
  FileText,
  Video,
  Presentation,
  Play,
  FileCheck,
  Maximize2,
  Volume2,
  ExternalLink,
} from 'lucide-react';
import { ModuleItem } from '../../types';
import { useLms } from '../../context/LmsContext';

interface ModuleReaderModalProps {
  module: ModuleItem | null;
  onClose: () => void;
}

export const ModuleReaderModal: React.FC<ModuleReaderModalProps> = ({ module, onClose }) => {
  const { markModuleAsRead, downloadModule, role, currentUser } = useLms();
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  if (!module) return null;

  const isRead = module.readByStudentIds.includes(currentUser.id);

  // Helper to format YouTube embed URL cleanly
  const getEmbedVideoUrl = (url: string) => {
    if (!url) return '';
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`;
    }
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`;
    }
    if (url.includes('youtube.com/embed/')) {
      return url.includes('?') ? `${url}&autoplay=1` : `${url}?autoplay=1`;
    }
    return url;
  };

  const isYouTube = module.videoUrl && (module.videoUrl.includes('youtube') || module.videoUrl.includes('youtu.be'));
  const hasVideo = Boolean(module.videoUrl || module.contentType === 'video');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200">
        {/* Header with Photo Banner if coverImage exists */}
        {module.coverImage ? (
          <div className="relative h-48 sm:h-60 w-full overflow-hidden bg-slate-900 shrink-0">
            <img
              src={module.coverImage}
              alt={module.title}
              className="w-full h-full object-cover opacity-85"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

            {/* Close Button on Image */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors z-10"
              aria-label="Tutup jendela baca"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Badges on Image */}
            <div className="absolute bottom-4 left-6 right-6">
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-indigo-600 text-white shadow-xs">
                  {module.contentType === 'ppt' ? 'Slide Presentasi (PPT)' : module.contentType.toUpperCase()}
                </span>
                <span className="text-xs text-slate-300 font-medium font-mono">
                  {module.chapter}
                </span>
                {hasVideo && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-500 text-slate-950">
                    <Video className="w-3 h-3" />
                    Video Pembelajaran Tersedia
                  </span>
                )}
              </div>
              <h2 className="text-lg sm:text-2xl font-extrabold text-white leading-tight drop-shadow-sm">
                {module.title}
              </h2>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50 shrink-0">
            <div className="min-w-0 pr-4">
              <div className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-0.5">
                {module.chapter} · {module.contentType.toUpperCase()}
              </div>
              <h3 className="text-lg font-bold text-slate-900 truncate">
                {module.title}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-xl transition-colors shrink-0"
              aria-label="Tutup jendela baca"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Modal Body */}
        <div className="flex-1 p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-700 leading-relaxed font-sans text-sm sm:text-base">
          {/* VIDEO PLAYER SECTION (if video available) */}
          {hasVideo && (
            <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-xl">
              <div className="p-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs text-slate-300">
                <div className="flex items-center gap-2 font-bold text-white">
                  <Video className="w-4 h-4 text-amber-400" />
                  <span>Pemutar Video Pembelajaran Interaktif</span>
                </div>
                <span className="text-slate-400 text-[11px]">Kualitas HD 1080p</span>
              </div>

              <div className="relative aspect-video w-full bg-black">
                {module.videoUrl ? (
                  isYouTube ? (
                    <iframe
                      src={getEmbedVideoUrl(module.videoUrl)}
                      title={module.title}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video
                      controls
                      autoPlay={isVideoPlaying}
                      src={module.videoUrl}
                      className="w-full h-full object-contain"
                    >
                      Browser Anda tidak mendukung pemutar video HTML5.
                    </video>
                  )
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 p-6 text-center space-y-2">
                    <Video className="w-12 h-12 text-slate-600" />
                    <p className="text-sm">Video sedang disiapkan oleh pengajar.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ATTACHMENT CARD (PPT, PDF, Video, Zip) */}
          {(module.attachmentFileName || module.contentType === 'ppt') && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold shrink-0">
                  {module.contentType === 'ppt' ? (
                    <Presentation className="w-5 h-5" />
                  ) : (
                    <FileText className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-xs sm:text-sm">
                    {module.attachmentFileName || `${module.title.replace(/\s+/g, '_')}.pptx`}
                  </div>
                  <div className="text-xs text-slate-500">
                    Berkas Lampiran Materi Pembelajaran · {module.attachmentFileSize || module.fileSize}
                  </div>
                </div>
              </div>

              <button
                onClick={() => downloadModule(module.id)}
                className="inline-flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-2xs transition-colors shrink-0"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh Berkas {module.contentType === 'ppt' ? 'Slide PPT' : 'Materi'}</span>
              </button>
            </div>
          )}

          {/* Abstract / Description */}
          <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-100 text-indigo-900 text-xs sm:text-sm">
            <span className="font-bold block mb-1">Ikhtisar Pembelajaran:</span>
            {module.description}
          </div>

          {/* Render Text Content */}
          <div className="space-y-4 pt-2">
            {module.textContent.split('\n\n').map((paragraph, idx) => {
              if (paragraph.startsWith('# ')) {
                return (
                  <h1 key={idx} className="text-2xl font-bold text-slate-900 border-b border-slate-200 pb-2">
                    {paragraph.replace('# ', '')}
                  </h1>
                );
              }
              if (paragraph.startsWith('## ')) {
                return (
                  <h2 key={idx} className="text-xl font-bold text-slate-900 pt-2">
                    {paragraph.replace('## ', '')}
                  </h2>
                );
              }
              if (paragraph.startsWith('### ')) {
                return (
                  <h3 key={idx} className="text-lg font-semibold text-slate-900">
                    {paragraph.replace('### ', '')}
                  </h3>
                );
              }
              if (paragraph.startsWith('> ')) {
                return (
                  <blockquote key={idx} className="pl-4 py-2 my-2 bg-slate-50 border-l-2 border-indigo-500 text-slate-700 italic text-sm">
                    {paragraph.replace('> ', '')}
                  </blockquote>
                );
              }
              return (
                <p key={idx} className="text-slate-700">
                  {paragraph}
                </p>
              );
            })}
          </div>
        </div>

        {/* Action Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => downloadModule(module.id)}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Unduh Materi PDF</span>
            </button>
            <span className="text-xs text-slate-400 hidden sm:inline">
              Ukuran berkas {module.fileSize} · Diunduh {module.downloadCount} kali
            </span>
          </div>

          <div className="flex items-center gap-3">
            {role === 'siswa' && (
              <button
                onClick={() => markModuleAsRead(module.id)}
                className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors shadow-xs ${
                  isRead
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isRead ? 'Tandai Belum Dibaca' : 'Tandai Selesai Dibaca'}</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-200/60"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
