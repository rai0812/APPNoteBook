# Plano de Testes: Sistema de Recuperação de Senha
**Projeto**: NoteBook App  
**Feature**: Esqueceu a Senha  
**Data**: 2026-06-08  
**Status**: Planejamento

---

## 📋 Escopo de Testes

### Tipos de Testes

1. **Testes de API** (Backend - Playwright)
   - POST /api/recuperar-senha
   - POST /api/resetar-senha
   - Validações, rate limiting, erros

2. **Testes E2E Mobile** (Frontend - Detox/Playwright)
   - Fluxo completo: LoginScreen → EsqueceuSenhaScreen → ResetarSenhaScreen
   - Navegação, validações locais, integração API
   - Deep linking

3. **Testes de Segurança**
   - Rate limiting (5 req/hora)
   - Token expiration (15 min)
   - Bloqueio senha anterior
   - Inputs sanitizados

4. **Testes de Performance**
   - Tempo de resposta API
   - Validação local (sem delay)
   - Deep linking (carregamento)

---

## 🧪 Matriz de Testes (Baseada em spec.md)

| Teste ID | Comportamento | Tipo | Status |
|----------|---------------|------|--------|
| T-API-01 | Email válido → token gerado | API | ⏳ |
| T-API-02 | Email não existe → 404 | API | ⏳ |
| T-API-03 | Email inválido → validação | API | ⏳ |
| T-API-04 | Rate limit (>5/hora) → 429 | API | ⏳ |
| T-API-05 | Token expirado (>15min) → 401 | API | ⏳ |
| T-API-06 | Senha fraca → 400 | API | ⏳ |
| T-API-07 | Senha = anterior → 400 | API | ⏳ |
| T-API-08 | Senhas não conferem → 400 | API | ⏳ |
| T-E2E-01 | Fluxo completo bem-sucedido | E2E | ⏳ |
| T-E2E-02 | Validação email (local) | E2E | ⏳ |
| T-E2E-03 | Deep linking funciona | E2E | ⏳ |
| T-E2E-04 | Auto-login após reset | E2E | ⏳ |
| T-SEC-01 | XSS em email input | Security | ⏳ |
| T-PERF-01 | Resposta API < 1s | Performance | ⏳ |

---

## 📍 Ambiente de Testes

**Setup Necessário**:
- [ ] Backend Express rodando (Port 3001)
- [ ] db.json com schema correto
- [ ] Playwright instalado
- [ ] Detox instalado (E2E mobile)
- [ ] Node.js 16+

**Dados de Teste**:
```json
{
  "usuarios": [
    {
      "id": "1",
      "email": "teste@email.com",
      "password": "SenhaAnterior@123"
    },
    {
      "id": "2",
      "email": "novo@email.com",
      "password": "OutraSenha@456"
    }
  ],
  "passwordResetTokens": []
}
```

---

## 🔍 Cenários de Teste Detalhados

### Cenário 1: Fluxo Happy Path
```
Pré-condição: Email existe em db.json
1. POST /api/recuperar-senha { email: "teste@email.com" }
2. Validar resposta: 200 { sucesso: true }
3. Validar token criado em db.json
4. Validar email "enviado" (mock)
5. POST /api/resetar-senha { token, novaSenha: "NovaSenha@123" }
6. Validar resposta: 200 { authToken }
7. Validar senha atualizada em db.json
✅ SUCESSO
```

### Cenário 2: Email Não Existe
```
Pré-condição: Email não em db.json
1. POST /api/recuperar-senha { email: "inexistente@email.com" }
2. Validar resposta: 404 { erro: "EMAIL_NAO_ENCONTRADO" }
3. Validar nenhum token criado
✅ SUCESSO
```

### Cenário 3: Rate Limiting
```
Pré-condição: Usar mesmo email
1. Loop 5x: POST /api/recuperar-senha { email }
   Validar: 200 { sucesso: true }
2. 6º Request: POST /api/recuperar-senha { email }
   Validar: 429 { erro: "RATE_LIMIT" }
✅ SUCESSO
```

### Cenário 4: Token Expirado
```
Pré-condição: Criar token, esperar 15+ min
1. POST /api/resetar-senha { token: "expirado", novaSenha }
2. Validar resposta: 401 { erro: "TOKEN_EXPIRADO" }
✅ SUCESSO
```

---

## 📊 Critérios de Aceitação

- ✅ Todos os 13 comportamentos testados
- ✅ Cobertura >80% (backend API)
- ✅ Cobertura >70% (frontend)
- ✅ Todos os testes passam em CI/CD
- ✅ Sem erros de segurança (OWASP top 10)
- ✅ Performance <1s por requisição
- ✅ Relatório com evidências (prints)

---

## 🚀 Execução

- **Data Início**: 2026-06-08
- **Duração Estimada**: 4h
- **Executor**: QA Lead
- **Artefatos**: 
  - /test/api/recuperacao-senha.spec.ts
  - /e2e/recuperacao-senha.e2e.ts
  - /reports/teste-resultado.html
