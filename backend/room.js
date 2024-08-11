class Room {
    constructor(id, number, description, capacity, isPremium) {
        this.id = id;
        this.number = number;
        this.description = description;
        this.capacity = capacity;
        this.isPremium = isPremium ? isPremium : false;
        this.meetings = [];
    }
}

module.exports = { Room };