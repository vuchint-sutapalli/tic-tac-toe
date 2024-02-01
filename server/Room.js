// Room.js
class Room {
    constructor(name, users, active) {
        this.name = name;
        this.users = users;
        this.chatHistory = [];
        this.active = active;
      }

  addUser(user) {
    this.users.push(user);
  }

  setAsActive(userId) {
    this.active = userId
  }
  getActiveUser(){
    return this.active;
  }

  removeUser(user) {
    this.users = this.users.filter(u => u !== user);
  }

  sendMessage(message, sender) {
    this.chatHistory.push({ sender, message });
  }
}

module.exports = Room;


