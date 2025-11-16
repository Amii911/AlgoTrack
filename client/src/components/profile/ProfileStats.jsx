const ProfileStats = ({ userProblems, allProblems }) => {
  const calculateStats = () => {
    const stats = {
      total: userProblems.length,
      completed: 0,
      attempted: 0,
      skipped: 0,
      byDifficulty: {
        Easy: 0,
        Medium: 0,
        Hard: 0,
      },
      byCategory: {},
    };

    userProblems.forEach((up) => {
      // Status counts
      const status = up.status?.toLowerCase();
      if (status === 'completed') stats.completed++;
      else if (status === 'attempted') stats.attempted++;
      else if (status === 'skipped') stats.skipped++;

      // Find the problem details
      const problem = allProblems.find((p) => p.id === up.problem_id);
      if (problem) {
        // Difficulty counts
        if (problem.difficulty in stats.byDifficulty) {
          stats.byDifficulty[problem.difficulty]++;
        }

        // Category counts
        const category = problem.category;
        stats.byCategory[category] = (stats.byCategory[category] || 0) + 1;
      }
    });

    return stats;
  };

  const stats = calculateStats();
  const completionRate = stats.total > 0
    ? Math.round((stats.completed / stats.total) * 100)
    : 0;

  const topCategories = Object.entries(stats.byCategory)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="profile-stats">
      <h2>Your Statistics</h2>

      <div className="stats-grid">
        <div className="stat-card total">
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Total Problems</div>
        </div>

        <div className="stat-card completed">
          <div className="stat-value">{stats.completed}</div>
          <div className="stat-label">Completed</div>
        </div>

        <div className="stat-card attempted">
          <div className="stat-value">{stats.attempted}</div>
          <div className="stat-label">Attempted</div>
        </div>

        <div className="stat-card skipped">
          <div className="stat-value">{stats.skipped}</div>
          <div className="stat-label">Skipped</div>
        </div>
      </div>

      <div className="completion-rate">
        <div className="rate-header">
          <span className="rate-label">Completion Rate</span>
          <span className="rate-value">{completionRate}%</span>
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${completionRate}%` }}
          />
        </div>
      </div>

      <div className="stats-section">
        <h3>By Difficulty</h3>
        <div className="difficulty-stats">
          <div className="difficulty-item easy">
            <span className="difficulty-name">Easy</span>
            <span className="difficulty-count">{stats.byDifficulty.Easy}</span>
          </div>
          <div className="difficulty-item medium">
            <span className="difficulty-name">Medium</span>
            <span className="difficulty-count">{stats.byDifficulty.Medium}</span>
          </div>
          <div className="difficulty-item hard">
            <span className="difficulty-name">Hard</span>
            <span className="difficulty-count">{stats.byDifficulty.Hard}</span>
          </div>
        </div>
      </div>

      {topCategories.length > 0 && (
        <div className="stats-section">
          <h3>Top Categories</h3>
          <div className="category-stats">
            {topCategories.map(([category, count]) => (
              <div key={category} className="category-item">
                <span className="category-name">{category}</span>
                <span className="category-count">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        .profile-stats {
          background: white;
          padding: 2rem;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          margin-bottom: 2rem;
        }

        h2 {
          margin-top: 0;
          margin-bottom: 1.5rem;
          color: #333;
        }

        h3 {
          margin-top: 0;
          margin-bottom: 1rem;
          color: #555;
          font-size: 1rem;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          padding: 1.5rem;
          border-radius: 8px;
          text-align: center;
          transition: transform 0.2s;
        }

        .stat-card:hover {
          transform: translateY(-2px);
        }

        .stat-card.total {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .stat-card.completed {
          background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
          color: white;
        }

        .stat-card.attempted {
          background: linear-gradient(135deg, #FF9800 0%, #F57C00 100%);
          color: white;
        }

        .stat-card.skipped {
          background: linear-gradient(135deg, #9E9E9E 0%, #757575 100%);
          color: white;
        }

        .stat-value {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .stat-label {
          font-size: 0.875rem;
          opacity: 0.9;
        }

        .completion-rate {
          margin-bottom: 2rem;
        }

        .rate-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .rate-label {
          font-weight: 600;
          color: #555;
        }

        .rate-value {
          font-size: 1.25rem;
          font-weight: 700;
          color: #4CAF50;
        }

        .progress-bar {
          width: 100%;
          height: 12px;
          background: #f0f0f0;
          border-radius: 6px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #4CAF50 0%, #45a049 100%);
          transition: width 0.3s ease;
        }

        .stats-section {
          margin-bottom: 2rem;
        }

        .stats-section:last-child {
          margin-bottom: 0;
        }

        .difficulty-stats,
        .category-stats {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .difficulty-item,
        .category-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 1rem;
          border-radius: 6px;
          background: #f9f9f9;
        }

        .difficulty-item.easy {
          border-left: 4px solid #4CAF50;
        }

        .difficulty-item.medium {
          border-left: 4px solid #FF9800;
        }

        .difficulty-item.hard {
          border-left: 4px solid #f44336;
        }

        .difficulty-name,
        .category-name {
          font-weight: 500;
          color: #333;
        }

        .difficulty-count,
        .category-count {
          font-weight: 700;
          color: #666;
          background: white;
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
        }

        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .stat-value {
            font-size: 2rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ProfileStats;
