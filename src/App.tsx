import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginPage } from './components/auth/LoginPage';
import { AdminPanel } from './components/admin/AdminPanel';
import { ChatWindow } from './components/chat/ChatWindow';
import { ConversationSidebar } from './components/chat/ConversationSidebar';
import { CategorySelection } from './components/landing/CategorySelection';
import { AgentSelection } from './components/landing/AgentSelection';
import { LandingPage } from './components/landing/LandingPage';
import { ConfirmationModal } from './components/ui/ConfirmationModal';
import { ProjectsView } from './components/tasks/ProjectsView';
import { BoardView } from './components/tasks/BoardView';
import { Category, Agent, Conversation, Message, CreateConversationResponse } from './types';
import { api } from './services/api';
import { Navbar } from './components/layout/Navbar';
import { ArrowLeft, LogOut } from 'lucide-react';
import { IconButton } from './components/ui/IconButton';
import { getCategoryConfig } from './config/categoryConfig';
import { Settings, ArrowLeft, LogOut, Shield, ListTodo } from 'lucide-react';
import { SettingsModal } from './components/settings/SettingsModal';

type ViewState = 'categories' | 'agents' | 'chat' | 'admin' | 'tasks' | 'board';

// ... (existing code)



function AppContent() {
  const { user, isLoading: authLoading, logout, isAuthenticated } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [viewState, setViewState] = useState<ViewState>('categories');
  const [categories, setCategories] = useState<Category[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState<{
    isOpen: boolean;
    conversationToDelete?: { title: string; messageCount: number };
    onConfirm: () => void;
  }>({
    isOpen: false,
    onConfirm: () => { },
  });

  useEffect(() => {
    if (isAuthenticated) {
      loadCategories();
    }
  }, [isAuthenticated]);

  const loadCategories = async () => {
    try {
      const response: any = await api.getCategories();
      const categoriesData = (response.categories || []).map((cat: any) => ({
        ...cat,
        color: getCategoryConfig(cat.name).color,
      }));
      setCategories(categoriesData);
    } catch (err) {
      console.error('Error loading categories:', err);
    }
  };

  const handleSelectCategory = async (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setIsLoading(true);
    try {
      const response: any = await api.getAgentsByCategory(categoryId);
      setAgents(response.agents || []);
      setViewState('agents');
    } catch (err) {
      console.error('Error loading agents:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToCategories = () => {
    setSelectedCategoryId(null);
    setViewState('categories');
  };

  const handleBackToAgents = () => {
    setSelectedAgentId(null);
    setCurrentConversation(null);
    setConversations([]);
    setMessages([]);
    setViewState('agents');
  };

  const loadConversations = async (agentId: string) => {
    try {
      const conversationsResponse: any = await api.getConversations(agentId);
      const loadedConversations = conversationsResponse.conversations || [];
      setConversations(loadedConversations);
      return loadedConversations;
    } catch (err) {
      console.error('Error loading conversations:', err);
      return [];
    }
  };

  const handleSelectAgent = async (agentId: string) => {
    setSelectedAgentId(agentId);
    setIsLoading(true);

    try {
      const loadedConversations = await loadConversations(agentId);

      if (loadedConversations.length > 0) {
        const latest = loadedConversations[0];
        setCurrentConversation(latest);
        const messagesResponse: any = await api.getMessages(latest.id);
        setMessages(messagesResponse.messages || []);
      } else {
        await handleNewConversation(agentId);
      }

      setViewState('chat');
    } catch (err) {
      console.error('Error selecting agent:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const generateConversationTitle = () => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    const dateStr = now.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
    return `Conversación ${dateStr} - ${timeStr}`;
  };

  const handleNewConversation = async (agentId?: string) => {
    const targetAgentId = agentId || selectedAgentId;
    if (!targetAgentId) return;

    const agent = agents.find((a) => a.id === targetAgentId);
    if (!agent) return;

    setIsLoading(true);

    try {
      const newConvResponse: CreateConversationResponse = await api.createConversation({
        agentId: targetAgentId,
        title: generateConversationTitle(),
      }) as any;

      if (newConvResponse.requiresConfirmation && newConvResponse.oldestConversation) {
        setConfirmationModal({
          isOpen: true,
          conversationToDelete: {
            title: newConvResponse.oldestConversation.title,
            messageCount: 0,
          },
          onConfirm: async () => {
            try {
              const confirmedResponse: any = await api.createConversation({
                agentId: targetAgentId,
                title: generateConversationTitle(),
                confirmDelete: true,
              });

              if (confirmedResponse.id) {
                const updatedConversations = await loadConversations(targetAgentId);
                const newConv = updatedConversations.find((c) => c.id === confirmedResponse.id);
                if (newConv) {
                  setCurrentConversation(newConv);
                  setMessages([]);
                }
              }
            } catch (err) {
              console.error('Error creating conversation with confirmation:', err);
            }
          },
        });
      } else if (newConvResponse.id) {
        const updatedConversations = await loadConversations(targetAgentId);
        const newConv = updatedConversations.find((c) => c.id === newConvResponse.id);
        if (newConv) {
          setCurrentConversation(newConv);
          setMessages([]);
        }
      }
    } catch (err) {
      console.error('Error creating conversation:', err);
      alert(err instanceof Error ? err.message : 'Error al crear conversación');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectConversation = async (conversationId: string) => {
    const conversation = conversations.find((c) => c.id === conversationId);
    if (!conversation) return;

    setIsLoading(true);
    setCurrentConversation(conversation);

    try {
      const messagesResponse: any = await api.getMessages(conversationId);
      setMessages(messagesResponse.messages || []);
    } catch (err) {
      console.error('Error loading messages:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteConversation = async (conversationId: string) => {
    if (!selectedAgentId) return;

    try {
      await api.deleteConversation(conversationId);
      const updatedConversations = await loadConversations(selectedAgentId);

      if (currentConversation?.id === conversationId) {
        if (updatedConversations.length > 0) {
          await handleSelectConversation(updatedConversations[0].id);
        } else {
          await handleNewConversation();
        }
      }
    } catch (err) {
      console.error('Error deleting conversation:', err);
    }
  };

  const generateTitleFromMessage = (message: string): string => {
    const cleanMessage = message.trim();
    if (cleanMessage.length <= 40) {
      return cleanMessage;
    }
    return cleanMessage.substring(0, 40) + '...';
  };

  const handleSendMessage = async (message: string) => {
    if (!currentConversation || !selectedAgentId) return;

    const isFirstMessage = messages.length === 0;
    setIsLoading(true);

    try {
      const response: any = await api.sendMessage(currentConversation.id, message);
      setMessages((prev) => [...prev, response.userMessage, response.assistantMessage]);

      if (isFirstMessage) {
        const newTitle = generateTitleFromMessage(message);
        try {
          await api.updateConversationTitle(currentConversation.id, newTitle);
          await loadConversations(selectedAgentId);
          setCurrentConversation((prev) => prev ? { ...prev, title: newTitle } : null);
        } catch (err) {
          console.error('Error updating conversation title:', err);
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert(error instanceof Error ? error.message : 'Error al enviar mensaje');
    } finally {
      setIsLoading(false);
    }
  };

  const selectedAgent = agents.find((a) => a.id === selectedAgentId);
  const selectedCategory = categories.find((c) => c.id === selectedCategoryId);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center page-bg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto mb-4"></div>
          <p className="text-slate-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    if (showLogin) {
      return <LoginPage />;
    }
    return <LandingPage onEnter={() => setShowLogin(true)} />;
  }

  if (viewState === 'admin') {
    return (
      <div className="min-h-screen bg-slate-50 pt-16">
        <Navbar
          userRole={user?.role}
          onLogout={logout}
          onAdminClick={() => setViewState('admin')}
          onLogoClick={handleBackToCategories}
        />
        <AdminPanel onBack={() => setViewState('categories')} />
      </div>
    );
  }

  if (viewState === 'categories') {
    return (
      <div className="min-h-screen bg-slate-50 pt-16">
        <Navbar
          userRole={user?.role}
          onLogout={logout}
          onAdminClick={() => setViewState('admin')}
        />
        <CategorySelection categories={categories} onSelectCategory={handleSelectCategory} />
      </div>
      <>
        <div className="fixed top-4 right-4 z-50 flex gap-2">
          <IconButton
            icon={<ListTodo size={20} />}
            onClick={() => setViewState('tasks')}
            label="Tareas"
            className="bg-white shadow-lg hover:bg-slate-100"
          />
          {user?.role === 'ADMIN' && (
            <IconButton
              icon={<Shield size={20} />}
              onClick={() => setViewState('admin')}
              label="Admin"
              className="bg-white shadow-lg hover:bg-slate-100"
            />
          )}
          <IconButton
            icon={<Settings size={20} />}
            onClick={() => setShowSettings(true)}
            label="Configuración"
            className="bg-white shadow-lg hover:bg-slate-100"
          />
          <IconButton
            icon={<LogOut size={20} />}
            onClick={logout}
            label="Salir"
            className="bg-white shadow-lg hover:bg-slate-100"
          />
        </div>
        <CategorySelection categories={categories} onSelectCategory={handleSelectCategory} />
        <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
      </>
    );
  }

  if (viewState === 'agents' && selectedCategory) {
    return (
      <div className="min-h-screen bg-slate-50 pt-16">
        <Navbar
          userRole={user?.role}
          onLogout={logout}
          onAdminClick={() => setViewState('admin')}
          onLogoClick={handleBackToCategories}
        />
        <AgentSelection
          category={selectedCategory}
          agents={agents}
          onSelectAgent={handleSelectAgent}
          onBack={handleBackToCategories}
        />
      </div>
    );
  }

  if (viewState === 'chat' && selectedAgent && currentConversation) {
    const chatData = {
      id: currentConversation.id,
      agentId: selectedAgent.id,
      messages: messages.map((msg) => ({
        id: msg.id,
        role: msg.role.toLowerCase() as 'user' | 'assistant',
        content: msg.content,
        timestamp: new Date(msg.createdAt).getTime(),
      })),
      createdAt: new Date(currentConversation.createdAt).getTime(),
      updatedAt: new Date(currentConversation.lastMessageAt).getTime(),
    };

    const agentData = {
      ...selectedAgent,
      icon: selectedAgent.icon || 'Bot',
      model: selectedAgent.aiProvider === 'OPENAI' ? ('openai' as const) : ('gemini' as const),
      categoryId: selectedAgent.category?.id || '',
    };

    return (
      <>
        <Navbar
          userRole={user?.role}
          onLogout={logout}
          onAdminClick={() => setViewState('admin')}
        />

        {/* Fixed Sidebar Wrapper */}
        <div className="fixed top-16 left-0 bottom-0 w-80 border-r border-slate-200 bg-white z-40">
          <ConversationSidebar
            conversations={conversations}
            currentConversationId={currentConversation.id}
            agentName={selectedAgent.name}
            onSelectConversation={handleSelectConversation}
            onNewConversation={() => handleNewConversation()}
            onDeleteConversation={handleDeleteConversation}
            maxConversations={user?.subscriptionType.maxConversationsPerAgent || 5}
          />
        </div>

        {/* Fixed Main Content Wrapper */}
        <div className="fixed top-16 left-80 right-0 bottom-0 bg-slate-50 flex flex-col z-0">
          <div className="flex items-center gap-3 px-6 py-4 bg-white border-b border-slate-200 flex-none">
            <IconButton icon={<ArrowLeft size={20} />} onClick={handleBackToAgents} label="Atrás" />
            <div className="flex-1">
              <h2 className="font-semibold text-slate-900">{selectedAgent.name}</h2>
              <p className="text-sm text-slate-600">{selectedAgent.description}</p>
            </div>
          </div>
          <ChatWindow agent={agentData} chat={chatData} onSendMessage={handleSendMessage} isLoading={isLoading} />
        </div>

        <ConfirmationModal
          isOpen={confirmationModal.isOpen}
          onClose={() => setConfirmationModal({ ...confirmationModal, isOpen: false })}
          onConfirm={confirmationModal.onConfirm}
          title="Límite de conversaciones alcanzado"
          message={`Has alcanzado el límite de ${user?.subscriptionType.maxConversationsPerAgent || 5} conversaciones para este agente. Para crear una nueva conversación, se eliminará automáticamente la conversación más antigua.`}
          confirmText="Crear nueva conversación"
          cancelText="Cancelar"
          type="warning"
        />
      </>
    );
  }

  if (viewState === 'tasks') {
    return (
      <>
        <div className="fixed top-4 right-4 z-50 flex gap-2">
          <IconButton
            icon={<ArrowLeft size={20} />}
            onClick={() => setViewState('categories')}
            label="Volver"
            className="bg-white shadow-lg hover:bg-slate-100"
          />
          <IconButton
            icon={<LogOut size={20} />}
            onClick={logout}
            label="Salir"
            className="bg-white shadow-lg hover:bg-slate-100"
          />
        </div>
        <ProjectsView
          onSelectProject={(projectId) => {
            setSelectedProjectId(projectId);
            setViewState('board');
          }}
        />
      </>
    );
  }

  if (viewState === 'board' && selectedProjectId) {
    return (
      <BoardView
        projectId={selectedProjectId}
        onBack={() => {
          setSelectedProjectId(null);
          setViewState('tasks');
        }}
      />
    );
  }

  return null;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
