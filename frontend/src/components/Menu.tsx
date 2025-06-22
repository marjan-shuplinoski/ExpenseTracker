import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import ThemeToggle from './ThemeToggle';

const Menu: React.FC = () => {
  const { user } = useAuth();
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4" aria-label="Main navigation">
      <div className="container">
        <NavLink className="navbar-brand" to="/dashboard">ExpenseTracker</NavLink>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {user && <>
              <li className="nav-item">
                <NavLink className="nav-link" to="/dashboard">Dashboard</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/accounts">Accounts</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/transactions">Transactions</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/recurring">Recurring</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/budgets">Budgets</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/categories">Categories</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/reports">Reports</NavLink>
              </li>
            </>}
          </ul>
          <ul className="navbar-nav mb-2 mb-lg-0 align-items-center">
            {user ? (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/profile">Profile</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/logout">Logout</NavLink>
                </li>
                <li className="nav-item d-flex align-items-center">
                  <span className="vr mx-2" style={{ height: '40px' }}></span>
                  <ThemeToggle />
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/login">Login</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/register">Register</NavLink>
                </li>
                <li className="nav-item d-flex align-items-center">
                  <span className="vr mx-2" style={{ height: '40px' }}></span>
                  <ThemeToggle />
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Menu;
