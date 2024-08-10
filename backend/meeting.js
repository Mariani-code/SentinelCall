const { User } = require('./user');

class Meeting {
    constructor(name, room, time, participants) {
        this.name = name;
        this.room = room;
        this.time = time;
        this.participants = participants;
    }
}

module.exports = { Meeting };