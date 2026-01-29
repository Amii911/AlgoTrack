import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-[calc(100vh-70px)] flex items-center justify-center p-8">
      <div className="text-center max-w-lg">
        <h1 className="text-9xl font-bold text-blue-400 m-0 leading-none">404</h1>
        <h2 className="text-3xl text-white my-4">Page Not Found</h2>
        <p className="text-gray-400 text-lg mb-8 leading-relaxed">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-block bg-blue-500 text-white px-8 py-4 rounded-lg font-semibold hover:-translate-y-0.5 hover:bg-blue-600 transition-all no-underline"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
