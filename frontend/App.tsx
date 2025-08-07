import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import DashboardLayout from './components/layout/DashboardLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import LawyerDashboard from './pages/lawyer/LawyerDashboard';
import UserDashboard from './pages/user/UserDashboard';
import DocumentAutomation from './pages/DocumentAutomation';
import ECourtIntegration from './pages/ECourtIntegration';
import ArgumentGenius from './pages/ArgumentGenius';
import WinPredictor from './pages/WinPredictor';
import ProductivityTools from './pages/ProductivityTools';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        // Don't retry on authentication errors
        if (error?.message?.includes('authentication') || error?.message?.includes('unauthorized')) {
          return false;
        }
        return failureCount < 3;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

function AppRoutes() {
  const { user } = useAuth();
  
  return (
    <Router>
      <Routes>
        <Route path="/login" element={
          user ? <Navigate to={`/${user.role}`} replace /> : <LoginPage />
        } />
        
        <Route path="/" element={
          <ProtectedRoute>
            <DashboardLayout>
              <Routes>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/lawyer" element={<LawyerDashboard />} />
                <Route path="/user" element={<UserDashboard />} />
                <Route path="/documents" element={<DocumentAutomation />} />
                <Route path="/ecourt" element={<ECourtIntegration />} />
                <Route path="/arguments" element={<ArgumentGenius />} />
                <Route path="/predictor" element={<WinPredictor />} />
                <Route path="/tools" element={<ProductivityTools />} />
                <Route path="/" element={
                  <Navigate to={`/${user?.role || 'user'}`} replace />
                } />
              </Routes>
            </DashboardLayout>
          </ProtectedRoute>
        } />
        
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <AppRoutes />
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  );
}
