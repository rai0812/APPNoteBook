# 📂 Localização do Banco de Dados (json-server)

## 📍 Caminho Completo

```
c:\APP\NoteBookApp\
└── backend\
    └── db.json  ← AQUI! ✅
```

**Arquivo**: `backend/db.json`  
**Caminho Absoluto**: `c:\APP\NoteBookApp\backend\db.json`

---

## 🚀 Comando Usado

```bash
npx json-server --watch backend/db.json --port 3001
```

**O que significa:**
- `--watch backend/db.json` → Monitora mudanças no arquivo `backend/db.json`
- `--port 3001` → Expõe em `http://localhost:3001` ou `http://172.20.10.2:3001`

---

## 📊 Estrutura Atual do db.json

```json
{
  "users": [          ← Endpoint: GET/POST http://172.20.10.2:3001/users
    {
      "id": "1",
      "email": "admin@email.com",
      "password": "123456"
    },
    ...
  ],
  
  "books": [          ← Endpoint: GET/POST http://172.20.10.2:3001/books
    {
      "name": "É Assim Que Acaba",
      "author": "Colleen Hoover",
      ...
    },
    ...
  ],
  
  "reviews": [        ← Endpoint: GET/POST http://172.20.10.2:3001/reviews
    {
      "bookId": "MqYU9HbQ6_8",
      "bookName": "É Assim Que Acaba",
      ...
    },
    ...
  ]
}
```

---

## 🔗 Endpoints Disponíveis

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `GET /users` | GET | Listar todos usuários |
| `POST /users` | POST | Criar novo usuário |
| `GET /books` | GET | Listar todos livros |
| `POST /books` | POST | Criar novo livro |
| `GET /reviews` | GET | Listar todas reviews |
| `POST /reviews` | POST | Criar nova review |

---

## 🧪 Exemplos de Requisição

### Listar Usuários
```bash
curl http://172.20.10.2:3001/users
```

### Buscar Usuário por Email
```bash
curl "http://172.20.10.2:3001/users?email=admin@email.com"
```

### Criar Novo Usuário
```bash
curl -X POST http://172.20.10.2:3001/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@email.com",
    "password": "senha123"
  }'
```

---

## ⚙️ Adicionar Suporte a Recuperação de Senha

Você precisa adicionar a coleção `passwordResetTokens` ao `db.json`:

```json
{
  "users": [...],
  "books": [...],
  "reviews": [...],
  "passwordResetTokens": [  ← ADICIONAR ISTO
    {
      "id": "token-123",
      "email": "teste@email.com",
      "token": "abc123xyz",
      "expiresAt": "2026-06-08T23:00:00Z",
      "usado": false
    }
  ]
}
```

Depois você terá:
```bash
GET /passwordResetTokens           ← Listar tokens
POST /passwordResetTokens          ← Criar novo token
GET /passwordResetTokens/{id}      ← Buscar token específico
PATCH /passwordResetTokens/{id}    ← Atualizar token (marcar como usado)
DELETE /passwordResetTokens/{id}   ← Deletar token
```

---

## 📡 Como o json-server Funciona

```
1. Cliente (Playwright)
   └─ POST http://172.20.10.2:3001/api/recuperar-senha
      └─ {email: "teste@email.com"}

2. json-server recebe requisição
   └─ Processa a lógica (você pode adicionar middlewares)

3. json-server acessa backend/db.json
   └─ Lê ou escreve dados

4. json-server retorna resposta
   └─ JSON com status 200/404/400
```

---

## 🔧 Verificar Conteúdo Atual

```bash
# Abra outro terminal
type backend/db.json  # Windows
cat backend/db.json   # Linux/Mac
```

Ou abra diretamente em um editor:
```
c:\APP\NoteBookApp\backend\db.json
```

---

## 💾 Modificar Dados

Qualquer mudança direta no `backend/db.json` será refletida instantaneamente no json-server (por causa do `--watch`).

**Exemplo:**
```json
// Adicione novo usuário diretamente no arquivo
{
  "users": [
    // ... usuários existentes ...
    {
      "id": "teste-123",
      "email": "novo@email.com",
      "password": "senha456"
    }
  ]
}
```

Salve o arquivo e acesse:
```bash
curl http://172.20.10.2:3001/users/teste-123
```

---

## 🎯 Para Testes de Recuperação de Senha

Você precisa:

1. **Adicionar usuário de teste** ao `backend/db.json`
2. **Adicionar coleção `passwordResetTokens`**
3. **Criar endpoints customizados** (opcional, ou usar middleware)

**Exemplo de usuário para testes:**
```json
{
  "id": "teste-001",
  "email": "teste@email.com",
  "password": "SenhaAnterior@123",
  "senhaAnterior": "SenhaAnterior@123"
}
```

---

**Status**: ✅ json-server puxando de `backend/db.json`  
**Próximo**: Adicionar endpoints de recuperação de senha
