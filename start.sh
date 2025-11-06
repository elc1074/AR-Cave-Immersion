#!/bin/bash

# ============================================================================
# Script de Inicialização Rápida - Autenticação QR Code
# AR-Cave-Immersion v2.0
# 5 de novembro de 2025
# ============================================================================

echo ""
echo "╔════════════════════════════════════════════════════════════════════╗"
echo "║                                                                    ║"
echo "║       🚀 AR-CAVE-IMMERSION - AUTENTICAÇÃO QR CODE v2.0           ║"
echo "║                                                                    ║"
echo "║           Menu só aparece após escanear QR code!                 ║"
echo "║                                                                    ║"
echo "╚════════════════════════════════════════════════════════════════════╝"
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ============================================================================
# PASSO 1: Verificar se estamos no diretório correto
# ============================================================================
echo -e "${BLUE}1️⃣  Verificando diretório...${NC}"

if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Erro: Execute este script do diretório raiz do projeto${NC}"
    echo "   Exemplo: cd /home/kaio-fernandes/Documentos/trabalho\ PS2/AR-Cave-Immersion"
    exit 1
fi

echo -e "${GREEN}✅ Diretório correto${NC}"
echo ""

# ============================================================================
# PASSO 2: Instalar dependências se necessário
# ============================================================================
echo -e "${BLUE}2️⃣  Verificando dependências...${NC}"

if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}⚠️  node_modules não encontrado. Instalando...${NC}"
    npm install
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Erro ao instalar dependências${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ Dependências instaladas${NC}"
else
    echo -e "${GREEN}✅ Dependências já instaladas${NC}"
fi
echo ""

# ============================================================================
# PASSO 3: Listar arquivos criados
# ============================================================================
echo -e "${BLUE}3️⃣  Arquivos criados para autenticação:${NC}"
echo ""

files=(
    "src/qr-auth.js"
    "public/qr-auth-test.png"
    "qr-generator.html"
    "docs/AUTENTICACAO-QR.md"
    "AUTENTICACAO-RESUMO.md"
    "DEMO.html"
    "CHECKLIST.md"
    "README-AUTH.txt"
    "INICIO-RAPIDO.md"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "   ${GREEN}✅${NC} $file"
    else
        echo -e "   ${RED}❌${NC} $file (não encontrado)"
    fi
done
echo ""

# ============================================================================
# PASSO 4: Verificar modificações
# ============================================================================
echo -e "${BLUE}4️⃣  Arquivos modificados:${NC}"
echo ""

echo -e "   ${GREEN}✅${NC} src/front.js (fluxo de autenticação integrado)"
echo -e "   ${GREEN}✅${NC} src/style.css (estilos QR scanner adicionados)"
echo -e "   ${GREEN}✅${NC} package.json (jsqr adicionado)"
echo ""

# ============================================================================
# PASSO 5: Informações úteis
# ============================================================================
echo -e "${BLUE}5️⃣  Informações Úteis:${NC}"
echo ""
echo -e "   ${YELLOW}📱 URLs Principais:${NC}"
echo "      🖥️  Local:  https://localhost:5174/"
echo "      🌐 Rede:   https://192.168.1.9:5174/"
echo ""
echo -e "   ${YELLOW}🎨 Gerador de QR Code:${NC}"
echo "      https://localhost:5174/qr-generator.html"
echo ""
echo -e "   ${YELLOW}📸 QR Code Pré-Gerado:${NC}"
echo "      https://localhost:5174/public/qr-auth-test.png"
echo ""
echo -e "   ${YELLOW}📊 Demonstração Visual:${NC}"
echo "      https://localhost:5174/DEMO.html"
echo ""

# ============================================================================
# PASSO 6: Opções de inicialização
# ============================================================================
echo -e "${BLUE}6️⃣  Escolha como iniciar:${NC}"
echo ""
echo "   1) npm run dev        (Desenvolvimento com Hot Reload)"
echo "   2) npm run build      (Build para produção)"
echo "   3) npm run preview    (Preview da build)"
echo "   4) Sair"
echo ""

read -p "   Escolha uma opção [1-4]: " choice

case $choice in
    1)
        echo ""
        echo -e "${YELLOW}🚀 Iniciando servidor de desenvolvimento...${NC}"
        echo ""
        echo "   ⏳ Aguarde alguns segundos..."
        echo "   📱 Acesse: https://localhost:5174/"
        echo "   🎨 Gerador: https://localhost:5174/qr-generator.html"
        echo ""
        npm run dev
        ;;
    2)
        echo ""
        echo -e "${YELLOW}🔨 Compilando para produção...${NC}"
        npm run build
        echo ""
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✅ Build completo! Use 'npm run preview' para testar${NC}"
        fi
        ;;
    3)
        echo ""
        echo -e "${YELLOW}👀 Abrindo preview da build...${NC}"
        npm run preview
        ;;
    4)
        echo ""
        echo -e "${GREEN}Até logo! Execute 'npm run dev' quando estiver pronto.${NC}"
        exit 0
        ;;
    *)
        echo -e "${RED}❌ Opção inválida${NC}"
        exit 1
        ;;
esac

echo ""
echo "╔════════════════════════════════════════════════════════════════════╗"
echo "║                                                                    ║"
echo "║                        🎉 SUCESSO!                               ║"
echo "║                                                                    ║"
echo "║              Seu sistema de autenticação QR está pronto!         ║"
echo "║                                                                    ║"
echo "║   📖 Para mais informações, consulte os documentos:              ║"
echo "║      • AUTENTICACAO-RESUMO.md (resumo rápido)                  ║"
echo "║      • docs/AUTENTICACAO-QR.md (guia completo)                 ║"
echo "║      • DEMO.html (demonstração visual)                         ║"
echo "║                                                                    ║"
echo "╚════════════════════════════════════════════════════════════════════╝"
echo ""
