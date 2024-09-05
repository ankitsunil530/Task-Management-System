const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());


const db = mysql.createConnection({
  host: 'localhost',  
  user: 'root',       
  password: '',       
  database: 'sample' 
});

db.connect(err => {
  if (err) {
    console.log('Database connection error:', err);
  } else {
    console.log('Connected to database');
  }
});


app.post('/add-user', (req, res) => {
  const { name, dob, address, phone } = req.body;

  const sql = `INSERT INTO users (name, dob, address, phone) VALUES (?, ?, ?, ?)`;
  db.query(sql, [name, dob, address, phone], (err, result) => {
    if (err) {
      res.status(500).send('Error inserting data');
      console.log(err);
    } else {
      res.status(200).send('Data inserted successfully');
    }
  });
});

// Start the server
app.listen(5000, () => {
  console.log('Server is running on port 5000');
});