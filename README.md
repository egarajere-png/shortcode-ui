# ABC Bank Shortcodes Portal - Frontend

A modern React-based frontend for the **ABC Bank Shortcodes Management System**.

This application provides an intuitive interface for managing customer M-Pesa shortcodes using a secure **Maker-Checker workflow**.

---

## Features

- Secure authentication with Keycloak
- Maker / Checker role-based access
- Request new shortcodes
- Approve shortcode requests
- Request shortcode deletion
- Approve shortcode deletions
- Query shortcodes
- Query customer accounts
- Audit Trail
- M-Pesa C2B Simulator
- M-Pesa B2C Simulator
- Modern responsive UI
- Enterprise dashboard
- Toast notifications
- Loading indicators
- Mobile-friendly interface

---

# Project Structure

```
src
├── components
│   ├── access
│   ├── layout
│   ├── loading
│   ├── mpesa
│   ├── ui
│   ├── Dashboard.jsx
│   ├── RequestShortCode.js
│   ├── DeleteShortCode.js
│   ├── PendingRequests.js
│   ├── PendingDeleteRequests.js
│   ├── QueryShortCode.js
│   ├── QueryAccountShortCode.js
│   ├── AuditTrail.js
│   └── TestShortCodeRequest.js
│
├── services
│   ├── HttpService.js
│   └── UserService.js
│
├── App.js
└── index.js
```

---

# Technology Stack

- React 17
- React Router
- TailwindCSS
- Axios
- Keycloak Authentication
- Java Spring Boot Backend
- PostgreSQL
- RabbitMQ
- Docker
- Maven

---

# Prerequisites

Before running this project ensure the following are installed.

- Node.js 18+
- npm
- Java 11+
- Maven
- PostgreSQL
- Docker Desktop (optional-I used it locally)
- Git

---

# Clone the Repository

```bash
git clone https://github.com/egarajere-png/shortcodes-ui.git

cd shortcodes-ui
```

---

# Install Dependencies

```bash
npm install
```

---

# Backend Requirements

This frontend depends on the **Shortcodes Spring Boot Backend**.

The backend **must be running** before using the UI.

Ensure the following backend services are available:

- Spring Boot API
- PostgreSQL Database
- RabbitMQ
- Keycloak Authentication Server

---

# Running the Backend

Navigate to the backend project.

Clean and build

```bash
./mvnw clean package
```

Run the application

```bash
./mvnw spring-boot:run
```

or

```bash
java -jar target/shortcode.jar
```

Verify that the backend starts successfully before launching the frontend.

---

# Running the Frontend

Start the React application

```bash
npm start
```

The application will be available at

```
http://localhost:3000
```

---

# Authentication

Authentication is handled using **Keycloak**.

After launching the application you will be redirected to the Keycloak login page.

Depending on your assigned role you will have access to different features.

### Maker

- Request Shortcodes
- Delete Shortcodes
- Query Shortcodes
- Query Accounts

### Checker

- Approve Requests
- Approve Deletions
- Audit Trail
- Query Shortcodes
- Query Accounts

---

# Backend Connectivity

Ensure the frontend points to the correct backend URL.

Update the API endpoint inside

```
src/services/HttpService.js
```

if necessary.

Example

```javascript
const BASE_URL = "http://localhost:8080";
```

---

# Application Workflow

```
Maker
   │
   ▼
Request Shortcode
   │
   ▼
Pending Approval
   │
   ▼
Checker Approval
   │
   ▼
Shortcode Created
   │
   ▼
Customer Uses Shortcode
```

Deletion Workflow

```
Maker
   │
   ▼
Request Deletion
   │
   ▼
Pending Delete Approval
   │
   ▼
Checker Approval
   │
   ▼
Shortcode Deleted
```

---

# Available Pages

| Page | Description |
|------|-------------|
| Dashboard | Application overview |
| Request Shortcode | Create new shortcode requests |
| Delete Shortcode | Request shortcode deletion |
| Pending Requests | Checker approval page |
| Pending Deletions | Checker deletion approvals |
| Query Shortcode | Search by shortcode |
| Query Account | Search by customer account |
| Audit Trail | View audit history |
| Test Request | Testing page |
| C2B Simulator | Simulate customer payments |
| B2C Simulator | Simulate business payouts |

---

# Development

Run the development server

```bash
npm start
```

Build production assets

```bash
npm run build
```

Run tests

```bash
npm test
```

---

# Folder Overview

```
components/
```

Contains all application pages and reusable UI.

```
services/
```

Contains API communication and authentication services.

```
ui/
```

Reusable UI components.

```
mpesa/
```

Contains M-Pesa simulation pages.

---

# Troubleshooting

### Backend not running

Symptoms

- Network Error
- Failed to fetch
- 404
- Connection refused

Solution

Start the Spring Boot backend.

---

### Login fails

Ensure

- Keycloak is running
- Realm is correctly configured
- Client credentials are valid

---

### RabbitMQ Errors

Ensure RabbitMQ is running before starting the backend.

---

### Database Errors

Verify

- PostgreSQL is running
- Database credentials are correct
- Database schema has been created

---

# Future Enhancements

- Redis Caching
- Email Notifications
- Analytics Dashboard
- Global Customer Search
- User-selectable Shortcodes
- Dashboard Metrics
- Reporting
- Notification Center

---

# Author

**Suleiman Mashuhuli** & **Egara Bahati Jere**

Software Engineer


---

# License

This project is intended for internal demonstration purposes.