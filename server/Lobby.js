// Lobby.js
import Room from './Room.js';

export default class Lobby extends Room {
  constructor(name, users) {
    super(name);
    this.users = users;
  }

  // Additional methods for handling game-related events in the lobby
}
