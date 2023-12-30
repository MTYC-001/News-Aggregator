const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Replace with your MySQL connection details
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'news-aggre'
};

// Secret key for JWT (keep this secure and consider using environment variables)
const JWT_SECRET = '12345';

// Function to handle sign-up
async function handleSignUp(req, res) {
    const { first_name, last_name, email, password } = req.body;

    if (!email || !password || !first_name || !last_name) {
        return res.status(400).send('Please fill all the fields');
    }

    const query = 'INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)';
    db.query(query, [first_name, last_name, email, password], (err) => {
        if (err) {
            console.error('Error during signup:', err);
            return res.status(500).send('Error occurred: ' + err.message);
        }
        res.status(201).send('User registered successfully');
    });
}

// Function to handle sign-in
async function handleSignIn(req, res) {
    try {
        const { email, password } = req.body;
        const query = 'SELECT * FROM users WHERE email = ?';

        const db = await mysql.createPool(dbConfig);
        const [results] = await db.query(query, [email]);

        if (results.length === 0) {
            return res.status(401).send('User not found');
        }

        const user = results[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).send('Invalid password');
        }

        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);
        res.json({ token });
    } catch (err) {
        console.error('Error during signin:', err);
        res.status(500).send('Error occurred: ' + err.message);
    }
}

// Routes
app.post('/signup', handleSignUp);
app.post('/signin', handleSignIn);

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
