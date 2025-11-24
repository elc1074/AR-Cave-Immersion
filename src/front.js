import { showQRAuthScreen, isAuthenticated, clearAuth, closeQRScreen } from './qr-auth.js';
import { tutorialContent, formatTutorialText } from './tutorialContent.js';

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

function showAbout() {
    const targetPanel = contentPanel;
    targetPanel.innerHTML = '';
    modal.style.display = 'block';
    modal.classList.add('view-content');

    const aboutContainer = document.createElement('div');
    aboutContainer.className = 'about-container';
    aboutContainer.style.cssText = 'max-height: 70vh; overflow-y: auto; padding: 20px;';

    // Título
    const title = document.createElement('h2');
    title.textContent = '🏛️ Sobre AR Cave Immersion';
    title.style.cssText = 'text-align: center; margin-bottom: 20px; color: #fff;';
    aboutContainer.appendChild(title);

    // Versão e Info
    const infoSection = document.createElement('div');
    infoSection.style.cssText = 'margin-bottom: 25px; background: rgba(25, 118, 210, 0.15); padding: 15px; border-radius: 5px; border-left: 4px solid #1883cfff;';
    
    const versionText = document.createElement('p');
    versionText.innerHTML = '<strong>Versão:</strong> 1.0.0 Beta';
    versionText.style.cssText = 'color: #fff; margin: 8px 0;';
    infoSection.appendChild(versionText);

    const dateText = document.createElement('p');
    dateText.innerHTML = '<strong>Último Update:</strong> Novembro 2025';
    dateText.style.cssText = 'color: #fff; margin: 8px 0;';
    infoSection.appendChild(dateText);

    const descText = document.createElement('p');
    descText.innerHTML = '<strong>Descrição:</strong> Aplicação WebXR colaborativa para desenho 3D em tempo real com sincronização Y.js';
    descText.style.cssText = 'color: #ccc; margin: 8px 0; line-height: 1.6;';
    infoSection.appendChild(descText);

    aboutContainer.appendChild(infoSection);

    // Stack Tecnológico
    const stackSection = document.createElement('div');
    stackSection.style.cssText = 'margin-bottom: 25px;';

    const stackTitle = document.createElement('h3');
    stackTitle.textContent = '⚙️ Stack Tecnológico';
    stackTitle.style.cssText = 'color: #5b3b97ff; margin-bottom: 15px;';
    stackSection.appendChild(stackTitle);

    const technologies = [
        { name: 'WebXR API', desc: 'Realidade Aumentada e Virtual' },
        { name: 'Three.js', desc: 'Engine 3D JavaScript' },
        { name: 'Y.js', desc: 'Protocolo CRDT para colaboração' },
        { name: 'WebSocket', desc: 'Comunicação bidirecional' },
        { name: 'Vite', desc: 'Build tool e dev server' },
        { name: 'REST API', desc: 'Backend Node.js' }
    ];

    technologies.forEach(tech => {
        const techBox = document.createElement('div');
        techBox.style.cssText = 'background: rgba(255,255,255,0.05); padding: 12px; margin-bottom: 10px; border-radius: 5px; border-left: 4px solid #7143b3ff;';
        
        const techName = document.createElement('strong');
        techName.textContent = `💻 ${tech.name}`;
        techName.style.cssText = 'color: #7143b3ff; display: block;';
        
        const techDesc = document.createElement('p');
        techDesc.textContent = tech.desc;
        techDesc.style.cssText = 'color: #aaa; font-size: 0.9em; margin: 5px 0 0 0;';
        
        techBox.appendChild(techName);
        techBox.appendChild(techDesc);
        stackSection.appendChild(techBox);
    });

    aboutContainer.appendChild(stackSection);

    // Equipe/Créditos
    const creditsSection = document.createElement('div');
    creditsSection.style.cssText = 'margin-bottom: 25px;';

    const creditsTitle = document.createElement('h3');
    creditsTitle.textContent = '👥 Créditos';
    creditsTitle.style.cssText = 'color: #ec8e28ff; margin-bottom: 15px;';
    creditsSection.appendChild(creditsTitle);

    const credits = [
        'Desenvolvimento: Henrique Alexandre, Lucas Medeiros, Kaio Vittor e João Pedro',
        'Inspiração: Projeto AR Cave',
        'Baseado em: Three.js, Y.js, WebXR Standards',
        'Hospedagem: Render.com'
    ];

    credits.forEach(credit => {
        const creditText = document.createElement('p');
        creditText.textContent = `✨ ${credit}`;
        creditText.style.cssText = 'color: #aaa; margin: 8px 0; font-size: 0.95em;';
        creditsSection.appendChild(creditText);
    });

    aboutContainer.appendChild(creditsSection);

    // Recursos
    const resourcesSection = document.createElement('div');
    resourcesSection.style.cssText = 'margin-bottom: 25px;';

    const resourcesTitle = document.createElement('h3');
    resourcesTitle.textContent = '📚 Recursos';
    resourcesTitle.style.cssText = 'color: #61650cff; margin-bottom: 15px;';
    resourcesSection.appendChild(resourcesTitle);

    const resources = [
        { icon: '📖', name: 'Tutorial', desc: 'Como usar a aplicação', url: null, action: () => showTutorial() },
        { icon: '🐛', name: 'Reportar Bug', desc: 'Encontrou um problema?', url: 'https://forms.gle/LnVWwk6RXVwtLDht6', action: null },
        { icon: '💡', name: 'Sugestões', desc: 'Ideias para melhorias', url: 'https://forms.gle/LnVWwk6RXVwtLDht6', action: null },
    ];

    resources.forEach(resource => {
        const resourceBox = document.createElement('div');
        resourceBox.style.cssText = 'background: rgba(255,255,255,0.05); padding: 12px; margin-bottom: 10px; border-radius: 5px; cursor: pointer; transition: 0.3s;';
        
        // Adiciona hover effect
        resourceBox.addEventListener('mouseenter', () => {
            resourceBox.style.backgroundColor = 'rgba(255,255,255,0.1)';
            resourceBox.style.transform = 'translateX(5px)';
        });
        resourceBox.addEventListener('mouseleave', () => {
            resourceBox.style.backgroundColor = 'rgba(255,255,255,0.05)';
            resourceBox.style.transform = 'translateX(0)';
        });
        
        const resourceName = document.createElement('strong');
        resourceName.textContent = `${resource.icon} ${resource.name}`;
        resourceName.style.cssText = 'color: #61650cff;';
        
        const resourceDesc = document.createElement('p');
        resourceDesc.textContent = resource.desc;
        resourceDesc.style.cssText = 'color: #aaa; font-size: 0.9em; margin: 5px 0 0 0;';
        
        resourceBox.appendChild(resourceName);
        resourceBox.appendChild(resourceDesc);
        
        // Adiciona click handler
        if (resource.url) {
            resourceBox.addEventListener('click', () => {
                window.open(resource.url, '_blank');
            });
        } else if (resource.action) {
            resourceBox.addEventListener('click', resource.action);
        }
        
        resourcesSection.appendChild(resourceBox);
    });

    aboutContainer.appendChild(resourcesSection);

    // Status da Aplicação
    const statusSection = document.createElement('div');
    statusSection.style.cssText = 'margin-bottom: 25px; background: rgba(97, 101, 12, 0.3); padding: 15px; border-radius: 5px; border-left: 4px solid #61650cff;';

    const statusTitle = document.createElement('h3');
    statusTitle.textContent = '🟢 Status';
    statusTitle.style.cssText = 'color: #61650cff; margin-bottom: 10px;';
    statusSection.appendChild(statusTitle);

    const statusItems = [
        '❌ Sincronização em tempo real',
        '❌ Suporte a múltiplos usuários',
        '✅ Persistência de dados',
        '⚠️ Beta - Pode conter bugs',
        '🔜 Melhorias contínuas'
    ];

    statusItems.forEach(status => {
        const statusText = document.createElement('p');
        statusText.textContent = status;
        statusText.style.cssText = 'color: #b8cc00ff; margin: 5px 0; font-size: 0.95em;';
        statusSection.appendChild(statusText);
    });

    aboutContainer.appendChild(statusSection);

    // Botão de voltar
    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = 'margin-top: 20px; display: flex; gap: 10px; justify-content: center;';

    const backButton = createAndAppend(buttonContainer, 'button', {
        text: 'Voltar',
        classes: ['btn', 'btn-secondary'],
        onClick: resetView
    });
    backButton.style.cssText = 'min-width: 150px;';

    aboutContainer.appendChild(buttonContainer);

    targetPanel.appendChild(aboutContainer);
}

function showTutorial() {
    const targetPanel = contentPanel;
    targetPanel.innerHTML = '';
    modal.style.display = 'block';
    modal.classList.add('view-content');

    const tutorialContainer = document.createElement('div');
    tutorialContainer.className = 'tutorial-container';
    tutorialContainer.style.cssText = 'max-height: 70vh; overflow-y: auto; padding: 20px;';

    // Título
    const title = document.createElement('h2');
    title.textContent = '📚 Tutorial - AR Cave Immersion';
    title.style.cssText = 'text-align: center; margin-bottom: 20px; color: #fff;';
    tutorialContainer.appendChild(title);

    // Sobre a aplicação
    const aboutSection = document.createElement('div');
    aboutSection.style.cssText = 'margin-bottom: 25px;';
    
    const aboutTitle = document.createElement('h3');
    aboutTitle.textContent = '🎨 O que é AR Cave Immersion?';
    aboutTitle.style.cssText = 'color: #de224bff; margin-bottom: 10px;';
    aboutSection.appendChild(aboutTitle);

    const aboutText = document.createElement('p');
    aboutText.textContent = `AR Cave Immersion é uma aplicação inovadora de Realidade Aumentada que permite 
    desenhar e pintar em um ambiente 3D colaborativo. Utilizando WebXR, você pode criar 
    desenhos impressionantes usando controladores de realidade aumentada e visualizá-los 
    em tempo real com outros usuários conectados à mesma sessão.`;
    aboutText.style.cssText = 'color: #ccc; line-height: 1.6; margin-bottom: 15px;';
    aboutSection.appendChild(aboutText);

    tutorialContainer.appendChild(aboutSection);

    // Funcionalidades
    const featuresSection = document.createElement('div');
    featuresSection.style.cssText = 'margin-bottom: 25px;';

    const featuresTitle = document.createElement('h3');
    featuresTitle.textContent = '✨ Funcionalidades Principais';
    featuresTitle.style.cssText = 'color: #1883cfff; margin-bottom: 15px;';
    featuresSection.appendChild(featuresTitle);

    tutorialContent.features.items.forEach(feature => {
        const featureBox = document.createElement('div');
        featureBox.style.cssText = 'background: rgba(255,255,255,0.05); padding: 12px; margin-bottom: 10px; border-radius: 5px; border-left: 4px solid #5b3b97ff;';
        
        const featureName = document.createElement('strong');
        featureName.textContent = `${feature.icon} ${feature.name}`;
        featureName.style.cssText = 'color: #5b3b97ff;';
        
        const featureDesc = document.createElement('p');
        featureDesc.textContent = feature.description;
        featureDesc.style.cssText = 'color: #aaa; font-size: 0.9em; margin: 5px 0 0 0;';
        
        featureBox.appendChild(featureName);
        featureBox.appendChild(featureDesc);
        featuresSection.appendChild(featureBox);
    });

    tutorialContainer.appendChild(featuresSection);

    // Como começar
    const gettingStartedSection = document.createElement('div');
    gettingStartedSection.style.cssText = 'margin-bottom: 25px;';

    const gettingStartedTitle = document.createElement('h3');
    gettingStartedTitle.textContent = '🚀 Como Começar?';
    gettingStartedTitle.style.cssText = 'color: #ec8e28ff; margin-bottom: 15px;';
    gettingStartedSection.appendChild(gettingStartedTitle);

    tutorialContent.getStarted.steps.forEach(step => {
        const stepBox = document.createElement('div');
        stepBox.style.cssText = 'background: rgba(255,255,255,0.05); padding: 12px; margin-bottom: 10px; border-radius: 5px;';
        
        const stepNum = document.createElement('span');
        stepNum.textContent = `Passo ${step.step}: `;
        stepNum.style.cssText = 'color: #ec8e28ff; font-weight: bold;';
        
        const stepTitle = document.createElement('span');
        stepTitle.textContent = step.title;
        stepTitle.style.cssText = 'color: #fff; font-weight: bold;';
        
        const stepDesc = document.createElement('p');
        stepDesc.textContent = step.description;
        stepDesc.style.cssText = 'color: #aaa; font-size: 0.9em; margin: 8px 0 0 0;';
        
        stepBox.appendChild(stepNum);
        stepBox.appendChild(stepTitle);
        stepBox.appendChild(stepDesc);
        gettingStartedSection.appendChild(stepBox);
    });

    tutorialContainer.appendChild(gettingStartedSection);

    // FAQ
    const faqSection = document.createElement('div');
    faqSection.style.cssText = 'margin-bottom: 25px;';

    const faqTitle = document.createElement('h3');
    faqTitle.textContent = '❓ Perguntas Frequentes';
    faqTitle.style.cssText = 'color: #7143b3ff; margin-bottom: 15px;';
    faqSection.appendChild(faqTitle);

    tutorialContent.faq.questions.forEach(item => {
        const faqItem = document.createElement('div');
        faqItem.style.cssText = 'background: rgba(255,255,255,0.05); padding: 12px; margin-bottom: 10px; border-radius: 5px;';
        
        const question = document.createElement('strong');
        question.textContent = `❓ ${item.q}`;
        question.style.cssText = 'color: #7143b3ff; display: block; margin-bottom: 8px;';
        
        const answer = document.createElement('p');
        answer.textContent = `✅ ${item.a}`;
        answer.style.cssText = 'color: #aaa; font-size: 0.9em; margin: 0;';
        
        faqItem.appendChild(question);
        faqItem.appendChild(answer);
        faqSection.appendChild(faqItem);
    });

    tutorialContainer.appendChild(faqSection);

    // Dicas
    const tipsSection = document.createElement('div');
    tipsSection.style.cssText = 'margin-bottom: 25px; background: rgba(97, 101, 12, 0.3); padding: 15px; border-radius: 5px; border-left: 4px solid #61650cff;';

    const tipsTitle = document.createElement('h3');
    tipsTitle.textContent = '💡 Dicas e Truques';
    tipsTitle.style.cssText = 'color: #61650cff; margin-bottom: 10px;';
    tipsSection.appendChild(tipsTitle);

    const tips = [
        'Comece com traços grandes para familiarizar-se com os controles',
        'Use cores diferentes para diferenciar seus desenhos',
        'Convide amigos para colaborar e criar obras conjuntas',
        'Aproveite o espaço 3D para criar desenhos em perspectiva',
        'Você pode carregar desenhos anteriores ao entrar em uma sessão'
    ];

    tips.forEach(tip => {
        const tipText = document.createElement('p');
        tipText.textContent = `• ${tip}`;
        tipText.style.cssText = 'color: #b8cc00ff; margin: 5px 0; font-size: 0.95em;';
        tipsSection.appendChild(tipText);
    });

    tutorialContainer.appendChild(tipsSection);

    // Botão de voltar
    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = 'margin-top: 20px; display: flex; gap: 10px; justify-content: center;';

    const backButton = createAndAppend(buttonContainer, 'button', {
        text: 'Voltar',
        classes: ['btn', 'btn-secondary'],
        onClick: resetView
    });
    backButton.style.cssText = 'min-width: 150px;';

    tutorialContainer.appendChild(buttonContainer);

    targetPanel.appendChild(tutorialContainer);
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

    // Função para iniciar o fluxo de autenticação
    const startAuthFlow = () => {
        desktopWarning.style.display = 'none';
        setTimeout(() => logo.classList.add('visible'), 100);
        setTimeout(() => {
            loadingScreen.classList.add('loading-hidden');
            loadingScreen.addEventListener('transitionend', () => loadingScreen.style.display = 'none');

            console.log('🔍 Verificando autenticação...', { isAuth: isAuthenticated() });
            
            if (!isAuthenticated()) {
                console.log('📱 Não autenticado - Mostrando tela QR');
                showQRAuthScreen(() => {
                    console.log('✅ Autenticação bem-sucedida!');
                    closeQRScreen();
                    sidebar.style.visibility = 'visible';
                    sidebar.style.opacity = 1;
                    mainContent.style.visibility = 'visible';
                    mainContent.style.opacity = 1;
                    fabContainer.style.visibility = 'visible';
                    fabContainer.style.opacity = 1;
                    window.showView('list');
                });
            } else {
                console.log('✅ Já autenticado - Mostrando menu');
                sidebar.style.visibility = 'visible';
                sidebar.style.opacity = 1;
                mainContent.style.visibility = 'visible';
                mainContent.style.opacity = 1;
                fabContainer.style.visibility = 'visible';
                fabContainer.style.opacity = 1;
                window.showView('list');
            }
        }, 3000);
    };

    if (isDesktop) {
        desktopWarning.style.display = 'flex';
        closeWarningBtn.addEventListener('click', () => {
            startAuthFlow();
        });
    } else {
        startAuthFlow();
    }

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

    // Event listeners dos botões do sidebar
    document.getElementById('create-session-btn').addEventListener('click', () => showView('create'));
    document.getElementById('list-sessions-btn').addEventListener('click', () => showView('list'));
    document.getElementById('tutorial-btn').addEventListener('click', () => showTutorial());
    document.getElementById('about-btn').addEventListener('click', () => {
        showAbout();
    });
    
    const scanQrcodeBtn = document.getElementById('scan-qrcode');
    if (scanQrcodeBtn) {
        scanQrcodeBtn.addEventListener('click', () => {
            clearAuth();
            showQRAuthScreen(() => {
                window.showView('list');
            });
        });
    }

    // Event listeners dos FAB buttons
    document.getElementById('fab-create').addEventListener('click', () => showView('create'));
    document.getElementById('fab-list').addEventListener('click', () => showView('list'));
    document.getElementById('fab-qr').addEventListener('click', () => {
        clearAuth();
        showQRAuthScreen(() => {
            window.showView('list');
        });
    });

});

// Expor funções globalmente
window.showView = showView;
window.resetView = resetView;
window.saveSession = saveSession;
window.selectSession = selectSession;
window.showTutorial = showTutorial;
window.showAbout = showAbout;
window.iniciarExperienciaAR = (sessionId) => { 
    console.log("Função de AR chamada para sessão:", sessionId);
    // Aqui será chamado o código de AR do main.js quando estiver pronto
};