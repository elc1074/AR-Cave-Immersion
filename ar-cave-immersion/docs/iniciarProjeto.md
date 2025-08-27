# AR-Cave-Immersion

Uma experiência de imersão 3D em uma caverna baseada na web usando Three.js e WebXR.

Este repositório contém o código-fonte para a aplicação. No momento, o projeto está em sua fase inicial de "teste", exibindo uma cena básica com um objeto 3D e suporte para Realidade Virtual (VR).

## Tecnologias Utilizadas

* **[Vite](https.vitejs.dev/)**: Ferramenta de build para desenvolvimento web moderno e rápido.
* **[Three.js](https://threejs.org/)**: Biblioteca para criação e exibição de gráficos 3D no navegador.
* **[WebXR API](https://developer.mozilla.org/pt-BR/docs/Web/API/WebXR_Device_API)**: Para criar experiências imersivas de Realidade Virtual e Aumentada na web.
* **[Node.js](https://nodejs.org/)**: Ambiente de execução para JavaScript.

## Guia de Início Rápido (Teste)

Siga os passos abaixo para configurar e executar o projeto em sua máquina local.

### Pré-requisitos

Antes de começar, garanta que você tenha o seguinte software instalado:

* **Node.js**: É **obrigatório** ter a versão `20.19+` ou `22.12+`.
    * Recomendamos fortemente o uso do **[NVM (Node Version Manager)](https://github.com/coreybutler/nvm-windows)** para instalar e gerenciar as versões do Node.js e evitar problemas de compatibilidade.

### Instalação

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/seu-usuario/AR-Cave-Immersion.git](https://github.com/seu-usuario/AR-Cave-Immersion.git)
    ```

2.  **Navegue até a pasta do projeto:**
    ```bash
    cd AR-Cave-Immersion/ar-cave-immersion
    ```
    *(Nota: A estrutura atual possui uma pasta aninhada)*

3.  **Instale as dependências:**
    Este comando irá baixar o Vite e o Three.js, necessários para o projeto.
    ```bash
    npm install
    ```

### Rodando o Projeto

1.  **Inicie o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```

2.  **Abra o navegador:**
    Acesse o endereço [http://localhost:5173/](http://localhost:5173/). Você deverá ver uma página com um fundo preto e um cubo verde girando.

3.  **Testando a funcionalidade WebXR:**
    Para testar a funcionalidade de VR, acesse a mesma página a partir de um navegador com suporte a WebXR (como o Meta Quest Browser) ou com um headset de VR conectado ao computador. O botão **"ENTER VR"** deverá aparecer no canto inferior da tela.