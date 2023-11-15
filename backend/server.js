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

/*app.post('/login', (req, res) => {
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
});*/

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
   
    // If the user provides empty fields
    if (!email || !password) {
       return res.status(400).json({ message: 'Email and password are required' });
    }
   
    // Fetch the user from the database by email
    const user = await user.findOne({ email });
   
    // If the user does not exist in the database
    if (!user) {
       return res.status(400).json({ message: 'User does not exist' });
    }
   
    // If the provided password does not match the one in the database
    const isMatch = await bcrypt.compare(password, user.password);
   
    if (!isMatch) {
       return res.status(400).json({ message: 'Invalid email or password' });
    }
   
    // Additional validation: Check if the provided username matches the stored username
    const providedUsername = req.body.username;
    if (providedUsername !== user.username) {
       return res.status(400).json({ message: 'Password and username do not match' });
    }
   
    // If everything is good, create a JWT and return it in the response
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
    });

  

app.listen(8081, () => {
    console.log(`Listening...`);
});