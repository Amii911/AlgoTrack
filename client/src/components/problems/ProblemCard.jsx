import { useAuth } from '../../contexts/AuthContext';

const ProblemCard = ({ problem, onTrack }) => {
  const { isAuthenticated } = useAuth();

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return '#4CAF50';
      case 'medium':
        return '#FF9800';
      case 'hard':
        return '#f44336';
      default:
        return '#999';
    }
  };

  const handleTrackClick = () => {
    if (onTrack) {
      onTrack(problem);
    }
  };

  return (
    <div className="problem-card">
      <div className="problem-header">
        <h3 className="problem-title">
          <a href={problem.problem_link} target="_blank" rel="noopener noreferrer">
            {problem.problem_name}
          </a>
        </h3>
        <span
          className="problem-difficulty"
          style={{ backgroundColor: getDifficultyColor(problem.difficulty) }}
        >
          {problem.difficulty}
        </span>
      </div>

      <div className="problem-details">
        <span className="problem-category">📚 {problem.category}</span>
      </div>

      {isAuthenticated && (
        <div className="problem-actions">
          <button onClick={handleTrackClick} className="btn btn-track">
            + Track Progress
          </button>
        </div>
      )}

      <style jsx>{`
        .problem-card {
          background: white;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 1.5rem;
          transition: box-shadow 0.2s, transform 0.2s;
        }

        .problem-card:hover {
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          transform: translateY(-2px);
        }

        .problem-header {
          display: flex;
          justify-content: space-between;
          align-items: start;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .problem-title {
          margin: 0;
          font-size: 1.125rem;
          flex: 1;
        }

        .problem-title a {
          color: #333;
          text-decoration: none;
        }

        .problem-title a:hover {
          color: #4CAF50;
        }

        .problem-difficulty {
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
          color: white;
          white-space: nowrap;
        }

        .problem-details {
          margin-bottom: 1rem;
        }

        .problem-category {
          color: #666;
          font-size: 0.875rem;
        }

        .problem-actions {
          display: flex;
          gap: 0.5rem;
        }

        .btn-track {
          background: #4CAF50;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          font-size: 0.875rem;
          cursor: pointer;
          transition: background 0.2s;
        }

        .btn-track:hover {
          background: #45a049;
        }
      `}</style>
    </div>
  );
};

export default ProblemCard;
