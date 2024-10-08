const { initializeApp } = require('firebase/app');
const { collection, query, where, addDoc, getDoc, getDocs, getFirestore, connectFirestoreEmulator, Timestamp, updateDoc, doc } = require('firebase/firestore');
const { firebaseConfig } = require('../firebaseConfig');
const { User } = require('../user');
const { Meeting } = require('../meeting');
const jwt = require('jsonwebtoken');

var { testUsers } = require('../mockDatabase/usersCollection');
var { testMeetings } = require('../mockDatabase/meetingsCollection');
const useTestValues = true;

const weekInSeconds = 7 * 24 * 60 * 60;
const dayInSeconds = 24 * 60 * 60;

// 8 - 18 - 2024 @ 10AM:
const sunday = 1724000400;
const monday = sunday + dayInSeconds;
const tuesday = monday + dayInSeconds;
const wednesday = tuesday + dayInSeconds;
const thursday = wednesday + dayInSeconds;
const friday = thursday + dayInSeconds;

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(firebaseApp);
connectFirestoreEmulator(db, 'localhost', 9000);

async function getParticipantsAsUsers(participants) {
    var users = [];
    for (const participant of participants) {
        let userData = await getDoc(participant);
        var { firstName, lastName, email, id } = userData.data();
        users.push(new User(firstName, lastName, email, id));
    }
    return users;
};

/*
Creates meeting with:
    name: String,
    time: timestamp
    room: roomID
    participants: user IDs
*/
exports.createMeeting = async (req, res) => {
    const { name, time, room, participants } = req.body;

    const token = req.headers.authorization.split(' ')[1];
    if (token === null) {
        return res.status(400).json({ message: 'Please login to view account information' });
    }

    const decode = jwt.verify(token, 'your_jwt_secret');
    const ownerID = decode.id

    console.log(req.body)

    if (useTestValues) {
        // find all participants:
        var matchedUsers = [];
        for (user of testUsers) {
            for (participant of participants) {
                if (user.id == participant) {
                    matchedUsers.push(user)
                }
            }
        }
        // Instantiate meeting, insert into array.
        var newMeeting = new Meeting(
            name,
            room,
            time,
            matchedUsers,
            ownerID,
            crypto.randomUUID()
        );

        testMeetings.push(newMeeting);
        console.log(testMeetings);
        res.json(testMeetings);
    } else {
        // TODO: Verify the room chosen exists, and get its document ID.
    
        const startTime = time ? new Date(time) : new Date();
            
        // Insertion with reference is possible, but not very clear from documentation.
        // Perform query to match desired item.
        // using the doc object in the forEach, grab the doc.ref value, store in array.
    
        const roomsCollection = collection(db, "rooms");
        // TODO: Change the query to check for equality on the unique room ID.
        const roomQuery = query(roomsCollection, where("id", "==", room));
        const roomSnapshot = await getDocs(roomQuery);
        // Should only return one room:
        var roomReference;
        roomSnapshot.forEach(async (doc) => {
            console.log(doc.id, " => ", doc.data());
            roomReference = doc.ref;
        });
    
        var allUserReferences = [];
        for (participant of participants) {
            // console.log(`Have ${participant}, looking for ${participant.email}`);
            const usersCollection = collection(db, "users");
            const userQuery = query(usersCollection, where("id", "==", participant));
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
                participants: allUserReferences,
                ownerID,
            });
            console.log("Document written with ID: ", docRef.id);
            res.json({"message" : "Meeting created"});
        } catch (e) {
            // TODO: Handle this on front-end as well.
            console.error("Error adding document: ", e);
            res.status(400);
        }

    }
};

/*
Gets meeting with:
    timestamp
*/
exports.getMeetingAtTime = async (req, res) => {
    // Timestamp has to be exact. Both the seconds and nanoseconds property.
    // Need to normalize time going into db to prevent mismatches...
    const { timeStamp } = req.body;
    const queryTime = new Timestamp(timeStamp)
    console.log('GET /meetingsByTime for ', timeStamp);
    const meetingCollection = collection(db, "meetings");
    const meetingQuery = query(meetingCollection,
        where("time", "==", queryTime)
    );
    console.log("Searching for ", new Timestamp(timeStamp) )
    try {
        const meetingSnapshot = await getDocs(meetingQuery);
        await meetingRoomAndParticipantPromises(meetingSnapshot)
        .then((result) => {
            res.json(result);
        });
    } catch (e) {
        res.status(401).json({ message: 'Invalid meeting search request.' });
    }
};

exports.getMeetingsOnDay = async (req, res) => {
    const { timeStamp } = req.body;
    const endTime = timeStamp + dayInSeconds // One week in seconds.
    const queryTime = new Timestamp(timeStamp)
    const queryEndTime = new Timestamp(endTime);
    console.log('GET /meetingsByDay (Controller): Search from  ', new Date(timeStamp * 1000));
    const meetingCollection = collection(db, "meetings");
    const meetingQuery = query(meetingCollection,
        where("time", ">=", queryTime),
        where("time", "<=", queryEndTime),
    );
    console.log("Searching for ", new Timestamp(timeStamp) )
    try {
        const meetingSnapshot = await getDocs(meetingQuery);
        await meetingRoomAndParticipantPromises(meetingSnapshot)
        .then((result) => {
            res.json(result);
        });
    } catch (e) {
        res.status(401).json({ message: 'Invalid meeting search request.', error: e });
    }
};

exports.getMeetingsByWeek = async (req, res) => {
    const { timeStamp } = req.body;
    const endTime = timeStamp + weekInSeconds; // One week in seconds.
    const queryTime = new Timestamp(timeStamp)
    const queryEndTime = new Timestamp(endTime);
    console.log('GET /meetingsByWeek (Controller): Search from  ', new Date(timeStamp * 1000));
    const meetingCollection = collection(db, "meetings");
    const meetingQuery = query(meetingCollection,
        where("time", ">=", queryTime),
        where("time", "<=", queryEndTime),
    );
    console.log("Searching for ", new Timestamp(timeStamp) )
    try {
        const meetingSnapshot = await getDocs(meetingQuery);
        await meetingRoomAndParticipantPromises(meetingSnapshot)
        .then((result) => {
            res.json(result);
        });
    } catch (e) {
        res.status(401).json({ message: 'Invalid meeting search request.', error: e });
    }
};

/*
Gets meeting with:
    room: roomID
*/
exports.getMeetingsByRoom = async (req, res) => {
    // get meetings held in a specific room.
    const { roomID } = req.body; 
    var roomReference;

    // Get room reference:
    const roomsCollection = collection(db, "rooms");
    const roomQuery = query(roomsCollection,
        where("id", "==", roomID)
    );

    try {
        const roomSnapshot = await getDocs(roomQuery);
        roomSnapshot.forEach((room) => {
            console.log(`Room found: ${room.data().description}`);
            roomReference = room.ref;
        })
    } catch (e) {
        // Couldn't perform query for room.
    }

    // Get meetings with a room matching that reference:
    const meetingCollection = collection(db, "meetings");
    const meetingQuery = query(meetingCollection,
        where("room", "==", roomReference),
    );
    console.log("Searching for Meetings in Room: ", roomReference);
    try {
        const meetingSnapshot = await getDocs(meetingQuery);
        await meetingRoomAndParticipantPromises(meetingSnapshot)
        .then((result) => {
            res.json(result);
        });
    } catch (e) {
        res.status(401).json({ message: 'Invalid meeting search request.', error: e });
    }
};


exports.getAllMeetings = async (req, res) => {
    // get all meetings
    // get room per meeting
    // get all users in each meeting.
    console.log('GET /meetings...')
    const querySnapshot = await getDocs(collection(db, "meetings"));
    await meetingRoomAndParticipantPromises(querySnapshot)
    .then((result) => {
        res.json(result);
    });
};

/*
Gets meeting with:
    user (ownerID) - id stored in the jwt token.
*/
exports.getMeetingsByOwner = async (req, res) => {
    // get meetings created by a specific user.
    var ownerID;
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (token === null) {
         
            return res.status(400).json({ message: 'Please login to view account information' });
        }
        const decode = jwt.verify(token, 'your_jwt_secret');
        ownerID = decode.id
    } catch (e) {
        res.sendStatus(401);
        return;
    }
    
    if (useTestValues) {
        testMeetings = testMeetings.filter(meeting => {
            return meeting.owner == ownerID
        })
        res.json(testMeetings);
    }
    else {
        const meetingCollection = collection(db, "meetings");
        const meetingQuery = query(meetingCollection,
            where("ownerID", "==", ownerID),
        );
        console.log("Searching for User: ", ownerID);
        try {
            const meetingSnapshot = await getDocs(meetingQuery);
            await meetingRoomAndParticipantPromises(meetingSnapshot)
            .then((result) => {
                res.json(result);
            });
        } catch (e) {
            res.status(401).json({ message: 'Invalid meeting search request.', error: e });
        }
    }

};

exports.getMeetingsByParticipant = async (req, res) => {
    const { userID } = req.body;

    var userReference;

    // Get user reference:
    const usersCollection = collection(db, "users");
    const userQuery = query(usersCollection,
        where("id", "==", userID)
    );

    try {
        const userSnapshot = await getDocs(userQuery);
        userSnapshot.forEach((user) => {
            console.log(`user found: ${user.data().description}`);
            userReference = user.ref;
        })
    } catch (e) {
        // Couldn't perform query for room.
    }

    // Get meetings with a room matching that reference:
    const meetingCollection = collection(db, "meetings");
    const meetingQuery = query(meetingCollection,
        where("participants", "array-contains", userReference),
    );
    console.log("Searching for Meetings with Participant ", userReference);
    try {
        const meetingSnapshot = await getDocs(meetingQuery);
        await meetingRoomAndParticipantPromises(meetingSnapshot)
        .then((result) => {
            res.json(result);
        });
    } catch (e) {
        res.status(401).json({ message: 'Invalid meeting search request.', error: e });
    }
}

exports.updateParticipants = async (req, res) => {
    // Extract list of desired participants in request, obtain references.
    // Update (override) participants array with new references.
    const { participants, meetingID, meetingId, participantsToAdd, participantsToRemove } = req.body; // (Array)

    if (useTestValues) {
        if (participantsToAdd.length > 0) {
            // add to meeting
        }
        if (participantsToRemove.length > 0) {
            // find meeting in table
            // filter participants based on the removal array.
            var filteredParticipants;
            var targetMeeting;
            for (meeting of testMeetings) {
                if (meeting.id == meetingId) {
                    targetMeeting = structuredClone(meeting);
                }
            }
            console.log('Target Meeting', targetMeeting);
            for (userToRemove of participantsToRemove) {
                console.log('Backend - Attempting to remove user: ', userToRemove);
                filteredParticipants = targetMeeting.participants.filter(participant => participant.id != userToRemove)
            }
            for (meeting of testMeetings) {
                if (meeting.id == meetingId) {
                    meeting.participants = filteredParticipants;
                    res.json(meeting);
                }
            }
        }
    } else {
        var userReferences = [];
    
        // Get user references:
        const usersCollection = collection(db, "users");
    
        for (participant of participants) {
            try {
                console.log(`Looking for ${participant.id}`);
                const userQuery = query(usersCollection,
                    where("id", "==", participant.id),
                );
                const userSnapshot = await getDocs(userQuery);
                userSnapshot.forEach((user) => {
                    userReferences.push(user.ref);
                })
    
            } catch (e) {
                console.log(e);
            }
        }
    
        // Find specific meeting
        var meetingRef;
        const meetingsCollection = collection(db, "meetings");
        const meetingQuery = query(meetingsCollection,
            where("id", "==", meetingID)
        );
        try {
            const meetingSnapshot = await getDocs(meetingQuery);
            meetingSnapshot.forEach((meeting) => {
                meetingRef = meeting.ref;
            })
            await updateDoc(meetingRef, {
                "participants": userReferences,
            });
            res.send({"message": "Meeting updated"})
        } catch (e) {
            res.send(400).json({"eror" : e})
        }
    }

}

async function meetingRoomAndParticipantPromises(meetingSnapshot) {
    return Promise.all(meetingSnapshot.docs.map(async (doc) => {
        var {name, time, room, participants } = doc.data();
        console.log(doc.id); // Maps to the ID shown in Firebase console.
        const roomName = await getDoc(room);
        // For some reason, Date objects in JS require 3 extra digits...
        var users = await getParticipantsAsUsers(participants);
        return new Meeting(name, roomName.data().description, time.seconds * 1000, users);
    }))
}