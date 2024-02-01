// GameRoom.js
const Room = require('./Room');

const Lobby = require('./Lobby');


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
    if (this.queue.length == this.maxUsers -1 ) {
      this.createGameLobby();
    }
  }


    checkForWin() {

        let boardMatrix = this.boardState;

        const flatBoard =  [].concat(...boardMatrix)
        const winPatterns = [
            // Rows
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            // Columns
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            // Diagonals
            [0, 4, 8],
            [2, 4, 6]
        ];
    
        for (const pattern of winPatterns) {
            const [a, b, c] = pattern;
            if (flatBoard[a] && flatBoard[b] && flatBoard[c] && flatBoard[a] === flatBoard[b] && flatBoard[a] === flatBoard[c]) {
                return true; // We have a winner
            }
        }
    
        return false; // No winner
    }
    
    checkForDraw () {
        let boardMatrix = this.boardState;
        const flatBoard =  [].concat(...boardMatrix)

        return flatBoard.every((cell) => cell !== null);
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
    const lobby = new Lobby(lobbyName, this.queue);
    // Additional logic to start the game and handle game-related events
    // For simplicity, just logging for now
    console.log(`Game lobby created: ${lobby.name}`);
  }
}

module.exports = GameRoom;

