import { useState } from 'react';
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
    <div className="bg-gray-50 rounded p-3 mt-2">
      <p className="text-xs text-gray-600 font-medium mb-2">Password must have:</p>
      <ul className="list-none m-0 p-0 grid gap-1">
        {requirements.map((req, index) => (
          <li
            key={index}
            className={`text-xs flex items-center gap-2 ${req.met ? 'text-green-600' : 'text-gray-400'}`}
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
  const { register } = useAuth();
  const [error, setError] = useState('');
  const [passwordValue, setPasswordValue] = useState('');

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
      <h2 className="text-center mb-6 text-gray-800 text-2xl font-semibold">Create Your Account</h2>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded mb-4">
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
              <label htmlFor="user_name" className="block mb-2 font-medium text-gray-600">
                Name
              </label>
              <Field
                type="text"
                name="user_name"
                id="user_name"
                placeholder="Enter your name"
                className="form-input"
              />
              <ErrorMessage name="user_name" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block mb-2 font-medium text-gray-600">
                Email
              </label>
              <Field
                type="email"
                name="email"
                id="email"
                placeholder="Enter your email"
                className="form-input"
              />
              <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block mb-2 font-medium text-gray-600">
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
              <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            <div className="mb-4">
              <label htmlFor="confirmPassword" className="block mb-2 font-medium text-gray-600">
                Confirm Password
              </label>
              <Field
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                placeholder="Confirm your password"
                className="form-input"
              />
              <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-sm mt-1" />
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

      <div className="text-center mt-6">
        <p className="text-gray-600">
          Already have an account?{' '}
          <button onClick={onSwitchToLogin} className="text-primary underline bg-transparent border-none cursor-pointer">
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;
