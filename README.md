# NovaEarn - Crypto Earning Platform

A modern crypto earning and investment platform built with MERN stack.

## Features

- 🔐 User Authentication (Register/Login)
- 💰 Investment Packages System
- 📊 Daily Earnings Tracking
- 🎁 Invitation Code System
- 💎 Real-time Crypto Market Data
- 📱 Responsive Design
- ✨ Glassmorphism UI

## Tech Stack

### Frontend
- React 18
- Vite
- Tailwind CSS
- React Router
- Axios
- Lucide Icons

### Backend
- Node.js
- Express
- MongoDB
- JWT Authentication
- Bcrypt

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas)

### Installation

1. Clone the repository
```bash
cd NovaEarn
```

2. Install backend dependencies
```bash
cd server
npm install
```

3. Install frontend dependencies
```bash
cd ../client
npm install
```

4. Configure environment variables
Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/novaearn
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

### Running the Application

1. Start MongoDB (if running locally)
```bash
mongod
```

2. Start the backend server
```bash
cd server
npm run dev
```

3. Start the frontend development server
```bash
cd client
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

## Investment Packages

- **Package 1**: $50 investment → $0.90 daily for 1 week
- **Package 2**: $200 investment → $1.20 daily for 1 month
- **Package 3**: Coming soon
- **Package 4**: Coming soon

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

## License

MIT
