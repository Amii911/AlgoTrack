import { useAuth } from '../../contexts/AuthContext';

const ProblemCard = ({ problem, onTrack }) => {
  const { isAuthenticated } = useAuth();

  const getDifficultyClass = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return 'bg-green-500';
      case 'medium':
        return 'bg-orange-500';
      case 'hard':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handleTrackClick = () => {
    if (onTrack) {
      onTrack(problem);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all">
      <div className="flex justify-between items-start gap-4 mb-4">
        <h3 className="text-lg font-semibold flex-1 m-0">
          <a
            href={problem.problem_link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-800 no-underline hover:text-primary"
          >
            {problem.problem_name}
          </a>
        </h3>
        <span
          className={`px-3 py-1 rounded-xl text-xs font-semibold text-white whitespace-nowrap ${getDifficultyClass(problem.difficulty)}`}
        >
          {problem.difficulty}
        </span>
      </div>

      <div className="mb-4">
        <span className="text-gray-600 text-sm">📚 {problem.category}</span>
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
