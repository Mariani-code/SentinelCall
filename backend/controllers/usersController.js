const { initializeApp } = require('firebase/app');
const { collection, query, where, addDoc, getDoc, getDocs, getFirestore, connectFirestoreEmulator, Timestamp, updateDoc, doc } = require('firebase/firestore');
const { firebaseConfig } = require('../firebaseConfig');
const { User } = require('../user');
const { Meeting } = require('../meeting');


// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);


// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(firebaseApp);
connectFirestoreEmulator(db, 'localhost', 9000);

exports.getAllUsers = async (req, res) => {
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