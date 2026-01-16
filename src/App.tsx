import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DashboardLayout } from './components/layout/DashboardLayout';

// Pages
import HomePage from './app/page';
import LoginPage from './app/login/page';
import LandingPage from './app/landing/page';
import AdminPage from './app/admin/page';
import TasksPage from './app/tasks/page';
import BoardPage from './app/board/page';
import AgentsPage from './app/agents/page';
import ChatPage from './app/chat/page';

// Public Route Wrapper
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  if (isAuthenticated) return <Navigate to="/" replace />;

  return <>{children}</>;
};

// Protected Route Wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return <>{children}</>;
};

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/landing"
        element={
          <PublicRoute>
            <LandingPage />
          </PublicRoute>
        }
      />

      <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/tasks" element={<TasksPage />} />
        <Route path="/board/:projectId" element={<BoardPage />} />
        <Route path="/agents/:categoryId" element={<AgentsPage />} />
        <Route path="/chat/:agentId" element={<ChatPage />} />
      </Route>

      <Route path="/" element={<HomePage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
