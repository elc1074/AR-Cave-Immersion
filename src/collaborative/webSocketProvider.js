
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'

let ydoc
let wsProvider
let awareness

export function initWebSocket(sessionId) {
    if (wsProvider && wsProvider.roomname === `session_${sessionId}`) {
        return { ydoc, wsProvider, awareness }
    }

    if (wsProvider) {
        wsProvider.destroy()
    }

    ydoc = new Y.Doc()
    wsProvider = new WebsocketProvider(
        'ws://localhost:1234',
        `session_${sessionId}`,
        ydoc
    )
    awareness = wsProvider.awareness

    wsProvider.on('status', event => {
        console.log(event.status)
    })

    return { ydoc, wsProvider, awareness }
}
