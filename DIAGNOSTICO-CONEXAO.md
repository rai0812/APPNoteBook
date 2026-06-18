# 🔧 Diagnóstico: Erro de Conexão ECONNREFUSED

## ❌ Problema

```
Error: apiRequestContext.post: connect ECONNREFUSED ::1:3001
→ POST http://localhost:3001/api/recuperar-senha
```

---

## 🔍 Análise do Erro

| Item | Problema | Causa |
|------|----------|-------|
| **Endpoint** | `http://localhost:3001` | Testes tentando conectar em `localhost` ao invés de `172.20.10.2` |
| **Código** | `ECONNREFUSED` | Conexão recusada - ninguém escutando nessa porta |
| **Port** | `:3001` | Porta correta, mas host errado |
| **Status** | `::1` | IPv6 loopback (localhost), não o IP da rede |

---

## ✅ Solução Implementada

### 1. Corrigir playwright.config.ts
```typescript
// ❌ ANTES
baseURL: process.env.BASE_URL || 'http://localhost:19006'

// ✅ DEPOIS
baseURL: process.env.API_URL || 'http://localhost:3001'
```

### 2. Corrigir test/api/recuperacao-senha.spec.ts
```typescript
// ❌ ANTES
const API_BASE_URL = process.env.API_URL || 'http://localhost:3001';

// ✅ DEPOIS
const API_BASE_URL = process.env.API_URL || 'http://localhost:3001';
```

### 3. Configurar URL de API
```env
# .env.test
API_URL=http://172.20.10.2:3001
```

---

## 🚀 Como Executar Agora

### Terminal 1: Backend
```bash
# Certifique-se de estar no diretório do projeto
cd c:\APP\NoteBookApp

# Inicie o json-server
npx json-server --watch backend/db.json --port 3001
```

**Esperado:**
```
$ npx json-server --watch backend/db.json --port 3001

  ⚠️  Your database is empty or doesn't have some routes required
  .db file not found, creating empty database

  ✓ It works in 200 milliseconds

  📦 Accepting connections at http://127.0.0.1:3001
```

⚠️ **IMPORTANTE**: O json-server exibe `http://127.0.0.1:3001` mas estamos acessando via `172.20.10.2:3001` (mesmo servidor, IPs diferentes)

### Terminal 2: Testes
```bash
# Abra NOVO terminal
cd c:\APP\NoteBookApp

# Configure a URL da API
set API_URL=http://172.20.10.2:3001

# Execute os testes
npx playwright test test/api/recuperacao-senha.spec.ts
```

---

## 🔍 Ferramentas de Diagnóstico

### Script de Diagnóstico (Recomendado)

**Windows:**
```bash
diagnostico-conexao.bat
```

**Linux/Mac:**
```bash
bash diagnostico-conexao.sh
```

Isso irá testar:
1. ✓ Conectividade com ping
2. ✓ Porta aberta
3. ✓ Endpoint respondendo

---

## 🛠️ Troubleshooting Avançado

### Se ainda não conectar...

#### 1. Verificar IP Correto
```bash
# No Windows (Command Prompt)
ipconfig

# Procure por:
# Adaptador de Rede Sem Fio: 172.20.10.x
```

#### 2. Testar Conectividade Manual
```bash
# Terminal
ping 172.20.10.2

# Esperado: sucesso com 0% loss
```

#### 3. Verificar Porta
```powershell
# PowerShell
Test-NetConnection -ComputerName 172.20.10.2 -Port 3001

# Esperado: TcpTestSucceeded : True
```

#### 4. Verificar json-server
```bash
# Terminal que rodou json-server
# Deve estar neste estado (nunca fecha):

  ✓ It works in 200 milliseconds
  📦 Accepting connections at http://127.0.0.1:3001
```

#### 5. Testar com curl
```bash
# Terminal novo
curl -X POST http://172.20.10.2:3001/api/recuperar-senha ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"teste@email.com\"}"

# Esperado: Resposta JSON do servidor
```

---

## 📋 Checklist de Validação

- [ ] Backend rodando em Terminal 1: `json-server --watch backend/db.json --port 3001`
- [ ] Terminal 2 pode fazer ping: `ping 172.20.10.2` (resposta positiva)
- [ ] Port aberta: `Test-NetConnection 172.20.10.2 -Port 3001` (True)
- [ ] Curl funciona: `curl http://172.20.10.2:3001/api/recuperar-senha` (resposta JSON)
- [ ] Variável API_URL configurada: `set API_URL=http://172.20.10.2:3001`
- [ ] Testes executam: `npx playwright test test/api/recuperacao-senha.spec.ts`
- [ ] Relatório gerado: `npx playwright show-report`

---

## 🎯 Próximas Ações

1. **Execute o diagnóstico:**
   ```bash
   diagnostico-conexao.bat
   ```

2. **Resolva qualquer erro reportado**

3. **Execute os testes:**
   ```bash
   set API_URL=http://172.20.10.2:3001
   npx playwright test test/api/recuperacao-senha.spec.ts
   ```

4. **Veja o relatório:**
   ```bash
   npx playwright show-report
   ```

---

## 📞 Se Ainda Não Funcionar

| Erro | Solução |
|------|---------|
| `ECONNREFUSED ::1:3001` | Backend não rodando, ou não está em 172.20.10.2:3001 |
| `ETIMEDOUT` | Firewall bloqueando, ou IP incorreto |
| `ENOTFOUND 172.20.10.2` | Host inválido, verificar `ipconfig` |
| `Cannot POST /api/recuperar-senha` | Backend rodando mas endpoint não existe |

---

**Status**: ✅ Configuração Corrigida  
**Próximo**: Executar testes de API e capturar evidências
