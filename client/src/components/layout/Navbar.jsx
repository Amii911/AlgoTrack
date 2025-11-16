import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import AuthModal from '../auth/AuthModal';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');

  const handleLoginClick = () => {
    setAuthModalMode('login');
    setIsAuthModalOpen(true);
  };

  const handleSignupClick = () => {
    setAuthModalMode('signup');
    setIsAuthModalOpen(true);
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <>
      <nav className="navbar">
        <div className="nav-container">
          <Link to="/" className="nav-logo">
            <span className="logo-icon">📊</span>
            AlgoTrack
          </Link>

          <ul className="nav-menu">
            <li>
              <Link to="/" className="nav-link">Problems</Link>
            </li>

            {isAuthenticated ? (
              <>
                <li>
                  <Link to="/profile" className="nav-link">My Progress</Link>
                </li>
                <li>
                  <span className="user-greeting">Hi, {user?.user_name}!</span>
                </li>
                <li>
                  <button onClick={handleLogout} className="btn btn-outline">
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <button onClick={handleLoginClick} className="btn btn-outline">
                    Login
                  </button>
                </li>
                <li>
                  <button onClick={handleSignupClick} className="btn btn-primary">
                    Sign Up
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
      />

      <style jsx>{`
        .navbar {
          background-color: #fff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          padding: 1rem 0;
        }

        .nav-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .nav-logo {
          font-size: 1.5rem;
          font-weight: bold;
          color: #4CAF50;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .logo-icon {
          font-size: 1.75rem;
        }

        .nav-menu {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .nav-link {
          color: #333;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s;
        }

        .nav-link:hover {
          color: #4CAF50;
        }

        .user-greeting {
          color: #666;
          font-weight: 500;
        }

        .btn {
          padding: 0.5rem 1rem;
          border-radius: 4px;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
        }

        .btn-outline {
          background: white;
          color: #4CAF50;
          border: 1px solid #4CAF50;
        }

        .btn-outline:hover {
          background: #f1f8f4;
        }

        .btn-primary {
          background: #4CAF50;
          color: white;
          border: 1px solid #4CAF50;
        }

        .btn-primary:hover {
          background: #45a049;
        }
      `}</style>
    </>
  );
};

export default Navbar;
