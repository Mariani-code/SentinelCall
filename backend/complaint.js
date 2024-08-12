const { User } = require('./user');
let complaints = [
    { id: 1, user: 'user2', complaint: 'Room 105 does not exist in the system' },
    { id: 2, user: 'user4', complaint: 'My account should be an admin account' }
];
class Complaint {
    constructor(text) {
        this.id = crypto.randomUUID();
        this.text = text;
        this.isOpen = true;
    }
}

module.exports = { Complaint };