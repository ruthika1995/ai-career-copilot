import {
  mockJobs,
  mockJobMatches,
  mockProfile,
  mockRoadmap,
  mockInterview,
  mockChatMessages,
} from '../utils/mockData';
import type {
  Job,
  JobMatch,
  Profile,
  LearningRoadmap,
  Interview,
  ChatMessage,
  User,
} from '../types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

const getToken = (): string => {
  return localStorage.getItem('token') || '';
};

const getHeaders = (extraHeaders: Record<string, string> = {}): Record<string, string> => {
  const token = getToken();
  const headers: Record<string, string> = {
    ...extraHeaders,
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const apiClient = {
  // --- Auth ---
  async login(email: string, password: string): Promise<{ access_token: string; user: User }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to login');
    }
    const data = await res.json();
    localStorage.setItem('token', data.access_token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  },

  async register(name: string, email: string, password: string): Promise<{ access_token: string; user: User }> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Registration failed');
    }
    const data = await res.json();
    localStorage.setItem('token', data.access_token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  },

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // --- Profile ---
  async getProfile(): Promise<Profile> {
    try {
      const res = await fetch(`${API_BASE}/profile`, {
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error('Failed to fetch profile');
      const data = await res.json();
      return data;
    } catch {
      const currentUser = this.getCurrentUser();
      if (currentUser) {
        return {
          ...mockProfile,
          user_id: currentUser.id,
          name: currentUser.name,
        };
      }
      return mockProfile;
    }
  },

  async updateProfile(profileData: Partial<Profile>): Promise<Profile> {
    try {
      const res = await fetch(`${API_BASE}/profile`, {
        method: 'PUT',
        headers: getHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(profileData),
      });
      if (!res.ok) throw new Error('Failed to update profile');
      return await res.json();
    } catch {
      return { ...mockProfile, ...profileData };
    }
  },

  // --- Jobs ---
  async getJobs(): Promise<Job[]> {
    try {
      const res = await fetch(`${API_BASE}/jobs`, {
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error('Failed to fetch jobs');
      const data = await res.json();
      return data && data.length > 0 ? data : mockJobs;
    } catch {
      return mockJobs;
    }
  },

  async createJob(job: { title: string; company: string; description: string }): Promise<Job> {
    try {
      const res = await fetch(`${API_BASE}/jobs`, {
        method: 'POST',
        headers: getHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(job),
      });
      if (!res.ok) throw new Error('Failed to create job');
      return await res.json();
    } catch {
      const newJob: Job = {
        id: String(Date.now()),
        user_id: this.getCurrentUser()?.id || '1',
        title: job.title,
        company: job.company,
        description: job.description,
        parsed_requirements: {
          required_skills: ['Python', 'SQL', 'REST APIs', 'Docker'],
          soft_skills: ['Communication', 'Problem Solving'],
          experience_level: '0-2 years',
          responsibilities: ['Build backend services and microservices', 'Write clean unit tests'],
          qualifications: ["Bachelor's degree in CS, IT, or related field"],
        },
        created_at: new Date().toISOString(),
      };
      return newJob;
    }
  },

  // --- Matches ---
  async getJobMatch(jobId: string): Promise<JobMatch> {
    try {
      const res = await fetch(`${API_BASE}/matches/job/${jobId}`, {
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error('Failed to fetch match');
      return await res.json();
    } catch {
      const found = mockJobMatches.find((m) => m.job_id === jobId);
      return found || mockJobMatches[0];
    }
  },

  async getAllMatches(): Promise<JobMatch[]> {
    try {
      const res = await fetch(`${API_BASE}/matches`, {
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error('Failed to fetch matches');
      const data = await res.json();
      return data && data.length > 0 ? data : mockJobMatches;
    } catch {
      return mockJobMatches;
    }
  },

  // --- Resume Upload & Parsing ---
  async uploadResume(file: File): Promise<{ filename: string; parsed_data: any }> {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const token = getToken();
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`${API_BASE}/resume/upload`, {
        method: 'POST',
        headers,
        body: formData,
      });
      if (!res.ok) throw new Error('Failed to upload resume');
      return await res.json();
    } catch {
      return {
        filename: file.name,
        parsed_data: {
          education: mockProfile.education,
          experience: mockProfile.experience,
          projects: mockProfile.projects,
          skills: ['Python', 'SQL', 'FastAPI', 'React', 'Docker'],
        },
      };
    }
  },

  async parseResumeText(rawText: string): Promise<{ filename: string; parsed_data: any }> {
    try {
      const res = await fetch(`${API_BASE}/resume/parse-text`, {
        method: 'POST',
        headers: getHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ raw_text: rawText }),
      });
      if (!res.ok) throw new Error('Failed to parse resume text');
      return await res.json();
    } catch {
      return {
        filename: 'pasted_resume.txt',
        parsed_data: {
          education: mockProfile.education,
          experience: mockProfile.experience,
          projects: mockProfile.projects,
          skills: ['Python', 'SQL', 'FastAPI', 'React', 'Docker'],
        },
      };
    }
  },

  // --- Interview ---
  async getLatestInterview(): Promise<Interview> {
    try {
      const res = await fetch(`${API_BASE}/interviews/latest`, {
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error('Failed to fetch interview');
      return await res.json();
    } catch {
      return mockInterview;
    }
  },

  async createInterview(jobId?: string, difficulty = 'medium', focusArea = 'Full Stack'): Promise<Interview> {
    try {
      const res = await fetch(`${API_BASE}/interviews`, {
        method: 'POST',
        headers: getHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ job_id: jobId, difficulty, focus_area: focusArea }),
      });
      if (!res.ok) throw new Error('Failed to create interview');
      return await res.json();
    } catch {
      return mockInterview;
    }
  },

  async submitAnswer(interviewId: string, questionIndex: number, answer: string): Promise<Interview> {
    try {
      const res = await fetch(`${API_BASE}/interviews/${interviewId}/answer`, {
        method: 'POST',
        headers: getHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ question_index: questionIndex, user_answer: answer }),
      });
      if (!res.ok) throw new Error('Failed to submit answer');
      return await res.json();
    } catch {
      const updated = { ...mockInterview };
      if (updated.questions[questionIndex]) {
        updated.questions[questionIndex].user_answer = answer;
        updated.questions[questionIndex].evaluation = {
          technical_accuracy: 8,
          clarity: 9,
          depth: 7,
          communication: 8,
          overall: 8,
          feedback: 'Solid explanation of the architecture and trade-offs.',
        };
      }
      return updated;
    }
  },

  // --- Chat ---
  async getChatHistory(): Promise<ChatMessage[]> {
    try {
      const res = await fetch(`${API_BASE}/chat/history`, {
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error('Failed to fetch chat history');
      const data = await res.json();
      return data && data.length > 0 ? data : mockChatMessages;
    } catch {
      return mockChatMessages;
    }
  },

  async sendChatMessage(message: string): Promise<ChatMessage> {
    try {
      const res = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: getHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ message }),
      });
      if (!res.ok) throw new Error('Failed to send message');
      return await res.json();
    } catch {
      return {
        id: String(Date.now()),
        user_message: message,
        ai_response:
          'Here is targeted career guidance:\n1. Emphasize quantifiable project outcomes on your resume.\n2. Practice explaining your distributed systems and database design decisions.\n3. Complete the personalized learning roadmap modules to close critical skill gaps.',
        sources: ['Career Intelligence Knowledge Base'],
        created_at: new Date().toISOString(),
      };
    }
  },

  // --- Roadmap ---
  async getRoadmap(jobId = '1'): Promise<LearningRoadmap> {
    try {
      const res = await fetch(`${API_BASE}/roadmap?job_id=${jobId}`, {
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error('Failed to fetch roadmap');
      return await res.json();
    } catch {
      return mockRoadmap;
    }
  },
};
