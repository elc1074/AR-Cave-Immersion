# ✨ CHECKLIST DE VERIFICAÇÃO - PROJETO Y.JS

## 📋 PRÉ-SETUP

- [ ] Node.js instalado (v16+)
- [ ] npm instalado
- [ ] Projeto clonado/baixado
- [ ] Terminal aberto na pasta do projeto

## 📦 INSTALAÇÃO DE DEPENDÊNCIAS

```bash
npm install yjs y-websocket
```

- [ ] `npm install` executado com sucesso
- [ ] `node_modules/yjs` existe
- [ ] `node_modules/y-websocket` existe
- [ ] `package.json` atualizado com novos pacotes

## 🚀 INICIALIZAÇÃO

### Terminal 1: Servidor WebSocket
```bash
node server/y-websocket-server.js
```

Esperado:
```
✅ Servidor WebSocket Y.js escutando em ws://localhost:1234
```

- [ ] Servidor iniciou sem erros
- [ ] Mensagem de sucesso apareceu
- [ ] Porta 1234 está disponível
- [ ] Terminal permanece aberto/ativo

### Terminal 2: Aplicação Vite
```bash
npm run dev
```

Esperado:
```
  VITE v... ready in 500 ms
  
  ➜  Local:   http://localhost:5173/
```

- [ ] Aplicação iniciou sem erros
- [ ] URL local apareceu
- [ ] Terminal permanece aberto/ativo

## 🧪 TESTE 1: FUNCIONALIDADE BÁSICA

### Navegador 1
1. [ ] Abra http://localhost:5173
2. [ ] Página carrega sem erros
3. [ ] Console (F12) não mostra erros críticos
4. [ ] Selecione/crie uma sessão
5. [ ] Interface AR/3D aparece
6. [ ] Pode desenhar normalmente

### Navegador 2 (nova aba ou navegador)
1. [ ] Abra http://localhost:5173 novamente
2. [ ] Selecione a MESMA sessão do Navegador 1
3. [ ] Interface AR/3D aparece

## 🔄 TESTE 2: SINCRONIZAÇÃO EM TEMPO REAL

### No Navegador 1
1. [ ] Desenhe algo (selecionar cor, traçar)
2. [ ] Observe se ele aparece na tela
3. [ ] Desenho salva no banco de dados (verificar API)

### No Navegador 2
1. [ ] [ ] Veja o desenho do Navegador 1 aparecendo em tempo real
2. [ ] Desenhe algo diferente
3. [ ] Observe se aparece no Navegador 1 instantaneamente

**Esperado**: Ambos navegadores mostram os mesmos desenhos em tempo real

## 👥 TESTE 3: LISTA DE USUÁRIOS

### Verificação
1. [ ] Procure elemento `#userList` na página
2. [ ] Se existir, deve mostrar usuários conectados
3. [ ] Cores dos usuários devem aparecer
4. [ ] Nomes dos usuários devem aparecer

**Esperado**: Lista atualiza quando usuários entram/saem

## 🔌 TESTE 4: RECONEXÃO

### Parar Servidor
1. [ ] No terminal do servidor, pressione Ctrl+C
2. [ ] Servidor desliga
3. [ ] Aplicação continua rodando no navegador

### Verificar Logs
1. [ ] Abra console do navegador (F12)
2. [ ] Procure por mensagens de reconexão
3. [ ] Aguarde 10 segundos

### Reiniciar Servidor
1. [ ] Execute `node server/y-websocket-server.js` novamente
2. [ ] Servidor começa a rodar
3. [ ] Navegador deve reconectar automaticamente

**Esperado**: Sincronização retoma após reconexão

## 💾 TESTE 5: PERSISTÊNCIA

### Verificar Banco de Dados
1. [ ] Desenhe algo
2. [ ] Verifique na API se foi salvo (GET `/drawings/user/{userId}`)
3. [ ] Recarregue a página (F5)
4. [ ] Desenhos anteriores aparecem

**Esperado**: Histórico de desenhos persiste entre sessões

## 📊 TESTE 6: PERFORMANCE

### Múltiplos Traços
1. [ ] Desenhe 5-10 traços diferentes
2. [ ] Observe se renderização é suave
3. [ ] FPS deve manter-se acima de 30

### Múltiplos Usuários
1. [ ] Abra 3+ abas da aplicação
2. [ ] Todos na mesma sessão
3. [ ] Desenhem simultaneamente
4. [ ] Observe se sincronização é suave

**Esperado**: Aplicação não trava, sincronização flui naturalmente

## 🐛 VERIFICAÇÃO DE ERROS

### Console do Navegador (F12 > Console)

Procure por:
- [ ] Nenhum erro vermelho relacionado a Y.js
- [ ] Nenhum erro de WebSocket
- [ ] Mensagens de conexão aparecem

Exemplos de **OK**:
```
✓ Connection status: connected
✓ WebSocket status: connected
```

Exemplos de **PROBLEMA**:
```
✗ ECONNREFUSED (servidor não está rodando)
✗ Cannot find module 'yjs'
✗ WebSocket connection failed
```

## 📝 RELATÓRIO FINAL

### Funcionalidades Funcionando
- [ ] Desenho básico
- [ ] Sincronização em tempo real
- [ ] Múltiplos usuários
- [ ] Reconexão automática
- [ ] Persistência no banco
- [ ] Lista de usuários
- [ ] Cores diferentes por usuário

### Requisitos Técnicos
- [ ] Servidor WebSocket rodando em `:1234`
- [ ] Aplicação Vite rodando em `:5173`
- [ ] Y.js sincronizando dados
- [ ] API backend respondendo
- [ ] Banco de dados salvando

## ✅ STATUS FINAL

### Todos os testes passaram?
- [ ] **SIM** → Projeto está pronto para uso!
- [ ] **NÃO** → Ver seção TROUBLESHOOTING

## 🆘 TROUBLESHOOTING

Se algo não funcionar:

### Problema: "Cannot find module 'yjs'"
```bash
npm install yjs y-websocket
```

### Problema: "EADDRINUSE :::1234"
Porta está em uso. Encontre e mate o processo:
```bash
netstat -ano | findstr :1234
taskkill /PID <PID> /F
```

### Problema: "WebSocket connection failed"
- Verifique se servidor WebSocket está rodando
- Verifique firewall
- Verifique se URL está correta

### Problema: "Desenhos não sincronizam"
- Verificar se ambos navegadores estão na mesma sessão
- Verificar console para erros Y.js
- Verificar aba Network (F12) para WebSocket
- Reiniciar servidor WebSocket

### Problema: "Elementos DOM não aparecem"
- Verificar se `#userList` existe no HTML
- Verificar CSS para elementos ocultos
- Verificar console para erros JavaScript

## 📞 PRECISA DE AJUDA?

1. Verificar `SETUP_GUIA.md`
2. Verificar `ANALISE_CORRECOES.md`
3. Verificar `RESUMO_CORRECOES.md`
4. Ver logs do servidor e navegador

---

**Última atualização**: November 2025
**Status**: ✅ Pronto para testar

