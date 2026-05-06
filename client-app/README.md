# Elevanda Ventures — Client Application (School Management System)

A full-stack School Management System designed for **Parents** and **Students** in Kigali, Rwanda.  
This is the client-facing portal of the Elevanda Ventures platform.

---

## Project Overview

This application provides parents and students with a secure portal to:

- **Manage school fees** — deposit, withdraw, and view transaction history
- **View academic performance** — grades, attendance records, and timetable
- **Device-based authentication** — each device must be verified by an admin before access is granted
- **Role-based access** — parents can view their child's data; students view their own

---

## Prerequisites

| Tool    | Version  |
|---------|----------|
| Node.js | >= 18.x  |
| npm     | >= 9.x   |
| MongoDB | >= 6.0   |

---

## Tech Stack

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- SHA-512 password hashing (double: client + server with salt)
- JWT stored in httpOnly cookies
- Helmet, express-rate-limit, express-validator
- CORS, dotenv, cookie-parser

### Frontend
- React.js + Vite
- Tailwind CSS v4
- React Router v6
- Axios (with interceptors)
- TanStack React Query
- React Hook Form + Zod
- react-hot-toast

---

## Getting Started

### 1. Backend

```bash
cd client-app/backend
cp .env.example .env        # Configure your environment variables
npm install
npm run dev                  # Starts on http://localhost:5001
```

### 2. Frontend

```bash
cd client-app/frontend
cp .env.example .env         # Configure API URL
npm install
npm run dev                  # Starts on http://localhost:5173
```

---

## Environment Variables

### Backend (.env)

| Variable              | Description                              | Default                                  |
|-----------------------|------------------------------------------|------------------------------------------|
| PORT                  | Server port                              | 5001                                     |
| MONGODB_URI           | MongoDB connection string                | mongodb://localhost:27017/client_school_db|
| JWT_SECRET            | Secret key for JWT signing               | your_jwt_secret_here                     |
| JWT_EXPIRES_IN        | JWT expiration time                      | 30m                                      |
| CLIENT_ORIGIN         | Frontend URL (CORS)                      | http://localhost:5173                     |
| NODE_ENV              | Environment mode                         | development                              |
| LOW_BALANCE_THRESHOLD | Fee low balance threshold in RWF         | 5000                                     |

### Frontend (.env)

| Variable      | Description         | Default                     |
|---------------|---------------------|-----------------------------|
| VITE_API_URL  | Backend API base URL| http://localhost:5001/api   |

---

## API Endpoints

### Auth Routes (`/api/auth`)

| Method | Path       | Auth | Description                                      |
|--------|------------|------|--------------------------------------------------|
| POST   | /register  | No   | Register a new user                              |
| POST   | /login     | No   | Login with credentials                           |
| POST   | /logout    | No   | Clear JWT cookie                                 |
| GET    | /me        | Yes  | Get current authenticated user                   |

#### POST /api/auth/register
```json
// Request
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "<SHA-512 hash>",
  "role": "student",
  "deviceId": "DEV-abc123",
  "childId": "child@example.com"  // parent only
}
// Response (201)
{ "success": true, "data": {}, "message": "Registration successful. Await admin device verification." }
```

#### POST /api/auth/login
```json
// Request
{ "email": "john@example.com", "password": "<SHA-512 hash>", "deviceId": "DEV-abc123" }
// Response (200)
{ "success": true, "data": { "user": { "id": "...", "name": "John Doe", "email": "john@example.com", "role": "student" } }, "message": "Login successful" }
// Response (403 — device not verified)
{ "success": false, "message": "Your device is pending admin verification.", "errors": [] }
```

---

### Fee Routes (`/api/fees`) — Requires Auth

| Method | Path      | Auth | Description                    |
|--------|-----------|------|--------------------------------|
| POST   | /deposit  | Yes  | Submit a deposit               |
| POST   | /withdraw | Yes  | Submit a withdrawal            |
| GET    | /balance  | Yes  | Get current fee balance        |
| GET    | /history  | Yes  | Get paginated transaction list |

#### POST /api/fees/deposit
```json
// Request
{ "amount": 50000, "description": "Term 2 fees" }
// Response (201)
{ "success": true, "data": { "transaction": { "id": "...", "type": "deposit", "amount": 50000, "status": "pending" } } }
```

#### GET /api/fees/balance
```json
// Response (200)
{ "success": true, "data": { "balance": { "balance": 120000, "isLow": false } } }
```

#### GET /api/fees/history?page=1&limit=10&type=deposit&status=pending
```json
// Response (200)
{
  "success": true,
  "data": {
    "transactions": [ { "id": "...", "type": "deposit", "amount": 50000, "status": "pending", "description": "...", "createdAt": "..." } ],
    "pagination": { "page": 1, "limit": 10, "total": 25, "pages": 3 }
  }
}
```

---

### Academic Routes (`/api/academics`) — Requires Auth

| Method | Path        | Auth | Description                          |
|--------|-------------|------|--------------------------------------|
| GET    | /grades     | Yes  | Get grades (own or child's)          |
| GET    | /attendance | Yes  | Get attendance with summary          |
| GET    | /timetable  | Yes  | Get timetable grouped by day         |

#### GET /api/academics/grades?term=Term1&subject=Math
```json
// Response (200)
{ "success": true, "data": { "grades": [ { "subject": "Math", "score": 85, "grade": "B", "term": "Term 1" } ], "studentName": null } }
```

#### GET /api/academics/attendance?startDate=2026-01-01&endDate=2026-03-31&status=absent
```json
// Response (200)
{
  "success": true,
  "data": {
    "records": [ { "date": "2026-01-15", "status": "absent" } ],
    "summary": { "total": 60, "present": 50, "absent": 5, "late": 5, "attendanceRate": 91.7 },
    "studentName": null
  }
}
```

---

### Profile Routes (`/api/profile`) — Requires Auth

| Method | Path | Auth | Description            |
|--------|------|------|------------------------|
| GET    | /    | Yes  | Get user profile       |
| PATCH  | /    | Yes  | Update name            |

---

## Assumptions

1. **Admin app is separate** — This repo is the client-facing portal only. Device verification (`isDeviceVerified`) is managed by the admin app (separate repository).
2. **Fee transactions require admin approval** — Deposits and withdrawals are created with `status: pending` and must be approved by an admin.
3. **SHA-512 double hashing** — The client SHA-512 hashes the password before sending. The server hashes it again with a random salt for storage.
4. **One child per parent** — Each parent account links to one student via `childId`.
5. **Currency is RWF** (Rwandan Franc) — The low balance threshold defaults to RWF 5,000.
6. **Class/Teacher management** is handled by the admin app — Timetable data is pre-populated.
7. **Device ID** is auto-generated on the client and stored in localStorage for persistence.

---

## Project Structure

```
/client-app
├── /backend
│   ├── /src
│   │   ├── /config        ← db.js, env.js
│   │   ├── /models        ← Mongoose schemas
│   │   ├── /dtos          ← Data transfer objects
│   │   ├── /middlewares   ← auth, role, rate limit, error handler
│   │   ├── /services      ← Business logic
│   │   ├── /controllers   ← Route handlers
│   │   ├── /routes        ← Express routes
│   │   ├── app.js
│   │   └── server.js
│   ├── .env.example
│   └── package.json
├── /frontend
│   ├── /src
│   │   ├── /components    ← ui/, layout/, fees/, academics/, auth/
│   │   ├── /pages         ← Dashboard, Fees, Grades, Attendance, Timetable
│   │   ├── /services      ← Axios API functions
│   │   ├── /hooks         ← React Query hooks
│   │   ├── /context       ← AuthContext
│   │   ├── /utils         ← formatCurrency, formatDate, hashPassword
│   │   ├── /styles        ← index.css (Tailwind)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   └── package.json
└── README.md
```

---

## License

ISC © Elevanda Ventures, Kigali, Rwanda
