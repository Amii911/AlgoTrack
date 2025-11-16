import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import problemService from '../../services/problemService';

const AddProblemSchema = Yup.object().shape({
  problem_name: Yup.string()
    .min(3, 'Problem name must be at least 3 characters')
    .required('Problem name is required'),
  problem_link: Yup.string()
    .url('Must be a valid URL')
    .required('Problem link is required'),
  difficulty: Yup.string()
    .oneOf(['Easy', 'Medium', 'Hard'], 'Invalid difficulty')
    .required('Difficulty is required'),
  category: Yup.string()
    .min(2, 'Category must be at least 2 characters')
    .required('Category is required'),
});

const AddProblemForm = ({ onSuccess, onCancel }) => {
  const [error, setError] = useState('');

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      setError('');
      await problemService.createProblem(values);
      resetForm();
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to add problem. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="add-problem-form">
      <h3>Add New Problem</h3>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <Formik
        initialValues={{
          problem_name: '',
          problem_link: '',
          difficulty: '',
          category: '',
        }}
        validationSchema={AddProblemSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="form-group">
              <label htmlFor="problem_name">Problem Name</label>
              <Field
                type="text"
                name="problem_name"
                id="problem_name"
                placeholder="e.g., Two Sum"
                className="form-input"
              />
              <ErrorMessage name="problem_name" component="div" className="field-error" />
            </div>

            <div className="form-group">
              <label htmlFor="problem_link">Problem Link (LeetCode URL)</label>
              <Field
                type="url"
                name="problem_link"
                id="problem_link"
                placeholder="https://leetcode.com/problems/..."
                className="form-input"
              />
              <ErrorMessage name="problem_link" component="div" className="field-error" />
            </div>

            <div className="form-group">
              <label htmlFor="difficulty">Difficulty</label>
              <Field as="select" name="difficulty" id="difficulty" className="form-input">
                <option value="">Select difficulty</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </Field>
              <ErrorMessage name="difficulty" component="div" className="field-error" />
            </div>

            <div className="form-group">
              <label htmlFor="category">Category</label>
              <Field
                type="text"
                name="category"
                id="category"
                placeholder="e.g., Arrays, Strings, Trees"
                className="form-input"
              />
              <ErrorMessage name="category" component="div" className="field-error" />
            </div>

            <div className="form-actions">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary"
              >
                {isSubmitting ? 'Adding...' : 'Add Problem'}
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
        .add-problem-form {
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

        .error-message {
          background: #ffebee;
          color: #c62828;
          padding: 0.75rem;
          border-radius: 4px;
          margin-bottom: 1rem;
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

export default AddProblemForm;
