const express = require('express');
const app = express();
const port = 5000;
const cors = require('cors');
const mysql = require('mysql');

app.use(cors());

const db = mysql.createConnection({
    host: 'localhost',
    root: 'root',
    password: 'LEAHmae185!!!',
    database: 'consumerdb'
});

app.post('/signup', (req, res) => {
    const sql = "INSERT INTO user ('name', 'email', 'password') VALUES ('?', '?', '?')";
    const values = [
        req.body.name, 
        req.body.email, 
        req.body.password
    ];
    db.query(sql, [values], (err, data) => {
        if (err) {
            return res.json("Error");
        } 
        return res.json(data);
    });
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});