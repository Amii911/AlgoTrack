import { SignUp } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

const ClerkSignUp = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-white/80">Sign up to start tracking your progress</p>
        </div>
        <SignUp
          routing="path"
          path="/clerk-sign-up"
          signInUrl="/clerk-sign-in"
          afterSignUpUrl="/profile"
          appearance={{
            elements: {
              rootBox: 'mx-auto',
              card: 'shadow-xl rounded-xl',
            },
          }}
        />
        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/')}
            className="text-white/80 hover:text-white underline text-sm"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClerkSignUp;
