Rodando o Projeto para Teste no Celular

Para que seu celular acesse o projeto, o servidor de desenvolvimento precisa rodar em **HTTPS** e estar visível na sua rede local.

#### **Passo 1: Configure o Servidor Seguro (HTTPS) e o Host**
A API WebXR exige uma conexão segura para funcionar.

1.  Na raiz do seu projeto, crie um arquivo chamado `vite.config.js` (Posivelmente esse arquivo ja existe em ambiente de desenvolvimento então poderá pular essa parte).
2.  Cole o seguinte código neste arquivo. Ele automatiza a criação do certificado de segurança e expõe o servidor na sua rede.
    ```javascript
    import { defineConfig } from 'vite';
    import basicSsl from '@vitejs/plugin-basic-ssl';

    export default defineConfig({
      plugins: [
        basicSsl()
      ],
      server: {
        https: true, // Força o uso de HTTPS
        host: true  // Torna o servidor acessível na rede local
      }
    });
    ```

#### **Passo 2: Encontre o Endereço IP do seu Computador**
1.  Abra o terminal (CMD ou PowerShell) no seu PC.
2.  Digite o comando `ipconfig` e pressione Enter.
3.  Procure a seção do seu **"Adaptador de Rede sem Fio Wi-Fi"** e anote o **"Endereço IPv4"**. Será um número como `192.168.1.15`.

#### **Passo 3: Inicie o Servidor**
1.  No terminal do seu projeto (dentro do VS Code), execute:
    ```bash
    npm run dev
    ```
2.  O terminal mostrará dois endereços. O que nos interessa é o `Network`:
    ```
      ➜  Local:   https://localhost:5173/
      ➜  Network: [https://192.168.1.15:5173/](https://192.168.1.15:5173/)  <-- ESTE É O ENDEREÇO!
    ```

### Parte 3: Configuração do Celular

Agora, prepare seu celular para acessar a aplicação.

#### **Requisito Essencial: Mesma Rede Wi-Fi**
📶 Seu computador e seu celular **precisam estar conectados exatamente na mesma rede Wi-Fi**.

#### **Passo 1: Configuração para iPhone (Safari)**
O Safari desativa o WebXR por padrão. É preciso ativá-lo manualmente.

1.  Abra o aplicativo **"Ajustes"**.
2.  Vá em **Safari > Avançado > Feature Flags** (ou Recursos Experimentais).
3.  Procure e **ative** as seguintes opções:
    * `WebXR Augmented Reality Module`
    * `WebXR Device API`

#### **Passo 2: Configuração para Android (Chrome)**
1.  Verifique se seu celular é compatível na [lista de dispositivos com suporte a ARCore](https://developers.google.com/ar/devices).
2.  Garanta que o aplicativo **[Serviços do Google Play para RA](https://play.google.com/store/apps/details?id=com.google.ar.core)** está instalado e atualizado pela Play Store.

#### **Passo 3: Acesse a Aplicação**
1.  Abra o navegador no seu celular (Safari no iPhone, Chrome no Android).
2.  Digite o endereço **`Network`** completo que apareceu no seu terminal, começando com `https://`. Exemplo: `https://192.168.1.15:5173`.

> **⚠️ ATENÇÃO: Alerta de Segurança**
> Ao acessar o link, o navegador mostrará um alerta de "Conexão Não Particular" ou "Certificado Inválido". **Isso é normal.** Acontece porque o certificado de segurança foi criado pelo seu próprio computador, não por uma autoridade oficial.
>
> Para prosseguir, clique em **"Avançado"** e depois em **"Ir para [endereço IP] (não seguro)"**.

Após esses passos, a página carregará, o botão **"START AR"** aparecerá e você poderá iniciar a experiência de Realidade Aumentada.