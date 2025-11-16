const ProblemFilters = ({ filters, onFilterChange }) => {
  const difficulties = ['All', 'Easy', 'Medium', 'Hard'];
  const categories = [
    'All',
    'Arrays',
    'Strings',
    'Linked Lists',
    'Trees',
    'Graphs',
    'Dynamic Programming',
    'Backtracking',
    'Greedy',
    'Sorting',
    'Searching',
    'Hash Tables',
    'Stacks',
    'Queues',
  ];

  const handleDifficultyChange = (difficulty) => {
    onFilterChange({
      ...filters,
      difficulty: difficulty === 'All' ? '' : difficulty,
    });
  };

  const handleCategoryChange = (category) => {
    onFilterChange({
      ...filters,
      category: category === 'All' ? '' : category,
    });
  };

  const handleSearchChange = (e) => {
    onFilterChange({
      ...filters,
      search: e.target.value,
    });
  };

  return (
    <div className="filters-container">
      <div className="search-box">
        <input
          type="text"
          placeholder="Search problems..."
          value={filters.search || ''}
          onChange={handleSearchChange}
          className="search-input"
        />
      </div>

      <div className="filter-group">
        <label className="filter-label">Difficulty:</label>
        <div className="filter-buttons">
          {difficulties.map((diff) => (
            <button
              key={diff}
              onClick={() => handleDifficultyChange(diff)}
              className={`filter-btn ${
                (diff === 'All' && !filters.difficulty) ||
                filters.difficulty === diff
                  ? 'active'
                  : ''
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <label className="filter-label">Category:</label>
        <select
          value={filters.category || 'All'}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="category-select"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <style jsx>{`
        .filters-container {
          background: white;
          padding: 1.5rem;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          margin-bottom: 2rem;
        }

        .search-box {
          margin-bottom: 1.5rem;
        }

        .search-input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1rem;
        }

        .search-input:focus {
          outline: none;
          border-color: #4CAF50;
        }

        .filter-group {
          margin-bottom: 1rem;
        }

        .filter-group:last-child {
          margin-bottom: 0;
        }

        .filter-label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: #333;
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

        .category-select {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1rem;
          background: white;
          cursor: pointer;
        }

        .category-select:focus {
          outline: none;
          border-color: #4CAF50;
        }
      `}</style>
    </div>
  );
};

export default ProblemFilters;
