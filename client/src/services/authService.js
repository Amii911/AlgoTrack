/**
 * Authentication Service
 * Handles all authentication-related API calls
 */

import api from './api';

export const authService = {
  /**
   * Register a new user with email and password
   * @param {object} userData - { email, password, user_name, picture (optional) }
   * @returns {Promise} - User data and success message
   */
  register: async (userData) => {
    return await api.post('/register', userData);
  },

  /**
   * Login with email and password
   * @param {object} credentials - { email, password }
   * @returns {Promise} - User data and success message
   */
  login: async (credentials) => {
    return await api.post('/login', credentials);
  },

  /**
   * Logout current user
   * @returns {Promise} - Success message
   */
  logout: async () => {
    return await api.post('/logout', {});
  },

  /**
   * Check if user is authenticated
   * @returns {Promise} - User data if authenticated, error if not
   */
  checkAuth: async () => {
    return await api.get('/authorized');
  },

  /**
   * Initiate Google OAuth login
   * Opens Google OAuth flow in a popup window
   */
  loginWithGoogle: () => {
    const width = 500;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    window.open(
      '/google/',
      'Google Login',
      `width=${width},height=${height},left=${left},top=${top}`
    );
  },

  /**
   * Clear session (alternative logout)
   * @returns {void}
   */
  clearSession: () => {
    window.location.href = '/clear';
  },
};

export default authService;
