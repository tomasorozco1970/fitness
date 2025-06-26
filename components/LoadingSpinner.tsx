
import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center my-4" role="status" aria-live="polite">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
      <p className="ml-2 text-teal-600">Cargando...</p>
    </div>
  );
};

export default LoadingSpinner;