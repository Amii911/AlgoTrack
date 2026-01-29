import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from '../components/auth/AuthModal';

const Home = () => {
  const { isAuthenticated, user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');

  const handleAuthClick = (mode) => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-cyan-600 text-white py-16 px-8 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold mb-4">AlgoTrack</h1>
          <p className="text-2xl mb-4 opacity-95">
            Track Your Journey & Master Data Structures & Algorithms
          </p>
          <p className="text-lg mb-8 opacity-90 leading-relaxed">
            Keep track of all your problem-solving progress in one place. Monitor your attempts,
            save notes, and visualize your improvement over time.
          </p>

          {!isAuthenticated ? (
            <div className="flex gap-4 justify-center flex-wrap">
              <button
                onClick={() => handleAuthClick('signup')}
                className="px-8 py-4 bg-white text-blue-600 rounded-lg text-lg font-semibold hover:-translate-y-0.5 hover:shadow-lg transition-all"
              >
                Get Started
              </button>
              <button
                onClick={() => handleAuthClick('login')}
                className="px-8 py-4 bg-transparent text-white border-2 border-white rounded-lg text-lg font-semibold hover:bg-white/10 transition-all"
              >
                Log In
              </button>
            </div>
          ) : (
            <div className="mt-8">
              <h2 className="text-3xl font-semibold mb-2">Welcome back, {user.user_name}!</h2>
              <p className="text-lg opacity-90">Ready to tackle some problems?</p>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-8 max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12 text-white">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { icon: '📊', title: 'Track Your Progress', desc: 'Monitor your problem-solving journey with detailed statistics and completion rates.' },
            { icon: '📝', title: 'Save Your Notes', desc: 'Document your approach, learnings, and insights for each problem you solve.' },
            { icon: '🎯', title: 'Set Your Status', desc: 'Mark problems as attempted, completed, or skipped to organize your learning path.' },
            { icon: '📚', title: 'Browse Problems', desc: 'Explore a curated collection of LeetCode problems organized by difficulty and category.' },
            { icon: '🔍', title: 'Filter & Search', desc: 'Quickly find problems by name, difficulty level, or category to focus your practice.' },
            { icon: '📈', title: 'Visualize Growth', desc: 'See your improvement with visual stats showing completion by difficulty and topic.' },
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-slate-800 p-8 rounded-xl border border-slate-700 text-center hover:-translate-y-2 hover:shadow-xl hover:border-blue-500/50 transition-all"
            >
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-slate-900 py-16 px-8">
        <h2 className="text-4xl font-bold text-center mb-12 text-white">How It Works</h2>
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { num: 1, title: 'Create an Account', desc: 'Sign up with your email or use Google OAuth to get started quickly.' },
            { num: 2, title: 'Browse Problems', desc: 'Explore our collection of LeetCode problems or add your own favorites.' },
            { num: 3, title: 'Track Your Attempts', desc: 'Mark problems as you work on them and add notes about your solutions.' },
            { num: 4, title: 'Monitor Progress', desc: 'View your statistics and track your improvement over time.' },
          ].map((step, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                {step.num}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">{step.title}</h3>
              <p className="text-gray-400 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          initialMode={authMode}
          onClose={() => setShowAuthModal(false)}
        />
      )}
    </div>
  );
};

export default Home;
