import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { TubePainter } from '/public/jsm/misc/TubePainter.js'
import { XRButton } from 'three/examples/jsm/webxr/XRButton.js'
import { GUI } from 'lil-gui'
import { DrawingSync } from './collaborative/drawSync.js'
import { UserManager } from './collaborative/userManager.js'
import { CollaborativeTubePainter } from './webxr/painter.js'

const API_URL = import.meta.env.VITE_API_URL ?? 'https://ar-cave-immersionar-api.onrender.com'

let scene, camera, renderer, controls
let controller1, controller2
let painter1, painter2
let tracoAtual = []
let drawingSync = null
let userManager = null
let colorState = { color: '#ff0000' }
const cursor = new THREE.Vector3()

function getSessionId() {
    const userIdString = sessionStorage.getItem('selectedSessionId')
    if (!userIdString) {
        console.error('Nenhum ID de sessão encontrado no sessionStorage.')
        alert('Não foi possível identificar a sessão. O desenho não será salvo.')
        return null
    }
    const userId = parseInt(userIdString, 10)
    if (isNaN(userId)) {
        console.error('O ID da sessão salvo é inválido:', userIdString)
        return null
    }
    return userId
}

async function loadExistingDrawings() {
    const userId = getSessionId()
    if (!userId) {
        console.log('Nenhum usuário logado, não há desenhos para carregar.')
        return
    }

    try {
        const response = await fetch(`${API_URL}/drawings/user/${userId}`)
        if (!response.ok) {
            throw new Error('Falha ao buscar desenhos existentes.')
        }

        let drawings = await response.json()
        drawings = drawings.value
        console.log('Desenhos carregados do servidor:', drawings)

        if (drawings.length === 0) {
            console.log('Nenhum desenho anterior encontrado para este usuário.')
            return
        }

        // Adicionar desenhos existentes ao Y.js
        drawings.forEach(drawing => {
            try {
                const pointsArray = JSON.parse(drawing.dados)
                if (!pointsArray || pointsArray.length < 2) {
                    return
                }

                const stroke = {
                    points: pointsArray,
                    color: drawing.cor || '#FFFFFF',
                    timestamp: Date.now()
                }

                // Adicionar via DrawingSync
                if (drawingSync) {
                    drawingSync.addStroke(stroke)
                }
            } catch (e) {
                console.error('Erro ao parsear dados do desenho:', drawing.dados, e)
            }
        })
    } catch (error) {
        console.error('Erro ao carregar desenhos existentes:', error)
    }
}

function init() {
    const container = document.createElement('div')
    document.body.appendChild(container)

    scene = new THREE.Scene()
    scene.background = new THREE.Color(0x222222)

    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.01, 50)
    camera.position.set(0, 1.6, 3)

    controls = new OrbitControls(camera, container)
    controls.target.set(0, 1.6, 0)
    controls.update()

    const grid = new THREE.GridHelper(4, 1, 0x111111, 0x111111)
    scene.add(grid)

    scene.add(new THREE.HemisphereLight(0x888877, 0x777788, 3))

    const light = new THREE.DirectionalLight(0xffffff, 1.5)
    light.position.set(0, 4, 0)
    scene.add(light)

    // Criar painters normais primeiro
    painter1 = new TubePainter()
    scene.add(painter1.mesh)
    painter2 = new TubePainter()
    scene.add(painter2.mesh)

    const gui = new GUI()
    painter1.setColor(new THREE.Color(colorState.color))
    painter2.setColor(new THREE.Color(colorState.color))
    gui.addColor(colorState, 'color')
        .name('Cor do Pincel')
        .onChange(function (newColorValue) {
            const newColor = new THREE.Color(newColorValue)
            painter1.setColor(newColor)
            painter2.setColor(newColor)
        })

    renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setAnimationLoop(animate)
    renderer.xr.enabled = true
    container.appendChild(renderer.domElement)

    document.body.appendChild(XRButton.createButton(renderer))

    // ===== INICIALIZAR COLABORAÇÃO =====
    const sessionId = getSessionId()
    if (sessionId) {
        // Inicializar sincronização de desenhos
        drawingSync = new DrawingSync(sessionId)
        
        // Inicializar gerenciador de usuários
        userManager = new UserManager(sessionId)

        // Conectar callback para renderizar traços colaborativos
        drawingSync.onStrokeAdded((stroke) => {
            replayStroke(stroke)
        })
    }

    // ===== CONFIGURAR CONTROLADORES XR =====
    function onSelectStart() {
        this.updateMatrixWorld(true)
        const pivot = this.getObjectByName('pivot')
        cursor.setFromMatrixPosition(pivot.matrixWorld)
        const painter = this.userData.painter
        painter.moveTo(cursor)
        this.userData.isSelecting = true
        tracoAtual = [cursor.clone()]
    }

    function onSelectEnd() {
        this.userData.isSelecting = false

        if (tracoAtual.length < 2) {
            tracoAtual = []
            return
        }

        // Criar objeto do traço
        const stroke = {
            points: tracoAtual.map(p => ({ x: p.x, y: p.y, z: p.z })),
            color: colorState.color,
            timestamp: Date.now()
        }

        // Adicionar ao Y.js para sincronização colaborativa
        if (drawingSync) {
            drawingSync.addStroke(stroke)
        }

        // Salvar no banco de dados
        const userId = getSessionId()
        if (userId) {
            const drawingData = {
                user_id: userId,
                dados: JSON.stringify(tracoAtual),
                cor: colorState.color
            }

            fetch(`${API_URL}/drawings`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(drawingData)
            }).catch(error => {
                console.error('Erro ao salvar o desenho:', error)
            })
        }

        tracoAtual = []
    }

    function onSqueezeStart() {
        this.userData.isSqueezing = true
        this.userData.positionAtSqueezeStart = this.position.y
        this.userData.scaleAtSqueezeStart = this.userData.painter.getSize()
    }

    function onSqueezeEnd() {
        this.userData.isSqueezing = false
    }

    controller1 = renderer.xr.getController(0)
    controller1.addEventListener('selectstart', onSelectStart)
    controller1.addEventListener('selectend', onSelectEnd)
    controller1.addEventListener('squeezestart', onSqueezeStart)
    controller1.addEventListener('squeezeend', onSqueezeEnd)
    controller1.userData.painter = painter1
    scene.add(controller1)

    controller2 = renderer.xr.getController(1)
    controller2.addEventListener('selectstart', onSelectStart)
    controller2.addEventListener('selectend', onSelectEnd)
    controller2.addEventListener('squeezestart', onSqueezeStart)
    controller2.addEventListener('squeezeend', onSqueezeEnd)
    controller2.userData.painter = painter2
    scene.add(controller2)

    const pivot = new THREE.Mesh(new THREE.IcosahedronGeometry(0.01, 3))
    pivot.name = 'pivot'
    pivot.position.z = -0.05
    const group = new THREE.Group()
    group.add(pivot)
    controller1.add(group.clone())
    controller2.add(group.clone())

    window.addEventListener('resize', onWindowResize)
    window.addEventListener('beforeunload', cleanup)
}

function replayStroke(stroke) {
    const { points, color } = stroke

    // Renderizar em ambos os painters
    painter1.setColor(new THREE.Color(color))
    painter1.moveTo(new THREE.Vector3(points[0].x, points[0].y, points[0].z))

    for (let i = 1; i < points.length; i++) {
        const point = points[i]
        painter1.lineTo(new THREE.Vector3(point.x, point.y, point.z))
    }
    painter1.update()

    painter2.setColor(new THREE.Color(color))
    painter2.moveTo(new THREE.Vector3(points[0].x, points[0].y, points[0].z))

    for (let i = 1; i < points.length; i++) {
        const point = points[i]
        painter2.lineTo(new THREE.Vector3(point.x, point.y, point.z))
    }
    painter2.update()
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
}

function handleController(controller) {
    controller.updateMatrixWorld(true)
    const userData = controller.userData
    const painter = userData.painter
    const pivot = controller.getObjectByName('pivot')

    if (userData.isSqueezing === true) {
        const delta = (controller.position.y - userData.positionAtSqueezeStart) * 5
        const scale = Math.max(0.1, userData.scaleAtSqueezeStart + delta)
        painter.setSize(scale)
    }

    cursor.setFromMatrixPosition(pivot.matrixWorld)
    if (userData.isSelecting === true) {
        tracoAtual.push(cursor.clone())
        painter.lineTo(cursor)
        painter.update()
    }
}

function animate() {
    handleController(controller1)
    handleController(controller2)
    renderer.render(scene, camera)
}

function cleanup() {
    if (drawingSync) {
        drawingSync.destroy()
    }
    if (userManager) {
        userManager.destroy()
    }
}

window.iniciarExperienciaAR = (sessionId) => {
    console.log(`Iniciando a experiência de AR para a sessão: ${sessionId}`)
    init()
    loadExistingDrawings()
}
