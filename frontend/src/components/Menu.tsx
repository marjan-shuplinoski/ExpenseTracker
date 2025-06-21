import React from 'react';
import { NavLink } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { useAuth } from '../hooks/useAuth';

const Menu: React.FC = () => {
  const { user } = useAuth();
  return (
    <Navbar bg="light" expand="lg" className="mb-4" aria-label="Main navigation">
      <Container>
        <Navbar.Brand as={NavLink} to="/dashboard">ExpenseTracker</Navbar.Brand>
        <Navbar.Toggle aria-controls="main-navbar-nav" />
        <Navbar.Collapse id="main-navbar-nav">
          <Nav className="me-auto">
            {user && <>
              <Nav.Link as={NavLink} to="/dashboard">Dashboard</Nav.Link>
              <Nav.Link as={NavLink} to="/accounts">Accounts</Nav.Link>
              <Nav.Link as={NavLink} to="/transactions">Transactions</Nav.Link>
              <Nav.Link as={NavLink} to="/recurring">Recurring</Nav.Link>
              <Nav.Link as={NavLink} to="/budgets">Budgets</Nav.Link>
              <Nav.Link as={NavLink} to="/categories">Categories</Nav.Link>
              <Nav.Link as={NavLink} to="/reports">Reports</Nav.Link>
            </>}
          </Nav>
          <Nav>
            {user ? (
              <>
                <Nav.Link as={NavLink} to="/profile">Profile</Nav.Link>
                <Nav.Link as={NavLink} to="/logout">Logout</Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={NavLink} to="/login">Login</Nav.Link>
                <Nav.Link as={NavLink} to="/register">Register</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Menu;
