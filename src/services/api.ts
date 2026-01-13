const API_BASE_URL = 'http://localhost:3000/api';

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    const token = localStorage.getItem('authToken');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    });

    if (response.status === 401) {
      localStorage.removeItem('authToken');
      window.dispatchEvent(new Event('unauthorized'));
      throw new Error('Unauthorized');
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.message || 'Request failed');
    }

    return response.json();
  }

  async login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(data: { email: string; password: string; fullName: string; role: string; subscriptionTypeId: string }) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getMe() {
    return this.request('/users/me');
  }

  async getCategories() {
    return this.request('/categories');
  }

  async getCategory(id: string) {
    return this.request(`/categories/${id}`);
  }

  async createCategory(data: { nameEs: string; nameEn: string; descriptionEs: string; descriptionEn: string; icon: string; displayOrder: number }) {
    return this.request('/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCategory(id: string, data: Partial<{ nameEs: string; nameEn: string; descriptionEs: string; descriptionEn: string; icon: string; displayOrder: number; isActive: boolean }>) {
    return this.request(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCategory(id: string) {
    return this.request(`/categories/${id}`, {
      method: 'DELETE',
    });
  }

  async getAgents() {
    return this.request('/agents');
  }

  async getAgentsByCategory(categoryId: string) {
    return this.request(`/agents/by-category?categoryId=${categoryId}`);
  }

  async getAgent(id: string) {
    return this.request(`/agents/${id}`);
  }

  async createAgent(data: { categoryId: string; nameEs: string; nameEn: string; descriptionEs: string; descriptionEn: string; systemPrompt: string; aiProvider: string; modelName: string }) {
    return this.request('/agents', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateAgent(id: string, data: Partial<{ nameEs: string; nameEn: string; descriptionEs: string; descriptionEn: string; systemPrompt: string; aiProvider: string; modelName: string; isActive: boolean }>) {
    return this.request(`/agents/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteAgent(id: string) {
    return this.request(`/agents/${id}`, {
      method: 'DELETE',
    });
  }

  async getConversations(agentId?: string) {
    const query = agentId ? `?agentId=${agentId}` : '';
    return this.request(`/conversations${query}`);
  }

  async getConversation(id: string) {
    return this.request(`/conversations/${id}`);
  }

  async createConversation(data: { agentId: string; title: string; confirmDelete?: boolean }) {
    return this.request('/conversations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deleteConversation(id: string) {
    return this.request(`/conversations/${id}`, {
      method: 'DELETE',
    });
  }

  async updateConversationTitle(id: string, title: string) {
    return this.request(`/conversations/${id}/title`, {
      method: 'PUT',
      body: JSON.stringify({ title }),
    });
  }

  async getMessages(conversationId: string, limit = 50, offset = 0) {
    return this.request(`/messages/${conversationId}?limit=${limit}&offset=${offset}`);
  }

  async sendMessage(conversationId: string, content: string) {
    return this.request(`/messages/${conversationId}`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }

  async getUsers() {
    return this.request('/users');
  }

  async getOnboardingStatus() {
    return this.request('/onboarding/status');
  }

  async setLanguage(language: 'ES' | 'EN') {
    return this.request('/onboarding/language', {
      method: 'POST',
      body: JSON.stringify({ language }),
    });
  }

  async completeOnboarding() {
    return this.request('/onboarding/complete', {
      method: 'POST',
    });
  }

  // Projects
  async getProjects(includeArchived = false) {
    return this.request(`/projects?includeArchived=${includeArchived}`);
  }

  async getProject(id: string) {
    return this.request(`/projects/${id}`);
  }

  async createProject(data: { name: string; description?: string; color?: string }) {
    return this.request('/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateProject(id: string, data: { name?: string; description?: string; color?: string; isArchived?: boolean }) {
    return this.request(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async archiveProject(id: string, isArchived: boolean) {
    return this.request(`/projects/${id}/archive`, {
      method: 'PATCH',
      body: JSON.stringify({ isArchived }),
    });
  }

  async deleteProject(id: string) {
    return this.request(`/projects/${id}`, {
      method: 'DELETE',
    });
  }

  // Sections
  async createSection(data: { projectId: string; name: string }) {
    return this.request('/sections', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateSection(id: string, data: { name: string }) {
    return this.request(`/sections/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async reorderSections(data: { projectId: string; sections: { id: string; position: number }[] }) {
    return this.request('/sections/reorder', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteSection(id: string) {
    return this.request(`/sections/${id}`, {
      method: 'DELETE',
    });
  }

  // Cards
  async createCard(data: { sectionId: string; title: string; description?: string; priority?: string; dueDate?: string }) {
    return this.request('/cards', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCard(id: string, data: { title?: string; description?: string; priority?: string; dueDate?: string }) {
    return this.request(`/cards/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async moveCard(id: string, data: { targetSectionId: string; newPosition: number }) {
    return this.request(`/cards/${id}/move`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteCard(id: string) {
    return this.request(`/cards/${id}`, {
      method: 'DELETE',
    });
  }

  // Reminders
  async getReminders() {
    return this.request('/reminders');
  }

  async createReminder(data: { title: string; description?: string; triggerAt: string }) {
    return this.request('/reminders', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deleteReminder(id: string) {
    return this.request(`/reminders/${id}`, {
      method: 'DELETE',
    });
  }

  // Admin Email Config
  async updateEmailConfig(data: { smtpHost: string; smtpPort: number; smtpUser: string; smtpPassword?: string; fromEmail: string; fromName: string }) {
    return this.request('/admin/email-config', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // User Notification Settings
  async updateProfile(data: { fullName?: string; notificationEmail?: string; language?: string }) {
    return this.request('/users/me', {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }
}

export const api = new ApiClient(API_BASE_URL);
