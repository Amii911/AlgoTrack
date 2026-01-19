import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1 className="error-code">404</h1>
        <h2 className="error-title">Page Not Found</h2>
        <p className="error-message">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="btn btn-primary">
          Go Home
        </Link>
      </div>

      <style jsx>{`
        .not-found-container {
          min-height: calc(100vh - 70px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }

        .not-found-content {
          text-align: center;
          max-width: 500px;
        }

        .error-code {
          font-size: 8rem;
          font-weight: 700;
          color: #4CAF50;
          margin: 0;
          line-height: 1;
        }

        .error-title {
          font-size: 2rem;
          color: #333;
          margin: 1rem 0;
        }

        .error-message {
          color: #666;
          font-size: 1.125rem;
          margin-bottom: 2rem;
          line-height: 1.6;
        }

        .btn-primary {
          display: inline-block;
          background: #4CAF50;
          color: white;
          text-decoration: none;
          padding: 0.875rem 2rem;
          border-radius: 8px;
          font-weight: 600;
          transition: background 0.2s, transform 0.2s;
        }

        .btn-primary:hover {
          background: #45a049;
          transform: translateY(-2px);
        }

        @media (max-width: 768px) {
          .error-code {
            font-size: 5rem;
          }

          .error-title {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default NotFound;
