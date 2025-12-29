# API Documentation

Base URL: /api

## Auth
- POST /auth/signup
  - Request: { fullName, email, password }
  - Response: { success, message, data: { user, token } }
- POST /auth/login
  - Request: { email, password }
  - Response: { success, message, data: { user, token } }
- GET /auth/me (Auth: Bearer)
  - Response: { success, data: { user } }
- POST /auth/logout (Auth: Bearer)
  - Response: { success, message }

## User (Auth: Bearer)
- GET /user/profile
  - Response: { success, data: { user } }
- PUT /user/profile
  - Request: { fullName?, email? }
  - Response: { success, message, data: { user } }
- PUT /user/change-password
  - Request: { currentPassword, newPassword }
  - Response: { success, message }

## Admin (Auth: Bearer + admin)
- GET /admin/users?page=1&limit=10
  - Response: { success, data: { users, pagination } }
- PATCH /admin/users/:userId/activate
  - Response: { success, message, data: { user } }
- PATCH /admin/users/:userId/deactivate
  - Response: { success, message, data: { user } }

## Error Format
- { success: false, message, error? }

## Auth Header
- Authorization: Bearer <JWT_TOKEN>
