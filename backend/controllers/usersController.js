const { initializeApp } = require('firebase/app');
const { collection, query, where, addDoc, getDoc, getDocs, getFirestore, connectFirestoreEmulator, Timestamp, updateDoc, doc } = require('firebase/firestore');
const { firebaseConfig } = require('../firebaseConfig');
const { User } = require('../user');
const { Meeting } = require('../meeting');

var { testUsers } = require('../mockDatabase/usersCollection');
var { testLoginCreds } = require('../mockDatabase/loginCredentialsCollection');
var { testMeetings } = require('../mockDatabase/meetingsCollection');
const useTestValues = true;

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(firebaseApp);
connectFirestoreEmulator(db, 'localhost', 9000);

exports.getAllUsers = async (req, res) => {
    if (useTestValues) {
        res.json(testUsers);
        return;
    } else {
        const querySnapshot = await getDocs(collection(db, "users"));
        var retrievedUsers = [];
        querySnapshot.forEach((doc) => {
            console.log(`${doc.id} => ${doc.data()}`);
            var { firstName, lastName, email, id } = doc.data();
            var user = new User(firstName, lastName, email, id);
            retrievedUsers.push(user);
    
            //TODO: For each room, get its meetings. - This should be
            // admin only, since this may reveal more than needed to a user.
        });
    
        res.json(retrievedUsers);
    }
}

exports.getAllUsersAndRole = async (req, res) => {
    if (useTestValues) {
        var usersJoinedWithRoleValue = testUsers.map(user => {
            for (cred of testLoginCreds) {
                if (user.id == cred.userId) {
                    user.isAdmin = cred.isAdmin;
                }
            }
            return user;
        })
        res.json(usersJoinedWithRoleValue);
    }
}

exports.updateUserPrivileges = async (req, res) => {
    const { email, isAdmin } = req.body;

    if (useTestValues) {
        for ( login of testLoginCreds ) {
            if ( email == login.email ) {
                login.isAdmin = isAdmin;
                console.log(`User: ${email} : Admin: ${isAdmin}`)
            }
        }
        res.sendStatus(200);
    } else {
        const usersCollection = collection(db, "loginCredentials");
        const userQuery = query(usersCollection, where("email", "==", email));
        const querySnapshot = await getDocs(userQuery);
        var retrievedUserRef;
        querySnapshot.forEach((doc) => {
            console.log(`${doc.id} => ${doc.data()}`);
            retrievedUserRef = doc.ref;
        });
        await updateDoc(retrievedUserRef, {
            "isAdmin": isAdmin,
        });

        res.sendStatus(200);
    }
}

exports.suspendUser = async (req, res) => {
    const { email, id } = req.body // Get email and user ID
    if (useTestValues) {
        // 1. Remove any meetings the user created.
        testMeetings = testMeetings.filter(meeting => {
            return meeting.owner !== id
        })
        // 2. Remove them as a participant from any meetings that exist:
        for (meeting of testMeetings) {
            meeting.participants = meeting.participants.filter(user => {
                if (user.id == id) {
                    console.log(`Found user ${id} in meeting`);
                }
                return user.id !== id
            });
        }
        // 3. Remove them from user's table.
        testUsers = testUsers.filter(user => {
            return user.email != email
        });
        // 4. Remove them from login table.
        testLoginCreds = testLoginCreds.filter(login => {
            return login.userId !== id;
        })
        res.sendStatus(200);
    }
}