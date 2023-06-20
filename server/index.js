const express = require('express');
const app = express();

const http = require('http');
const { Server } = require('socket.io');

const cors = require("cors");

const server = http.createServer(app);

const io =  new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
})

io.on("connection", (socket)=> {

    socket.on("send_message", (data, room) => {

        

        if(room === '') {
            console.log('broadcasting message', data)
            socket.broadcast.emit("recieve_message", data)
        }else {
            socket.to(room).emit("recieve_message", data)
        }
        
    })

    socket.on("join-room", (room, cb) => {

        const SocketsInThisRoom = io.sockets.adapter.rooms.get(room)

        const roomsSocketBeenPartOf = Array.from(socket.rooms.values()).filter((r)=>{ return r !== socket.id})
        

        const numberOfSocketsInThisRoom = SocketsInThisRoom ?  SocketsInThisRoom.size : 0;

        if(roomsSocketBeenPartOf.length > 0 || numberOfSocketsInThisRoom >= 2) {
            socket.to(socket.id).emit("room_join_error", {
                error: "unable to join room"
            })
        } else {
            socket.join(room)

            cb(`joined ${room} which has ${numberOfSocketsInThisRoom+1} sockets now. this socket is part of ${roomsSocketBeenPartOf.length+1} rooms now `)
        } 
    })
})


server.listen(3001, () => {
    console.log("server is running on 3001");
})
