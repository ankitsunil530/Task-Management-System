

# Task Management System (MERN Stack)

## Project Overview

The **Task Management System** is a full-stack MERN (MongoDB, Express, React, Node) web application that helps users manage and track tasks efficiently. Users can add, update, complete, and delete tasks with a clean and responsive interface. It also includes secure user authentication.

## Features

* **User Authentication**: Secure registration and login using JWT tokens.
* **Task Management**:

  * Add tasks with a title and description.
  * View tasks categorized into pending and completed.
  * Update task status (complete/revert).
  * Delete tasks.
* **Role Management**: Basic support for user and admin roles (if applicable).
* **Responsive UI**: Optimized for all devices using Tailwind CSS.

## Tech Stack

### Frontend

* React.js
* React Router DOM
* Axios
* Tailwind CSS

### Backend

* Node.js
* Express.js
* JWT (JSON Web Token) for authentication
* Mongoose for MongoDB ODM

### Database

* MongoDB (Cloud or Local using MongoDB Compass)

## Folder Structure

```
task-management-system/
├── backend/          # Node + Express + MongoDB API
│   └── models/       # Mongoose models
│   └── routes/       # Express routes
│   └── controllers/  # Route handlers
│   └── middleware/   # Auth middleware
│   └── .env          # Environment variables
├── frontend/         # React app
│   └── src/
│       └── components/
│       └── pages/
│       └── context/
│   └── .env
```

## Setup Instructions

### Prerequisites

* Node.js and npm
* MongoDB installed locally or use MongoDB Atlas
* Git

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/task-management-system.git  
cd task-management-system  
```

### 2. Backend Setup

```bash
cd backend  
npm install  
```

#### Create a `.env` file in the `backend` directory:

```env
PORT=5000  
MONGO_URI=your_mongodb_connection_string  
JWT_SECRET=your_jwt_secret  
```

### 3. Frontend Setup

```bash
cd ../frontend  
npm install  
```

#### Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:5000/api  
```

### 4. Run the App

#### Backend:

```bash
cd backend  
npm run dev  
```

#### Frontend:

```bash
cd frontend  
npm run dev  
```

Open [http://localhost:5173](http://localhost:5173) to view the app in your browser.

## API Endpoints

### Auth Routes

* `POST /api/auth/register` - Register new user
* `POST /api/auth/login` - User login

### Task Routes

* `GET /api/tasks/pending` - Get all pending tasks
* `GET /api/tasks/completed` - Get all completed tasks
* `POST /api/tasks` - Add new task
* `PUT /api/tasks/:id/complete` - Mark task as complete
* `PUT /api/tasks/:id/pending` - Revert task to pending
* `DELETE /api/tasks/:id` - Delete task

## Deployment

### Frontend

```bash
cd frontend  
npm run build  
```

* Deploy the `/frontend/dist` folder to Netlify, Vercel, or Surge.

### Backend

* Deploy using platforms like Render, Railway, or DigitalOcean.
* Add your production MongoDB URI and other secrets in the hosted `.env`.

## Screenshots

*Add screenshots of the app here (Pending, Completed views, Login/Register UI).*

## Future Enhancements

* Google or GitHub OAuth login
* Task reminders/notifications
* Task prioritization
* Subtasks or checklists
* Real-time collaboration

## Contributors

* **Your Name** – Full-stack Developer
* Collaborators (if any)



