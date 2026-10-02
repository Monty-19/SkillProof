import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ChallengesPage } from './pages/ChallengesPage';
import { ChallengeDetailPage } from './pages/ChallengeDetailPage';
import { ChallengeWorkspacePage } from './pages/ChallengeWorkspacePage';
import { SubmissionDetailPage } from './pages/SubmissionDetailPage';
import { PublicPassportPage } from './pages/PublicPassportPage';
import { StudentDashboardPage } from './pages/StudentDashboardPage';
import { MySkillsPage } from './pages/MySkillsPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { BadgesPage } from './pages/BadgesPage';
import { ProfilePage } from './pages/ProfilePage';
import { RecruiterDashboardPage } from './pages/RecruiterDashboardPage';
import { RecruiterCandidatesPage } from './pages/RecruiterCandidatesPage';
import { RecruiterCandidateDetailPage } from './pages/RecruiterCandidateDetailPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AdminChallengesPage } from './pages/AdminChallengesPage';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles?: string[] }> = ({
  children,
  allowedRoles,
}) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export const AppContent: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#0b0f17] text-slate-100 antialiased selection:bg-emerald-500 selection:text-slate-950">
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/challenges" element={<ChallengesPage />} />
          <Route path="/challenges/:id" element={<ChallengeDetailPage />} />
          <Route path="/challenges/:id/work" element={<ChallengeWorkspacePage />} />
          <Route path="/submissions/:id" element={<SubmissionDetailPage />} />
          <Route path="/passport/:username" element={<PublicPassportPage />} />

          {/* Student Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={['STUDENT', 'ADMIN']}>
                <StudentDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-skills"
            element={
              <ProtectedRoute allowedRoles={['STUDENT', 'ADMIN']}>
                <MySkillsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-challenges"
            element={
              <ProtectedRoute allowedRoles={['STUDENT', 'ADMIN']}>
                <ChallengesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects"
            element={
              <ProtectedRoute allowedRoles={['STUDENT', 'ADMIN']}>
                <ProjectsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/badges"
            element={
              <ProtectedRoute allowedRoles={['STUDENT', 'ADMIN']}>
                <BadgesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Recruiter Routes */}
          <Route path="/recruiter/candidates" element={<RecruiterCandidatesPage />} />
          <Route path="/recruiter/candidates/:id" element={<RecruiterCandidateDetailPage />} />
          <Route
            path="/recruiter/dashboard"
            element={
              <ProtectedRoute allowedRoles={['RECRUITER', 'ADMIN']}>
                <RecruiterDashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/challenges"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminChallengesPage />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </HashRouter>
  );
}
