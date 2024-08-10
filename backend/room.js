class Room {
    constructor(id, number, description, capacity, hourlyRate) {
        this.id = id;
        this.number = number;
        this.description = description;
        this.capacity = capacity;
        this.hourlyRate = hourlyRate ? hourlyRate : 0;
        this.meetings = [];
    }
}

module.exports = { Room };