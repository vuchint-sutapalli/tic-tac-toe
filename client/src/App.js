import { useEffect, useState } from 'react';
import './App.css';
import socketService from './services/socketService';

import Home from './components/home';

import Board from './components/Board';


function App() {

  const url = 'http://localhost:3001';

  const [socketId, setSocketId] = useState("");

  const [serverRoomId, setserverRoomId] = useState(null);

  const [logs, setLogs] = useState([]);




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

      socket.on('console-message', (msg, o) => {
          console.log(msg, JSON.stringify(o))
       });

      socket.on('log-message', (log) => {
        const timestamp = new Date().toLocaleTimeString();
        setLogs((prevLogs) => [...prevLogs, { message: log, timestamp }]);
     });

       
      return () => {
        socket.off("connect");

        socket.off('console-message');
      };


    }, []);



  return (
    <div className="App">
      <div className="message-container">{`you connected with id ${socketId}`}</div>
      {
        serverRoomId ? (
            <Board logs={logs} setLogs={setLogs} serverRoomId ={serverRoomId} />
        ): (
          <Home logs={logs} setLogs={setLogs} setserverRoomId={setserverRoomId} />
        )
      }
    </div>
  );
}

export default App;
