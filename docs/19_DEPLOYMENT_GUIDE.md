# SkillSwap — Deployment & Operations Guide

```
==========================================================================
Document ID      : DEPL-SKILLSWAP-V1
Target Platforms : Local Development (Docker Compose) & Free/Student Cloud
Supported Runtimes: Java 25 LTS, Node.js 18/20 LTS, MySQL 8.0
Security Baseline: Zero Hardcoded Credentials / Environment Secret Injection
==========================================================================
```

This document provides step-by-step instructions for provisioning, configuring, running, and deploying SkillSwap locally and in production cloud environments.

---

## 1. Local Development Setup

### 1.1 Prerequisites
- **Java Development Kit (JDK)**: Version 25 (Temurin / Oracle OpenJDK).
- **Node.js**: Version 18.x or 20.x with `npm` >= 9.x.
- **MySQL Server**: Version 8.0.x (or Docker engine).
- **Git**: For source version control.

---

### 1.2 Local Database Initialization
Log into MySQL and execute the bootstrap script:
```sql
CREATE DATABASE skillswap_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'skillswap_user'@'localhost' IDENTIFIED BY 'DevSecret@2026';
GRANT ALL PRIVILEGES ON skillswap_db.* TO 'skillswap_user'@'localhost';
FLUSH PRIVILEGES;
```

---

### 1.3 Backend Setup & Execution (Spring Boot)
1. Navigate to backend directory:
   ```bash
   cd skillswap-backend
   ```
2. Configure local environment variables in `.env` or application profile:
   ```properties
   # application-dev.properties
   SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/skillswap_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
   SPRING_DATASOURCE_USERNAME=skillswap_user
   SPRING_DATASOURCE_PASSWORD=DevSecret@2026
   SPRING_JPA_HIBERNATE_DDL_AUTO=update
   
   JWT_SECRET=c2tpbGxzd2FwLXNlY3VyZS1leGFtcGxlLTI1Ni1iaXQta2V5LTIwMjY=
   JWT_EXPIRATION_MS=900000
   JWT_REFRESH_EXPIRATION_MS=604800000
   
   APP_EMAIL_DOMAIN_REGEX=^[A-Za-z0-9._%+-]+@([A-Za-z0-9.-]+\\.)?(college\\.edu|university\\.ac\\.in)$
   ```
3. Build and execute:
   ```bash
   ./mvnw clean spring-boot:run
   ```
   Backend listens at `http://localhost:8080`.

---

### 1.4 Frontend Setup & Execution (React + Vite)
1. Navigate to frontend directory:
   ```bash
   cd skillswap-frontend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables in `.env.local`:
   ```env
   VITE_API_BASE_URL=http://localhost:8080/api/v1
   ```
4. Start development server:
   ```bash
   npm run dev
   ```
   Frontend is accessible at `http://localhost:5173`.

---

## 2. Docker Compose One-Click Development Stack

Create `docker-compose.yml` in the project root:

```yaml
version: '3.8'

services:
  database:
    image: mysql:8.0
    container_name: skillswap-mysql
    restart: always
    environment:
      MYSQL_DATABASE: skillswap_db
      MYSQL_USER: skillswap_user
      MYSQL_PASSWORD: DevPassword@123
      MYSQL_ROOT_PASSWORD: RootPassword@123
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql

  backend:
    build: ./skillswap-backend
    container_name: skillswap-api
    restart: on-failure
    depends_on:
      - database
    environment:
      SPRING_DATASOURCE_URL: jdbc:mysql://database:3306/skillswap_db?useSSL=false
      SPRING_DATASOURCE_USERNAME: skillswap_user
      SPRING_DATASOURCE_PASSWORD: DevPassword@123
      JWT_SECRET: ${JWT_SECRET:-c2tpbGxzd2FwLXNlY3VyZS1leGFtcGxlLTI1Ni1iaXQta2V5LTIwMjY=}
    ports:
      - "8080:8080"

  frontend:
    build: ./skillswap-frontend
    container_name: skillswap-ui
    restart: always
    depends_on:
      - backend
    ports:
      - "80:80"

volumes:
  mysql_data:
```

---

## 3. Production Deployment Recipes (Free / Student Tier)

### 3.1 Database (Aiven / Railway / PlanetScale)
- Provision a free managed MySQL 8.0 instance on Aiven or Railway.
- Obtain connection URL with SSL enabled (`sslmode=REQUIRED`).

### 3.2 Backend Service (Render / Railway / Fly.io)
- Connect GitHub repository.
- Specify build command: `./mvnw clean package -DskipTests`.
- Specify run command: `java -jar target/skillswap-0.0.1-SNAPSHOT.jar`.
- Set environment variables securely in dashboard: `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, `SPRING_DATASOURCE_PASSWORD`, `JWT_SECRET`.

### 3.3 Frontend Hosting (Vercel / Netlify)
- Deploy frontend directory to Vercel or Netlify.
- Set Build Command: `npm run build`.
- Set Output Directory: `dist`.
- Set `VITE_API_BASE_URL` to production backend URL (e.g., `https://skillswap-api.onrender.com/api/v1`).
- Configure single-page application redirect rule in `_redirects`:
  ```
  /*    /index.html   200
  ```

---

## 4. Security & Operational Checklist Before Demo

- [ ] All passwords and JWT secrets injected through environment variables; zero hardcoded credentials in Git.
- [ ] CORS whitelist configured strictly for production frontend domain.
- [ ] Database backups configured (nightly `mysqldump` script).
- [ ] HTTPS enforced across both frontend and API routes.
