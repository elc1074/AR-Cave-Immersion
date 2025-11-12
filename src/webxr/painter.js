import * as Y from 'yjs';
import { TubePainter } from '/public/jsm/misc/TubePainter.js';
import * as THREE from 'three';

export class CollaborativeTubePainter extends TubePainter {
    constructor(ydoc, sessionId) {
        super()
        this.strokes = ydoc.getArray(`session_${sessionId}_strokes`)
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
            this.setColor(new THREE.Color(color))
            this.moveTo(new THREE.Vector3().copy(points[0]))
            points.slice(1).forEach(point => {
                this.lineTo(new THREE.Vector3().copy(point))
            })
            this.update()
        } catch (error) {
            console.error('Error replaying stroke:', error)
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

        this.strokes.push([stroke])
        this.currentStroke = []
        return stroke
    }
}