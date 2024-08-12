const { initializeApp } = require('firebase/app');
const { collection, query, where, addDoc, getDoc, getDocs, getFirestore, connectFirestoreEmulator, Timestamp, updateDoc, doc } = require('firebase/firestore');
const { firebaseConfig } = require('../firebaseConfig');
const { User } = require('../user');
const { Meeting } = require('../meeting');
const { Room } = require('../room');

const { testRooms } = require('../mockDatabase/roomsCollection');
const { testMeetings } = require('../mockDatabase/meetingsCollection');
const useTestValues = true;

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(firebaseApp);
connectFirestoreEmulator(db, 'localhost', 9000);

exports.createRoom = async (req, res) => {
    const { number, description, capacity, isPremium } = req.body;
    console.log( req.body);

    if (useTestValues) {
        var newRoom = new Room( crypto.randomUUID(), number, description, capacity, isPremium);
        console.log(`Room created with ID: ${newRoom.id}`);
        testRooms.push(newRoom);
        res.sendStatus(201);
    } else {
        // TODO: Add guards to ensure fields in body match desired types
        try {
            const docRef = await addDoc(collection(db, "rooms"), {
              id: crypto.randomUUID(), // May be easier to use this as a key
              number: number,
              capacity: capacity,
              description: description,
              isPremium: isPremium ? true : false,
            });
            console.log("Document written with ID: ", docRef.id);
            res.send(201);
        } catch (e) {
            // TODO: Handle this on front-end as well.
            console.error("Error adding document: ", e);
        }
    }

}

exports.getAllRooms = async (req, res) => {
    if (useTestValues) {
        res.json(testRooms);
    }
}

// Returns rooms available at a given time.
// Checks timestamps to see what meetings are scheduled, and in which rooms.
// Send back rooms that are not in that set.
exports.getRoomsForTime = async (req, res) => {
    const { timestamp } = req.body; // This must be on the hour, or it will fail.

    if (useTestValues) {
        var unavailableRoomNames = [];
        for ( meeting of testMeetings) {
            if ( timestamp == meeting.time ) {
                unavailableRoomNames.push(meeting.room);
            }
        }
        var filteredRooms = testRooms.filter(room => {
            if (!unavailableRoomNames.includes(room.description)) {
                return room;
            }
        })
        res.json(filteredRooms);
    } else {
        const queryTime = new Timestamp(timestamp)
        const meetingsCollection = collection(db, "meetings");
        const meetingQuery = query(meetingsCollection,
            where("time", "==", queryTime)
        );
    
        var bookedRoomReferences = [];
        try {
            const meetingSnapshot = await getDocs(meetingQuery);
            meetingSnapshot.forEach((meeting) => {
                // console.log('Got meeting: ', meeting.data().room)
                bookedRoomReferences.push(meeting.data().room);
            })
        } catch (e) {
            console.log(`Couldn't get meetings`);
        }
    
        // TODO: - There is a bug here, this code runs ahead of the code above...
        console.log(bookedRoomReferences)
        var roomIDs = [];
        try {
            bookedRoomReferences.forEach(async (bookedRoom) => {
                const room = await getDoc(bookedRoom);
                console.log(room.data());
                roomIDs.push(room.data().id);
            })
            console.log(roomIDs);
        } catch {
            console.log("Couldn't get rooms");
        }
    }
}