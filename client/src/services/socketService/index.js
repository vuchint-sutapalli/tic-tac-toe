import io from 'socket.io-client';

class SocketServiceSingleton {
  constructor() {
    this.socket = null;
  }

  connect(url) {
    return new Promise((resolve, reject) => {
      this.socket = io(url);

      if(!this.socket) return reject()
 
      this.socket.on('connect', () => {
        console.log('Connected to server.');
        resolve(this.socket);
      });

      this.socket.on('connect_error', (error) => {
        console.log('Connection error:', error);
        reject(error);
      });
    });
  }

  sendDataWithCallback(title, message, callback) {
    if (this.socket) {
      this.socket.emit(title, message, callback);
    }
  }

  joinRoom(roomIdVal, callback) {
    if (this.socket) {
      this.socket.emit("join-room", roomIdVal, callback);
    }
  }

  createRoom(roomIdVal, callback) {
    if (this.socket) {
      this.socket.emit("create-room", roomIdVal, callback);
    }
  }

  

  sendData(data) {
    if (this.socket) {
      this.socket.emit('data', data);
    }
  }
  getSocket() {
    return this.socket;
  }

  closeConnection() {
    if (this.socket) {
      this.socket.close();
      console.log('Connection closed.');
    }
  }
}

export default new SocketServiceSingleton();
