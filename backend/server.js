const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const app = express();
const cors = require('cors');
const mysql = require('mysql');
//const bodyParser = require('body-parser');
//const jwt = require('jsonwebtoken');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({ secret: 'your-secret-key', resave: true, saveUninitialized: true }));


const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'LEAHmae185!!!',
    database: 'consumerdb'
});

//const jwtSecretKey = 'my_secret_key';

app.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const sql = "INSERT INTO user (`name`, `email`, `password`) VALUES (?, ?, ?)";
  const values = [name, email, hashedPassword];

  db.query(sql, values, (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error while saving user to the database" });
    }
    return res.status(201).json({ message: "User registered successfully" });
  });
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const sql = "SELECT * FROM user WHERE LOWER(email) = LOWER(?)";
  const values = [email];

  db.query(sql, values, async (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error while querying the database' });
    }

    if (data.length > 0) {
      const user = data[0];

      // Compare hashed password
      const isMatch = await bcrypt.compare(password, user.password);

      if (isMatch) {
        // Store user data in session
        req.session.user = {
          id: user.id,
          email: user.email,
          // Add more user-related information as needed
        };

        return res.status(200).json({ user: req.session.user });
      } else {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
    } else {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
  });
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.status(200).json({ message: 'Logout successful' });
    });
    
app.listen(8081, () => {
    console.log(`Listening...`);
});