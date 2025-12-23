# LifeBridge

LifeBridge is a full-stack web application built with a modular architecture that separates the frontend, backend, and dashboard. The project is designed for scalability, maintainability, and real-world usability.

---

## Project Overview

LifeBridge follows a clean and structured approach:

- Frontend handles the user interface
- Backend manages APIs and business logic
- Dashboard provides an admin/control panel

This structure allows independent development and easy future expansion.

---

## Folder Structure

LifeBridge/
- frontend/          Client-side application
- backend/           Server-side APIs
- dashboard/         Admin dashboard
- .gitignore
- README.md

---

## Technologies Used

- JavaScript
- HTML5
- CSS3
- Node.js
- Express.js
- npm
- Modern frontend framework (React or similar)

---

## Features

- Modular frontend, backend, and dashboard
- RESTful API architecture
- Admin dashboard for management
- Scalable and maintainable codebase
- Clean project structure

---

## Prerequisites

Make sure you have the following installed:

- Node.js
- npm

Check versions:

node -v  
npm -v  

---

## Installation and Setup

### Clone the Repository

git clone https://github.com/Riteshsahoo21/LifeBridge.git  
cd LifeBridge  

---

### Backend Setup

cd backend  
npm install  
npm start  

Backend usually runs on:  
http://localhost:5000

---

### Frontend Setup

Open a new terminal:

cd frontend  
npm install  
npm start  

Frontend usually runs on:  
http://localhost:3000

---

### Dashboard Setup

cd dashboard  
npm install  
npm start  

---

## Environment Variables

Create a `.env` file inside the backend folder:

PORT=5000  
DB_URI=your_database_url  
JWT_SECRET=your_secret_key  

---

## API Overview

GET    /api/users           Get all users  
POST   /api/auth/login     User login  
POST   /api/auth/register  User registration  

---

## Testing

npm test  

---

## License

This project is licensed under the MIT License.

---

## Author

Ritesh Sahoo  
GitHub: https://github.com/Riteshsahoo21

---

## Support

If you like this project, please give it a ⭐ on GitHub.

