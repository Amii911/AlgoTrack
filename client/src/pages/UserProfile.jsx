import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import problemService from '../services/problemService';
import ProfileStats from '../components/profile/ProfileStats';
import TrackedProblems from '../components/profile/TrackedProblems';

const UserProfile = () => {
  const { user, isAuthenticated } = useAuth();
  const [userProblems, setUserProblems] = useState([]);
  const [allProblems, setAllProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchData();
    }
  }, [isAuthenticated, user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');

      const [userProblemsData, allProblemsData] = await Promise.all([
        problemService.getUserProblems(user.id),
        problemService.getAllProblems(),
      ]);

      setUserProblems(userProblemsData);
      setAllProblems(allProblemsData);
    } catch (err) {
      setError('Failed to load profile data');
      console.error('Error fetching profile data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-6xl mx-auto p-8">
        <div className="bg-white p-12 rounded-lg text-center shadow-md">
          <h2 className="text-gray-800 mb-4 text-2xl font-semibold">Authentication Required</h2>
          <p className="text-gray-600">Please log in to view your profile and track your progress.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-8">
        <div className="text-center py-12 text-gray-600 text-lg">Loading your profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-8">
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <p className="text-red-500 mb-4 text-lg">{error}</p>
          <button onClick={fetchData} className="btn btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome back, {user.user_name}!</h1>
        <p className="text-gray-600">{user.email}</p>
      </div>

      <ProfileStats userProblems={userProblems} allProblems={allProblems} />

      <TrackedProblems />
    </div>
  );
};

export default UserProfile;
