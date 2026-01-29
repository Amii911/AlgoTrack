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
    return <div className="text-center py-12 text-gray-600 bg-white rounded-lg shadow-md">Loading tracked problems...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-md">
        <p className="text-red-500 mb-4">{error}</p>
        <button onClick={fetchTrackedProblems} className="btn btn-primary">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
        <h2 className="text-2xl font-bold text-gray-800 m-0">Tracked Problems</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn btn-primary"
        >
          {showAddForm ? 'Cancel' : '+ Track New Problem'}
        </button>
      </div>

      {showAddForm && (
        <div className="mb-8">
          <AddProgressForm
            onSuccess={handleAddSuccess}
            onCancel={() => setShowAddForm(false)}
          />
        </div>
      )}

      <div className="bg-white p-6 rounded-lg mb-6 shadow-md">
        <div className="font-semibold mb-3 text-gray-600">Filter by Status:</div>
        <div className="flex gap-2 flex-wrap">
          {['All', 'Attempted', 'Completed', 'Skipped'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 border rounded text-sm cursor-pointer transition-all ${
                filterStatus === status
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-primary hover:text-primary'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {filteredProblems.length === 0 ? (
        <div className="text-center py-12 text-gray-600 bg-white rounded-lg shadow-md">
          <p>
            {userProblems.length === 0
              ? "You haven't tracked any problems yet. Start tracking to see your progress!"
              : `No ${filterStatus.toLowerCase()} problems found.`}
          </p>
        </div>
      ) : (
        <div className="flex flex-col">
          <div className="mb-4 text-gray-600 text-sm">
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
    </div>
  );
};

export default TrackedProblems;
