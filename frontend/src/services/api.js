const BASE_URL = 'http://localhost:5000';

/**
 * Helper internal untuk melakukan request HTTP menggunakan fetch standard.
 */
async function request(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  const headers = { ...options.headers };

  // Jika opsi body bukan FormData, atur Content-Type menjadi JSON secara default
  if (options.body && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(options.body);
  }

  // Masukkan token jika tersedia
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.message || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }

  return data;
}

export const api = {
  // 1. Authentication (/api/auth)
  auth: {
    login: (email, password) => 
      request('/api/auth/login', {
        method: 'POST',
        body: { email, password }
      }),
    register: (name, email, password) =>
      request('/api/auth/register', {
        method: 'POST',
        body: { name, email, password }
      }),
    forgotPassword: (email, new_password) =>
      request('/api/auth/forgot-password', {
        method: 'POST',
        body: { email, new_password }
      }),
  },

  // 2. Transactions (/api/transactions)
  transactions: {
    getAll: () => request('/api/transactions/'),
    createManual: (data) =>
      request('/api/transactions/', {
        method: 'POST',
        body: data,
      }),
    createFromOCR: (file) => {
      const formData = new FormData();
      formData.append('file', file);
      return request('/api/transactions/ocr', {
        method: 'POST',
        body: formData, // Tanpa Content-Type manual agar boundary terbuat otomatis
      });
    },
    update: (id, data) =>
      request(`/api/transactions/${id}`, {
        method: 'PUT',
        body: data,
      }),
    delete: (id) =>
      request(`/api/transactions/${id}`, {
        method: 'DELETE',
      }),
  },

  // 3. Dashboard & Analytics (/api)
  dashboard: {
    getSummary: () => request('/api/dashboard/summary'),
    getTax: (query = '') => request(`/api/tax/${query}`),
    getRisk: () => request('/api/risk/'),
    getForecast: () => request('/api/forecast/'),
    getInsight: () => request('/api/insight/'),
  },

  // 4. Settings & Profile (/api/settings)
  settings: {
    getProfile: () => request('/api/settings/profile'),
    updateProfile: (data) =>
      request('/api/settings/profile', {
        method: 'PUT',
        body: data,
      }),
    updateSecurity: (data) =>
      request('/api/settings/security', {
        method: 'PUT',
        body: data,
      }),
    updateNotifications: (data) =>
      request('/api/settings/notifications', {
        method: 'PUT',
        body: data,
      }),
  },

  // 5. Notifications (/api/notifications)
  notifications: {
    getAll: () => request('/api/notifications/'),
    markAsRead: (id) =>
      request(`/api/notifications/read/${id}`, {
        method: 'PUT',
      }),
  },

  // 6. Alerts (/api/alert)
  alerts: {
    getAll: () => request('/api/alert/'),
  },
};
