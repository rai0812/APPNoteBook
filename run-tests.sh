#!/bin/bash
# 🧪 Script de Execução dos Testes
# Sistema de Recuperação de Senha - NoteBook App

echo "╔════════════════════════════════════════════════════╗"
echo "║   TESTES: Sistema de Recuperação de Senha         ║"
echo "║   NoteBook App - Playwright + Detox              ║"
echo "╚════════════════════════════════════════════════════╝"
echo ""

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Step 1: Instalando dependências...${NC}"
npm install --save-dev @playwright/test detox detox-cli
echo -e "${GREEN}✓ Dependências instaladas${NC}"
echo ""

echo -e "${YELLOW}Step 2: Iniciando backend...${NC}"
echo "Opção 1: npm run dev"
echo "Opção 2: json-server -w backend/db.json --port 3001"
echo ""
echo -e "${BLUE}[Abra outro terminal e execute um dos comandos acima]${NC}"
echo -e "${BLUE}[Depois volte aqui e continue...]${NC}"
read -p "Pressione ENTER quando o backend estiver rodando..."
echo ""

echo -e "${YELLOW}Step 3: Executando Testes de API...${NC}"
npx playwright test test/api --verbose
echo ""

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Testes de API completados com sucesso!${NC}"
else
    echo -e "${RED}✗ Alguns testes falharam${NC}"
    read -p "Pressione ENTER para ver o relatório..."
fi

echo ""
echo -e "${YELLOW}Step 4: Abrindo relatório...${NC}"
npx playwright show-report
echo ""

echo -e "${GREEN}═══════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✓ TESTES CONCLUÍDOS!${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════${NC}"
echo ""
echo "📊 Próximas ações:"
echo "  1. Revisar relatório HTML (aberto automaticamente)"
echo "  2. Analisar resultados em test-results/results.json"
echo "  3. Para E2E: Compilar app e usar Detox"
echo "     detox test e2e/recuperacao-senha.e2e.ts --configuration ios.sim.release"
echo ""
echo "📖 Documentação:"
echo "  - COMO-EXECUTAR-TESTES.md"
echo "  - EVIDENCIAS-TESTES.md"
echo "  - README-TESTES.md"
echo ""
