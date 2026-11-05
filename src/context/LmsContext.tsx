import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  UserProfile,
  Course,
  ModuleItem,
  Assignment,
  Exam,
  ExamQuestion,
  AttendanceRecord,
  DiscussionThread,
  CourseGradeSummary,
} from '../types';
import {
  TEACHER_USER,
  STUDENT_USER,
  PEER_STUDENTS,
  INITIAL_COURSES,
  INITIAL_MODULES,
  INITIAL_ASSIGNMENTS,
  INITIAL_EXAMS,
  INITIAL_ATTENDANCE,
  INITIAL_DISCUSSIONS,
} from '../data/seedData';
import { downloadModuleAsPdf } from '../utils/pdfDownloader';

interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning';
  title: string;
  message: string;
}

interface LmsContextType {
  // Authentication & Session
  isAuthenticated: boolean;
  role: UserRole;
  currentUser: UserProfile;
  login: (user: UserProfile) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  setCurrentUser: (user: UserProfile) => void;

  activeNav: string;
  setActiveNav: (nav: string) => void;
  selectedCourseId: string;
  setSelectedCourseId: (id: string) => void;

  // Students Management
  students: Array<{ id: string; name: string; nis: string; avatar: string; email: string; className: string; enrolledDate?: string; phone?: string }>;
  addStudent: (student: { name: string; nis: string; email?: string; className?: string; avatar?: string; phone?: string }) => void;
  deleteStudent: (studentId: string) => void;

  // Courses
  courses: Course[];

  // Modules
  modules: ModuleItem[];
  markModuleAsRead: (moduleId: string) => void;
  downloadModule: (moduleId: string) => void;
  createModule: (moduleData: Omit<ModuleItem, 'id' | 'downloadCount' | 'readByStudentIds' | 'publishedAt'>) => void;
  deleteModule: (moduleId: string) => void;

  // Assignments
  assignments: Assignment[];
  submitAssignment: (
    assignmentId: string,
    data: { fileName?: string; fileSize?: string; fileUrl?: string; essayAnswer: string; studentNotes?: string }
  ) => void;
  gradeAssignment: (
    assignmentId: string,
    submissionId: string,
    score: number,
    feedback: string
  ) => void;
  createAssignment: (
    assignmentData: Omit<Assignment, 'id' | 'assignedDate' | 'submissions'>
  ) => void;

  // Exams
  exams: Exam[];
  activeExamIdForRunner: string | null;
  startExamRunner: (examId: string) => void;
  closeExamRunner: () => void;
  submitExamAnswers: (
    examId: string,
    answers: Record<string, string>,
    flaggedDoubt: Record<string, boolean>
  ) => void;
  gradeExamSubmission: (
    examId: string,
    submissionId: string,
    scores: Record<string, number>,
    notes: string
  ) => void;
  createExam: (newExam: Omit<Exam, 'id' | 'submissions'>) => void;
  updateExamQuestions: (examId: string, questions: ExamQuestion[]) => void;
  deleteExam: (examId: string) => void;
  togglePublishExam: (examId: string) => void;
  resetStudentExamSubmission: (examId: string) => void;

  // Attendance
  attendanceRecords: AttendanceRecord[];
  recordStudentAttendance: (
    courseId: string,
    status: 'hadir' | 'izin' | 'sakit' | 'alpa',
    notes?: string
  ) => void;
  updateAttendanceByTeacher: (
    recordId: string,
    status: 'hadir' | 'izin' | 'sakit' | 'alpa',
    notes?: string
  ) => void;

  // Discussions
  discussions: DiscussionThread[];
  createDiscussionThread: (courseId: string, title: string, content: string) => void;
  postDiscussionReply: (threadId: string, content: string) => void;
  toggleUpvoteThread: (threadId: string) => void;
  togglePinThread: (threadId: string) => void;
  markBestAnswer: (threadId: string, replyId: string) => void;
  deleteReply: (threadId: string, replyId: string) => void;

  // Computed Summaries
  studentGradeSummaries: CourseGradeSummary[];
  overallGpa: number;
  overallAttendanceRate: number;
  completedModulesCount: number;

  // Toast
  toasts: ToastMessage[];
  showToast: (title: string, message: string, type?: 'success' | 'info' | 'warning') => void;
  removeToast: (id: string) => void;
}

const LmsContext = createContext<LmsContextType | undefined>(undefined);

const STORAGE_KEYS = {
  AUTH: 'lentera_auth_v2',
  USER: 'lentera_user_v2',
  ROLE: 'lentera_role_v2',
  STUDENTS: 'lentera_students_v2',
  COURSES: 'lentera_courses_v2',
  MODULES: 'lentera_modules_v2',
  ASSIGNMENTS: 'lentera_assignments_v2',
  EXAMS: 'lentera_exams_v2',
  ATTENDANCE: 'lentera_attendance_v2',
  DISCUSSIONS: 'lentera_discussions_v2',
};

function sanitizeExams(rawExams: Exam[]): Exam[] {
  return rawExams.map((exam) => ({
    ...exam,
    questions: (exam.questions || []).map((q) => {
      if (q.type !== 'multiple_choice' || !q.options) return q;
      const stdIds = ['opt_a', 'opt_b', 'opt_c', 'opt_d'];
      const rawOptions = q.options;
      const standardizedOptions = rawOptions.map((opt, idx) => ({
        id: stdIds[idx] || `opt_${idx}`,
        text: opt.text,
      }));

      let verifiedCorrectId = q.correctOptionId;
      const originalCorrectIdx = rawOptions.findIndex((o) => o.id === q.correctOptionId);
      if (originalCorrectIdx >= 0) {
        verifiedCorrectId = stdIds[originalCorrectIdx] || 'opt_a';
      } else if (!verifiedCorrectId || !stdIds.includes(verifiedCorrectId)) {
        verifiedCorrectId = 'opt_a';
      }

      return {
        ...q,
        options: standardizedOptions,
        correctOptionId: verifiedCorrectId,
      };
    }),
  }));
}

export const LmsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.AUTH);
    return saved !== null ? saved === 'true' : true;
  });

  const [role, setRole] = useState<UserRole>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ROLE);
    return saved === 'guru' ? 'guru' : 'siswa';
  });

  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    const savedRole = localStorage.getItem(STORAGE_KEYS.ROLE);
    return savedRole === 'guru' ? TEACHER_USER : STUDENT_USER;
  });

  const [students, setStudents] = useState<Array<{ id: string; name: string; nis: string; avatar: string; email: string; className: string; enrolledDate?: string; phone?: string }>>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    return saved ? JSON.parse(saved) : PEER_STUDENTS;
  });

  const [activeNav, setActiveNav] = useState<string>('dashboard');
  const [selectedCourseId, setSelectedCourseId] = useState<string>('all');
  const [activeExamIdForRunner, setActiveExamIdForRunner] = useState<string | null>(null);

  // Core entities
  const [courses] = useState<Course[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.COURSES);
    return saved ? JSON.parse(saved) : INITIAL_COURSES;
  });

  const [modules, setModules] = useState<ModuleItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MODULES);
    return saved ? JSON.parse(saved) : INITIAL_MODULES;
  });

  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ASSIGNMENTS);
    return saved ? JSON.parse(saved) : INITIAL_ASSIGNMENTS;
  });

  const [exams, setExams] = useState<Exam[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.EXAMS);
    return saved ? sanitizeExams(JSON.parse(saved)) : INITIAL_EXAMS;
  });

  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
    return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE;
  });

  const [discussions, setDiscussions] = useState<DiscussionThread[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DISCUSSIONS);
    return saved ? JSON.parse(saved) : INITIAL_DISCUSSIONS;
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Toast handler
  const showToast = (title: string, message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AUTH, String(isAuthenticated));
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ROLE, role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MODULES, JSON.stringify(modules));
  }, [modules]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(assignments));
  }, [assignments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EXAMS, JSON.stringify(exams));
  }, [exams]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(attendanceRecords));
  }, [attendanceRecords]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DISCUSSIONS, JSON.stringify(discussions));
  }, [discussions]);

  const login = (user: UserProfile) => {
    setIsAuthenticated(true);
    setCurrentUser(user);
    setRole(user.role);
    setActiveNav('dashboard');
    showToast(
      'Login Berhasil',
      `Selamat datang kembali, ${user.name}! Anda masuk sebagai ${user.role === 'guru' ? 'Guru' : 'Siswa'}.`,
      'success'
    );
  };

  const logout = () => {
    setIsAuthenticated(false);
    showToast(
      'Sesi Diakhiri',
      'Anda telah keluar dari Lentera Edu LMS. Sampai jumpa kembali!',
      'info'
    );
  };

  const switchRole = (newRole: UserRole) => {
    setRole(newRole);
    const newUser = newRole === 'guru' ? TEACHER_USER : STUDENT_USER;
    setCurrentUser(newUser);
    setActiveNav('dashboard');
    showToast(
      'Role Berganti',
      `Sekarang Anda masuk dalam mode: ${newRole === 'guru' ? 'Guru / Pengajar (' + TEACHER_USER.name + ')' : 'Siswa (' + STUDENT_USER.name + ')'}`,
      'info'
    );
  };

  // STUDENT MANAGEMENT HANDLERS (GURU)
  const addStudent = (studentData: {
    name: string;
    nis: string;
    email?: string;
    className?: string;
    avatar?: string;
    phone?: string;
  }) => {
    const existing = students.find((s) => s.nis.trim() === studentData.nis.trim());
    if (existing) {
      showToast('Gagal Menambahkan', `Siswa dengan NIS ${studentData.nis} sudah terdaftar (${existing.name}).`, 'warning');
      return;
    }

    const defaultAvatars = [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80',
    ];
    const pickedAvatar = studentData.avatar || defaultAvatars[students.length % defaultAvatars.length];

    const newStudent = {
      id: `siswa_${Date.now()}`,
      name: studentData.name,
      nis: studentData.nis,
      email: studentData.email || `${studentData.name.toLowerCase().replace(/\s+/g, '.')}@lentera.edu`,
      className: studentData.className || 'XII MIPA 1 - Sains Komputasi',
      avatar: pickedAvatar,
      enrolledDate: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      phone: studentData.phone || '0812-0000-0000',
    };

    setStudents((prev) => [newStudent, ...prev]);

    // Also seed a default attendance record for today for this new student
    const today = new Date().toISOString().split('T')[0];
    const newAttRecord: AttendanceRecord = {
      id: `att_new_${Date.now()}`,
      date: today,
      courseId: 'course_web_01',
      studentId: newStudent.id,
      studentName: newStudent.name,
      studentNis: newStudent.nis,
      status: 'hadir',
      time: '08:00 WIB',
      location: 'Lab Komputasi 3',
      notes: 'Siswa baru terdaftar',
    };
    setAttendanceRecords((prev) => [newAttRecord, ...prev]);

    showToast('Murid Berhasil Ditambahkan', `${newStudent.name} (${newStudent.nis}) resmi terdaftar di kelas ${newStudent.className}.`);
  };

  const deleteStudent = (studentId: string) => {
    const student = students.find((s) => s.id === studentId);
    setStudents((prev) => prev.filter((s) => s.id !== studentId));
    showToast('Data Siswa Dihapus', `${student?.name || 'Siswa'} telah dikeluarkan dari daftar rombel kelas.`, 'info');
  };

  // MODULE HANDLERS
  const markModuleAsRead = (moduleId: string) => {
    setModules((prev) =>
      prev.map((m) => {
        if (m.id !== moduleId) return m;
        const studentId = STUDENT_USER.id;
        const isRead = m.readByStudentIds.includes(studentId);
        const nextIds = isRead
          ? m.readByStudentIds.filter((id) => id !== studentId)
          : [...m.readByStudentIds, studentId];
        return { ...m, readByStudentIds: nextIds };
      })
    );
    showToast('Status Membaca Diperbarui', 'Progres baca modul materi Anda telah disimpan secara real-time.');
  };

  const downloadModule = (moduleId: string) => {
    const targetModule = modules.find((m) => m.id === moduleId);
    if (targetModule) {
      const course = courses.find((c) => c.id === targetModule.courseId);
      downloadModuleAsPdf(targetModule, course);
    }

    setModules((prev) =>
      prev.map((m) => (m.id === moduleId ? { ...m, downloadCount: m.downloadCount + 1 } : m))
    );
    showToast('Mengunduh Modul', 'Berkas PDF modul materi berhasil diunduh ke perangkat Anda.');
  };

  const createModule = (
    moduleData: Omit<ModuleItem, 'id' | 'downloadCount' | 'readByStudentIds' | 'publishedAt'>
  ) => {
    const newMod: ModuleItem = {
      ...moduleData,
      id: `mod_${Date.now()}`,
      downloadCount: 0,
      readByStudentIds: [],
      publishedAt: new Date().toISOString().split('T')[0],
    };
    setModules((prev) => [newMod, ...prev]);
    showToast('Materi Berhasil Diterbitkan', `Modul "${newMod.title}" kini telah dapat diakses oleh seluruh siswa.`);
  };

  const deleteModule = (moduleId: string) => {
    setModules((prev) => prev.filter((m) => m.id !== moduleId));
    showToast('Materi Dihapus', 'Modul telah berhasil dihapus dari silabus pembelajaran.', 'info');
  };

  // ASSIGNMENT HANDLERS
  const submitAssignment = (
    assignmentId: string,
    data: { fileName?: string; fileSize?: string; fileUrl?: string; essayAnswer: string; studentNotes?: string }
  ) => {
    const student = STUDENT_USER;
    const nowIso = new Date().toISOString();

    setAssignments((prev) =>
      prev.map((a) => {
        if (a.id !== assignmentId) return a;
        const existingIdx = a.submissions.findIndex((s) => s.studentId === student.id);
        const newSubmission = {
          id: existingIdx >= 0 ? a.submissions[existingIdx].id : `sub_${Date.now()}`,
          assignmentId,
          studentId: student.id,
          studentName: student.name,
          studentNis: student.identifier,
          submittedAt: nowIso,
          status: 'submitted' as const,
          fileName: data.fileName || 'Jawaban_Tugas_NadiaPutri.pdf',
          fileSize: data.fileSize || '1.4 MB',
          fileUrl: data.fileUrl,
          essayAnswer: data.essayAnswer,
          studentNotes: data.studentNotes,
          score: undefined,
          feedback: undefined,
        };

        let nextSubmissions = [...a.submissions];
        if (existingIdx >= 0) {
          nextSubmissions[existingIdx] = newSubmission;
        } else {
          nextSubmissions.push(newSubmission);
        }

        return { ...a, submissions: nextSubmissions };
      })
    );

    showToast('Tugas Berhasil Dikumpulkan', 'Jawaban dan berkas Anda telah berhasil diserahkan sebelum tenggat waktu.');
  };

  const gradeAssignment = (
    assignmentId: string,
    submissionId: string,
    score: number,
    feedback: string
  ) => {
    const nowIso = new Date().toISOString();
    setAssignments((prev) =>
      prev.map((a) => {
        if (a.id !== assignmentId) return a;
        return {
          ...a,
          submissions: a.submissions.map((s) => {
            if (s.id !== submissionId) return s;
            return {
              ...s,
              status: 'graded',
              score,
              feedback,
              gradedAt: nowIso,
            };
          }),
        };
      })
    );
    showToast('Nilai Disimpan', `Penilaian tugas sebesar ${score} poin telah dicatat ke dalam buku nilai siswa.`);
  };

  const createAssignment = (
    assignmentData: Omit<Assignment, 'id' | 'assignedDate' | 'submissions'>
  ) => {
    const newAss: Assignment = {
      ...assignmentData,
      id: `task_${Date.now()}`,
      assignedDate: new Date().toISOString().split('T')[0],
      submissions: [],
    };
    setAssignments((prev) => [newAss, ...prev]);
    showToast('Tugas Dibuat', `Tugas "${newAss.title}" dengan bobot ${newAss.weightPercentage}% berhasil dipublikasikan.`);
  };

  // EXAM HANDLERS
  const startExamRunner = (examId: string) => {
    setActiveExamIdForRunner(examId);
  };

  const closeExamRunner = () => {
    setActiveExamIdForRunner(null);
  };

  const submitExamAnswers = (
    examId: string,
    answers: Record<string, string>,
    flaggedDoubt: Record<string, boolean>
  ) => {
    const targetExam = exams.find((e) => e.id === examId);
    if (!targetExam) return;

    let computedScore = 0;
    let maxScore = 0;
    const scores: Record<string, number> = {};

    targetExam.questions.forEach((q) => {
      maxScore += q.points;
      if (q.type === 'multiple_choice') {
        const studentChoice = answers[q.id];
        const isMatch = Boolean(
          studentChoice &&
          q.correctOptionId &&
          (studentChoice === q.correctOptionId ||
           studentChoice.toLowerCase() === q.correctOptionId.toLowerCase() ||
           (studentChoice === 'opt_a' && (q.correctOptionId === 'A' || q.correctOptionId === 'opt_a')) ||
           (studentChoice === 'opt_b' && (q.correctOptionId === 'B' || q.correctOptionId === 'opt_b')) ||
           (studentChoice === 'opt_c' && (q.correctOptionId === 'C' || q.correctOptionId === 'opt_c')) ||
           (studentChoice === 'opt_d' && (q.correctOptionId === 'D' || q.correctOptionId === 'opt_d')))
        );
        if (isMatch) {
          scores[q.id] = q.points;
          computedScore += q.points;
        } else {
          scores[q.id] = 0;
        }
      } else {
        // Essay is pending teacher review or given preliminary evaluation
        scores[q.id] = 0;
      }
    });

    const hasEssay = targetExam.questions.some((q) => q.type === 'essay');

    const newSubmission = {
      id: `sub_exam_${Date.now()}`,
      examId,
      studentId: STUDENT_USER.id,
      studentName: STUDENT_USER.name,
      startedAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
      submittedAt: new Date().toISOString(),
      answers,
      flaggedDoubt,
      questionScores: scores,
      totalScore: computedScore,
      maxScore,
      isGraded: !hasEssay,
      teacherNotes: hasEssay ? 'Menunggu pemeriksaan soal esai oleh pengajar.' : 'Nilai terhitung otomatis dari soal pilihan ganda.',
    };

    setExams((prev) =>
      prev.map((e) => {
        if (e.id !== examId) return e;
        const filtered = e.submissions.filter((s) => s.studentId !== STUDENT_USER.id);
        return {
          ...e,
          submissions: [...filtered, newSubmission],
        };
      })
    );

    setActiveExamIdForRunner(null);
    showToast(
      'Ujian Berhasil Diserahkan',
      `Jawaban ujian Anda telah tersimpan. Skor otomatis pilihan ganda: ${computedScore}/${maxScore}.`
    );
  };

  const gradeExamSubmission = (
    examId: string,
    submissionId: string,
    scores: Record<string, number>,
    notes: string
  ) => {
    setExams((prev) =>
      prev.map((e) => {
        if (e.id !== examId) return e;
        return {
          ...e,
          submissions: e.submissions.map((s) => {
            if (s.id !== submissionId) return s;
            const total = Object.values(scores).reduce((acc, curr) => acc + curr, 0);
            return {
              ...s,
              questionScores: scores,
              totalScore: total,
              isGraded: true,
              teacherNotes: notes,
            };
          }),
        };
      })
    );
    showToast('Hasil Ujian Dinilai', 'Skor esai dan catatan evaluasi telah diperbarui.');
  };

  const createExam = (newExamData: Omit<Exam, 'id' | 'submissions'>) => {
    const exam: Exam = {
      ...newExamData,
      id: `exam_${Date.now()}`,
      submissions: [],
    };
    setExams((prev) => [exam, ...prev]);
    showToast('Ujian Dibuat', `Ujian baru "${exam.title}" telah ditambahkan ke bank evaluasi.`);
  };

  const togglePublishExam = (examId: string) => {
    setExams((prev) =>
      prev.map((e) => (e.id === examId ? { ...e, isPublished: !e.isPublished } : e))
    );
    showToast('Status Ujian Diubah', 'Visibilitas ujian telah berhasil diperbarui.');
  };

  const updateExamQuestions = (examId: string, questions: ExamQuestion[]) => {
    setExams((prev) =>
      prev.map((e) => (e.id === examId ? { ...e, questions } : e))
    );
    showToast('Bank Soal Disimpan', 'Butir soal dan kunci jawaban ujian berhasil diperbarui.');
  };

  const deleteExam = (examId: string) => {
    setExams((prev) => prev.filter((e) => e.id !== examId));
    showToast('Ujian Dihapus', 'Ujian telah dihapus dari sistem evaluasi.', 'info');
  };

  const resetStudentExamSubmission = (examId: string) => {
    setExams((prev) =>
      prev.map((e) => {
        if (e.id !== examId) return e;
        return {
          ...e,
          submissions: e.submissions.filter((s) => s.studentId !== STUDENT_USER.id),
        };
      })
    );
    showToast('Sesi Ujian Direset', 'Anda sekarang dapat mengerjakan ulang ujian ini.', 'info');
  };

  // ATTENDANCE HANDLERS
  const recordStudentAttendance = (
    courseId: string,
    status: 'hadir' | 'izin' | 'sakit' | 'alpa',
    notes?: string
  ) => {
    const today = new Date().toISOString().split('T')[0];
    const nowTime = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';

    setAttendanceRecords((prev) => {
      // Check if student already recorded today for this course
      const existingIdx = prev.findIndex(
        (r) => r.courseId === courseId && r.date === today && r.studentId === STUDENT_USER.id
      );

      const newRecord: AttendanceRecord = {
        id: existingIdx >= 0 ? prev[existingIdx].id : `att_${Date.now()}`,
        date: today,
        courseId,
        studentId: STUDENT_USER.id,
        studentName: STUDENT_USER.name,
        studentNis: STUDENT_USER.identifier,
        status,
        time: nowTime,
        location: status === 'hadir' ? 'Lab Komputasi 3 (Geolokasi Kampus)' : 'Kediaman Siswa',
        notes: notes || (status === 'hadir' ? 'Presensi digital mandiri' : 'Pengajuan izin melalui portal'),
      };

      if (existingIdx >= 0) {
        const copy = [...prev];
        copy[existingIdx] = newRecord;
        return copy;
      }
      return [newRecord, ...prev];
    });

    showToast('Presensi Berhasil', `Status kehadiran Anda hari ini tercatat sebagai: ${status.toUpperCase()}.`);
  };

  const updateAttendanceByTeacher = (
    recordId: string,
    status: 'hadir' | 'izin' | 'sakit' | 'alpa',
    notes?: string
  ) => {
    setAttendanceRecords((prev) =>
      prev.map((r) => (r.id === recordId ? { ...r, status, notes: notes || r.notes } : r))
    );
    showToast('Presensi Diperbarui', 'Data kehadiran siswa telah divalidasi oleh pengajar.');
  };

  // DISCUSSION HANDLERS
  const createDiscussionThread = (courseId: string, title: string, content: string) => {
    const newThread: DiscussionThread = {
      id: `disc_${Date.now()}`,
      courseId,
      title,
      content,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorRole: currentUser.role,
      authorAvatar: currentUser.avatarUrl,
      createdAt: new Date().toISOString(),
      isPinned: false,
      isResolved: false,
      upvotes: 1,
      upvotedByUserIds: [currentUser.id],
      replies: [],
    };
    setDiscussions((prev) => [newThread, ...prev]);
    showToast('Topik Diskusi Dibuat', 'Pertanyaan Anda telah diterbitkan ke forum kelas.');
  };

  const postDiscussionReply = (threadId: string, content: string) => {
    const newReply = {
      id: `rep_${Date.now()}`,
      threadId,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorRole: currentUser.role,
      authorAvatar: currentUser.avatarUrl,
      content,
      createdAt: new Date().toISOString(),
      isBestAnswer: false,
      upvotes: 0,
      upvotedByUserIds: [],
    };

    setDiscussions((prev) =>
      prev.map((d) => (d.id === threadId ? { ...d, replies: [...d.replies, newReply] } : d))
    );
    showToast('Balasan Terkirim', 'Komentar Anda telah ditambahkan ke thread diskusi.');
  };

  const toggleUpvoteThread = (threadId: string) => {
    setDiscussions((prev) =>
      prev.map((d) => {
        if (d.id !== threadId) return d;
        const alreadyUpvoted = d.upvotedByUserIds.includes(currentUser.id);
        const upvotedByUserIds = alreadyUpvoted
          ? d.upvotedByUserIds.filter((id) => id !== currentUser.id)
          : [...d.upvotedByUserIds, currentUser.id];
        return {
          ...d,
          upvotes: alreadyUpvoted ? d.upvotes - 1 : d.upvotes + 1,
          upvotedByUserIds,
        };
      })
    );
  };

  const togglePinThread = (threadId: string) => {
    setDiscussions((prev) =>
      prev.map((d) => (d.id === threadId ? { ...d, isPinned: !d.isPinned } : d))
    );
    showToast('Status Sematan Diubah', 'Thread diskusi berhasil disematkan di bagian atas.');
  };

  const markBestAnswer = (threadId: string, replyId: string) => {
    setDiscussions((prev) =>
      prev.map((d) => {
        if (d.id !== threadId) return d;
        return {
          ...d,
          isResolved: true,
          replies: d.replies.map((r) => ({
            ...r,
            isBestAnswer: r.id === replyId,
          })),
        };
      })
    );
    showToast('Jawaban Terbaik Ditetapkan', 'Jawaban pengajar ini ditandai sebagai solusi terverifikasi.');
  };

  const deleteReply = (threadId: string, replyId: string) => {
    setDiscussions((prev) =>
      prev.map((d) => {
        if (d.id !== threadId) return d;
        return {
          ...d,
          replies: d.replies.filter((r) => r.id !== replyId),
        };
      })
    );
    showToast('Balasan Dihapus', 'Komentar telah dihapus oleh moderator forum.', 'info');
  };

  // COMPUTED METRICS
  const studentGradeSummaries: CourseGradeSummary[] = courses.map((course) => {
    // Assignments score
    const courseAssignments = assignments.filter((a) => a.courseId === course.id);
    let totalAssScore = 0;
    let assCount = 0;
    courseAssignments.forEach((a) => {
      const sub = a.submissions.find((s) => s.studentId === STUDENT_USER.id);
      if (sub && sub.score !== undefined) {
        totalAssScore += sub.score;
        assCount++;
      }
    });
    const assignmentAverage = assCount > 0 ? Math.round(totalAssScore / assCount) : 88;

    // Exam score
    const courseExams = exams.filter((e) => e.courseId === course.id);
    let totalExamScore = 0;
    let examCount = 0;
    courseExams.forEach((e) => {
      const sub = e.submissions.find((s) => s.studentId === STUDENT_USER.id);
      if (sub && sub.totalScore !== undefined) {
        totalExamScore += Math.round((sub.totalScore / (sub.maxScore || 100)) * 100);
        examCount++;
      }
    });
    const examAverage = examCount > 0 ? Math.round(totalExamScore / examCount) : 92;

    // Attendance
    const courseAtt = attendanceRecords.filter(
      (r) => r.courseId === course.id && r.studentId === STUDENT_USER.id
    );
    const presentCount = courseAtt.filter((r) => r.status === 'hadir').length;
    const attendancePercentage = courseAtt.length > 0 ? Math.round((presentCount / courseAtt.length) * 100) : 95;

    // Weighted final: 40% assignment + 40% exam + 20% attendance
    const finalScore = Math.round(assignmentAverage * 0.4 + examAverage * 0.4 + attendancePercentage * 0.2);

    let letterGrade: CourseGradeSummary['letterGrade'] = 'A';
    let status: CourseGradeSummary['status'] = 'Lulus Sangat Memuaskan';

    if (finalScore >= 92) {
      letterGrade = 'A';
      status = 'Lulus Sangat Memuaskan';
    } else if (finalScore >= 85) {
      letterGrade = 'A-';
      status = 'Lulus Sangat Memuaskan';
    } else if (finalScore >= 80) {
      letterGrade = 'B+';
      status = 'Lulus Memuaskan';
    } else if (finalScore >= 75) {
      letterGrade = 'B';
      status = 'Lulus Memuaskan';
    } else if (finalScore >= 70) {
      letterGrade = 'B-';
      status = 'Lulus';
    } else if (finalScore >= 65) {
      letterGrade = 'C+';
      status = 'Lulus';
    } else {
      letterGrade = 'C';
      status = 'Perlu Perbaikan';
    }

    return {
      courseId: course.id,
      courseCode: course.code,
      courseTitle: course.title,
      assignmentAverage,
      examAverage,
      attendancePercentage,
      finalScore,
      letterGrade,
      status,
    };
  });

  const overallGpa =
    studentGradeSummaries.length > 0
      ? Number(
          (
            studentGradeSummaries.reduce((acc, curr) => acc + (curr.finalScore / 25), 0) /
            studentGradeSummaries.length
          ).toFixed(2)
        )
      : 3.88;

  const totalNadiaAtt = attendanceRecords.filter((r) => r.studentId === STUDENT_USER.id);
  const presentCount = totalNadiaAtt.filter((r) => r.status === 'hadir').length;
  const overallAttendanceRate =
    totalNadiaAtt.length > 0 ? Math.round((presentCount / totalNadiaAtt.length) * 100) : 96;

  const completedModulesCount = modules.filter((m) =>
    m.readByStudentIds.includes(STUDENT_USER.id)
  ).length;

  return (
    <LmsContext.Provider
      value={{
        isAuthenticated,
        role,
        currentUser,
        login,
        logout,
        switchRole,
        setCurrentUser,

        activeNav,
        setActiveNav,
        selectedCourseId,
        setSelectedCourseId,

        students,
        addStudent,
        deleteStudent,

        courses,

        modules,
        markModuleAsRead,
        downloadModule,
        createModule,
        deleteModule,

        assignments,
        submitAssignment,
        gradeAssignment,
        createAssignment,

        exams,
        activeExamIdForRunner,
        startExamRunner,
        closeExamRunner,
        submitExamAnswers,
        gradeExamSubmission,
        createExam,
        updateExamQuestions,
        deleteExam,
        togglePublishExam,
        resetStudentExamSubmission,

        attendanceRecords,
        recordStudentAttendance,
        updateAttendanceByTeacher,

        discussions,
        createDiscussionThread,
        postDiscussionReply,
        toggleUpvoteThread,
        togglePinThread,
        markBestAnswer,
        deleteReply,

        studentGradeSummaries,
        overallGpa,
        overallAttendanceRate,
        completedModulesCount,

        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </LmsContext.Provider>
  );
};

export const useLms = () => {
  const context = useContext(LmsContext);
  if (!context) {
    throw new Error('useLms must be used within a LmsProvider');
  }
  return context;
};
