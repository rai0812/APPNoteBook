# Sistema de Recuperação de Senha (Esqueceu a Senha)

**Versão**: 1.0.0  
**Data**: 2026-05-18  
**Status**: Pronto para Desenvolvimento  
**Integração**: constitution.md (Padrões de Nomeação, TypeScript Rigoroso, Serviços Isolados)

---

## 📋 Resumo Executivo

O Sistema de Recuperação de Senha permite que usuários que esqueceram suas credenciais recuperem acesso à aplicação através de um fluxo seguro baseado em email. O sistema envia um token válido por 15 minutos, com validação de identidade simples (verificação de existência do email) e auto-login após sucesso do reset.

**Escopo**:
- Fluxo de solicitação de reset (acesso a EsqueceuSenhaScreen)
- Validação de email e geração de token
- Envio de token por email
- Fluxo de reset de senha (ResetarSenhaScreen)
- Validação de complexidade e restrições
- Auto-login pós-reset

**Fora do Escopo**:
- Autenticação multi-fator (2FA/SMS)
- Recovery codes ou backup codes
- Alteração de senha pós-autenticado (diferente feature)
- Integração com provedores OAuth

---

## 🎬 Comportamentos (Padrão EARS)

### **B1: Usuário Solicita Reset - Email Válido e Existe**

```
EVENTO (When):
  Usuário clica em "Esqueceu a senha?" na LoginScreen

CONDIÇÃO (Given):
  - Aplicação está na LoginScreen
  - Email fornecido existe no banco de dados (db.json)
  - Email tem formato válido (RFC 5322 básico)
  - Nenhuma solicitação anterior válida do mesmo email está ativa

AÇÃO/RESPOSTA (Then):
  ENTÃO:
    ✓ Sistema gera token aleatório (UUID v4 ou hash SHA-256)
    ✓ Token é armazenado em db.json com timestamp (válido por 15 min)
    ✓ Token anterior do mesmo usuário é invalidado imediatamente
    ✓ Email é enviado com link contendo token: 
      "Clique para resetar: app://resetarsenha/{TOKEN}"
    ✓ Tela muda para EsqueceuSenhaScreen
    ✓ Mensagem de sucesso: "Email enviado com instruções. Verifique seu inbox."
    ✓ Link para voltar à LoginScreen disponível

CRITÉRIO DE ACEITAÇÃO:
  - Token armazenado com exatidão em db.json
  - Email enviado contém token correto
  - Token anterior é destruído
  - Interface mostra confirmação clara
  - Usuário pode voltar à LoginScreen ou navegar para ResetarSenhaScreen
```

---

### **B2: Usuário Acessa ResetarSenhaScreen com Token Válido**

```
EVENTO (When):
  Usuário clica no link do email (app://resetarsenha/{TOKEN})
  OU Usuário digita manualmente token na ResetarSenhaScreen

CONDIÇÃO (Given):
  - Token existe em db.json
  - Token não expirou (< 15 minutos desde criação)
  - Token é do tipo 'RESET_PASSWORD'
  - Usuário não é autenticado (sessão não ativa)

AÇÃO/RESPOSTA (Then):
  ENTÃO:
    ✓ Aplicação navega para ResetarSenhaScreen
    ✓ Campo de token é pré-preenchido (se veio de link)
    ✓ Campos "Nova Senha" e "Confirmar Senha" aparecem vazios
    ✓ Validação em tempo real mostra requisitos:
      • Mínimo 8 caracteres
      • Contém letra maiúscula (A-Z)
      • Contém letra minúscula (a-z)
      • Contém número (0-9)
      • Não é igual à senha anterior
    ✓ Botão "Redefinir Senha" desabilitado até validações passarem
    ✓ Nenhuma chamada HTTP é feita ainda (apenas validação local)

CRITÉRIO DE ACEITAÇÃO:
  - ResetarSenhaScreen carrega sem erros
  - Requisitos de senha são mostrados em tempo real
  - Botão permanece desabilitado enquanto senha é inválida
  - Sem requisições desnecessárias ao servidor
```

---

### **B3: Usuário Insere Senha Válida e Clica "Redefinir"**

```
EVENTO (When):
  Usuário preenche:
    - Nova Senha (válida)
    - Confirmar Senha (igual)
  E clica botão "Redefinir Senha"

CONDIÇÃO (Given):
  - Token ainda é válido (< 15 minutos)
  - Senha atende todos os requisitos
  - Senha é diferente da anterior (servidor verifica)
  - Usuário não é autenticado

AÇÃO/RESPOSTA (Then):
  ENTÃO:
    ✓ Botão muda para estado "Processando..." (desabilitado)
    ✓ Spinner de carregamento aparece
    ✓ Requisição POST enviada para backend:
      {
        "token": "{TOKEN}",
        "novaSenha": "{SENHA_HASH}" (sha-256 do frontend)
      }
    ✓ Backend:
      - Valida token (existe, não expirou)
      - Valida senha (complexidade, não é anterior)
      - Atualiza senha no db.json
      - Invalida token (marca como usado)
      - Retorna status 200 + authToken de auto-login
    ✓ Frontend recebe authToken
    ✓ Token é armazenado em AsyncStorage (sessão)
    ✓ Usuário é automaticamente redirecionado para HomeScreen
    ✓ Mensagem de sucesso: "Senha redefinida com sucesso! Bem-vindo."

CRITÉRIO DE ACEITAÇÃO:
  - Senha é atualizada em db.json
  - Token é marcado como inválido/usado
  - Usuário está autenticado pós-reset (authToken válido)
  - HomeScreen é carregada automaticamente
  - Usuário não precisa fazer login manual
```

---

### **B4: Email Não Existe no Sistema**

```
EVENTO (When):
  Usuário insere email na EsqueceuSenhaScreen
  E clica "Enviar Instruções"

CONDIÇÃO (Given):
  - Email tem formato válido
  - Email NÃO existe em db.json
  - Backend foi chamado para validação

AÇÃO/RESPOSTA (Then):
  ENTÃO:
    ✓ Resposta do servidor: 404 com mensagem "Email não encontrado"
    ✓ Frontend mostra erro explícito:
      "Este email não está registrado. Por favor, crie uma conta."
    ✓ Campo de email recebe classe de erro (borda vermelha)
    ✓ Link "Criar conta" aparece ao lado da mensagem
    ✓ NENHUM email é enviado
    ✓ NENHUM token é criado
    ✓ Usuário pode:
      - Tentar outro email
      - Clicar em "Criar conta" (navega para RegisterScreen)
      - Voltar à LoginScreen

CRITÉRIO DE ACEITAÇÃO:
  - Mensagem de erro é clara e sem jargão técnico
  - Usuário não fica em dúvida sobre próximos passos
  - Sem vazamento de informação (ex: "email não existia")
  - Nenhuma ação desnecessária no backend
```

---

### **B5: Email Inválido (Formato)**

```
EVENTO (When):
  Usuário digita email com formato incorreto na EsqueceuSenhaScreen
  E tira foco do campo (blur)

CONDIÇÃO (Given):
  - Campo de email perdeu foco
  - Email não atende regex RFC 5322 básico: /^[^\s@]+@[^\s@]+\.[^\s@]+$/

AÇÃO/RESPOSTA (Then):
  ENTÃO:
    ✓ Validação local (sem chamar servidor) detecta erro
    ✓ Campo de email recebe classe de erro (borda vermelha)
    ✓ Mensagem de erro aparece abaixo: "Email inválido"
    ✓ Botão "Enviar Instruções" permanece desabilitado
    ✓ NENHUMA requisição é enviada ao backend
    ✓ Usuário pode corrigir em tempo real

CRITÉRIO DE ACEITAÇÃO:
  - Validação é instantânea (sem delay)
  - Mensagem é clara
  - Botão não permite envio com email inválido
  - Sem requisições desnecessárias
```

---

### **B6: Token Expirou (> 15 minutos)**

```
EVENTO (When):
  Usuário tenta usar link do email após 15+ minutos
  OU Usuário digita manualmente token expirado na ResetarSenhaScreen

CONDIÇÃO (Given):
  - Token foi gerado há 15+ minutos
  - Timestamp do token em db.json confirma expiração
  - Token ainda existe em db.json (não foi usado/invalidado)

AÇÃO/RESPOSTA (Then):
  ENTÃO:
    ✓ Requisição é feita para validar token
    ✓ Backend retorna 401: "Token expirado"
    ✓ Frontend mostra aviso claro:
      "Seu link expirou. Por favor, solicite um novo reset."
    ✓ ResetarSenhaScreen é desmontada/bloqueada
    ✓ Botão "Solicitar Novo Reset" aparece
    ✓ Usuário é redirecionado para EsqueceuSenhaScreen
    ✓ Usuário pode solicitar novo token

CRITÉRIO DE ACEITAÇÃO:
  - Expiração é respeitada rigorosamente (15 min = 900 seg)
  - Mensagem não é técnica
  - Usuário conhece próxima ação
  - Token expirado não permite prosseguir
```

---

### **B7: Senha Igual à Anterior**

```
EVENTO (When):
  Usuário insere na ResetarSenhaScreen senha que é igual à anterior
  E tira foco do campo

CONDIÇÃO (Given):
  - Nova senha é digitada
  - Senha anterior do usuário está em db.json
  - Hashes (SHA-256) são idênticos

AÇÃO/RESPOSTA (Then):
  ENTÃO:
    ✓ Validação local (frontend) compara com hash anterior (se disponível)
    ✓ Se validação frontend é inconclusa: servidor valida no reset
    ✓ Se igual: resposta 400 com "Senha não pode ser igual à anterior"
    ✓ Campo de senha recebe classe de erro
    ✓ Mensagem aparece: "Escolha uma senha diferente da anterior"
    ✓ Botão "Redefinir Senha" permanece desabilitado
    ✓ Usuário pode alterar a senha

CRITÉRIO DE ACEITAÇÃO:
  - Reutilização de senha é bloqueada
  - Mensagem é clara
  - Validação é rigorosa (lado servidor é autoritária)
```

---

### **B8: Senha Não Atende Complexidade**

```
EVENTO (When):
  Usuário insere senha que não atende requisitos na ResetarSenhaScreen
  Exemplos:
    - "abc123" (sem maiúscula)
    - "ABCDEF" (sem minúscula/número)
    - "Abc1" (menos de 8 caracteres)

CONDIÇÃO (Given):
  - Nova senha é digitada
  - Senha não atende 1+ requisitos:
    • ≥ 8 caracteres
    • ≥ 1 maiúscula (A-Z)
    • ≥ 1 minúscula (a-z)
    • ≥ 1 número (0-9)

AÇÃO/RESPOSTA (Then):
  ENTÃO:
    ✓ Validação em tempo real (JavaScript no frontend)
    ✓ Requisitos não atendidos são destacados em vermelho
    ✓ Requisitos atendidos ficam em verde
    ✓ Exemplo visual:
      ✗ Mínimo 8 caracteres (vermelho)
      ✓ Contém maiúscula (verde)
      ✓ Contém minúscula (verde)
      ✗ Contém número (vermelho)
    ✓ Botão "Redefinir Senha" permanece desabilitado
    ✓ Feedback é instantâneo (sem delay)

CRITÉRIO DE ACEITAÇÃO:
  - Validação é contínua (enquanto digita)
  - Feedback visual é claro
  - Botão não permite envio com senha fraca
  - Requisitos são compreensíveis
```

---

### **B9: Taxa de Solicitações - Rate Limiting**

```
EVENTO (When):
  Usuário (ou IP) solicita > 5 resets em 1 hora
  do mesmo email OU emails diferentes

CONDIÇÃO (Given):
  - Email anterior foi solicitado há < 1 hora
  - 5+ solicitações registradas no backend (por IP ou email)

AÇÃO/RESPOSTA (Then):
  ENTÃO:
    ✓ Backend retorna 429: "Muitas solicitações. Tente novamente em X minutos"
    ✓ Frontend mostra aviso:
      "Você fez muitas solicitações. Por favor, aguarde antes de tentar novamente."
    ✓ Campo de email é desabilitado por tempo limite
    ✓ Countdown timer mostra: "Tente novamente em 15:32"
    ✓ Usuário pode voltar à LoginScreen e tentar depois
    ✓ Rate limit é registrado no backend (log/db.json)

CRITÉRIO DE ACEITAÇÃO:
  - Rate limit previne abuso
  - Mensagem é clara e fornece informação útil
  - Countdown é preciso
  - Proteção é eficaz sem ser bloqueadora
```

---

### **B10: Token Já Foi Invalidado (Nova Solicitação)**

```
EVENTO (When):
  Usuário solicita novo reset (B1)
  Então tenta usar token anterior

CONDIÇÃO (Given):
  - Token anterior foi marcado como 'INVALIDADO' em db.json
  - Novo token foi criado para solicitação anterior
  - Usuário tenta clicar no link antigo

AÇÃO/RESPOSTA (Then):
  ENTÃO:
    ✓ Backend recebe token invalidado
    ✓ Retorna 401: "Este link não é mais válido. Use o link mais recente."
    ✓ Frontend mostra mensagem:
      "Este link expirou. Você solicitou um novo reset. Verifique o email mais recente."
    ✓ Link para solicitar novo reset aparece
    ✓ Usuário é redirecionado para EsqueceuSenhaScreen

CRITÉRIO DE ACEITAÇÃO:
  - Tokens antigos não funcionam
  - Mensagem orienta para link mais recente
  - Segurança é mantida (sem múltiplos tokens ativos)
```

---

### **B11: Senhas Não Coincidem (Confirmar Senha)**

```
EVENTO (When):
  Usuário preenche:
    - Nova Senha: "Abc123def"
    - Confirmar Senha: "Abc123xyz"
  E tira foco do campo "Confirmar Senha"

CONDIÇÃO (Given):
  - Ambos os campos foram preenchidos
  - Conteúdo é diferente

AÇÃO/RESPOSTA (Then):
  ENTÃO:
    ✓ Validação local detecta discrepância
    ✓ Campo "Confirmar Senha" recebe classe de erro
    ✓ Mensagem aparece: "As senhas não conferem"
    ✓ Botão "Redefinir Senha" permanece desabilitado
    ✓ Usuário corrige e campo volta ao normal quando coincidirem

CRITÉRIO DE ACEITAÇÃO:
  - Validação é em tempo real
  - Mensagem é clara
  - Sem envio de requisição com senhas diferentes
```

---

### **B12: Falha de Envio de Email**

```
EVENTO (When):
  Sistema gera token válido (B1)
  MAS falha ao enviar email

CONDIÇÃO (Given):
  - Token foi criado em db.json
  - Serviço de email não está respondendo (timeout/erro)
  - Backend detecta falha de envio

AÇÃO/RESPOSTA (Then):
  ENTÃO:
    ✓ Backend registra erro em log/db.json
    ✓ Token é mantido válido (não é desperdiçado)
    ✓ Resposta ao frontend: 500 "Erro ao enviar email. Tente novamente."
    ✓ Frontend mostra mensagem:
      "Houve um problema ao enviar o email. Por favor, tente novamente."
    ✓ Botão "Tentar Novamente" aparece
    ✓ Usuário pode retentar (mesma lógica de rate limit se aplicável)

CRITÉRIO DE ACEITAÇÃO:
  - Erro é tratado graciosamente
  - Token não é perdido
  - Usuário pode tentar novamente
  - Sem exposição de erros técnicos
```

---

### **B13: Logout Após Reset**

```
EVENTO (When):
  Usuário é auto-logado após reset bem-sucedido (B3)
  E clica em "Sair" em qualquer tela

CONDIÇÃO (Given):
  - Sessão está ativa (authToken em AsyncStorage)
  - Usuário está autenticado

AÇÃO/RESPOSTA (Then):
  ENTÃO:
    ✓ authToken é removido de AsyncStorage
    ✓ Sessão local é limpa
    ✓ Usuário é redirecionado para LoginScreen
    ✓ Tela anterior (HomeScreen, etc) não é carregada
    ✓ Mensagem (opcional): "Você saiu com sucesso"

CRITÉRIO DE ACEITAÇÃO:
  - Logout é completo (sem tokens residuais)
  - Segurança é mantida
  - Redirecionamento é correto
```

---

## 🔄 Fluxos de Usuário

### **Fluxo 1: Reset Bem-Sucedido (Happy Path)**

```
1. Usuário na LoginScreen
   ↓ (clica "Esqueceu a senha?")
2. Navega para EsqueceuSenhaScreen
   ↓ (insere email válido)
3. Backend valida email (existe)
   ↓ (gera token, invalida anterior, envia email)
4. Frontend mostra: "Email enviado com instruções"
   ↓ (usuário clica link no email)
5. Navega para ResetarSenhaScreen com token válido
   ↓ (insere nova senha válida, clica "Redefinir")
6. Backend valida token (válido, não expirou)
   ↓ (valida senha, atualiza db.json, invalida token)
7. Frontend recebe authToken
   ↓ (armazena em AsyncStorage)
8. Usuário redirecionado para HomeScreen (autenticado)
   ✓ SUCESSO: Usuário recuperou acesso
```

---

### **Fluxo 2: Email Não Existe**

```
1. Usuário na LoginScreen
   ↓ (clica "Esqueceu a senha?")
2. Navega para EsqueceuSenhaScreen
   ↓ (insere email que não existe)
3. Backend valida email (NÃO existe)
   ↓ (retorna 404)
4. Frontend mostra: "Este email não está registrado"
   ↓ (opção para criar conta ou voltar)
5. Usuário pode:
   - Clicar "Criar conta" → RegisterScreen
   - Tentar outro email
   - Voltar à LoginScreen
```

---

### **Fluxo 3: Token Expirou**

```
1. Usuário solicita reset (token gerado)
   ↓ (20 minutos se passam)
2. Usuário clica link do email
   ↓ (token expirado)
3. Backend valida (expirado)
   ↓ (retorna 401)
4. Frontend mostra: "Seu link expirou"
   ↓ (opção para solicitar novo reset)
5. Usuário volta para EsqueceuSenhaScreen
   ↓ (solicita novo token)
6. Continua com Fluxo 1
```

---

### **Fluxo 4: Senha Fraca**

```
1. Usuário na ResetarSenhaScreen
   ↓ (insere senha "abc1")
2. Frontend valida (< 8 caracteres)
   ↓ (botão fica desabilitado)
3. Requisitos mostram:
   ✗ Mínimo 8 caracteres
4. Usuário corrige para "Abc123def"
   ↓ (tudo verde agora)
5. Botão "Redefinir Senha" fica habilitado
6. Usuário clica
   ↓ (continua com Fluxo 1)
```

---

## 🎨 Interfaces (Telas)

### **EsqueceuSenhaScreen**

**Localização**: `src/screens/EsqueceuSenhaScreen.tsx`

**Componentes**:
- Header com título: "Recuperar Senha"
- Campo de input: `emailInput` (type: email)
- Validação em tempo real (vermelho se inválido)
- Botão primário: "Enviar Instruções" (desabilitado se email inválido)
- Texto de suporte: "Insira o email associado à sua conta"
- Link "Voltar à Login" (navegação)
- Spinner durante requisição
- Mensagens de feedback:
  - Sucesso: "Email enviado com instruções. Verifique seu inbox."
  - Erro: "Email não encontrado" ou "Erro ao enviar. Tente novamente."

**Estados**:
- Vazio (inicial)
- Carregando (spinner)
- Erro (mensagem vermelha)
- Sucesso (mensagem verde)

---

### **ResetarSenhaScreen**

**Localização**: `src/screens/ResetarSenhaScreen.tsx`

**Componentes**:
- Header com título: "Redefinir Senha"
- Campo oculto `tokenInput` (pré-preenchido de link ou digitar manualmente)
- Campo de input: `novaSenhaInput` (type: password)
- Campo de input: `confirmarSenhaInput` (type: password)
- Checklist de requisitos (em tempo real):
  - ✗/✓ Mínimo 8 caracteres
  - ✗/✓ Contém maiúscula (A-Z)
  - ✗/✓ Contém minúscula (a-z)
  - ✗/✓ Contém número (0-9)
  - ✗/✓ Diferente da anterior
- Botão primário: "Redefinir Senha" (desabilitado até tudo passar)
- Spinner durante requisição
- Mensagens de feedback:
  - Sucesso: "Senha redefinida com sucesso!"
  - Erro: "Token expirou", "Senhas não conferem", etc.

**Estados**:
- Vazio (inicial)
- Preenchendo (validação contínua)
- Carregando (spinner, botão desabilitado)
- Erro (mensagem vermelha)
- Sucesso (redireção automática para HomeScreen)

---

## 📊 Estrutura de Dados

### **db.json - Usuários**

```json
{
  "usuarios": [
    {
      "id": "uuid-123",
      "email": "joao@example.com",
      "senhaHash": "sha256_hash_anterior",
      "dataCriacao": "2026-01-15T10:30:00Z",
      "dataAtualizacao": "2026-05-18T14:22:00Z"
    }
  ]
}
```

---

### **db.json - Tokens de Reset**

```json
{
  "resetTokens": [
    {
      "token": "uuid_v4_ou_sha256",
      "usuarioId": "uuid-123",
      "email": "joao@example.com",
      "dataCriacao": "2026-05-18T14:22:00Z",
      "dataExpiracao": "2026-05-18T14:37:00Z",
      "status": "VALIDO" | "USADO" | "INVALIDADO",
      "ipOrigem": "localhost",
      "userAgent": "Mozilla/5.0..."
    }
  ]
}
```

---

### **Fluxo de Requisições**

#### **POST /api/recuperar-senha** (Solicitação)

```
REQUISIÇÃO:
{
  "email": "joao@example.com"
}

RESPOSTA (200 OK - Email existe):
{
  "sucesso": true,
  "mensagem": "Email enviado com instruções para recuperar sua senha",
  "emailMascarado": "j***@example.com"
}

RESPOSTA (404 - Email não existe):
{
  "sucesso": false,
  "erro": "EMAIL_NAO_ENCONTRADO",
  "mensagem": "Este email não está registrado"
}

RESPOSTA (429 - Rate limit):
{
  "sucesso": false,
  "erro": "RATE_LIMIT",
  "mensagem": "Muitas solicitações. Tente novamente em 15 minutos",
  "tempoEspera": 900
}

RESPOSTA (500 - Erro ao enviar):
{
  "sucesso": false,
  "erro": "ERRO_ENVIO_EMAIL",
  "mensagem": "Houve um problema ao enviar o email"
}
```

---

#### **POST /api/resetar-senha** (Redefinição)

```
REQUISIÇÃO:
{
  "token": "uuid_v4_ou_sha256",
  "novaSenhaHash": "sha256(nova_senha)"
}

RESPOSTA (200 OK - Sucesso):
{
  "sucesso": true,
  "mensagem": "Senha redefinida com sucesso",
  "authToken": "jwt_token_auto_login",
  "usuario": {
    "id": "uuid-123",
    "email": "joao@example.com"
  }
}

RESPOSTA (401 - Token inválido/expirado):
{
  "sucesso": false,
  "erro": "TOKEN_INVALIDO",
  "mensagem": "Token expirado ou inválido"
}

RESPOSTA (400 - Validação falhou):
{
  "sucesso": false,
  "erro": "SENHA_INVALIDA" | "SENHA_IGUAL_ANTERIOR" | "SENHAS_NAO_CONFEREM",
  "mensagem": "Descrição específica do erro"
}
```

---

## ⚙️ Restrições e Regras

### **Restrições de Token**

| Atributo | Regra |
|----------|-------|
| **Validade** | 15 minutos (900 segundos) |
| **Formato** | UUID v4 ou SHA-256 hex |
| **Reutilização** | NÃO permitida (token anterior é invalidado) |
| **Status** | VALIDO, USADO, INVALIDADO |
| **Quantidade Ativa** | Máximo 1 por usuário |

---

### **Restrições de Senha**

| Atributo | Regra |
|----------|-------|
| **Comprimento** | Mínimo 8 caracteres |
| **Maiúscula** | ≥ 1 (A-Z) |
| **Minúscula** | ≥ 1 (a-z) |
| **Número** | ≥ 1 (0-9) |
| **Igualdade Anterior** | NÃO permitida (validação SHA-256) |
| **Caracteres Especiais** | Opcionais (não obrigatórios) |

---

### **Restrições de Rate Limiting**

| Métrica | Limite |
|---------|--------|
| **Solicitações por IP** | 5 por hora |
| **Solicitações por Email** | 5 por hora |
| **Tentativas de Token Inválido** | 3 por token antes de bloqueio |
| **Tempo de Espera Após Limite** | 15 minutos |

---

### **Restrições de Segurança**

- Email é **enviado em texto claro** (link com token visível)
  - Consideração: Token deve ter entropy suficiente (UUID v4 ou SHA-256)
  
- **IP de origem é registrado** em db.json para auditoria

- **HTTPS é obrigatório** no link do email (deep link com `app://` no mobile)

- **Token expirado não é reutilizável** (destruído após 15 min)

- **Sessão anterior é preservada** durante reset (sem logout involuntário)

---

## 🎯 Critérios de Sucesso

### **Funcionalidade**

| Critério | Métrica | Verificação |
|----------|---------|------------|
| **C1: Email enviado** | 100% das solicitações válidas | Email chega em < 2 min |
| **C2: Token válido** | Token contém entropy ≥ 128 bits | UUID v4 ou SHA-256 |
| **C3: Expiração respeitada** | 100% dos tokens expiram em 15 min | ±2 seg de tolerância |
| **C4: Auto-login funciona** | 100% dos resets bem-sucedidos | authToken válido, sessão ativa |
| **C5: Validações rejeitam inválidos** | 0 senhas fracas passam | Todos os 4 requisitos obrigatórios |
| **C6: Rate limit efetivo** | > 5 req/hora bloqueadas | 429 status retornado |

---

### **Experiência do Usuário**

| Critério | Métrica | Verificação |
|----------|---------|------------|
| **C7: Mensagens claras** | 95%+ compreensão em teste | Sem jargão técnico |
| **C8: Feedback em tempo real** | Validação sem delay (< 200ms) | Requisitos atualizam instantaneamente |
| **C9: Recuperação de erros** | Usuário consegue retentar | Links de ação clara em erros |
| **C10: Fluxo intuitivo** | < 3 cliques para reset | Redireções automáticas |

---

### **Segurança**

| Critério | Métrica | Verificação |
|----------|---------|------------|
| **C11: Tokens únicos** | 100% aleatório | Sem padrão detectável |
| **C12: IP registrado** | Auditoria completa | Log em db.json |
| **C13: Sem vazamento de dados** | 0 emails válidos/inválidos diferenciados | Mensagem neutra se email não existe |
| **C14: Token não reutilizável** | 0 resets com token anterior | Status INVALIDADO respeitado |

---

### **Performance**

| Critério | Métrica | Verificação |
|----------|---------|------------|
| **C15: Reset completo** | < 5 seg (solicitação até auto-login) | De ponta a ponta |
| **C16: Validação local** | Instantânea (< 200ms) | Sem spinner necessário |
| **C17: Email enviado** | < 2 min | De backend até inbox |

---

## 🔗 Integração com Constitution.md

**Padrões Obrigatórios Aplicados**:

1. **Português como Padrão**: 
   - Nomes de funções: `enviarEmailReset()`, `validarSenha()`, `invalidarTokenAnterior()`
   - Variáveis: `novaSenha`, `emailValido`, `tokenExpirado`
   - Comentários: Em português claro

2. **TypeScript Rigoroso**:
   ```typescript
   interface DadosReset {
     token: string;
     usuarioId: string;
     dataCriacao: Date;
     dataExpiracao: Date;
     status: 'VALIDO' | 'USADO' | 'INVALIDADO';
   }
   
   interface RequisicaoResetarSenha {
     token: string;
     novaSenhaHash: string;
   }
   ```

3. **Serviços Isolados**:
   - `src/services/recuperacaoSenha.ts` - Lógica de reset
   - `src/services/validacaoSenha.ts` - Validações de complexidade
   - `src/services/tokenReset.ts` - Gerenciamento de tokens

4. **Componentes Funcionais**:
   - `EsqueceuSenhaScreen` - Functional component com `useState`, `useEffect`
   - `ResetarSenhaScreen` - Functional component com validação em tempo real

5. **Tratamento de Erro Estruturado**:
   ```typescript
   try {
     const resultado = await api.post('/api/resetar-senha', dados);
   } catch (erro) {
     if (erro.response?.status === 401) {
       mostrarMensagem('Token expirado');
     } else {
       mostrarMensagem('Erro ao resetar. Tente novamente.');
     }
   }
   ```

---

## 📝 Referências de Implementação

**Arquivos a Criar/Modificar**:

| Arquivo | Tipo | Descrição |
|---------|------|-----------|
| `src/screens/EsqueceuSenhaScreen.tsx` | Criar | Tela de solicitação de reset |
| `src/screens/ResetarSenhaScreen.tsx` | Criar | Tela de redefinição de senha |
| `src/services/recuperacaoSenha.ts` | Criar | Serviço de lógica de reset |
| `src/services/validacaoSenha.ts` | Criar | Serviço de validação de senha |
| `src/services/tokenReset.ts` | Criar | Serviço de gerenciamento de tokens |
| `src/services/api.ts` | Modificar | Adicionar endpoints de reset |
| `AppNavigator.tsx` | Modificar | Adicionar rotas para novas telas |
| `backend/server.js` | Modificar | Adicionar endpoints POST |
| `backend/db.json` | Modificar | Adicionar estrutura de tokens |
| `LoginScreen.tsx` | Modificar | Adicionar botão "Esqueceu a senha?" |

---

## ✅ Checklist de Aceitação

- [ ] Todos os 13 comportamentos (B1-B13) implementados
- [ ] Fluxos de usuário funcionam ponta a ponta
- [ ] Validações locais testadas
- [ ] Rate limiting implementado e testado
- [ ] Tokens expiram em 15 minutos (±2 seg)
- [ ] Email enviado com token correto
- [ ] Auto-login funciona pós-reset
- [ ] Mensagens de erro são claras (português)
- [ ] Sem vazamento de informação (emails válidos/inválidos)
- [ ] Senhas fracas são rejeitadas
- [ ] Senhas iguais à anterior são rejeitadas
- [ ] TypeScript strict sem `any`
- [ ] Serviços isolados de componentes
- [ ] Testes de segurança passam

---

**Status**: ✅ Especificação completa e pronta para desenvolvimento
