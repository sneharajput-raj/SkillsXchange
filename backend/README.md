# SkillSwap — Backend Service (Spring Boot 3 REST API)

This directory contains the standalone Java Spring Boot 3 REST API backend for the SkillSwap peer-to-peer college skill exchange platform.

---

## 1. Technology Stack
- **Language**: Java 25 LTS
- **Framework**: Spring Boot 3.5.16
- **Security**: Spring Security 6.2 (Stateless JWT + BCrypt)
- **Data & Persistence**: Spring Data JPA + Hibernate ORM 6.4
- **Database**: MySQL 8.0 (InnoDB engine, utf8mb4)
- **Token Handling**: JJWT 0.12.5 (HMAC-SHA256)
- **Testing**: JUnit 5, Mockito, SpringBootTest, H2 Database 2.2

---

## 2. Prerequisites
1. **Java JDK 25** installed and configured on your system `PATH` (Eclipse Adoptium / Temurin OpenJDK 25 recommended).
2. **MySQL Server 8.0** running locally on port `3306`.

---

## 3. Database Setup (MySQL)
Before running the backend against MySQL, connect to your MySQL instance and execute:
```sql
CREATE DATABASE IF NOT EXISTS skillswap_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

The initial schema and taxonomy seed data are provided in:
- `src/main/resources/schema.sql` (18 normalized tables matching `docs/07_DATABASE_DESIGN.md`)
- `src/main/resources/data.sql` (Seed departments, skill categories, and 18 master skills)

---

## 4. Configuration & Environment Variables
The application reads settings from `src/main/resources/application.yml`. You can configure your environment variables or provide them via command line / `.env`:

| Environment Variable | Description | Default Fallback Value |
| :--- | :--- | :--- |
| `SPRING_DATASOURCE_URL` | MySQL JDBC URL | `jdbc:mysql://localhost:3306/skillswap_db?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC&createDatabaseIfNotExist=true` |
| `SPRING_DATASOURCE_USERNAME` | Database Username | `root` |
| `SPRING_DATASOURCE_PASSWORD` | Database Password | `root` |
| `JWT_SECRET` | Base64 256-bit Secret Key | Configurable via environment variable (default test secret in yml) |
| `CORS_ALLOWED_ORIGINS` | Permitted Frontend Origins | `http://localhost:5173,http://localhost:3000` |

---

## 5. Running the Backend Locally

### Using the Included Maven Wrapper:
```bash
# Windows PowerShell / CMD
.\mvnw.cmd spring-boot:run

# Linux / macOS
./mvnw spring-boot:run
```

The server will start at `http://localhost:8080`.

---

## 6. Testing & In-Memory Database (H2) Configuration

Automated test suites use the dedicated `application-test.yml` configuration:
```bash
# Run automated tests
.\mvnw.cmd test
```

### H2 Test Database Compatibility Limitations:
Automated test suites utilize H2 (`jdbc:h2:mem:skillswap_test;MODE=MySQL;DB_CLOSE_DELAY=-1`) to run without requiring a live, external MySQL instance. 
Please note the following compatibility considerations:
1. **Compatibility Mode**: H2 operates with `MODE=MySQL` emulation, which accepts MySQL DDL syntax but is not an exact binary replica of MySQL 8.0 InnoDB.
2. **ENUM Column Generation**: In H2, JPA generates ENUM columns as `VARCHAR(255)` rather than native MySQL ENUM types.
3. **Pessimistic Locking**: Row-level locking (`SELECT ... FOR UPDATE`) is simulated in-memory by H2 and verified under standard Spring `@Transactional` boundaries. Production concurrency tests should be run against a real MySQL 8.0 container.
4. **Transient State**: The H2 database is created and dropped per test run (`create-drop`), preserving zero state between runs.

---

## 7. Package Layout
- `com.skillswap.config`: Security, CORS, JWT, and WebMvc configurations.
- `com.skillswap.entity`: 18 JPA entities matching `docs/07_DATABASE_DESIGN.md`.
- `com.skillswap.repository`: 19 Spring Data JPA repositories with custom queries and locking mechanisms.
- `com.skillswap.dto`: Request/response transfer objects and standard envelopes (`ApiResponse<T>`, `ApiErrorResponse`).
- `com.skillswap.service`: Business logic services (to be wired in Step 2).
- `com.skillswap.controller`: REST API controllers (to be wired in Step 2).
