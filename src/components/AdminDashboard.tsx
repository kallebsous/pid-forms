import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, RefreshCw, Copy, Pencil, Trash } from 'lucide-react';
import toast, {Toaster} from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { ThemeToggle } from './ThemeToggle.tsx';


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
  const [editing, setEditing] = useState<Registration | null>(null);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');

  const handleEdit = (registration: Registration) => {
    setEditing(registration);
    setEditName(registration.nome);
    setEditPhone(registration.telefone);
  };

  const handleUpdate = async () => {
    if (!editing) return;
    try {
      const { error } = await supabase
          .from('inscricoes')
          .update({ nome: editName, telefone: editPhone })
          .eq('id', editing.id);

      if (error) throw error;

      toast.success('Registro atualizado com sucesso!');
      setEditing(null);
      fetchRegistrations();
    } catch (error) {
      toast.error('Erro ao atualizar registro');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja remover este registro?')) return;
    try {
      const { error } = await supabase.from('inscricoes').delete().eq('id', id);
      if (error) throw error;
      toast.success('Registro removido com sucesso!');
      fetchRegistrations();
    } catch (error) {
      toast.error('Erro ao remover registro');
    }
  };

  return (

        <div className="min-h-screen bg-gray-100 neon-border dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
          <Toaster position="top-right" />
          <div className="flex justify-end mb-4">
            <ThemeToggle />
          </div>
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-black dark:text-gray-100">Painel Administrativo</h1>
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

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-300">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Nome
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Telefone
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Data de Inscrição
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
                </thead>
                <tbody className="bg-gray-700 divide-y divide-gray-700">
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

                          <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                            <button onClick={() => copyToClipboard(`${registration.nome} - ${registration.telefone}`)} className="text-blue-400 hover:text-blue-300" title="Copiar">
                              <Copy className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleEdit(registration)} className="text-yellow-400 hover:text-yellow-300" title="Editar">
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDelete(registration.id)} className="text-red-400 hover:text-red-300" title="Remover">
                              <Trash className="w-4 h-4" />
                            </button>
                          </td>


                        </tr>
                    ))
                )}
                </tbody>

              </table>
              {editing && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md space-y-4">
                      <h2 className="text-lg font-bold">Editar Registro</h2>
                      <input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-700"
                          placeholder="Nome"
                      />
                      <input
                          value={editPhone}
                          onChange={(e) => setEditPhone(e.target.value)}
                          className="w-full px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-700"
                          placeholder="Telefone"
                      />
                      <div className="flex justify-end gap-2">
                        <button onClick={() => setEditing(null)} className="px-4 py-2 bg-gray-400 rounded hover:bg-gray-500 text-white">Cancelar</button>
                        <button onClick={handleUpdate} className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 text-white">Salvar</button>
                      </div>
                    </div>
                  </div>
              )}

            </div>
          </div>
        </div>
      </div>
  );
}