import { initWebSocket } from './webSocketProvider.js'

export class DrawingSync {
    constructor(sessionId) {
        this.sessionId = sessionId
        const { ydoc, awareness, wsProvider } = initWebSocket(sessionId)
        this.ydoc = ydoc
        this.awareness = awareness
        this.wsProvider = wsProvider
        // Usar o mesmo nome de array em todo o sistema
        this.strokes = this.ydoc.getArray('strokes')
        this.onStrokeAddedCallbacks = []
        this.setupSync()
    }

    setupSync() {
        this.strokes.observe(event => {
            event.changes.added.forEach(item => {
                const stroke = item.content.getContent()
                this.notifyStrokeAdded(stroke)
            })
        })
    }

    addStroke(stroke) {
        if (!this.validateStroke(stroke)) {
            console.error('Traço inválido:', stroke)
            return false
        }
        this.strokes.push([stroke])
        return true
    }

    validateStroke(stroke) {
        return stroke &&
            Array.isArray(stroke.points) &&
            stroke.points.length >= 2 &&
            stroke.color &&
            stroke.points.every(p => 
                typeof p.x === 'number' &&
                typeof p.y === 'number' &&
                typeof p.z === 'number'
            )
    }

    onStrokeAdded(callback) {
        this.onStrokeAddedCallbacks.push(callback)
    }

    notifyStrokeAdded(stroke) {
        this.onStrokeAddedCallbacks.forEach(callback => {
            try {
                callback(stroke)
            } catch (error) {
                console.error('Erro ao executar callback de traço:', error)
            }
        })
    }

    getAllStrokes() {
        return this.strokes.toArray()
    }

    destroy() {
        this.onStrokeAddedCallbacks = []
        this.strokes = null
        this.ydoc = null
        this.awareness = null
    }
}