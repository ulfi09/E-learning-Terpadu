import React, { useState } from 'react';
import { LmsProvider, useLms } from './context/LmsContext';
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';

// Student Views
import { StudentDashboard } from './components/student/StudentDashboard';
import { StudentCourses } from './components/student/StudentCourses';
import { StudentModules } from './components/student/StudentModules';
import { StudentAssignments } from './components/student/StudentAssignments';
import { StudentExams } from './components/student/StudentExams';
import { StudentGrades } from './components/student/StudentGrades';
import { StudentAttendance } from './components/student/StudentAttendance';
import { StudentForum } from './components/student/StudentForum';

// Auth View
import { LoginPage } from './components/auth/LoginPage';

// Teacher Views
import { TeacherDashboard } from './components/teacher/TeacherDashboard';
import { TeacherStudentManager } from './components/teacher/TeacherStudentManager';
import { TeacherMaterialManager } from './components/teacher/TeacherMaterialManager';
import { TeacherAssignmentManager } from './components/teacher/TeacherAssignmentManager';
import { TeacherExamBuilder } from './components/teacher/TeacherExamBuilder';
import { TeacherGradebook } from './components/teacher/TeacherGradebook';
import { TeacherAttendanceManager } from './components/teacher/TeacherAttendanceManager';
import { TeacherForumModerator } from './components/teacher/TeacherForumModerator';

const MainContent: React.FC = () => {
  const { role, activeNav, isAuthenticated } = useLms();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const renderActiveView = () => {
    if (role === 'guru') {
      switch (activeNav) {
        case 'dashboard':
          return <TeacherDashboard />;
        case 'students':
          return <TeacherStudentManager />;
        case 'modules':
          return <TeacherMaterialManager />;
        case 'assignments':
          return <TeacherAssignmentManager />;
        case 'exams':
          return <TeacherExamBuilder />;
        case 'grades':
          return <TeacherGradebook />;
        case 'attendance':
          return <TeacherAttendanceManager />;
        case 'forum':
          return <TeacherForumModerator />;
        default:
          return <TeacherDashboard />;
      }
    } else {
      switch (activeNav) {
        case 'dashboard':
          return <StudentDashboard />;
        case 'courses':
          return <StudentCourses />;
        case 'modules':
          return <StudentModules />;
        case 'assignments':
          return <StudentAssignments />;
        case 'exams':
          return <StudentExams />;
        case 'grades':
          return <StudentGrades />;
        case 'attendance':
          return <StudentAttendance />;
        case 'forum':
          return <StudentForum />;
        default:
          return <StudentDashboard />;
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased">
      {/* Sidebar Navigation */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Workspace Frame */}
      <div className="lg:pl-72 flex flex-col flex-1 min-w-0 transition-all duration-300">
        <TopBar onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {renderActiveView()}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <LmsProvider>
      <MainContent />
    </LmsProvider>
  );
}
