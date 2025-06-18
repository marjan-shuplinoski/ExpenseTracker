# ExpenseTracker Development Guidelines

## Project Architecture

### Frontend-Backend Separation
- **MAINTAIN** clear separation between frontend and backend code
- **DO NOT** mix business logic between frontend and backend
- **ENSURE** all data processing happens on the backend

### Frontend Architecture
- **USE** component-based architecture with React 18
- **ORGANIZE** components by feature (charts, dashboard, expenses, etc.)
- **IMPLEMENT** state management using Context API + useReducer
- **CREATE** reusable UI components in common directory
- **DO NOT** create redundant components

### Backend Architecture
- **FOLLOW** MVC-like pattern with controllers, models, and routes
- **SEPARATE** business logic into services directory
- **IMPLEMENT** middleware for cross-cutting concerns
- **USE** clear module boundaries

## Code Standards

### General
- **FOLLOW** ESLint configuration for code style
- **MAINTAIN** consistent naming conventions:
  - camelCase for variables and functions
  - PascalCase for React components and classes
  - snake_case for files in backend
  - kebab-case for files in frontend
- **DOCUMENT** all functions and complex logic with comments

### Frontend-Specific
- **USE** functional components with hooks
- **IMPLEMENT** proper error handling in API calls
- **MAINTAIN** responsive design principles
- **OPTIMIZE** render performance for data-intensive components

### Backend-Specific
- **IMPLEMENT** comprehensive input validation with Joi
- **FOLLOW** RESTful API design principles
- **USE** async/await for asynchronous operations
- **HANDLE** all errors with appropriate status codes and messages

## File Structure Standards

### Frontend Structure
- **PLACE** components in their feature-specific directories
- **KEEP** utility functions in utils/ directory
- **ORGANIZE** API calls in services/ directory
- **STORE** global state in contexts/ directory
- **IMPLEMENT** page layouts in pages/ directory

### Backend Structure
- **DEFINE** database schemas in models/ directory
- **IMPLEMENT** route handlers in controllers/ directory
- **DEFINE** API routes in routes/ directory
- **CREATE** middleware in middleware/ directory
- **STORE** business logic in services/ directory
- **PLACE** validation schemas in validations/ directory

## API Standards

### Endpoint Design
- **FOLLOW** RESTful conventions:
  - GET for retrieving data
  - POST for creating resources
  - PUT for updating resources
  - DELETE for removing resources
- **PREFIX** all endpoints with /api/v1
- **USE** consistent naming for endpoints

### Response Format
- **IMPLEMENT** consistent response format:
```json
{
  "success": boolean,
  "data": object | array | null,
  "message": string,
  "errors": array | null
}
```
- **INCLUDE** appropriate HTTP status codes
- **PROVIDE** descriptive error messages

### Authentication
- **REQUIRE** JWT token for protected routes
- **VALIDATE** tokens in authentication middleware
- **EXPIRE** tokens based on JWT_EXPIRE environment variable
- **DO NOT** store sensitive information in tokens

## Database Standards

### Schema Design
- **FOLLOW** schema definitions as outlined in README.md
- **IMPLEMENT** proper validation at schema level
- **USE** references for relationships between documents
- **INCLUDE** timestamps for created and updated

### Data Operations
- **PERFORM** data manipulation operations only in controllers or services
- **VALIDATE** all input data before database operations
- **IMPLEMENT** proper error handling for database operations
- **USE** transactions for operations that modify multiple documents

## Security Standards

### Authentication & Authorization
- **HASH** passwords using bcryptjs
- **VALIDATE** user permissions before executing protected operations
- **IMPLEMENT** role-based access control when needed
- **DO NOT** expose sensitive user information

### Data Protection
- **SANITIZE** all inputs to prevent injection attacks
- **VALIDATE** all request parameters and body
- **IMPLEMENT** rate limiting on sensitive endpoints
- **CONFIGURE** CORS to restrict origin access
- **USE** Helmet for security headers

## Task Execution Guidelines

### When implementing new features:
- **FOLLOW** existing architectural patterns
- **UPDATE** related files when changing models
- **WRITE** tests for backend changes
- **CONSIDER** responsive design for frontend changes
- **DOCUMENT** breaking changes
- **OPTIMIZE** performance for data-heavy operations

### When fixing bugs:
- **IDENTIFY** root cause before implementing fixes
- **VERIFY** fix doesn't introduce new issues
- **UPDATE** tests to cover the fixed scenario
- **DOCUMENT** the bug and solution

## Prohibited Actions

- **DO NOT** mix business logic between frontend and backend
- **DO NOT** directly access database from frontend code
- **DO NOT** store sensitive information in client-side code
- **DO NOT** create redundant components when existing ones can be reused
- **DO NOT** bypass authentication for protected resources
- **DO NOT** implement inconsistent error handling
- **DO NOT** ignore performance considerations for data operations
- **DO NOT** commit hardcoded credentials or environment variables

## AI Decision-making Standards

### Feature Implementation Priorities
1. Security considerations
2. Functionality correctness
3. Performance optimization
4. Code maintainability

### Backend Decision Tree
- Does the change affect data schema? → Update models AND controllers
- Is it a new API endpoint? → Add route AND controller AND validation
- Does it modify existing endpoint? → Update controller AND validation

### Frontend Decision Tree
- Does the change affect data structure? → Update API service AND context
- Is it a new visual component? → Create component AND update parent
- Does it modify existing behavior? → Update component AND possibly context

### Cross-cutting Concerns
- Authentication → Always handle in middleware
- Data validation → Always implement at backend
- Error handling → Implement at both frontend and backend
- Logging → Implement at backend for server issues, frontend for client issues
