@echo off
cd /d C:\SkillXchange\backend
start "" /b mvnw.cmd spring-boot:run
echo Backend started on port 8080