# Faite Assessment – Frontend

This is the **frontend** part of the Full Stack Assignment. It is built using **React** and provides a user-friendly interface for authentication, profile management, activity logs, and admin user management.

---

## 🚀 Technologies Used

- React.js
- Vite (Build Tool)
- Axios
- React Router DOM
- Tailwind CSS / CSS
- JWT Authentication

---

## 📁 Project Structure

frontend/
├── src/
│ ├── assets/
│ ├── components/
│ ├── pages/
│ │ ├── Login.jsx
│ │ ├── Register.jsx
│ │ ├── Dashboard.jsx
│ │ ├── Profile.jsx
│ │ ├── ActivityLogs.jsx
│ │ └── AdminUsers.jsx
│ ├── services/
│ │ └── api.js
│ ├── App.jsx
│ └── main.jsx
├── public/
├── index.html
├── package.json
└── vite.config.js

yaml
Copy code

---

## ⚙️ Installation & Setup

1. **Clone the repository**

```bash
git clone https://github.com/ThajeevanSE/Faite_Assessment.git
cd Faite_Assessment/frontend
Install dependencies

bash
Copy code
npm install




Copy code
VITE_API_BASE_URL=http://localhost:8080


▶️ Running the Project
To start the development server:

bash
Copy code
npm run dev
The app will be available at:

arduino
Copy code
http://localhost:5173

🔐 Features Implemented
User Registration

User Login with JWT

Protected Dashboard

Profile Editing (Name, Profile Picture, DOB)

Password Change

Activity Logs

Role-Based Access (Admin Panel)

Dark Mode (Saved in localStorage)

Responsive UI (Desktop / Tablet / Mobile)

📸 Demo Flow
The demo video covers:

User Registration

Login

Dashboard

Profile Update

Activity Logs

Admin User Management

📦 Build for Production
To create a production build:

bash
Copy code
npm run build
Output will be generated inside the dist folder.

🧑‍💻 Author
Thajeevan Vasanthakumar