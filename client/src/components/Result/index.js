import React from 'react';
import './index.css';

const TicTacToeResult = ({handleRestart , gameState, opponent }) => {
  let message = "It's a draw!"


  if(gameState === 'won') {
    message = `You Won!!`
  }else  if(gameState === 'lost') {
    message = `You loose!!`
  }

  return (
    <div className="result">
      <h2 className="message">{message}</h2>
      <button className="restart-button" onClick={handleRestart}>Restart</button>
    </div>
  );
};

export default TicTacToeResult;
