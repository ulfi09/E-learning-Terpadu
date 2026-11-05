export type UserRole = 'siswa' | 'guru';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  avatarUrl: string;
  identifier: string; // NIS for student, NIP for teacher
  className?: string; // e.g., 'XII MIPA 1'
  department?: string; // e.g., 'Departemen Sains & Teknologi'
}

export interface Course {
  id: string;
  code: string;
  title: string;
  instructorName: string;
  instructorId: string;
  category: string;
  description: string;
  coverImage?: string;
  themeColor: string;
  scheduleDay: string;
  scheduleTime: string;
  room: string;
  credits: number;
}

export type ModuleContentType = 'pdf' | 'document' | 'video' | 'slide' | 'ppt' | 'interactive' | 'other';

export interface ModuleItem {
  id: string;
  courseId: string;
  title: string;
  chapter: string;
  description: string;
  contentType: ModuleContentType;
  fileSize: string;
  readTimeMinutes?: number;
  publishedAt: string;
  textContent: string;
  downloadUrl?: string;
  downloadCount: number;
  readByStudentIds: string[];
  coverImage?: string;
  videoUrl?: string;
  attachmentFileName?: string;
  attachmentFileSize?: string;
  attachmentFileUrl?: string;
}

export interface StudentProfileItem {
  id: string;
  name: string;
  nis: string;
  email: string;
  avatar: string;
  className: string;
  enrolledDate?: string;
  phone?: string;
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  studentNis: string;
  submittedAt: string;
  status: 'submitted' | 'late' | 'graded';
  fileName?: string;
  fileSize?: string;
  fileUrl?: string;
  essayAnswer?: string;
  studentNotes?: string;
  score?: number;
  feedback?: string;
  gradedAt?: string;
}

export interface Assignment {
  id: string;
  courseId: string;
  title: string;
  chapter: string;
  instructions: string;
  assignedDate: string;
  deadline: string;
  maxScore: number;
  weightPercentage: number;
  allowedFormats: string[];
  submissions: AssignmentSubmission[];
}

export interface ExamOption {
  id: string;
  text: string;
}

export interface ExamQuestion {
  id: string;
  type: 'multiple_choice' | 'essay';
  text: string;
  options?: ExamOption[];
  correctOptionId?: string;
  points: number;
  rubricGuidance?: string;
  explanation?: string;
}

export interface ExamSubmission {
  id: string;
  examId: string;
  studentId: string;
  studentName: string;
  startedAt: string;
  submittedAt: string;
  answers: Record<string, string>; // questionId -> optionId or essay answer
  flaggedDoubt: Record<string, boolean>; // questionId -> boolean
  questionScores: Record<string, number>; // questionId -> awarded score
  totalScore: number;
  maxScore: number;
  isGraded: boolean;
  teacherNotes?: string;
}

export interface Exam {
  id: string;
  courseId: string;
  title: string;
  description: string;
  durationMinutes: number;
  deadline: string;
  passingScore: number;
  isPublished: boolean;
  questions: ExamQuestion[];
  submissions: ExamSubmission[];
}

export type AttendanceStatus = 'hadir' | 'izin' | 'sakit' | 'alpa';

export interface AttendanceRecord {
  id: string;
  date: string; // YYYY-MM-DD
  courseId: string;
  studentId: string;
  studentName: string;
  studentNis: string;
  status: AttendanceStatus;
  time: string;
  location: string;
  notes?: string;
}

export interface DiscussionReply {
  id: string;
  threadId: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  authorAvatar: string;
  content: string;
  createdAt: string;
  isBestAnswer: boolean;
  upvotes: number;
  upvotedByUserIds: string[];
}

export interface DiscussionThread {
  id: string;
  courseId: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  authorAvatar: string;
  createdAt: string;
  isPinned: boolean;
  isResolved: boolean;
  upvotes: number;
  upvotedByUserIds: string[];
  replies: DiscussionReply[];
}

export interface CourseGradeSummary {
  courseId: string;
  courseCode: string;
  courseTitle: string;
  assignmentAverage: number;
  examAverage: number;
  attendancePercentage: number;
  finalScore: number;
  letterGrade: 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'D' | 'E';
  status: 'Lulus Sangat Memuaskan' | 'Lulus Memuaskan' | 'Lulus' | 'Perlu Perbaikan';
}
