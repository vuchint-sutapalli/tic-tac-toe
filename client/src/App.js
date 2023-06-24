import { useEffect, useState } from 'react';
import './App.css';
import socketService from './services/socketService';

import Home from './components/home';

import Board from './components/Board';


function App() {

  const url = 'http://localhost:3001';

  const [socketId, setSocketId] = useState("");

  const [serverRoomId, setserverRoomId] = useState(null);



  const connectSocket = async () => {
    const socket = await socketService.connect(url).catch((err) => {
      console.log( `error: ${err}`)
    })
  }

    useEffect(() => {
      connectSocket()
      let socket = socketService.getSocket();
  
  
      socket.on("connect", () => {
        setSocketId(socket.id);
      });

      return () => {
        socket.off("connect");
      };


    }, []);



  return (
    <div className="App">
      <div className="message-container">{`you connected with id ${socketId}`}</div>
      {
        serverRoomId ? (
            <Board serverRoomId ={serverRoomId} />
        ): (
          <Home setserverRoomId={setserverRoomId} />
        )
      }
    </div>
  );
}

export default App;
