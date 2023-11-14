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

/*app.post('/', (req, res) => {
    const sql = "SELECT * FROM user WHERE `email` = ? AND `password` = ?";

    db.query(sql, [req.body.email, req.body.password], (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Error while querying the database" });
        }
        if (data.length > 0) {
            // User found, generate JWT
            const user = {
                id: data[0].id,
                email: data[0].email,
            };

            jwt.sign({ user }, jwtSecretKey, { expiresIn: '1h' }, (jwtErr, token) => {
                if (jwtErr) {
                    console.error(jwtErr);
                    return res.status(500).json({ message: "Error while generating JWT" });
                }
                return res.status(200).json({ token });
            });
        } else {
            return res.status(401).json({ message: "Invalid credentials" });
        }
    });
});*/

app.post('/login', (req, res) => {
    const email = req.body.email.trim();
    const password = req.body.password.trim();

    //const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
  
    //const sql = "SELECT * FROM user WHERE email = ? AND password = ?";
    const sql = "SELECT * FROM user WHERE LOWER(email) = LOWER(?) AND password = ?";

    console.log('Received email:', email);
    console.log('Received password:', password);

// Your database query here


    db.query(sql, [email, password], (err, data) => {
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