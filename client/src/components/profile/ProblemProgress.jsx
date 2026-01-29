import { useState } from 'react';
import problemService from '../../services/problemService';

const ProblemProgress = ({ userProblem, problemDetails, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    status: userProblem.status,
    notes: userProblem.notes || '',
    num_attempts: userProblem.num_attempts || 1,
  });
  const [loading, setLoading] = useState(false);

  const getStatusClasses = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-500/20 text-green-400';
      case 'attempted':
        return 'bg-orange-500/20 text-orange-400';
      case 'skipped':
        return 'bg-slate-600/50 text-gray-400';
      default:
        return 'bg-blue-500/20 text-blue-400';
    }
  };

  const getDifficultyClasses = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return 'text-green-400 bg-green-500/20';
      case 'medium':
        return 'text-orange-400 bg-orange-500/20';
      case 'hard':
        return 'text-red-400 bg-red-500/20';
      default:
        return 'text-gray-400 bg-slate-600/50';
    }
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      await problemService.updateUserProblem(
        userProblem.user_id,
        userProblem.problem_id,
        formData
      );
      if (onUpdate) onUpdate();
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update progress:', error);
      alert('Failed to update progress');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to remove this problem from your tracking?')) {
      try {
        setLoading(true);
        await problemService.deleteUserProblem(
          userProblem.user_id,
          userProblem.problem_id
        );
        if (onDelete) onDelete();
      } catch (error) {
        console.error('Failed to delete:', error);
        alert('Failed to delete problem');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 mb-4 hover:border-blue-500/30 transition-all">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="m-0 mb-2 text-lg font-semibold">
            <a
              href={problemDetails?.problem_link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white no-underline hover:text-blue-400 transition-colors"
            >
              {problemDetails?.problem_name || 'Problem'}
            </a>
          </h3>
          <div className="flex gap-2 flex-wrap text-sm">
            <span className={`px-2 py-1 rounded-md font-medium ${getDifficultyClasses(problemDetails?.difficulty)}`}>
              {problemDetails?.difficulty}
            </span>
            <span className="px-2 py-1 rounded-md bg-slate-700 text-gray-400">
              {problemDetails?.category}
            </span>
          </div>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="ml-4 px-4 py-2 bg-transparent border border-slate-600 rounded-lg text-sm font-medium text-gray-300 hover:border-blue-500 hover:text-blue-400 transition-all"
        >
          {isEditing ? 'Cancel' : 'Edit'}
        </button>
      </div>

      {isEditing ? (
        <div className="mt-4 pt-4 border-t border-slate-700 space-y-4">
          <div>
            <label className="block mb-2 font-medium text-gray-300">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-4 py-3 border border-slate-600 rounded-lg text-base bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer"
            >
              <option value="Attempted">Attempted</option>
              <option value="Completed">Completed</option>
              <option value="Skipped">Skipped</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-300">Number of Attempts</label>
            <input
              type="number"
              min="1"
              value={formData.num_attempts}
              onChange={(e) =>
                setFormData({ ...formData, num_attempts: parseInt(e.target.value) })
              }
              className="w-full px-4 py-3 border border-slate-600 rounded-lg text-base bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-300">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Add your notes, approach, or learnings..."
              className="w-full px-4 py-3 border border-slate-600 rounded-lg text-base bg-slate-700 text-white resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-gray-500"
              rows="4"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleUpdate}
              disabled={loading}
              className="px-5 py-2.5 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="px-5 py-2.5 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Delete
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-4">
          <span className={`inline-block px-3 py-1.5 rounded-lg font-semibold text-sm mb-4 ${getStatusClasses(userProblem.status)}`}>
            {userProblem.status}
          </span>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-slate-700/50 rounded-lg p-3">
              <span className="block text-gray-500 text-xs uppercase tracking-wide mb-1">Attempts</span>
              <span className="text-white font-semibold">{userProblem.num_attempts}</span>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-3">
              <span className="block text-gray-500 text-xs uppercase tracking-wide mb-1">Date</span>
              <span className="text-white font-semibold">{userProblem.date_attempted}</span>
            </div>
          </div>
          {userProblem.notes && (
            <div className="mt-4 pt-4 border-t border-slate-700">
              <span className="block text-gray-500 text-xs uppercase tracking-wide mb-2">Notes</span>
              <p className="m-0 text-gray-300 leading-relaxed whitespace-pre-wrap">{userProblem.notes}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProblemProgress;
