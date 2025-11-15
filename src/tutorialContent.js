// Tutorial Content for AR Cave Immersion Application

export const tutorialContent = {
    aboutApp: {
        title: "Sobre a Aplicação",
        sections: [
            {
                heading: "O que é AR Cave Immersion?",
                content: `AR Cave Immersion é uma aplicação inovadora de Realidade Aumentada (AR) 
que permite desenhar e pintar em um ambiente 3D colaborativo. Utilizando 
WebXR, você pode criar desenhos impressionantes usando controladores de 
realidade aumentada e visualizá-los em tempo real com outros usuários 
conectados à mesma sessão.`
            },
            {
                heading: "Funcionalidades Principais",
                content: `• 🎨 Desenho 3D Colaborativo: Desenhe simultaneamente com múltiplos usuários
• 🌈 Paleta de Cores: Escolha entre várias cores para seus desenhos
• 👥 Sincronização em Tempo Real: Veja desenhos de outros usuários instantaneamente
• 💾 Persistência de Dados: Seus desenhos são salvos automaticamente
• 📱 Compatibilidade: Funciona em dispositivos com suporte a WebXR
• 🎯 Controle Preciso: Use os controladores XR para máxima precisão`
            },
            {
                heading: "Como Começar?",
                content: `1. Crie ou selecione uma sessão no menu inicial
2. Autorize-se através do código QR (se necessário)
3. Coloque seu dispositivo em modo de Realidade Aumentada
4. Use os controladores para desenhar
5. Compartilhe a sessão com outros para colaborar`
            },
            {
                heading: "Controles dos Controladores XR",
                content: `• Botão Gatilho (Trigger): Desenha enquanto pressionado
• Botão Squeeze: Ajusta o tamanho do pincel (mova a mão para cima/baixo)
• Menu: Acessa opções adicionais
• Cores: Use o seletor de cores na interface`
            },
            {
                heading: "Tecnologia Utilizada",
                content: `• Three.js: Renderização 3D de alto desempenho
• WebXR: Padrão para realidade aumentada na web
• Y.js: Sincronização colaborativa em tempo real
• WebSocket: Comunicação bidirecional em tempo real
• API REST: Backend para persistência de dados`
            },
            {
                heading: "Dicas e Truques",
                content: `💡 Comece com traços grandes para familiarizar-se com os controles
💡 Use cores diferentes para diferenciar seus desenhos
💡 Convide amigos para colaborar e criar obras conjuntas
💡 Aproveite o espaço 3D para criar desenhos em perspectiva
💡 Você pode carregar desenhos anteriores ao entrar em uma sessão`
            }
        ]
    },
    
    features: {
        title: "Recursos da Aplicação",
        items: [
            {
                icon: "🎨",
                name: "Desenho 3D",
                description: "Crie desenhos em um espaço 3D totalmente interativo"
            },
            {
                icon: "👥",
                name: "Colaboração",
                description: "Desenhe com outros usuários em tempo real"
            },
            {
                icon: "🌈",
                name: "Cores",
                description: "Escolha entre 6 cores diferentes para seus desenhos"
            },
            {
                icon: "💾",
                name: "Persistência",
                description: "Seus desenhos são salvos automaticamente"
            },
            {
                icon: "⚡",
                name: "Sincronização",
                description: "Mudanças aparecem instantaneamente para todos"
            },
            {
                icon: "🎮",
                name: "Controle XR",
                description: "Interface intuitiva com controladores de realidade aumentada"
            }
        ]
    },

    faq: {
        title: "Perguntas Frequentes",
        questions: [
            {
                q: "Preciso de internet para usar?",
                a: "Sim, a aplicação precisa de uma conexão de internet estável para sincronização em tempo real e salvamento de dados."
            },
            {
                q: "Quantas pessoas podem desenhar simultaneamente?",
                a: "Não há limite técnico de usuários. Quanto mais usuários, mais interessante fica a colaboração!"
            },
            {
                q: "Como convido outras pessoas?",
                a: "Compartilhe o ID da sessão que você criar. Outras pessoas podem procurar esse ID na lista de sessões."
            },
            {
                q: "Meus desenhos são privados?",
                a: "Os desenhos são salvos em uma sessão. Qualquer pessoa com acesso à sessão pode ver todos os desenhos."
            },
            {
                q: "Posso deletar desenhos?",
                a: "Atualmente, não há função para deletar desenhos individuais. Contate o administrador se precisar."
            },
            {
                q: "Qual dispositivo preciso?",
                a: "Qualquer dispositivo com suporte a WebXR: óculos AR, smartphones com suporte a WebXR, ou headsets VR."
            },
            {
                q: "Como funciona a sincronização?",
                a: "Usamos Y.js com WebSocket para sincronização distribuída. Cada mudança é propagada para todos os clientes instantaneamente."
            },
            {
                q: "Posso usar no desktop?",
                a: "Sim, mas algumas funcionalidades de AR estarão limitadas. A aplicação funciona com mouse e teclado."
            }
        ]
    },

    getStarted: {
        title: "Guia Rápido",
        steps: [
            {
                step: 1,
                title: "Autenticação",
                description: "Escaneie o código QR ou faça login com suas credenciais"
            },
            {
                step: 2,
                title: "Criar/Selecionar Sessão",
                description: "Crie uma nova sessão ou escolha uma existente"
            },
            {
                step: 3,
                title: "Iniciar AR",
                description: "Clique em 'Entrar em AR' para começar a desenhar"
            },
            {
                step: 4,
                title: "Escolher Cor",
                description: "Use o seletor de cores para escolher a cor desejada"
            },
            {
                step: 5,
                title: "Desenhar",
                description: "Use o gatilho do controlador para desenhar no espaço 3D"
            },
            {
                step: 6,
                title: "Colaborar",
                description: "Compartilhe a sessão e convide outros para colaborar"
            }
        ]
    }
};

export function formatTutorialText() {
    return `
╔════════════════════════════════════════════════════════════════╗
║          🎨 AR CAVE IMMERSION - GUIA COMPLETO 🎨              ║
╚════════════════════════════════════════════════════════════════╝

${tutorialContent.aboutApp.sections.map(section => `
📌 ${section.heading}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${section.content}
`).join('\n')}

╔════════════════════════════════════════════════════════════════╗
║                     PERGUNTAS FREQUENTES                       ║
╚════════════════════════════════════════════════════════════════╝

${tutorialContent.faq.questions.map((item, idx) => `
❓ ${item.q}
✅ ${item.a}
`).join('\n')}

╔════════════════════════════════════════════════════════════════╗
║                    COMECE AGORA MESMO!                        ║
╚════════════════════════════════════════════════════════════════╝

${tutorialContent.getStarted.steps.map(step => `
${step.step}. ${step.title}: ${step.description}
`).join('\n')}

Divirta-se desenhando! 🎨✨
`;
}
