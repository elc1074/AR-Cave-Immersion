import http from 'http'
import { WebSocketServer } from 'ws'
import { setupWSConnection, setPersistence, getPersistence } from 'y-websocket/bin/utils.js'

// Criar servidor HTTP
const server = http.createServer((request, response) => {
    response.writeHead(200, { 'Content-Type': 'text/plain' })
    response.end('Y.js WebSocket Server Running\n')
})

// Criar servidor WebSocket
const wss = new WebSocketServer({ server })

// Tratamento de conexões
wss.on('connection', (ws) => {
    console.log('🔗 Novo cliente conectado')
    ws.on('close', () => {
        console.log('❌ Cliente desconectado')
    })
    setupWSConnection(ws)
})

// Iniciar servidor
const port = process.env.PORT || 1234
server.listen(port, () => {
    console.log(`✅ Servidor WebSocket Y.js escutando em ws://localhost:${port}`)
    console.log('Use este servidor para sincronizar desenhos em tempo real')
})
