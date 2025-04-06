import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { RegistrationForm } from './components/RegistrationForm';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';
import { useAuth } from './hooks/useAuth';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center">Carregando...</div>;
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/admin/login" />;
}

function App() {
  return (
      <div className="min-h-screen bg-gray-900 text-gray-100">
        <Toaster position="top-right" />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={
              <div className="max-w-md mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-8">
                  <img
                      src="/logo-pid.png"
                      alt="PID Logo"
                      className="h-16 mx-auto mb-4"
                  />
                  <h1 className="text-3xl font-bold text-gray-100 mb-2">
                    Programa de Inclusão Digital
                  </h1>
                  <p className="text-gray-400">
                    Preencha o formulário abaixo para se inscrever no programa
                  </p>
                </div>

                <div className="bg-gray-800 py-8 px-6 shadow rounded-lg sm:px-10">
                  <RegistrationForm />
                </div>
              </div>
            } />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } />
          </Routes>
        </BrowserRouter>
      </div>
  );
}

export default App;