# Tasks: Sistema de Recuperação de Senha (Esqueceu a Senha)

**Feature**: Sistema de Recuperação de Senha  
**Versão**: 1.0.0  
**Data**: 2026-05-18  
**Status**: Pronto para Desenvolvimento  
**Total de Tasks**: 85  
**Tempo Estimado**: 70 horas (5 fases × 2 semanas)

---

## 📊 Dependency Graph

```
Phase 0: Backend Foundation
    ↓ (T001-T010 completadas)
Phase 1: Frontend - Solicitação de Reset (US1)
    ↓ (T011-T030 completadas)
Phase 2: Frontend - Redefinição de Senha (US2)
    ↓ (T031-T050 completadas)
Phase 3: Security & Validation (Cross-Cutting)
    ↓ (T051-T065 completadas)
Phase 4: Testing & QA (Cross-Cutting)
    ↓ (T066-T090 completadas)
✅ Feature Completa
```

### Dependências Críticas (Hard Blocks)
1. T001 (Express setup) → T021 (endpoints funcionam)
2. T004 (db.json schema) → T025 (token armazenado)
3. T011 (EsqueceuSenhaScreen) → T015 (integração API)
4. T031 (ResetarSenhaScreen) → T035 (integração API)

### Tarefas Paraleles (por fase)
- **Phase 0**: T005-T007 (utils paralelos), T008-T010 (middleware paralelo)
- **Phase 1**: T012-T014 (Frontend forms), T022-T024 (Backend utils)
- **Phase 2**: T033-T035 (Frontend), T041-T045 (Backend)
- **Phase 3**: T051-T055 (Rate limit + Token expiry), T056-T060 (Validação)
- **Phase 4**: T070-T075 (Backend tests), T076-T080 (Frontend tests), T081-T085 (E2E)

---

## 🏗️ PHASE 0: Backend Foundation (16h / 2 dias)

### Objetivo: Infraestrutura Backend Pronta
Configurar Express, banco de dados, middlewares e utilitários necessários para todas as fases subsequentes.

### Critério de Sucesso:
- ✅ `backend/server.js` responde em `http://localhost:3001`
- ✅ `db.json` tem schema para usuários + tokens
- ✅ Middlewares de erro estruturado funcionam
- ✅ Ambiente (.env) configurado
- ✅ Utils de token + email + rate limiter implementados

### Tasks

- [ ] T001 Setup Express server com configuração BASE em backend/server.js
- [ ] T002 Instalar dependências backend (express, dotenv, uuid, nodemailer) via npm install
- [ ] T003 Criar arquivo backend/.env com variáveis: PORT, NODE_ENV, EMAIL_SERVICE, TOKEN_EXPIRY_MINUTES
- [ ] T004 Atualizar db.json com schema: { users: [{ id, email, password, senhaAnterior }], passwordResetTokens: [] }
- [ ] T005 [P] Criar backend/utils/tokenGenerator.ts com funções: gerarToken(), validarToken()
- [ ] T006 [P] Criar backend/utils/emailService.ts com função: enviarEmailResetSenha(email, token)
- [ ] T007 [P] Criar backend/utils/validacaoSenha.ts com função: validarForca(novaSenha, senhaAnterior)
- [ ] T008 [P] Criar backend/middleware/validacao.ts com validadores: email, token, estruturados
- [ ] T009 [P] Criar backend/middleware/erroHandler.ts para retornar erros estruturados (500, 404, 400, 429)
- [ ] T010 Criar backend/types/index.ts com interfaces: User, PasswordResetToken, ApiResponse

---

## 👤 PHASE 1: Frontend - Solicitação de Reset (US1) (12h / 1.5 dias)

### Objetivo: Fluxo de Solicitação de Reset Funcional
Usuário clica "Esqueceu a senha?", insere email, recebe link de reset por email.

### User Story 1 (US1): Solicitação de Reset
```
EVENTO: Usuário clica "Esqueceu a senha?" em LoginScreen
CONDIÇÃO: Email fornecido existe + validação de formato
AÇÃO: Sistema gera token, envia email, mostra confirmação
RESULTADO: Usuário pode clicar link em email ou digitar token manualmente
```

### Critério de Sucesso:
- ✅ EsqueceuSenhaScreen renderiza sem erros
- ✅ Validação de email (local) funciona em tempo real
- ✅ POST /api/recuperar-senha integrado
- ✅ Feedback visual (loading, sucesso, erro) implementado
- ✅ Link "Esqueceu a senha?" em LoginScreen navega corretamente
- ✅ Backend endpoint POST /api/recuperar-senha implementado
- ✅ Token gerado + armazenado em db.json
- ✅ Email enviado (mock ou real)

### Frontend Tasks (Phase 1)

- [ ] T011 [US1] Criar src/screens/EsqueceuSenhaScreen.tsx com form: email input + button "Enviar Instruções"
- [ ] T012 [P] [US1] Implementar validação local de email em EsqueceuSenhaScreen (regex RFC 5322 básico)
- [ ] T013 [P] [US1] Adicionar gerenciamento de estado (loading, sucesso, erro) em EsqueceuSenhaScreen
- [ ] T014 [P] [US1] Implementar feedback visual: spinner, mensagens de erro/sucesso em EsqueceuSenhaScreen
- [ ] T015 [US1] Integrar POST /api/recuperar-senha em src/services/recuperacaoSenha.ts
- [ ] T016 [US1] Adicionar rota EsqueceuSenhaScreen em src/AppNavigator.tsx
- [ ] T017 [US1] Adicionar link "Esqueceu a senha?" em src/screens/LoginScreen.tsx → EsqueceuSenhaScreen
- [ ] T018 [P] [US1] Implementar tratamento de erro 404 (email não existe) em recuperacaoSenha.ts
- [ ] T019 [P] [US1] Implementar tratamento de erro 429 (rate limit) em recuperacaoSenha.ts
- [ ] T020 [US1] Testar fluxo completo: email → API → confirmação visual (manual test)

### Backend Tasks (Phase 1)

- [ ] T021 Criar endpoint POST /api/recuperar-senha em backend/server.js
- [ ] T022 [P] Implementar validação de email + existência no db.json em POST /api/recuperar-senha
- [ ] T023 [P] Implementar geração de token + armazenamento em db.json (passwordResetTokens)
- [ ] T024 [P] Implementar invalidação de token anterior do usuário em POST /api/recuperar-senha
- [ ] T025 Integrar enviarEmailResetSenha() em POST /api/recuperar-senha (link: app://resetarsenha/{TOKEN})
- [ ] T026 Implementar retorno estruturado: { sucesso, mensagem, dados } em POST /api/recuperar-senha
- [ ] T027 Implementar tratamento de erro: 404 (email não existe), 429 (rate limit), 400 (validação)
- [ ] T028 Testar endpoint POST /api/recuperar-senha com Postman/curl (validar db.json)
- [ ] T029 [P] Verificar que email (mock) contém token correto
- [ ] T030 [US1] Verificar integração completa: LoginScreen → EsqueceuSenhaScreen → API → Email

---

## 🔐 PHASE 2: Frontend - Redefinição de Senha (US2) (14h / 1.75 dias)

### Objetivo: Fluxo de Reset de Senha Funcional
Usuário acessa link do email (deep linking) ou digita token manualmente, redefine senha, auto-login.

### User Story 2 (US2): Redefinição de Senha
```
EVENTO: Usuário clica link do email (app://resetarsenha/{TOKEN}) ou acessa ResetarSenhaScreen
CONDIÇÃO: Token válido (<15 min), senha atende requisitos
AÇÃO: Sistema valida token, atualiza senha, gera authToken
RESULTADO: Usuário auto-logado em HomeScreen
```

### Critério de Sucesso:
- ✅ ResetarSenhaScreen renderiza sem erros
- ✅ Deep linking funciona: app://resetarsenha/{TOKEN}
- ✅ Validação de força de senha em tempo real (8+, maiúscula, minúscula, número)
- ✅ POST /api/resetar-senha integrado + auto-login
- ✅ Backend endpoint POST /api/resetar-senha implementado
- ✅ Token validado (expiração, existência)
- ✅ Senha anterior bloqueada
- ✅ authToken retornado + armazenado (AsyncStorage)

### Frontend Tasks (Phase 2)

- [ ] T031 [US2] Criar src/screens/ResetarSenhaScreen.tsx com form: token, nova senha, confirmar senha
- [ ] T032 [P] [US2] Implementar validação de força de senha em tempo real em ResetarSenhaScreen
- [ ] T033 [P] [US2] Criar src/services/validacaoSenha.ts com função: validarForçaSenha(senha)
- [ ] T034 [P] [US2] Implementar checklist visual: 8 chars, maiúscula, minúscula, número em ResetarSenhaScreen
- [ ] T035 [US2] Integrar POST /api/resetar-senha em recuperacaoSenha.ts (nova função)
- [ ] T036 [P] [US2] Implementar gerenciamento de estado (loading, sucesso, erro) em ResetarSenhaScreen
- [ ] T037 [P] [US2] Implementar feedback visual: spinner, mensagens em ResetarSenhaScreen
- [ ] T038 [US2] Adicionar rota ResetarSenhaScreen em src/AppNavigator.tsx
- [ ] T039 [US2] Implementar deep linking: app://resetarsenha/{TOKEN} → ResetarSenhaScreen com token pré-preenchido
- [ ] T040 [P] [US2] Implementar tratamento de erro: 401 (token expirado), 400 (senha inválida)
- [ ] T041 [P] [US2] Implementar auto-login: recebe authToken, armazena AsyncStorage, navega HomeScreen
- [ ] T042 [US2] Testar fluxo completo: deep linking → validação → reset → auto-login (manual test)

### Backend Tasks (Phase 2)

- [ ] T043 Criar endpoint POST /api/resetar-senha em backend/server.js
- [ ] T044 [P] Implementar validação de token (existe, não expirado) em POST /api/resetar-senha
- [ ] T045 [P] Implementar validação de força de senha em POST /api/resetar-senha
- [ ] T046 [P] Implementar bloqueio de senha anterior em POST /api/resetar-senha (comparar hashes)
- [ ] T047 Implementar atualização de senha + senhaAnterior em db.json (POST /api/resetar-senha)
- [ ] T048 Implementar marcação de token como usado (usado: true) em db.json
- [ ] T049 Implementar geração de authToken (JWT ou UUID) em POST /api/resetar-senha
- [ ] T050 [P] Implementar retorno estruturado: { sucesso, mensagem, authToken } em POST /api/resetar-senha
- [ ] T051 [P] Implementar tratamento de erro: 401 (token inválido/expirado), 400 (senha inválida)
- [ ] T052 Testar endpoint POST /api/resetar-senha com Postman/curl (validar db.json + senha atualizada)

---

## 🔒 PHASE 3: Security & Validation (Cross-Cutting) (12h / 1.5 dias)

### Objetivo: Segurança e Validação Robustas
Rate limiting, token expiration, validação de complexidade, CORS hardening.

### Critério de Sucesso:
- ✅ Rate limiting: máx 5 requisições /hora por email
- ✅ Token expira após 15 minutos
- ✅ Senha anterior bloqueada (SHA-256 comparação)
- ✅ CORS configurado (apenas frontend app)
- ✅ Validações server-side são autoritativas
- ✅ Sem vazamento de informação em erros

### Tasks

- [ ] T053 Implementar middleware de rate limiting em backend/middleware/rateLimiter.ts
- [ ] T054 Aplicar middleware de rate limiting a POST /api/recuperar-senha (5 req/hora por email)
- [ ] T055 [P] Implementar limpeza de tokens expirados (background job ou ao consultar)
- [ ] T056 [P] Verificar que token expira após 15 minutos (expiresAt timestamp)
- [ ] T057 [P] Implementar validação server-side de força de senha (redundante com frontend)
- [ ] T058 [P] Implementar bloqueio de senha anterior (SHA-256 comparação)
- [ ] T059 Configurar CORS em backend/server.js (origin: http://localhost:19006 para Expo)
- [ ] T060 [P] Implementar sanitização de inputs (email, token, senha)
- [ ] T061 Implementar logging de tentativas de reset (auditoria básica)
- [ ] T062 Testar rate limiting: enviar >5 requisições, verificar 429
- [ ] T063 Testar token expiration: criar token, aguardar 15+ min, verificar 401
- [ ] T064 Testar bloqueio de senha anterior: usar mesma senha, verificar 400
- [ ] T065 Teste de vazamento de informação: verificar mensagens de erro genéricas

---

## 🧪 PHASE 4: Testing & QA (16h / 2 dias)

### Objetivo: Cobertura de Testes + QA Completa
Testes unitários (backend/frontend), E2E, testes de segurança.

### Teste de Independência:
- Cada teste pode rodar isoladamente
- Não há dependências de estado entre testes
- DB é resetado para cada teste (fixture)

### Critério de Sucesso:
- ✅ Cobertura unitária: >80% backend, >70% frontend
- ✅ E2E: fluxo completo (LoginScreen → EsqueceuSenhaScreen → ResetarSenhaScreen → HomeScreen)
- ✅ Testes de segurança passam (rate limit, token expiry, entrada sanitizada)
- ✅ Todos os testes passam no CI/CD (se aplicável)
- ✅ Code review realizado (constitution compliance)

### Backend Unit Tests

- [ ] T066 Criar arquivo backend/__tests__/tokenGenerator.test.ts
- [ ] T067 Implementar testes: gerarToken() cria UUID válido + timestamp
- [ ] T068 [P] Implementar testes: validarToken() valida expiração (15 min)
- [ ] T069 [P] Implementar testes: validarToken() detecta token inválido
- [ ] T070 Criar arquivo backend/__tests__/validacaoSenha.test.ts
- [ ] T071 Implementar testes: validarForça() aceita senha válida (8+, maiúscula, minúscula, número)
- [ ] T072 [P] Implementar testes: validarForça() rejeita senhas fracas
- [ ] T073 [P] Implementar testes: validarForça() rejeita senha = senhaAnterior
- [ ] T074 Criar arquivo backend/__tests__/endpoints.test.ts
- [ ] T075 Implementar testes: POST /api/recuperar-senha retorna 200 (email válido)
- [ ] T076 [P] Implementar testes: POST /api/recuperar-senha retorna 404 (email inválido)
- [ ] T077 [P] Implementar testes: POST /api/recuperar-senha retorna 429 (rate limit)
- [ ] T078 Implementar testes: POST /api/resetar-senha retorna 200 (token + senha válidos)
- [ ] T079 [P] Implementar testes: POST /api/resetar-senha retorna 401 (token expirado)
- [ ] T080 [P] Implementar testes: POST /api/resetar-senha retorna 400 (senha fraca)

### Frontend Unit Tests

- [ ] T081 Criar arquivo src/__tests__/EsqueceuSenhaScreen.test.tsx
- [ ] T082 Implementar testes: EsqueceuSenhaScreen renderiza form + button
- [ ] T083 [P] Implementar testes: validação de email funciona (válido/inválido)
- [ ] T084 [P] Implementar testes: button desabilitado até email válido
- [ ] T085 Criar arquivo src/__tests__/ResetarSenhaScreen.test.tsx
- [ ] T086 Implementar testes: ResetarSenhaScreen renderiza form + checklist
- [ ] T087 [P] Implementar testes: validação de força funciona em tempo real
- [ ] T088 [P] Implementar testes: button desabilitado até todos os requisitos passarem
- [ ] T089 Criar arquivo src/__tests__/validacaoSenha.test.ts
- [ ] T090 Implementar testes: validarForçaSenha() retorna requisitos corretos

### E2E & Integration Tests

- [ ] T091 Criar arquivo e2e/resetarSenha.e2e.ts (framework: Detox ou Playwright)
- [ ] T092 Implementar teste E2E: LoginScreen → clique "Esqueceu a senha?" → EsqueceuSenhaScreen
- [ ] T093 [P] Implementar teste E2E: inserir email válido → receber confirmação → navegar de volta
- [ ] T094 [P] Implementar teste E2E: inserir email inválido → erro → limpar campo
- [ ] T095 Implementar teste E2E: deep linking app://resetarsenha/{TOKEN} → ResetarSenhaScreen
- [ ] T096 [P] Implementar teste E2E: validação de força em tempo real → checklist atualiza
- [ ] T097 [P] Implementar teste E2E: inserir senha fraca → button desabilitado
- [ ] T098 Implementar teste E2E: inserir senha válida → clique "Redefinir" → auto-login
- [ ] T099 [P] Implementar teste E2E: token expirado → erro 401 → mensagem clara
- [ ] T100 Verificar Constitution compliance: português, TypeScript strict, serviços isolados

### Security Tests

- [ ] T101 Teste: rate limiting (5 requisições /hora por email)
- [ ] T102 [P] Teste: token expiration (15 minutos)
- [ ] T103 [P] Teste: senha anterior bloqueada (SHA-256 comparação)
- [ ] T104 [P] Teste: inputs sanitizados (SQL injection, XSS)
- [ ] T105 Teste: erros genéricos (sem vazar informação de usuário)

### Code Review & Documentation

- [ ] T106 Realizar code review: constitution compliance (português, TypeScript, padrões)
- [ ] T107 [P] Documentar API em backend/README.md (endpoints, payloads, erros)
- [ ] T108 [P] Documentar fluxo em FEATURE.md (diagramas, sequência de eventos)
- [ ] T109 Validar que todos os testes passam (100% suite)
- [ ] T110 Merge para main + deploy para staging

---

## 🚀 Parallel Execution Examples

### Dev Team Organization (2-3 devs, 5 dias)

#### Day 1-2: Phase 0 (Backend Foundation)
- **Dev A**: T001-T004 (Express + db.json + .env)
- **Dev B**: T005-T007 (Utils paralelos)
- **Dev C**: T008-T010 (Middleware + tipos)
- **Merge**: T001-T010 para main

#### Day 2-3: Phase 1 (Frontend US1)
- **Dev A**: T011-T014, T020 (Frontend EsqueceuSenhaScreen)
- **Dev B**: T015-T019 (Backend endpoint recuperar-senha)
- **Dev C**: T021-T030 (Backend utils + integração)
- **Merge**: T011-T030 para main

#### Day 3-4: Phase 2 (Frontend US2)
- **Dev A**: T031-T042 (Frontend ResetarSenhaScreen + deep linking)
- **Dev B**: T043-T052 (Backend endpoint resetar-senha)
- **Merge**: T031-T052 para main

#### Day 4-5: Phase 3-4 (Security + Tests)
- **Dev A**: T053-T065 (Security implementations)
- **Dev B**: T066-T090 (Backend + Frontend unit tests)
- **Dev C**: T091-T105 (E2E + Security tests + Code review)
- **Final**: T106-T110 (Documentation + merge)

### Scenario: Single Developer (2 semanas)
- **Week 1**: T001-T030 (Phase 0 + Phase 1)
- **Week 2**: T031-T065 (Phase 2 + Phase 3)
- **Week 3**: T066-T110 (Phase 4 + finalization)

---

## 📋 Checklist Final: Critérios de Aceitação

### Arquivos Criados (Verificar Existência)
- [ ] `backend/server.js` (Express + rotas)
- [ ] `backend/.env` (variáveis de ambiente)
- [ ] `backend/utils/tokenGenerator.ts`
- [ ] `backend/utils/emailService.ts`
- [ ] `backend/utils/validacaoSenha.ts`
- [ ] `backend/middleware/validacao.ts`
- [ ] `backend/middleware/erroHandler.ts`
- [ ] `backend/middleware/rateLimiter.ts`
- [ ] `backend/types/index.ts`
- [ ] `src/screens/EsqueceuSenhaScreen.tsx`
- [ ] `src/screens/ResetarSenhaScreen.tsx`
- [ ] `src/services/recuperacaoSenha.ts`
- [ ] `src/services/validacaoSenha.ts`
- [ ] `backend/__tests__/` (testes unitários)
- [ ] `src/__tests__/` (testes unitários frontend)
- [ ] `e2e/resetarSenha.e2e.ts` (testes E2E)

### Arquivos Modificados (Verificar Mudanças)
- [ ] `backend/db.json` (schema: passwordResetTokens, senhaAnterior)
- [ ] `src/AppNavigator.tsx` (rotas + deep linking)
- [ ] `src/screens/LoginScreen.tsx` (link "Esqueceu a senha?")
- [ ] `package.json` + `backend/package.json` (dependências)

### Funcionalidades Operacionais
- [ ] ✅ EsqueceuSenhaScreen abre ao clicar "Esqueceu a senha?"
- [ ] ✅ Validação de email funciona em tempo real
- [ ] ✅ POST /api/recuperar-senha retorna 200 + token
- [ ] ✅ Email enviado com link (mock ou real)
- [ ] ✅ ResetarSenhaScreen renderiza com token pré-preenchido (deep linking)
- [ ] ✅ Checklist de força de senha funciona em tempo real
- [ ] ✅ POST /api/resetar-senha retorna 200 + authToken
- [ ] ✅ Auto-login funciona (AsyncStorage + HomeScreen)
- [ ] ✅ Rate limiting ativo (5 req/hora)
- [ ] ✅ Token expira após 15 minutos
- [ ] ✅ Senha anterior bloqueada

### Constitution Compliance
- [ ] ✅ Português em variáveis, funções, comentários
- [ ] ✅ TypeScript strict: true (sem `any`)
- [ ] ✅ Componentes funcionais + React Hooks
- [ ] ✅ Serviços isolados (`/src/services/`, `/backend/utils/`)
- [ ] ✅ Try-catch em operações assíncronas
- [ ] ✅ Erros estruturados com mensagem clara

### Testes & QA
- [ ] ✅ Todos os testes unitários passam (backend + frontend)
- [ ] ✅ Testes E2E passam (fluxo completo)
- [ ] ✅ Testes de segurança passam (rate limit, token expiry)
- [ ] ✅ Cobertura >80% (backend), >70% (frontend)
- [ ] ✅ Code review aprovado
- [ ] ✅ Sem console.error ou warnings não-justificados

### Documentação
- [ ] ✅ `backend/README.md` com endpoints + payloads + erros
- [ ] ✅ `FEATURE.md` com diagramas + fluxo + decisões
- [ ] ✅ `constitution.md` atualizado (se necessário)

---

## 🎯 Summary por User Story

### User Story 1: Solicitação de Reset (US1)
- **Tasks**: T011-T030 (20 tasks)
- **Frontend**: 8 tasks (EsqueceuSenhaScreen + API integration)
- **Backend**: 10 tasks (endpoint + utils + integração)
- **Testes**: 2 tasks (E2E básico)
- **Duração**: 12h / 1.5 dias
- **Paralelos**: T012-T014 (validação), T022-T024 (backend utils)

### User Story 2: Redefinição de Senha (US2)
- **Tasks**: T031-T052 (22 tasks)
- **Frontend**: 12 tasks (ResetarSenhaScreen + deep linking + auto-login)
- **Backend**: 10 tasks (endpoint + validação + authToken)
- **Duração**: 14h / 1.75 dias
- **Paralelos**: T032-T034 (validação força), T044-T046 (backend validação)

### Cross-Cutting: Security & Validation
- **Tasks**: T053-T065 (13 tasks)
- **Duração**: 12h / 1.5 dias
- **Paralelos**: T055-T058 (token + validação), T060-T064 (sanitização + logging)

### Cross-Cutting: Testing & QA
- **Tasks**: T066-T110 (45 tasks)
- **Unit Tests**: 25 tasks
- **E2E Tests**: 15 tasks
- **Security Tests**: 5 tasks
- **Duração**: 16h / 2 dias
- **Paralelos**: T066-T080 (unit tests), T091-T099 (E2E)

### Total
- **Tasks**: 110 (T001-T110)
- **Duração**: 70 horas (5 fases)
- **Paralelos**: 35+ oportunidades de paralelização
- **Equipe Recomendada**: 2-3 devs (5 dias) ou 1 dev (2 semanas)

---

## 🏁 Próximos Passos (Post-Tasks)

1. **Deploy**: Merge para main + deploy para staging
2. **UAT**: Teste com usuários reais
3. **Hotfixes**: Correções baseadas em feedback
4. **Documentação**: Atualizar wiki/README com screenshots
5. **Monitoring**: Implementar alertas para taxa de sucesso de reset
6. **Futuro**: Integrar 2FA, recovery codes (Phase 5+)

---

**Gerado em**: 2026-05-18  
**Pronto para Desenvolvimento**: ✅ SIM  
**Última Atualização**: Tasks template v1.0.0
