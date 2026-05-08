# 🚀 InternTracker AI

> An AI-powered internship aggregation and career assistant platform for students.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=flat-square&logo=mongodb)
![Node.js](https://img.shields.io/badge/Node.js-20-green?style=flat-square&logo=node.js)

---

## ✨ Features

- 🔍 **Live Internship Discovery** — Aggregates listings from top MNCs (Google, Microsoft, Amazon, Meta, etc.)
- 🤖 **AI Resume Analyzer** — Extracts skills, scores ATS compatibility, and gives improvement suggestions
- 💬 **AI Career Chatbot** — Powered by Gemini/OpenAI for personalized career guidance
- 📊 **Application Tracker** — Track all your applications and their status in one place
- 🏢 **Company Profiles** — Browse companies and their open internship listings
- 👤 **User Profiles** — Complete student profile with education, skills, and social links
- 🔐 **JWT Authentication** — Secure login and registration system

---

## 🛠️ Tech Stack

| Layer       | Technology                          |
|-------------|-------------------------------------|
| Frontend    | Next.js 15, TypeScript, Tailwind CSS v4 |
| State       | Redux Toolkit, React Query          |
| Backend     | Node.js, Express.js, TypeScript     |
| Database    | MongoDB Atlas (+ in-memory fallback)|
| AI          | Google Gemini / OpenAI              |
| Auth        | JWT (+ Clerk optional)              |
| Media       | Cloudinary                          |
| Email       | Resend                              |

---

## 📁 Project Structure

```
Intern Tracker/
├── backend/          # Express.js REST API
│   ├── src/
│   │   ├── config/   # Database, environment config
│   │   ├── models/   # Mongoose schemas
│   │   ├── routes/   # API route handlers
│   │   ├── middleware/
│   │   └── services/ # AI, Email, Aggregator services
│   └── .env.example
│
└── frontend/         # Next.js App
    ├── src/
    │   ├── app/      # Pages (App Router)
    │   ├── components/
    │   └── lib/      # Store, API client
    └── .env.example
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18
- npm or yarn
- MongoDB Atlas account (or uses in-memory fallback)

### 1. Clone the repository
```bash
git clone https://github.com/your-username/intern-tracker.git
cd intern-tracker
```

### 2. Setup the Backend
```bash
cd backend
npm install

# Copy env file and fill in your values
cp .env.example .env
# Edit .env with your MongoDB URI, JWT secret, etc.

npm run dev
# API runs at http://localhost:5000
```

### 3. Setup the Frontend
```bash
cd frontend
npm install

# Copy env file
cp .env.example .env.local
# Edit .env.local if needed

npm run dev
# App runs at http://localhost:3000
```

### 4. Open in browser
Navigate to [http://localhost:3000](http://localhost:3000)

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Description |
|---|---|---|
| `MONGODB_URI` | ✅ | MongoDB Atlas connection string |
| `JWT_SECRET` | ✅ | Secret key for JWT tokens (min 32 chars) |
| `PORT` | ❌ | Server port (default: 5000) |
| `GEMINI_API_KEY` | ❌ | Google Gemini for AI features |
| `OPENAI_API_KEY` | ❌ | OpenAI alternative for AI features |
| `CLOUDINARY_*` | ❌ | For resume/avatar uploads |
| `RESEND_API_KEY` | ❌ | For confirmation emails |
| `ADZUNA_APP_ID` | ❌ | For live job aggregation |
| `FRONTEND_URL` | ❌ | CORS allowed origin (default: http://localhost:3000) |

### Frontend (`frontend/.env.local`)

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | ❌ | Backend API base URL (default: http://localhost:5000/api) |

---

## 🗄️ Database

The project uses **MongoDB** with **Mongoose**:

- **Production**: MongoDB Atlas (configure `MONGODB_URI` in `.env`)
- **Development Fallback**: If Atlas is unreachable (e.g., IP not whitelisted), the backend automatically starts a local **in-memory MongoDB** instance and seeds 21 MNC internship listings.

> ⚠️ **Note**: Data stored in the in-memory DB is **lost on every server restart**.

To use the real database, [whitelist your IP in MongoDB Atlas](https://www.mongodb.com/docs/atlas/security-whitelist/).

---

## 📜 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and get JWT token |
| GET | `/api/internships` | List all internships |
| GET | `/api/internships/:id` | Get internship details |
| GET | `/api/companies` | List all companies |
| POST | `/api/applications/:id` | Apply to an internship |
| GET | `/api/applications/me` | Get user's applications |
| GET | `/api/users/profile` | Get user profile |
| PUT | `/api/users/profile` | Update user profile |
| POST | `/api/ai/resume/analyze` | AI resume analysis |
| POST | `/api/ai/recommendations` | AI job recommendations |
| POST | `/api/ai/chat` | AI career chatbot |

---

## 📄 License

MIT License © 2025 InternTracker AI
