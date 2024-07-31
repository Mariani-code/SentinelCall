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

// Dummy meeting data
const meetings = [
  { id: 1, name: 'Team Meeting', time: '2024-07-30T10:00:00', room: 101, participants: ['user2'] },
  { id: 2, name: 'Project Review', time: '2024-07-30T14:00:00', room: 102, participants: ['admin'] },
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

// Get all meetings in a specific room
app.get('/rooms/:roomId/meetings', (req, res) => {
  const { roomId } = req.params;
  const roomMeetings = meetings.filter(meeting => meeting.room == roomId);
  res.json(roomMeetings);
});

// Get meetings for a user
app.get('/meetings', (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, 'your_jwt_secret');
    const userMeetings = meetings.filter(meeting => meeting.participants.includes(decoded.username));
    res.json(userMeetings);
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
