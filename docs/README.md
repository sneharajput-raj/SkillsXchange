# SkillSwap — Comprehensive Project Documentation

> **Tagline:** Learn. Teach. Exchange.  
> **Platform Type:** Peer-to-Peer College Skill Exchange Platform  
> **Target Audience:** College Students & Campus Administrators  
> **Architectural Paradigm:** Decoupled Single-Page Application (SPA) + Enterprise REST API + Relational Ledger  

---

## 1. Documentation Map & Navigation

This documentation suite provides a production-grade, end-to-end specification for building, testing, moderating, and evaluating the **SkillSwap** platform. All documents are cross-referenced, consistent, and designed to satisfy both software engineering best practices and academic project examination criteria.

| Document | Title | Description | Primary Audience |
| :--- | :--- | :--- | :--- |
| [`01_PROJECT_OVERVIEW.md`](./01_PROJECT_OVERVIEW.md) | Project Overview | Problem statement, value proposition, campus context, and objectives | Everyone |
| [`02_PRODUCT_REQUIREMENTS_DOCUMENT.md`](./02_PRODUCT_REQUIREMENTS_DOCUMENT.md) | Product Requirements Document (PRD) | User personas, journey maps, MVP vs. Phase 2 scope, and metrics | Product / Evaluators |
| [`03_FUNCTIONAL_AND_NONFUNCTIONAL_REQUIREMENTS.md`](./03_FUNCTIONAL_AND_NONFUNCTIONAL_REQUIREMENTS.md) | System Requirements (FR & NFR) | Traceable requirements with unique IDs (`FR-xxx`, `NFR-xxx`) | Engineers / QA |
| [`04_FEATURE_SPECIFICATION.md`](./04_FEATURE_SPECIFICATION.md) | Detailed Feature Specifications | Deep specification for all 22 platform features | Developers |
| [`05_USER_FLOWS.md`](./05_USER_FLOWS.md) | User Flows & Interactive Journeys | Mermaid sequence & flowcharts for end-to-end user actions | Designers / Devs |
| [`06_SYSTEM_ARCHITECTURE.md`](./06_SYSTEM_ARCHITECTURE.md) | System Architecture | C4 context, layered diagrams, Spring Boot + React topology | Architects |
| [`07_DATABASE_DESIGN.md`](./07_DATABASE_DESIGN.md) | Relational Database Design | 18 entities, Mermaid ERD, column constraints, indexes, keys | DBAs / Backend |
| [`08_API_SPECIFICATION.md`](./08_API_SPECIFICATION.md) | RESTful API Specification | OpenAPI-style contract endpoints, request/response payloads | Full-Stack Devs |
| [`09_AUTHENTICATION_AND_SECURITY.md`](./09_AUTHENTICATION_AND_SECURITY.md) | Authentication & Security Blueprint | JWT lifecycles, BCrypt, RBAC, campus email verification, OWASP | Security / Backend |
| [`10_MATCHING_ENGINE.md`](./10_MATCHING_ENGINE.md) | Intelligent Matching Engine | Deterministic 100-pt scoring algorithm, formulas, breakdown | Algorithm / Backend |
| [`11_SKILL_CREDIT_SYSTEM.md`](./11_SKILL_CREDIT_SYSTEM.md) | Skill Credit Economics & Ledger | Escrow mechanisms, double-spending defense, audit transactions | Backend / Finance |
| [`12_SESSION_LIFECYCLE.md`](./12_SESSION_LIFECYCLE.md) | Session Lifecycle & State Machine | Finite State Machine (FSM), 6-digit OTP verification protocol | Backend / QA |
| [`13_NOTIFICATION_AND_CHAT_SYSTEM.md`](./13_NOTIFICATION_AND_CHAT_SYSTEM.md) | Notification & In-App Chat | Messaging model, event bus, polling/WebSocket migration | Full-Stack Devs |
| [`14_ADMIN_DASHBOARD.md`](./14_ADMIN_DASHBOARD.md) | Admin Moderation & Analytics | Dispute arbitration, audit logs, skill supply/demand metrics | Admin / Backend |
| [`15_UI_UX_SPECIFICATION.md`](./15_UI_UX_SPECIFICATION.md) | UI/UX Design System & Layouts | Tailwind theme, wireframe specs for all 15 screens, empty states | Frontend / UI-UX |
| [`16_FRONTEND_ARCHITECTURE.md`](./16_FRONTEND_ARCHITECTURE.md) | Frontend Architecture (React) | React 18, Vite, routing guards, Axios interceptors, state hooks | Frontend Devs |
| [`17_BACKEND_ARCHITECTURE.md`](./17_BACKEND_ARCHITECTURE.md) | Backend Architecture (Spring Boot) | Spring Boot 3, packages, DTOs, service isolation, exceptions | Backend Devs |
| [`18_TESTING_STRATEGY.md`](./18_TESTING_STRATEGY.md) | Testing Strategy & Test Suites | JUnit 5, Mockito, Postman suites, concurrency test scenarios | QA / Developers |
| [`19_DEPLOYMENT_GUIDE.md`](./19_DEPLOYMENT_GUIDE.md) | Deployment & Operations Guide | Local run instructions, Docker Compose, cloud deployment recipes | DevOps / SysAdmin |
| [`20_DEVELOPMENT_ROADMAP.md`](./20_DEVELOPMENT_ROADMAP.md) | 6-Phase Development Roadmap | Sprint breakdown, task dependencies, Definition of Done (DoD) | Project Managers |
| [`21_FUTURE_SCOPE.md`](./21_FUTURE_SCOPE.md) | Future Enhancements & Vision | WebRTC peer video, AI vector embeddings, multi-campus federated | Future Devs |
| [`22_COLLEGE_PROJECT_REPORT.md`](./22_COLLEGE_PROJECT_REPORT.md) | Formal Academic Project Report | University-standard thesis/report chapters 1 through 10 | Academic Jury |
| [`23_GLOSSARY.md`](./23_GLOSSARY.md) | Domain Glossary & Terminology | Standardized definitions of campus skill exchange terms | All Readers |
| [`24_ASSUMPTIONS_AND_CONSTRAINTS.md`](./24_ASSUMPTIONS_AND_CONSTRAINTS.md) | System Assumptions & Constraints | Technical, organizational, and business scope boundaries | All Readers |
| [`25_ARCHITECTURAL_DECISIONS.md`](./25_ARCHITECTURAL_DECISIONS.md) | Architecture Decision Records (ADR) | 6 formal ADRs documenting key technological choices | Architects |
| [`IMPLEMENTATION_CHECKLIST.md`](./IMPLEMENTATION_CHECKLIST.md) | Developer Implementation Checklist | Granular phase-by-phase task checklist for hands-on building | Developers |

---

## 2. Core System Concept

SkillSwap democratizes knowledge exchange within higher education institutions. Rather than relying on commercial tutors or unvetted online resources, students trade their existing expertise (e.g., Python, Figma, French, Digital Marketing, Data Structures) in exchange for **Skill Credits**. These credits can then be spent to learn other skills from peers.

```
       [ Student A: Knows Java, Wants React ]
                         │
        (Teaches Java)   │   (Earns 1 Credit)
                         ▼
             [ Skill Credit Ledger ]
                         │
      (Spends 1 Credit)  │   (Learns React)
                         ▼
       [ Student B: Knows React, Wants Java ]
```

### Key Highlights
- **Cashless Campus Economy**: Operates on a virtual Skill Credit model where 1 credit = 1 hour of validated peer instruction.
- **Escrow-Backed Integrity**: Prevents fraud and double-spending by locking credits when sessions are scheduled and releasing them only upon mutual 6-digit session code verification.
- **Explainable Matching**: An algorithmic match score (0–100) breaks down exactly why two students are compatible based on skills, availability, and reputation.
- **Campus Verified**: Restricted to institutional email domains (`.edu` / `.ac.in`), fostering a safe, accountable, and localized community.

---

## 3. Technology Stack Summary

- **Frontend**: React 18, Vite, JavaScript (ES6+), Tailwind CSS, React Router v6, Axios, Lucide Icons
- **Backend**: Java 25 LTS, Spring Boot 3.5.x, Spring Security 6, Spring Data JPA, Hibernate
- **Database**: MySQL 8.0 (InnoDB, ACID compliant, Row-level Locking)
- **Security**: Stateless JWT (Access + Refresh Token), BCrypt (Strength 12), Role-Based Access Control (RBAC)
- **Testing**: JUnit 5, Mockito, MockMvc, Postman Collections, Vitest
