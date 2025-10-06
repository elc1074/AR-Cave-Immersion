import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TubePainter } from '/public/jsm/misc/TubePainter.js';
import { XRButton } from 'three/examples/jsm/webxr/XRButton.js';
import { GUI } from 'lil-gui';

const API_URL = import.meta.env.VITE_API_URL ?? 'https://ar-cave-immersionar-api.onrender.com/';

function getSessionId() {
    const userIdString = sessionStorage.getItem('selectedSessionId');
    if (!userIdString) {
        console.error('Nenhum ID de sessão encontrado no sessionStorage.');
        alert('Não foi possível identificar a sessão. O desenho não será salvo.');
        return null;
    }
    const userId = parseInt(userIdString, 10);
    if (isNaN(userId)) {
        console.error('O ID da sessão salvo é inválido:', userIdString);
        return null;
    }
    return userId;
}


let camera, scene, renderer;
let controller1, controller2;
let tracoAtual = [];
let painter1, painter2;

const cursor = new THREE.Vector3();

let controls;

init();

// <-- NOVO: Função para carregar desenhos existentes do banco de dados -->
async function loadExistingDrawings() {
    const userId = getSessionId();
    if (!userId) {
        console.log('Nenhum usuário logado, não há desenhos para carregar.');
        return;
    }

    try {
        // 1. Busca no backend todos os desenhos associados ao user_id
        const response = await fetch(`${API_URL}/drawings/user/${userId}`);
        if (!response.ok) {
            throw new Error('Falha ao buscar desenhos existentes.');
        }

        let drawings = await response.json();
        drawings = drawings.value
        console.log('Desenhos carregados do servidor:', drawings);
        if (drawings.length === 0) {
            console.log('Nenhum desenho anterior encontrado para este usuário.');
            return;
        }
        // console.log(`Carregando ${drawings.length} desenhos...`);
        // 2. Itera sobre cada desenho retornado
        drawings.forEach(drawing => {
            // 3. Converte a coluna 'dados' (que é um JSON string) de volta para um array
            // O JSON.parse pode falhar se os dados estiverem malformados
            let pointsArray;
            try {
                pointsArray = JSON.parse(drawing.dados);
            } catch(e) {
                console.error("Erro ao parsear dados do desenho:", drawing.dados, e);
                return; // Pula para o próximo desenho
            }


            // Verifica se o array tem pontos suficientes para formar uma linha
            if (!pointsArray || pointsArray.length < 2) {
                return; // Pula para o próximo desenho
            }

            // (Opcional) Ignorando a cor por enquanto, conforme solicitado
            // painter1.setColor(new THREE.Color(drawing.cor || '#FFFFFF'));
            painter1.setColor(new THREE.Color(drawing.cor || '#FFFFFF'));
            painter2.setColor(new THREE.Color(drawing.cor || '#FFFFFF'));
            // 4. Converte os objetos simples {x, y, z} em instâncias de THREE.Vector3
            const vectorPoints = pointsArray.map(p => new THREE.Vector3(p.x, p.y, p.z));

            // 5. Usa o painter para desenhar a linha
            painter1.moveTo(vectorPoints[0]); // Move para o primeiro ponto

            // Começa o loop do segundo ponto em diante
            for (let i = 1; i < vectorPoints.length; i++) {
                painter1.lineTo(vectorPoints[i]);
            }

            // 6. Atualiza a malha do painter para tornar o traço visível
            painter1.update();
        });

    } catch (error) {
        console.error('Erro ao carregar desenhos existentes:', error);
    }
}


function init() {
    const container = document.createElement('div');
    document.body.appendChild(container);

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x222222);

    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.01, 50);
    camera.position.set(0, 1.6, 3);

    controls = new OrbitControls(camera, container);
    controls.target.set(0, 1.6, 0);
    controls.update();

    const grid = new THREE.GridHelper(4, 1, 0x111111, 0x111111);
    scene.add(grid);

    scene.add(new THREE.HemisphereLight(0x888877, 0x777788, 3));

    const light = new THREE.DirectionalLight(0xffffff, 1.5);
    light.position.set(0, 4, 0);
    scene.add(light);

    painter1 = new TubePainter();
    scene.add(painter1.mesh);
    painter2 = new TubePainter();
    scene.add(painter2.mesh);

    const gui = new GUI();
    const colorState = { color: '#ff0000' };
    painter1.setColor(new THREE.Color(colorState.color));
    painter2.setColor(new THREE.Color(colorState.color));
    gui.addColor(colorState, 'color')
        .name('Cor do Pincel')
        .onChange(function (newColorValue) {
            const newColor = new THREE.Color(newColorValue);
            painter1.setColor(newColor);
            painter2.setColor(newColor);
        });

    renderer = new THREE.WebGLRenderer({ antalias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setAnimationLoop(animate);
    renderer.xr.enabled = true;
    container.appendChild(renderer.domElement);

    document.body.appendChild(XRButton.createButton(renderer));

    // controllers
    function onSelectStart() {
        this.updateMatrixWorld(true);
        const pivot = this.getObjectByName('pivot');
        cursor.setFromMatrixPosition(pivot.matrixWorld);
        const painter = this.userData.painter;
        painter.moveTo(cursor);
        this.userData.isSelecting = true;
        tracoAtual = [cursor.clone()];
    }

    async function onSelectEnd() {
        this.userData.isSelecting = false;
        if (tracoAtual.length < 2) {
            tracoAtual = [];
            return;
        }
        const userId = getSessionId();
        if (!userId) {
            console.error('Salvamento cancelado: ID do usuário não obtido.');
            tracoAtual = [];
            return;
        }
        const jsonPontos = JSON.stringify(tracoAtual);
        const corAtual = colorState.color;
        const drawingData = {
            user_id: userId,
            dados: jsonPontos,
            cor: corAtual
        };
        console.log(drawingData)
        try {
            const response = await fetch(`${API_URL}/drawings`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(drawingData),
            });
            if (!response.ok) {
                throw new Error('Falha ao salvar o desenho no servidor.');
            }
            const savedDrawing = await response.json();
            console.log('Desenho salvo com sucesso!', savedDrawing);
        } catch (error) {
            console.error('Erro ao salvar o desenho:', error);
            alert('Ocorreu um erro ao salvar seu desenho.');
        } finally {
            tracoAtual = [];
        }
    }

    function onSqueezeStart() {
        this.userData.isSqueezing = true;
        this.userData.positionAtSqueezeStart = this.position.y;
        this.userData.scaleAtSqueezeStart = this.userData.painter.getSize();
    }

    function onSqueezeEnd() {
        this.userData.isSqueezing = false;
    }

    controller1 = renderer.xr.getController(0);
    controller1.addEventListener('selectstart', onSelectStart);
    controller1.addEventListener('selectend', onSelectEnd);
    controller1.addEventListener('squeezestart', onSqueezeStart);
    controller1.addEventListener('squeezeend', onSqueezeEnd);
    controller1.userData.painter = painter1;
    scene.add(controller1);

    controller2 = renderer.xr.getController(1);
    controller2.addEventListener('selectstart', onSelectStart);
    controller2.addEventListener('selectend', onSelectEnd);
    controller2.addEventListener('squeezestart', onSqueezeStart);
    controller2.addEventListener('squeezeend', onSqueezeEnd);
    controller2.userData.painter = painter2;
    scene.add(controller2);

    const pivot = new THREE.Mesh(new THREE.IcosahedronGeometry(0.01, 3));
    pivot.name = 'pivot';
    pivot.position.z = -0.05;
    const group = new THREE.Group();
    group.add(pivot);
    controller1.add(group.clone());
    controller2.add(group.clone());

    window.addEventListener('resize', onWindowResize);

    // <-- MUDANÇA: Chama a função para carregar os desenhos após tudo ser inicializado -->
    loadExistingDrawings();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function handleController(controller) {
    controller.updateMatrixWorld(true);
    const userData = controller.userData;
    const painter = userData.painter;
    const pivot = controller.getObjectByName('pivot');
    if (userData.isSqueezing === true) {
        const delta = (controller.position.y - userData.positionAtSqueezeStart) * 5;
        const scale = Math.max(0.1, userData.scaleAtSqueezeStart + delta);
        painter.setSize(scale);
    }
    cursor.setFromMatrixPosition(pivot.matrixWorld);
    if (userData.isSelecting === true) {
        tracoAtual.push(cursor.clone());
        painter.lineTo(cursor);
        painter.update();
    }
}

function animate() {
    handleController(controller1);
    handleController(controller2);
    renderer.render(scene, camera);
}