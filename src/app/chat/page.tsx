import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useChat } from '../../hooks/useChat';
import { api } from '../../services/api';
import { Agent } from '../../types';
import { ChatWindow } from '../../components/chat/ChatWindow';
import { ConversationSidebar } from '../../components/chat/ConversationSidebar';
import { ConfirmationModal } from '../../components/ui/ConfirmationModal';
import { IconButton } from '../../components/ui/IconButton';
import { Button } from '../../components/ui/Button';
import { Loader } from '../../components/ui/Loader';
import { ArrowLeft, MessageSquare } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function ChatPage() {
    const { agentId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [agent, setAgent] = useState<Agent | null>(null);

    // Hooks cannot be conditional, so we call it always, but handle null agentId inside if needed
    const chat = useChat(agentId || '');

    useEffect(() => {
        const loadAgent = async () => {
            if (!agentId) return;
            // We need a way to get a single agent. 
            // Since we don't have a direct getAgent endpoint shown in types (only getAgentsByCategory), 
            // we might have to fetch categories or rely on previous state. 
            // Ideally backend should support getAgentById.
            // WORKAROUND: Fetch all categories -> first category -> find agent? No, too expensive.
            // Let's assume we can fetch it or pass it. 
            // For now, existing App.tsx logic fetched agents by category first. 
            // Let's try to fetch all agents or finding the agent from the category if we knew it.
            // Since we don't know the category here easily, we might need to modify the API or navigation state.
            // Actually, we can fetch all categories -> all agents is slow.
            // Let's implement a quick fetch if getAgent exists, else we rely on global context?
            // Wait, standard practice: get /agents/:id.

            // Assuming we don't have getAgentById, we will iterate categories to find it (inefficient but safe for now)
            // or better, just render "Loading" until we find it.
            try {
                const catsResponse: any = await api.getCategories();
                // This is bad N+1 but necessary without new endpoint
                for (const cat of catsResponse.categories || []) {
                    const agentsResp: any = await api.getAgentsByCategory(cat.id);
                    const found = (agentsResp.agents || []).find((a: Agent) => a.id === agentId);
                    if (found) {
                        setAgent({ ...found, categoryId: cat.id });
                        break;
                    }
                }
            } catch (err) {
                console.error(err);
            }
        };
        loadAgent();
    }, [agentId]);

    const [initializing, setInitializing] = useState(true);

    useEffect(() => {
        if (agentId) {
            setInitializing(true);
            chat.loadConversations(agentId).then(async (convs) => {
                if (convs.length > 0) {
                    await chat.handleSelectConversation(convs[0].id);
                } else {
                    await chat.handleNewConversation();
                }
                setInitializing(false);
            });
        }
    }, [agentId]);




    if (!agent || !agentId) return <div className="flex h-screen items-center justify-center bg-grafite"><Loader text="Cargando agente..." size="lg" /></div>;

    return (
        <div className="flex h-[calc(100vh-64px)]">
            {/* Sidebar - Fixed width */}
            <div className="w-80 border-r border-smoke bg-grafite h-full">
                <ConversationSidebar
                    conversations={chat.conversations}
                    currentConversationId={chat.currentConversation?.id || ''}
                    agentName={agent.name}
                    onSelectConversation={chat.handleSelectConversation}
                    onNewConversation={chat.handleNewConversation}
                    onDeleteConversation={chat.handleDeleteConversation}
                    maxConversations={user?.subscriptionType.maxConversationsPerAgent || 5}
                />
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col bg-grafite min-w-0">
                {/* Header */}
                <div className="flex items-center gap-3 px-6 py-4 bg-smoke border-b border-haze/30 flex-none">
                    <IconButton
                        icon={<ArrowLeft size={20} />}
                        onClick={() => navigate(`/agents/${agent.categoryId || agent.category?.id}`)}
                        label="Atrás"
                    />
                    <div className="flex-1">
                        <h2 className="font-semibold text-oyster">{agent.name}</h2>
                        <p className="text-sm text-nevada">{agent.description}</p>
                    </div>
                </div>

                {chat.currentConversation ? (
                    <ChatWindow
                        agent={{
                            ...agent,
                            icon: agent.icon || 'Bot',
                            model: agent.aiProvider === 'OPENAI' ? ('openai' as const) : ('gemini' as const),
                            categoryId: agent.category?.id || '',
                        }}
                        chat={{
                            id: chat.currentConversation.id,
                            agentId: agent.id,
                            messages: chat.messages.map((msg) => ({
                                id: msg.id,
                                role: msg.role.toUpperCase() as 'USER' | 'ASSISTANT',
                                content: msg.content,
                                createdAt: msg.createdAt,
                                timestamp: new Date(msg.createdAt).getTime(),
                            })),
                            createdAt: new Date(chat.currentConversation.createdAt).getTime(),
                            updatedAt: new Date(chat.currentConversation.lastMessageAt).getTime(),
                        }}
                        onSendMessage={chat.handleSendMessage}
                        isLoading={chat.isLoading}
                    />
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                        {chat.isLoading || initializing ? (
                            <Loader text="Cargando conversación..." size="lg" />
                        ) : (
                            <div className="max-w-md space-y-4">
                                <div className="p-4 bg-smoke rounded-full inline-block mb-2">
                                    <MessageSquare size={48} className="text-haze" />
                                </div>
                                <h3 className="text-xl font-semibold text-oyster">No hay conversación seleccionada</h3>
                                <Button onClick={() => chat.handleNewConversation()}>
                                    Iniciar nueva conversación
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <ConfirmationModal
                isOpen={chat.confirmationModal.isOpen}
                onClose={() => chat.setConfirmationModal({ ...chat.confirmationModal, isOpen: false })}
                onConfirm={chat.confirmationModal.onConfirm}
                title="Límite de conversaciones alcanzado"
                message={`Has alcanzado el límite de ${user?.subscriptionType.maxConversationsPerAgent || 5} conversaciones para este agente. Para crear una nueva conversación, se eliminará automáticamente la conversación más antigua.`}
                confirmText="Crear nueva conversación"
                cancelText="Cancelar"
                type="warning"
            />
        </div>
    );
}
