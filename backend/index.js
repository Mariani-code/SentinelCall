const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 1000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Dummy user data
const users = [
  { username: 'admin', password: 'admin' },
  { username: 'user2', password: 'password2' }
];

// Root route to display server running message
app.get('/', (req, res) => {
  res.send('Your server is running');
});

// Login route
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    const token = jwt.sign({ username }, 'your_jwt_secret', { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
