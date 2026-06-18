# 📘 Software Design Description (SDD) - NoteBookApp

## 1. Descrição do Sistema
O NoteBookApp é uma aplicação mobile e web focada no gerenciamento de notas pessoais e segurança de acesso do usuário.

## 2. Arquitetura do Sistema
O projeto é estruturado utilizando a arquitetura padrão do Expo (React Native), dividida em:
- **Camada de Visão (UI):** Telas de Login, Cadastro e Recuperação de Senha.
- **Camada de Navegação:** Gerenciada centralizadamente via `AppNavigator.tsx`.
- **Camada de Serviços:** Integração com APIs externas e lógica de negócios isolada em JavaScript/TypeScript strict mode.

## 3. Fluxo de Controle (Recuperação de Senha)
1. Usuário solicita o reset enviando o e-mail pela interface.
2. O sistema valida localmente os formatos antes de submeter à API de autenticação.