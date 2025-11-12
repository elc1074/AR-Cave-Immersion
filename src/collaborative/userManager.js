import { initWebSocket } from './webSocketProvider.js'

export class UserManager {
    constructor(sessionId) {
        const { awareness } = initWebSocket(sessionId)
        this.awareness = awareness
        this.sessionId = sessionId
        this.localUser = {
            id: sessionId,
            color: this.getRandomColor(),
            name: `User-${Math.floor(Math.random() * 1000)}`
        }
        this.setupEventListeners()
        this.setLocalUser(this.localUser)
    }

    getRandomColor() {
        const colors = [
            '#de224bff', '#1883cfff', '#5b3b97ff',
            '#ec8e28ff', '#7143b3ff', '#61650cff'
        ]
        return colors[Math.floor(Math.random() * colors.length)]
    }

    setupEventListeners() {
        this.awareness.on('change', () => {
            const states = this.awareness.getStates()
            const users = Array.from(states.values())
                .map(state => state.user)
                .filter(Boolean)
            this.updateUserList(users)
        })

        // Limpar estado quando a janela for fechada
        window.addEventListener('beforeunload', () => {
            this.awareness.setLocalState(null)
        })
    }

    updateUserList(users) {
        const userList = document.getElementById('userList')
        if (!userList) return

        userList.innerHTML = ''
        users.forEach(user => {
            const userElement = document.createElement('div')
            userElement.className = 'user-item'
            userElement.innerHTML = `
                <span class="user-color" style="background-color: ${user.color}"></span>
                <span class="user-name">${user.name}</span>
            `
            userList.appendChild(userElement)
        })
    }

    setLocalUser(user) {
        this.localUser = user
        this.awareness.setLocalState({ user })
    }

    getLocalUser() {
        return this.localUser
    }

    getAllUsers() {
        return Array.from(this.awareness.getStates().values())
            .map(state => state.user)
            .filter(Boolean)
    }
}
