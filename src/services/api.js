import { API_BASE_URL, STORAGE_KEYS } from '../utils/constants';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  getAuthHeaders() {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getAuthHeaders(),
      ...options
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  }

  async signup(userData) {
    return this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  async uploadAudio(audioBlob) {
    const formData = new FormData();
    formData.append('audio', audioBlob);

    return this.request('/consultations/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem(STORAGE_KEYS.TOKEN)}`
      },
      body: formData
    });
  }

  async saveSummary(summaryData) {
    return this.request('/consultations/summary', {
      method: 'POST',
      body: JSON.stringify(summaryData)
    });
  }

  async getConsultations() {
    return this.request('/consultations');
  }
}

export default new ApiService();