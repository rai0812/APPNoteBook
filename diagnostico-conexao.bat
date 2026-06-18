@echo off
REM 🔍 Diagnóstico de Conexão para Testes - Windows

cls
echo.
echo ╔═══════════════════════════════════════════════════════════╗
echo ║         🔍 DIAGNÓSTICO DE CONEXÃO - TESTES               ║
echo ║         Sistema de Recuperação de Senha                  ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.

REM Configurações
set API_URL=http://172.20.10.2:3001
set API_HOST=172.20.10.2
set API_PORT=3001

echo 📋 Configuração:
echo   API_URL: %API_URL%
echo   Host: %API_HOST%
echo   Porta: %API_PORT%
echo.

REM 1. Testar conectividade com ping
echo [1/3] Testando conectividade (ping)...
ping -n 1 %API_HOST% >nul 2>&1
if errorlevel 1 (
    echo ✗ Host %API_HOST% NÃO está acessível
    echo   → Verifique se está conectado à rede WiFi correta
    echo   → Verifique o firewall
) else (
    echo ✓ Host %API_HOST% está acessível
)
echo.

REM 2. Testar porta com PowerShell
echo [2/3] Testando porta %API_PORT%...
powershell -Command "try { $socket = New-Object System.Net.Sockets.TcpClient; $socket.Connect('%API_HOST%', %API_PORT%); $socket.Close(); Write-Host '✓ Porta %API_PORT% está respondendo' -ForegroundColor Green } catch { Write-Host '✗ Porta %API_PORT% NÃO está respondendo' -ForegroundColor Red; Write-Host '  → Verifique se json-server está rodando' }"
echo.

REM 3. Testar endpoint específico
echo [3/3] Testando endpoint /api/recuperar-senha...
powershell -Command "try { $response = Invoke-WebRequest -Uri '%API_URL%/api/recuperar-senha' -Method POST -ContentType 'application/json' -Body '{\"email\":\"teste@email.com\"}' -TimeoutSec 2; Write-Host ('✓ Endpoint respondendo com status ' + $response.StatusCode) -ForegroundColor Green } catch { Write-Host ('✗ Erro ao conectar: ' + $_.Exception.Message) -ForegroundColor Red }"
echo.

echo ╔═══════════════════════════════════════════════════════════╗
echo 📝 PRÓXIMOS PASSOS:
echo ╚═══════════════════════════════════════════════════════════╝
echo.
echo 1️⃣  Se backend está OK:
echo    npx playwright test test/api/recuperacao-senha.spec.ts
echo.
echo 2️⃣  Se backend NÃO está rodando:
echo    npx json-server --watch backend/db.json --port 3001
echo.
echo 3️⃣  Para rodar testes com debug:
echo    npx playwright test test/api/recuperacao-senha.spec.ts --debug
echo.
echo 4️⃣  Ver relatório:
echo    npx playwright show-report
echo.
pause
