const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 1000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Dummy user and meeting data
const users = [
    { username: 'admin', password: 'admin' },
    { username: 'user2', password: 'password2' }
];

let meetings = [
    { id: 1, name: 'Team Meeting', time: new Date('2024-07-30T10:00:00'), room: 101, participants: ['user2'] },
    { id: 2, name: 'Project Review', time: new Date('2024-07-30T14:00:00'), room: 102, participants: ['admin'] },
];

// Function to check if a participant is double-booked
const isDoubleBooked = (participant, startTime, endTime) => {
    return meetings.some(meeting =>
        meeting.participants.includes(participant) &&
        new Date(meeting.time) >= startTime &&
        new Date(meeting.time) < endTime
    );
};

// Create a meeting
app.post('/meetings', (req, res) => {
    const { name, time, room, participants } = req.body;
    const startTime = new Date(time);
    const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);

    // Check if any participant is double-booked
    const doubleBooked = participants.some(participant => isDoubleBooked(participant, startTime, endTime));

    if (doubleBooked) {
        return res.status(400).json({ message: 'One or more participants are double-booked.' });
    }

    const newMeeting = {
        id: meetings.length + 1,
        name,
        time: startTime, // Store time as a Date object
        room,
        participants
    };

    meetings.push(newMeeting);
    res.status(201).json(newMeeting);
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Dummy authentication check
    const user = users.find(user => user.username === username && user.password === password);

    if (user) {
        // Generate a token or send a success response
        const token = jwt.sign({ username }, 'your_jwt_secret', { expiresIn: '1h' });
        res.json({ token });
    } else {
        res.status(401).json({ message: 'Invalid username or password' });
    }
});


/*
    Checks role of the user
    Admin - Mange room, manage account, view complaints
    Client - Create meeting, create complaint, veiw meetings
*/
app.post('/checkRole', (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    if (token == null) return res.status(401).json({ message: 'Unauthorized' });

    try {
        const decoded = jwt.verify(token, 'your_jwt_secret');

        if (decoded.username == "admin") {
            console.log("GOOD");
            return res.status(200).json();
        }
        else {
            console.log("BAD");
            return res.status(401).json({ message: 'Unauthorized' });
        }
    }
    catch (error) {
        console.log('Error: ' + error.message);
    }
});

app.post('/logout', (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    console.log(token);

    //TODO add token to blacklist (or have some other way to invalidate it)
    res.status(200).json();
})

// Fetch all meetings
app.get('/meetings', (req, res) => {
    res.json(meetings);
});

// Server message
app.get('/', (req, res) => {
    res.send('Your server is running');
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
