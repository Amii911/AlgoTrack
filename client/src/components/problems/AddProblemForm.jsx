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
    <div className="bg-slate-800 p-6 md:p-8 rounded-xl border border-slate-700">
      <h3 className="mt-0 mb-6 text-xl font-semibold text-white">Add New Problem</h3>

      {error && (
        <div className="bg-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-4 border border-red-500/30">
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
          <Form className="space-y-5">
            <div>
              <label htmlFor="problem_name" className="block mb-2 font-medium text-gray-300">
                Problem Name
              </label>
              <Field
                type="text"
                name="problem_name"
                id="problem_name"
                placeholder="e.g., Two Sum"
                className="w-full px-4 py-3 border border-slate-600 rounded-lg text-base bg-slate-700 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <ErrorMessage name="problem_name" component="div" className="text-red-400 text-sm mt-1" />
            </div>

            <div>
              <label htmlFor="problem_link" className="block mb-2 font-medium text-gray-300">
                Problem Link (LeetCode URL)
              </label>
              <Field
                type="url"
                name="problem_link"
                id="problem_link"
                placeholder="https://leetcode.com/problems/..."
                className="w-full px-4 py-3 border border-slate-600 rounded-lg text-base bg-slate-700 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <ErrorMessage name="problem_link" component="div" className="text-red-400 text-sm mt-1" />
            </div>

            <div>
              <label htmlFor="difficulty" className="block mb-2 font-medium text-gray-300">
                Difficulty
              </label>
              <Field
                as="select"
                name="difficulty"
                id="difficulty"
                className="w-full px-4 py-3 border border-slate-600 rounded-lg text-base bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer"
              >
                <option value="">Select difficulty</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </Field>
              <ErrorMessage name="difficulty" component="div" className="text-red-400 text-sm mt-1" />
            </div>

            <div>
              <label htmlFor="category" className="block mb-2 font-medium text-gray-300">
                Category
              </label>
              <Field
                type="text"
                name="category"
                id="category"
                placeholder="e.g., Arrays, Strings, Trees"
                className="w-full px-4 py-3 border border-slate-600 rounded-lg text-base bg-slate-700 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <ErrorMessage name="category" component="div" className="text-red-400 text-sm mt-1" />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isSubmitting ? 'Adding...' : 'Add Problem'}
              </button>
              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-6 py-3 bg-slate-700 text-gray-300 font-medium border border-slate-600 rounded-lg hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-500 transition-all"
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

export default AddProblemForm;
