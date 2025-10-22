import { appConfig } from '../config.js';

const normalizeBase = (base) => (base || '').replace(/\/+$/, '');

const API_BASE = normalizeBase(appConfig.apiBase);

const defaultHeaders = {
  'Content-Type': 'application/json',
};

const request = async (url, options = {}) => {
  const endpoint = url.startsWith('http') ? url : `${API_BASE}${url}`;
  let res;

  try {
    res = await fetch(endpoint, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...(options.headers || {}),
      },
    });
  } catch (error) {
    throw new Error('网络请求失败，请检查后端服务是否可用或 API 地址是否正确配置。');
  }

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.message || '请求失败');
  }

  return res.json();
};

export const createPlan = (payload) => request('/api/plan', {
  method: 'POST',
  body: JSON.stringify(payload),
});

export const fetchPlans = (userId) => request(`/api/plan?userId=${encodeURIComponent(userId || 'guest')}`);

export const analyzeBudget = (payload) => request('/api/budget', {
  method: 'POST',
  body: JSON.stringify(payload),
});

export const createExpense = (payload) => request('/api/expenses', {
  method: 'POST',
  body: JSON.stringify(payload),
});

export const fetchExpenses = (userId) => request(`/api/expenses?userId=${encodeURIComponent(userId || 'guest')}`);
