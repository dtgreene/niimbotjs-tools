import { proxy } from 'valtio';

let socket = null;

export const socketState = proxy({
  serialMessages: [],
  socketIsConnected: false,
  serialIsConnected: false,
});

export function sendMessage(message) {
  if (socket instanceof WebSocket && socket.readyState === WebSocket.OPEN) {
    socket.send(message);
  }
}

function cleanupSocket() {
  if (socket instanceof WebSocket) {
    socket.removeEventListener('close', handleClose, false);
    socket.removeEventListener('open', handleOpen, false);

    if (socket.readyState === WebSocket.OPEN) {
      socket.close();
    }

    socket = null;
  }
}

// FireFox exponentially backs off the WebSocket close event by up to 60 seconds
// resulting in longer reconnect times if the socket can't connect after a few
// attempts.

// If this becomes too annoying for FireFox users, a manual timeout will need to
// be implemented. For now, refreshing the page and/or waiting works.
function createSocket() {
  cleanupSocket();

  socketState.socketIsConnected = false;

  socket = new WebSocket('ws://localhost:8080/socket');
  socket.addEventListener('close', handleClose, false);
  socket.addEventListener('open', handleOpen, false);
  socket.addEventListener('message', handleMessage, false);
}

function handleClose() {
  socketState.socketIsConnected = false;
  socketState.serialIsConnected = false;
  setTimeout(createSocket, 2000);
}

function handleOpen() {
  socketState.socketIsConnected = true;
}

function handleMessage(event) {
  try {
    const data = JSON.parse(event.data);
    const { type, payload } = data;

    switch (type) {
      case 'serialStatus': {
        socketState.serialIsConnected = payload.isConnected;
        break;
      }
      case 'serialMessage': {
        socketState.serialMessages.push(payload.message);
        break;
      }
    }
  } catch (error) {
    console.error('Could not parse socket message data:', event.data);
  }
}

createSocket();
