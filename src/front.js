const API_URL = import.meta.env.VITE_API_URL ?? 'https://ar-cave-immersionar-api.onrender.com';

const modal = document.getElementById('modal');
const mainMenuPanel = document.getElementById('main-menu-panel');
const contentPanel = document.getElementById('content-panel');

const popupOverlay = document.getElementById('popup-overlay');
const popupBox = document.getElementById('popup-box');
const popupMessage = document.getElementById('popup-message');
const popupCloseBtn = document.getElementById('popup-close');

function showPopup(message, type = 'error') {
    popupMessage.textContent = message;
    popupBox.classList.remove('success', 'error');
    popupBox.classList.add(type);
    popupOverlay.style.display = 'flex';
}
function hidePopup() { popupOverlay.style.display = 'none'; }
popupCloseBtn.addEventListener('click', hidePopup);
popupOverlay.addEventListener('click', (event) => { if (event.target === popupOverlay) hidePopup(); });

function createAndAppend(parent, tag, { id, text, classes, placeholder, onClick } = {}) {
    const el = document.createElement(tag);
    if (id) el.id = id;
    if (text) el.textContent = text;
    if (classes) el.classList.add(...classes);
    if (placeholder) el.placeholder = placeholder;
    if (onClick) el.addEventListener('click', onClick);
    parent.appendChild(el);
    return el;
}

async function showView(viewName) {
    const targetPanel = viewName === 'list' ? mainMenuPanel : contentPanel;
    targetPanel.innerHTML = ''; 

    if (viewName === 'create') {
        modal.style.display = 'block';
        modal.classList.add('view-content');
        createAndAppend(targetPanel, 'h2', { text: 'Criar Sessão' });
        createAndAppend(targetPanel, 'input', { id: 'sessionName', placeholder: 'Nome da sessão' }).type = 'text';
        createAndAppend(targetPanel, 'button', { text: 'Salvar', classes: ['btn', 'btn-primary'], onClick: saveSession });
        createAndAppend(targetPanel, 'button', { text: 'Voltar', classes: ['btn', 'btn-secondary'], onClick: resetView });
    }
    else if (viewName === 'list') {
        modal.style.display = 'block';
        modal.classList.remove('view-content');
        try {
            createAndAppend(targetPanel, 'p', { text: 'Carregando sessões...' });
            let response = await fetch(`${API_URL}/users`);
            let data = await response.json();
            let users = data.value;

            targetPanel.innerHTML = ''; // Limpa o "Carregando..."
            createAndAppend(targetPanel, 'h2', { text: 'Sessões Disponíveis' });

            const list = createAndAppend(targetPanel, 'ul', { id: 'sessionList' });
            if (users.length === 0) {
                createAndAppend(list, 'li', { text: 'Nenhuma sessão criada' });
            } else {
                users.forEach(u => {
                    createAndAppend(list, 'li', { text: u.name, onClick: () => selectSession(u.id) });
                });
            }

        } catch (err) {
            console.error(err);
            showPopup("Erro ao buscar sessões!", 'error');
            targetPanel.innerHTML = '<h2>Sessões Disponíveis</h2><p>Erro ao carregar sessões.</p>';
        }
    }
}

function resetView() {
    modal.classList.remove('view-content');
    showView('list'); 
}

async function saveSession() {
    let name = document.getElementById('sessionName').value.trim();
    if (!name) {
        showPopup('Digite um nome para a sessão!', 'error');
        return;
    }
    try {
        let response = await fetch(`${API_URL}/users`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name })
        });
        if (!response.ok) throw new Error("Erro ao salvar no servidor");

        showPopup("Sessão salva no banco!", 'success');
        showView('list');
    } catch (err) {
        console.error(err);
        showPopup("Erro ao salvar sessão!", 'error');
    }
}

function selectSession(sessionId) {
    sessionStorage.setItem('selectedSessionId', sessionId); 
    console.log(`Sessão selecionada: ${sessionId}`);
    document.getElementById('modal').style.display = 'none';
    document.getElementById('popup-overlay').style.display = 'none';

    if (window.iniciarExperienciaAR) {
        window.iniciarExperienciaAR(sessionId);
    } else {
        console.error("A função iniciarExperienciaAR() não foi encontrada.");
        showPopup("Erro crítico: A aplicação de AR não pôde ser iniciada.", 'error');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const loadingScreen = document.getElementById('loadingScreen');
    const logo = document.getElementById('logo-animada');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('main-content');
    const fabContainer = document.querySelector('.fab-container');

    const desktopWarning = document.getElementById('desktop-warning');
    const closeWarningBtn = document.getElementById('close-warning-btn');

    const isDesktop = navigator.maxTouchPoints === 0;

    if (isDesktop) {
        desktopWarning.style.display = 'flex';
    }

    closeWarningBtn.addEventListener('click', () => {
        desktopWarning.style.display = 'none';
    });

    setTimeout(() => logo.classList.add('visible'), 100);
    setTimeout(() => {
        loadingScreen.classList.add('loading-hidden');
        loadingScreen.addEventListener('transitionend', () => loadingScreen.style.display = 'none');

        sidebar.style.visibility = 'visible';
        sidebar.style.opacity = 1;
        mainContent.style.visibility = 'visible';
        mainContent.style.opacity = 1;
        fabContainer.style.visibility = 'visible';
        fabContainer.style.opacity = 1;

        window.showView('list');
    }, 3000);

    const fabMainButton = document.querySelector('.fab-main-button');
    fabMainButton.addEventListener('click', () => {
        fabContainer.classList.toggle('active');
    });

    const colorPalette = [
        '#de224bff', 
        '#1883cfff', 
        '#5b3b97ff', 
        '#ec8e28ff', 
        '#7143b3ff', 
        '#61650cff', 
    ];

    const getRandomColor = () => colorPalette[Math.floor(Math.random() * colorPalette.length)];

    const buttonsToColorize = document.querySelectorAll('#sidebar .btn, .fab-option, .fab-main-button');
    buttonsToColorize.forEach(button => {
        button.style.backgroundColor = getRandomColor();
    });


    const openSidebar = () => {
        if (!sidebar.classList.contains('open')) {
            sidebar.classList.add('open');
            overlay.classList.add('active');
            document.body.classList.add('sidebar-active');
        }
    };

    const closeSidebar = () => {
        if (sidebar.classList.contains('open')) {
            sidebar.classList.remove('open');
            overlay.classList.remove('active');
            document.body.classList.remove('sidebar-active');
        }
    };


    const menuToggle = document.getElementById('menu-toggle');
    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        if (sidebar.classList.contains('open')) {
            closeSidebar();
        } else {
            openSidebar();
        }
    });

    const overlay = document.getElementById('sidebar-overlay');
    overlay.addEventListener('click', closeSidebar);

    const sidebarButtons = sidebar.querySelectorAll('.btn');
    sidebarButtons.forEach(button => {
        button.addEventListener('click', () => {
            setTimeout(closeSidebar, 300);
        });
    });

    let touchStartX = 0;
    let touchEndX = 0;
    const edgeZone = 40; 
    const minSwipeDistance = 75; 

    document.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].clientX;
        handleSwipeGesture();
    });

    const handleSwipeGesture = () => {
        const swipeDistance = touchEndX - touchStartX;
        const isSwipeRight = swipeDistance > minSwipeDistance;
        const isSwipeLeft = swipeDistance < -minSwipeDistance;

        if (isSwipeRight && touchStartX <= edgeZone && !sidebar.classList.contains('open')) {
            openSidebar();
        }

        if (isSwipeLeft && sidebar.classList.contains('open')) {
            const sidebarWidth = sidebar.offsetWidth;
            if (touchStartX <= sidebarWidth) {
                closeSidebar();
            }
        }
    };

});

document.getElementById('create-session-btn').addEventListener('click', () => showView('create'));
document.getElementById('list-sessions-btn').addEventListener('click', () => showView('list'));
document.getElementById('tutorial-btn').addEventListener('click', () => showPopup('Funcionalidade de Tutorial em desenvolvimento.', 'success'));
document.getElementById('about-btn').addEventListener('click', () => showPopup('Funcionalidade de QRCode em desenvolvimento.', 'success'));

document.getElementById('fab-create').addEventListener('click', () => showView('create'));
document.getElementById('fab-list').addEventListener('click', () => showView('list'));
document.getElementById('fab-qr').addEventListener('click', () => showPopup('Funcionalidade de QRCode em desenvolvimento.', 'success'));

window.showView = showView;
window.resetView = resetView;
window.saveSession = saveSession;
window.selectSession = selectSession;
window.iniciarExperienciaAR = (sessionId) => { console.log("Função de AR chamada para sessão:", sessionId); };