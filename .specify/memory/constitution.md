<!-- 
SYNC IMPACT REPORT
===================
Version: 0.1.0 (Initial generation from codebase analysis)
Generated: 2026-05-18

CHANGES:
- Created initial constitution from template
- Analyzed existing codebase patterns (React Native/Expo stack)
- Extracted technology versions and dependencies
- Documented existing architectural patterns
- Formalized error handling conventions
- Established non-negotiable rules for code quality

SECTIONS ADDED:
✅ Stack e Versões (Technology Stack & Versions)
✅ Estrutura de Pastas (Folder Structure)
✅ Padrões de Código (Code Patterns)
✅ Tratamento de Erros (Error Handling)
✅ Regras Não-Negociáveis (Non-Negotiable Rules)

TEMPLATES REQUIRING UPDATES:
- plan-template.md (for constitution checks alignment)
- spec-template.md (for requirements scope)
- tasks-template.md (for task categorization)

FOLLOW-UP TODOS:
- Implement missing backend services (currently minimal)
- Establish testing framework and patterns
- Document API contract specifications
-->

# NoteBook App Constitution

## Core Principles

### I. Português como Padrão de Nomeação
Variáveis, funções e comentários devem estar em português. O código é escrito em Lisboa/Brasil,
portanto a compreensibilidade em português é prioridade. Nomes devem ser descritivos e legíveis
em português correto.

Exemplo: `function carregarLivros()`, `const nomeAutor`, `const listaFiltrada`

### II. TypeScript Rigoroso (NON-NEGOTIABLE)
TypeScript com modo `strict: true` é obrigatório. Tipos implícitos (`any`) são proibidos
exceto em casos documentados e aprovados. Toda interface, tipo e classe deve ter tipagem explícita.

Violação desta regra torna o código indefensável e impede manutenção futura.

### III. Componentes Funcionais e Hooks React
Apenas componentes funcionais com React Hooks. Classes e component lifecycle methods estão proibidos.
Estado deve ser gerenciado com `useState`, `useContext` ou biblioteca de estado (futura).

### IV. Serviços Isolados e Testáveis
Lógica de negócio deve estar em serviços (`/src/services/`), não em componentes UI.
Componentes são apenas apresentação; serviços lidam com dados, API e regras.

### V. Tratamento de Erro Estruturado (NON-NEGOTIABLE)
Erros devem ser capturados, contextualizados e passados ao usuário de forma clara.
`try-catch` é obrigatório em operações assíncronas. Erros da rede não devem quebrar a aplicação.

## Stack e Versões (Não-Negociáveis)

### Frontend
- **React Native**: 0.81.5 (fixado)
- **Expo**: ~54.0.33 (permite patches)
- **React**: 19.1.0 (fixado)
- **React Navigation**: ^7.2.2 (stack: ^7.14.12)
- **TypeScript**: ~5.9.2 (permite patches)
- **Axios**: ^1.15.2 (para requisições HTTP)

### Recursos Expo
- **expo-image-picker**: ~17.0.10 (seleção de imagens)
- **expo-status-bar**: ~3.0.9
- **@expo/vector-icons**: ^15.0.3

### DevDependencies
- **@types/react**: ~19.1.0
- **TypeScript**: ~5.9.2

NUNCA usar: jQuery, Redux, Context API sem documentação, ou bibliotecas não aprovadas
sem revisão de arquitetura.

## Estrutura de Pastas

```
src/
├── screens/           # Componentes de tela (UI)
│   ├── LoginScreen.tsx
│   ├── RegisterScreen.tsx
│   ├── HomeScreen.tsx
│   ├── AddBookScreen.tsx
│   ├── ReviewScreen.tsx
│   ├── LibraryScreen.tsx
│   └── SplashScreen.tsx
├── services/          # Lógica de negócio, API, utilidades
│   ├── api.ts         # Cliente HTTP (axios)
│   ├── autenticacao.ts
│   └── livros.ts
├── components/        # Componentes reutilizáveis (futuro)
├── tipos/             # Interfaces TypeScript globais
├── navegacao/         # Configuração de navegação
└── AppNavigator.tsx   # Raiz da navegação

backend/
├── server.js          # Servidor principal
├── db.json            # Banco de dados JSON (desenvolvimento)
└── rotas/             # Endpoints API (futuro)

assets/               # Imagens, fontes, recursos estáticos
```

**Regra de Ouro**: Componentes UI em `screens/`. Lógica de negócio em `services/`.
Nada deve ficar desorganizado em raiz do projeto.

## Padrões de Código

### Nomeação
- **PascalCase** para componentes React e classes: `HomeScreen`, `LoginScreen`
- **camelCase** para variáveis, funções e métodos: `carregarLivros()`, `nomeAutor`, `validarEmail()`
- **UPPER_SNAKE_CASE** para constantes: `BASE_URL = "http://..."`, `TIMEOUT_PADRAO = 5000`
- **Português obrigatório** em nomes de funções e variáveis

Exemplos:
```typescript
// ✅ CORRETO
const [nomeUsuario, setNomeUsuario] = useState("");
function carregarLivrosDoServidor() {}
const BASE_URL = "http://172.20.10.3:3001";

// ❌ ERRADO
const [username, setUsername] = useState("");
function loadBooks() {}
const baseUrl = "http://...";
```

### Imports e Exports
- Usar imports nomeados quando possível: `import { api } from "../services/api"`
- Exports padrão apenas para componentes principais: `export default function HomeScreen() {}`
- Agrupar imports: React → React Native → Bibliotecas → Serviços locais → Tipos

```typescript
// ✅ CORRETO
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { api } from "../services/api";
import { Livro } from "../tipos/livro";

export default function HomeScreen() { ... }

// ❌ ERRADO
import React from "react"
import api from '../services/api'
export const HomeScreen = () => { ... }
```

### Tipagem TypeScript
- Sempre declarar tipos para props, estados e retornos
- Não usar `any` sem comentário `// @ts-ignore` justificado
- Criar interfaces reutilizáveis em `/src/tipos/`

```typescript
// ✅ CORRETO
interface PropsTelaLogin {
  navegacao: NavigationProp<any>;
}

function TelaLogin({ navegacao }: PropsTelaLogin) {
  const [email, setEmail] = useState<string>("");
  return ...
}

// ❌ ERRADO
function TelaLogin({ navigation }: any) {
  const [email, setEmail] = useState("");
  return ...
}
```

### Espaçamento e Formatação
- 2 espaços para indentação (configurado em `tsconfig.json`)
- Linhas máximo ~100 caracteres
- Espaço antes de `{` em blocos de controle
- Aspas duplas para strings

## Tratamento de Erros (NON-NEGOTIABLE)

### Padrão Obrigatório: Try-Catch com Contexto
```typescript
async function carregarLivros() {
  try {
    const resposta = await api.get("/livros");
    setLivros(resposta.data);
  } catch (erro) {
    console.error("Erro ao carregar livros:", erro);
    Alert.alert(
      "Erro",
      "Não foi possível carregar os livros. Tente novamente."
    );
    // Retornar estado seguro, não deixar aplicação quebrada
  }
}
```

### Logging (Estruturado)
- `console.log()` apenas para fluxos normais (backend)
- `console.error()` para erros de sistema
- `console.warn()` para advertências
- Nunca deixar código sem tratamento de erro na produção

### Exibição ao Usuário
- Usar `Alert.alert()` para mensagens de erro no frontend
- Mensagens em português, amigáveis e acionáveis
- Nunca mostrar stack traces ao usuário final

```typescript
// ✅ CORRETO
Alert.alert("Falha no Login", "E-mail ou senha incorretos.");

// ❌ ERRADO
Alert.alert("Error", JSON.stringify(error));
```

### Tratamento de Validação
- Validar entrada do usuário antes de enviar à API
- Validações devem ser funções reutilizáveis em `services/validacao.ts`

```typescript
function validarEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

if (!validarEmail(email)) {
  Alert.alert("Erro", "E-mail inválido.");
  return;
}
```

## Regras Que o Agente NUNCA Deve Violar

1. **NUNCA** usar `var`, apenas `const` e `let`
2. **NUNCA** deixar `console.log()` ou `// TODO` comentários no código de produção
3. **NUNCA** fazer requisições HTTP diretamente no componente UI (usar serviços)
4. **NUNCA** usar `any` sem documentação explícita `// @ts-ignore <razão>`
5. **NUNCA** modificar estrutura de pastas sem aprovação de arquitetura
6. **NUNCA** misturar português e inglês em nomes de variáveis (escolher um idioma por arquivo)
7. **NUNCA** usar callbacks profundos (callback hell) - preferir async/await
8. **NUNCA** deixar erros silenciados sem registro ou feedback ao usuário
9. **NUNCA** adicionar dependências sem atualizar `package.json` e documentar razão
10. **NUNCA** quebrar tipos TypeScript com `as any` como atalho (refatorar em vez disso)
11. **NUNCA** deixar componentes sem documentação de props e retorno esperado
12. **NUNCA** fazer deploy sem testar em device/emulador real

## Governance

A constituição é vinculante para todo desenvolvimento. Mudanças requerem:
1. Aprovação de arquiteto responsável
2. Discussão em equipe (se aplicável)
3. Atualização de versão (MAJOR/MINOR/PATCH)
4. Migração documentada de código existente

Violações detectadas em revisão de código devem ser:
- Solicitadas como alteração antes de merge
- Documentadas se aprovadas como exceção
- Analisadas em retrospectivas

**Versão**: 0.1.0 | **Ratificada**: 2026-05-18 | **Última Alteração**: 2026-05-18
