import { WebSocketServer } from 'ws';

// Create a WebSocket server on port 6666
const wss = new WebSocketServer({ port: 6666 });

let clients = [];

wss.on('connection', (ws) => {
  console.log('Client connected');
  clients.push(ws);

  ws.on('close', () => {
    clients = clients.filter(client => client !== ws);
    console.log('Client disconnected');
  });
});

export const notifyClients = (bookingDetails) => {
  clients.forEach(client => {
    if (client.readyState === 1) { // Check if the connection is open
      client.send(JSON.stringify(bookingDetails));
    }
  });
};

console.log('WebSocket server running on port 6666');
