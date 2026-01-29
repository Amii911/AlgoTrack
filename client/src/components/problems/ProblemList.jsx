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

    if (filters.search) {
      filtered = filtered.filter((problem) =>
        problem.problem_name.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.difficulty) {
      filtered = filtered.filter(
        (problem) => problem.difficulty === filters.difficulty
      );
    }

    if (filters.category) {
      filtered = filtered.filter(
        (problem) => problem.category === filters.category
      );
    }

    setFilteredProblems(filtered);
  };

  const handleAddSuccess = () => {
    setShowAddForm(false);
    fetchProblems();
  };

  if (loading) {
    return <div className="text-center py-12 text-gray-400">Loading problems...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400 mb-4">{error}</p>
        <button onClick={fetchProblems} className="btn btn-primary">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
        <h1 className="text-3xl font-bold text-white m-0">LeetCode Problems</h1>
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
        <div className="mb-8">
          <AddProblemForm
            onSuccess={handleAddSuccess}
            onCancel={() => setShowAddForm(false)}
          />
        </div>
      )}

      <ProblemFilters filters={filters} onFilterChange={setFilters} />

      <div className="my-4 text-gray-400">
        <p>Showing {filteredProblems.length} of {problems.length} problems</p>
      </div>

      {filteredProblems.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p>No problems found matching your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProblems.map((problem) => (
            <ProblemCard
              key={problem.id}
              problem={problem}
              onTrack={onTrackProblem}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProblemList;
