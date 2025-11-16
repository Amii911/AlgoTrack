/**
 * Base API client configuration
 * Handles all HTTP requests to the Flask backend
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * Base fetch wrapper with error handling
 * @param {string} endpoint - API endpoint (e.g., '/users', '/problems')
 * @param {object} options - Fetch options (method, headers, body, etc.)
 * @returns {Promise} - Response data or error
 */
async function apiClient(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include', // Important: Include cookies for session-based auth
  };

  try {
    const response = await fetch(url, config);

    // Handle non-OK responses
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        error: `HTTP ${response.status}: ${response.statusText}`,
      }));
      throw new Error(errorData.error || `Request failed with status ${response.status}`);
    }

    // Handle 204 No Content responses
    if (response.status === 204) {
      return null;
    }

    // Parse and return JSON
    return await response.json();
  } catch (error) {
    console.error('API Error:', error.message);
    throw error;
  }
}

/**
 * HTTP Methods
 */
export const api = {
  /**
   * GET request
   */
  get: (endpoint) => apiClient(endpoint, { method: 'GET' }),

  /**
   * POST request
   */
  post: (endpoint, data) =>
    apiClient(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  /**
   * PATCH request
   */
  patch: (endpoint, data) =>
    apiClient(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  /**
   * PUT request
   */
  put: (endpoint, data) =>
    apiClient(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  /**
   * DELETE request
   */
  delete: (endpoint) => apiClient(endpoint, { method: 'DELETE' }),
};

export default api;
