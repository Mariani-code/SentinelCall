const { User } = require('./user');

class Meeting {
    constructor(name, room, time, participants, owner, id) {
        this.name = name;
        this.room = room;
        this.time = time;
        this.participants = participants;
        this.owner = owner;
        this.id = id;
    }
}

module.exports = { Meeting };