import {db} from '../connect.js';

// Controller to get user information (you may get this info from a JWT token)
export const getUserInfoController = (req, res) => {
  const userId = req.user.id; // Assuming the user_id is in the JWT token (use `req.user` from middleware)
  const query = 'SELECT id, username FROM users WHERE id = ?';

  db.query(query, [userId], (err, results) => {
    if (err) {
      res.status(500).send('Server error');
    } else if (!results.length) {
      res.status(404).send('User not found');
    } else {
      res.json({ user_id: results[0].id, username: results[0].username });
    }
  });
};

