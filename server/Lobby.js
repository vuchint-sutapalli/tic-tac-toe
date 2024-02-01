// Lobby.js
// const GameRoom = require('./GameRoom');
const Room = require('./Room');

class Lobby extends Room {
    constructor(name, users, active) {
        super(name, users, active);
        this.name = name;
        this.users = users;
        this.active = active;
      }
}

module.exports = Lobby;


