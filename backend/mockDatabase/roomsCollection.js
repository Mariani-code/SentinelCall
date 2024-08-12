const { User } = require('../user');
const { Meeting } = require('../meeting');
const { Room } = require('../room');

exports.testRooms = [
    new Room(
        "16e941c1-d46f-40ea-b627-a26b6a414541", 
        101, 
        'Conference Room', 
        100, 
        true
    ),
    new Room(
        "79b1a81d-6d4c-4feb-a8e6-3092af4f4453", 
        102, 
        'Regular Suite',
        25,
        false
    ),
];
