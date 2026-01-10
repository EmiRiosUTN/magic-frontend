import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { api } from '../../services/api';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';

interface AgentData {
  id: string;
  name: string;
  description: string;
  aiProvider: string;
  modelName: string;
  hasTools: boolean;
  category?: {
    id: string;
    name: string;
  };
}

interface CategoryData {
  id: string;
  name: string;
}

export const AgentManagement: React.FC = () => {
  const [agents, setAgents] = useState<AgentData[]>([]);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAgent, setEditingAgent] = useState<AgentData | null>(null);
  const [formData, setFormData] = useState({
    categoryId: '',
    nameEs: '',
    nameEn: '',
    descriptionEs: '',
    descriptionEn: '',
    systemPrompt: '',
    aiProvider: 'OPENAI',
    modelName: 'gpt-4o-mini',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [agentsResponse, categoriesResponse]: any[] = await Promise.all([
        api.getAgents(),
        api.getCategories(),
      ]);
      setAgents(agentsResponse.agents || []);
      setCategories(categoriesResponse.categories || []);
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (editingAgent) {
        await api.updateAgent(editingAgent.id, formData);
      } else {
        await api.createAgent(formData);
      }
      setShowModal(false);
      setEditingAgent(null);
      setFormData({
        categoryId: '',
        nameEs: '',
        nameEn: '',
        descriptionEs: '',
        descriptionEn: '',
        systemPrompt: '',
        aiProvider: 'OPENAI',
        modelName: 'gpt-4o-mini',
      });
      loadData();
    } catch (err: any) {
      setError(err.message || 'Error al guardar agente');
    }
  };

  const handleEdit = (agent: AgentData) => {
    setEditingAgent(agent);
    setFormData({
      categoryId: agent.category?.id || '',
      nameEs: agent.name,
      nameEn: agent.name,
      descriptionEs: agent.description,
      descriptionEn: agent.description,
      systemPrompt: '',
      aiProvider: agent.aiProvider,
      modelName: agent.modelName,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este agente?')) return;

    try {
      await api.deleteAgent(id);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Error al eliminar agente');
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Cargando agentes...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Gestión de Agentes</h2>
        <Button
          onClick={() => {
            setEditingAgent(null);
            setFormData({
              categoryId: '',
              nameEs: '',
              nameEn: '',
              descriptionEs: '',
              descriptionEn: '',
              systemPrompt: '',
              aiProvider: 'OPENAI',
              modelName: 'gpt-4o-mini',
            });
            setShowModal(true);
          }}
          className="bg-slate-900 hover:bg-slate-800 text-white flex items-center gap-2"
        >
          <Plus size={18} />
          Nuevo Agente
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Agente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Categoría
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Proveedor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Modelo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {agents.map((agent) => (
              <tr key={agent.id} className="hover:bg-slate-50">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-slate-900">{agent.name}</div>
                  <div className="text-sm text-slate-600 truncate max-w-xs">{agent.description}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-slate-900">{agent.category?.name || 'Sin categoría'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      agent.aiProvider === 'OPENAI'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {agent.aiProvider}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                  {agent.modelName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(agent)}
                      className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(agent.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingAgent(null);
        }}
        title={editingAgent ? 'Editar Agente' : 'Nuevo Agente'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Categoría</label>
            <select
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
              required
            >
              <option value="">Selecciona una categoría</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Nombre (Español)</label>
            <Input
              value={formData.nameEs}
              onChange={(e) => setFormData({ ...formData, nameEs: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Nombre (Inglés)</label>
            <Input
              value={formData.nameEn}
              onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Descripción (Español)</label>
            <textarea
              value={formData.descriptionEs}
              onChange={(e) => setFormData({ ...formData, descriptionEs: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
              rows={2}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Descripción (Inglés)</label>
            <textarea
              value={formData.descriptionEn}
              onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
              rows={2}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">System Prompt</label>
            <textarea
              value={formData.systemPrompt}
              onChange={(e) => setFormData({ ...formData, systemPrompt: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
              rows={4}
              placeholder="Eres un asistente experto en..."
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Proveedor</label>
              <select
                value={formData.aiProvider}
                onChange={(e) => setFormData({ ...formData, aiProvider: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
              >
                <option value="OPENAI">OpenAI</option>
                <option value="GEMINI">Gemini</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Modelo</label>
              <Input
                value={formData.modelName}
                onChange={(e) => setFormData({ ...formData, modelName: e.target.value })}
                placeholder="gpt-4o-mini"
                required
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              onClick={() => {
                setShowModal(false);
                setEditingAgent(null);
              }}
              className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700"
            >
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 bg-slate-900 hover:bg-slate-800 text-white">
              {editingAgent ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
