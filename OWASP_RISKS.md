# 🛡️ Relatório de Segurança - Padrão OWASP (NoteBookApp)

Mapeamento de vulnerabilidades críticas com base nos testes automatizados implementados:

### 1. A03:2021 - Injection (Injeção de Código)
- **Status:** ✅ RESOLVIDO
- **Descrição:** Implementada parametrização de consultas de banco de dados e validações por expressões regulares (Regex) nos inputs de e-mail.
- **Evidência:** Validado com sucesso via caso de teste `T-SEC-02` (SQL Injection) e `T-SEC-01` (XSS Protection).

### 2. A04:2021 - Insecure Design (Autenticação Fraca e Limitação de Recursos)
- **Status:** ✅ RESOLVIDO
- **Descrição:** Mecanismos de redefinição de senha exigem complexidade mínima de caracteres e bloqueiam a reutilização de senhas anteriores. Além disso, foi implementado bloqueio de abuso de requisições na API.
- **Evidência:** Validado via casos de teste de API do grupo B8 (Força de senha), B7 (Senha anterior) e grupo B9 / `T-API-04` (Rate Limiting - Bloqueio de 6ª requisição com HTTP 429).

### 3. A05:2021 - Security Misconfiguration (Exposição de Erros)
- **Status:** ✅ RESOLVIDO
- **Descrição:** O tratamento global de erros (try-catch) mascara exceções técnicas do banco e do código, não revelando Stack Traces para o usuário final.
- **Evidência:** Validado via caso de teste `T-SEC-03` (Information Leak) e subgrupo B4 (`T-API-02-MSG` Mensagem de erro clara para e-mail inexistente).