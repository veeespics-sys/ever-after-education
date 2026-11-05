# Architectural Blueprint — ThutoBridge

## 1. High-Level Architecture

ThutoBridge uses a **decoupled client-server architecture**:

```
+-----------------------------------------------------------+
|                    Browser Interface                      |
|   - React SPA (Vite)                                      |
|   - Vanilla CSS Design System (South African warm palette)|
|   - Parent Dashboard / Learner Dashboard separation       |
+-----------------------------------------------------------+
                              |
                     REST API Calls (JSON)
                              |
+-----------------------------------------------------------+
|                   Node.js Express Backend                 |
|   - Authentication Middleware (JWT & bcrypt)              |
|   - Family Isolation Middleware (Boundary checks)         |
|   - Role-Based Permissions (Parent, Tutor, Learner)       |
|   - Decoupled CAPS Curriculum Model                       |
+-----------------------------------------------------------+
                              |
                    Standard SQL Queries
                              |
+-----------------------------------------------------------+
|                   SQLite Relational DB                    |
|   - WAL Mode & Foreign Keys Enabled                       |
|   - families, users, learners, subject_enrolments         |
|   - learner_enrolment_history (Zero data loss audit)      |
+-----------------------------------------------------------+
```

---

## 2. Why this Architecture is Ideal for Beginners and Scale

1. **Zero External Database Configuration**:
   - Uses SQLite (`better-sqlite3`). The database is stored in a clean local file (`data/thuto_dev.db`). No complex Docker setups, cloud accounts, or database installations are needed to run or test locally.
2. **Easy Path to Commercial PostgreSQL**:
   - Because all tables use standard relational SQL (foreign keys, cascading deletes, primary keys, timestamps), migrating to PostgreSQL (on Supabase, Render, or Neon) when commercializing requires only changing the connection string.
3. **Decoupled Curriculum Architecture**:
   - Curriculum metadata (`server/curriculum/capsSubjects.js` and `curriculum_subjects` table) is separated from application code. Adding new subjects (e.g. Life Sciences or History) or updating DBE citations does not require rewriting database schemas or user logic.
4. **Server-Enforced Isolation**:
   - Permissions and privacy are checked strictly on the backend. Even if a user alters client-side code or sends an HTTP request with another family's ID, the server rejects it with `403 Forbidden`.
