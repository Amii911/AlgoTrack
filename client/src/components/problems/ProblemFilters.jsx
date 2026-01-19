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
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search problems..."
          value={filters.search || ''}
          onChange={handleSearchChange}
          className="form-input"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-semibold text-gray-800">Difficulty:</label>
        <div className="flex gap-2 flex-wrap">
          {difficulties.map((diff) => (
            <button
              key={diff}
              onClick={() => handleDifficultyChange(diff)}
              className={`px-4 py-2 border rounded text-sm cursor-pointer transition-all ${
                (diff === 'All' && !filters.difficulty) || filters.difficulty === diff
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-primary hover:text-primary'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block mb-2 font-semibold text-gray-800">Category:</label>
        <select
          value={filters.category || 'All'}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="form-input cursor-pointer"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ProblemFilters;
