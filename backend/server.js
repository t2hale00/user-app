const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const { createTokens, validateToken } = require('./JWT');

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

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database');
});

// signup endpoint
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


//Login endpoint
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT userid, name, email FROM user WHERE LOWER(email) = LOWER(?)";
  const values = [email];

  db.query(sql, values, async (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error while querying the database' });
    }

    console.log("Data from the database:", data);


    if (data.length > 0) {
      const user = data[0];

      // Log the user information before setting it in the session
      console.log("User before setting in session:", { id: user.userid, email: user.email });

      const accessToken = createTokens({ id: user.userid, email: user.email }); // Use the imported function

      req.session.user = { id: user.userid, email: user.email };
      
      res.cookie('access-token', accessToken, {
        maxAge: 60 * 60 * 24 * 30 * 1000,
        httpOnly: true,
      });

      res.json({ message: "Logged in successfully", user: { id: user.userid, email: user.email } });
    } else {
      res.status(400).json({ message: 'User not found' });
    }
  });
});
      

// Protected Profile endpoint?
app.get("/profile", (req, res) => {
  try {
    jwt.validateToken(req, res, () => {
      res.redirect('/profile');
    });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});


// Logout endpoint
  app.get('/logout', (req, res) => {
    req.session.destroy();
  res.clearCookie('access-token');
  res.status(200).json({ message: 'Logout successful' });
});


// Delete account endpoint
app.delete('/deleteaccount', async (req, res) => {
  const userId = req.user.id; // Extract user ID from the decoded token

  const deleteSql = "DELETE FROM user WHERE id = ?";
  const deleteValues = [userId];

  db.query(deleteSql, deleteValues, (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error while deleting the account" });
    }

    // Clear session and send response
    res.clearCookie('access-token');
    res.status(200).json({ message: 'Account deleted successfully' });
  });
});


// API endpoint to get all locations
app.get('/locations', (req, res) => {
  const query = 'SELECT * FROM locations';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching locations:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(results);
    }
  });
});

  // API endpoint to handle sending parcel information
app.post('/sendParcel', async (req, res) => {

  console.log("User in session:", req.session.user);

  const userId = req.session.user.userid;
  const userEmail = req.session.user.email;

    const width = req.body.width;
    const height = req.body.height;
    const length = req.body.length;
    const weight = req.body.weight;
    const senderName = req.body.senderName;
    const senderAddress = req.body.senderAddress;
    const senderPhoneNumber= req.body.senderPhoneNumber;
    const recipientName = req.body.recipientName;
    const recipientAddress = req.body.recipientAddress;
    const recipientPhoneNumber = req.body.recipientPhoneNumber;
    const location = req.body.location;
    const reservationCode = req.body.reservationCode;
    
    db.query('INSERT INTO parcel (userId, userEmail, width, height, length, weight, senderName, senderAddress, senderPhoneNumber, recipientName, recipientAddress, recipientPhoneNumber, location, reservationCode) VALUES (?,  ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [userId, userEmail, width, height, length, weight, senderName, senderAddress, senderPhoneNumber, recipientName, recipientAddress, recipientPhoneNumber, location, reservationCode],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Values inserted");
      }
    }
  );
  });





//Create a history endpoint where the user can access sent parcel information
app.get ('/history', (req, res) => {
  const query = 'SELECT * FROM parcels';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching parcels:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(results);
    }
  });
});


//Send Notification endpoint

app.listen(8081, () => {
    console.log('Listening on port 8081');
});