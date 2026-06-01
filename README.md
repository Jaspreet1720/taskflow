# TaskFlow — Full Stack Task Management App

A full-stack productivity application built with **Python Flask** (backend) and **React** (frontend). TaskFlow helps users organize their tasks with priority levels, status tracking, due dates, and real-time statistics.

## Features

- **JWT Authentication** — Secure user registration and login
- **Full CRUD** — Create, read, update, and delete tasks
- **Priority Levels** — High, Medium, Low with visual indicators
- **Status Tracking** — To Do, In Progress, Done
- **Due Date Management** — Overdue task detection
- **Task Statistics** — Dashboard overview of all tasks
- **Search & Filter** — Filter by status, priority, or search by title
- **Responsive Design** — Works on desktop and mobile

## Tech Stack

**Backend**
- Python 3.11
- Flask 3.0
- Flask-SQLAlchemy (ORM)
- Flask-JWT-Extended (Authentication)
- Flask-CORS
- SQLite (development) / PostgreSQL (production)

**Frontend**
- React 18
- React Router v6
- Axios (HTTP client)
- Tailwind CSS

## Project Structure

```
taskflow/
├── backend/
│   ├── app.py              # Flask app factory
│   ├── models.py           # SQLAlchemy models (User, Task)
│   ├── requirements.txt
│   ├── .env.example
│   └── routes/
│       ├── auth.py         # Register, login, /me endpoints
│       └── tasks.py        # Full CRUD + stats endpoints
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── package.json
    └── src/
        ├── App.jsx
        ├── index.js
        ├── context/
        │   └── AuthContext.jsx   # Global auth state
        ├── pages/
        │   ├── Login.jsx
        │   ├── Register.jsx
        │   └── Dashboard.jsx
        └── components/
            ├── Navbar.jsx
            ├── TaskCard.jsx
            ├── TaskModal.jsx
            └── StatsBar.jsx
```

## Getting Started

### Prerequisites
- Python 3.8+
- Node.js 16+

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate    # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env        # Add your JWT secret key
python app.py
```

Backend runs on `http://localhost:5000`

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend runs on `http://localhost:3000`

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |

### Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks/` | Get all tasks (with filters) |
| POST | `/api/tasks/` | Create new task |
| GET | `/api/tasks/:id` | Get single task |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |
| GET | `/api/tasks/stats` | Get task statistics |

### Query Parameters (GET /api/tasks/)
- `status` — Filter by status: `todo`, `in_progress`, `done`
- `priority` — Filter by priority: `low`, `medium`, `high`
- `search` — Search by task title

## Screenshots

### Dashboard
- Stats bar showing task counts by status and priority
- Filterable task grid with search
- Quick status updates directly from task cards

## Author

**Jaspreet Aujla**
- LinkedIn: [linkedin.com/in/jaspreet-aujla](https://linkedin.com/in/jaspreet-aujla)
- Email: jsaujla17@gmail.com
