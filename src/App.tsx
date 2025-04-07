import React from 'react';
import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { RegistrationForm } from './components/RegistrationForm';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';
import { useAuth } from './hooks/useAuth';
import { motion } from 'framer-motion';
import { GrupoPage } from './components/GrupoPage';
import { LoadingScreen } from './components/TelaCarregando';
import { ThemeToggle } from './components/ThemeToggle';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center">
          Carregando...
        </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/admin/login" />;
}

function ProtectedGroupRoute({ children }: { children: React.ReactNode }) {
  const [isInscrito, setIsInscrito] = useState<boolean | null>(null); // null = carregando

  useEffect(() => {
    const checkInscricao = () => {
      const inscrito = localStorage.getItem('inscrito') === 'true';
      setTimeout(() => {
        setIsInscrito(inscrito);
      }, 1000); // simula delay
    };

    checkInscricao();
  }, []);

  if (isInscrito === null) {
    return <LoadingScreen />;
  }

  return isInscrito ? <>{children}</> : <Navigate to="/" />;
}


function App() {
  return (
      <div className="min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white transition-colors">
        <Toaster position="top-right" />
        <BrowserRouter>
          <div className="flex items-center justify-center min-h-screen px-4">
            <Routes>
              <Route
                  path="/"
                  element={
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="w-full h-auto max-w-md bg-gray-100 dark:bg-gray-800
                             py-10 px-6 sm:px-10 rounded-2xl shadow-2xl
                             neon-border dark:border-gray-700 transition-all"
                    >
                      <div className="flex justify-end mb-4">
                        <ThemeToggle />
                      </div>

                      <div className="text-center mb-8">
                        <motion.img
                            src="/logo-pid.png"
                            alt="PID Logo"
                            className="w-40 mx-auto mb-4"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                        />
                        <h1 className="text-3xl font-extrabold mb-2 drop-shadow-md">
                          Programa de Inclusão Digital
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                          Preencha o formulário abaixo para se inscrever no programa
                        </p>
                      </div>

                      <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.5, duration: 0.4 }}
                      >
                        <RegistrationForm />
                      </motion.div>
                    </motion.div>
                  }
              />
              <Route path="/grupo" element={
                <ProtectedGroupRoute>
                  <GrupoPage />
                </ProtectedGroupRoute>
              } />

              <Route path="/admin/login" element={<AdminLogin />} />
              <Route
                  path="/admin"
                  element={
                    <ProtectedRoute>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
              />
            </Routes>
          </div>
        </BrowserRouter>
      </div>
  );
}

export default App;
