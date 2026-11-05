import React, { useState } from 'react';
import {
  FileText,
  Download,
  BookOpen,
  CheckCircle2,
  Search,
  Check,
  Video,
  Presentation,
  Play,
  FileCode,
  Sparkles,
} from 'lucide-react';
import { useLms } from '../../context/LmsContext';
import { ModuleItem } from '../../types';
import { ModuleReaderModal } from '../common/ModuleReaderModal';

export const StudentModules: React.FC = () => {
  const {
    modules,
    courses,
    markModuleAsRead,
    downloadModule,
    currentUser,
    selectedCourseId,
    setSelectedCourseId,
  } = useLms();

  const [activeTabFilter, setActiveTabFilter] = useState<'all' | 'unread' | 'read' | 'video' | 'ppt'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeReadingModule, setActiveReadingModule] = useState<ModuleItem | null>(null);

  const filteredModules = modules.filter((m) => {
    // Course filter
    if (selectedCourseId !== 'all' && m.courseId !== selectedCourseId) {
      return false;
    }
    // Read status filter & format filter
    const isRead = m.readByStudentIds.includes(currentUser.id);
    if (activeTabFilter === 'read' && !isRead) return false;
    if (activeTabFilter === 'unread' && isRead) return false;
    if (activeTabFilter === 'video' && m.contentType !== 'video' && !m.videoUrl) return false;
    if (activeTabFilter === 'ppt' && m.contentType !== 'ppt' && m.contentType !== 'slide') return false;

    // Search query
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

  const getFormatIcon = (type: ModuleItem['contentType']) => {
    switch (type) {
      case 'video':
        return <Video className="w-3.5 h-3.5 text-amber-500" />;
      case 'ppt':
      case 'slide':
        return <Presentation className="w-3.5 h-3.5 text-orange-500" />;
      default:
        return <FileText className="w-3.5 h-3.5 text-indigo-500" />;
    }
  };

  const getFormatLabel = (type: ModuleItem['contentType']) => {
    switch (type) {
      case 'video':
        return 'Video Pembelajaran';
      case 'ppt':
        return 'Slide Presentasi (PPTX)';
      case 'slide':
        return 'Slide Kuliah';
      case 'pdf':
        return 'Modul PDF';
      case 'document':
        return 'Dokumen Teks';
      default:
        return 'Materi Ajar';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            Modul & Materi Pembelajaran
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Akses materi ajar berfoto, tonton video kuliah interaktif, unduh slide presentasi PPT, dan lacak kemajuan baca Anda
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari materi / video / PPT..."
            className="w-full text-xs sm:text-sm pl-9 pr-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Filter Row: Course Dropdown + Status Filter */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-3 bg-white rounded-xl border border-slate-200">
        <div className="flex items-center gap-2 overflow-x-auto max-w-full">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider pl-1">
            Mata Pelajaran:
          </span>
          <select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
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

        {/* Segmented Control */}
        <div className="flex items-center p-1 bg-slate-100 rounded-lg overflow-x-auto">
          <button
            onClick={() => setActiveTabFilter('all')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              activeTabFilter === 'all'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Semua ({modules.length})
          </button>
          <button
            onClick={() => setActiveTabFilter('video')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap flex items-center gap-1 ${
              activeTabFilter === 'video'
                ? 'bg-white text-amber-700 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Video className="w-3 h-3 text-amber-500" />
            <span>Video Kuliah</span>
          </button>
          <button
            onClick={() => setActiveTabFilter('ppt')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap flex items-center gap-1 ${
              activeTabFilter === 'ppt'
                ? 'bg-white text-orange-700 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Presentation className="w-3 h-3 text-orange-500" />
            <span>Slide PPT</span>
          </button>
          <button
            onClick={() => setActiveTabFilter('unread')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              activeTabFilter === 'unread'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Belum Dibaca
          </button>
          <button
            onClick={() => setActiveTabFilter('read')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              activeTabFilter === 'read'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sudah Selesai
          </button>
        </div>
      </div>

      {/* Modules Grid with Rich Photos */}
      {filteredModules.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border border-slate-200 space-y-3">
          <FileText className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-semibold text-slate-800">
            Tidak ada modul materi ditemukan
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Coba sesuaikan kata kunci pencarian atau ubah filter kategori materi di atas.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModules.map((module) => {
            const course = courses.find((c) => c.id === module.courseId);
            const isRead = module.readByStudentIds.includes(currentUser.id);
            const hasVideo = Boolean(module.videoUrl || module.contentType === 'video');

            return (
              <div
                key={module.id}
                className={`rounded-2xl bg-white border transition-all duration-200 flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md ${
                  isRead
                    ? 'border-slate-200'
                    : 'border-indigo-200 hover:border-indigo-400 ring-1 ring-indigo-50'
                }`}
              >
                <div>
                  {/* Photo Thumbnail Header */}
                  <div className="relative h-44 w-full bg-slate-900 overflow-hidden group cursor-pointer" onClick={() => setActiveReadingModule(module)}>
                    {module.coverImage ? (
                      <img
                        src={module.coverImage}
                        alt={module.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-indigo-900 to-slate-900 flex items-center justify-center">
                        <BookOpen className="w-12 h-12 text-indigo-300/40" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-slate-950/75 backdrop-blur-md text-white border border-white/10 shadow-xs flex items-center gap-1.5">
                        {getFormatIcon(module.contentType)}
                        <span>{getFormatLabel(module.contentType)}</span>
                      </span>

                      {isRead ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-600/90 backdrop-blur-md text-white shadow-xs">
                          <Check className="w-3.5 h-3.5" />
                          Selesai
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-500/90 backdrop-blur-md text-slate-950 shadow-xs">
                          Belum Dibaca
                        </span>
                      )}
                    </div>

                    {/* Play Video Overlay Button if Video */}
                    {hasVideo && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-indigo-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <Play className="w-6 h-6 ml-0.5 fill-white" />
                        </div>
                      </div>
                    )}

                    {/* Bottom Course Code on Image */}
                    <div className="absolute bottom-2.5 left-3">
                      <span className="text-xs font-semibold text-white drop-shadow-sm font-mono bg-indigo-600/80 px-2 py-0.5 rounded">
                        {course?.code}
                      </span>
                    </div>
                  </div>

                  {/* Card Content Body */}
                  <div className="p-4 space-y-2">
                    <div className="text-xs font-semibold text-indigo-600">
                      {module.chapter}
                    </div>

                    <h3 className="text-base font-bold text-slate-900 leading-snug line-clamp-2 hover:text-indigo-600 transition-colors cursor-pointer" onClick={() => setActiveReadingModule(module)}>
                      {module.title}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {module.description}
                    </p>

                    <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100">
                      <span>Ukuran: {module.fileSize}</span>
                      <span>Diunduh: {module.downloadCount} kali</span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="p-4 pt-2 border-t border-slate-100 flex items-center justify-between gap-2 bg-slate-50/50">
                  <button
                    onClick={() => downloadModule(module.id)}
                    className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded-lg transition-colors text-xs font-semibold inline-flex items-center gap-1.5"
                    title="Unduh Berkas Materi"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Unduh</span>
                  </button>

                  <div className="flex items-center gap-2">
                    {hasVideo ? (
                      <button
                        onClick={() => setActiveReadingModule(module)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-xs transition-colors"
                      >
                        <Play className="w-3.5 h-3.5 fill-white" />
                        <span>Tonton Video</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => setActiveReadingModule(module)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Baca Materi</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Reader Modal */}
      <ModuleReaderModal
        module={activeReadingModule}
        onClose={() => setActiveReadingModule(null)}
      />
    </div>
  );
};
