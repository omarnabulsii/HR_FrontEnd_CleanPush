# 🧑‍💼 Clicks HR System

A full-stack Human Resource Management System (HRMS) built with **React**, **Node.js**, **PostgreSQL**, and **Auth0**, supporting role-based access for admins, employees, and applicants.

---

## 🚀 Features

### 🔐 Authentication & Authorization
- Auth0 Integration with Role-Based Access Control (RBAC)
- Admin vs Employee vs Applicant access control
- Secure API access using Bearer tokens

### 🧑‍💼 Admin Portal
- Dashboard with live stats (employees, requests, payroll)
- Add, edit, delete employees
- Manage job applications and onboarding flow
- Manage payroll and time roll
- Approve/Reject leave requests

### 🙋‍♂️ Employee Portal
- View personal profile and salary details
- Submit leave/time-off/work-from-home requests
- Check-in and Check-out

### 👨‍💻 Applicant Portal
- Submit job applications
- Onboarding process with multi-step workflow

### 📊 UI/UX
- Fully responsive TailwindCSS layout
- Modern dashboard cards, tables, and forms
- UI Avatars auto-generated from names

---

## 📁 Project Structure

/client → React frontend with pages & components
/server → Node.js Express backend API
/database → PostgreSQL schema
/lib/auth.js → Auth0 role parser & utility



---

## ⚙️ Technologies Used

| Area            | Stack                     |
|-----------------|---------------------------|
| Frontend        | React + Vite + Tailwind   |
| Backend         | Node.js + Express         |
| Database        | PostgreSQL (via Railway)  |
| Auth & Security | Auth0 + JWT               |
| Icons & Avatars | Lucide + UI Avatars API   |

---

## 📦 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/hr-system.git
cd hr-system


2. Setup Environment Variables
Create .env in /server/:
DATABASE_URL=your_postgresql_url
AUTH0_DOMAIN=your_auth0_domain
AUTH0_AUDIENCE=https://clicks-hr.api
3. Start the Backend
cd server
npm install
npm run dev
4. Start the Frontend
cd client
npm install
npm run dev
🧪 API Endpoints (Backend)

Method	Endpoint	Description
GET	/api/users	Get all users (Admin)
POST	/api/users	Create new user
PUT	/api/users/:id	Update user
DELETE	/api/users/:id	Delete user
POST	/api/job-applications/public	Submit application
POST	/api/requests	Submit leave/request
GET	/api/requests	View all requests
⚠️ Requires Bearer Token for all protected routes.
🛡️ Auth0 Roles Used

Role	Capabilities
admin	Full system access (dashboard, CRUD, approval)
user	View own data, submit requests
applicant	Submit job applications only
Roles are parsed using a custom namespace in lib/auth.js.
🧠 System Design Highlights

🔄 Onboarding Workflow: Accept/reject applicants with 4-step process
📅 Check-in/Check-out: Log employee attendance
📧 Leave Requests: Approval-based employee self-service
📊 Dashboard Stats: Live counts of employees, payroll, requests
🎨 UI Avatar Integration: Dynamic avatars by name using UI Avatars API
📌 To-Do / Improvements

 Export reports (CSV/PDF)
 Add notification system
 Multi-language support
 Performance reviews module
🧑‍💻 Developed By

Clicks Digitals Team
https://www.clicksdigitals.com

“Solutions for your HR success”
📄 License

This project is licensed for internal use by Clicks Digitals. Not for resale or distribution.


---

Let me know if you'd like the README customized for deployment on **Vercel**, **Netlify**, or **Docker**, or want badge integrations (CI, Code Coverage, etc).

