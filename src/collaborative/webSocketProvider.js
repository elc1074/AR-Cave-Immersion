
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'

let ydoc = null
let wsProvider = null
let awareness = null
let reconnectAttempts = 0
const MAX_RECONNECT_ATTEMPTS = 5

export function initWebSocket(sessionId) {
    // Reutilizar instância existente se a sessão for a mesma
    if (wsProvider && wsProvider.roomname === `session_${sessionId}`) {
        return { ydoc, wsProvider, awareness }
    }

    // Destruir instância anterior se existir
    if (wsProvider) {
        wsProvider.destroy()
        ydoc = null
        wsProvider = null
        awareness = null
        reconnectAttempts = 0
    }

    // Criar nova instância
    ydoc = new Y.Doc()
    wsProvider = new WebsocketProvider(
        'ws://localhost:1234',
        `session_${sessionId}`,
        ydoc,
        { connect: true }
    )
    awareness = wsProvider.awareness

    // Tratamento robusto de status
    wsProvider.on('status', ({ status }) => {
        console.log('WebSocket status:', status)
        
        if (status === 'connected') {
            reconnectAttempts = 0
            console.log('✓ Conectado ao servidor WebSocket')
        } else if (status === 'disconnected') {
            handleDisconnection()
        }
    })

    // Tratamento de erros
    wsProvider.on('connection-error', error => {
        console.error('Erro de conexão WebSocket:', error)
    })

    return { ydoc, wsProvider, awareness }
}

function handleDisconnection() {
    if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
        reconnectAttempts++
        const delay = Math.min(1000 * Math.pow(2, reconnectAttempts - 1), 30000)
        console.log(`Tentando reconectar em ${delay}ms (tentativa ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})`)
        setTimeout(() => {
            if (wsProvider) {
                wsProvider.connect()
            }
        }, delay)
    } else {
        console.error('Falha ao reconectar após múltiplas tentativas')
    }
}

export function destroyWebSocket() {
    if (wsProvider) {
        wsProvider.destroy()
    }
    if (ydoc) {
        ydoc.destroy()
    }
    ydoc = null
    wsProvider = null
    awareness = null
    reconnectAttempts = 0
}
