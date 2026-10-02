const API_BASE = '/api';

export interface User {
  id: string;
  name: string;
  username?: string;
  email: string;
  role: 'STUDENT' | 'RECRUITER' | 'ADMIN';
  avatar?: string;
  bio?: string;
  college?: string;
  location?: string;
  headline?: string;
  github_url?: string;
  linkedin_url?: string;
}

export interface SkillEvidence {
  skill_id: string;
  skill_name: string;
  category: string;
  score: number;
  demonstrated: boolean;
  challenge_count: number;
  project_count?: number;
  icon?: string;
  verified_at?: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  scenario?: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  category: string;
  estimated_minutes: number;
  instructions?: string;
  requirements: string[];
  evaluation_criteria?: string[];
  skill_id?: string;
  skill_name?: string;
  submissions_count?: number;
  created_at?: string;
}

export interface Evaluation {
  id: string;
  functionality_score: number;
  uiux_score: number;
  responsiveness_score: number;
  code_quality_score: number;
  accessibility_score: number;
  total_score: number;
  ai_feedback: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  evaluation_provider: string;
  created_at: string;
}

export interface Submission {
  id: string;
  student_id: string;
  student_name?: string;
  challenge_id: string;
  challenge_title: string;
  skill_name: string;
  difficulty?: string;
  github_url: string;
  live_demo_url?: string;
  explanation: string;
  status: string;
  score?: number;
  submitted_at: string;
  evaluation?: Evaluation;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  created_at: string;
}

class ApiClient {
  private getToken(): string | null {
    return localStorage.getItem('skillproof_token');
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let errorMessage = 'An error occurred';
      try {
        const errJson = await response.json();
        errorMessage = errJson.detail || errJson.message || errorMessage;
      } catch {
        errorMessage = response.statusText;
      }
      throw new Error(errorMessage);
    }

    return response.json();
  }

  // Auth
  async login(email: string, password: string):Promise<{ access_token: string; user: User }> {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(data: { name: string; email: string; password: string; role?: string; college?: string; headline?: string }): Promise<{ access_token: string; user: User }> {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getMe(): Promise<User> {
    return this.request('/auth/me');
  }

  // Challenges
  async getChallenges(params?: { skill?: string; category?: string; difficulty?: string; search?: string }): Promise<Challenge[]> {
    const query = new URLSearchParams();
    if (params?.skill) query.append('skill', params.skill);
    if (params?.category) query.append('category', params.category);
    if (params?.difficulty) query.append('difficulty', params.difficulty);
    if (params?.search) query.append('search', params.search);
    const qs = query.toString() ? `?${query.toString()}` : '';
    return this.request(`/challenges${qs}`);
  }

  async getChallenge(id: string): Promise<Challenge> {
    return this.request(`/challenges/${id}`);
  }

  // Submissions
  async createSubmission(data: { challenge_id: string; github_url: string; live_demo_url?: string; explanation: string }): Promise<Submission> {
    return this.request('/submissions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getSubmissions(studentId?: string): Promise<Submission[]> {
    const qs = studentId ? `?student_id=${studentId}` : '';
    return this.request(`/submissions${qs}`);
  }

  async getSubmission(id: string): Promise<Submission> {
    return this.request(`/submissions/${id}`);
  }

  // Student Dashboard & Profile
  async getStudentDashboard(): Promise<any> {
    return this.request('/students/dashboard');
  }

  async getPublicPassport(identifier: string): Promise<any> {
    return this.request(`/students/${identifier}/passport`);
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    return this.request('/students/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async addProject(data: { title: string; description: string; github_url: string; live_demo_url?: string; technologies: string }): Promise<any> {
    return this.request('/students/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Recruiter
  async getRecruiterDashboard(): Promise<any> {
    return this.request('/recruiters/dashboard');
  }

  async searchCandidates(params?: { skill?: string; minimum_score?: number; challenge?: string; location?: string }): Promise<any[]> {
    const query = new URLSearchParams();
    if (params?.skill) query.append('skill', params.skill);
    if (params?.minimum_score !== undefined && params.minimum_score !== null) query.append('minimum_score', params.minimum_score.toString());
    if (params?.challenge) query.append('challenge', params.challenge);
    if (params?.location) query.append('location', params.location);
    const qs = query.toString() ? `?${query.toString()}` : '';
    return this.request(`/recruiters/candidates${qs}`);
  }

  async getCandidate(id: string): Promise<any> {
    return this.request(`/recruiters/candidates/${id}`);
  }

  // Skills
  async getSkills(category?: string): Promise<any[]> {
    const qs = category ? `?category=${category}` : '';
    return this.request(`/skills${qs}`);
  }

  // Notifications
  async getNotifications(): Promise<NotificationItem[]> {
    return this.request('/notifications');
  }

  async getUnreadCount(): Promise<{ unread_count: number }> {
    return this.request('/notifications/unread-count');
  }

  async markNotificationRead(id: string): Promise<void> {
    return this.request(`/notifications/${id}/read`, { method: 'PUT' });
  }

  async markAllNotificationsRead(): Promise<void> {
    return this.request('/notifications/read-all', { method: 'PUT' });
  }

  // Admin
  async getAdminStats(): Promise<any> {
    return this.request('/admin/stats');
  }

  async getAdminUsers(): Promise<any[]> {
    return this.request('/admin/users');
  }

  async getAdminSubmissions(): Promise<any[]> {
    return this.request('/admin/submissions');
  }

  async createChallenge(data: any): Promise<any> {
    return this.request('/admin/challenges', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deleteChallenge(id: string): Promise<any> {
    return this.request(`/admin/challenges/${id}`, {
      method: 'DELETE',
    });
  }
}

export const api = new ApiClient();
