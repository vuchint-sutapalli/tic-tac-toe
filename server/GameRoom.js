// GameRoom.js
const Room = require('./Room');

class GameRoom extends Room {
  constructor(name, users, active) {
    super(name, users, active);
    this.queue = [];
    this.maxUsers = 2;
    this.boardState = this.initializeBoardState();

  }

    initializeBoardState() {
        // Implement the function to initialize the board state
        // Return the initial board state as a 2D array or any suitable data structure
        // For example, a 3x3 board can be represented as [['', '', ''], ['', '', ''], ['', '', '']]
        return [[null, null, null], [null, null, null], [null, null, null]];
    }


  addToQueue(user) {
    this.queue.push(user);
    if (this.queue.length >= 2) {
      this.createGameLobby();
    }
  }

   isValidMove( rowIndex, colIndex) {
    // Check if the cell is within the bounds of the board
    if (
      rowIndex >= 0 && rowIndex < this.boardState.length &&
      colIndex >= 0 && colIndex < this.boardState[rowIndex].length
    ) {
      // Check if the cell is empty
      return this.boardState[rowIndex][colIndex] === null;
    }
    
    return false;
  }

  updateBoard({rowIndex, colIndex, mark }) {



    let clonedBoard = [...this.boardState.map((row) => [...row])];

    clonedBoard[rowIndex][colIndex] = mark; 

    this.boardState = clonedBoard



  }

  restartGame() {
    this.boardState = this.initializeBoardState();
  }

  returnRoomObj() {
    let obj = {
        "players":  this.users,
        
        "active":this.active,
        "boardState" : this.boardState
    }
    return obj
  }

  createGameLobby() {
    const lobbyName = `${this.name}_Lobby`;
    const lobby = new Lobby(lobbyName, this.queue.splice(0, 2));
    // Additional logic to start the game and handle game-related events
    // For simplicity, just logging for now
    console.log(`Game lobby created: ${lobbyName}`);
  }
}

module.exports = GameRoom;


// // GameRoom.js
// import Room from './Room.js';
// import Lobby from './Lobby.js';

// export default class GameRoom extends Room {
//   constructor(name) {
//     super(name);
//     this.queue = [];
//   }

//   addToQueue(user) {
//     this.queue.push(user);
//     if (this.queue.length >= 2) {
//       this.createGameLobby();
//     }
//   }

//   createGameLobby() {
//     const lobbyName = `${this.name}_Lobby`;
//     const lobby = new Lobby(lobbyName, this.queue.splice(0, 2));
//     // Additional logic to start the game and handle game-related events
//     // For simplicity, just logging for now
//     console.log(`Game lobby created: ${lobbyName}`);
//   }
// }
