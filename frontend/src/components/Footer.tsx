import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="text-center py-3 mt-auto bg-dark text-white-50">
      <div className="d-flex justify-content-center align-items-center gap-2">
        <span>Marjan Shuplinoski &copy; {new Date().getFullYear()}&nbsp;</span>
        <a href="https://shuplinoski.com" target="_blank" rel="noopener noreferrer" className="text-white-50 mx-1" aria-label="Personal Website">
          <i className="bi bi-globe2" style={{ fontSize: 20, verticalAlign: 'middle' }}></i>
        </a>
        <a href="https://github.com/marjan-shuplinoski/" target="_blank" rel="noopener noreferrer" className="text-white-50 mx-1" aria-label="GitHub Profile">
          <i className="bi bi-github" style={{ fontSize: 20, verticalAlign: 'middle' }}></i>
        </a>
      </div>
    </footer>
  );
};

export default Footer;
