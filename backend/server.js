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

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({ secret: 'your-secret-key', resave: true, saveUninitialized: true, cookie: { path: '/', httpOnly: true }}));
app.use((req, res, next) => {
  console.log('Session:', req.session);
  next();
});
app.use(express.json());

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

// Signup endpoint
app.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  // Check if the user already exists
  const checkUserQuery = "SELECT * FROM user WHERE email = ?";
  db.query(checkUserQuery, [email], (checkErr, checkData) => {
    if (checkErr) {
      console.error(checkErr);
      return res.status(500).json({ error: "Error while checking user existence" });
    }

    if (checkData.length > 0) {
      // User already exists, return a conflict status
      return res.status(409).json({ error: "User already exists" });
    }

    // User doesn't exist, proceed with the signup
    const insertUserQuery = "INSERT INTO user (name, email, password) VALUES (?, ?, ?)";
    const insertValues = [name, email, hashedPassword];

    db.query(insertUserQuery, insertValues, (insertErr, insertData) => {
      if (insertErr) {
        console.error(insertErr);
        return res.status(500).json({ error: "Error while saving user to the database" });
      }
      return res.status(201).json({ message: "User registered successfully" });
    });
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
      const user = { userid: data[0].userid, email: data[0].email };

      const accessToken = createTokens({ id: user.userid, email: user.email }); // Use the imported function
      console.log('Generated Access Token:', accessToken);
      req.session.user = user;
      
      res.cookie('access-token', accessToken, {
        maxAge: 60 * 60 * 24 * 30 * 1000,
        httpOnly: true,
        sameSite: 'none', // Set to 'none' for cross-domain cookies
        secure: true,  
      });

      res.json({ message: "Logged in successfully", user: { id: user.userid, email: user.email } });

    } else {
      res.status(404).json({message: 'User not found. Please create an account.' });
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
app.delete('/deleteaccount', (req, res) => {
  console.log('User Session:', req.session.user);

  // Ensure user is logged in (you can adapt this based on your authentication logic)
  if (!req.session || !req.session.user) {
    console.log('Unauthorized request to delete account');
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const userId = req.session.user.userid;
  const deleteSql = 'DELETE FROM user WHERE userId = ?';
  const deleteValues = [userId];

  db.query(deleteSql, deleteValues, (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Error while deleting the account' });
    } else {
      // Clear session and send response
      req.session.destroy();
      res.clearCookie('access-token');
      res.status(200).json({ message: 'Account deleted successfully' });
      console.log ('Account deleted successfully.');
    }
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

//API endpoint to reserve a cabinet
app.post('/reserveCabinet', (req, res) => {
  const { Locationid } = req.body;

  console.log('Received Locationid:', Locationid);

  // Start a transaction
  db.beginTransaction(function (err) {
    if (err) {
      console.error('Error starting transaction:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    // Assuming cabinetID is the unique identifier for each cabinet
    const reserveCabinetQuery = `
          UPDATE cabinets
          SET IsAvailable = false, cabinetstatus = 'Reserved'
          WHERE Locationid = ? AND IsAvailable = true
          ORDER BY cabinetID
          LIMIT 1
        `;

    db.query(reserveCabinetQuery, [Locationid], (error, results) => {
      if (error) {
        console.error('Error reserving cabinet:', error);
        // Rollback the transaction in case of an error
        db.rollback(function () {
          res.status(500).json({ error: 'Internal server error' });
        });
      } else {
        console.log('Affected Rows:', results.affectedRows);
        if (results.affectedRows > 0) {
          const reservedCabinetQuery = 'SELECT cabinetID, CabinetNumber FROM cabinets WHERE Locationid = ? AND IsAvailable = false ORDER BY cabinetID DESC LIMIT 1';
          db.query(reservedCabinetQuery, [Locationid], (err, cabinetResults) => {
            if (err) {
              console.error('Error fetching reserved cabinet information:', err);
              // Rollback the transaction in case of an error
              db.rollback(function () {
                res.status(500).json({ error: 'Internal server error' });
              });
            } else {
              const reservedCabinet = cabinetResults[0];
              console.log(`Cabinet reserved successfully for location ${Locationid}:`, reservedCabinet);

              // Commit the transaction if everything is successful
              db.commit(function (commitErr) {
                if (commitErr) {
                  console.error('Error committing transaction:', commitErr);
                  res.status(500).json({ error: 'Internal server error' });
                } else {
                  res.status(200).json({ message: 'Cabinet reserved successfully', reservedCabinet });
                }
              });
            }
          });
        } else {
          console.log(`No available cabinets for location ${Locationid}`);
          res.status(400).json({ error: 'No available cabinets' });
        }
      }
    });
  });
});

// API endpoint to handle sending parcel information
app.post('/sendParcel', async (req, res) => {

  console.log('Session in /sendParcel:', req.session);
  
  console.log('Session:', req.session);
  console.log('Cookies:', req.cookies);

  // Check if req.session.user is defined before accessing its properties
  if (!req.session.user) {
    console.log('User not in session');
    res.status(401).send('Unauthorized');
    return;
  }

  const userId = req.session.user.userid;
  const userEmail = req.session.user.email;

  const width = req.body.width;
  const height = req.body.height;
  const length = req.body.length;
  const weight = req.body.weight;
  const senderName = req.body.senderName;
  const senderAddress = req.body.senderAddress;
  const senderPhoneNumber = req.body.senderPhoneNumber;
  const recipientName = req.body.recipientName;
  const recipientAddress = req.body.recipientAddress;
  const recipientPhoneNumber = req.body.recipientPhoneNumber;
  const location = req.body.location;
  const reservationCode = req.body.reservationCode;
  const dateReserved = req.body.dateReserved;
  const CabinetId = req.body.CabinetId;
  
  db.query('INSERT INTO parcel (userId, userEmail, width, height, length, weight, senderName, senderAddress, senderPhoneNumber, recipientName, recipientAddress, recipientPhoneNumber, location, reservationCode, dateReserved, CabinetId) VALUES (?,  ?, ?,  ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
  [userId, userEmail, width, height, length, weight, senderName, senderAddress, senderPhoneNumber, recipientName, recipientAddress, recipientPhoneNumber, location, reservationCode, dateReserved, CabinetId],
  (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error inserting values");
    } else {
      res.send("Values inserted");
      console.log("Session:", req.session);
      console.log("User in session:", req.session.user ? req.session.user.userid : "Not available");
    }
  }
);
});


// Endpoint to handle sending reservationCode to the cabinets table
app.post('/sendReservationCode', (req, res) => {
  const { reservationCode, reservedCabinet } = req.body;
  const cabinetID = reservedCabinet.cabinetID;

  // Perform the database update using reservationCode
  const updateQuery = 'UPDATE cabinets SET Code = ?  WHERE cabinetID = ?';

  db.query(updateQuery, [reservationCode, cabinetID ], (updateError, updateResult) => {
    if (updateError) {
      console.error('Error updating cabinets table with reservationCode:', updateError);
      res.status(500).send('Error updating cabinets table with reservationCode');
      return;
    }

    console.log('ReservationCode updated in cabinets table');
    console.log('ReservationCode:', reservationCode);
    res.status(200).send('ReservationCode updated in cabinets table');
  });
});



//History endpoint where the user can access sent parcel information
app.get ('/history', (req, res) => {
 
  if (!req.session || !req.session.user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  
  const userId = req.session.user.userid;
  const query = 'SELECT * FROM parcel WHERE userId = ?';

  

  db.query(query, [userId], (err, results) => {
    console.log('Query:', query);
    console.log('User ID:', userId);
  
    console.log('Results:', results);
    console.log('Error:', err);
    
  if (err) {
     console.error('Error fetching parcels:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  } else {
     res.json(results);
  }
});
});

//Send Notification endpoint
app.get ('/notifications', (req, res) => {
 
  if (!req.session || !req.session.user) {
    res.status(401).json({ error: 'Unauthorized' });
    console.log('Session:', req.session);
    return;
  }
  const userId = req.session.user.userid;
  const query = 'SELECT * FROM notification WHERE userid = ?';

  db.query(query, [userId], (err, results) => {
    console.log('Query:', query);
    console.log('User ID:', userId);
    console.log('Results:', results);
    console.log('Error:', err);
    console.log('Session:', req.session);
  if (err) {
     console.error('Error fetching notification:', err);
    res.status(500).json({ error: 'Internal Server Error' });
    console.log('Session:', req.session);
  } else {
     res.json(results);
  }
});
});

app.listen(8081, () => {
    console.log('Listening on port 8081');
});