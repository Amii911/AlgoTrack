import { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../contexts/AuthContext';

const SignupSchema = Yup.object().shape({
  user_name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .required('Name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    )
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Please confirm your password'),
});

const PasswordRequirements = ({ password }) => {
  const requirements = [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'One uppercase letter (A-Z)', met: /[A-Z]/.test(password) },
    { label: 'One lowercase letter (a-z)', met: /[a-z]/.test(password) },
    { label: 'One number (0-9)', met: /\d/.test(password) },
    { label: 'One special character (!@#$%^&*)', met: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
  ];

  return (
    <div className="bg-slate-700/50 rounded p-3 mt-2">
      <p className="text-xs text-gray-400 font-medium mb-2">Password must have:</p>
      <ul className="list-none m-0 p-0 grid gap-1">
        {requirements.map((req, index) => (
          <li
            key={index}
            className={`text-xs flex items-center gap-2 ${req.met ? 'text-green-400' : 'text-gray-500'}`}
          >
            <span className="font-bold w-4">{req.met ? '✓' : '•'}</span>
            {req.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

const SignupForm = ({ onSuccess, onSwitchToLogin }) => {
  const { register, checkAuthStatus } = useAuth();
  const [error, setError] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleGoogleSignup = () => {
    setIsGoogleLoading(true);
    const width = 500;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    window.open(
      '/google/',
      'Google Signup',
      `width=${width},height=${height},left=${left},top=${top}`
    );
  };

  useEffect(() => {
    const handleMessage = async (event) => {
      if (event.data && event.data.url) {
        setIsGoogleLoading(false);
        await checkAuthStatus();
        if (onSuccess) onSuccess();
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [checkAuthStatus, onSuccess]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setError('');
      const { confirmPassword, ...userData } = values;
      await register(userData);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-center mb-6 text-white text-2xl font-semibold">Create Your Account</h2>

      {error && (
        <div className="bg-red-500/20 text-red-400 p-3 rounded mb-4 border border-red-500/30">
          {error}
        </div>
      )}

      <Formik
        initialValues={{
          user_name: '',
          email: '',
          password: '',
          confirmPassword: '',
        }}
        validationSchema={SignupSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="mb-4">
              <label htmlFor="user_name" className="block mb-2 font-medium text-gray-300">
                Name
              </label>
              <Field
                type="text"
                name="user_name"
                id="user_name"
                placeholder="Enter your name"
                className="form-input"
              />
              <ErrorMessage name="user_name" component="div" className="text-red-400 text-sm mt-1" />
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block mb-2 font-medium text-gray-300">
                Email
              </label>
              <Field
                type="email"
                name="email"
                id="email"
                placeholder="Enter your email"
                className="form-input"
              />
              <ErrorMessage name="email" component="div" className="text-red-400 text-sm mt-1" />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block mb-2 font-medium text-gray-300">
                Password
              </label>
              <Field
                type="password"
                name="password"
                id="password"
                placeholder="Create a password"
                className="form-input"
                onKeyUp={(e) => setPasswordValue(e.target.value)}
              />
              <PasswordRequirements password={passwordValue} />
              <ErrorMessage name="password" component="div" className="text-red-400 text-sm mt-1" />
            </div>

            <div className="mb-4">
              <label htmlFor="confirmPassword" className="block mb-2 font-medium text-gray-300">
                Confirm Password
              </label>
              <Field
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                placeholder="Confirm your password"
                className="form-input"
              />
              <ErrorMessage name="confirmPassword" component="div" className="text-red-400 text-sm mt-1" />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary w-full py-3"
            >
              {isSubmitting ? 'Creating Account...' : 'Sign Up'}
            </button>
          </Form>
        )}
      </Formik>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-600"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-slate-800 text-gray-400">or</span>
        </div>
      </div>

      <button
        type="button"
        onClick={handleGoogleSignup}
        disabled={isGoogleLoading}
        className="w-full py-3 px-4 border border-slate-600 rounded-lg flex items-center justify-center gap-3 bg-slate-700 hover:bg-slate-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        <span className="font-medium text-gray-200">
          {isGoogleLoading ? 'Connecting...' : 'Continue with Google'}
        </span>
      </button>

      <div className="text-center mt-6">
        <p className="text-gray-400">
          Already have an account?{' '}
          <button onClick={onSwitchToLogin} className="text-blue-400 underline bg-transparent border-none cursor-pointer">
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;
