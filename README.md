# ExpenseTracker - Personal Finance Manager

A comprehensive personal finance management application built with the MERN stack, featuring expense tracking, budget management, financial reports, and data visualization.

## 🚀 Features

### Core Functionality
- 💰 Income and expense tracking
- 📊 Interactive financial dashboards
- 📈 Budget creation and monitoring
- 🏷️ Category-based expense organization
- 📅 Date-based filtering and reporting
- 🔍 Advanced search and filtering
- 📱 Responsive mobile-first design

### Advanced Features
- 📊 Visual charts and graphs (Chart.js)
- 📈 Monthly/yearly financial reports
- 🎯 Budget alerts and notifications
- 📤 Export data to CSV/PDF
- 🔄 Recurring transaction management
- 💳 Multiple account support
- 🌙 Dark/Light theme

## 🛠 Tech Stack

### Frontend
- **React 18** - UI library
- **React Router 6** - Client-side routing
- **Context API + useReducer** - State management
- **Bootstrap 5** - CSS framework
- **Chart.js** - Data visualization
- **React Chart.js 2** - Chart components
- **Axios** - HTTP client
- **React Hook Form** - Form handling
- **date-fns** - Date manipulation

### Backend
- **Node.js 18+** - Runtime environment
- **Express.js 4.x** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Joi** - Input validation
- **node-cron** - Scheduled tasks

## 📁 Project Structure

```
ExpenseTracker/
├── frontend/                   # React application
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── charts/         # Chart components
│   │   │   ├── dashboard/      # Dashboard components
│   │   │   ├── expenses/       # Expense components
│   │   │   ├── budgets/        # Budget components
│   │   │   ├── reports/        # Report components
│   │   │   └── common/         # Shared components
│   │   ├── contexts/           # React contexts
│   │   ├── hooks/              # Custom hooks
│   │   ├── pages/              # Page components
│   │   ├── services/           # API services
│   │   ├── utils/              # Utility functions
│   │   └── styles/             # Global styles
│   └── package.json
│
├── backend/                    # Express.js API
│   ├── src/
│   │   ├── config/             # Configuration
│   │   ├── controllers/        # Route controllers
│   │   ├── middleware/         # Express middleware
│   │   ├── models/             # Mongoose models
│   │   ├── routes/             # Route definitions
│   │   ├── services/           # Business logic
│   │   ├── utils/              # Utilities
│   │   └── validations/        # Input validations
│   ├── tests/                  # Test files
│   └── package.json
│
└── docker-compose.yml
```

## 🗄️ Database Schema

### User Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required),
  currency: String (default: 'USD'),
  timezone: String,
  preferences: {
    theme: String,
    defaultCategory: ObjectId,
    budgetAlerts: Boolean
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Transaction Model
```javascript
{
  title: String (required),
  amount: Number (required),
  type: String (enum: ['income', 'expense']),
  category: ObjectId (ref: 'Category'),
  account: ObjectId (ref: 'Account'),
  date: Date (required),
  description: String,
  tags: [String],
  isRecurring: Boolean,
  recurringFrequency: String,
  user: ObjectId (ref: 'User'),
  createdAt: Date,
  updatedAt: Date
}
```

### Budget Model
```javascript
{
  name: String (required),
  amount: Number (required),
  spent: Number (default: 0),
  category: ObjectId (ref: 'Category'),
  period: String (enum: ['monthly', 'yearly']),
  startDate: Date,
  endDate: Date,
  alertThreshold: Number (default: 80),
  user: ObjectId (ref: 'User'),
  createdAt: Date,
  updatedAt: Date
}
```

### Category Model
```javascript
{
  name: String (required),
  type: String (enum: ['income', 'expense']),
  color: String,
  icon: String,
  budget: Number,
  user: ObjectId (ref: 'User'),
  isDefault: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB 7.0+
- npm 9+ or yarn 1.22+

### Installation

1. **Clone and navigate**
   ```bash
   cd ExpenseTracker
   ```

2. **Install dependencies**
   ```bash
   # Backend
   cd backend && npm install
   
   # Frontend
   cd ../frontend && npm install
   ```

3. **Environment Setup**
   
   Backend `.env`:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/expensetracker
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRE=30d
   CORS_ORIGIN=http://localhost:3000
   ```
   
   Frontend `.env`:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api/v1
   REACT_APP_APP_NAME=ExpenseTracker
   REACT_APP_CURRENCY=USD
   ```

4. **Start Development**
   ```bash
   # Backend
   cd backend && npm run dev
   
   # Frontend
   cd frontend && npm start
   ```

## 📱 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/me` - Get current user
- `PUT /api/v1/auth/profile` - Update profile

### Transactions
- `GET /api/v1/transactions` - Get all transactions
- `GET /api/v1/transactions/:id` - Get single transaction
- `POST /api/v1/transactions` - Create transaction
- `PUT /api/v1/transactions/:id` - Update transaction
- `DELETE /api/v1/transactions/:id` - Delete transaction
- `GET /api/v1/transactions/stats` - Get transaction statistics

### Budgets
- `GET /api/v1/budgets` - Get all budgets
- `POST /api/v1/budgets` - Create budget
- `PUT /api/v1/budgets/:id` - Update budget
- `DELETE /api/v1/budgets/:id` - Delete budget
- `GET /api/v1/budgets/:id/progress` - Get budget progress

### Categories
- `GET /api/v1/categories` - Get all categories
- `POST /api/v1/categories` - Create category
- `PUT /api/v1/categories/:id` - Update category
- `DELETE /api/v1/categories/:id` - Delete category

### Reports
- `GET /api/v1/reports/summary` - Financial summary
- `GET /api/v1/reports/monthly` - Monthly report
- `GET /api/v1/reports/yearly` - Yearly report
- `GET /api/v1/reports/export` - Export data

## 🧪 Available Scripts

### Backend
```bash
npm run dev          # Development server
npm start           # Production server
npm test            # Run tests
npm run lint        # ESLint
npm run seed        # Seed database
```

### Frontend
```bash
npm start           # Development server
npm run build       # Production build
npm test            # Run tests
npm run analyze     # Bundle analyzer
```

## 📊 Features in Detail

### Dashboard
- Monthly income vs expenses chart
- Category-wise spending pie chart
- Budget progress bars
- Recent transactions list
- Financial health score

### Transaction Management
- Add/edit/delete transactions
- Bulk transaction operations
- Transaction search and filtering
- Category assignment
- Recurring transaction setup

### Budget Management
- Create monthly/yearly budgets
- Track budget progress
- Budget alerts and notifications
- Category-based budgeting
- Budget vs actual spending comparison

### Reports & Analytics
- Monthly/yearly spending reports
- Category-wise expense analysis
- Income vs expense trends
- Budget performance reports
- Export to CSV/PDF

## 🔒 Security Features

- JWT authentication with refresh tokens
- Password hashing with bcryptjs
- Input validation and sanitization
- Rate limiting on API endpoints
- CORS configuration
- Helmet security headers
- MongoDB injection prevention

## 🎨 UI/UX Features

- Clean, modern interface
- Responsive design
- Interactive charts and graphs
- Dark/Light theme support
- Smooth animations
- Mobile-first approach
- Accessibility compliant

## 🚀 Deployment

### Manual Deployment
1. Build frontend: `npm run build`
2. Start backend: `npm start`
3. Serve static files

### Environment Variables (Production)
```env
NODE_ENV=production
MONGODB_URI=your_production_db_uri
JWT_SECRET=your_production_jwt_secret
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📄 License

MIT License - see LICENSE file for details.

## 👨‍💻 Author

**Marjan Shuplinoski**
- Email: marjan@shuplinoski.com
- LinkedIn: [marjan-shuplinoski](https://linkedin.com/in/marjan-shuplinoski)

---

**Track your expenses, achieve your goals! 💰📈**
