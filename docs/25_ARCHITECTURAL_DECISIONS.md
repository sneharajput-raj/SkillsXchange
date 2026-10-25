# SkillSwap — Architecture Decision Records (ADR)

```
==========================================================================
Document ID      : ADR-SKILLSWAP-V1
Format Standard  : Michael Nygard Architecture Decision Record (ADR)
Scope            : Core Architectural Choices & Trade-Off Analyses
==========================================================================
```

This document records the foundational architectural decisions, context, rationale, and consequences established for the SkillSwap engineering blueprint.

---

## ADR-001: Selection of Relational Database (MySQL 8.0) over NoSQL

### Status
Accepted

### Context
SkillSwap operates a virtual credit economy where students earn, spend, lock in escrow, and transfer Skill Credits. Financial movements require strict transactional guarantees to prevent credit duplication, balance inconsistencies, and double-spending races. Furthermore, the domain model features deeply interconnected entities (Users, Skills, Categories, Swaps, Sessions, Reviews, Transactions).

### Decision
Adopt **MySQL 8.0 with InnoDB Storage Engine** as the primary datastore rather than a NoSQL document store (such as MongoDB).

### Consequences
- **Positive**:
  - Full ACID compliance ensures transactional integrity during credit movements (`@Transactional`).
  - Native foreign key constraints and check constraints (`CHECK (balance >= 0)`) prevent orphan rows and impossible financial states.
  - InnoDB row-level locking (`SELECT ... FOR UPDATE`) enables safe concurrent balance mutations.
  - Complex relational joins allow performant multi-factor matching queries.
- **Negative**:
  - Database schema changes require structured migration scripts rather than dynamic schemaless flexibility.

---

## ADR-002: Stateless JWT Authentication with Refresh Token Rotation

### Status
Accepted

### Context
The application must authenticate users securely across web and mobile clients while minimizing server memory overhead and enabling horizontal scalability. College campus firewalls frequently disconnect stateful socket sessions, requiring resilient authentication.

### Decision
Implement **Stateless JSON Web Token (JWT) Authentication** using Spring Security 6:
- Access Tokens: Short-lived (15 minutes), signed with HMAC-SHA256, transmitted via `Authorization: Bearer <token>` header.
- Refresh Tokens: Long-lived (7 days), stored securely and rotated upon access token refresh.

### Consequences
- **Positive**:
  - Eliminates server-side session memory consumption (`SessionCreationPolicy.STATELESS`).
  - Decouples client and server; APIs can be consumed identically by web or future mobile clients.
  - Fine-grained role enforcement (`ROLE_STUDENT`, `ROLE_ADMIN`) embedded directly in token claims.
- **Negative**:
  - Tokens cannot be revoked before expiration unless a token blacklist or database version check is consulted.

---

## ADR-003: Monolithic Spring Boot Backend over Microservices

### Status
Accepted

### Context
Modern distributed architectures often advocate for microservices (e.g., Auth Service, Match Service, Wallet Service, Notification Service). However, SkillSwap is a college minor project with a single deployment team, limited server resources, and low-latency transactional boundaries.

### Decision
Structure the backend as a **Modular Monolith** using **Spring Boot 3.x**, organizing modules by domain packages (`controller`, `service`, `repository`, `entity`).

### Consequences
- **Positive**:
  - Radically simplified local setup, debugging, and deployment (single JAR).
  - Eliminates distributed transaction complexity (Saga patterns, two-phase commits); wallet and session operations run in a single local ACID transaction.
  - Zero inter-service network latency and zero operational overhead of service meshes or Kubernetes.
- **Negative**:
  - All domain modules share the same runtime process and database connection pool.

---

## ADR-004: React 18 + Vite + Tailwind CSS for Single-Page Frontend

### Status
Accepted

### Context
The frontend needs to be fast, responsive across desktop and mobile devices, and capable of dynamic interactive features (such as weekly availability grids and real-time match meters). Traditional server-rendered templates (Thymeleaf, JSP) produce clunky full-page reloads and poor mobile user experiences.

### Decision
Build a client-side Single-Page Application (SPA) using **React 18**, bundled with **Vite**, and styled with **Tailwind CSS**.

### Consequences
- **Positive**:
  - Vite provides sub-second HMR (Hot Module Replacement) and optimized production bundles.
  - Tailwind CSS enables rapid, utility-first styling with consistent design tokens and zero CSS bloat.
  - Pure separation of UI from backend; frontend can be deployed to global CDNs (Vercel, Netlify) for free.
- **Negative**:
  - Client-side rendering requires handling initial loading shimmers and managing browser routing guards explicitly.

---

## ADR-005: Escrow Model with Database Row-Level Locking for Credit Safety

### Status
Accepted

### Context
In a cashless barter platform, students might schedule multiple sessions simultaneously with multiple mentors when they only have 1 credit in their wallet. If both sessions are confirmed concurrently, the student would spend credits they do not possess.

### Decision
Implement an **Escrow Hold State** combined with **Pessimistic Row-Level Database Locking**:
1. When a session is booked, 1 credit is atomically decremented from `balance` and incremented to `escrow_balance` under a `PESSIMISTIC_WRITE` lock.
2. The credit is transferred to the teacher's wallet only upon successful completion.

### Consequences
- **Positive**:
  - Completely eliminates the double-spending concurrency vulnerability.
  - Guarantees that scheduled sessions always have reserved credits backing them.
- **Negative**:
  - A locked row briefly serializes concurrent transactions on the same wallet, but this is negligible for individual student traffic.

---

## ADR-006: Deterministic Weighted Match Algorithm over Black-Box Machine Learning

### Status
Accepted

### Context
Matching platforms often consider machine learning or collaborative filtering. However, for a college minor project with a new platform:
1. No historical interaction dataset exists to train ML models (cold-start problem).
2. Students require transparent, explainable reasons why they were paired with a peer.
3. Black-box models are difficult to evaluate and demonstrate in academic project defense vivas.

### Decision
Implement a **Deterministic 100-Point Multi-Criteria Weighted Scoring (MCWS) Algorithm**:
- Mutual Swap Match: 40 points
- Skill Proficiency Alignment: 20 points
- Availability Overlap: 20 points
- Reputation Rating: 10 points
- Mode & Department Alignment: 10 points

### Consequences
- **Positive**:
  - 100% explainable: The system returns an exact itemized breakdown of why the score was given.
  - Zero cold-start latency; functions immediately with newly registered profiles.
  - Highly performant: Computes in under 300ms using relational indexed queries.
  - Evaluator-friendly: Examiners can inspect formulas and verify mathematical calculations directly.
- **Negative**:
  - Cannot automatically capture subtle semantic synonyms without exact category or skill tag overlap (addressed in Phase 2 via vector embeddings).
