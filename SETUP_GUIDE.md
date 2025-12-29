# Quick Setup Guide

## Prerequisites
- Node.js 18+ and npm
- MongoDB Atlas account (or local MongoDB)
- Git

## Installation Steps

### 1. Backend Setup
```powershell
# Navigate to backend folder
cd "c:\Users\Anusha\Desktop\Purple Merit\backend"

# Install dependencies (if npm install fails due to Windows locks, close all terminals and retry)
npm install

# Create environment file
Copy-Item ".env.example" ".env"

# Edit .env and update these variables:
# MONGODB_URI=mongodb+srv://your-username:password@cluster.mongodb.net/userManagement
# JWT_SECRET=your_very_strong_secret_key_min_32_characters
# FRONTEND_URL=http://localhost:5173

# Start development server
npm run dev
# Server runs on http://localhost:5000
```

### 2. Frontend Setup
```powershell
# Open NEW terminal, navigate to frontend folder
cd "c:\Users\Anusha\Desktop\Purple Merit\frontend"

# Install dependencies
npm install

# Create environment file
Copy-Item ".env.example" ".env"

# Edit .env:
# VITE_API_URL=http://localhost:5000/api

# Start development server
npm run dev
# App runs on http://localhost:5173
```

### 3. Create Admin User
```powershell
# In backend terminal
cd "c:\Users\Anusha\Desktop\Purple Merit\backend"
npm run seed:admin

# Default admin credentials:
# Email: admin@example.com
# Password: admin123
```

### 4. Run Tests
```powershell
cd "c:\Users\Anusha\Desktop\Purple Merit\backend"
npm test
```

## Troubleshooting npm install on Windows

If you see `ERR_INVALID_ARG_TYPE` or `EPERM` errors:

1. **Close all terminals and VS Code**
2. **Delete node_modules folders**:
   ```powershell
   Remove-Item -Recurse -Force "backend\node_modules"
   Remove-Item -Recurse -Force "frontend\node_modules"
   ```
3. **Clean npm cache**:
   ```powershell
   npm cache clean --force
   ```
4. **Disable antivirus temporarily** (Windows Defender may lock files)
5. **Retry installation**:
   ```powershell
   cd backend
   npm install
   cd ../frontend
   npm install
   ```

## Testing the Application

### Manual Testing Checklist
1. **Signup**: Go to http://localhost:5173/signup
   - Create a new user account
   - Should redirect to login after success

2. **Login as User**:
   - Login with created credentials
   - Should see user profile page
   - Try updating profile info
   - Try changing password

3. **Login as Admin**:
   - Logout and login as admin@example.com / admin123
   - Should see admin dashboard with user list
   - Try activating/deactivating users
   - Check pagination controls

4. **RBAC Test**:
   - As regular user, try accessing /admin/dashboard
   - Should redirect to /profile

5. **API Test** (use Postman/Thunder Client):
   ```
   POST http://localhost:5000/api/auth/signup
   Body: { "fullName": "Test", "email": "test@test.com", "password": "test123" }
   
   POST http://localhost:5000/api/auth/login
   Body: { "email": "test@test.com", "password": "test123" }
   
   GET http://localhost:5000/api/auth/me
   Headers: Authorization: Bearer <token-from-login>
   
   GET http://localhost:5000/api/admin/users?page=1&limit=10
   Headers: Authorization: Bearer <admin-token>
   ```

## Next Steps
1. Review [docs/API.md](../docs/API.md) for complete API documentation
2. Follow [docs/DEPLOYMENT_CHECKLIST.md](../docs/DEPLOYMENT_CHECKLIST.md) for deployment
3. Use [docs/Screenplay.md](../docs/Screenplay.md) for video recording
4. Convert [docs/PDF.md](../docs/PDF.md) to PDF for submission
