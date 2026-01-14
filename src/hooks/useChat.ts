import { useState } from 'react';
import { api } from '../services/api';
import { Conversation, Message, CreateConversationResponse } from '../types';

export const useChat = (agentId: string) => {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [confirmationModal, setConfirmationModal] = useState<{
        isOpen: boolean;
        conversationToDelete?: { title: string; messageCount: number };
        onConfirm: () => void;
    }>({
        isOpen: false,
        onConfirm: () => { },
    });

    const loadConversations = async (targetAgentId: string = agentId): Promise<Conversation[]> => {
        try {
            const conversationsResponse: any = await api.getConversations(targetAgentId);
            const loadedConversations = conversationsResponse.conversations || [];
            setConversations(loadedConversations);
            return loadedConversations;
        } catch (err) {
            console.error('Error loading conversations:', err);
            return [];
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

    const generateConversationTitle = () => {
        const now = new Date();
        const timeStr = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
        const dateStr = now.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
        return `Conversación ${dateStr} - ${timeStr}`;
    };

    const handleNewConversation = async () => {
        if (!agentId) return;

        setIsLoading(true);
        try {
            const newConvResponse: CreateConversationResponse = await api.createConversation({
                agentId,
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
                                agentId,
                                title: generateConversationTitle(),
                                confirmDelete: true,
                            });

                            if (confirmedResponse.id) {
                                const updatedConversations = await loadConversations();
                                const newConv = updatedConversations.find((c) => c.id === confirmedResponse.id);
                                if (newConv) {
                                    setCurrentConversation(newConv);
                                    setMessages([]);
                                }
                            }
                        } catch (err) {
                            console.error('Error creating conversation with confirmation:', err);
                        } finally {
                            setConfirmationModal(prev => ({ ...prev, isOpen: false }));
                        }
                    },
                });
            } else if (newConvResponse.id) {
                const updatedConversations = await loadConversations();
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

    const handleDeleteConversation = async (conversationId: string) => {
        try {
            await api.deleteConversation(conversationId);
            const updatedConversations = await loadConversations();

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
        if (!currentConversation || !agentId) return;

        const isFirstMessage = messages.length === 0;
        setIsLoading(true);

        try {
            const response: any = await api.sendMessage(currentConversation.id, message);
            setMessages((prev) => [...prev, response.userMessage, response.assistantMessage]);

            if (isFirstMessage) {
                const newTitle = generateTitleFromMessage(message);
                try {
                    await api.updateConversationTitle(currentConversation.id, newTitle);
                    await loadConversations();
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

    return {
        conversations,
        currentConversation,
        messages,
        isLoading,
        confirmationModal,
        setConfirmationModal,
        loadConversations,
        handleSelectConversation,
        handleNewConversation,
        handleDeleteConversation,
        handleSendMessage,
        setCurrentConversation,
        setMessages
    };
};
