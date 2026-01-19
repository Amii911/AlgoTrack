const ProfileStats = ({ userProblems, allProblems }) => {
  const calculateStats = () => {
    const stats = {
      total: userProblems.length,
      completed: 0,
      attempted: 0,
      skipped: 0,
      byDifficulty: { Easy: 0, Medium: 0, Hard: 0 },
      byCategory: {},
    };

    userProblems.forEach((up) => {
      const status = up.status?.toLowerCase();
      if (status === 'completed') stats.completed++;
      else if (status === 'attempted') stats.attempted++;
      else if (status === 'skipped') stats.skipped++;

      const problem = allProblems.find((p) => p.id === up.problem_id);
      if (problem) {
        if (problem.difficulty in stats.byDifficulty) {
          stats.byDifficulty[problem.difficulty]++;
        }
        const category = problem.category;
        stats.byCategory[category] = (stats.byCategory[category] || 0) + 1;
      }
    });

    return stats;
  };

  const stats = calculateStats();
  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  const topCategories = Object.entries(stats.byCategory)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="bg-white p-8 rounded-lg shadow-md mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Statistics</h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="p-6 rounded-lg text-center text-white bg-gradient-to-br from-indigo-500 to-purple-600 hover:-translate-y-0.5 transition-all">
          <div className="text-4xl font-bold mb-2">{stats.total}</div>
          <div className="text-sm opacity-90">Total Problems</div>
        </div>
        <div className="p-6 rounded-lg text-center text-white bg-gradient-to-br from-green-500 to-green-600 hover:-translate-y-0.5 transition-all">
          <div className="text-4xl font-bold mb-2">{stats.completed}</div>
          <div className="text-sm opacity-90">Completed</div>
        </div>
        <div className="p-6 rounded-lg text-center text-white bg-gradient-to-br from-orange-500 to-orange-600 hover:-translate-y-0.5 transition-all">
          <div className="text-4xl font-bold mb-2">{stats.attempted}</div>
          <div className="text-sm opacity-90">Attempted</div>
        </div>
        <div className="p-6 rounded-lg text-center text-white bg-gradient-to-br from-gray-500 to-gray-600 hover:-translate-y-0.5 transition-all">
          <div className="text-4xl font-bold mb-2">{stats.skipped}</div>
          <div className="text-sm opacity-90">Skipped</div>
        </div>
      </div>

      {/* Completion Rate */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="font-semibold text-gray-600">Completion Rate</span>
          <span className="text-xl font-bold text-primary">{completionRate}%</span>
        </div>
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-500 to-green-400 transition-all duration-300"
            style={{ width: `${completionRate}%` }}
          />
        </div>
      </div>

      {/* By Difficulty */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">By Difficulty</h3>
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border-l-4 border-green-500">
            <span className="font-medium text-gray-800">Easy</span>
            <span className="font-bold text-gray-600 bg-white px-3 py-1 rounded-full">{stats.byDifficulty.Easy}</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border-l-4 border-orange-500">
            <span className="font-medium text-gray-800">Medium</span>
            <span className="font-bold text-gray-600 bg-white px-3 py-1 rounded-full">{stats.byDifficulty.Medium}</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border-l-4 border-red-500">
            <span className="font-medium text-gray-800">Hard</span>
            <span className="font-bold text-gray-600 bg-white px-3 py-1 rounded-full">{stats.byDifficulty.Hard}</span>
          </div>
        </div>
      </div>

      {/* Top Categories */}
      {topCategories.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Top Categories</h3>
          <div className="flex flex-col gap-3">
            {topCategories.map(([category, count]) => (
              <div key={category} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-800">{category}</span>
                <span className="font-bold text-gray-600 bg-white px-3 py-1 rounded-full">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileStats;
