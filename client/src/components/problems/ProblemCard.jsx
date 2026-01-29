import { useAuth } from '../../contexts/AuthContext';

const ProblemCard = ({ problem, onTrack }) => {
  const { isAuthenticated } = useAuth();

  const getDifficultyClass = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return 'bg-green-500/20 text-green-400 border border-green-500/30';
      case 'medium':
        return 'bg-orange-500/20 text-orange-400 border border-orange-500/30';
      case 'hard':
        return 'bg-red-500/20 text-red-400 border border-red-500/30';
      default:
        return 'bg-slate-600/50 text-gray-400';
    }
  };

  const handleTrackClick = () => {
    if (onTrack) {
      onTrack(problem);
    }
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-0.5 hover:border-blue-500/50 transition-all">
      <div className="flex justify-between items-start gap-4 mb-4">
        <h3 className="text-lg font-semibold flex-1 m-0">
          <a
            href={problem.problem_link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white no-underline hover:text-blue-400"
          >
            {problem.problem_name}
          </a>
        </h3>
        <span
          className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap ${getDifficultyClass(problem.difficulty)}`}
        >
          {problem.difficulty}
        </span>
      </div>

      <div className="mb-4">
        <span className="text-gray-400 text-sm">📚 {problem.category}</span>
      </div>

      {isAuthenticated && (
        <div className="flex gap-2">
          <button onClick={handleTrackClick} className="btn btn-primary text-sm">
            + Track Progress
          </button>
        </div>
      )}
    </div>
  );
};

export default ProblemCard;
