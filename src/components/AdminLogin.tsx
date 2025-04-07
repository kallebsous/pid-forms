import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import {motion} from "framer-motion";

export function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('Iniciando login com:', { email, password });
      await signIn(email, password);
      console.log('Login concluído');

      // Verificar o usuário autenticado
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error('Falha ao obter usuário autenticado');
/*
      console.log('Usuário autenticado:', { id: user.id, email: user.email });
*/

      // Verificar se é admin na tabela admins
      const { data: adminData, error: adminError } = await supabase
          .from('admins')
          .select('id')
          .eq('id', user.id)
          .single();

      console.log('Resultado da consulta a admins:', { adminData, adminError });

      if (adminError || !adminData) {
        throw new Error('Acesso negado: você não é administrador.');
      }
      console.log('Usuário é admin (verificado na tabela admins):', user.email);

      toast.success('Login realizado com sucesso!');
      console.log('Redirecionando para /admin');
      navigate('/admin');
    } catch (error) {
      console.error('Erro durante o login:', error);
      toast.error('Erro ao fazer login. Verifique suas credenciais ou permissões.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-black dark:text-white">
              Acesso Administrativo
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email
                </label>
                <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="appearance-none mt-1 relative block w-full border border-gray-700 placeholder-gray-500 text-black dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm bg-gray-300 dark:bg-blue-300 px-3 py-2 rounded-full shadow-sm"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Senha
                </label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="appearance-none mt-1 relative block w-full border border-gray-700 placeholder-gray-500 text-black focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm bg-gray-300 dark:bg-blue-300 px-3 py-2 rounded-full shadow-sm"
                    placeholder="Senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <Lock className="h-5 w-5 text-blue-500 group-hover:text-blue-400" />
              </span>
                {isLoading ? 'Entrando...' : 'Entrar'}
              </button>

            </div>
          </form>
          <motion.button
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/')}
              className="w-full flex justify-center items-center gap-2 py-2 px-4 border border-transparent rounded-lg shadow-md text-sm font-medium text-black dark:text-white bg-gradient-to-bl hover:bg-rose-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
          >
            Voltar
          </motion.button>
        </div>
      </div>
  );
}