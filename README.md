# Task Management System  

## Project Overview  
The **Task Management System** is a web application that allows users to manage their tasks efficiently. The platform includes features like task categorization (pending and completed), user authentication, and the ability to mark tasks as completed or pending, delete tasks, and more.  

## Features  
- **User Authentication**: Secure login and token-based authentication (JWT).  
- **Task Management**:  
  - Add tasks with a title and description.  
  - View all pending and completed tasks.  
  - Mark tasks as completed or revert them to pending.  
  - Delete tasks.  
- **Responsive Design**: Built with Tailwind CSS for a seamless user experience on all devices.  
- **Role Management**: Admin and user roles for task organization and management (if applicable).  

## Technologies Used  
### Frontend:  
- React.js  
- Tailwind CSS  

### Backend:  
- Node.js  
- Express.js  
- JWT (for authentication)  

### Database:  
- MySQL  

### Tools and Libraries:  
- Axios  
- React Router  
- Sequelize/Knex.js (for database management)  
- XAMPP (for MySQL database setup in production)  

## Installation  

### Prerequisites  
- Node.js and npm installed  
- XAMPP for MySQL setup  
- Git  

### Setup Instructions  

1. Clone the repository:  
   ```bash  
   git clone https://github.com/your-username/task-management-system.git  
   cd task-management-system  
   ```  

2. Install dependencies for both client and server:  
   ```bash  
   # In the project root directory, install server dependencies  
   cd backend  
   npm install  

   # In the frontend directory, install client dependencies  
   cd ../frontend  
   npm install  
   ```  

3. Configure environment variables:  
   Create a `.env` file in the `backend` directory and add:  
   ```plaintext  
   PORT=5000  
   DB_HOST=localhost  
   DB_USER=root  
   DB_PASSWORD=your_password  
   DB_NAME=task_management  
   JWT_SECRET=your_jwt_secret  
   ```  

4. Start the MySQL database using XAMPP and create the database:  
   ```sql  
   CREATE DATABASE task_management;  
   ```  

5. Run migrations and seeders (if applicable):  
   ```bash  
   npx sequelize-cli db:migrate  
   npx sequelize-cli db:seed:all  
   ```  

6. Start the development servers:  
   - Backend:  
     ```bash  
     cd backend  
     npm start  
     ```  
   - Frontend:  
     ```bash  
     cd frontend  
     npm start  
     ```  

7. Access the app in your browser at `http://localhost:3000`.  

## API Endpoints  
### Authentication:  
- `POST /api/auth/register` - Register a new user.  
- `POST /api/auth/login` - Login with email and password.  

### Tasks:  
- `GET /api/tasks/pending` - Fetch all pending tasks.  
- `GET /api/tasks/completed` - Fetch all completed tasks.  
- `POST /api/tasks` - Add a new task.  
- `PUT /api/tasks/:id/complete` - Mark a task as complete.  
- `PUT /api/tasks/:id/pending` - Mark a task as pending.  
- `DELETE /api/tasks/:id` - Delete a task.  

## Deployment  
### Deploying with XAMPP  
1. Configure MySQL settings in `.env`.  
2. Serve the backend using a hosting service like AWS or Render.  
3. Build the React app:  
   ```bash  
   cd frontend  
   npm run build  
   ```  
4. Deploy the `build` folder to a static file hosting service like Netlify or Vercel.  

## Screenshots  
*Pending tasks and Completed tasks screenshots can be added here.*  

## Future Enhancements  
- Add notifications for task deadlines.  
- Add priority levels to tasks.  
- Implement a drag-and-drop interface for task organization.  

## Contributors  
- **Your Name**: Full-stack Developer  
- Other team members (if any).  

## License  
This project is licensed under the [MIT License](LICENSE).  
