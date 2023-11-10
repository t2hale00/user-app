const express = require('express');
const app = express();
const cors = require('cors');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'LEAHmae185!!!',
    database: 'consumerdb'
});

const jwtSecretKey = 'my_secret_key';

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
                // Add more user-related information as needed
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
});

app.listen(8081, () => {
    console.log(`Listening...`);
});