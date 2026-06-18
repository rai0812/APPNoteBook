#!/bin/bash
# 🔍 Diagnóstico de Conexão para Testes

echo "╔═══════════════════════════════════════════════════════════╗"
echo "║         🔍 DIAGNÓSTICO DE CONEXÃO - TESTES               ║"
echo "║         Sistema de Recuperação de Senha                  ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configurações
API_URL="${API_URL:-http://172.20.10.2:3001}"
API_HOST="172.20.10.2"
API_PORT="3001"

echo -e "${BLUE}📋 Configuração:${NC}"
echo "  API_URL: $API_URL"
echo "  Host: $API_HOST"
echo "  Porta: $API_PORT"
echo ""

# 1. Testar conectividade com ping
echo -e "${YELLOW}[1/4] Testando conectividade (ping)...${NC}"
if ping -c 1 "$API_HOST" &> /dev/null; then
    echo -e "${GREEN}✓ Host $API_HOST está acessível${NC}"
else
    echo -e "${RED}✗ Host $API_HOST NÃO está acessível${NC}"
    echo "  → Verifique se está conectado à rede WiFi correta"
    echo "  → Verifique o firewall"
fi
echo ""

# 2. Testar porta com curl
echo -e "${YELLOW}[2/4] Testando porta $API_PORT...${NC}"
if curl -s -m 2 "$API_URL" &> /dev/null; then
    echo -e "${GREEN}✓ Porta $API_PORT está respondendo${NC}"
else
    echo -e "${RED}✗ Porta $API_PORT NÃO está respondendo${NC}"
    echo "  → Verifique se json-server está rodando:"
    echo "    npx json-server --watch backend/db.json --port $API_PORT"
fi
echo ""

# 3. Testar endpoint específico
echo -e "${YELLOW}[3/4] Testando endpoint /api/recuperar-senha...${NC}"
response=$(curl -s -X POST "$API_URL/api/recuperar-senha" \
  -H "Content-Type: application/json" \
  -d '{"email":"teste@email.com"}' \
  -w "\n%{http_code}")

status_code=$(echo "$response" | tail -1)
body=$(echo "$response" | head -1)

if [ "$status_code" = "200" ] || [ "$status_code" = "404" ]; then
    echo -e "${GREEN}✓ Endpoint respondendo com status $status_code${NC}"
    echo "  Resposta: $body"
else
    echo -e "${RED}✗ Endpoint retornou status $status_code${NC}"
    echo "  Resposta: $body"
    echo "  → Verifique se backend está inicializado corretamente"
fi
echo ""

# 4. Teste de conexão via netcat (se disponível)
echo -e "${YELLOW}[4/4] Verificando se porta está aberta...${NC}"
if command -v nc &> /dev/null; then
    if nc -z -w 2 "$API_HOST" "$API_PORT" 2>/dev/null; then
        echo -e "${GREEN}✓ Porta $API_PORT está ABERTA em $API_HOST${NC}"
    else
        echo -e "${RED}✗ Porta $API_PORT está FECHADA${NC}"
    fi
else
    echo -e "${YELLOW}⚠ netcat não disponível, pulando teste${NC}"
fi
echo ""

echo "╔═══════════════════════════════════════════════════════════╗"
echo -e "${BLUE}📝 PRÓXIMOS PASSOS:${NC}"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""
echo "1️⃣  Se backend está OK:"
echo "   npx playwright test test/api/recuperacao-senha.spec.ts"
echo ""
echo "2️⃣  Se backend NÃO está rodando:"
echo "   npx json-server --watch backend/db.json --port 3001"
echo ""
echo "3️⃣  Para rodar testes com debug:"
echo "   npx playwright test test/api/recuperacao-senha.spec.ts --debug"
echo ""
echo "4️⃣  Ver relatório:"
echo "   npx playwright show-report"
echo ""
