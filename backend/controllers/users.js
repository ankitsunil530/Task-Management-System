import { db } from "../connect.js";

export const getUsers = (req, res) => {
    const q = "SELECT COUNT(user_id) AS total FROM users";
    db.query(q, (err, data) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.status(200).json({ totalUsers: data[0].total });
    });
};


export const getData=(req, res) => {
    const q = "SELECT * FROM users";
    db.query(q, (err, data) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.status(200).json(data);
    });
}

export const deleteUser = (req, res) => {
    const userId = req.params.id;
  console.log('Deleting user with ID:', userId);
  const query = "DELETE FROM users WHERE user_id = ?";
  db.query(query, [userId], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json(err);
    }
    if (result.affectedRows === 0) {
      console.warn('Task not found');
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  });
}

export const editUser = (req, res) => {
    const userId = req.params.id;
    const { name } = req.body;
    const query = "UPDATE users SET name = ? WHERE user_id = ?";

    db.query(query, [name, userId], (err, result) => {
        if (err) return res.status(500).json(err);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User updated successfully' });
    });
}


export const getIduser = (req, res) => {
    const userId = req.params.id;
    const q = "SELECT * FROM users WHERE user_id = ?";
    db.query(q, [userId], (err, data) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.status(200).json(data);
    });
}