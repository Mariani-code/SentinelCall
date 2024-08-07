const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 1000;

app.use(bodyParser.json());
app.use(cors());

const users = [
  { username: 'admin', password: 'admin', email: 'admin@company.xyz' },
  { username: 'user2', password: 'password2', email: 'user2@company.xyz' }
];

let rooms = [
  { id: 1, number: '101', description: 'Conference Room', capacity: 10 },
  { id: 2, number: '102', description: 'Meeting Room', capacity: 6 },
  { id: 3, number: '103', description: 'Board Room', capacity: 8 }
];

let meetings = [
  { id: 1, name: 'Team Meeting', time: new Date('2024-07-30T10:00:00'), room: '101', participants: ['user2'] },
  { id: 2, name: 'Project Review', time: new Date('2024-07-30T14:00:00'), room: '102', participants: ['admin'] }
];

const isDoubleBooked = (participant, startTime, endTime) => {
  return meetings.some(meeting => 
    meeting.participants.includes(participant) &&
    new Date(meeting.time) >= startTime &&
    new Date(meeting.time) < endTime
  );
};

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
  const user = users.find(user => user.username === username && user.password === password);

  if (user) {
    res.json({ message: 'Login successful', user });
  } else {
    res.status(401).json({ message: 'Invalid username or password' });
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
    res.status(201).json({message: 'Account created successfully'});
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
