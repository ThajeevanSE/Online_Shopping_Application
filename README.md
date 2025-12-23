# 🛒 C2C Marketplace Application

A full-stack Customer-to-Customer (C2C) e-commerce platform where users can list products, browse a marketplace, manage a wishlist, and communicate in real-time with sellers via a WhatsApp-style chat interface.

Built with **Spring Boot** (Backend) and **React.js** (Frontend).

---

## 🚀 Tech Stack

### Backend
* ![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white) **Java 17**
* ![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white) **Spring Boot 3** (Web, Data JPA, Security, WebSocket)
* ![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white) **MySQL Database**
* **JWT** (JSON Web Tokens) for Authentication
* Stripe API for Payment Processing
* **Lombok** for boilerplate reduction

### Frontend
* ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) **React.js** (Vite)
* ![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white) **Tailwind CSS** for styling
* **Axios** for API requests
* **StompJS & SockJS** for Real-time WebSockets
* **React Router** for navigation

---

## ✨ Key Features

### 🔐 Authentication & Security
* Secure User Registration & Login.
* Role-based access control (User vs Admin).
* JWT-based stateless authentication.
* Forgot Password: Secure OTP-based password reset flow via Email (JavaMailSender).

### 🛍️ Marketplace Functionality
* **Product Management:** Users can add, edit, and delete their own products.
* **Search & Filtering:** Dynamic search bar and category filtering (Electronics, Fashion, etc.).
* **Product Details:** Detailed view with images, condition, and seller info.

### ❤️ Wishlist System
* **Favorites:** Users can "Heart" items to save them for later.
* **Many-to-Many Relationship:** Efficient database mapping for user favorites.

### 📦 Orders & Payments
* Checkout System: Integrated order form with address and contact details.
* Online Payments: Secure credit card processing using Stripe Payment Intents.
* Cash on Delivery (COD): Option to pay upon arrival.
* *Order Tracking: Sellers can view incoming orders and manage shipping status.

### 💬 Real-Time Chat System (WebSocket)
* **Instant Messaging:** Chat with sellers instantly without refreshing the page.
* **WhatsApp-Style UI:** Split-screen layout, read receipts (simulated), and bubble interface.
* **Inbox Management:** See a list of all active conversations.
* **Notifications:** Real-time unread message counter in the navigation bar.
* Instant Chat: WhatsApp-style messaging between Buyers and Sellers using WebSockets
* Green Popup Toasts appear instantly when a user receives a new order or message.
    Unread Badge: Real-time counter on the Navbar for unread messages.

### 👑 Admin Dashboard (Management Console)
* **Analytics Overview:** Visual dashboard displaying key metrics like Total Users, Active Products, and Total Sales Revenue.
* **User Management:** Admins can view all registered users, monitor their activity, and ban/delete users if necessary.
* **Content Moderation:** Full control to delete inappropriate product listings to maintain marketplace quality.
* **System Logs:** View recent activity logs (registrations, logins, new listings) for security auditing.

---

## 📸 Project Screenshots

### 🔐 Authentication & Security
<table>
  <tr>
    <td width="50%">
      <h3 align="center">Login Page</h3>
      <div align="center">
        <img src="https://github.com/user-attachments/assets/bf626431-87f0-46e7-ae7a-d53addc23377" width="100%" alt="Login Page">
      </div>
    </td>
    <td width="50%">
      <h3 align="center">Registration Page</h3>
      <div align="center">
        <img src="https://github.com/user-attachments/assets/8f18530f-ffed-44bb-a608-5626486ed7f2" width="100%" alt="Register Page">
      </div>
    </td>
  </tr>
</table>

### 👤 User Experience & Theming
<table>
  <tr>
    <td width="50%">
      <h3 align="center">User Dashboard</h3>
      <div align="center">
        <img width="960" height="472" alt="Screenshot 2025-12-23 184821" src="https://github.com/user-attachments/assets/9f44b744-3e9b-4ae2-8239-6dabdc1efeb0" />
      </div>
    </td>
    <td width="50%">
      <h3 align="center">Dark Mode Support</h3>
      <div align="center">
        <img src="https://github.com/user-attachments/assets/675386ab-d2e7-4c70-ae16-9b2f9813beda" width="100%" alt="Dark Mode">
      </div>
    </td>
  </tr>
</table>

### 📦 Seller Management
<table>
  <tr>
    <td width="50%">
      <h3 align="center">My Products Management</h3>
      <div align="center">
        <img src="https://github.com/user-attachments/assets/daadc6c3-1348-405a-99fc-553ccc391faf" width="100%" alt="Add Product Page">
      </div>
    </td>
    <td width="50%">
      <h3 align="center">Add New Listing Form</h3>
      <div align="center">
        <img src="https://github.com/user-attachments/assets/ab462f45-ef58-488f-ae2c-5dfea469b864" width="100%" alt="Add Product Form">
      </div>
    </td>
  </tr>
</table>

### 🛒 Marketplace & Details
<table>
  <tr>
    <td width="50%">
      <h3 align="center">Shopping Marketplace</h3>
      <div align="center">
        <img src="https://github.com/user-attachments/assets/34470df3-a93c-4a26-a272-24a68749aefd" width="100%" alt="Shopping Page">
      </div>
    </td>
    <td width="50%">
      <h3 align="center">Product Details</h3>
      <div align="center">
        <img src="https://github.com/user-attachments/assets/943f3a71-eb3e-40f4-8ac5-d5c29590cf79" width="100%" alt="Product Details">
      </div>
    </td>
  </tr>
</table>
### 📦 Orders & Payments
<table>
  <tr>
    <td width="50%">
      <h3 align="center">Order Page</h3>
      <div align="center">
        <img src="https://github.com/user-attachments/assets/c03aa57d-a848-4a95-b492-ee771b99e847" width="100%" alt="Order Page">
      </div>
    </td>
    <td width="50%">
      <h3 align="center">Payment Integration</h3>
      <div align="center">
        <img src="https://github.com/user-attachments/assets/93fc0371-5715-4e01-a46c-0d78b571e637" width="100%" alt="Payment Modal">
      </div>
    </td>
  </tr>
</table>


### 💬 Interactive Features
<table>
  <tr>
    <td width="50%">
      <h3 align="center">Wishlist / Favorites</h3>
      <div align="center">
        <img src="https://github.com/user-attachments/assets/23b59b37-3489-40a5-8e63-52f4c735312b" width="100%" alt="Favorites Page">
      </div>
    </td>
    <td width="50%">
      <h3 align="center">Real-time Chat</h3>
      <div align="center">
        <img src="https://github.com/user-attachments/assets/4eb9b2c7-dd31-47f8-ad9f-1972ed5364f9" width="100%" alt="Chat Interface">
      </div>
    </td>
  </tr>
</table>

### ⚙️ Account & Administration
<table>
  <tr>
    <td width="50%">
      <h3 align="center">Profile Editing</h3>
      <div align="center">
        <img src="https://github.com/user-attachments/assets/910cd2fe-593f-496f-b212-d0a844b58869" width="100%" alt="Profile Edit">
      </div>
    </td>
    <td width="50%">
      <h3 align="center">Admin Dashboard</h3>
      <div align="center">
        <img src="https://github.com/user-attachments/assets/2b4cbd89-697a-4f87-8fb4-aacd8b600028" width="100%" alt="Admin Dashboard">
      </div>
    </td>
  </tr>
</table>


---

## 🛠️ Installation & Setup

Follow these steps to run the project locally.

### Prerequisites
* Java JDK 17+
* Node.js & npm
* MySQL Server

### 1. Database Setup
Create a database in MySQL named `faite_db` (or update `application.properties`):
```sql
CREATE DATABASE faite_db;
2. Backend SetupClone the repository.Navigate to the backend folder.Update src/main/resources/application.properties with your MySQL credentials:Propertiesspring.datasource.url=jdbc:mysql://localhost:3306/faite_db
spring.datasource.username=root
spring.datasource.password=your_password
Run the application:Bash./mvnw spring-boot:run
3. Frontend SetupNavigate to the frontend (or client) folder.Install dependencies:Bashnpm install
Start the React server:Bashnpm run dev
🔌 API Endpoints MethodEndpointDescription
POST/auth/registerRegister new user
POST/auth/loginLogin and get JWT
GET/products/browseGet all products (with search/filter)
POST/products/addAdd a new listing
POST/wishlist/toggle/{id}
Add/Remove from favoritesWS/wsWebSocket Connection Endpoint🤝
ContactCreated by thajeevan
* Email:vasanththajeevan@gmail.com
LinkedIn: https://www.linkedin.com/in/thajeevan-vasanthakumar/
GitHub: github.com/ThajeevanSE
