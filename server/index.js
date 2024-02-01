const express = require('express');
const app = express();

const http = require('http');
const { Server } = require('socket.io');

const cors = require("cors");

const server = http.createServer(app);

const Room = require('./Room.js');

const  GameRoom  = require('./GameRoom.js');
// import Lobby from './Lobby.js';

const io =  new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
})
io.disconnectSockets();
// server.listen(3000)

// io.attach(server)

// const maxRoomSize = 2;

const gameRooms = new Map();

function initializeBoardState() {
    // Implement the function to initialize the board state
    // Return the initial board state as a 2D array or any suitable data structure
    // For example, a 3x3 board can be represented as [['', '', ''], ['', '', ''], ['', '', '']]
    return [[null, null, null], [null, null, null], [null, null, null]];
  }


  function checkForWin(boardMatrix) {

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

  const checkForDraw = (boardMatrix) => {
    const flatBoard =  [].concat(...boardMatrix)

    return flatBoard.every((cell) => cell !== null);
  }
  

io.on("connection", (socket)=> {  

    console.log('socket connected',socket.id);
    socket.on("send_message", (data, roomId) => {
        if(roomId === '') {
            console.log('broadcasting message', data)
            socket.broadcast.emit("recieve_message", data)
        }else {
            socket.to(roomId).emit("recieve_message", data)
        }
        
    })


    socket.on("restart_game", (roomId) => {
        if(roomId && gameRooms.get(roomId)?.returnRoomObj()?.players) {
          gameRooms.get(roomId).restartGame()

          setTimeout(() => {
            socket.to(roomId).emit('game-start', gameRooms.get(roomId).returnRoomObj());
          }, 500);
      }

    })

    socket.on("send_chat", (messageObj, roomId, playerId) => {

        // const messageObj = {
        //     author: playerId, 
        //     content: message,
        //     timestamp: new Date().toISOString(), // Add a timestamp to the message
        // };
        if(roomId === '') {
            console.log('broadcasting chat', messageObj.content)
            socket.broadcast.emit("recieve_chat", messageObj)
        }else {
            console.log(`emitting chat message : ${messageObj.content}`)
            socket.to(roomId).emit("recieve_chat", messageObj)
        }
        
    })


    socket.on("update_board", (data, roomId, playerId) => {
        const targetRoom = gameRooms.get(roomId);
        
        if (targetRoom) {
          let targetRoomData = targetRoom.returnRoomObj()
          const { rowIndex, colIndex } = data;
      
          // Validate the move
          if (targetRoom.isValidMove(rowIndex, colIndex)) {
            // Update the board state with the player's move
            targetRoom.updateBoard(data)

            let newBoardState = targetRoom.returnRoomObj().boardState

            const isWin = checkForWin(newBoardState);
            const isDraw = checkForDraw(newBoardState);

            if (isWin) {
                // Emit a 'game_over' event with the winning player's socket ID
                console.log('emitting game over. player won')
                // gameRooms.set(roomId, roomObject);
                io.to(roomId).emit('game_over', newBoardState, { winner: playerId });
              } else if (isDraw) {
                // Emit a 'game_over' event with a draw signal
                console.log('emitting game over. its a draw')
                // gameRooms.set(roomId, roomObject);
                io.to(roomId).emit('game_over', newBoardState, { draw: true });
              } else {
                const currentIndex = targetRoomData.players.findIndex(player => player.id === playerId);

                let nextIndex = (currentIndex + 1) % targetRoomData.players.length;
                targetRoom.setAsActive(targetRoomData.players[nextIndex].id)
                io.to(roomId).emit("recieve_board", newBoardState, targetRoom.getActiveUser());
              }
          }
        }
      });


      socket.on("create-room", (roomId, cb) => {
        const isRoomOccupied = !!gameRooms.get(roomId)

        if(!isRoomOccupied) {

          let newGameRoomInstance = new GameRoom(roomId,[{id:socket.id, totem: 'x'}],socket.id )

          gameRooms.set(roomId, newGameRoomInstance);       

          socket.join(roomId)
          socket.emit("console-message", `created a new room ${roomId}and joined in it. waiting for second`, gameRooms.get(roomId)?.returnRoomObj());
          cb(roomId);

        }else {
          socket.emit("log-message", `room ${roomId} already occupied. try again`);
        }

      })
     
    socket.on("join-room", (roomId, cb) => {

        // const existingRoom = gameRooms.get(roomId)?.returnRoomObj();
        const chosenRoom = gameRooms.get(roomId);

        const chosenRoomData =  chosenRoom.returnRoomObj();

        socket.emit("console-message", `chosen room:`, chosenRoomData);

      
        if(chosenRoom === undefined) {
          socket.emit("log-message", `no active room with id ${roomId}. try again`);
          return
        }

        // room exists

        const SocketsInThisRoom = io.sockets.adapter.rooms.get(roomId)

        const roomsSocketBeenPartOf = Array.from(socket.rooms.values()).filter((r)=>{ return r !== socket.id})
        

        const numberOfSocketsInThisRoom = SocketsInThisRoom ?  SocketsInThisRoom.size : 0;

        if(roomsSocketBeenPartOf.length > 1) {
            cb(`error joining: already part of ${roomsSocketBeenPartOf.length} room`)
            return
        }else if( numberOfSocketsInThisRoom >= chosenRoom.maxUsers) {
            cb(`error joining: more than ${numberOfSocketsInThisRoom} players not allowed in the room`)
            return
        }else if (chosenRoomData.players.length >= chosenRoom.maxUsers ) {
          cb(`error joining: Room ${roomId} is already full.`);
          return;
        }else if (roomsSocketBeenPartOf.includes(roomId)) {
          cb(`error joining: already in the room ${roomId}`)
          return
        }
        
        socket.join(roomId)


        chosenRoom.addUser({id:socket.id, totem: 'y'})
   
        const roomClients = io.sockets.adapter.rooms.get(roomId);



            if (roomClients.size === chosenRoom.maxUsers) {
              // Both players have joined the room
              // const currentRoom = gameRooms.get(roomId);
              console.log('2 playes joined and current room is', chosenRoom.returnRoomObj())
              
              setTimeout(() => {
                io.to(roomId).emit('game-start', chosenRoom.returnRoomObj());
              }, 500);
                
            }

            cb(`joined ${roomId} which has ${numberOfSocketsInThisRoom+1} sockets now. this socket is part of ${roomsSocketBeenPartOf.length+1} rooms now `, roomId)
        // } 
    })
})


server.listen(3001, () => {
    console.log("server is running on 3001");
})
