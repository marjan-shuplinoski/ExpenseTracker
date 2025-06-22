import React from 'react';

const LoadingScreen: React.FC = () => (
  <div className="d-flex justify-content-center align-items-center min-vh-100">
    <div className="spinner-border text-primary" role="status" aria-label="Loading">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
);

export default LoadingScreen;
