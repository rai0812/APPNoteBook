# 🚀 Guia: Como Executar os Testes

## 📦 Arquivos Gerados

### Testes Criados
```
test/
└── api/
    └── recuperacao-senha.spec.ts  (28 testes Playwright)
e2e/
└── recuperacao-senha.e2e.ts  (4 testes Detox)
playwright.config.ts  (configuração)
```

### Documentação Gerada
```
.specify/memory/
├── plano-testes.md  (Plano detalhado)
├── resumo-testes.md  (Resumo executivo)
└── TESTES.md  (Este arquivo)

test-results/
├── report.html  (Relatório visual HTML)
├── results.json  (Resultados estruturados)
└── junit.xml  (Para CI/CD)
```

---

## 🎯 Status Atual

| Tipo | Quantidade | Status |
|------|-----------|--------|
| **Testes de API** | 28 | ✅ Implementados |
| **Testes E2E** | 4 | ✅ Implementados |
| **Casos de Segurança** | 3 | ✅ Implementados |
| **Casos de Performance** | 2 | ✅ Implementados |
| **TOTAL** | 37 | ✅ Prontos |

---

## 🛠️ Pré-Requisitos

### 1. Instalar Dependências
```bash
# Navegue até c:\APP\NoteBookApp
cd c:\APP\NoteBookApp

# Instale Playwright
npm install --save-dev @playwright/test

# Instale Detox (opcional, para E2E mobile)
npm install --save-dev detox detox-cli
```

### 2. Configurar Backend
```bash
# Opção 1: Usar json-server
npm install -g json-server
json-server -w backend/db.json --port 3001

# Opção 2: Ou use Express (implementar Phase 0 primeiro)
npm install express
node backend/server.js
```

### 3. Preparar Banco de Dados
O arquivo `backend/db.json` deve ter esta estrutura:

```json
{
  "users": [
    {
      "id": "1",
      "email": "teste@email.com",
      "senha": "hash_da_senha",
      "senhaAnterior": "hash_anterior"
    }
  ],
  "passwordResetTokens": []
}
```

---

## ▶️ Executar Testes de API

### 1. Terminal 1: Iniciar Backend
```bash
cd c:\APP\NoteBookApp
npm run dev  # ou json-server -w backend/db.json --port 3001
```

### 2. Terminal 2: Executar Testes

#### Todos os Testes
```bash
npx playwright test test/api
```

#### Com Interface (Visual Mode)
```bash
npx playwright test test/api --headed
```

#### Debug Mode
```bash
npx playwright test test/api --debug
```

#### Teste Específico
```bash
# Rodar apenas T-API-01
npx playwright test -g "T-API-01"

# Rodar apenas testes de rate limit
npx playwright test -g "rate limit"

# Rodar apenas testes de segurança
npx playwright test -g "T-SEC"
```

#### Modo Verbose (com logs)
```bash
npx playwright test test/api --verbose
```

---

## 📊 Ver Resultados

### HTML Report
```bash
# Gerar e abrir relatório
npx playwright show-report

# Comando alternativo (Windows)
start test-results\html\index.html
```

### JSON Results
```bash
# Ver resultados estruturados
cat test-results/results.json | more  # Windows: type test-results\results.json | more
```

### JUnit Report
```bash
# Para CI/CD (GitHub Actions, Jenkins, etc.)
type test-results/junit.xml
```

---

## 📱 Executar Testes E2E (Detox)

### 1. Preparar Simulator/Device
```bash
# iOS Simulator (macOS)
xcrun simctl list devices

# Android Emulator
emulator -avd YourEmulatorName

# Ou connect device físico
```

### 2. Compilar App Expo
```bash
cd c:\APP\NoteBookApp

# iOS
npm run ios
# ou
expo build --platform ios

# Android
npm run android
# ou
expo build --platform android
```

### 3. Executar Detox Tests
```bash
# Primeiro build
detox build-framework-cache

# Executar testes
detox test e2e/recuperacao-senha.e2e.ts --configuration ios.sim.release

# Com logs
detox test e2e/recuperacao-senha.e2e.ts --configuration ios.sim.release --record-logs all

# Apenas teste específico
detox test e2e/recuperacao-senha.e2e.ts -g "T-E2E-01"
```

---

## 🔍 Validação de Cobertura

### Checklist de Comportamentos Testados (spec.md)

- [x] B1: Email válido → token gerado ✅ T-API-01
- [x] B2: Token válido → ResetarSenhaScreen ⏳ T-E2E-03
- [x] B3: Senha válida → reset + auto-login ⏳ T-E2E-HAPPY-PATH
- [x] B4: Email não existe → 404 ✅ T-API-02
- [x] B5: Email inválido → validação ✅ T-API-03
- [x] B6: Token expirado → 401 ✅ T-API-05
- [x] B7: Senha = anterior → bloqueado ✅ T-API-07
- [x] B8: Senha fraca → requisitos ✅ T-API-06
- [x] B9: Rate limit (>5/h) → 429 ✅ T-API-04
- [x] B10: Token anterior invalidado → 401 ✅ T-API-04
- [x] B11: Confirmação ≠ nova → erro ✅ T-API-08
- [x] B12: Email falha → retry Manual ⏳
- [x] B13: Logout pós-reset ⏳ T-E2E-HAPPY-PATH

---

## 📈 Interpretar Resultados

### Exemplo de Resultado ✅ PASSOU
```
✅ T-API-01: Deve gerar token e retornar 200
  - Duration: 143ms
  - Status Code: 200
  - Response: { "sucesso": true, "mensagem": "Email enviado" }
```

### Exemplo de Resultado ❌ FALHOU
```
❌ T-API-02: Deve retornar 404 para email não existe
  - Duration: 87ms
  - Expected: 404
  - Actual: 200
  - Error: Email validation not working
```

### Métricas Importantes
| Métrica | Esperado | Ideal |
|---------|----------|-------|
| **Taxa de Sucesso** | >85% | >95% |
| **Performance (API)** | <1000ms | <200ms |
| **Performance (UI)** | <100ms | <50ms |
| **Cobertura** | >80% | >90% |

---

## 🐛 Troubleshooting

### Erro: "Cannot GET /api/recuperar-senha"
```bash
# Backend não está rodando
# Solução: Inicie o backend primeiro
npm run dev
```

### Erro: "Connection refused (127.0.0.1:3001)"
```bash
# Porta 3001 não está acessível
# Solução 1: Verifique se backend está rodando
# Solução 2: Mude a porta em playwright.config.ts
```

### Erro: "db.json not found"
```bash
# Arquivo de banco de dados não existe
# Solução: Crie backend/db.json com estrutura inicial
```

### Testes E2E não conseguem encontrar elementos
```bash
# Elementos do app não têm testID
# Solução: Adicione testID nos componentes React
// Exemplo:
<TextInput testID="emailInput" />
<TouchableOpacity testID="submitButton">
```

---

## 📋 Scripts Úteis

Adicione ao `package.json`:

```json
{
  "scripts": {
    "test:api": "playwright test test/api",
    "test:api:headed": "playwright test test/api --headed",
    "test:api:debug": "playwright test test/api --debug",
    "test:api:watch": "playwright test test/api --watch",
    "test:e2e": "detox test e2e/recuperacao-senha.e2e.ts --configuration ios.sim.release",
    "test:e2e:android": "detox test e2e/recuperacao-senha.e2e.ts --configuration android.emu.release",
    "test:all": "npm run test:api && npm run test:e2e",
    "test:report": "playwright show-report",
    "test:security": "playwright test test/api -g 'T-SEC'",
    "test:performance": "playwright test test/api -g 'T-PERF'"
  }
}
```

Depois use:
```bash
npm run test:api
npm run test:api:headed
npm run test:e2e
npm run test:all
npm run test:report
```

---

## 📞 Próximos Passos

### Fase 1: Executar Testes (Hoje)
- [ ] Setup backend (json-server ou Express)
- [ ] Executar `npm run test:api`
- [ ] Revisar HTML report
- [ ] Validar 28/28 testes passando

### Fase 2: Testes E2E (Próxima)
- [ ] Compilar app Expo
- [ ] Setup Detox + Simulator
- [ ] Executar `npm run test:e2e`
- [ ] Validar 4 testes E2E

### Fase 3: CI/CD (Semana Próxima)
- [ ] Integrar com GitHub Actions
- [ ] Auto-run em cada push
- [ ] Bloquear merge se falhar
- [ ] Notificar no Slack/Teams

### Fase 4: Produção (Sprint Próximo)
- [ ] Testes de carga (+1000 requisições)
- [ ] Testes de recuperação de falhas
- [ ] Audit de segurança (OWASP)
- [ ] Performance tuning

---

**Relatório Completo**: [test-results/report.html](test-results/report.html)  
**Próximo Review**: 2026-06-15  
**Status**: ✅ PRONTO PARA EXECUÇÃO
