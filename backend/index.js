const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 1000;

app.use(bodyParser.json());
app.use(cors());

let users = [
    { username: 'admin', password: 'admin', email: 'admin@company.xyz' },
    { username: 'user2', password: 'password2', email: 'user2@company.xyz' }
];

let userInfo = [
    { username: 'admin', firstName: "ada", lastName: "min" },
    { username: 'user2', firstName: "user", lastName: "two" }
];

let billingInfo = [
    { username: 'admin', phone: '555-432-5921', address: '854 Maple Street', country: 'United States', city: 'Columbus', state: 'Ohio' },
    { username: 'user2', phone: '484-852-6885', address: '123 Real Street', country: 'China', city: 'Shanghai', state: 'N/A' }
]

let rooms = [
    { id: 1, number: '101', description: 'Conference Room', capacity: 10 },
    { id: 2, number: '102', description: 'Meeting Room', capacity: 6 },
    { id: 3, number: '103', description: 'Board Room', capacity: 8 }
];

let meetings = [
    { id: 1, name: 'Team Meeting', time: new Date('2024-07-30T10:00:00'), room: '101', participants: ['user2'] },
    { id: 2, name: 'Project Review', time: new Date('2024-07-30T14:00:00'), room: '102', participants: ['admin'] }
];

let complaints = [
    { id: 1, user: 'user2', complaint: 'Room 105 does not exist in the system' },
    { id: 2, user: 'user4', complaint: 'My account should be an admin account' }
];

const isDoubleBooked = (participant, startTime, endTime) => {
    return meetings.some(meeting =>
        meeting.participants.includes(participant) &&
        new Date(meeting.time) >= startTime &&
        new Date(meeting.time) < endTime
    );
};

app.post('/grabAccountInfo', (req, res) => {
    const token = req.headers.authorization.split(' ')[1];

    if (token === null) {
        return res.status(400).json({ message: 'Please login to view account information' });
    }

    const decode = jwt.verify(token, 'your_jwt_secret');

    const user = users.find(obj => obj.username === decode.username);
    const userI = userInfo.find(obj => obj.username === decode.username);

    return res.status(200).json({ user, userI });
});

app.post('/grabBillingInfo', (req, res) => {
    const token = req.headers.authorization.split(' ')[1];

    if (token === null) {
        return res.status(400).json({ message: 'Please login to view account information' });
    }

    const decode = jwt.verify(token, 'your_jwt_secret');

    const user = billingInfo.find(obj => obj.username === decode.username);

    return res.status(200).json({ user });
});


app.post('/rooms', (req, res) => {
    const { number, description, capacity } = req.body;
    const newRoom = {
        id: rooms.length + 1,
        number,
        description,
        capacity
    };

    rooms.push(newRoom);
    res.status(201).json(newRoom);
});

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
        time: startTime,
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
    try {
        const token = req.headers.authorization.split(' ')[1];

        if (token === null) {
            throw new Error();
        }

        const decoded = jwt.verify(token, 'your_jwt_secret');

        if (decoded.exp * 1000 < Date.now()) {
            throw new Error();
        }

        if (decoded.username == "admin") {
            return res.status(200).json();
        }
        else {
            return res.status(401).json({ message: 'Unauthorized' });
        }
    }
    catch (error) {
        return res.status(403).json({ message: 'Unauthorized' });
    }
});

app.post('/resolveComplaint', (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const { complaintID } = req.body;

        const decoded = jwt.verify(token, 'your_jwt_secret');

        if (decoded.exp * 1000 < Date.now()) {
            throw new Error();
        }

        const newComplaints = complaints.filter((complaint) => complaint.id !== complaintID);
        complaints = newComplaints;

        return res.status(200).json();
    }
    catch (error) {
        return res.status(403).json({ message: 'Unauthorized' });
    }
});

app.post('/addComplaint', (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const { complaintID, complaintString } = req.body;

        const decoded = jwt.verify(token, 'your_jwt_secret');

        if (decoded.exp * 1000 < Date.now()) {
            throw new Error();
        }

        const newComplaint = {
            id: complaintID,
            user: decoded.username,
            complaint: complaintString
        };

        complaints.push(newComplaint);
        return res.status(200).json();
    }
    catch (error) {
        return res.status(403).json({ message: 'Unauthorized' });
    }
});

app.post('/logout', (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        //TODO add token to blacklist (or have some other way to invalidate it)
        res.status(200).json();
    }
    catch {
        res.status(400).json();
    }
});

app.post('/createAccount', (req, res) => {
    const { username, password, email } = req.body;

    const newUser = {
        username: username,
        password: password,
        email: email
    };

    users.push(newUser);
    res.status(201).json({ message: 'Account created successfully' });
});

app.put('/meetings/:id', (req, res) => {
    const { participantsToAdd, participantsToRemove } = req.body;
    const meetingId = parseInt(req.params.id);
    let meeting = meetings.find(m => m.id === meetingId);

    if (!meeting) {
        return res.status(404).json({ message: 'Meeting not found' });
    }

    meeting.participants = meeting.participants.filter(participant => !participantsToRemove.includes(participant));

    const errors = [];
    participantsToAdd.forEach(participant => {
        const startTime = new Date(meeting.time);
        const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);
        if (!isDoubleBooked(participant, startTime, endTime)) {
            meeting.participants.push(participant);
        } else {
            errors.push(`Participant ${participant} is double-booked.`);
        }
    });

    if (errors.length > 0) {
        res.status(400).json({ message: errors.join(" ") });
    } else {
        res.status(200).json(meeting);
    }
});

app.get('/meetings', (req, res) => {
    res.json(meetings);
});

app.get('/complaints', (req, res) => {
    res.json(complaints);
});

app.get('/rooms', (req, res) => {
    const updatedRooms = rooms.map(room => ({
        ...room,
        meetings: meetings.filter(meeting => meeting.room === room.number)
    }));
    res.json(updatedRooms);
});

app.get('/', (req, res) => {
    res.send('Your server is running');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
