import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import problemService from '../../services/problemService';
import ProblemProgress from './ProblemProgress';
import AddProgressForm from './AddProgressForm';

const TrackedProblems = () => {
  const { user } = useAuth();
  const [userProblems, setUserProblems] = useState([]);
  const [allProblems, setAllProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState('All');

  useEffect(() => {
    if (user) {
      fetchTrackedProblems();
      fetchAllProblems();
    }
  }, [user]);

  const fetchTrackedProblems = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await problemService.getUserProblems(user.id);
      setUserProblems(data);
    } catch (err) {
      setError('Failed to load tracked problems');
      console.error('Error fetching user problems:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllProblems = async () => {
    try {
      const data = await problemService.getAllProblems();
      setAllProblems(data);
    } catch (err) {
      console.error('Error fetching all problems:', err);
    }
  };

  const handleAddSuccess = () => {
    setShowAddForm(false);
    fetchTrackedProblems();
  };

  const handleUpdate = () => {
    fetchTrackedProblems();
  };

  const handleDelete = () => {
    fetchTrackedProblems();
  };

  const getProblemDetails = (problemId) => {
    return allProblems.find((p) => p.id === problemId);
  };

  const filteredProblems = userProblems.filter((up) => {
    if (filterStatus === 'All') return true;
    return up.status === filterStatus;
  });

  if (loading) {
    return <div className="loading">Loading tracked problems...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-text">{error}</p>
        <button onClick={fetchTrackedProblems} className="btn btn-primary">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="tracked-problems">
      <div className="header">
        <h2>Tracked Problems</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn btn-primary"
        >
          {showAddForm ? 'Cancel' : '+ Track New Problem'}
        </button>
      </div>

      {showAddForm && (
        <div className="add-form-section">
          <AddProgressForm
            onSuccess={handleAddSuccess}
            onCancel={() => setShowAddForm(false)}
          />
        </div>
      )}

      <div className="filters">
        <div className="filter-label">Filter by Status:</div>
        <div className="filter-buttons">
          {['All', 'Attempted', 'Completed', 'Skipped'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`filter-btn ${filterStatus === status ? 'active' : ''}`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {filteredProblems.length === 0 ? (
        <div className="no-problems">
          <p>
            {userProblems.length === 0
              ? "You haven't tracked any problems yet. Start tracking to see your progress!"
              : `No ${filterStatus.toLowerCase()} problems found.`}
          </p>
        </div>
      ) : (
        <div className="problems-list">
          <div className="list-header">
            Showing {filteredProblems.length} of {userProblems.length} problems
          </div>
          {filteredProblems.map((userProblem) => {
            const problemDetails = getProblemDetails(userProblem.problem_id);
            return (
              <ProblemProgress
                key={`${userProblem.user_id}-${userProblem.problem_id}`}
                userProblem={userProblem}
                problemDetails={problemDetails}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            );
          })}
        </div>
      )}

      <style jsx>{`
        .tracked-problems {
          margin-bottom: 2rem;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        h2 {
          margin: 0;
          color: #333;
        }

        .btn-primary {
          background: #4CAF50;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 4px;
          cursor: pointer;
          transition: background 0.2s;
          font-size: 1rem;
        }

        .btn-primary:hover {
          background: #45a049;
        }

        .add-form-section {
          margin-bottom: 2rem;
        }

        .filters {
          background: white;
          padding: 1rem 1.5rem;
          border-radius: 8px;
          margin-bottom: 1.5rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .filter-label {
          font-weight: 600;
          margin-bottom: 0.75rem;
          color: #555;
        }

        .filter-buttons {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .filter-btn {
          padding: 0.5rem 1rem;
          border: 1px solid #ddd;
          background: white;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 0.875rem;
        }

        .filter-btn:hover {
          border-color: #4CAF50;
          color: #4CAF50;
        }

        .filter-btn.active {
          background: #4CAF50;
          color: white;
          border-color: #4CAF50;
        }

        .list-header {
          margin-bottom: 1rem;
          color: #666;
          font-size: 0.875rem;
        }

        .problems-list {
          display: flex;
          flex-direction: column;
        }

        .loading,
        .no-problems {
          text-align: center;
          padding: 3rem;
          color: #666;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
        }

        @media (max-width: 768px) {
          .header {
            flex-direction: column;
            align-items: stretch;
            gap: 1rem;
          }

          .filter-buttons {
            flex-direction: column;
          }

          .filter-btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default TrackedProblems;
