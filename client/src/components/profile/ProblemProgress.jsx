import { useState } from 'react';
import problemService from '../../services/problemService';

const ProblemProgress = ({ userProblem, problemDetails, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    status: userProblem.status,
    notes: userProblem.notes || '',
    num_attempts: userProblem.num_attempts || 1,
  });
  const [loading, setLoading] = useState(false);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return '#4CAF50';
      case 'attempted':
        return '#FF9800';
      case 'skipped':
        return '#9E9E9E';
      default:
        return '#2196F3';
    }
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      await problemService.updateUserProblem(
        userProblem.user_id,
        userProblem.problem_id,
        formData
      );
      if (onUpdate) onUpdate();
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update progress:', error);
      alert('Failed to update progress');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to remove this problem from your tracking?')) {
      try {
        setLoading(true);
        await problemService.deleteUserProblem(
          userProblem.user_id,
          userProblem.problem_id
        );
        if (onDelete) onDelete();
      } catch (error) {
        console.error('Failed to delete:', error);
        alert('Failed to delete problem');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="progress-card">
      <div className="progress-header">
        <div className="problem-info">
          <h3>
            <a
              href={problemDetails?.problem_link}
              target="_blank"
              rel="noopener noreferrer"
            >
              {problemDetails?.problem_name || 'Problem'}
            </a>
          </h3>
          <div className="meta-info">
            <span className="difficulty">{problemDetails?.difficulty}</span>
            <span className="category">{problemDetails?.category}</span>
          </div>
        </div>
        <button onClick={() => setIsEditing(!isEditing)} className="btn-edit">
          {isEditing ? 'Cancel' : 'Edit'}
        </button>
      </div>

      {isEditing ? (
        <div className="edit-form">
          <div className="form-group">
            <label>Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="form-input"
            >
              <option value="Attempted">Attempted</option>
              <option value="Completed">Completed</option>
              <option value="Skipped">Skipped</option>
            </select>
          </div>

          <div className="form-group">
            <label>Number of Attempts</label>
            <input
              type="number"
              min="1"
              value={formData.num_attempts}
              onChange={(e) =>
                setFormData({ ...formData, num_attempts: parseInt(e.target.value) })
              }
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Add your notes, approach, or learnings..."
              className="form-textarea"
              rows="4"
            />
          </div>

          <div className="form-actions">
            <button
              onClick={handleUpdate}
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <button onClick={handleDelete} disabled={loading} className="btn btn-danger">
              Delete
            </button>
          </div>
        </div>
      ) : (
        <div className="progress-details">
          <div className="status-badge" style={{ backgroundColor: getStatusColor(userProblem.status) }}>
            {userProblem.status}
          </div>
          <div className="detail-row">
            <span className="label">Attempts:</span>
            <span className="value">{userProblem.num_attempts}</span>
          </div>
          <div className="detail-row">
            <span className="label">Date:</span>
            <span className="value">{userProblem.date_attempted}</span>
          </div>
          {userProblem.notes && (
            <div className="notes-section">
              <span className="label">Notes:</span>
              <p className="notes-text">{userProblem.notes}</p>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .progress-card {
          background: white;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 1.5rem;
          margin-bottom: 1rem;
        }

        .progress-header {
          display: flex;
          justify-content: space-between;
          align-items: start;
          margin-bottom: 1rem;
        }

        .problem-info h3 {
          margin: 0 0 0.5rem 0;
          font-size: 1.125rem;
        }

        .problem-info h3 a {
          color: #333;
          text-decoration: none;
        }

        .problem-info h3 a:hover {
          color: #4CAF50;
        }

        .meta-info {
          display: flex;
          gap: 0.75rem;
          font-size: 0.875rem;
        }

        .difficulty,
        .category {
          color: #666;
        }

        .btn-edit {
          background: none;
          border: 1px solid #ddd;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-edit:hover {
          border-color: #4CAF50;
          color: #4CAF50;
        }

        .progress-details {
          margin-top: 1rem;
        }

        .status-badge {
          display: inline-block;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          color: white;
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .detail-row {
          margin-bottom: 0.5rem;
        }

        .label {
          font-weight: 600;
          color: #555;
          margin-right: 0.5rem;
        }

        .value {
          color: #666;
        }

        .notes-section {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid #eee;
        }

        .notes-text {
          margin: 0.5rem 0 0 0;
          color: #666;
          line-height: 1.6;
        }

        .edit-form {
          margin-top: 1rem;
        }

        .form-group {
          margin-bottom: 1rem;
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

        .form-actions {
          display: flex;
          gap: 0.5rem;
          margin-top: 1rem;
        }

        .btn {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .btn-primary {
          background: #4CAF50;
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          background: #45a049;
        }

        .btn-danger {
          background: #f44336;
          color: white;
        }

        .btn-danger:hover:not(:disabled) {
          background: #d32f2f;
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default ProblemProgress;
