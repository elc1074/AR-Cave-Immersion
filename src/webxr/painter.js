import * as Y from 'yjs'
import { TubePainter } from '/public/jsm/misc/TubePainter.js'
import * as THREE from 'three'

export class CollaborativeTubePainter extends TubePainter {
    constructor(ydoc, sessionId, painters = []) {
        super()
        this.sessionId = sessionId
        this.painters = painters // Array de todos os painters para renderizar em todos
        // Usar o mesmo nome consistente para o array de traços
        this.strokes = ydoc.getArray('strokes')
        this.currentStroke = []
        this.setupSync()
    }

    setupSync() {
        this.strokes.observe(event => {
            event.changes.added.forEach(item => {
                const stroke = item.content.getContent()
                if (this.validateStroke(stroke)) {
                    this.replay(stroke)
                }
            })
        })
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

    replay(stroke) {
        try {
            const { points, color } = stroke
            
            // Renderizar em todos os painters
            this.painters.forEach(painter => {
                painter.setColor(new THREE.Color(color))
                painter.moveTo(new THREE.Vector3(points[0].x, points[0].y, points[0].z))
                
                for (let i = 1; i < points.length; i++) {
                    const point = points[i]
                    painter.lineTo(new THREE.Vector3(point.x, point.y, point.z))
                }
                painter.update()
            })
        } catch (error) {
            console.error('Erro ao reproduzir traço:', error, stroke)
        }
    }

    addPoint(point) {
        this.currentStroke.push(point.clone())
    }

    finishStroke(color) {
        if (this.currentStroke.length < 2) {
            this.currentStroke = []
            return null
        }

        const stroke = {
            points: this.currentStroke.map(p => ({x: p.x, y: p.y, z: p.z})),
            color: color,
            timestamp: Date.now()
        }

        // Adicionar ao array Y.js (que será observado e sincronizado)
        this.strokes.push([stroke])
        this.currentStroke = []
        return stroke
    }

    clearCurrentStroke() {
        this.currentStroke = []
    }

    destroy() {
        this.strokes = null
        this.painters = []
        this.currentStroke = []
    }
}