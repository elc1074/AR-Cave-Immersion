import jsQR from 'jsqr';

const API_URL = import.meta.env.VITE_API_URL ?? 'https://ar-cave-immersionar-api.onrender.com';

let videoStream = null;
let isScanning = false;
let qrScreenElement = null;

/**
 * Cria e exibe a tela de autenticação com QR code scanner
 * @param {Function} onAuthSuccess - callback após autenticação bem-sucedida
 */
export function showQRAuthScreen(onAuthSuccess) {
    console.log('🔐 showQRAuthScreen chamado');
    
    // Remove screen anterior se existir
    if (qrScreenElement) {
        qrScreenElement.remove();
    }

    // Cria container fullscreen para QR
    qrScreenElement = document.createElement('div');
    qrScreenElement.id = 'qr-auth-screen';
    qrScreenElement.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, rgba(30, 30, 46, 0.95), rgba(50, 50, 70, 0.95));
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 2rem;
        z-index: 10000;
    `;

    // Título
    const title = document.createElement('h2');
    title.textContent = '🔐 Autenticação Segura';
    title.style.cssText = `
        font-size: 2rem;
        margin: 0;
        background: linear-gradient(135deg, #667eea, #764ba2);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-align: center;
    `;
    qrScreenElement.appendChild(title);

    // Descrição
    const description = document.createElement('p');
    description.textContent = 'Escaneie um código QR para entrar na aplicação';
    description.style.cssText = `
        font-size: 1.1rem;
        color: rgba(255, 255, 255, 0.8);
        text-align: center;
        max-width: 400px;
    `;
    qrScreenElement.appendChild(description);

    // Canvas para processar frames (oculto)
    const canvas = document.createElement('canvas');
    canvas.id = 'qr-canvas';
    canvas.style.cssText = `
        display: none;
        position: absolute;
        top: -9999px;
    `;
    document.body.appendChild(canvas);

    // Vídeo para câmera (dentro do viewfinder)
    const video = document.createElement('video');
    video.id = 'qr-video';
    video.style.cssText = `
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 8px;
    `;
    video.autoplay = true;
    video.playsInline = true;
    video.muted = true;

    // Área de visualização com reticula
    const viewfinder = document.createElement('div');
    viewfinder.style.cssText = `
        position: relative;
        width: 320px;
        height: 320px;
        border: 3px solid rgba(102, 126, 234, 0.5);
        border-radius: 12px;
        background: #000;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
    `;

    // Adiciona o vídeo ao viewfinder
    viewfinder.appendChild(video);

    // Reticula sobreposta
    const reticula = document.createElement('div');
    reticula.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 80%;
        height: 80%;
        border: 2px solid #667eea;
        border-radius: 8px;
        box-shadow: 0 0 20px rgba(102, 126, 234, 0.3) inset;
        pointer-events: none;
    `;
    viewfinder.appendChild(reticula);
    qrScreenElement.appendChild(viewfinder);

    // Botão para iniciar câmera
    const startButton = document.createElement('button');
    startButton.textContent = '📷 Abrir Câmera';
    startButton.style.cssText = `
        padding: 1rem 2rem;
        font-size: 1rem;
        border: none;
        border-radius: 8px;
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        cursor: pointer;
        font-weight: 600;
        transition: all 0.3s ease;
    `;
    startButton.onmouseover = () => startButton.style.transform = 'translateY(-2px)';
    startButton.onmouseout = () => startButton.style.transform = 'translateY(0)';
    qrScreenElement.appendChild(startButton);

    // Botão parar (oculto inicialmente)
    const stopButton = document.createElement('button');
    stopButton.textContent = '🛑 Parar Scanner';
    stopButton.style.cssText = `
        padding: 1rem 2rem;
        font-size: 1rem;
        border: none;
        border-radius: 8px;
        background: linear-gradient(135deg, #ff6b6b, #ee5a6f);
        color: white;
        cursor: pointer;
        font-weight: 600;
        transition: all 0.3s ease;
        display: none;
    `;
    stopButton.onmouseover = () => stopButton.style.transform = 'translateY(-2px)';
    stopButton.onmouseout = () => stopButton.style.transform = 'translateY(0)';
    qrScreenElement.appendChild(stopButton);

    // Mensagem de status
    const statusMessage = document.createElement('p');
    statusMessage.style.cssText = `
        min-height: 1.5rem;
        font-size: 0.95rem;
        font-weight: 500;
        color: rgba(255, 255, 255, 0.7);
        text-align: center;
        transition: all 0.3s ease;
    `;
    qrScreenElement.appendChild(statusMessage);

    // Adiciona ao body
    document.body.appendChild(qrScreenElement);

    console.log('✅ Tela QR criada e exibida');

    // Event listeners
    startButton.addEventListener('click', () => startQRScanning(canvas, video, statusMessage, startButton, stopButton, onAuthSuccess));
    stopButton.addEventListener('click', () => stopQRScanning(video, startButton, stopButton));
}

/**
 * Inicia o scanning de QR code via câmera
 */
async function startQRScanning(canvas, video, statusMessage, startButton, stopButton, onAuthSuccess) {
    try {
        statusMessage.textContent = 'Abrindo câmera...';
        statusMessage.style.color = 'rgba(255, 255, 255, 0.7)';

        // Solicita acesso à câmera
        videoStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment' }
        });

        video.srcObject = videoStream;
        video.play();

        // Aguarda o vídeo carregar
        video.onloadedmetadata = () => {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            statusMessage.textContent = 'Escaneando QR code...';
            statusMessage.style.color = 'rgba(255, 255, 255, 0.7)';
            isScanning = true;
            startButton.style.display = 'none';
            stopButton.style.display = 'block';
            
            // Inicia o loop de scanning
            scanQRFrame(canvas, video, statusMessage, startButton, stopButton, onAuthSuccess);
        };
    } catch (error) {
        console.error('Erro ao acessar câmera:', error);
        statusMessage.textContent = '❌ Erro ao acessar câmera. Verifique as permissões.';
        statusMessage.style.color = '#ff6b6b';
    }
}

/**
 * Loop de scanning de QR code
 */
function scanQRFrame(canvas, video, statusMessage, startButton, stopButton, onAuthSuccess) {
    const ctx = canvas.getContext('2d');

    if (!isScanning) return;

    if (video.readyState === video.HAVE_ENOUGH_DATA) {
        // Desenha frame atual no canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Captura dados da imagem
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, canvas.width, canvas.height);

        if (code) {
            console.log('QR Code detectado:', code.data);
            statusMessage.textContent = '✅ QR Code encontrado! Validando...';
            statusMessage.style.color = '#51cf66';
            isScanning = false;

            // Para o scanning
            stopQRScanning(video, startButton, stopButton);

            // Valida o QR code
            validateQRToken(code.data, statusMessage, startButton, stopButton, onAuthSuccess);
            return;
        }
    }

    // Continua scanning
    requestAnimationFrame(() => scanQRFrame(canvas, video, statusMessage, startButton, stopButton, onAuthSuccess));
}

/**
 * Valida o token extraído do QR code
 */
async function validateQRToken(qrData, statusMessage, startButton, stopButton, onAuthSuccess) {
    try {
        // Parse do QR code (esperamos formato: token=xxxxx ou JSON)
        let token = qrData;

        // Se for JSON, extrai o token
        if (qrData.startsWith('{')) {
            const qrJson = JSON.parse(qrData);
            token = qrJson.token || qrData;
        }

        // Aqui você pode validar contra seu backend
        // Por enquanto, aceitamos qualquer token não vazio
        if (token && token.length > 0) {
            // Salva o token em sessionStorage para uso posterior
            sessionStorage.setItem('authToken', token);
            
            statusMessage.textContent = '✅ Autenticação bem-sucedida!';
            statusMessage.style.color = '#51cf66';

            // Aguarda um segundo e chama callback
            setTimeout(() => {
                if (onAuthSuccess) onAuthSuccess();
            }, 1500);
        } else {
            statusMessage.textContent = '❌ QR code inválido. Tente novamente.';
            statusMessage.style.color = '#ff6b6b';
            startButton.style.display = 'block';
            stopButton.style.display = 'none';
        }
    } catch (error) {
        console.error('Erro ao validar token:', error);
        statusMessage.textContent = '❌ Erro na autenticação. Tente novamente.';
        statusMessage.style.color = '#ff6b6b';
        startButton.style.display = 'block';
        stopButton.style.display = 'none';
    }
}

/**
 * Para o scanning de QR code
 */
export function stopQRScanning(video, startButton, stopButton) {
    isScanning = false;

    if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
        videoStream = null;
    }

    if (video) {
        video.pause();
        video.srcObject = null;
    }

    if (startButton) startButton.style.display = 'block';
    if (stopButton) stopButton.style.display = 'none';
}

/**
 * Remove a tela de QR e mostra o menu
 */
export function closeQRScreen() {
    if (qrScreenElement) {
        qrScreenElement.remove();
        qrScreenElement = null;
        console.log('✅ Tela QR removida');
    }
    
    // Limpa elementos de vídeo e canvas
    const video = document.getElementById('qr-video');
    const canvas = document.getElementById('qr-canvas');
    if (video) video.remove();
    if (canvas) canvas.remove();
}

/**
 * Verifica se o usuário foi autenticado
 */
export function isAuthenticated() {
    return sessionStorage.getItem('authToken') !== null;
}

/**
 * Limpa a autenticação (logout)
 */
export function clearAuth() {
    sessionStorage.removeItem('authToken');
}
