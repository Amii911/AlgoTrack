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
    return (
      <div className="text-center py-8 text-gray-500">
        <div className="animate-pulse">Loading problems...</div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-100">
      <h3 className="mt-0 mb-6 text-xl font-semibold text-gray-800">Start Tracking a Problem</h3>

      {error && (
        <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg mb-4 border border-red-200">
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
          <Form className="space-y-5">
            <div>
              <label htmlFor="problem_id" className="block mb-2 font-medium text-gray-700">
                Select Problem
              </label>
              <Field
                as="select"
                name="problem_id"
                id="problem_id"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all cursor-pointer"
              >
                <option value="">Choose a problem...</option>
                {problems.map((problem) => (
                  <option key={problem.id} value={problem.id}>
                    {problem.problem_name} ({problem.difficulty})
                  </option>
                ))}
              </Field>
              <ErrorMessage name="problem_id" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            {values.problem_id && (
              <div className="px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-600 border border-gray-200">
                <span className="font-medium">Category:</span> {problems.find(p => p.id === parseInt(values.problem_id))?.category}
              </div>
            )}

            <div>
              <label htmlFor="status" className="block mb-2 font-medium text-gray-700">
                Status
              </label>
              <Field
                as="select"
                name="status"
                id="status"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all cursor-pointer"
              >
                <option value="Attempted">Attempted</option>
                <option value="Completed">Completed</option>
                <option value="Skipped">Skipped</option>
              </Field>
              <ErrorMessage name="status" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            <div>
              <label htmlFor="num_attempts" className="block mb-2 font-medium text-gray-700">
                Number of Attempts
              </label>
              <Field
                type="number"
                name="num_attempts"
                id="num_attempts"
                min="1"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
              <ErrorMessage name="num_attempts" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            <div>
              <label htmlFor="notes" className="block mb-2 font-medium text-gray-700">
                Notes (Optional)
              </label>
              <Field
                as="textarea"
                name="notes"
                id="notes"
                placeholder="Add your approach, learnings, or notes..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base resize-y focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                rows="4"
              />
              <ErrorMessage name="notes" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isSubmitting ? 'Adding...' : 'Start Tracking'}
              </button>
              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-6 py-3 bg-white text-gray-600 font-medium border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all"
                >
                  Cancel
                </button>
              )}
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddProgressForm;
