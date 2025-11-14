# 🚀 GUIA DE SETUP - Y.JS WEBSOCKET

## 1️⃣ INSTALAR DEPENDÊNCIAS

```bash
npm install yjs y-websocket
```

## 2️⃣ INICIAR O SERVIDOR WEBSOCKET

### Opção A: Usando Node.js diretamente

```bash
node server/y-websocket-server.js
```

Você deve ver:
```
✅ Servidor WebSocket Y.js escutando em ws://localhost:1234
```

### Opção B: Usando npm script

Adicione ao seu `package.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "ws-server": "node server/y-websocket-server.js"
  }
}
```

Depois execute em um terminal separado:
```bash
npm run ws-server
```

## 3️⃣ INICIAR A APLICAÇÃO VITE

Em outro terminal:

```bash
npm run dev
```

## 4️⃣ TESTAR A COLABORAÇÃO

### Teste com Múltiplos Navegadores

1. Abra a aplicação em múltiplos navegadores/abas
2. Selecione a mesma sessão em cada um
3. Desenhe em um e veja aparecer no outro em tempo real

### Teste de Reconexão

1. Parar o servidor WebSocket (Ctrl+C)
2. A aplicação deve tentar reconectar automaticamente
3. Reiniciar servidor: `node server/y-websocket-server.js`
4. A sincronização deve retomar

## 📊 ESTRUTURA DO PROJETO ATUALIZADA

```
projeto/
├── src/
│   ├── main.js                    (CORRIGIDO)
│   ├── front.js
│   ├── style.css
│   ├── collaborative/
│   │   ├── webSocketProvider.js   (MELHORADO)
│   │   ├── drawSync.js            (MELHORADO)
│   │   └── userManager.js         (MELHORADO)
│   └── webxr/
│       └── painter.js             (MELHORADO)
├── server/
│   └── y-websocket-server.js      (NOVO)
├── package.json
└── ANALISE_CORRECOES.md           (NOVO)
```

## 🔧 VARIÁVEIS DE AMBIENTE

Criar arquivo `.env` (opcional, para produção):

```env
VITE_WS_URL=ws://localhost:1234
VITE_API_URL=https://seu-api.com
```

Se não definir, usará valores padrão no código.

## ⚠️ TROUBLESHOOTING

### Erro: "Cannot find module 'ws'"
```bash
npm install ws
```

### Erro: "WebSocket connection failed"
- Verificar se servidor WebSocket está rodando
- Verificar se porta 1234 está disponível
- Teste: `netstat -an | find "1234"` (Windows)

### Erro: "EADDRINUSE :::1234"
- Porta já em uso, encontre o processo:
  ```bash
  netstat -ano | findstr :1234
  taskkill /PID <PID> /F
  ```

### Desenhos não sincronizam
- Verificar console do navegador (F12)
- Verificar logs do servidor WebSocket
- Verificar se ambos clientes estão na mesma sessão
- Verificar se `sessionStorage.getItem('selectedSessionId')` retorna o mesmo valor

## 📱 TESTE EM DISPOSITIVOS MÚLTIPLOS

Se testar em máquinas diferentes, trocar `localhost` por IP da máquina:

```javascript
// No navegador remoto, modificar main.js
wsProvider = new WebsocketProvider(
    'ws://192.168.1.100:1234',  // IP da máquina do servidor
    `session_${sessionId}`,
    yDoc
)
```

## 🎯 VERIFICAR SE TUDO ESTÁ FUNCIONANDO

### Terminal 1 - Servidor WebSocket
```bash
npm run ws-server
# Esperado: ✅ Servidor WebSocket Y.js escutando em ws://localhost:1234
```

### Terminal 2 - Aplicação
```bash
npm run dev
# Esperado: ✅ http://localhost:5173/
```

### Navegador
1. Abra `http://localhost:5173`
2. Crie/selecione uma sessão
3. Abra outro navegador na mesma sessão
4. Desenhe em um e veja no outro

## 💡 DICAS DE DEBUG

### Ver logs de sincronização

Adicione ao início do `main.js`:
```javascript
// Ativar logs de Y.js
const enableYjsDebug = () => {
    drawingSync.strokes.observe(event => {
        console.log('Traço recebido:', event.target.length, 'traços total')
    })
}
```

### Monitorar conexão WebSocket

No console do navegador:
```javascript
// Ver status da conexão
console.log(drawingSync.wsProvider.status)

// Ver todos os traços
console.log(drawingSync.getAllStrokes())

// Ver usuários conectados
console.log(userManager.getAllUsers())
```

## 🎓 PRÓXIMOS PASSOS

1. **Persistência**: Implementar salvamento automático em banco de dados
2. **Escalabilidade**: Migrar para y-redis para múltiplas instâncias
3. **Segurança**: Adicionar autenticação ao WebSocket
4. **Performance**: Implementar compressão de dados
5. **Testes**: Criar testes automatizados para colaboração

