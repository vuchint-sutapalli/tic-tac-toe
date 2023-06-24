import React, { useState, useEffect } from 'react';
import socketService from '../../services/socketService';
import './index.css';

const ChatRoom = ({serverRoomId}) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);


  const displayMessageToUser = (relevantMessageObj) => {
    setMessages(prevMessages => [...prevMessages, relevantMessageObj]);
  };

  useEffect(() => {
    const socket = socketService.getSocket();

    socket.on('recieve_chat', (data) => {
        displayMessageToUser(data)
    });

    return () => {
      socket.off('recieve_chat');
    };
  }, []);

  const sendMessage = (event) => {
    event.preventDefault();

     const messageObj = {
            author: socketService.getSocket().id, 
            content: message,
            timestamp: new Date().toISOString(), // Add a timestamp to the message
        };


    if (message.trim() !== '') {
    displayMessageToUser(messageObj)
      socketService.getSocket().emit('send_chat', messageObj, serverRoomId, socketService.getSocket().id);
      setMessage('');
    }
  };

  return (
    <div className="chat-room">
      <div className="message-list">
        {messages.map((message, index) => (
            
          <div key={index}className={`message ${message.author === socketService.getSocket().id ? 'mine' : ''}`}>
            {message.content}
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="message-input"
        />
        <button type="submit" className="send-button">
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatRoom;
