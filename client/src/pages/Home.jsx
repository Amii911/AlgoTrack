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
    <div className="home-container">
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">AlgoTrack</h1>
          <p className="hero-subtitle">
            Track Your Journey & Master Data Structures & Algorithms
          </p>
          <p className="hero-description">
            Keep track of all your problem-solving progress in one place. Monitor your attempts,
            save notes, and visualize your improvement over time.
          </p>

          {!isAuthenticated ? (
            <div className="cta-buttons">
              <button
                onClick={() => handleAuthClick('signup')}
                className="btn btn-primary"
              >
                Get Started
              </button>
              <button
                onClick={() => handleAuthClick('login')}
                className="btn btn-secondary"
              >
                Log In
              </button>
            </div>
          ) : (
            <div className="welcome-message">
              <h2>Welcome back, {user.user_name}! 👋</h2>
              <p>Ready to tackle some problems?</p>
            </div>
          )}
        </div>
      </section>

      <section className="features">
        <h2 className="features-title">Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Track Your Progress</h3>
            <p>
              Monitor your problem-solving journey with detailed statistics and completion rates.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📝</div>
            <h3>Save Your Notes</h3>
            <p>
              Document your approach, learnings, and insights for each problem you solve.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Set Your Status</h3>
            <p>
              Mark problems as attempted, completed, or skipped to organize your learning path.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📚</div>
            <h3>Browse Problems</h3>
            <p>
              Explore a curated collection of LeetCode problems organized by difficulty and category.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3>Filter & Search</h3>
            <p>
              Quickly find problems by name, difficulty level, or category to focus your practice.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📈</div>
            <h3>Visualize Growth</h3>
            <p>
              See your improvement with visual stats showing completion by difficulty and topic.
            </p>
          </div>
        </div>
      </section>

      <section className="how-it-works">
        <h2 className="section-title">How It Works</h2>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Create an Account</h3>
            <p>Sign up with your email or use Google OAuth to get started quickly.</p>
          </div>

          <div className="step">
            <div className="step-number">2</div>
            <h3>Browse Problems</h3>
            <p>Explore our collection of LeetCode problems or add your own favorites.</p>
          </div>

          <div className="step">
            <div className="step-number">3</div>
            <h3>Track Your Attempts</h3>
            <p>Mark problems as you work on them and add notes about your solutions.</p>
          </div>

          <div className="step">
            <div className="step-number">4</div>
            <h3>Monitor Progress</h3>
            <p>View your statistics and track your improvement over time.</p>
          </div>
        </div>
      </section>

      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          initialMode={authMode}
          onClose={() => setShowAuthModal(false)}
        />
      )}

      <style jsx>{`
        .home-container {
          min-height: 100vh;
        }

        .hero {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 4rem 2rem;
          text-align: center;
        }

        .hero-content {
          max-width: 800px;
          margin: 0 auto;
        }

        .hero-title {
          font-size: 3.5rem;
          margin: 0 0 1rem 0;
          font-weight: 700;
        }

        .hero-subtitle {
          font-size: 1.5rem;
          margin: 0 0 1rem 0;
          opacity: 0.95;
        }

        .hero-description {
          font-size: 1.125rem;
          margin: 0 0 2rem 0;
          opacity: 0.9;
          line-height: 1.6;
        }

        .cta-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .btn {
          padding: 1rem 2rem;
          border: none;
          border-radius: 8px;
          font-size: 1.125rem;
          cursor: pointer;
          transition: all 0.3s;
          font-weight: 600;
        }

        .btn-primary {
          background: white;
          color: #667eea;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
        }

        .btn-secondary {
          background: transparent;
          color: white;
          border: 2px solid white;
        }

        .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .welcome-message {
          margin-top: 2rem;
        }

        .welcome-message h2 {
          font-size: 2rem;
          margin: 0 0 0.5rem 0;
        }

        .welcome-message p {
          font-size: 1.125rem;
          opacity: 0.9;
          margin: 0;
        }

        .features {
          padding: 4rem 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .features-title,
        .section-title {
          text-align: center;
          font-size: 2.5rem;
          margin: 0 0 3rem 0;
          color: #333;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .feature-card {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          text-align: center;
          transition: transform 0.3s, box-shadow 0.3s;
        }

        .feature-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
        }

        .feature-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .feature-card h3 {
          margin: 0 0 1rem 0;
          color: #333;
          font-size: 1.25rem;
        }

        .feature-card p {
          margin: 0;
          color: #666;
          line-height: 1.6;
        }

        .how-it-works {
          background: #f9f9f9;
          padding: 4rem 2rem;
        }

        .steps {
          max-width: 1000px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
        }

        .step {
          text-align: center;
        }

        .step-number {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0 auto 1rem auto;
        }

        .step h3 {
          margin: 0 0 0.5rem 0;
          color: #333;
          font-size: 1.25rem;
        }

        .step p {
          margin: 0;
          color: #666;
          line-height: 1.6;
        }

        @media (max-width: 768px) {
          .hero {
            padding: 3rem 1rem;
          }

          .hero-title {
            font-size: 2.5rem;
          }

          .hero-subtitle {
            font-size: 1.25rem;
          }

          .features-grid {
            grid-template-columns: 1fr;
          }

          .steps {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;
