import { initWebSocket } from './webSocketProvider.js';

export class DrawingSync {
    constructor(sessionId) {
        const { ydoc, awareness } = initWebSocket(sessionId);
        this.ydoc = ydoc;
        this.awareness = awareness;
        this.strokes = this.ydoc.getArray('strokes');
        this.setupSync();
    }

    setupSync() {
        // Observar mudanças nos traços
        this.strokes.observe(event => {
            event.changes.added.forEach(item => {
                const stroke = item.content.getContent();
                this.onStrokeAdded(stroke);
            });
        });
    }

    addStroke(stroke) {
        this.strokes.push([stroke]);
    }

    onStrokeAdded(stroke) {
        // Este método deve ser sobrescrito pela classe que usa DrawingSync
        console.log('Novo traço adicionado:', stroke);
    }

    destroy() {
        // Cleanup
        this.strokes = null;
        this.ydoc = null;
        this.awareness = null;
    }
}