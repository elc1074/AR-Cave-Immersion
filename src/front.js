    const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

        const modal = document.getElementById('modal');
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
        
        async function showView(viewName) {
            if (viewName === 'create') {
                contentPanel.innerHTML = `
                    <h2>Criar Sessão</h2>
                    <input id="sessionName" type="text" placeholder="Nome da sessão">
                    <button class="btn btn-primary" onclick="saveSession()">Salvar</button>
                    <button class="btn btn-secondary" onclick="resetView()">Voltar</button>
                `;
            } 
            else if (viewName === 'list') {
                try {
                    contentPanel.innerHTML = `<p>Carregando sessões...</p>`;
                    let response = await fetch(`${API_URL}/users`);
                    let data = await response.json();
                    let users = data.value;

                    let listHTML = '<h2>Lista de Sessões</h2><ul id="sessionList">';
                    if (users.length === 0) {
                        listHTML += '<li>Nenhuma sessão criada</li>';
                    } else {
                        users.forEach(u => {
                            listHTML += `<li onclick="selectSession('${u.id}')">${u.name}</li>`;
                        });
                    }
                    listHTML += `</ul><button class="btn btn-secondary" onclick="resetView()">Voltar</button>`;
                    contentPanel.innerHTML = listHTML;

                } catch (err) {
                    console.error(err);
                    showPopup("Erro ao buscar sessões!", 'error');
                    resetView(); 
                }
            }
            modal.classList.add('view-content');
        }

        function resetView() {
            modal.classList.remove('view-content');
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
            const script = document.createElement('script');
            script.type = 'module';
            script.src = './src/main.js';
            document.body.appendChild(script);
        }

        window.showView = showView;
        window.resetView = resetView;
        window.saveSession = saveSession;
        window.selectSession = selectSession;
        