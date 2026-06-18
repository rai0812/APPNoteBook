@echo off
REM 🧪 Script de Execução dos Testes - Windows
REM Sistema de Recuperação de Senha - NoteBook App

cls
echo.
echo ╔════════════════════════════════════════════════════╗
echo ║   TESTES: Sistema de Recuperação de Senha         ║
echo ║   NoteBook App - Playwright + Detox              ║
echo ╚════════════════════════════════════════════════════╝
echo.

REM Cores usando ANSI
setlocal enabledelayedexpansion

echo.
echo [STEP 1/4] Instalando dependências...
call npm install --save-dev @playwright/test detox detox-cli
if errorlevel 1 (
    echo ❌ Erro ao instalar dependências
    pause
    exit /b 1
)
echo ✓ Dependências instaladas
echo.

echo [STEP 2/4] Backend
echo.
echo ⚠️  Abra outro terminal (NOVO) e execute um dos comandos:
echo.
echo   Opção 1:  npm run dev
echo   Opção 2:  json-server -w backend/db.json --port 3001
echo.
echo   Clique neste terminal quando o backend estiver rodando
echo   e pressione ENTER...
echo.
pause

echo.
echo [STEP 3/4] Executando Testes de API...
echo.

call npx playwright test test/api --verbose

if errorlevel 1 (
    echo.
    echo ⚠️  Alguns testes podem ter falhado
    echo    Pressione ENTER para ver o relatório...
    pause
) else (
    echo.
    echo ✓ Testes de API completados com sucesso!
    echo.
)

echo.
echo [STEP 4/4] Abrindo relatório...
echo.

call npx playwright show-report

echo.
echo ═══════════════════════════════════════════════════
echo ✓ TESTES CONCLUÍDOS!
echo ═══════════════════════════════════════════════════
echo.
echo 📊 Próximas ações:
echo.
echo   1. Revisar relatório HTML (aberto automaticamente)
echo   2. Analisar resultados em test-results\results.json
echo   3. Para E2E: Compilar app e usar Detox
echo      detox test e2e\recuperacao-senha.e2e.ts --configuration ios.sim.release
echo.
echo 📖 Documentação:
echo.
echo   - COMO-EXECUTAR-TESTES.md
echo   - EVIDENCIAS-TESTES.md
echo   - README-TESTES.md
echo.
echo ═══════════════════════════════════════════════════
echo.

pause
