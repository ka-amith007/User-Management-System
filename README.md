# Purple Merit - User Management System

## Project Overview & Purpose

A modern, secure full-stack user management system built for managing user accounts with authentication, role-based access control (RBAC), and administrative controls. The application provides a clean SaaS-style interface for user registration, login, profile management, and admin-level user lifecycle operations (activate/deactivate accounts).

**Key Features:**
- User authentication with JWT tokens
- Role-based authorization (Admin & User roles)
- Profile management with password change functionality
- Admin dashboard for user management
- Secure password hashing with bcrypt
- MongoDB Atlas database integration
- Modern, responsive UI with Tailwind CSS
- RESTful API architecture

---

## Tech Stack Used

### Backend
- **Runtime**: Node.js v18+
- **Framework**: Express.js
- **Database**: MongoDB Atlas (Cloud)
- **Authentication**: JWT (JSON Web Tokens)
- **Password Security**: bcrypt
- **Validation**: express-validator
- **Testing**: Jest, Supertest, mongodb-memory-server
- **Additional**: CORS, dotenv

### Frontend
- **Framework**: React 18 (with Hooks)
- **Build Tool**: Vite
- **Routing**: react-router-dom
- **Styling**: Tailwind CSS v3
- **UI Components**: Custom components with shadcn/ui patterns
- **Icons**: lucide-react
- **HTTP Client**: Axios
- **Notifications**: react-hot-toast

### DevOps & Deployment
- **Backend Hosting**: Render
- **Frontend Hosting**: Vercel
- **Version Control**: Git

---

## Setup Instructions

### Prerequisites
- Node.js v18 or higher
- npm or yarn package manager
- MongoDB Atlas account (free tier available)
- Git

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables** (see section below)

5. **Seed admin user:**
   ```bash
   npm run seed:admin
   ```
   Creates default admin account: `admin@example.com` / `admin123`

6. **Start development server:**
   ```bash
   npm run dev
   ```
   Backend runs on `http://localhost:5000`

7. **Run tests (optional):**
   ```bash
   npm test
   ```

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables** (see section below)

5. **Start development server:**
   ```bash
   npm run dev
   ```
   Frontend runs on `http://localhost:5173`

6. **Build for production (optional):**
   ```bash
   npm run build
   ```

---

## Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=<your_mongodb_atlas_connection_string>
JWT_SECRET=<your_secure_random_secret_key>
JWT_EXPIRES_IN=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

**Note:** Never commit actual values to version control. Use `.env.example` for reference.

---

## Deployment Instructions

### Backend Deployment (Render)

1. **Create New Web Service:**
   - Connect your GitHub repository
   - Select the backend directory

2. **Configure Build Settings:**
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

3. **Set Environment Variables:**
   - Add all variables from Backend `.env` section above
   - Set `NODE_ENV=production`
   - Update `FRONTEND_URL` to your Vercel domain

4. **Deploy:**
   - Render will auto-deploy on push to main branch

### Frontend Deployment (Vercel)

1. **Import Project:**
   - Connect your GitHub repository
   - Select the frontend directory

2. **Configure Build Settings:**
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

3. **Set Environment Variables:**
   - `VITE_API_URL`: Your Render backend URL (e.g., `https://your-app.onrender.com/api`)

4. **Deploy:**
   - Vercel will auto-deploy on push to main branch

---

## API Documentation

### Base URL
- Development: `http://localhost:5000/api`
- Production: `https://your-backend-url.com/api`

### Authentication Header
All protected routes require JWT token:
```
Authorization: Bearer <your_jwt_token>
```

---

### 1. Authentication Endpoints

#### **POST /auth/signup**
Register a new user account.

**Request:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "secure123"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "fullName": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "status": "active",
      "createdAt": "2025-12-29T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Email already exists"
}
```

---

#### **POST /auth/login**
Login to existing account.

**Request:**
```json
{
  "email": "john@example.com",
  "password": "secure123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "fullName": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "status": "active"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

---

#### **GET /auth/me**
Get current authenticated user info.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "fullName": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "status": "active",
      "lastLogin": "2025-12-29T10:30:00.000Z"
    }
  }
}
```

---

#### **POST /auth/logout**
Logout current user.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### 2. User Profile Endpoints

#### **GET /user/profile**
Get user's profile information.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "fullName": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "status": "active",
      "createdAt": "2025-12-29T10:30:00.000Z",
      "lastLogin": "2025-12-29T10:30:00.000Z"
    }
  }
}
```

---

#### **PUT /user/profile**
Update user's profile information.

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "fullName": "John Updated",
  "email": "johnupdated@example.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "fullName": "John Updated",
      "email": "johnupdated@example.com",
      "role": "user",
      "status": "active"
    }
  }
}
```

---

#### **PUT /user/change-password**
Change user's password.

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "currentPassword": "secure123",
  "newPassword": "newsecure456"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Current password is incorrect"
}
```

---

### 3. Admin Endpoints

#### **GET /admin/users**
Get paginated list of all users (Admin only).

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 10)

**Example Request:**
```
GET /admin/users?page=1&limit=10
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "fullName": "John Doe",
        "email": "john@example.com",
        "role": "user",
        "status": "active",
        "createdAt": "2025-12-29T10:30:00.000Z",
        "lastLogin": "2025-12-29T10:30:00.000Z"
      },
      {
        "_id": "507f1f77bcf86cd799439012",
        "fullName": "Jane Smith",
        "email": "jane@example.com",
        "role": "user",
        "status": "inactive",
        "createdAt": "2025-12-28T09:20:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalUsers": 25,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

---

#### **PATCH /admin/users/:userId/activate**
Activate a deactivated user account (Admin only).

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "User activated successfully",
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439012",
      "fullName": "Jane Smith",
      "email": "jane@example.com",
      "role": "user",
      "status": "active"
    }
  }
}
```

---

#### **PATCH /admin/users/:userId/deactivate**
Deactivate an active user account (Admin only).

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "User deactivated successfully",
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "fullName": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "status": "inactive"
    }
  }
}
```

---

### Error Responses

All endpoints may return the following error responses:

**401 Unauthorized:**
```json
{
  "success": false,
  "message": "No token provided" // or "Invalid token"
}
```

**403 Forbidden:**
```json
{
  "success": false,
  "message": "Access denied. Admin only"
}
```

**404 Not Found:**
```json
{
  "success": false,
  "message": "User not found"
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "message": "Server error",
  "error": "Error details (only in development)"
}
```

---

## Testing the API

You can test the API using:
- **Postman**: Import endpoints from examples above
- **cURL**: Use command-line examples
- **Frontend**: Use the included React application

**Example cURL Request:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'
```

---

## Default Admin Credentials

After running `npm run seed:admin`:
- **Email**: `admin@example.com`
- **Password**: `admin123`

⚠️ **Change these credentials in production!**

---

## License

MIT License - Free to use for personal and commercial projects.

---

## Support

For issues or questions, please create an issue in the GitHub repository.
