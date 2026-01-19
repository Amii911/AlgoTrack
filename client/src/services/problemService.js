/**
 * Problem Service
 * Handles all problem-related API calls
 */

import api from './api';

export const problemService = {
  /**
   * Get all problems from the catalog
   * @returns {Promise} - Array of problems
   */
  getAllProblems: async () => {
    const response = await api.get('/problems');
    // Backend returns paginated response { problems: [...], page, per_page, total, pages }
    return response.problems || response;
  },

  /**
   * Get a specific problem by ID
   * @param {number} id - Problem ID
   * @returns {Promise} - Problem object
   */
  getProblemById: async (id) => {
    return await api.get(`/problems/${id}`);
  },

  /**
   * Create a new problem in the catalog
   * @param {object} problemData - { problem_name, problem_link, difficulty, category }
   * @returns {Promise} - Created problem object
   */
  createProblem: async (problemData) => {
    return await api.post('/problems', problemData);
  },

  /**
   * Update a problem
   * @param {number} id - Problem ID
   * @param {object} updates - Fields to update
   * @returns {Promise} - Updated problem object
   */
  updateProblem: async (id, updates) => {
    return await api.patch(`/problems/${id}`, updates);
  },

  /**
   * Delete a problem
   * @param {number} id - Problem ID
   * @returns {Promise} - Success message
   */
  deleteProblem: async (id) => {
    return await api.delete(`/problems/${id}`);
  },

  /**
   * Get all user-problem attempts
   * @returns {Promise} - Array of user-problem attempts
   */
  getAllUserProblems: async () => {
    return await api.get('/user-problems');
  },

  /**
   * Get problems for a specific user
   * @param {number} userId - User ID
   * @returns {Promise} - Array of user's problem attempts
   */
  getUserProblems: async (userId) => {
    return await api.get(`/users/${userId}/problems`);
  },

  /**
   * Track progress on a problem (create user-problem attempt)
   * @param {object} attemptData - { user_id, problem_id, date_attempted, status, notes, num_attempts }
   * @returns {Promise} - Created user-problem object
   */
  trackProblem: async (attemptData) => {
    return await api.post('/user-problems', attemptData);
  },

  /**
   * Update user's progress on a problem
   * @param {number} userId - User ID
   * @param {number} problemId - Problem ID
   * @param {object} updates - Fields to update
   * @returns {Promise} - Updated user-problem object
   */
  updateUserProblem: async (userId, problemId, updates) => {
    return await api.patch(`/users/${userId}/problems/${problemId}`, updates);
  },

  /**
   * Delete user's problem attempt
   * @param {number} userId - User ID
   * @param {number} problemId - Problem ID
   * @returns {Promise} - Success message
   */
  deleteUserProblem: async (userId, problemId) => {
    return await api.delete(`/users/${userId}/problems/${problemId}`);
  },
};

export default problemService;
