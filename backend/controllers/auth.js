import { db } from "../connect.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
export const register = (req, res) => {
  
  const q = "SELECT * FROM users WHERE user_id=?";

  db.query(q, [req.body.user_id], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length) return res.status(409).json("User already exists");
    
    
    
    

    const q = "INSERT INTO users (user_id, name, email, password) VALUES (?)";
    const values = [req.body.user_id, req.body.name, req.body.email, req.body.password];
    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(201).json("User Created");
    })


  });


}
export const login = (req, res) => {
  const q = "SELECT user_id, password, role FROM users WHERE user_id = ?";

  db.query(q, [req.body.user_id], (err, data) => {
    if (err) return res.status(500).json("Server error");
    if (data.length === 0) return res.status(404).json("User not found");

    const user = data[0];

    
    if (user.password === req.body.password) {
      const token = jwt.sign({ id: user.user_id }, process.env.JWT_SECRET, { expiresIn: "1h" });

      console.log('Secret Key:', process.env.JWT_SECRET);  
      console.log('Token:', token);  

      const { password, ...others } = user;

      return res
        .cookie("accessToken", token, {
          httpOnly: true,
          sameSite: "strict",
        })
        .status(200)
        .json({ message: "Login success", role: user.role, token, ...others });
    }

    
    const isValid = bcrypt.compareSync(req.body.password, user.password);
    if (!isValid) return res.status(401).json("Invalid credentials");

    const token = jwt.sign({ id: user.user_id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    console.log('Secret Key:', process.env.JWT_SECRET);  
    console.log('Token:', token);  

    res
      .cookie("accessToken", token, {
        httpOnly: true,
        sameSite: "strict",
      })
      .status(200)
      .json({ message: "Login success", role: user.role,user_id:user.user_id, token, user: { ...user, password: undefined } });
  });
};



export const logout = (req, res) => {
  res.clearCookie("accessToken", {
    secure: true,
    sameSite: "None"
  }).status(200).json("Logout Success");
}

export const deleteUser = (req, res) => {
  const userId = req.params.userId;

  const q = "DELETE FROM users WHERE user_id = ?";
  db.query(q, [userId], (err, result) => {
    if (err) {
      return res.status(500).json("Error deleting user");
    }
    if (result.affectedRows === 0) {
      return res.status(404).json("User not found");
    }
    res.status(200).json("User deleted successfully");
  });
};