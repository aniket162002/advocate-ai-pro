import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ClerkProvider, SignedIn, SignedOut } from '@clerk/clerk-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { clerkPublishableKey } from './config';
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

const queryClient = new QueryClient();

function AppInner() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={
          <SignedIn>
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
                <Route path="/" element={<Navigate to="/lawyer" replace />} />
              </Routes>
            </DashboardLayout>
          </SignedIn>
        } />
        <Route path="*" element={
          <SignedOut>
            <Navigate to="/login" replace />
          </SignedOut>
        } />
      </Routes>
    </Router>
  );
}

export default function App() {
  if (!clerkPublishableKey) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Configuration Error</h1>
          <p className="text-gray-600">
            Please set your Clerk publishable key in the config.ts file.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ClerkProvider publishableKey={clerkPublishableKey}>
      <QueryClientProvider client={queryClient}>
        <AppInner />
        <Toaster />
      </QueryClientProvider>
    </ClerkProvider>
  );
}
