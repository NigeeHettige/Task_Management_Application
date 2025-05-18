## Task Management System

### Overview

The Task Management System is a web-based application designed to facilitate task creation, management, and tracking with role-based access control. It features a Next.js frontend, Node.js backend with Express.js, and a MySQL database. JWT-based authentication ensures secure access for different user roles (user, manager, admin). Key functionalities include task assignment, status tracking, and notifications, with recent performance optimizations.

**Tech Stack:**

* **Frontend:** Next.js (SSR & dynamic components)
* **Backend:** Node.js with Express.js
* **Database:** MySQL (connection pooling & indexing)
* **Authentication:** JWT (stateless, role-based)

### System Architecture

Three-tier client-server architecture:

* **Client Tier (Next.js):** Renders task lists/forms/cards, communicates via HTTP/REST APIs.
* **Application Tier (Node.js/Express):** Handles API requests, JWT auth, business logic, and DB interactions.
* **Data Tier (MySQL):** Stores users, roles, tasks, and notifications.

**Connections:**

* `Next.js ↔ Node.js`: HTTP/REST + JWT
* `Node.js → MySQL`: Connection pool

> *Note:* Asynchronous notification handling (e.g., RabbitMQ) is planned for future enhancements.

### Prerequisites

* **Node.js:** v16.x or later
* **npm**
* **MySQL:** v8.0+ or MariaDB 10.4.25+
* **Git**
* **Text Editor/IDE:** VS Code, IntelliJ, etc.

### Setup Instructions

1. **Clone the Repository**

```bash
git clone https://github.com/your-repo/task-manager.git](https://github.com/NigeeHettige/Task_Management_Application.git
cd Task_Management_Application
```

2. **Install Dependencies**

```bash

cd frontend
npm install
```
```bash

cd backend
npm install
```

3. **Setup MySQL Database**

```sql
CREATE DATABASE task_management;
```

```bash
mysql -u your_user -p task_management < schema.sql
```

4. **Configure Environment Variables** (`.env`)

```env
DB_HOST=localhost
DB_USER=your_user
DB_PASSWORD=your_password
DB_DATABASE=task_management
JWT_SECRET=your_secret_key_here
PORT=3000
```

*Add `.env` to `.gitignore`.*

5. **Start Application**

* Backend:

```bash
npm run start:dev
```

* Frontend:

```bash
cd frontend
npm run dev
```

*Access: [http://localhost:3000](http://localhost:3000)*

### Usage

#### Features

* **Task Creation**: Add new tasks with details.
* **Task Editing**: Modify tasks (role-based access).
* **User Assignment**: Assign to users.
* **Status Tracking**: View tasks in "To Do", "In Progress", "Review", "Completed".
* **Authentication**: JWT-secured login by role.

#### Login Credentials

* **User**: `testuser@example.com` / `password123`
* **Manager**: `manageruser@example.com` / `password123`
* **Admin**: `adminuser@example.com` / `password123`

#### How to Use

* Log in with provided credentials.
* View/update task status on the dashboard.
* Create/edit tasks as permitted by your role.
* (Notifications pending async implementation)

### Database Schema (MySQL)

#### Tables:

* `users`: Stores user info
* `roles`: Defines roles (user, manager, admin)
* `user_roles`: Maps users to roles
* `tasks`: Stores task details
* `notifications`: For future use

*See `schema.sql` for complete structure and pre-seeded data.*

### Future Improvements

* Implement asynchronous notifications (e.g., RabbitMQ)
* Add pagination & filtering in task lists
* Enhanced UI/UX with Tailwind or Material UI
* Add audit logs for task activity
* Admin dashboard for user/role management

---


