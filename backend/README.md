# Login Backend API

A TypeScript-based Express.js backend for the Login application.

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── db.ts           # MongoDB connection
│   ├── controllers/
│   │   ├── authController.ts
│   │   ├── adminController.ts
│   │   ├── staffController.ts
│   │   ├── studentController.ts
│   │   ├── courseController.ts
│   │   └── enrollmentController.ts
│   ├── middleware/
│   │   ├── authMiddleware.ts
│   │   ├── errorHandler.ts
│   │   └── validators.ts
│   ├── models/
│   │   ├── Admin.ts
│   │   ├── Staff.ts
│   │   ├── Student.ts
│   │   ├── Course.ts
│   │   └── Enrollment.ts
│   ├── routes/
│   │   ├── authRoutes.ts
│   │   ├── adminRoutes.ts
│   │   ├── staffRoutes.ts
│   │   ├── studentRoutes.ts
│   │   ├── courseRoutes.ts
│   │   └── enrollmentRoutes.ts
│   ├── types/
│   │   └── index.ts
│   └── server.ts
├── .env
├── package.json
└── tsconfig.json
```

## Setup

1. Install dependencies:
   ```bash
   cd backend
   npm install
   ```

2. Configure environment variables in `.env`:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/login_db
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRES_IN=7d
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Student registration
- `POST /api/auth/login` - Student login
- `POST /api/auth/admin/login` - Admin login
- `POST /api/auth/staff/signup` - Staff registration
- `POST /api/auth/staff/login` - Staff login

### Admins (Admin only)
- `GET /api/admins` - Get all admins
- `GET /api/admins/profile` - Get admin profile
- `GET /api/admins/:id` - Get admin by ID
- `POST /api/admins` - Create admin
- `PUT /api/admins/:id` - Update admin
- `DELETE /api/admins/:id` - Delete admin

### Staff
- `GET /api/staff` - Get all staff (Admin)
- `GET /api/staff/profile` - Get staff profile (Staff)
- `GET /api/staff/pending` - Get pending staff (Admin)
- `GET /api/staff/:id` - Get staff by ID (Admin)
- `PUT /api/staff/:id` - Update staff (Admin)
- `DELETE /api/staff/:id` - Delete staff (Admin)
- `PUT /api/staff/:id/approve` - Approve staff (Admin)
- `PUT /api/staff/:id/reject` - Reject staff (Admin)

### Students
- `GET /api/students` - Get all students (Admin)
- `GET /api/students/profile` - Get student profile (Student)
- `PUT /api/students/profile` - Update student profile (Student)
- `GET /api/students/:id` - Get student by ID (Admin)
- `PUT /api/students/:id` - Update student (Admin)
- `DELETE /api/students/:id` - Delete student (Admin)

### Courses
- `GET /api/courses` - Get all approved courses (Public)
- `GET /api/courses/:id` - Get course by ID (Public)
- `POST /api/courses` - Create course (Approved Staff)
- `GET /api/courses/instructor/my-courses` - Get instructor's courses (Staff)
- `GET /api/courses/admin/all` - Get all courses (Admin)
- `GET /api/courses/admin/pending` - Get pending courses (Admin)
- `PUT /api/courses/:id` - Update course (Admin)
- `DELETE /api/courses/:id` - Delete course (Admin)
- `PUT /api/courses/:id/approve` - Approve course (Admin)
- `PUT /api/courses/:id/reject` - Reject course (Admin)

### Enrollments
- `POST /api/enrollments` - Create enrollment (Student)
- `GET /api/enrollments/my-enrollments` - Get student enrollments (Student)
- `PUT /api/enrollments/:id/cancel` - Cancel enrollment (Student)
- `GET /api/enrollments` - Get all enrollments (Admin)
- `GET /api/enrollments/:id` - Get enrollment by ID
- `GET /api/enrollments/course/:courseId` - Get enrollments by course (Admin)
- `PUT /api/enrollments/:id` - Update enrollment (Admin)
- `DELETE /api/enrollments/:id` - Delete enrollment (Admin)
