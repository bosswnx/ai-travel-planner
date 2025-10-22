const API_BASE = import.meta.env.VITE_API_BASE || '';

const defaultHeaders = {
  'Content-Type': 'application/json',
};

const request = async (url, options = {}) => {
  const endpoint = `${API_BASE}${url}`;
  const res = await fetch(endpoint, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...(options.headers || {}),
    },
  });

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
