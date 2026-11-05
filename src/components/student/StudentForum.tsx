import React, { useState } from 'react';
import {
  MessageSquare,
  ThumbsUp,
  CheckCircle2,
  Pin,
  Send,
  Plus,
  Search,
  User,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useLms } from '../../context/LmsContext';
import { DiscussionThread } from '../../types';

export const StudentForum: React.FC = () => {
  const {
    discussions,
    courses,
    currentUser,
    createDiscussionThread,
    postDiscussionReply,
    toggleUpvoteThread,
  } = useLms();

  const [selectedCourseFilter, setSelectedCourseFilter] = useState('all');
  const [activeStatusFilter, setActiveStatusFilter] = useState<'all' | 'resolved' | 'unresolved'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedThreadId, setExpandedThreadId] = useState<string | null>(discussions[0]?.id || null);
  const [replyInputText, setReplyInputText] = useState('');
  const [showNewThreadModal, setShowNewThreadModal] = useState(false);

  // New thread form state
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCourseId, setNewCourseId] = useState(courses[0]?.id || 'course_web_01');

  const filteredThreads = discussions.filter((t) => {
    if (selectedCourseFilter !== 'all' && t.courseId !== selectedCourseFilter) return false;
    if (activeStatusFilter === 'resolved' && !t.isResolved) return false;
    if (activeStatusFilter === 'unresolved' && t.isResolved) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return t.title.toLowerCase().includes(q) || t.content.toLowerCase().includes(q);
    }
    return true;
  });

  const handleCreateThread = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;
    createDiscussionThread(newCourseId, newTitle, newContent);
    setNewTitle('');
    setNewContent('');
    setShowNewThreadModal(false);
  };

  const handleSendReply = (threadId: string) => {
    if (!replyInputText.trim()) return;
    postDiscussionReply(threadId, replyInputText);
    setReplyInputText('');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            Forum Diskusi & Tanya Jawab Akademik
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Diskusikan materi kuliah, bertukar solusi pemecahan masalah bersama rekan sejawat dan guru
          </p>
        </div>

        <button
          onClick={() => setShowNewThreadModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tanya Pertanyaan Baru</span>
        </button>
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

        <div className="flex items-center p-1 bg-slate-100 rounded-lg text-xs">
          <button
            onClick={() => setActiveStatusFilter('all')}
            className={`px-3 py-1 font-medium rounded-md transition-colors ${
              activeStatusFilter === 'all'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Semua
          </button>
          <button
            onClick={() => setActiveStatusFilter('resolved')}
            className={`px-3 py-1 font-medium rounded-md transition-colors ${
              activeStatusFilter === 'resolved'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Solusi Terverifikasi
          </button>
          <button
            onClick={() => setActiveStatusFilter('unresolved')}
            className={`px-3 py-1 font-medium rounded-md transition-colors ${
              activeStatusFilter === 'unresolved'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Belum Terjawab
          </button>
        </div>
      </div>

      {/* Forum Threads List & Discussion View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Threads List (5 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          {filteredThreads.map((thread) => {
            const course = courses.find((c) => c.id === thread.courseId);
            const isSelected = expandedThreadId === thread.id;
            const hasUserUpvoted = thread.upvotedByUserIds.includes(currentUser.id);

            return (
              <div
                key={thread.id}
                onClick={() => setExpandedThreadId(thread.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-indigo-50/50 border-indigo-400 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                  <span className="font-semibold text-indigo-600 truncate max-w-[200px]">
                    {course?.code}
                  </span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {thread.isPinned && (
                      <span className="text-amber-600 flex items-center gap-0.5 text-[11px] font-semibold">
                        <Pin className="w-3 h-3 fill-amber-500" />
                        Disematkan
                      </span>
                    )}
                    {thread.isResolved && (
                      <span className="text-emerald-600 flex items-center gap-0.5 text-[11px] font-semibold">
                        <CheckCircle2 className="w-3 h-3" />
                        Solved
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2 mb-2">
                  {thread.title}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-2 mb-3 leading-relaxed">
                  {thread.content}
                </p>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2 truncate">
                    <img
                      src={thread.authorAvatar}
                      alt={thread.authorName}
                      className="w-5 h-5 rounded-full object-cover shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <span className="truncate">{thread.authorName}</span>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                      {thread.replies.length}
                    </span>
                    <span className="flex items-center gap-1 font-mono">
                      <ThumbsUp className={`w-3.5 h-3.5 ${hasUserUpvoted ? 'text-indigo-600 fill-indigo-500' : 'text-slate-400'}`} />
                      {thread.upvotes}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Active Thread Detail & Replies (7 Cols) */}
        <div className="lg:col-span-7">
          {(() => {
            const activeThread = discussions.find((t) => t.id === expandedThreadId);
            if (!activeThread) {
              return (
                <div className="p-12 text-center bg-white rounded-xl border border-slate-200 text-slate-400 text-xs">
                  Pilih salah satu thread diskusi dari daftar sebelah kiri untuk membaca dan membalas.
                </div>
              );
            }

            const course = courses.find((c) => c.id === activeThread.courseId);
            const hasUserUpvoted = activeThread.upvotedByUserIds.includes(currentUser.id);

            return (
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs space-y-6 p-6">
                {/* Thread Header */}
                <div className="border-b border-slate-100 pb-4 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                      {course?.title}
                    </span>
                    <span className="text-slate-400">
                      {new Date(activeThread.createdAt).toLocaleDateString('id-ID')}
                    </span>
                  </div>

                  <h2 className="text-lg font-bold text-slate-900 leading-snug">
                    {activeThread.title}
                  </h2>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={activeThread.authorAvatar}
                        alt={activeThread.authorName}
                        className="w-8 h-8 rounded-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <div className="text-xs font-bold text-slate-800">
                          {activeThread.authorName}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {activeThread.authorRole === 'guru' ? 'Dosen Pengampu' : 'Siswa'}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleUpvoteThread(activeThread.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                        hasUserUpvoted
                          ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{activeThread.upvotes} Mendukung</span>
                    </button>
                  </div>

                  <div className="text-xs sm:text-sm text-slate-700 leading-relaxed pt-2">
                    {activeThread.content}
                  </div>
                </div>

                {/* Replies Thread */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Balasan & Solusi ({activeThread.replies.length})
                  </h4>

                  {activeThread.replies.map((reply) => {
                    return (
                      <div
                        key={reply.id}
                        className={`p-4 rounded-xl border space-y-2 transition-all ${
                          reply.isBestAnswer
                            ? 'bg-emerald-50/70 border-emerald-300 shadow-2xs'
                            : 'bg-slate-50/60 border-slate-200'
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
                            <div>
                              <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                                <span>{reply.authorName}</span>
                                {reply.authorRole === 'guru' && (
                                  <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.2 rounded">
                                    Pengajar
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {reply.isBestAnswer && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-200">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              Solusi Terverifikasi Pengajar
                            </span>
                          )}
                        </div>

                        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                          {reply.content}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Post Reply Input Box */}
                <div className="pt-4 border-t border-slate-100 flex items-start gap-3">
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-full object-cover shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 space-y-2">
                    <textarea
                      rows={3}
                      value={replyInputText}
                      onChange={(e) => setReplyInputText(e.target.value)}
                      placeholder="Tuliskan respon konstruktif atau solusi Anda..."
                      className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none leading-relaxed text-slate-800"
                    />
                    <div className="flex justify-end">
                      <button
                        onClick={() => handleSendReply(activeThread.id)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-2xs transition-colors"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Kirim Balasan</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {/* New Thread Modal */}
      {showNewThreadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Buat Topik Pertanyaan Diskusi Baru
              </h3>
              <button
                onClick={() => setShowNewThreadModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateThread} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Mata Pelajaran
                </label>
                <select
                  value={newCourseId}
                  onChange={(e) => setNewCourseId(e.target.value)}
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
                  Judul Pertanyaan
                </label>
                <input
                  required
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Contoh: Mengapa kalkulasi integral lipat dua menghasilkan diskontinuitas?"
                  className="w-full text-xs sm:text-sm p-2.5 rounded-lg border border-slate-300 focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Uraian Detail Masalah
                </label>
                <textarea
                  required
                  rows={4}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Jelaskan bagian kode, teorema, atau konsep yang ingin Anda diskusikan..."
                  className="w-full text-xs sm:text-sm p-3 rounded-lg border border-slate-300 focus:border-indigo-500 outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowNewThreadModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
                >
                  Publikasikan Diskusi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
