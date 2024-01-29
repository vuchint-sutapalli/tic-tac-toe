import React, { useState } from 'react';
import './index.css';

import LogMaintainer from '../LogMaintainer';

import socketService from '../../services/socketService';


const Home = ({setserverRoomId, logs, setLogs}) => {
  const [roomId, setRoomId] = useState('');
  const [error, setError] = useState('');

  // const [logs, setLogs] = useState([]);

  const handleInputChange = (e) => {
    setRoomId(e.target.value);
  };

  const handleJoinClick = () => {
    if (roomId.trim() === '') {
      displayError('Room ID cannot be empty.');
    } else {
      setError('');
      console.log('Join button clicked. Room ID:', roomId);

      socketService.joinRoom(roomId, (serverMessage, rId) => {
        console.log('msg from server:', serverMessage)
        addLog(serverMessage);
        if(rId) {
          setserverRoomId(rId);
        }
      })
    }
  };

    const addLog = (log) => {
        const timestamp = new Date().toLocaleTimeString();
        setLogs((prevLogs) => [...prevLogs, { message: log, timestamp }]);
    };


  const handleCreateClick = () => {
    const randomRoomId = generateRandomId(6);
    setRoomId(randomRoomId);
    setError('');

      socketService.createRoom(randomRoomId, (rIdCreated) => {
        setserverRoomId(rIdCreated);
      })

  };

  const generateRandomId = (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomId = '';
    for (let i = 0; i < length; i++) {
      randomId += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return randomId;
  };

  const displayError = (errorMessage) => {
    setError(errorMessage);
    setTimeout(() => {
      setError('');
    }, 2000);
  };

  return (
    <div>
        <div className="tic-tac-toe-container">
            <h1 className="tic-tac-toe-header">Welcome to Tic-Tac-Toe</h1>
            <div className="tic-tac-toe-input-container">
                <label htmlFor="roomIdInput" className="tic-tac-toe-label">
                Enter room ID:
                </label>
                <input
                type="text"
                id="roomIdInput"
                className="tic-tac-toe-input"
                value={roomId}
                onChange={handleInputChange}
                />
            </div>
            <div className="tic-tac-toe-button-container">
                <button className="tic-tac-toe-button" onClick={handleJoinClick}>
                    Join
                </button>
                <button className="tic-tac-toe-button create-button" onClick={handleCreateClick}>
                    Create Room
                </button>
            </div>
            {error && <div className="error-container">{error}</div>}
        </div>
        <LogMaintainer setLogs={setLogs} logs={logs} />
    </div>
  );
};

export default Home;
