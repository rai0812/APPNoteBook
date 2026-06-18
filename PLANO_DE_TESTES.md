# Plano de Testes - NoteBook App

## 1. Visão Geral da Aplicação

**Nome:** NoteBook App  
**Descrição:** Aplicação de avaliação e gerenciamento de livros com autenticação de usuários  
**Stack:** React Native, Expo, TypeScript, Axios, React Navigation  
**Ferramentas de Teste:** Playwright, Jest (recomendado para testes unitários)

---

## 2. Estrutura da Aplicação

### Fluxo de Navegação
```
SplashScreen (1.5s) → LoginScreen → RegisterScreen
                          ↓
                      HomeScreen → AddBookScreen
                          ↓
                    ReviewScreen
                          ↓
                    LibraryScreen
```

### Funcionalidades Principais
1. **Autenticação**: Login e Registro de usuários
2. **Gestão de Livros**: Adicionar novos livros com capa
3. **Avaliações**: Avaliar livros com nota (1-5 estrelas) e comentário
4. **Biblioteca**: Visualizar todas as avaliações realizadas
5. **Busca**: Pesquisar livros por nome
6. **API**: Integração com backend em `http://172.20.10.3:3001`

---

## 3. Estratégia de Testes

### 3.1 Níveis de Teste

| Nível | Escopo | Ferramenta | Cobertura |
|-------|--------|-----------|-----------|
| **Unitários** | Funções, hooks, componentes simples | Jest + React Native Testing Library | 80%+ |
| **Integração** | Fluxos entre componentes, API calls | Jest + Mock API | 70%+ |
| **E2E** | Fluxos completos do usuário | Playwright | Fluxos críticos |
| **Regressão** | Validar mudanças não quebram funcionalidades | Todos | Antes de deploy |

### 3.2 Estratégia de Teste por Componente

---

## 4. Testes Unitários

### 4.1 SplashScreen
```
✓ Renderiza o componente corretamente
✓ Exibe título "NoteBook"
✓ Navega para LoginScreen após 1.5s
✓ Define backgroundColor corretamente
```

### 4.2 LoginScreen
```
✓ Renderiza campos de input (email e senha)
✓ Renderiza botão "Entrar"
✓ Renderiza link "Cadastrar"
✓ Atualiza estado ao digitar email
✓ Atualiza estado ao digitar senha
✓ Limpa inputs ao submeter
✓ Não chama API com campos vazios
✓ Valida input antes de fazer login
```

### 4.3 RegisterScreen
```
✓ Renderiza campos de input (email e senha)
✓ Renderiza botão "Cadastrar"
✓ Renderiza link "Voltar para login"
✓ Atualiza estado email e senha
✓ Valida se email está preenchido
✓ Valida se senha tem mínimo 4 caracteres
✓ Exibe alerta se senha < 4 caracteres
✓ Exibe alerta se email já cadastrado
✓ Cria novo usuário com dados válidos
```

### 4.4 HomeScreen
```
✓ Carrega lista de livros ao focar a tela
✓ Exibe campo de busca
✓ Filtra livros por nome corretamente
✓ Exibe mensagem "Nenhum livro encontrado" quando vazio
✓ Renderiza botões de navegação (Livros, Novo Livro, Avaliações)
✓ Exibe capas ou ícone 📖 quando capa ausente
✓ Navega para ReviewScreen ao clicar em livro
✓ Navega para AddBookScreen ao clicar "Novo Livro"
✓ Navega para LibraryScreen ao clicar "Avaliações"
✓ Case-insensitive search
✓ Busca por nome ou título
```

### 4.5 AddBookScreen
```
✓ Renderiza campos: nome, autor
✓ Renderiza campo/botão para importar capa
✓ Renderiza botão "Salvar Livro"
✓ Renderiza botão "Voltar"
✓ Atualiza estado ao digitar nome
✓ Atualiza estado ao digitar autor
✓ Exibe imagem selecionada como capa
✓ Abre galeria ao clicar em "Importar foto"
✓ Solicita permissão de acesso à galeria
✓ Exibe alerta se nome ou autor vazios
✓ Não salva livro com campos obrigatórios vazios
✓ Salva livro com dados válidos
✓ Navega para HomeScreen após salvar
✓ Exibe alerta de sucesso após salvar
✓ Exibe alerta de erro se falhar API
```

### 4.6 ReviewScreen
```
✓ Exibe nome do livro
✓ Exibe autor do livro
✓ Exibe capa ou ícone 📖
✓ Renderiza 5 estrelas (seleccionáveis)
✓ Atualiza rating ao clicar na estrela
✓ Exibe "X de 5 estrelas"
✓ Renderiza campo de comentário
✓ Atualiza comentário ao digitar
✓ Exibe alerta se rating = 0
✓ Exibe alerta se comentário vazio
✓ Não salva avaliação com validação falha
✓ Salva avaliação com dados válidos
✓ Navega para LibraryScreen após salvar
✓ Renderiza botão "Voltar"
✓ Trata erro ao salvar avaliação
✓ Suporta múltiplas linhas de comentário
```

### 4.7 LibraryScreen
```
✓ Carrega lista de avaliações ao focar
✓ Renderiza cada avaliação com: capa, nome livro, rating, comentário
✓ Exibe ícone 📖 se sem capa
✓ Renderiza estrelas corretamente (★ para preenchidas, ☆ para vazias)
✓ Exibe mensagem "Nenhuma avaliação cadastrada" quando vazio
✓ Renderiza botão "Voltar para livros"
```

### 4.8 API Service (api.ts)
```
✓ Cria instância axios com baseURL correto
✓ Faz requisições GET
✓ Faz requisições POST
✓ Trata erros de conexão
✓ Adiciona headers corretamente
```

### 4.9 AppNavigator
```
✓ Renderiza NavigationContainer
✓ Define rota inicial como "Splash"
✓ Configura stack navigator
✓ Todas as rotas estão registradas
✓ Títulos das telas estão configurados
✓ Headers estão ocultos onde esperado
✓ Transições entre telas funcionam
```

---

## 5. Testes de Integração

### 5.1 Fluxo de Autenticação
```
[Login] 
  → Email inválido → Alerta
  → Senha incorreta → Alerta
  → Credenciais válidas → HomeScreen

[Register]
  → Email vazio → Alerta
  → Senha < 4 caracteres → Alerta
  → Email já existe → Alerta
  → Cadastro sucesso → Alerta sucesso → LoginScreen
  → Falha API → Alerta erro
```

### 5.2 Fluxo de Livros
```
[HomeScreen]
  → Carrega livros via API ✓
  → Busca funciona em tempo real ✓
  → Clica em livro → ReviewScreen com dados ✓
  → Clica "Novo Livro" → AddBookScreen ✓

[AddBookScreen]
  → Escolhe capa → Preview ✓
  → Preenche nome e autor → Salva ✓
  → Chamada POST /books ✓
  → Sucesso → HomeScreen ✓
  → Novo livro aparece na lista ✓
```

### 5.3 Fluxo de Avaliações
```
[ReviewScreen]
  → Recebe livro como parâmetro ✓
  → Exibe dados corretos ✓
  → Rating e comentário funcionam ✓
  → Salva via POST /reviews ✓
  → Sucesso → LibraryScreen ✓

[LibraryScreen]
  → Carrega avaliações via API ✓
  → Exibe todas as avaliações ✓
  → Voltando do Review → Recarrega ✓
```

### 5.4 Fluxo de Navegação Completo
```
SplashScreen (1.5s) → LoginScreen → [Register ou Login]
  ↓
HomeScreen → [Buscar, Novo Livro, Avaliações]
  ├→ AddBookScreen → HomeScreen
  ├→ ReviewScreen → LibraryScreen
  └→ LibraryScreen → HomeScreen
```

---

## 6. Testes E2E (Playwright)

### 6.1 Pré-requisitos
```
- Backend rodando em http://172.20.10.3:3001
- API endpoints funcionando
- Database (db.json) acessível
- App rodando (expo start --web ou mobile)
```

### 6.2 Cenários E2E Críticos

#### 6.2.1 Registro e Login
```
Cenário: Novo usuário se registra e faz login
  1. Navega para app
  2. Splash aparece → aguarda 1.5s
  3. LoginScreen é exibida
  4. Clica "Cadastrar"
  5. RegisterScreen é exibida
  6. Preenche email e senha
  7. Clica "Cadastrar"
  8. Alerta de sucesso aparece
  9. Navega para LoginScreen
  10. Faz login com novas credenciais
  11. HomeScreen é exibida
  
Validações:
  ✓ Usuário criado no backend
  ✓ Email único validado
  ✓ Senha armazenada (com validações)
  ✓ Credenciais funcionam no login
```

#### 6.2.2 Adicionar Livro
```
Cenário: Usuário adiciona novo livro com capa
  1. Realiza login
  2. HomeScreen é exibida
  3. Clica "Novo Livro"
  4. AddBookScreen é exibida
  5. Seleciona imagem de capa
  6. Preenche nome e autor
  7. Clica "Salvar Livro"
  8. Alerta de sucesso
  9. Retorna à HomeScreen
  
Validações:
  ✓ Livro criado no backend (/books)
  ✓ Imagem salva/referenciada
  ✓ Livro aparece na lista HomeScreen
  ✓ Dados persistem após refresh
```

#### 6.2.3 Avaliar Livro
```
Cenário: Usuário avalia livro com nota e comentário
  1. Realiza login
  2. Na HomeScreen, clica em um livro
  3. ReviewScreen é exibida com dados do livro
  4. Seleciona 4 estrelas
  5. Escreve comentário
  6. Clica "Salvar Avaliação"
  7. Alerta de sucesso
  8. Navega para LibraryScreen
  
Validações:
  ✓ Avaliação criada no backend (/reviews)
  ✓ Rating (1-5) salvo corretamente
  ✓ Comentário armazenado
  ✓ Avaliação aparece em LibraryScreen
  ✓ Exibe estrelas corretamente (★★★★☆)
```

#### 6.2.4 Buscar Livro
```
Cenário: Usuário busca livro por nome
  1. Realiza login
  2. HomeScreen com lista de livros
  3. Clica no campo de busca
  4. Digita parte do nome de um livro
  5. Lista filtra em tempo real
  6. Clica no livro encontrado
  7. ReviewScreen abre corretamente
  
Validações:
  ✓ Busca é case-insensitive
  ✓ Busca funciona com palavras parciais
  ✓ Busca filtra corretamente
  ✓ Livro selecionado tem dados corretos
```

#### 6.2.5 Fluxo Completo
```
Cenário: Ciclo completo - Registrar → Adicionar → Avaliar → Ver Biblioteca
  1. Novo usuário registra
  2. Faz login
  3. Adiciona 2 livros
  4. Avalia ambos os livros
  5. Verifica avaliações em LibraryScreen
  6. Busca por um dos livros
  7. Avalia novamente (teste de edição/duplicação)
  
Validações:
  ✓ Todos os dados persistem
  ✓ Estados sincronizam corretamente
  ✓ API calls bem-sucedidas
  ✓ UI atualiza corretamente
```

---

## 7. Testes de Validação e Tratamento de Erros

### 7.1 Validações de Entrada

| Campo | Validações | Teste |
|-------|-----------|-------|
| **Email** | Não vazio, formato email (Login) | ✓ Vazio, ✓ Inválido, ✓ Válido |
| **Senha** | Mínimo 4 caracteres (Register) | ✓ < 4 chars, ✓ = 4 chars, ✓ > 4 chars |
| **Nome Livro** | Não vazio (AddBook) | ✓ Vazio, ✓ Preenchido |
| **Autor** | Não vazio (AddBook) | ✓ Vazio, ✓ Preenchido |
| **Rating** | Entre 1-5 (Review) | ✓ 0 (inválido), ✓ 1-5 (válido) |
| **Comentário** | Não vazio (Review) | ✓ Vazio, ✓ Espaços, ✓ Texto |

### 7.2 Tratamento de Erros

```
[Erro de Conexão]
✓ Alerta ao usuário: "Erro ao conectar com servidor"
✓ Não navega para próxima tela
✓ Usuário pode tentar novamente

[Email Duplicado]
✓ Alerta: "Este e-mail já está cadastrado"
✓ Não cria usuário
✓ Permanece em RegisterScreen

[Credenciais Inválidas]
✓ Alerta: "E-mail ou senha incorretos"
✓ Não navega para HomeScreen
✓ Permanece em LoginScreen

[Falha ao Salvar Livro]
✓ Alerta: "Não foi possível salvar o livro"
✓ Não navega para HomeScreen
✓ Usuário pode tentar novamente

[Falha ao Salvar Avaliação]
✓ Alerta: "Não foi possível salvar a avaliação"
✓ Não navega para LibraryScreen
✓ Usuário pode tentar novamente
```

---

## 8. Testes de UI/UX

### 8.1 Layout e Responsividade
```
✓ Componentes renderizam corretamente
✓ Layouts responsivos em diferentes tamanhos
✓ Sem overflow de texto
✓ Espaçamento consistente
✓ Cores aplicadas corretamente (#f7a9c8, #f5efc8, etc)
✓ Ícones exibem corretamente (📖, ⭐, ➕, ☆, etc)
```

### 8.2 Interações
```
✓ Botões respondendo ao toque
✓ TextInputs focáveis e editáveis
✓ ScrollView rolável
✓ FlatList renderiza dinamicamente
✓ Keyboard comporta-se corretamente (iOS)
✓ TouchWithoutFeedback dismiss keyboard (ReviewScreen)
```

### 8.3 Estados Visuais
```
✓ Carregamento (spinner ou loading state)
✓ Vazio (empty states com mensagens)
✓ Erro (visual de erro)
✓ Sucesso (alertas, transições)
✓ Focus de inputs
✓ Disabled state de botões (se aplicável)
```

---

## 9. Testes de Performance

```
✓ App inicializa em < 3s (incluindo splash 1.5s)
✓ HomeScreen carrega livros em < 2s
✓ LibraryScreen carrega avaliações em < 2s
✓ Busca filtra em tempo real (< 500ms)
✓ Transições entre telas suaves (sem lag)
✓ ScrollView/FlatList renderizam sem jank
✓ Imagens carregam sem bloquear UI
```

---

## 10. Testes de Segurança

```
✓ Senhas não exibidas em campo de login
✓ Senhas não logadas em console
✓ API calls não expõem dados sensíveis
✓ Tokens/Autenticação (se implementado)
✓ Validação de entrada contra XSS (em web)
✓ SQL injection (se há backend SQL)
✓ Permissões de câmera/galeria solicitadas
```

---

## 11. Testes de Compatibilidade

| Plataforma | Versão | Status |
|-----------|--------|--------|
| Android | 10+ | A testar |
| iOS | 13+ | A testar |
| Web (Expo Web) | - | A testar |
| Orientação Portrait | - | ✓ Suportada |
| Orientação Landscape | - | A testar |

---

## 12. Casos de Teste Específicos por Tela

### 12.1 LoginScreen - Casos Críticos
```
TC-001: Login com credenciais válidas
  Input: email válido, senha válida
  Expected: Navega para HomeScreen
  
TC-002: Login com email inválido
  Input: email não existe, qualquer senha
  Expected: Alerta "E-mail ou senha incorretos"
  
TC-003: Login com senha inválida
  Input: email válido, senha incorreta
  Expected: Alerta "E-mail ou senha incorretos"
  
TC-004: Login com campos vazios
  Input: email vazio, senha vazia
  Expected: (Validação? Atual: pode tentar)
  
TC-005: Falha de conexão
  Input: Servidor offline
  Expected: Alerta "Erro ao conectar com servidor"
```

### 12.2 RegisterScreen - Casos Críticos
```
TC-006: Registro com email único
  Input: email novo, senha 4+ caracteres
  Expected: Sucesso, alerta, volta para Login
  
TC-007: Registro com email duplicado
  Input: email existente, qualquer senha
  Expected: Alerta "Este e-mail já está cadastrado"
  
TC-008: Registro com senha curta
  Input: qualquer email, senha < 4 caracteres
  Expected: Alerta "A senha precisa ter pelo menos 4 caracteres"
  
TC-009: Registro com campos vazios
  Input: email vazio ou senha vazia
  Expected: Alerta "Preencha e-mail e senha"
```

### 12.3 HomeScreen - Casos Críticos
```
TC-010: Carregamento de livros
  Input: Navega para HomeScreen
  Expected: Lista de livros carrega via API
  
TC-011: Busca por nome (case-insensitive)
  Input: Busca "harry" (se existe "Harry Potter")
  Expected: Livro encontrado na lista
  
TC-012: Busca sem resultados
  Input: Busca "xyzabc"
  Expected: Mensagem "Nenhum livro encontrado"
  
TC-013: Clique em livro
  Input: Clica em livro da lista
  Expected: Navega para ReviewScreen com dados do livro
  
TC-014: Botão "Novo Livro"
  Input: Clica botão "Novo Livro"
  Expected: Navega para AddBookScreen
```

### 12.4 AddBookScreen - Casos Críticos
```
TC-015: Adicionar livro completo
  Input: Nome, Autor, Capa
  Expected: Livro salvo, alerta sucesso, volta para Home
  
TC-016: Salvar sem nome
  Input: Autor preenchido, capa selecionada, nome vazio
  Expected: Alerta "Preencha o nome e o autor do livro"
  
TC-017: Salvar sem autor
  Input: Nome preenchido, capa selecionada, autor vazio
  Expected: Alerta "Preencha o nome e o autor do livro"
  
TC-018: Salvar sem capa (permitido)
  Input: Nome e Autor preenchidos, sem capa
  Expected: Livro salvo com capa vazia
```

### 12.5 ReviewScreen - Casos Críticos
```
TC-019: Avaliar com 5 estrelas
  Input: Rating=5, comentário preenchido
  Expected: Avaliação salva, alerta sucesso
  
TC-020: Avaliar sem rating
  Input: Rating=0, comentário preenchido
  Expected: Alerta "Escolha uma nota de 1 a 5 estrelas"
  
TC-021: Avaliar sem comentário
  Input: Rating preenchido, comentário vazio
  Expected: Alerta "Escreva um comentário"
  
TC-022: Avaliar com espaços no comentário
  Input: Rating=3, comentário="   "
  Expected: Alerta "Escreva um comentário"
```

### 12.6 LibraryScreen - Casos Críticos
```
TC-023: Visualizar avaliações
  Input: Navega para LibraryScreen
  Expected: Lista de avaliações carrega via API
  
TC-024: Avaliação sem capa
  Input: Avaliação de livro sem capa
  Expected: Ícone 📖 exibido
  
TC-025: Exibição de estrelas
  Input: Avaliação com rating=3
  Expected: Exibe "★★★☆☆"
  
TC-026: Mensagem vazia
  Input: Nenhuma avaliação no BD
  Expected: Exibe "Nenhuma avaliação cadastrada"
```

---

## 13. Matriz de Rastreabilidade

| Funcionalidade | Teste Unitário | Teste Integração | Teste E2E |
|---------------|------------------|-------------------|-----------|
| Login | ✓ | ✓ | ✓ |
| Registro | ✓ | ✓ | ✓ |
| Listar Livros | ✓ | ✓ | ✓ |
| Buscar Livros | ✓ | ✓ | ✓ |
| Adicionar Livro | ✓ | ✓ | ✓ |
| Avaliar Livro | ✓ | ✓ | ✓ |
| Visualizar Avaliações | ✓ | ✓ | ✓ |
| Navegação | ✓ | ✓ | ✓ |
| Tratamento de Erros | ✓ | ✓ | ✓ |
| Validação de Input | ✓ | ✓ | ✓ |

---

## 14. Cobertura de Código Esperada

```
Alvo mínimo: 80% de cobertura

Por arquivo:
- AppNavigator.tsx          : 85%+
- LoginScreen.tsx           : 85%+
- RegisterScreen.tsx        : 85%+
- HomeScreen.tsx            : 80%+
- AddBookScreen.tsx         : 85%+
- ReviewScreen.tsx          : 85%+
- LibraryScreen.tsx         : 80%+
- services/api.ts           : 90%+
- SplashScreen.tsx          : 75%+
```

---

## 15. Cronograma de Execução

| Fase | Duração | Atividades |
|------|---------|-----------|
| **Planejamento** | 1-2 dias | Definir estrutura de testes, preparar ambiente |
| **Testes Unitários** | 3-4 dias | Implementar testes para componentes e funções |
| **Testes Integração** | 2-3 dias | Testar fluxos entre componentes |
| **Testes E2E** | 2-3 dias | Automatizar cenários críticos com Playwright |
| **Regressão** | Contínuo | Executar antes de cada release |
| **Correções** | Conforme necessário | Corrigir bugs encontrados |

---

## 16. Ambiente de Testes

### 16.1 Requisitos
- Node.js 18+
- Expo CLI
- Playwright
- Backend rodando (`npm start` em backend/)
- Banco de dados (db.json ou MongoDB)

### 16.2 Configuração
```bash
# Instalar dependências
npm install

# Instalar Playwright
npm install --save-dev @playwright/test

# Rodar app (web)
npm run web

# Rodar app (android)
npm run android

# Rodar app (iOS)
npm run ios

# Executar testes
npm test
npm run test:e2e
```

### 16.3 Dados de Teste
```json
{
  "users": [
    {
      "id": 1,
      "email": "teste@teste.com",
      "password": "1234"
    }
  ],
  "books": [
    {
      "id": 1,
      "name": "Harry Potter",
      "author": "J.K. Rowling",
      "cover": "url_imagem"
    }
  ],
  "reviews": []
}
```

---

## 17. Riscos e Mitigações

| Risco | Impacto | Mitigação |
|------|--------|-----------|
| API indisponível | Alto | Mock de API, testes sem servidor |
| Problemas de permissão (câmera/galeria) | Médio | Testes em múltiplos dispositivos/emuladores |
| Transições lentas | Médio | Testes de performance, otimizar componentes |
| Dados inconsistentes | Médio | Limpar BD antes de testes, usar fixtures |
| Diferenças entre iOS/Android | Médio | Testar em ambos (CI/CD com matriz) |

---

## 18. Conclusão

Este plano de testes garante cobertura completa da aplicação NoteBook com abordagem estratificada:
- ✓ Testes unitários para componentes individuais
- ✓ Testes de integração para fluxos
- ✓ Testes E2E para cenários críticos
- ✓ Validação de UI/UX
- ✓ Tratamento de erros

A execução deste plano resultará em aplicação robusta, confiável e pronta para produção.

---

**Data:** 25 de maio de 2026  
**Versão:** 1.0  
**Status:** Aprovado
