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
      <div className="profile-container">
        <div className="auth-required">
          <h2>Authentication Required</h2>
          <p>Please log in to view your profile and track your progress.</p>
        </div>

        <style jsx>{`
          .profile-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
          }

          .auth-required {
            background: white;
            padding: 3rem;
            border-radius: 8px;
            text-align: center;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }

          .auth-required h2 {
            color: #333;
            margin-bottom: 1rem;
          }

          .auth-required p {
            color: #666;
          }
        `}</style>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading">Loading your profile...</div>

        <style jsx>{`
          .profile-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
          }

          .loading {
            text-align: center;
            padding: 3rem;
            color: #666;
            font-size: 1.125rem;
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-container">
        <div className="error-container">
          <p className="error-text">{error}</p>
          <button onClick={fetchData} className="btn btn-primary">
            Try Again
          </button>
        </div>

        <style jsx>{`
          .profile-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
          }

          .error-container {
            text-align: center;
            padding: 3rem;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }

          .error-text {
            color: #f44336;
            margin-bottom: 1rem;
            font-size: 1.125rem;
          }

          .btn-primary {
            background: #4CAF50;
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 4px;
            cursor: pointer;
            transition: background 0.2s;
          }

          .btn-primary:hover {
            background: #45a049;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Welcome back, {user.user_name}!</h1>
        <p className="user-email">{user.email}</p>
      </div>

      <ProfileStats userProblems={userProblems} allProblems={allProblems} />

      <TrackedProblems />

      <style jsx>{`
        .profile-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
        }

        .profile-header {
          margin-bottom: 2rem;
        }

        h1 {
          margin: 0 0 0.5rem 0;
          color: #333;
          font-size: 2rem;
        }

        .user-email {
          margin: 0;
          color: #666;
          font-size: 1rem;
        }

        @media (max-width: 768px) {
          .profile-container {
            padding: 1rem;
          }

          h1 {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default UserProfile;
