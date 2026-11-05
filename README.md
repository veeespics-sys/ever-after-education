# ThutoBridge (South African CAPS Adaptive Learning Platform)
**Stage 1: Application Foundation & Multi-Family Architecture**

ThutoBridge is an educational platform designed specifically for South African homeschool families, aligned with the Department of Basic Education's (DBE) Curriculum and Assessment Policy Statement (CAPS).

---

## 🌟 Stage 1 Achievements

* **Multi-Family Isolation**: Strict server-enforced data boundaries. Family A cannot view, mutate, or access learner records of Family B. Changing identifiers in API requests or URLs returns `403 Forbidden`.
* **POPIA-Compliant Data Minimisation**: Collects only essential learning attributes (first name/nickname, grade level). No full birthdates, GPS coordinates, or medical labels.
* **Decoupled Curriculum Architecture**: South African CAPS phases (Foundation, Intermediate, Senior, FET) and subjects (starting with Mathematics Grades R–12) are stored as configurable metadata with official DBE citations and verification status.
* **Zero Silent Data Loss**: Un-enrolling or changing a learner's subject or grade archives the enrolment status with an audit trail, strictly preserving all historical learning progress and attempts.
* **Separated Workspaces**: Dedicated **Parent / Tutor Workspace** (learner management, subject enrolment, activity indicators, audit logs) and **Learner Workspace** (personalized enrolled subjects, self-paced growth cards, zero peer rankings).
* **Automated Integration Tests**: 8 comprehensive test suites verifying authentication, security boundaries, isolation tampering rejection, CRUD operations, and CAPS grade filtering.

---

## 🚀 Quick Start Guide (Beginner Friendly)

### 1. Requirements
* **Node.js** (v18 or higher; tested on Node v22.17.1)
* **npm** (included with Node.js)

### 2. Running the Application
From the project folder (`C:\Users\HP 1\.gemini\antigravity-ide\scratch\thuto-bridge`):

```bash
# Option A: Start the unified server (serves both API and Web UI on port 3001)
npm start

# Option B: Run in full development mode (Hot reloading for frontend)
npm run dev
```

Open your browser to:
**[http://localhost:3001](http://localhost:3001)**

### 3. Running Automated Tests
To run the automated security, data isolation, and curriculum tests:
```bash
npm test
```

---

## 👥 Demonstration Accounts (Pre-Seeded for Testing)

The database includes two distinct synthetic families so you can verify cross-family data isolation immediately without registering from scratch:

| Family | Parent Email | Password | Learners |
| :--- | :--- | :--- | :--- |
| **Molefe Family** | `thabo@molefe.co.za` | `MolefePass2026!` | Kamohelo (Grade 4), Lesedi (Grade 7) |
| **Van der Merwe Family** | `annelize@vandermerwe.co.za` | `MerwePass2026!` | Liam (Grade 9) |

*Tip: Use the **Pilot Test Helper** bar at the very top of the web interface to switch between families in a single click and observe real-time data isolation.*

---

## 🔒 Security & Privacy Notice (POPIA)

* All passwords are encrypted with industry-standard `bcryptjs` hashing.
* Sessions use cryptographically signed JSON Web Tokens (JWT).
* PRIVACY GUARANTEE: In accordance with South Africa's Protection of Personal Information Act (POPIA), this system does not collect biometric data, diagnostic learning disorder labels, or screen surveillance metrics.
