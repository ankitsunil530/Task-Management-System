import { db } from "../connect.js";
import verifyToken from "../middleware/authenticateToken.js";


export const taskData = (req, res) => {
    const q = `
      SELECT 
        tasks.*,
        categories.name AS category_name 
      FROM tasks
      LEFT JOIN categories ON tasks.category_id = categories.id
    `;
    db.query(q, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data);
    });
};


export const category = (req, res) => {
    const q = "SELECT * FROM categories";
    db.query(q, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data);
    });
};


export const addTask = (req, res) => {
    const { title, description, priority, status, deadline, category_id } = req.body;
    const user_id = req.user.id;

    if (!title || !deadline || !category_id) {
        return res.status(400).json({ error: "Missing required fields" });
    }


    const qUser = "SELECT name FROM users WHERE user_id = ?";
    db.query(qUser, [user_id], (err, userData) => {
        if (err) {
            console.error("Error fetching user data:", err);
            return res.status(500).json({ error: "Error fetching user data" });
        }
        if (userData.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        const userName = userData[0].name;


        const query = `
            INSERT INTO tasks (user_id, title, description, priority, status, deadline, category_id) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [user_id, title, description, priority, status, deadline, category_id];

        db.query(query, values, (err, result) => {
            if (err) {
                console.error("Error inserting task:", err);
                return res.status(500).json({ error: "Database error" });
            }


            const qCategory = "SELECT * FROM categories WHERE id = ?";
            db.query(qCategory, [category_id], (err, categoryData) => {
                if (err) {
                    console.error("Error fetching category:", err);
                    return res.status(500).json({ error: "Error fetching category" });
                }

                return res.status(201).json({
                    message: "Task created successfully",
                    taskId: result.insertId,
                    user: { userId: user_id, userName },
                    category: categoryData[0],
                });
            });
        });
    });
};


export const getUserData = (req, res) => {
    const userId = req.user.id;

    if (!userId) {
        return res.status(400).json({ message: 'User ID not found in the token' });
    }
    const q="select * from users where user_id=?";
    db.query(q,[userId],(err,data)=>{
        if(err) return res.status(500).json(err);
        res.status(200).json( data[0] );
    })

    
};


export const deleteTask = (req, res) => {
    const taskId = req.params.id;
  console.log('Deleting task with ID:', taskId);
  const query = "DELETE FROM tasks WHERE id = ?";
  db.query(query, [taskId], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json(err);
    }
    if (result.affectedRows === 0) {
      console.warn('Task not found');
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json({ message: 'Task deleted successfully' });
  });
}

export const editTask = (req, res) => {
    const taskId = req.params.id;
    const { title } = req.body;
    const query = "UPDATE tasks SET title = ? WHERE id = ?";

    db.query(query, [title, taskId], (err, result) => {
        if (err) return res.status(500).json(err);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.status(200).json({ message: 'Task updated successfully' });
    });
}

export const getPendingTasks = (req, res) => {
    const  userId  = req.user.id; // Get logged-in user's ID from the token
    console.log('Fetching pending tasks for userId:', userId); // Log userId
  
    // Query to get pending tasks
    const query = 'SELECT * FROM tasks WHERE user_id = ? AND status = "pending"';
    
    db.query(query, [userId], (err, results) => {
      if (err) {
        console.error('Database error:', err); 
        return res.status(500).json({ error: 'Failed to fetch pending tasks' });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ message: 'No pending tasks found for this user.' });
      }
  
      console.log('Pending tasks results:', results); // Log results
      res.json(results); // Return all pending tasks
    });
  };
  

  export const getCompletedTasks = (req, res) => {
    const  userId  = req.user.id;
    const query = 'SELECT * FROM tasks WHERE user_id = ? AND status = "completed"';
  
    db.query(query, [userId], (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch completed tasks' });
      }
      res.json(results);
    });
  };
  export const getAllUserTasks = (req, res) => {
    const userId  = req.user.id; // Ensure `req.user` is populated by middleware
    if (!userId) {
      return res.status(400).json({ error: 'User ID is missing from the request.' });
    }
  
    const query = 'SELECT * FROM tasks WHERE user_id = ?';
    console.log('Fetching tasks for userId:', userId);
  
    db.query(query, [userId], (err, results) => {
      if (err) {
        console.error('Error fetching tasks:', err);
        return res.status(500).json({ error: 'Failed to fetch tasks' });
      }
      console.log('Fetching tasks for userId:', results);
      res.status(200).json( results ); // Return consistent format
    });
  };
  