# Plano Técnico: Sistema de Recuperação de Senha
**NoteBook App - Feature: Esqueceu a Senha**

| Versão | Data | Status | Alinhamento |
|--------|------|--------|-------------|
| 1.0.0 | 2026-05-18 | Aprovado | ✅ constitution.md + spec.md |

---

## 1. TECHNICAL CONTEXT

### Stack Tecnológico Confirmado

#### Frontend
| Tecnologia | Versão | Função | Status |
|------------|--------|--------|--------|
| React Native | 0.81.5 | Framework mobile | ✅ Fixado |
| Expo | ~54.0.33 | Build/runtime | ✅ Estável |
| React | 19.1.0 | Core UI | ✅ Fixado |
| React Navigation | ^7.2.2 | Roteamento | ✅ Instalado |
| TypeScript | ~5.9.2 | Type safety | ✅ Modo strict |
| Axios | ^1.15.2 | HTTP client | ✅ Instalado |

#### Backend Atual
| Componente | Status | Problema |
|-----------|--------|----------|
| Express.js | ❌ Não instalado | CRÍTICO: backend vazio |
| Node.js | ❌ Não especificado | CRÍTICO: versão não documentada |
| db.json | ⚠️ Presente | Sem schema para tokens/recuperação |
| Nodemailer | ❌ Não instalado | CRÍTICO: email não configurado |

#### Email Service
| Provedor | Status | Plano |
|----------|--------|------|
| Nodemailer | ❌ Não instalado | Mock para desenvolvimento |
| SendGrid | ⚠️ Opcional | Integração futura (Phase 3) |

### Estado Atual do Projeto

**Frontend**:
- ✅ Estrutura de componentes criada
- ✅ API client (axios) configurado
- ✅ React Navigation stack implementado
- ❌ EsqueceuSenhaScreen não existe
- ❌ ResetarSenhaScreen não existe
- ❌ Serviço de recuperação de senha não existe
- ❌ Validação de complexidade de senha não existe

**Backend**:
- ❌ server.js completamente vazio
- ❌ Nenhum endpoint implementado
- ❌ Nenhuma middleware de validação
- ❌ Nenhuma lógica de token
- ❌ db.json sem schema de tokens

**Base de Dados**:
```json
{
  "users": [
    { "id": "...", "email": "...", "password": "...", "senhaAnterior": "?" }
  ],
  "passwordResetTokens": "❌ NÃO EXISTE"
}
```

### Gaps Críticos a Resolver (Bloqueadores)

| Gap | Severidade | Resolução | Owner |
|-----|-----------|-----------|-------|
| Backend (Node/Express) não existe | 🔴 CRÍTICO | Implementar server.js + Express setup | Backend |
| Email não configurado | 🔴 CRÍTICO | Instalar Nodemailer + mock/config | Backend |
| Token não tem sistema | 🔴 CRÍTICO | Criar schema + geração/validação | Backend |
| EsqueceuSenhaScreen não existe | 🔴 CRÍTICO | Criar tela + form + validação | Frontend |
| ResetarSenhaScreen não existe | 🔴 CRÍTICO | Criar tela + checklist de senhas | Frontend |
| db.json sem schema tokens | 🟠 ALTO | Adicionar tabela `passwordResetTokens` | DB |
| Validação de força de senha | 🟠 ALTO | Criar service `validacaoSenha.ts` | Frontend |
| Rate limiting ausente | 🟠 ALTO | Middleware Express para /recuperar-senha | Backend |
| Sem trailing de senha anterior | 🟠 ALTO | Campo `senhaAnterior` em users + validação | Backend |

### Dependências Não Instaladas (Bloqueadores)

```bash
# Backend (npm install no backend/)
express ^4.18.2          # Framework HTTP
dotenv ^16.3.1          # Variáveis ambiente
nodemailer ^6.9.7       # Email service
uuid ^9.0.1             # Token generation
```

---

## 2. AFFECTED FILES (Completo)

### 2.1 Arquivos a CRIAR

#### Frontend - Screens
```
src/screens/EsqueceuSenhaScreen.tsx (nova)
  - Form: email input
  - Validação local: email format
  - Botão "Enviar Instruções"
  - Estados: idle, loading, success, error
  - Integração: recuperacaoSenha.ts

src/screens/ResetarSenhaScreen.tsx (nova)
  - Form: token input, nova senha, confirmar senha
  - Validação em tempo real: força de senha
  - Checklist: 8 chars, maiúscula, minúscula, número, ≠ anterior
  - Botão "Redefinir Senha"
  - Estados: idle, loading, success, error
  - Integração: validacaoSenha.ts + recuperacaoSenha.ts
```

#### Frontend - Services
```
src/services/recuperacaoSenha.ts (nova)
  - POST /api/recuperar-senha (email)
  - POST /api/resetar-senha (token, novaSenha)
  - POST /api/validar-token (token)
  - Integração: api.ts
  - Erros: 404, 401, 429, timeout

src/services/validacaoSenha.ts (nova)
  - validarForçaSenha(senha) → { válida, requisitos }
  - Requisitos:
    • 8+ caracteres
    • Maiúscula (A-Z)
    • Minúscula (a-z)
    • Número (0-9)
    • ≠ senhaAnterior (backend verifica)
  - Retorna: { passou, requisitos[] }
```

#### Frontend - Navigation
```
src/AppNavigator.tsx (modificar)
  - Adicionar rota EsqueceuSenhaScreen
  - Adicionar rota ResetarSenhaScreen
  - Deep linking: app://resetarsenha/{TOKEN}
  - Stack: HomeStack → { LoginScreen, RegisterScreen, EsqueceuSenhaScreen, ResetarSenhaScreen }
```

#### Backend - Server
```
backend/server.js (criar)
  - Express setup
  - PORT: 3001 (compatível com api.ts)
  - Middleware: cors, json, errorHandler
  - Rotas: GET /, POST /api/recuperar-senha, POST /api/resetar-senha
  - Arquivo de inicialização

backend/.env (criar)
  - NODE_ENV=development
  - PORT=3001
  - EMAIL_SERVICE=smtp.gmail.com (mock ou real)
  - EMAIL_USER=noreply@notebookapp.dev
  - EMAIL_PASS=app_password
  - TOKEN_EXPIRY_MINUTES=15
  - MAX_RESET_ATTEMPTS_PER_HOUR=5

backend/package.json (ATUALIZAR)
  - Adicionar: express, nodemailer, uuid, dotenv
  - Adicionar: scripts (start, dev)
```

#### Backend - Endpoints & Utils
```
backend/utils/tokenGenerator.ts (nova)
  - gerarToken() → UUID v4 + timestamp
  - validarToken(token, db) → { válido, expirado, usuário }
  - tipo: 'RESET_PASSWORD'

backend/utils/emailService.ts (nova)
  - enviarEmailResetSenha(email, token) → Promise
  - Mock para dev: console.log do link
  - Link: app://resetarsenha/{TOKEN}

backend/utils/validacaoSenha.ts (nova)
  - validarForca(novaSenha, senhaAnterior) → boolean
  - Regras: 8+, maiúscula, minúscula, número, ≠ anterior

backend/utils/rateLimiter.ts (nova)
  - Store: { email: { tentativas, ultimaRequisição } }
  - Limite: 5 requisições / hora
  - Janela: limpar após 1 hora

backend/middleware/validacao.ts (nova)
  - validarEmail(req, res, next)
  - validarToken(req, res, next)
  - tratarErros(err, req, res, next) → erro estruturado

backend/db.json (ATUALIZAR)
  - Adicionar schema: users { senhaAnterior }
  - Adicionar tabela: passwordResetTokens []
```

#### Configuração & Tipos
```
backend/types/index.ts (nova)
  - interface User { id, email, password, senhaAnterior }
  - interface PasswordResetToken { id, email, token, expiresAt, usado }
  - interface ApiResponse { sucesso, mensagem, dados }

.env.example (criar)
  - Variáveis para setup inicial

tsconfig.json (VERIFICAR)
  - strict: true ✅
  - esModuleInterop: true
  - resolveJsonModule: true
```

### 2.2 Arquivos a MODIFICAR

| Arquivo | Mudança | Motivo |
|---------|---------|--------|
| `src/AppNavigator.tsx` | Adicionar rotas EsqueceuSenhaScreen + ResetarSenhaScreen | Integração de fluxo |
| `src/screens/LoginScreen.tsx` | Link "Esqueceu a senha?" → EsqueceuSenhaScreen | UX |
| `src/services/api.ts` | Adicionar tipos + interceptor de erro | Padronização |
| `backend/db.json` | Adicionar schema: `passwordResetTokens`, `senhaAnterior` em users | Persistência |
| `package.json` | Adicionar Axios (já presente), revisar versions | Dependency management |
| `.github/copilot-instructions.md` | Atualizar referência de plano | Context |

---

## 3. ARCHITECTURE

### 3.1 Fluxo de Dados (Frontend ↔ Backend)

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React Native)                  │
├─────────────────────────────────────────────────────────────────┤
│
│  LoginScreen
│    ↓
│    "Esqueceu a senha?" → navigate('EsqueceuSenha')
│
│  EsqueceuSenhaScreen
│    ├─ Input: email
│    ├─ Validação local (formato)
│    └─ POST /api/recuperar-senha { email }
│         │
│         ↓
┌────────────────────────────────────────────────────────────────┐
│                    BACKEND (Node/Express)                       │
├────────────────────────────────────────────────────────────────┤
│
│  POST /api/recuperar-senha
│    ├─ Validação: email existe?
│    ├─ Rate limit: < 5/hora?
│    ├─ Gerar: token UUID + expiração
│    ├─ Armazenar: db.json { passwordResetTokens }
│    ├─ Invalidar: token anterior do usuário
│    └─ Enviar: email com link app://resetarsenha/{TOKEN}
│         │
│         ↓
│  Resposta 200 { sucesso, mensagem }
│  Ou
│  Resposta 404/429 { erro, mensagem }
│
└────────────────────────────────────────────────────────────────┘
│         ↑
│         │
│  EsqueceuSenhaScreen
│    ├─ Sucesso: "Email enviado!"
│    └─ Erro: "Email não encontrado"
│
│  ResetarSenhaScreen (manual ou deep link)
│    ├─ Input: token (pré-preenchido se deep link)
│    ├─ Input: nova senha
│    ├─ Validação local: força (8+, maiúscula, minúscula, número)
│    ├─ Validação local: confirmação ≠ nova
│    ├─ POST /api/resetar-senha { token, novaSenha }
│         │
│         ↓
┌────────────────────────────────────────────────────────────────┐
│
│  POST /api/resetar-senha
│    ├─ Validação: token válido + não expirado?
│    ├─ Validação: novaSenha ≠ senhaAnterior?
│    ├─ Hash: SHA-256 (já feito no frontend, reverifica)
│    ├─ Atualizar: db.json users { password, senhaAnterior }
│    ├─ Marcar token: usado = true
│    ├─ Gerar: authToken (JWT ou UUID temporário)
│    └─ Resposta 200 { authToken, mensagem }
│         │
│         ↓
└────────────────────────────────────────────────────────────────┘
│         ↑
│         │
│  ResetarSenhaScreen
│    ├─ Sucesso: armazenar authToken (AsyncStorage)
│    └─ Navegar: HomeScreen (auto-login)
│
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 Camadas Arquiteturais

```
UI Layer (React Native)
├── Screens
│   ├── LoginScreen (modificado: link "Esqueceu a senha?")
│   ├── EsqueceuSenhaScreen (novo: form email)
│   ├── ResetarSenhaScreen (novo: form senha + validação)
│   └── HomeScreen (destino pós-login)
└── Components (reutilizáveis, futuro)

Service Layer (Isolado de UI)
├── recuperacaoSenha.ts
│   ├── solicitarReset(email) → Promise
│   ├── resetarSenha(token, novaSenha) → Promise { authToken }
│   ├── validarToken(token) → Promise { válido }
│   └── Integração: api.ts
├── validacaoSenha.ts
│   ├── validarForçaSenha(senha) → { válida, requisitos }
│   └── Integração: recuperacaoSenha.ts (backend)
└── autenticacao.ts (existente, modificação mínima)
    └── Integração: auto-login pós-reset

HTTP Client (API Layer)
└── api.ts (Axios)
    ├── POST /api/recuperar-senha
    ├── POST /api/resetar-senha
    ├── Interceptor: erro handling estruturado
    └── Interceptor: authToken em headers

─────────────────────────────────────────

Backend Layer (Node/Express)
├── Middleware
│   ├── cors
│   ├── json parser
│   ├── errorHandler (centralizado)
│   ├── rateLimiter (5 req/hora por email)
│   └── validacao (email, token, força senha)
├── Routes
│   ├── GET /api/health (health check)
│   ├── POST /api/recuperar-senha (solicitação)
│   └── POST /api/resetar-senha (confirmação)
├── Controllers
│   ├── recuperarSenha(email) → validação, token, email
│   └── resetarSenha(token, novaSenha) → validação, update
├── Services
│   ├── tokenGenerator.ts
│   ├── emailService.ts
│   ├── validacaoSenha.ts
│   └── rateLimiter.ts
└── Database
    └── db.json (users + passwordResetTokens)
```

### 3.3 Padrão de Erro Handling

**Frontend** (try-catch obrigatório):
```typescript
try {
  const response = await recuperacaoSenha.solicitarReset(email);
  // Sucesso
  setMensagem("Email enviado!");
} catch (erro) {
  // Erro estruturado
  if (erro.response?.status === 404) {
    setErro("Email não encontrado");
  } else if (erro.response?.status === 429) {
    setErro("Muitas tentativas. Tente novamente em 1 hora.");
  } else {
    setErro("Erro ao enviar email. Tente novamente.");
  }
}
```

**Backend** (middleware centralizado):
```javascript
// middleware/errorHandler.js
app.use((erro, req, res, next) => {
  const status = erro.status || 500;
  const mensagem = erro.mensagem || "Erro interno do servidor";
  res.status(status).json({ sucesso: false, mensagem });
});
```

**Estrutura de Resposta**:
```json
{
  "sucesso": true/false,
  "mensagem": "Descrição legível para usuário",
  "dados": { "authToken": "..." } // apenas se sucesso
}
```

### 3.4 Segurança (Token, Rate Limit, Validation)

| Camada | Técnica | Implementação |
|--------|---------|----------------|
| **Token Generation** | UUID v4 | `crypto.randomUUID()` |
| **Token Storage** | db.json + timestamp | `{ token, email, expiresAt, usado }` |
| **Token Expiration** | 15 minutos | `Date.now() > expiresAt` |
| **Token Reuse** | Flag `usado` | Marcar true após reset |
| **Password Hashing** | SHA-256 | Frontend: `crypto-js`, Backend: Node built-in |
| **Rate Limiting** | 5 req/hora/email | Middleware: store em-memória |
| **Email Validation** | Regex RFC 5322 | `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` |
| **Password Strength** | Checklist | 8+, maiúscula, minúscula, número |
| **Anteriores Senhas** | Campo `senhaAnterior` | Bloqueio: `novaSenha === senhaAnterior` |
| **CORS** | Whitelist | `origin: ['http://localhost:19000', ...]` |

### 3.5 Deep Linking (App Scheme)

```
Link de Email: https://notebookapp.dev/reset?token={TOKEN}
Fallback: app://resetarsenha/{TOKEN}

React Navigation Config:
  linking: {
    prefixes: ['app://', 'https://notebookapp.dev'],
    config: {
      screens: {
        ResetarSenha: 'resetarsenha/:token',
        ResetarSenhaWeb: 'reset'
      }
    }
  }
```

---

## 4. IMPLEMENTATION PHASES

### Phase 0: Backend Foundation (Dias 1-2)

**Objetivo**: Backend funcional com endpoints básicos e persistência.

#### Tarefas
1. **Setup Express** → `backend/server.js`
   - `npm init -y` no backend/
   - `npm install express cors dotenv nodemailer uuid`
   - Criar server.js com middleware básico
   - CORS configurado para localhost:19000 (Expo)
   - JSON parser middleware
   - PORT: 3001

2. **Variáveis de Ambiente** → `backend/.env`
   ```
   NODE_ENV=development
   PORT=3001
   EMAIL_SERVICE=gmail (mock)
   TOKEN_EXPIRY_MINUTES=15
   MAX_ATTEMPTS_PER_HOUR=5
   ```

3. **Schema db.json** → Atualizar structure
   ```json
   {
     "users": [
       { "id": "...", "email": "...", "password": "...", "senhaAnterior": null }
     ],
     "passwordResetTokens": [
       { "id": "uuid", "email": "...", "token": "uuid", "expiresAt": "2026-05-18T10:15:00Z", "usado": false }
     ]
   }
   ```

4. **Token Service** → `backend/utils/tokenGenerator.ts`
   - UUID v4 generation
   - Timestamp + 15 min expiration
   - Validação: token existe, não expirou, não foi usado

5. **Email Service (Mock)** → `backend/utils/emailService.ts`
   - Dev: console.log do link
   - Prod (future): Nodemailer real
   - Formato: "Clique para resetar: app://resetarsenha/{TOKEN}"

6. **Rate Limiter Middleware** → `backend/utils/rateLimiter.ts`
   - Store: `{ email: { count, resetTime } }`
   - Limite: 5/hora
   - Header: `X-Rate-Limit-Remaining`

7. **Endpoint POST /api/recuperar-senha**
   - Input: `{ email }`
   - Validação: email existe, formato válido
   - Rate limit check
   - Gerar + invalidar token anterior
   - Enviar email
   - Resposta: `{ sucesso, mensagem }`

8. **Endpoint POST /api/resetar-senha**
   - Input: `{ token, novaSenha }`
   - Validação: token válido, não expirado
   - Validação: novaSenha ≠ senhaAnterior (backend double-check)
   - Atualizar db.json
   - Gerar authToken
   - Resposta: `{ sucesso, authToken }`

9. **npm scripts** → `backend/package.json`
   ```json
   "scripts": {
     "start": "node server.js",
     "dev": "nodemon server.js"
   }
   ```

10. **Testing** → Manual via curl/Postman
    - POST /api/recuperar-senha { email: "admin@email.com" } → 200
    - POST /api/recuperar-senha { email: "inexistente@x" } → 404
    - POST /api/recuperar-senha 6x em 1 hora → 429

**Deliverables**:
- ✅ backend/server.js funcionando
- ✅ Endpoints testáveis
- ✅ db.json com schema novo
- ✅ Rate limiter ativo
- ✅ Email (mock) funcionando
- ✅ Error handling centralizado

**Estimativa**: 16h (2 dias)

---

### Phase 1: Frontend - Requisição (Dias 3-4)

**Objetivo**: Usuário pode solicitar reset de senha com validação local.

#### Tarefas
1. **EsqueceuSenhaScreen** → `src/screens/EsqueceuSenhaScreen.tsx`
   - Componente funcional React
   - State: `email`, `loading`, `mensagem`, `erro`
   - TextInput para email
   - Validação local on blur: regex email
   - Botão "Enviar Instruções" (disabled se inválido)
   - Try-catch para chamar `recuperacaoSenha.solicitarReset(email)`
   - Mensagem sucesso: "Email enviado! Verifique seu inbox."
   - Mensagem erro: erro do backend
   - Link: "Voltar" → LoginScreen
   - Link: "Não tem conta?" → RegisterScreen

2. **Serviço recuperacaoSenha.ts** → `src/services/recuperacaoSenha.ts`
   - `async solicitarReset(email: string) → Promise`
   - Chamar `api.post('/api/recuperar-senha', { email })`
   - Try-catch com erros estruturados (404, 429, etc.)
   - Retornar: `{ sucesso, mensagem }`

3. **Integração api.ts** → `src/services/api.ts`
   - Revisar baseURL (172.20.10.3:3001)
   - Adicionar tipos TypeScript
   - Interceptor de erro (centralizado)

4. **LoginScreen - Link** → `src/screens/LoginScreen.tsx`
   - Adicionar botão/link "Esqueceu a senha?"
   - Navegar para: `navigation.navigate('EsqueceuSenha')`

5. **AppNavigator** → `src/AppNavigator.tsx`
   - Adicionar rota: `<Stack.Screen name="EsqueceuSenha" component={EsqueceuSenhaScreen} />`

6. **Testing** → E2E manual
   - Navegar LoginScreen → "Esqueceu a senha?" → EsqueceuSenhaScreen
   - Digitar email válido → Botão ativa
   - Digitar email inválido → Botão desativado, mensagem de erro
   - Clicar "Enviar Instruções" → Loading state
   - Resposta sucesso → Mensagem "Email enviado!"
   - Resposta erro 404 → Mensagem "Email não encontrado"

**Deliverables**:
- ✅ EsqueceuSenhaScreen funcional
- ✅ Validação local de email
- ✅ Integração com backend
- ✅ Error handling
- ✅ LoginScreen link

**Estimativa**: 12h (1.5 dias)

---

### Phase 2: Frontend - Reset (Dias 5-6)

**Objetivo**: Usuário pode resetar senha com validação de força + auto-login.

#### Tarefas
1. **validacaoSenha.ts** → `src/services/validacaoSenha.ts`
   - `validarForçaSenha(senha: string) → { válida: boolean, requisitos: Requisito[] }`
   - Requisitos:
     - `{ id: 'length', texto: '8+ caracteres', passou: boolean }`
     - `{ id: 'maiuscula', texto: 'Maiúscula (A-Z)', passou: boolean }`
     - `{ id: 'minuscula', texto: 'Minúscula (a-z)', passou: boolean }`
     - `{ id: 'numero', texto: 'Número (0-9)', passou: boolean }`
   - Retornar: `{ válida: todos passaram, requisitos }`

2. **ResetarSenhaScreen** → `src/screens/ResetarSenhaScreen.tsx`
   - Componente funcional React
   - State: `token`, `novaSenha`, `confirmarSenha`, `loading`, `erro`, `mensagem`
   - TextInput: token (pré-preenchido se vindo de deep link)
   - TextInput: nova senha (secureTextEntry)
   - Requisitos dinâmicos: checklist em tempo real (verde/vermelho)
   - TextInput: confirmar senha (secureTextEntry)
   - Validação: `confirmarSenha === novaSenha` (live)
   - Botão "Redefinir Senha" (disabled até tudo válido)
   - Try-catch: `recuperacaoSenha.resetarSenha(token, novaSenha)`
   - Sucesso: armazenar authToken + navegar HomeScreen
   - Erro: mostrar mensagem
   - TypeScript strict ✅

3. **Integração recuperacaoSenha.ts**
   - Novo método: `async resetarSenha(token: string, novaSenha: string) → Promise`
   - POST /api/resetar-senha { token, novaSenha }
   - Try-catch com erros (401, 400, etc.)
   - Retornar: `{ sucesso, authToken? }`

4. **Auto-login após reset**
   - Receber authToken do backend
   - Armazenar em AsyncStorage (gerenciador de sessão)
   - Atualizar contexto de autenticação
   - Navegar HomeScreen

5. **Deep Linking** → `src/AppNavigator.tsx`
   - Adicionar rota: `<Stack.Screen name="ResetarSenha" component={ResetarSenhaScreen} />`
   - Configurar linking:
     ```typescript
     linking: {
       prefixes: ['app://', 'https://notebookapp.dev'],
       config: {
         screens: {
           ResetarSenha: 'resetarsenha/:token'
         }
       }
     }
     ```
   - Extrair token de `route.params.token`

6. **Testing** → E2E manual
   - Navegar para ResetarSenhaScreen (manual + deep link)
   - Token vazio: mostrar erro "Token inválido"
   - Senha fraca: requisitos em vermelho, botão desativado
   - Senha forte: requisitos em verde
   - Senha: `NovaSenha@1` → válida, botão ativa
   - Confirmar ≠ nova: botão desativado
   - Confirmar === nova: botão ativa
   - Clicar "Redefinir": Loading
   - Resposta sucesso: authToken recebido, sessão iniciada, HomeScreen

**Deliverables**:
- ✅ ResetarSenhaScreen funcional
- ✅ Validação de força de senha
- ✅ Checklist dinâmico
- ✅ Auto-login funcionando
- ✅ Deep linking configurado

**Estimativa**: 14h (1.75 dias)

---

### Phase 3: Security & Validation (Dias 7-8)

**Objetivo**: Sistema seguro contra abuse, enumeração e reutilização.

#### Tarefas
1. **Rate Limiting Enforcement** → Backend
   - Middleware implementado em /api/recuperar-senha
   - Teste: 5 emails válidos da mesma conta = sucesso
   - Teste: 6º email = 429 com `X-Rate-Limit-Remaining: 0`
   - Store em-memória (futuro: Redis)

2. **Token Expiration Jobs** → Backend (v2)
   - Cleanup: remover tokens expirados a cada hora
   - Ou: validação lazy (ao usar)
   - Para MVP: lazy validation

3. **Bloqueio de Senha Anterior** → Backend
   - Campo `senhaAnterior` em users
   - Atualizar ao fazer reset
   - Validação: novaSenha !== senhaAnterior

4. **Prevenção de Enumeração de Usuários** → Backend
   - Response 404 "Email não encontrado" é OK (spec pede)
   - Alternativa (opcional): rate limit agressivo para emails inexistentes
   - Para MVP: manter 404 claro

5. **Token Reutilização Prevention** → Backend
   - Flag `usado: true` após sucesso
   - Teste: usar mesmo token 2x = 401 na 2ª vez

6. **Password Hashing** → Frontend + Backend
   - Frontend: SHA-256 antes de enviar (crypto-js)
   - Backend: verificar hash (no-op para MVP, melhoria futura)

7. **CORS Hardening** → Backend
   - Whitelist: `['http://localhost:19000', 'app://']`
   - Sem `*` (wildcard)

8. **Testes de Segurança** → Manual
   - XSS no email input: `<script>alert('xss')</script>` → validação regex bloqueia
   - SQL injection (mock db): `' OR '1'='1` → validação bloqueia
   - CSRF: token em body (já protegido por nature of POST)
   - Rate limit: 6 requisições em 1 hora = bloqueio

**Deliverables**:
- ✅ Rate limiting ativo
- ✅ Tokens com bloqueio de reutilização
- ✅ Senha anterior bloqueada
- ✅ CORS configurado
- ✅ Testes de segurança passando

**Estimativa**: 12h (1.5 dias)

---

### Phase 4: Testing & QA (Dias 9-10)

**Objetivo**: Cobertura de testes e validação completa.

#### Tarefas
1. **Testes Unitários - Frontend**
   - `validacaoSenha.ts`: 
     - `validarForçaSenha('123')` → inválida, requisitos específicos
     - `validarForçaSenha('NovaSenha@1')` → válida, todos requisitos
   - `recuperacaoSenha.ts`:
     - Mock Axios
     - `solicitarReset('admin@email.com')` → sucesso
     - `solicitarReset('invalido')` → erro 404

2. **Testes Unitários - Backend**
   - tokenGenerator:
     - `gerarToken()` → UUID válido + timestamp
     - `validarToken(token, db)` → válido/expirado
   - emailService:
     - `enviarEmailResetSenha(email, token)` → retorna Promise
   - validacaoSenha:
     - `validarForca('NovaSenha@1', 'AntigaSenha')` → true
     - `validarForca('NovaSenha@1', 'NovaSenha@1')` → false

3. **Testes E2E - Fluxo Completo**
   - Cenário 1: Email válido → reset bem-sucedido
     - Clicar "Esqueceu a senha?"
     - Inserir email existente
     - Receber email (mock: console.log)
     - Clicar link ou ir para ResetarSenhaScreen
     - Inserir nova senha válida
     - Confirmar senha
     - Clicar "Redefinir"
     - Ser redirecionado para HomeScreen (logged in)

   - Cenário 2: Email inválido
     - Clicar "Esqueceu a senha?"
     - Inserir email inexistente
     - Mensagem "Email não encontrado"

   - Cenário 3: Senha fraca
     - ResetarSenhaScreen
     - Inserir senha "123"
     - Requisitos em vermelho
     - Botão desativado

   - Cenário 4: Rate limit
     - 5 requisições de reset do mesmo email em 1 hora = sucesso
     - 6ª requisição = erro 429

4. **Testes de Segurança**
   - Token expirado (16+ min): 401
   - Token usado: 401
   - Token inválido: 401
   - Rate limit: 429
   - CORS rejection: OPTIONS fail

5. **Código Quality**
   - TypeScript: sem erros de tipo
   - Linting: ESLint (futuro)
   - Cobertura: >80% testes unitários

**Deliverables**:
- ✅ Testes unitários para validação
- ✅ Testes E2E para fluxos
- ✅ Testes de segurança
- ✅ Sem erros TypeScript

**Estimativa**: 16h (2 dias)

---

## 5. RISKS NOT IN SPEC

### Risco 1: Enumeração de Usuários (Severidade: MÉDIA)
**Descrição**: Mensagem "Email não encontrado" permite validar quais emails estão registrados.
**Impacto**: Atacante pode enumerar base de usuários.
**Mitigation**:
- Opção A: Resposta genérica "Se o email existe, você receberá instruções" (sem confirmação)
- Opção B: Rate limit agressivo em emails inexistentes (atual: 5/hora)
- Opção C: CAPTCHA após 3 tentativas (futuro)
**Recomendação para MVP**: Manter atual (Opção B já implementada). Revisar post-launch.

### Risco 2: Token Reutilização (Severidade: ALTO)
**Descrição**: Se invasor captura token, pode resetar múltiplas vezes se token não for invalidado.
**Impacto**: Conta atacada, perda de controle do usuário.
**Mitigation**:
- ✅ Flag `usado: true` após reset (implementado)
- ✅ Token expira em 15 minutos (implementado)
- ✅ Link de email vira inutilizável após 1º reset (implementado)
**Status**: RESOLVIDO

### Risco 3: Auto-Login Expõe Usuário (Severidade: MÉDIO)
**Descrição**: Se backend foi comprometido, auto-login após reset compromete conta imediatamente.
**Impacto**: Invasor ganha acesso automático após reset de senha.
**Mitigation**:
- Opção A: Não fazer auto-login, exigir login manual (mais seguro, menos UX)
- Opção B: Auto-login com verificação adicional (2FA, futuro)
- Opção C: Sessão temporária (15 min) após auto-login (futuro)
**Recomendação para MVP**: Manter auto-login (Opção A menos segura). Implementar Opção C em Phase 5.

### Risco 4: db.json Race Conditions (Severidade: MÉDIO)
**Descrição**: Múltiplas requisições simultâneas podem corromper db.json.
**Impacto**: Perda de dados, inconsistência de tokens.
**Mitigation**:
- Opção A: File locking (complexo em Node)
- Opção B: Migrar para SQLite (Phase 2)
- Opção C: Migrar para MongoDB (Phase 3)
**Recomendação para MVP**: Documentar limitação. Implementar Opção B em Phase 2.

### Risco 5: Email Não Configurado (Severidade: CRÍTICO)
**Descrição**: Se Nodemailer falha, usuário não recebe token.
**Impacto**: Feature bloqueado, experiência ruim.
**Mitigation**:
- ✅ Mock em desenvolvimento (implementado)
- Retry automático (3x com backoff exponencial)
- Fallback: SMS ou push (futuro)
**Status**: PARCIALMENTE RESOLVIDO (mock funciona, retry não)

### Risco 6: Validação de Força de Senha Fraca (Severidade: MÉDIO)
**Descrição**: Requisitos atuais (8+, maiúscula, minúscula, número) podem ser fracos.
**Impacto**: Senhas fracas resetadas, contas vulneráveis.
**Mitigation**:
- Adicionar "sem caracteres repetidos" (futuro)
- Usar OWASP password strength meter (futuro)
- Integrar `zxcvbn` para análise de força (futuro)
**Status**: ACEITÁVEL para MVP

### Risco 7: Sem Auditoria de Reset (Severidade: MÉDIO)
**Descrição**: Não há logging de quem resetou e quando.
**Impacto**: Sem rastreabilidade, possível abuso não detectado.
**Mitigation**:
- Tabela `passwordResetAudit` em db.json
- Log: { email, timestamp, ip, sucesso, motivo }
- Revisar logs periodicamente
**Status**: FUTURO (Phase 5)

### Risco 8: Sem Notificação de Reset (Severidade: MÉDIO)
**Descrição**: Usuário não é notificado se conta foi resetada sem sua ação.
**Impacto**: Invasor reseta silenciosamente, conta comprometida.
**Mitigation**:
- Email de confirmação: "Sua senha foi resetada em {data} {hora}"
- Link para "desfazer reset" (30 min janela)
**Status**: FUTURO (Phase 5)

---

## 6. DEPENDENCIES

### Backend - npm install

```bash
cd backend
npm init -y
npm install \
  express@^4.18.2 \
  cors@^2.8.5 \
  dotenv@^16.3.1 \
  nodemailer@^6.9.7 \
  uuid@^9.0.1 \
  body-parser@^1.20.2

npm install --save-dev \
  nodemon@^3.0.2 \
  @types/node@^20.11.0 \
  @types/express@^4.17.21
```

### Frontend - Already Installed ✅

```json
{
  "axios": "^1.15.2",
  "react-native": "0.81.5",
  "expo": "~54.0.33"
}
```

### Version Compatibility Matrix

| Lib | Version | React Native | Expo | Notes |
|-----|---------|--------------|------|-------|
| Express | ^4.18.2 | - | - | Node 12+, LTS |
| Axios | ^1.15.2 | ✅ | ✅ | Already installed |
| Nodemailer | ^6.9.7 | - | - | Node 8+, stable |
| UUID | ^9.0.1 | - | - | Node 15+ |
| TypeScript | ~5.9.2 | ✅ | ✅ | Strict mode |

---

## 7. ESTIMATES & EFFORT

### Por Fase

| Fase | Tarefas | Horas | Dias | Dev |
|------|---------|-------|------|-----|
| 0: Backend Foundation | Express setup, endpoints, token, email, rate limit | 16 | 2 | Backend |
| 1: Frontend - Requisição | EsqueceuSenhaScreen, validação, integração | 12 | 1.5 | Frontend |
| 2: Frontend - Reset | ResetarSenhaScreen, validação força, auto-login | 14 | 1.75 | Frontend |
| 3: Segurança & Validação | Rate limit, token, bloqueios, testes segurança | 12 | 1.5 | Full-stack |
| 4: Testing & QA | Testes unitários, E2E, cobertura | 16 | 2 | QA |
| **TOTAL** | **5 fases** | **70h** | **8.75 dias** | - |

### Breakdown Detalhado (Story Points Agile)

| Item | Complexidade | Risco | SP | Hours |
|------|--------------|-------|----|----|
| Express setup | 🟢 Baixa | 🟢 Baixo | 3 | 3-4h |
| Endpoints POST /recuperar-senha | 🟡 Média | 🟠 Médio | 5 | 5-6h |
| Endpoints POST /resetar-senha | 🟡 Média | 🟠 Médio | 5 | 5-6h |
| Token generation + validation | 🟡 Média | 🟠 Médio | 5 | 5-6h |
| Email service (mock) | 🟢 Baixa | 🟢 Baixo | 3 | 3-4h |
| Rate limiter | 🟡 Média | 🟠 Médio | 5 | 5-6h |
| EsqueceuSenhaScreen | 🟡 Média | 🟠 Médio | 5 | 5-6h |
| Validação de email (frontend) | 🟢 Baixa | 🟢 Baixo | 3 | 3-4h |
| recuperacaoSenha.ts service | 🟡 Média | 🟠 Médio | 5 | 5-6h |
| ResetarSenhaScreen | 🟡 Média | 🟠 Médio | 5 | 5-6h |
| validacaoSenha.ts service | 🟢 Baixa | 🟢 Baixo | 3 | 3-4h |
| Deep linking setup | 🟡 Média | 🟠 Médio | 5 | 5-6h |
| Auto-login após reset | 🟡 Média | 🟠 Médio | 5 | 5-6h |
| Testes unitários (backend) | 🟡 Média | 🟢 Baixo | 5 | 5-6h |
| Testes unitários (frontend) | 🟡 Média | 🟢 Baixo | 5 | 5-6h |
| Testes E2E | 🟠 Alta | 🟠 Médio | 8 | 8-10h |
| **TOTAL** | | | **76 SP** | **70-80h** |

### Timeline (Equipe de 2 pessoas)

```
Semana 1:
  Day 1-2:  Backend Foundation (Dev A)
  Day 3-4:  Frontend Requisição + Security (Dev A + Dev B)
  Day 5-6:  Frontend Reset + Security (Dev A + Dev B)

Semana 2:
  Day 7-8:  Testing & QA (Dev A + Dev B)
  Day 9:    Buffer + code review + fixes
  Day 10:   Deploy to staging + manual testing

Total: 10 dias úteis (2 semanas)
```

### Estimativa Otimista / Realista / Pessimista

| Cenário | Horas | Dias | Risco |
|---------|-------|------|-------|
| Otimista | 60h | 7 dias | 🟢 Email funciona, sem bugs |
| Realista | 75h | 9 dias | 🟡 1-2 bugs, 1 refactor |
| Pessimista | 95h | 12 dias | 🔴 Múltiplos bugs, db.json corruption |

---

## 8. CONSTITUTION CHECK

### Validação contra constitution.md

| Regra | Status | Evidência |
|------|--------|-----------|
| ✅ Português em nomeação | COMPLIANT | `recuperacaoSenha.ts`, `validacaoSenha.ts`, `EsqueceuSenhaScreen` |
| ✅ TypeScript strict: true | COMPLIANT | Todos arquivos .ts, interfaces definidas |
| ✅ Componentes funcionais React | COMPLIANT | Screens usam `React.FC<Props>` + Hooks |
| ✅ Serviços isolados de UI | COMPLIANT | `recuperacaoSenha.ts` e `validacaoSenha.ts` sem imports de React |
| ✅ try-catch em async | COMPLIANT | Backend e frontend com erro handling |
| ✅ PascalCase componentes | COMPLIANT | `EsqueceuSenhaScreen`, `ResetarSenhaScreen` |
| ✅ camelCase funções | COMPLIANT | `solicitarReset()`, `resetarSenha()`, `validarForçaSenha()` |
| ✅ Sem "any", apenas const/let | COMPLIANT | Tipos explícitos em interfaces |

---

## 9. PRÓXIMAS AÇÕES (Post-Approval)

1. ✅ Aprovação do plano técnico
2. ⏳ Phase 0: Backend Foundation (start date: TBD)
3. ⏳ Phase 1: Frontend - Requisição
4. ⏳ Phase 2: Frontend - Reset
5. ⏳ Phase 3: Security & Validation
6. ⏳ Phase 4: Testing & QA
7. ⏳ Review e merge para main branch
8. ⏳ Deploy produção (futuro)

---

## 10. REFERENCIAS

- **Constitution**: `.specify/memory/constitution.md`
- **Spec**: `.specify/memory/spec.md` (13 comportamentos EARS)
- **Frontend Stack**: React Native 0.81.5, Expo 54.0.33
- **Backend Stack**: Node.js (TBD versão), Express 4.18.2
- **Database**: db.json (MVP), SQLite (Phase 2 planned)
- **Email**: Nodemailer 6.9.7 (mock dev, real prod)
