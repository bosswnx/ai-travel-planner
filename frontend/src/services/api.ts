import axios from 'axios';

const API_URL = 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface ItineraryActivity {
  time: string;
  location: string;
  description: string;
  cost_estimate: string;
  type: string;
}

export interface ItineraryDay {
  day: number;
  date: string;
  activities: ItineraryActivity[];
}

export interface BudgetBreakdown {
  accommodation: string;
  transport: string;
  food: string;
  activities: string;
  misc: string;
}

export interface PlanContent {
  title: string;
  destination_city: string;
  summary: string;
  total_budget_estimate: string;
  itinerary: ItineraryDay[];
  budget_breakdown: BudgetBreakdown;
}

export interface TripPlan {
  id: number;
  title: string;
  content: PlanContent;
  created_at: string;
}

export const generatePlan = async (userInput: string): Promise<TripPlan> => {
  const response = await api.post<TripPlan>('/plans/generate', { user_input: userInput });
  return response.data;
};

export const getMyPlans = async (): Promise<TripPlan[]> => {
  const response = await api.get<TripPlan[]>('/plans/');
  return response.data;
};

export const login = async (username: string, password: string):Promise<{access_token: string, token_type: string}> => {
  // FormData for OAuth2PasswordRequestForm
  const formData = new FormData();
  formData.append('username', username);
  formData.append('password', password);
  const response = await axios.post(`${API_URL}/auth/token`, formData);
  return response.data;
};

export const register = async (username: string, password: string) => {
  const response = await api.post('/auth/register', { username, password });
  return response.data;
};

export const deletePlan = async (planId: number): Promise<void> => {
  await api.delete(`/plans/${planId}`);
};