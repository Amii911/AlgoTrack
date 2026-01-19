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
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*(),.?":{}|<>)'
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
    <div className="password-requirements">
      <p className="requirements-title">Password must have:</p>
      <ul className="requirements-list">
        {requirements.map((req, index) => (
          <li key={index} className={req.met ? 'met' : 'unmet'}>
            <span className="requirement-icon">{req.met ? '\u2713' : '\u2022'}</span>
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
    <div className="signup-form">
      <h2>Create Your Account</h2>

      {error && (
        <div className="error-message" style={{ color: 'red', marginBottom: '1rem' }}>
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
            <div className="form-group">
              <label htmlFor="user_name">Name</label>
              <Field
                type="text"
                name="user_name"
                id="user_name"
                placeholder="Enter your name"
                className="form-input"
              />
              <ErrorMessage name="user_name" component="div" className="field-error" />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <Field
                type="email"
                name="email"
                id="email"
                placeholder="Enter your email"
                className="form-input"
              />
              <ErrorMessage name="email" component="div" className="field-error" />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <Field
                type="password"
                name="password"
                id="password"
                placeholder="Create a password"
                className="form-input"
                onKeyUp={(e) => setPasswordValue(e.target.value)}
              />
              <PasswordRequirements password={passwordValue} />
              <ErrorMessage name="password" component="div" className="field-error" />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <Field
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                placeholder="Confirm your password"
                className="form-input"
              />
              <ErrorMessage name="confirmPassword" component="div" className="field-error" />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary"
            >
              {isSubmitting ? 'Creating Account...' : 'Sign Up'}
            </button>
          </Form>
        )}
      </Formik>

      <div className="auth-switch">
        <p>
          Already have an account?{' '}
          <button onClick={onSwitchToLogin} className="link-button">
            Login
          </button>
        </p>
      </div>

      <style jsx>{`
        .signup-form {
          max-width: 400px;
          margin: 0 auto;
        }

        h2 {
          text-align: center;
          margin-bottom: 1.5rem;
          color: #333;
        }

        .form-group {
          margin-bottom: 1rem;
        }

        label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: #555;
        }

        .form-input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1rem;
        }

        .form-input:focus {
          outline: none;
          border-color: #4CAF50;
        }

        .field-error {
          color: #f44336;
          font-size: 0.875rem;
          margin-top: 0.25rem;
        }

        .password-requirements {
          background: #f8f9fa;
          border-radius: 4px;
          padding: 0.75rem;
          margin-top: 0.5rem;
        }

        .requirements-title {
          font-size: 0.8rem;
          color: #666;
          margin: 0 0 0.5rem 0;
          font-weight: 500;
        }

        .requirements-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: grid;
          gap: 0.25rem;
        }

        .requirements-list li {
          font-size: 0.75rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .requirements-list li.met {
          color: #4CAF50;
        }

        .requirements-list li.unmet {
          color: #999;
        }

        .requirement-icon {
          font-weight: bold;
          width: 1rem;
        }

        .btn {
          width: 100%;
          padding: 0.75rem;
          border: none;
          border-radius: 4px;
          font-size: 1rem;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .btn-primary {
          background-color: #4CAF50;
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          background-color: #45a049;
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .auth-switch {
          text-align: center;
          margin-top: 1.5rem;
        }

        .link-button {
          background: none;
          border: none;
          color: #4CAF50;
          text-decoration: underline;
          cursor: pointer;
          font-size: inherit;
        }

        .link-button:hover {
          color: #45a049;
        }
      `}</style>
    </div>
  );
};

export default SignupForm;
