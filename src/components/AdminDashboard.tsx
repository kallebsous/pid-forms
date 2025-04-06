import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, RefreshCw, Copy } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

interface Registration {
  id: string;
  nome: string;
  telefone: string;
  created_at: string;
}

export function AdminDashboard() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const fetchRegistrations = async () => {
    try {
      setIsRefreshing(true);
      const { data, error } = await supabase
          .from('inscricoes')
          .select('*')
          .order('nome', { ascending: true }); // Ordena por nome em ordem alfabética

      if (error) throw error;
      setRegistrations(data || []);
      toast.success('Dados atualizados com sucesso!');
    } catch (error) {
      console.error('Error fetching registrations:', error);
      toast.error('Erro ao carregar inscrições');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('Logout realizado com sucesso!');
      navigate('/admin/login');
    } catch (error) {
      toast.error('Erro ao fazer logout');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
        .then(() => toast.success('Copiado para a área de transferência!'))
        .catch(() => toast.error('Erro ao copiar'));
  };

  return (
      <div className="min-h-screen bg-gray-900 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-100">Painel Administrativo</h1>
            <div className="flex gap-4">
              <button
                  onClick={fetchRegistrations}
                  disabled={isRefreshing}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Atualizando...' : 'Atualizar'}
              </button>
              <button
                  onClick={handleLogout}
                  className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </button>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Nome
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Telefone
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Data de Inscrição
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                {isLoading ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-4 text-center text-gray-400">
                        Carregando...
                      </td>
                    </tr>
                ) : registrations.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-4 text-center text-gray-400">
                        Nenhuma inscrição encontrada
                      </td>
                    </tr>
                ) : (
                    registrations.map((registration) => (
                        <tr key={registration.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-200">
                            {registration.nome}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-200">
                            {registration.telefone}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-200">
                            {formatDate(registration.created_at)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                                onClick={() => copyToClipboard(`${registration.nome} - ${registration.telefone}`)}
                                className="text-blue-400 hover:text-blue-300"
                                title="Copiar nome e telefone"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                    ))
                )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
  );
}