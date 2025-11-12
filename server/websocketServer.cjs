const WebSocket = require('ws');
const http = require('http');
const { setupWSConnection } = require('y-websocket/bin/utils');

const wss = new WebSocket.Server({ noServer: true });

const server = http.createServer((request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/plain' });
  response.end('okay');
});

wss.on('connection', (conn, req) => {
  setupWSConnection(conn, req, {
    gc: true,
  });
});

server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, ws => {
    wss.emit('connection', ws, request);
  });
});

const port = process.env.PORT || 1234;
server.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`)
});