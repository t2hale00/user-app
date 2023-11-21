const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const app = express();
const cors = require('cors');
const mysql = require('mysql');
//const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

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

const jwtSecretKey = 'my_secret_key';

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
        /*// Store user data in session
        req.session.user = {
          id: user.id,
          email: user.email,
        };
        return res.status(200).json({ user: req.session.user });
      } else {
        return res.status(401).json({ message: 'Invalid email or password' });
      }*/
      // Generate JWT token
      const token = jwt.sign({ userId: user.id, userEmail: user.email }, jwtSecretKey, { expiresIn: '1h' });

      return res.status(200).json({ token });
    } else {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    } else {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
  });
});

app.get ('/user', (req, res) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, jwtSecretKey);
    const userId = decoded.userId;

    const sql = "SELECT * FROM user WHERE id = ?";
    const values = [userId];

    db.query(sql, values, (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Error while querying the database" });
      }

      if (data.length > 0) {
        const user = data[0];
        return res.status(200).json({ user });
      } else {
        return res.status(404).json({ message: 'User not found' });
      }
    });
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.status(200).json({ message: 'Logout successful' });
    });

    // Delete account endpoint
app.delete('/deleteaccount', async (req, res) => {
    // Check if the user is authenticated (you might want to enhance this check)
    const userId = req.session.user?.id;
    const token = req.headers.authorization;
  
    /*if (!userId || !token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  
    // Verify the JWT token
    try {
      jwt.verify(token, jwtSecretKey);
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  */
    // Delete the account from the database
    const deleteSql = "DELETE FROM user WHERE id = ?";
    const deleteValues = [userId];
  
    db.query(deleteSql, deleteValues, (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Error while deleting the account" });
      }
  
      // Clear session and send response
      req.session.destroy();
      res.status(200).json({ message: 'Account deleted successfully' });
    });
  });

// API endpoint to get all locations
app.get('/locations', (req, res) => {
  const query = 'SELECT * FROM locations';

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching locations:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(results);
    }
  });
});

  // API endpoint to handle sending parcel information
app.post('/sendParcel', (req, res) => {
  const parcelInfo = req.body;

  // Handle saving parcelInfo to the database or perform other actions as needed
  const insertQuery = 'INSERT INTO parcels SET ?';
  

  connection.query(insertQuery, parcelInfo, (err) => {
    if (err) {
      console.error('Error saving parcel information:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.status(200).json({ message: 'Parcel Information received successfully' });
    }
  });
});

app.listen(8081, () => {
    console.log(`Listening...`);
});