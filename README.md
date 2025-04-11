# 🛡️ Node.js Authentication App

This is a simple Node.js authentication app built with:

- Express.js for server-side routing
- MongoDB for database storage (via Mongoose)
- Passport.js for authentication (using sessions)
- Express-session for storing user sessions
- bcrypt for password hashing

Users can:
- 🔐 Sign up
- 🔓 Log in
- 🗑️ Delete their account (only when logged in)

---

## 🧱 Stack

- **Node.js**
- **Express.js**
- **MongoDB** (via Mongoose)
- **Passport.js** (Local Strategy)
- **express-session**
- **bcrypt**

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/auth-app.git
cd auth-app
```
2. Install dependencies
```bash
npm install express dotenv mongoose bcrypt nodemon passport-local passport method-override express-session ejs connect-flash
```
3. Set up environment variables
Create a .env file:
```bash
MONGO_URI=mongodb://localhost:27017/authApp
SESSION_SECRET=yourSecretKey
PORT=3000
```
4- Start server 
```bash
nodemon app.js
```
🛡️ Security Features
Passwords are hashed using bcrypt

Authentication is handled via Passport Local Strategy

Sessions are managed securely with express-session

