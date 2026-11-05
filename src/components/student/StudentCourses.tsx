import React, { useState } from 'react';
import { BookOpen, User, Clock, MapPin, Award, ArrowRight, Search, FileText, CheckCircle2 } from 'lucide-react';
import { useLms } from '../../context/LmsContext';
import { Course } from '../../types';

export const StudentCourses: React.FC = () => {
  const { courses, modules, assignments, exams, currentUser, setActiveNav, setSelectedCourseId } = useLms();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDetailCourse, setSelectedDetailCourse] = useState<Course | null>(null);

  const filteredCourses = courses.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.instructorName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenCourse = (courseId: string) => {
    setSelectedCourseId(courseId);
    setActiveNav('modules');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            Daftar Mata Pelajaran
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Katalog mata kuliah aktif yang Anda ikuti pada semester ini
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari mata pelajaran / dosen..."
            className="w-full text-xs sm:text-sm pl-9 pr-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCourses.map((course) => {
          const courseModules = modules.filter((m) => m.courseId === course.id);
          const courseAssignments = assignments.filter((a) => a.courseId === course.id);
          const courseExams = exams.filter((e) => e.courseId === course.id);
          const readCount = courseModules.filter((m) =>
            m.readByStudentIds.includes(currentUser.id)
          ).length;
          const readPercent = courseModules.length > 0 ? Math.round((readCount / courseModules.length) * 100) : 0;

          return (
            <div
              key={course.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              {/* Course Photo Header */}
              {course.coverImage && (
                <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
                  <img
                    src={course.coverImage}
                    alt={course.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-white bg-indigo-600/90 backdrop-blur-md px-2.5 py-1 rounded-md shadow-xs">
                      {course.code}
                    </span>
                    <span className="text-xs font-semibold text-white bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md">
                      {course.credits} SKS
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-4 right-4">
                    <span className="text-xs font-medium text-indigo-300 uppercase tracking-wider block">
                      {course.category}
                    </span>
                  </div>
                </div>
              )}

              {/* Card Banner */}
              <div className="p-6 border-b border-slate-100 space-y-3">
                {!course.coverImage && (
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-mono font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                      {course.code}
                    </span>
                    <span>{course.credits} SKS Kredit</span>
                  </div>
                )}

                <h2 className="text-lg font-bold text-slate-900 leading-snug">
                  {course.title}
                </h2>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                  {course.description}
                </p>

                {/* Info Pills */}
                <div className="grid grid-cols-2 gap-2 pt-2 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5 truncate">
                    <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{course.instructorName}</span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{course.scheduleDay}</span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{course.room}</span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <BookOpen className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{courseModules.length} Modul Materi</span>
                  </div>
                </div>
              </div>

              {/* Progress & Actions */}
              <div className="p-6 bg-slate-50/70 space-y-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span>Kemajuan Modul Baca ({readCount}/{courseModules.length})</span>
                    <span className="font-mono font-semibold">{readPercent}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${readPercent}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 pt-2">
                  <button
                    onClick={() => setSelectedDetailCourse(course)}
                    className="text-xs font-semibold text-slate-600 hover:text-slate-900"
                  >
                    Detail Silabus
                  </button>

                  <button
                    onClick={() => handleOpenCourse(course.id)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-2xs transition-colors"
                  >
                    <span>Buka Ruang Belajar</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Syllabus Detail Modal */}
      {selectedDetailCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-mono font-semibold text-indigo-600">
                  {selectedDetailCourse.code} · {selectedDetailCourse.credits} SKS
                </span>
                <h3 className="text-lg font-bold text-slate-900">
                  {selectedDetailCourse.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedDetailCourse(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
              <div>
                <span className="font-semibold text-slate-800 block">Deskripsi Mata Pelajaran:</span>
                <p>{selectedDetailCourse.description}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs">
                <div><strong>Dosen Pengampu:</strong> {selectedDetailCourse.instructorName}</div>
                <div><strong>Jadwal Kuliah:</strong> {selectedDetailCourse.scheduleDay}, {selectedDetailCourse.scheduleTime}</div>
                <div><strong>Ruang Pertemuan:</strong> {selectedDetailCourse.room}</div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => setSelectedDetailCourse(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Tutup
              </button>
              <button
                onClick={() => {
                  handleOpenCourse(selectedDetailCourse.id);
                  setSelectedDetailCourse(null);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
              >
                Buka Materi Mata Pelajaran
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
