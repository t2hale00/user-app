const express = require('express');
const app = express();
const cors = require('cors');
const mysql = require('mysql');
//const bodyParser = require('body-parser');
//const jwt = require('jsonwebtoken');

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'LEAHmae185!!!',
    database: 'consumerdb'
});

//const jwtSecretKey = 'my_secret_key';

app.post('/signup', (req, res) => {
    const sql = "INSERT INTO user (`name`, `email`, `password`) VALUES (?)";
    const values = [
        req.body.name, 
        req.body.email, 
        req.body.password
    ];
    db.query(sql, [values], (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Error while saving user to the database" });
        } 
        return res.status(201).json({ message: "User registered successfully" });
    });
});

app.post('/login', (req, res) => {
    const sql = "SELECT * FROM user WHERE LOWER(email) = LOWER(?) AND password = ?"; 
    const values = [
        req.body.email,
        req.body.password
    ];
  
    if (!req.body.email || !req.body.password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    console.log('Received email:', req.body.email);
    console.log('Received password:', req.body.password);

    db.query(sql, values, (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error while querying the database' });
      }
  
      if (data.length > 0) {
        const user = {
          id: data[0].id,
          email: data[0].email,
          // Add more user-related information as needed
        };
  
        return res.status(200).json({ user });
      } else {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
    });
});

  

app.listen(8081, () => {
    console.log(`Listening...`);
});