import React, { useState, useEffect } from 'react';
import './index.css';
import ChatRoom from '../ChatRoom';

import Result from '../Result';


import socketService from '../../services/socketService';

const TicTacToeBoard = ({serverRoomId}) => {
  const boardSize = 3;


  const [isBoardActive, setIsBoardActive] = useState(false);

  const  [gameState, setGameState] = useState(null);
//   const [winProbability, setWinProbability] = useState('33 %');
  const [opponent, setOpponent] = useState('');
  const [totem, setTotem] = useState(null);
  const [boardState, setBoardState] = useState(Array(boardSize).fill(Array(boardSize).fill(null)));




  const clearBoard= () => {
    // Reset the game state to start a new game
    setBoardState(Array(boardSize).fill(Array(boardSize).fill(null)));
    setGameState(null);
  }

  
  const handleRestart = () => {
    let socket = socketService.getSocket();
    
    // setWinner(null);
    clearBoard()

    // Emit 'restartGame' event to inform the server to reinitialize the room
    socket.emit('restart_game', serverRoomId);
  };
  

  useEffect(() => {
    // Set up the listener for board state updates
    let socket = socketService.getSocket();
    socket.on('recieve_board', (newBoardState, active) => {

        console.log(`recieved board ${newBoardState} and totem is ${totem}`)
        setIsBoardActive(active === socket.id);
      setBoardState(newBoardState);

    });



    socket.on('game_over', (newBoardState, serverMessage) => {
        setBoardState(newBoardState);
        console.log(`game over`, serverMessage)
        if(serverMessage.winner) {
            if(serverMessage.winner === socket.id) {
                setGameState('won')
            } else{
                setGameState('lost')
            }

        } else {
            setGameState('draw')
        }
    });

    

    socket.on('game-start', ({boardState, active, players }) => {
        clearBoard()
        console.log(`game started and current player is ${active} ${players}`)

        setGameState('started')

        for (let i = 0; i < players.length; i++) {
            if (players[i].id === socket.id) {
              setTotem(players[i].totem)
              break; // Exit the loop once the object is found
            }else{
                setOpponent(players[i].id)
            }
          }

          setIsBoardActive(active === socket.id);
    });

    // Clean up the listener when the component unmounts
    return () => {
      socket.off('recieve_board');
      socket.off('game-start');
      socket.off('game_over');
    };
  }, []);




  const handleCellClick = (event, rowIndex, colIndex) => {
    event.preventDefault();
    event.stopPropagation();
    if (boardState[rowIndex][colIndex] === null) {

        console.log(`cell clicked ${rowIndex} ${colIndex}`)

        socketService.getSocket().emit("update_board", {rowIndex: rowIndex, colIndex: colIndex ,mark: totem}, serverRoomId, socketService.getSocket().id);

    }
  };

  return (
    <div className="tictactoe-board-container">
        <h1>{`joined room: ${serverRoomId} with totem ${totem}`}</h1>

        
    
        {/* <div>{`win probability : ${winProbability}`}</div> */}
        <div>
            {
                gameState && ['won' , 'lost' , 'draw'].includes(gameState) ? (<Result handleRestart ={handleRestart} gameState={gameState} player={socketService.getSocket().id} opponent={opponent} onRestart={()=>{}}/>) : (<h2 style={{"height": '20px'}} >{isBoardActive? "Your turn!!" : ''}</h2>)
            }
        
        </div>
       
        <div className='tictactoe-board-wrapper'>
            <div className={`tictactoe-board ${isBoardActive ? '': 'inactive'}`}>
                {boardState.map((row, rowIndex) => (
                    <div key={rowIndex} className="tictactoe-row">
                    {row.map((cell, colIndex) => (
                        <div key={colIndex} className={`tictactoe-cell ${cell === totem ? 'mine' : ''}`} onClick={(event) => handleCellClick(event, rowIndex, colIndex)}>
                            {cell && cell !== null ? (<span>{cell}</span>) : null}
                        </div>
                    ))}
                    </div>
                ))}
            </div>
            <ChatRoom serverRoomId ={serverRoomId} />
        </div>
    </div>
  );
};

export default TicTacToeBoard;
