const NotFound = () => {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa] px-4">
        <div className="text-center">
          <h1 className="text-[8rem] font-bold text-blue-600">404</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Page Not Found</h2>
          <p className="text-gray-500 mb-6">
            The page you are looking for doesn't exist or has been moved.
          </p>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Back to Home
          </a>
        </div>
      </div>
    );
  };
  
  export default NotFound;
  