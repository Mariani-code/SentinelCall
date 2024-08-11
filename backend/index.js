const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');
const { initializeApp } = require('firebase/app');
const { collection, query, where, addDoc, getDoc, getDocs, getFirestore, connectFirestoreEmulator, writeBatch, Timestamp } = require('firebase/firestore');
const { Meeting } = require('./meeting');
const { User } = require('./user');
const { Room } = require('./room');
const { Complaint } = require('./complaint');
const { firebaseConfig } = require('./firebaseConfig');

const app = express();
const port = 1000;

app.use(bodyParser.json());
app.use(cors());

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(firebaseApp);
connectFirestoreEmulator(db, 'localhost', 9000);

let users = [
    { username: 'admin', password: 'admin', email: 'admin@company.xyz' },
    { username: 'user2', password: 'password2', email: 'user2@company.xyz' }
];

let userInfo = [
    { username: 'admin', firstName: "ada", lastName: "min" },
    { username: 'user2', firstName: "user", lastName: "two" }
];

let seedUserInfo = [
    new User("Test1", "User1", "test@test.com"),
    new User("Test2", "User2", "test2@test.com"),
    new User("Test3","User3", "test3@test.com"),
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

let seedRoomInfo = [
    new Room(crypto.randomUUID(), 101, 'Conference Room', 100, 100),
    new Room(crypto.randomUUID(), 102, 'Board Room', 50),
    new Room(crypto.randomUUID(), 103, 'Training Room', 20)
];

let meetings = [
    { id: 1, name: 'Team Meeting', time: new Date('2024-07-30T10:00:00'), room: '101', participants: ['user2'] },
    { id: 2, name: 'Project Review', time: new Date('2024-07-30T14:00:00'), room: '102', participants: ['admin'] }
];

let seedComplaints = [
    new Complaint("Room 105 does not exist in the system"),
    new Complaint("My account should be an admin account"),
]

let complaints = [
    { id: 1, user: 'user2', complaint: 'Room 105 does not exist in the system' },
    { id: 2, user: 'user4', complaint: 'My account should be an admin account' }
];

// Fills target database (local or remote) with base user data. (Not log-in)
// TODO: Add check for duplicate users.
app.get('/userSeed', async (req, res) => {
    var ids = [];
    // TODO: This may be 3 separate POST requests. Double check if this can be batched up.
    for (user of seedUserInfo) {
        const { firstName, lastName, email } = user;
        try {
            const docRef = await addDoc(collection(db, "users"), {
                firstName,
                lastName,
                email,
            });
            console.log("Document written with ID: ", docRef.id);
            ids.push(docRef.id);
        } catch (e) {
            // TODO: Handle this on front-end as well.
            console.error("Error adding document: ", e);
        }
    }
    console.log('Users seeded with IDs: ', ids)
    res.send({ "Users Added" : ids.length});
});

app.get('/roomSeed', async (req, res) => {
    var ids = [];
    // TODO: This may be 3 separate POST requests. Double check if this can be batched up.
    for (room of seedRoomInfo) {
        const { id, number, description, capacity, hourlyRate } = room;
        try {
            const docRef = await addDoc(collection(db, "rooms"), {
                id,
                number,
                description,
                capacity,
                hourlyRate,
            });
            console.log("Document written with ID: ", docRef.id);
            ids.push(docRef.id);
        } catch (e) {
            // TODO: Handle this on front-end as well.
            console.error("Error adding document: ", e);
        }
    }
    console.log('Rooms seeded with IDs: ', ids)
    res.send({ "Rooms Added" : ids.length});
})

app.get('/meetingSeed', async (req, res) => {
    var ids = [];

    // TODO: Specify users to pull DB references for.
    // 1. Fetch seeded users, store refs
    console.log('Fetching seeded user data...');
    var userDocRefs = [];
    const userQuerySnapshot = await getDocs(collection(db, "users"));
    userQuerySnapshot.forEach((user) => {
        console.log(`User Found: ${user.data().firstName} : ${user.ref}`)
        userDocRefs.push(user.ref);
    });

    // 2. Fetch seeded rooms, store refs
    console.log('Fetching seeded room data...');
    var roomDocRefs = [];
    const roomQuerySnapshot = await getDocs(collection(db, "rooms"));
    roomQuerySnapshot.forEach((room) => {
        console.log(`room Found: ${room.data().firstName} : ${room.ref}`)
        roomDocRefs.push(room.ref);
    });
    
    // 3. Use user and room refs to associate participants to a meeting, and assign a room:
    for (meeting of meetings) {
        const { id, room, name, time } = meeting;
        try {
            const docRef = await addDoc(collection(db, "meetings"), {
                id,
                room: roomDocRefs[0], // Associate first matched seed room for now.
                name,
                time: Timestamp.fromMillis(Math.floor(time.getTime())), // Need to do this so field is properly handled as "Timestamp"
                participants: userDocRefs,
            });
            console.log("Document written with ID: ", docRef.id);
            ids.push(docRef.id);
        } catch (e) {
            // TODO: Handle this on front-end as well.
            console.error("Error adding document: ", e);
        }
    }
    console.log('Meetings seeded with IDs: ', ids)
    res.send({ "Meetings Added" : ids.length});
})

app.get('/complaintsSeed', async (req, res) => {
    var ids = [];
    // 1. Get a user reference
    for (complaint of seedComplaints) {
        const { id, text, isOpen } = complaint;
        try {
            const docRef = await addDoc(collection(db, "complaints"), {
                id,
                text,
                isOpen,
            });
            console.log("Document written with ID: ", docRef.id);
            ids.push(docRef.id);
        } catch (e) {
            // TODO: Handle this on front-end as well.
            console.error("Error adding document: ", e);
        }
    }
    console.log('Complaints seeded with IDs: ', ids)
    res.send({ "Complaints Added" : ids.length});
})

/* 
TODO: Any administrative actions that delete references need to be done
"cleanly". If a room is deleted, the meetings associated with it need to be
deleted as well, for example. Same goes for users that are no longer in the DB
but may still be in a meeting.
*/

const isDoubleBooked = (participant, startTime, endTime) => {
    return meetings.some(meeting =>
        meeting.participants.includes(participant) &&
        new Date(meeting.time) >= startTime &&
        new Date(meeting.time) < endTime
    );
};

app.post('/grabAccountInfo', async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];

    if (token === null) {
        return res.status(400).json({ message: 'Please login to view account information' });
    }

    const decode = jwt.verify(token, 'your_jwt_secret');

    // From the token in request header, extract the ID.
    const id = decode.id;
    // 1. Use ID to find matching document in users collection:
    
    const userCollection = collection(db, "users");
    const userQuery = query(userCollection,
        where("id", "==", id)
    );
    try {
        var firstName, lastName, email;
        var userSnapshot = await getDocs(userQuery);
        userSnapshot.forEach(async (user) => {
            console.log(user.id, " => ", user.data());
            firstName = user.data().firstName;
            lastName = user.data().lastName;
            email = user.data().email;
        });
        res.status(200).json({firstName, lastName, email})
    } catch (e) {
        res.status(400).json({ message: "Error retrieving user profile data."})
    }
});

app.post('/rooms', async (req, res) => {
    const { number, description, capacity, hourlyRate } = req.body;
    // TODO: Add guards to ensure fields in body match desired types
    try {
        const docRef = await addDoc(collection(db, "rooms"), {
          id: crypto.randomUUID(), // May be easier to use this as a key
          number: number,
          capacity: capacity,
          description: description,
          hourlyRate: hourlyRate ? hourlyRate : 0,
        });
        console.log("Document written with ID: ", docRef.id);
        res.send(201);
    } catch (e) {
        // TODO: Handle this on front-end as well.
        console.error("Error adding document: ", e);
    }

    // TODO: Decide what should be returned here. This end-point could be specific for updating,
    // and the client can just make sure it refreshes after posting.
    // rooms.push(newRoom);
    // res.status(201).json(newRoom);
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

app.post('/test', async (req, res) => {
    try {
        const docRef = await addDoc(collection(db, "testDB"), {
          id: crypto.randomUUID(), // May be easier to use this as a key
        });
        console.log("Document written with ID: ", docRef.id);
        res.send(201);
    } catch (e) {
        // TODO: Handle this on front-end as well.
        console.error("Error adding document: ", e);
    }
})

app.post('/meetings', async (req, res) => {
    const { name, time, room, participants } = req.body;

    // This is just for stubbing purposes until front-end can query Users db:
    const testParticipants = [{
        email: "sqs6434@psu.edu"
    },
    {
        email: "okm5046@psu.edu"
    },
    {
        email: "jcm6309@psu.edu"
    }];

    console.log(req.body)

    // TODO: Verify the room chosen exists, and get its document ID.

    const startTime = time ? new Date(time) : new Date();
    const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);

    // TODO: Commenting out for now - Will return to this feature later:
    // Check if any participant is double-booked
    // const doubleBooked = participants.some(participant => isDoubleBooked(participant, startTime, endTime));

    // if (doubleBooked) {
    //     return res.status(400).json({ message: 'One or more participants are double-booked.' });
    // }

    // Insertion with reference is possible, but not very clear from documentation.
    // Perform query to match desired item.
    // using the doc object in the forEach, grab the doc.ref value, store in array.

    const roomsCollection = collection(db, "rooms");
    // TODO: Change the query to check for equality on the unique room ID.
    const roomQuery = query(roomsCollection, where("description", "==", room ? room : "The Colosseum"));
    const roomSnapshot = await getDocs(roomQuery);
    // Should only return one room:
    var roomReference;
    roomSnapshot.forEach(async (doc) => {
        console.log(doc.id, " => ", doc.data());
        roomReference = doc.ref;
    });

    var allUserReferences = [];
    for (participant of testParticipants) {
        console.log(`Have ${participant}, looking for ${participant.email}`);
        const usersCollection = collection(db, "users");
        const userQuery = query(usersCollection, where("email", "==", participant.email));
        const userSnapshot = await getDocs(userQuery);
        userSnapshot.forEach(async (doc) => {
            console.log(doc.id, " => ", doc.data());
            allUserReferences.push(doc.ref);
        })
    }

    try {
        const docRef = await addDoc(collection(db, "meetings"), {
            id: crypto.randomUUID(),
            name,
            time: startTime,
            room: roomReference,
            participants: allUserReferences
        });
        console.log("Document written with ID: ", docRef.id);
    } catch (e) {
        // TODO: Handle this on front-end as well.
        console.error("Error adding document: ", e);
    }
    res.status(201);
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log("Incoming user/pass: " ,email, password);
    // Dummy authentication check
    // const user = users.find(user => user.username === username && user.password === password);
    // TODO: Provide some form of regex check here, or other sanitization, before querying.
    // 1. Check loginCredentials collection for an entry matching the password and email exactly:
    // TODO: Handle failure here (no matches found)
    const loginCredCollection = collection(db, "loginCredentials");
    const loginCredQuery = query(loginCredCollection, 
        where("email", "==", email ),
        where("password", "==", password)
    );

    // Need to wrap queries in a try to ensure errors are caught and proper
    // responses can be sent.
    try {
        var loginCredentialsSnapshot = await getDocs(loginCredQuery);
        var userReference;
        var isAdmin;
        loginCredentialsSnapshot.forEach(async (doc) => {
            console.log(doc.id, " => ", doc.data());
            isAdmin = doc.data().isAdmin;
            userReference = doc.data().userRef;
        })
        // // 2. Get user document from users collection
        const usersCollection = collection(db, "users");
        const userSnapshot = await getDoc(userReference);
    
        const { firstName, lastName, id } = userSnapshot.data();
        const retrievedEmail = userSnapshot.data().email // different var name due to name collision
    
        // Generate a token or send a success response
        const token = jwt.sign({
            email: retrievedEmail, 
            firstName, 
            lastName, 
            id, 
            isAdmin ,
        },
        'your_jwt_secret', 
        { expiresIn: '1h' });
        res.json({ token });
    } catch (e) {
        res.status(401).json({ message: 'Invalid email or password' });
    }
});

/*
    Checks role of the user
    Admin - Mange room, manage account, view complaints
    Client - Create meeting, create complaint, veiw meetings
*/
app.post('/checkRole', (req, res) => {
    console.log('Incoming token: ')
    try {
        const token = req.headers.authorization.split(' ')[1];
        console.log("Token: ", token);
        if (token === null) {
            throw new Error();
        }

        const decoded = jwt.verify(token, 'your_jwt_secret');

        if (decoded.exp * 1000 < Date.now()) {
            throw new Error();
        }

        if (decoded.isAdmin) {
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

app.post('/createAccount', async (req, res) => {
    // TODO: Check that account doesn't already exist.
    // 1. Create entry into users collection with user info.
    // 2. Create entry into loginCredentials collection, and create reference to prior user document.

    const { firstName, lastName, password, email } = req.body;

    try {
        const userRef = await addDoc(collection(db, "users"), {
            firstName,
            lastName,
            email,
            id: crypto.randomUUID(), // assign random ID for user document
        });
        console.log("New user added with ID: ", userRef.id);

        const loginCredRef = await addDoc(collection(db, "loginCredentials"), {
            userRef,
            password,
            email,
            isAdmin: false,
        });
        res.status(201).json({ message: 'Account created successfully' });
        
    } catch (e) {
        res.status(401).json({ message: 'Error creating account. Please contact administrator.' });
    }
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

async function getParticipantsAsUsers(participants) {
    var users = [];
    for (const participant of participants) {
        let userData = await getDoc(participant);
        var { firstName, lastName, email } = userData.data();
        users.push(new User(firstName, lastName, email));
    }
    return users;
};

app.get('/meetings', async (req, res) => {
    // get all meetings
    // get room per meeting
    // get all users in each meeting.
    console.log('GET /meetings...')
    const querySnapshot = await getDocs(collection(db, "meetings"));
    var meetings = await Promise.all(querySnapshot.docs.map(async (doc) => {

        var {name, time, room, participants } = doc.data();
        console.log(doc.id); // Maps to the ID shown in Firebase console.

        const roomName = await getDoc(room);

        // For some reason, Date objects in JS require 3 extra digits...

        var users = await getParticipantsAsUsers(participants);
        return new Meeting(name, roomName.data().description, time.seconds * 1000, users);
    }))
    .then((result) => {
        res.json(result);
    });
});

app.get('/rooms', async (req, res) => {
    const querySnapshot = await getDocs(collection(db, "rooms"));
    console.log('After query...')
    var retrievedRooms = [];
    querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${doc.data()}`);
        var { id, number, description, capacity } = doc.data();
        var room = new Room(id, number, description, capacity);
        retrievedRooms.push(room);

        //TODO: For each room, get its meetings. - This should be
        // admin only, since this may reveal more than needed to a user.
    });

    res.json(retrievedRooms);
});

app.get('/complaints', (req, res) => {
    res.json(complaints);
});

app.get('/', (req, res) => {
    res.send('Your server is running');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
