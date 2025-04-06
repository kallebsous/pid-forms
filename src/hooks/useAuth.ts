import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
      setIsLoading(false);
      if (event === 'SIGNED_IN') {
        // Armazena o timestamp do login
        setSessionStartTime(Date.now());
      } else if (event === 'SIGNED_OUT') {
        setSessionStartTime(null);
      }
    });

    // Verifica a sessão existente ao carregar
    checkSession();

    return () => subscription.unsubscribe();
  }, []);

  const checkSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      setIsAuthenticated(true);
      if (!sessionStartTime) {
        setSessionStartTime(Date.now()); // Define o início se ainda não estiver definido
      }
    }
    setIsLoading(false);
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data.user;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setIsAuthenticated(false);
    setSessionStartTime(null);
  };

  // Verifica a expiração da sessão a cada minuto
  useEffect(() => {
    if (!isAuthenticated || !sessionStartTime) return;

    const checkExpiration = () => {
      const currentTime = Date.now();
      const timeElapsed = (currentTime - sessionStartTime) / 1000; // Em segundos
      const sessionDuration = 3600; // 1 hora em segundos

      if (timeElapsed >= sessionDuration) {
        signOut();
        alert('Sua sessão expirou. Por favor, faça login novamente.');
      }
    };

    const interval = setInterval(checkExpiration, 60000); // Verifica a cada 1 minuto
    return () => clearInterval(interval); // Limpa o intervalo ao desmontar
  }, [isAuthenticated, sessionStartTime]);

  return {
    isAuthenticated,
    isLoading,
    signIn,
    signOut,
  };
}