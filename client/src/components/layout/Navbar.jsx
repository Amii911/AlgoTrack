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
      <nav className="bg-white shadow-md py-4">
        <div className="max-w-6xl mx-auto px-8 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-primary flex items-center gap-2 no-underline hover:no-underline">
            <span className="text-3xl">📊</span>
            AlgoTrack
          </Link>

          <ul className="flex items-center gap-6 list-none m-0 p-0">
            <li>
              <Link to="/problems" className="text-gray-800 font-medium hover:text-primary no-underline">
                Problems
              </Link>
            </li>

            {isAuthenticated ? (
              <>
                <li>
                  <Link to="/profile" className="text-gray-800 font-medium hover:text-primary no-underline">
                    My Progress
                  </Link>
                </li>
                <li>
                  <span className="text-gray-600 font-medium">Hi, {user?.user_name}!</span>
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
                    Log In
                  </button>
                </li>
                <li>
                  <button onClick={handleSignupClick} className="btn btn-primary">
                    Sign In
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
    </>
  );
};

export default Navbar;
