import { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../contexts/AuthContext';
import problemService from '../../services/problemService';

const AddProgressSchema = Yup.object().shape({
  problem_id: Yup.number()
    .required('Please select a problem'),
  status: Yup.string()
    .oneOf(['Attempted', 'Completed', 'Skipped'], 'Invalid status')
    .required('Status is required'),
  num_attempts: Yup.number()
    .min(1, 'Must be at least 1')
    .required('Number of attempts is required'),
  notes: Yup.string(),
});

const AddProgressForm = ({ onSuccess, onCancel }) => {
  const { user } = useAuth();
  const [error, setError] = useState('');
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAvailableProblems();
  }, []);

  const fetchAvailableProblems = async () => {
    try {
      setLoading(true);
      const allProblems = await problemService.getAllProblems();
      setProblems(allProblems);
    } catch (err) {
      setError('Failed to load problems');
      console.error('Error fetching problems:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      setError('');
      const today = new Date().toISOString().split('T')[0];

      await problemService.trackProblem({
        user_id: user.id,
        problem_id: values.problem_id,
        status: values.status,
        num_attempts: values.num_attempts,
        notes: values.notes || '',
        date_attempted: today,
      });

      resetForm();
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to track problem. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading problems...</div>;
  }

  return (
    <div className="add-progress-form">
      <h3>Start Tracking a Problem</h3>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <Formik
        initialValues={{
          problem_id: '',
          status: 'Attempted',
          num_attempts: 1,
          notes: '',
        }}
        validationSchema={AddProgressSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, values }) => (
          <Form>
            <div className="form-group">
              <label htmlFor="problem_id">Select Problem</label>
              <Field
                as="select"
                name="problem_id"
                id="problem_id"
                className="form-input"
              >
                <option value="">Choose a problem...</option>
                {problems.map((problem) => (
                  <option key={problem.id} value={problem.id}>
                    {problem.problem_name} ({problem.difficulty})
                  </option>
                ))}
              </Field>
              <ErrorMessage name="problem_id" component="div" className="field-error" />
            </div>

            {values.problem_id && (
              <div className="problem-preview">
                {problems.find(p => p.id === parseInt(values.problem_id))?.category}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="status">Status</label>
              <Field as="select" name="status" id="status" className="form-input">
                <option value="Attempted">Attempted</option>
                <option value="Completed">Completed</option>
                <option value="Skipped">Skipped</option>
              </Field>
              <ErrorMessage name="status" component="div" className="field-error" />
            </div>

            <div className="form-group">
              <label htmlFor="num_attempts">Number of Attempts</label>
              <Field
                type="number"
                name="num_attempts"
                id="num_attempts"
                min="1"
                className="form-input"
              />
              <ErrorMessage name="num_attempts" component="div" className="field-error" />
            </div>

            <div className="form-group">
              <label htmlFor="notes">Notes (Optional)</label>
              <Field
                as="textarea"
                name="notes"
                id="notes"
                placeholder="Add your approach, learnings, or notes..."
                className="form-textarea"
                rows="4"
              />
              <ErrorMessage name="notes" component="div" className="field-error" />
            </div>

            <div className="form-actions">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary"
              >
                {isSubmitting ? 'Adding...' : 'Start Tracking'}
              </button>
              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              )}
            </div>
          </Form>
        )}
      </Formik>

      <style jsx>{`
        .add-progress-form {
          background: white;
          padding: 2rem;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        h3 {
          margin-top: 0;
          margin-bottom: 1.5rem;
          color: #333;
        }

        .loading {
          text-align: center;
          padding: 2rem;
          color: #666;
        }

        .error-message {
          background: #ffebee;
          color: #c62828;
          padding: 0.75rem;
          border-radius: 4px;
          margin-bottom: 1rem;
        }

        .problem-preview {
          padding: 0.5rem;
          background: #f5f5f5;
          border-radius: 4px;
          margin-bottom: 1rem;
          font-size: 0.875rem;
          color: #666;
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

        .form-input,
        .form-textarea {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1rem;
        }

        .form-input:focus,
        .form-textarea:focus {
          outline: none;
          border-color: #4CAF50;
        }

        .field-error {
          color: #f44336;
          font-size: 0.875rem;
          margin-top: 0.25rem;
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          margin-top: 1.5rem;
        }

        .btn {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 4px;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-primary {
          background: #4CAF50;
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          background: #45a049;
        }

        .btn-secondary {
          background: #fff;
          color: #666;
          border: 1px solid #ddd;
        }

        .btn-secondary:hover {
          background: #f5f5f5;
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default AddProgressForm;
