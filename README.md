# FlyHigh: Day Status Management System

[![Frontend](https://img.shields.io/badge/Frontend-React%20%7C%20Vite%20%7C%20Tailwind-blue)](https://react.dev)
[![Backend](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-green)](https://nodejs.org)
[![Database](https://img.shields.io/badge/Database-SQLite%20%7C%20PostgreSQL-blue)](https://www.postgresql.org/)
[![Testing](https://img.shields.io/badge/Testing-Vitest-yellow)](https://vitest.dev/)
[![Status](https://img.shields.io/badge/Status-Production%20Ready-success)](#)

A beautiful, premium full-stack application built for **FlyHigh Travel Company** that allows employees to seamlessly manage and track daily status updates using a powerful year-long dashboard grid, while providing a stunning public-facing calendar for anyone to view scheduled updates.

---

## 📑 Table of Contents
1. [Overview](#-overview)
2. [What Problem Does It Solve?](#-what-problem-does-it-solve)
3. [Who Is It For?](#-who-is-it-for)
4. [Key Features](#-key-features)
5. [How the Application Works](#-how-the-application-works)
6. [User Workflows](#-user-workflows)
7. [System Architecture](#-system-architecture)
8. [Database Architecture](#-database-architecture)
9. [Technology Stack](#-technology-stack)
10. [Project Structure](#-project-structure)
11. [API Documentation](#-api-documentation)
12. [Installation and Setup](#-installation-and-setup)
13. [Running the Application](#-running-the-application)
14. [Testing](#-testing)
15. [Troubleshooting](#-troubleshooting)

---

## 🚀 Overview

The **Day Status Management System** is a modular-monolith web application comprising two primary user interfaces:
1. **Public Day Status Viewer**: An elegant, read-only interactive calendar accessible to anyone to view published daily statuses and events.
2. **Authenticated Data Input Dashboard**: A secure, spreadsheet-like interactive grid where authorized personnel can input, update, and manage text-based statuses for any given day of the year.

---

## 🎯 What Problem Does It Solve?

Organizations often struggle to maintain a unified, easily scannable view of daily events, updates, or team statuses. Spreadsheets are clunky and prone to accidental data deletion, while most calendar tools are too complex for simple text-based daily status tracking. 

This application provides a robust, tailor-made interface for managing daily logs (like travel itineraries, daily goals, or shift statuses) with built-in data protections like optimistic locking to prevent concurrent overwrite conflicts.

---

## 👥 Who Is It For?

- **The Public / General Users**: Anyone who needs to see the published itinerary, status, or update for a specific day. (e.g., Travelers checking their FlyHigh itinerary schedule).
- **Authorized Employees / Administrators**: Staff members who need to safely input or modify statuses for various days across the entire calendar year.

---

## ✨ Key Features

- **Public Interactive Calendar**: A sleek calendar UI supporting leaping years and accurate day-counts, with beautiful glassmorphism design.
- **Secure Dashboard Grid**: A powerful 12x31 grid spanning the entire year, allowing fast adding, editing, and deleting of statuses via a premium frosted-glass modal.
- **Optimistic Locking**: Built-in concurrency control. If two administrators try to edit the exact same day simultaneously, the system prevents data overwriting.
- **Environment-Aware Storage**: Switch effortlessly between SQLite for fast local development/testing, and robust PostgreSQL/MySQL for production deployments.
- **Enterprise-Grade UI/UX**: Includes bespoke SVG logos, micro-animations, Tailwind-powered responsive design, and dynamic color-coded UI states.

---

## ⚙️ How the Application Works

### High-Level Flow

```mermaid
flowchart TD
    User([User]) -->|Visits Application| UI[Frontend UI]
    
    subgraph Frontend [React Application]
        UI -->|Public Access| Cal[Public Calendar View]
        UI -->|Requires Login| Login[Authentication Screen]
        Login -->|Authenticated| Dash[Data Input Dashboard]
    end
    
    subgraph Backend [Node.js / Express API]
        Cal -->|GET Statuses| API[API Router]
        Dash -->|CRUD Statuses + JWT| API
        Login -->|POST Credentials| Auth[Auth Controller]
        Auth --> API
    end
    
    subgraph Storage [Database Layer]
        API -->|Sequelize ORM| DB[(Database)]
    end
    
    DB -->|Response| API
    API -->|JSON| Frontend
```

---

## 🗺️ User Workflows

### 1. Authentication Flow
```mermaid
sequenceDiagram
    actor Admin
    participant UI as Frontend
    participant API as Backend API
    participant DB as Database

    Admin->>UI: Enters Email & Password
    UI->>API: POST /api/auth/login
    API->>DB: Query User by Email
    
    alt User Not Found / Wrong Password
        DB-->>API: Null / False
        API-->>UI: 401 Unauthorized
        UI-->>Admin: Show Error Message
    else Valid Credentials
        DB-->>API: User Data
        API->>API: Generate JWT Token
        API-->>UI: 200 OK + Token
        UI->>UI: Store Token in State/Storage
        UI-->>Admin: Redirect to Dashboard Grid
    end
```

### 2. Dashboard Status Update Flow
```mermaid
flowchart TD
    A[Admin opens Dashboard] --> B[Click on a Cell]
    B --> C[Modal Opens]
    C --> D[Admin enters text & clicks Save]
    D --> E[Frontend sends PUT request with current 'version']
    E --> F{Backend checks version}
    F -->|Version matches| G[Update database, increment version]
    G --> H[Return updated data]
    H --> I[UI refreshes cell]
    F -->|Version mismatch| J[Reject update]
    J --> K[Show Concurrency Error to Admin]
```

---

## 🏗️ System Architecture

The application implements a clean **Modular Monolith** architecture with a clear separation of concerns.

```mermaid
flowchart LR
    Client[Web Browser]

    subgraph Frontend [Vite + React]
        Components[UI Components]
        Context[React Context Auth]
        Router[React Router]
    end

    subgraph Backend [Node.js + Express]
        Routes[API Routes]
        Middleware[Auth / Error Handlers]
        Controllers[Controllers]
    end

    subgraph Storage [Sequelize]
        Models[Data Models]
        DB[(SQLite / PostgreSQL)]
    end

    Client <--> Router
    Router <--> Components
    Components <--> Context
    Components <--> Routes
    Routes <--> Middleware
    Middleware <--> Controllers
    Controllers <--> Models
    Models <--> DB
```

### Component Responsibilities:
- **Frontend**: Handles all UI/UX, routing (React Router), state management, and HTTP requests via Axios.
- **Backend**: Exposes secure REST endpoints, validates incoming JSON payloads using Zod, and issues/verifies JWTs.
- **Storage Layer**: Uses Sequelize ORM to abstract database operations, making the app entirely database-agnostic.

---

## 🗄️ Database Architecture

The application relies on a relational database design with two primary entities.

```mermaid
erDiagram
    USER ||--o{ DAY_STATUS : "creates/manages"

    USER {
        int id PK
        string email "Unique"
        string password_hash
        datetime created_at
        datetime updated_at
    }

    DAY_STATUS {
        int id PK
        date date "Unique (YYYY-MM-DD)"
        text status
        int created_by FK "References users.id"
        int version "Optimistic Locking Integer"
        datetime created_at
        datetime updated_at
    }
```

---

## 🛠️ Technology Stack

| Technology | Purpose | Layer |
|------------|---------|-------|
| **React 19** | Core UI library for building dynamic interfaces | Frontend |
| **Vite** | Ultra-fast frontend build tool and development server | Frontend |
| **Tailwind CSS 4** | Utility-first styling and visual aesthetics | Frontend |
| **Node.js & Express 5** | High-performance backend API server | Backend |
| **Sequelize ORM** | Object Relational Mapping for safe SQL queries | Backend |
| **SQLite / PostgreSQL** | Primary relational database persistence | Database |
| **Vitest** | Blazing fast unit and integration testing framework | Testing |
| **Zod** | Type-safe schema validation for API inputs | Backend |

---

## 📂 Project Structure

```text
day-status-management-system/
├── backend/                  # Node.js Express API
│   ├── src/
│   │   ├── config/           # Environment and DB config
│   │   ├── controllers/      # Route handlers & business logic
│   │   ├── middleware/       # JWT auth & error handling
│   │   ├── routes/           # Express router definitions
│   │   ├── storage/          # Sequelize models and database connection
│   │   └── tests/            # Vitest integration tests
│   └── vitest.config.ts      # Test configuration
├── frontend/                 # React Application
│   ├── src/
│   │   ├── assets/           # Static files
│   │   ├── components/       # Reusable UI components (Navbar, Grid, Calendar)
│   │   ├── contexts/         # React Context (AuthContext)
│   │   └── services/         # Axios API client setup
│   ├── index.html            # Entry HTML
│   └── vite.config.ts        # Vite configuration
├── docker-compose.yml        # Multi-container Docker definitions
└── package.json              # Root workspace management
```

---

## 📡 API Documentation

All API endpoints are prefixed with `/api`.

### Authentication
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/auth/login` | Authenticate user & receive JWT token | No |
| `POST` | `/auth/register` | Register a new user | No |
| `GET` | `/auth/me` | Fetch currently logged-in user profile | Yes |

### Day Status
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/day-status` | Fetch statuses by `?year=` and `?month=` | No |
| `GET` | `/day-status/:date` | Fetch a specific status (Format: YYYY-MM-DD) | No |
| `PUT` | `/day-status/:date` | Create or update a status. Expects `version` field. | Yes |
| `DELETE`| `/day-status/:date` | Delete a status | Yes |

*(A default admin user is seeded on startup: `admin@example.com` / `password123`)*

---

## 💻 Installation and Setup

### Prerequisites
- **Node.js** (v18+ recommended)
- **npm** (Node Package Manager)
- **Docker** (Optional, if you wish to run PostgreSQL/MySQL instead of the default SQLite)

### 1. Clone the repository
```bash
git clone https://github.com/ranjanj17/day-status-management-system.git
cd day-status-management-system
```

### 2. Configure Environment Variables
The application comes pre-configured for immediate local development using SQLite. 

Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

**Environment Variables Table:**
| Variable | Required | Description | Default |
|----------|----------|-------------|---------|
| `NODE_ENV` | Yes | Environment mode (`development`, `test`, `production`) | `development` |
| `PORT` | No | Backend API Port | `3000` |
| `JWT_SECRET` | Yes | Secret key for signing JSON Web Tokens | (Must generate) |
| `STORAGE_MODE` | Yes | Controls storage engine (`sql` or `in-memory`) | `sql` |
| `DATABASE_DIALECT` | No | Target DB dialect (`sqlite`, `postgres`, `mysql`) | `sqlite` |

### 3. Install Dependencies
Install dependencies for both frontend and backend concurrently from the root:
```bash
npm run install:all
```

---

## 🚀 Running the Application

To run both the frontend and backend in development mode simultaneously, you can use two terminals:

**Terminal 1 (Backend API):**
```bash
npm run dev:backend
```
*The backend will run on `http://localhost:3000`. It will automatically seed the database.*

**Terminal 2 (Frontend React App):**
```bash
npm run dev:frontend
```
*The frontend will start on `http://localhost:5173`.*

---

## 🐳 Docker Setup (Optional Databases)

By default, the app uses an embedded `database.sqlite` file. If you wish to use PostgreSQL or MySQL, a `docker-compose.yml` file is provided.

1. Ensure Docker is running.
2. Start the PostgreSQL instance:
   ```bash
   docker-compose up -d postgres
   ```
3. Update your `.env` file to use Postgres:
   ```env
   DATABASE_DIALECT=postgres
   DATABASE_URL=postgres://postgres:postgres@localhost:5432/day_status_db
   ```
4. Restart the backend.

---

## 🧪 Testing

The backend implements comprehensive integration and unit tests using **Vitest** and **Supertest**. 

When running tests, the backend automatically switches to a high-speed SQLite `:memory:` database to ensure total test isolation and prevent modifications to your local development database.

To run the backend tests:
```bash
npm run test:backend
```

---

## 🔧 Troubleshooting

- **App automatically logging me out in Dev mode?**
  Ensure you are not running the test suite (`npm run test:backend`) at the exact same time as your development server if using a shared DB file. (This has been resolved by using `:memory:` for tests, but is a good rule of thumb).
- **Cannot connect to database?**
  If using Postgres/MySQL, ensure Docker is running and the containers are up (`docker ps`). If using SQLite, ensure the `backend/` folder has write permissions so `database.sqlite` can be created.
- **Concurrency / Version errors on save?**
  This means another user updated the cell while you had it open. Refresh the grid to see their changes before making your own.

---

## 📄 License

This project is proprietary and built for the internal and public use cases of the **FlyHigh Travel Company**. 
