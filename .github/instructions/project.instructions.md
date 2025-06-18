---
applyTo: '**'
---
# ExpenseTracker - Copilot Project Instructions

## Project Overview

ExpenseTracker is a comprehensive personal finance management application built with the MERN stack. It allows users to track expenses, manage budgets, view financial reports, and visualize financial data.

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **React Router 6** for client-side routing
- **Context API + useReducer** for state management
- **Bootstrap 5** for CSS framework
- **Chart.js** with React Chart.js 2 for data visualization
- **Axios** for HTTP client
- **React Hook Form** for form handling
- **date-fns** for date manipulation

### Backend
- **Node.js 18+** with TypeScript
- **Express.js 4.x** web framework
- **MongoDB** with **Mongoose** as ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Joi** for input validation
- **node-cron** for scheduled tasks

## Code Style & Standards

1. **TypeScript**: Use TypeScript for all new code
2. **Code Format**: Follow ESLint + Prettier configuration
3. **Component Structure**: Functional components with hooks
4. **Documentation**: JSDoc for functions and components
5. **Error Handling**: Proper error handling with try/catch
6. **Testing**: Jest for unit and integration tests

## Project Structure

```
ExpenseTracker/
├── frontend/                   # React application
│   ├── public/
│   ├── src/
│   │   ├── components/         # React components organized by feature
│   │   ├── contexts/           # React contexts for state management
│   │   ├── hooks/              # Custom hooks
│   │   ├── pages/              # Page components
│   │   ├── services/           # API services
│   │   ├── utils/              # Utility functions
│   │   └── styles/             # Global styles
│   └── package.json
│
├── backend/                    # Express.js API
│   ├── src/
│   │   ├── config/             # Configuration files
│   │   ├── controllers/        # Route controllers
│   │   ├── middleware/         # Express middleware
│   │   ├── models/             # Mongoose models
│   │   ├── routes/             # Route definitions
│   │   ├── services/           # Business logic
│   │   ├── utils/              # Utilities
│   │   └── validations/        # Input validations
│   ├── tests/                  # Test files
│   └── package.json
```

## Database Schema

### Models Overview
- **User**: Account and profile information
- **Transaction**: Income and expense records
- **Budget**: Budget planning and tracking
- **Category**: Transaction categorization
- **Account**: Financial accounts

## API Structure

- RESTful API design
- Resource-based routing
- JWT authentication
- Input validation with Joi
- Proper error handling

## Security Requirements

1. Always hash passwords with bcrypt
2. Implement JWT with refresh tokens
3. Validate and sanitize all user inputs
4. Implement rate limiting on authentication endpoints
5. Use proper CORS configuration
6. Add security headers with Helmet
7. Prevent MongoDB injection

## Development Guidelines

### General
- Follow SOLID principles
- Write clean, self-documenting code
- Use meaningful variable and function names
- Implement proper error handling

### Frontend
- Use React hooks for state and effects
- Implement proper form validation
- Create reusable components
- Use React Context for global state
- Make responsive designs (mobile-first)
- Implement dark/light theme support

### Backend
- Implement validation for all inputs
- Structure code in controllers, services, models pattern
- Use async/await for asynchronous operations
- Implement proper error middleware
- Use environment variables for configuration

## Features to Implement

### Core Features
- User authentication and profile management
- Transaction CRUD operations
- Budget planning and tracking
- Category management
- Financial dashboards and reporting
- Data visualization with charts

### Advanced Features
- Recurring transactions
- Budget alerts and notifications
- Data export (CSV/PDF)
- Multiple account support
- Dark/Light theme toggle

## Development Workflow

1. Use feature branches
2. Write tests for new features
3. Follow code review guidelines
4. Document API changes
5. Keep dependencies updated

## Performance Considerations

- Optimize database queries
- Implement pagination for large datasets
- Use memoization for expensive calculations
- Optimize React renders
- Implement proper indexing in MongoDB

## Accessibility

- Follow WCAG 2.1 guidelines
- Ensure keyboard navigation
- Use semantic HTML
- Add proper ARIA attributes
- Test with screen readers

## Deployment

- Build optimized production assets
- Set proper environment variables
- Configure MongoDB for production
- Implement proper logging
- Set up monitoring

Remember to follow these instructions when contributing to the ExpenseTracker project. Focus on clean code, security, and maintainability.
