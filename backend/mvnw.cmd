@REM ----------------------------------------------------------------------------
@REM SkillSwap Maven Wrapper for Windows
@REM ----------------------------------------------------------------------------
@echo off
setlocal

set "DIR=%~dp0"

if exist "%DIR%..\.tools\apache-maven-3.9.6\bin\mvn.cmd" (
    call "%DIR%..\.tools\apache-maven-3.9.6\bin\mvn.cmd" %*
    exit /b %ERRORLEVEL%
)

where mvn >nul 2>nul
if %ERRORLEVEL% equ 0 (
    call mvn %*
    exit /b %ERRORLEVEL%
)

echo [ERROR] Maven not found. Please ensure Java 25 and Maven are installed.
exit /b 1
