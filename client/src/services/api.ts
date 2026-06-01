/**
 * Frontend client API service.
 * Handles server networking requests for login, register, profile fetching,
 * listing users, status toggling, and user deletion.
 *
 * @author akshatnathani
 * @version 1.1.0
 * @module api
 */

// Use relative URL so Vite's dev proxy forwards requests to localhost:5000
// This avoids CORS entirely in development
const API_URL = '/api';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const api = {
  async register(userData: FormData) {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      body: userData,
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Registration failed');
    return result;
  },

  async login(credentials: any) {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Login failed');
    return result;
  },

  async getMe() {
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: getHeaders(),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Failed to fetch user profile');
    return result.data;
  },
  async addUser(userData: FormData) {
    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: userData,
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Failed to add user');
    return result;
  },
  async getUsers() {
    const response = await fetch(`${API_URL}/users`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch users');
    const data = await response.json();
    return data.data; // Return the array
  },

  async updateUserStatus(id: string, status: string) {
    const response = await fetch(`${API_URL}/users/${id}/status`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ status }),
    });
    if (!response.ok) throw new Error('Failed to update status');
    return response.json();
  },

  async deleteUser(id: string) {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete user');
    return response.json();
  },

  async updateUser(id: string, userData: FormData) {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: userData,
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Failed to update user');
    return result;
  }
};
