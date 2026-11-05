import React, { useState } from 'react';
import {
  MessageSquare,
  Pin,
  CheckCircle2,
  Trash2,
  Sparkles,
  Search,
  Filter,
  Send,
  ShieldAlert,
  Award,
  ThumbsUp,
} from 'lucide-react';
import { useLms } from '../../context/LmsContext';
import { DiscussionThread } from '../../types';

export const TeacherForumModerator: React.FC = () => {
  const {
    discussions,
    courses,
    currentUser,
    togglePinThread,
    markBestAnswer,
    deleteReply,
    postDiscussionReply,
    showToast,
  } = useLms();

  const [selectedCourseFilter, setSelectedCourseFilter] = useState('all');
  const [filterNeedsAnswer, setFilterNeedsAnswer] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedThreadId, setSelectedThreadId] = useState<string>(discussions[0]?.id || '');
  const [officialReplyText, setOfficialReplyText] = useState('');

  const filteredThreads = discussions.filter((t) => {
    if (selectedCourseFilter !== 'all' && t.courseId !== selectedCourseFilter) return false;
    if (filterNeedsAnswer && t.isResolved) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return t.title.toLowerCase().includes(q) || t.content.toLowerCase().includes(q);
    }
    return true;
  });

  const activeThread = discussions.find((d) => d.id === selectedThreadId) || discussions[0];

  const handlePostOfficialAnswer = (threadId: string) => {
    if (!officialReplyText.trim()) return;
    postDiscussionReply(threadId, officialReplyText);
    setOfficialReplyText('');
    showToast('Tanggapan Terkirim', 'Ulasan resmi pengajar telah diposting ke forum.');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            Panel Moderasi & Bimbingan Forum Diskusi
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Validasi solusi terbaik, sematkan pengumuman krusial, dan moderasi konten komunikasi kelas
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterNeedsAnswer((prev) => !prev)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
              filterNeedsAnswer
                ? 'bg-amber-500 text-white border-amber-600 shadow-2xs'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            {filterNeedsAnswer ? '● Menampilkan: Butuh Respons' : 'Filter: Butuh Respons Guru'}
          </button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-3 bg-white rounded-xl border border-slate-200">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider pl-1">
            Matkul:
          </span>
          <select
            value={selectedCourseFilter}
            onChange={(e) => setSelectedCourseFilter(e.target.value)}
            className="text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 focus:border-indigo-500"
          >
            <option value="all">Semua Mata Pelajaran</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.code} - {c.title}
              </option>
            ))}
          </select>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari topik diskusi..."
            className="w-full text-xs pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Main Workspace Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Threads List (5 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          {filteredThreads.map((thread) => {
            const course = courses.find((c) => c.id === thread.courseId);
            const isSelected = activeThread?.id === thread.id;

            return (
              <div
                key={thread.id}
                onClick={() => setSelectedThreadId(thread.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-amber-50/40 border-amber-400 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                  <span className="font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded font-mono">
                    {course?.code}
                  </span>

                  <div className="flex items-center gap-2">
                    {thread.isPinned && (
                      <span className="text-amber-700 font-bold flex items-center gap-0.5 text-[11px]">
                        <Pin className="w-3 h-3 fill-amber-500" />
                        Disematkan
                      </span>
                    )}
                    {thread.isResolved ? (
                      <span className="text-emerald-700 font-bold flex items-center gap-0.5 text-[11px]">
                        <CheckCircle2 className="w-3 h-3" />
                        Terpecahkan
                      </span>
                    ) : (
                      <span className="text-amber-600 font-bold text-[11px]">
                        Butuh Respons
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="text-sm font-bold text-slate-900 line-clamp-1 mb-1">
                  {thread.title}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-2 mb-2 leading-relaxed">
                  {thread.content}
                </p>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-100">
                  <span>Oleh: {thread.authorName}</span>
                  <span>{thread.replies.length} Tanggapan</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Moderator Workbench (7 Cols) */}
        <div className="lg:col-span-7">
          {activeThread ? (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs p-6 space-y-6">
              {/* Thread Header Controls */}
              <div className="border-b border-slate-100 pb-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-semibold text-indigo-600">
                    ID Thread: {activeThread.id}
                  </span>

                  {/* Moderator Controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => togglePinThread(activeThread.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md border transition-colors ${
                        activeThread.isPinned
                          ? 'bg-amber-100 text-amber-900 border-amber-300'
                          : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      <Pin className="w-3.5 h-3.5" />
                      <span>{activeThread.isPinned ? 'Lepas Sematan' : 'Sematkan di Atas'}</span>
                    </button>
                  </div>
                </div>

                <h2 className="text-lg font-bold text-slate-900 leading-snug">
                  {activeThread.title}
                </h2>

                <div className="flex items-center gap-2.5 text-xs text-slate-600">
                  <img
                    src={activeThread.authorAvatar}
                    alt={activeThread.authorName}
                    className="w-7 h-7 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <span className="font-bold text-slate-900">{activeThread.authorName}</span> ({activeThread.authorRole}) · {new Date(activeThread.createdAt).toLocaleString('id-ID')}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pt-2">
                  {activeThread.content}
                </p>
              </div>

              {/* Moderated Replies List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Daftar Tanggapan ({activeThread.replies.length})
                  </h4>
                  <span className="text-[11px] text-slate-400">
                    Klik 'Tandai Solusi' untuk memvalidasi jawaban terbaik
                  </span>
                </div>

                {activeThread.replies.map((reply) => {
                  return (
                    <div
                      key={reply.id}
                      className={`p-4 rounded-xl border space-y-2.5 ${
                        reply.isBestAnswer
                          ? 'bg-emerald-50/70 border-emerald-300 shadow-2xs'
                          : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img
                            src={reply.authorAvatar}
                            alt={reply.authorName}
                            className="w-6 h-6 rounded-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <span className="text-xs font-bold text-slate-900">{reply.authorName}</span>
                          {reply.authorRole === 'guru' && (
                            <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded">
                              Pengajar
                            </span>
                          )}
                        </div>

                        {/* Reply Action Buttons */}
                        <div className="flex items-center gap-2">
                          {!reply.isBestAnswer ? (
                            <button
                              onClick={() => markBestAnswer(activeThread.id, reply.id)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 rounded-md transition-colors"
                            >
                              <Award className="w-3.5 h-3.5" />
                              <span>Tandai Solusi</span>
                            </button>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-200">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Solusi Terverifikasi
                            </span>
                          )}

                          <button
                            onClick={() => deleteReply(activeThread.id, reply.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded"
                            title="Hapus Tanggapan Ini"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                        {reply.content}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Teacher Official Answer Form */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Kirim Penjelasan / Solusi Resmi Pengajar</span>
                </div>
                <textarea
                  rows={3}
                  value={officialReplyText}
                  onChange={(e) => setOfficialReplyText(e.target.value)}
                  placeholder="Ketikkan klarifikasi akademik atau petunjuk bimbingan Anda kepada siswa..."
                  className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none leading-relaxed text-slate-800"
                />
                <div className="flex justify-end">
                  <button
                    onClick={() => handlePostOfficialAnswer(activeThread.id)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-2xs transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Terbitkan Ulasan Pengajar</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center bg-white rounded-xl border border-slate-200 text-slate-400 text-xs">
              Pilih thread diskusi untuk melakukan moderasi.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
