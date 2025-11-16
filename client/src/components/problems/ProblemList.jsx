import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import problemService from '../../services/problemService';
import ProblemCard from './ProblemCard';
import ProblemFilters from './ProblemFilters';
import AddProblemForm from './AddProblemForm';

const ProblemList = ({ onTrackProblem }) => {
  const { isAuthenticated, user } = useAuth();
  const [problems, setProblems] = useState([]);
  const [filteredProblems, setFilteredProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    difficulty: '',
    category: '',
  });

  useEffect(() => {
    fetchProblems();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [problems, filters]);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await problemService.getAllProblems();
      setProblems(data);
    } catch (err) {
      setError('Failed to load problems. Please try again.');
      console.error('Error fetching problems:', err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...problems];

    // Search filter
    if (filters.search) {
      filtered = filtered.filter((problem) =>
        problem.problem_name.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Difficulty filter
    if (filters.difficulty) {
      filtered = filtered.filter(
        (problem) => problem.difficulty === filters.difficulty
      );
    }

    // Category filter
    if (filters.category) {
      filtered = filtered.filter(
        (problem) => problem.category === filters.category
      );
    }

    setFilteredProblems(filtered);
  };

  const handleAddSuccess = () => {
    setShowAddForm(false);
    fetchProblems(); // Refresh the list
  };

  if (loading) {
    return <div className="loading">Loading problems...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-text">{error}</p>
        <button onClick={fetchProblems} className="btn btn-primary">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="problem-list-container">
      <div className="header">
        <h1>LeetCode Problems</h1>
        {isAuthenticated && (
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="btn btn-primary"
          >
            {showAddForm ? 'Cancel' : '+ Add Problem'}
          </button>
        )}
      </div>

      {showAddForm && (
        <div className="add-form-section">
          <AddProblemForm
            onSuccess={handleAddSuccess}
            onCancel={() => setShowAddForm(false)}
          />
        </div>
      )}

      <ProblemFilters filters={filters} onFilterChange={setFilters} />

      <div className="problems-stats">
        <p>
          Showing {filteredProblems.length} of {problems.length} problems
        </p>
      </div>

      {filteredProblems.length === 0 ? (
        <div className="no-problems">
          <p>No problems found matching your filters.</p>
        </div>
      ) : (
        <div className="problems-grid">
          {filteredProblems.map((problem) => (
            <ProblemCard
              key={problem.id}
              problem={problem}
              onTrack={onTrackProblem}
            />
          ))}
        </div>
      )}

      <style jsx>{`
        .problem-list-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        h1 {
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
        }

        .btn-primary:hover {
          background: #45a049;
        }

        .add-form-section {
          margin-bottom: 2rem;
        }

        .problems-stats {
          margin: 1rem 0;
          color: #666;
        }

        .problems-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 1.5rem;
        }

        .loading,
        .no-problems {
          text-align: center;
          padding: 3rem;
          color: #666;
        }

        .error-container {
          text-align: center;
          padding: 3rem;
        }

        .error-text {
          color: #f44336;
          margin-bottom: 1rem;
        }

        @media (max-width: 768px) {
          .problem-list-container {
            padding: 1rem;
          }

          .header {
            flex-direction: column;
            align-items: stretch;
            gap: 1rem;
          }

          .problems-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default ProblemList;
