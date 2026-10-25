# SkillSwap — Developer Implementation Checklist

This checklist tracks the chronological implementation of the **SkillSwap** college minor project. Each task represents an atomic unit of work with clear verification gates.

---

## Phase 1: Foundations, Database & Authentication

- [ ] **Repository & Tooling Setup**
  - [ ] Initialize Git repository with standard `.gitignore` for Java/Spring and Node/React.
  - [ ] Configure root documentation link to `docs/`.
  - [ ] Set up MySQL 8.0 local database instance (`skillswap_db`).
- [ ] **Spring Boot 3 Project Setup**
  - [ ] Initialize Spring Boot 3 with Java 25 LTS using Maven/Gradle.
  - [ ] Add dependencies: `spring-boot-starter-web`, `spring-boot-starter-security`, `spring-boot-starter-data-jpa`, `mysql-connector-j`, `jjwt-api`, `lombok`, `spring-boot-starter-validation`.
  - [ ] Configure `application.yml` with database credentials, JWT secret keys, and email service properties.
  - [ ] Implement standard API response envelope (`ApiResponse<T>`) and Global Exception Handler (`@RestControllerAdvice`).
- [ ] **Authentication & Security Implementation**
  - [ ] Create `User` and `Role` entities in MySQL.
  - [ ] Implement `PasswordEncoder` bean using BCrypt (strength 12).
  - [ ] Build `JwtTokenProvider` (generate, validate, extract claims for access & refresh tokens).
  - [ ] Configure `SecurityFilterChain` with stateless session management and JWT authentication filter.
  - [ ] Implement `/api/v1/auth/register` with college email regex check and 6-digit OTP generation.
  - [ ] Implement `/api/v1/auth/verify-email` to activate user accounts and initialize the credit wallet (+3 signup credits).
  - [ ] Implement `/api/v1/auth/login` and `/api/v1/auth/refresh-token`.
  - [ ] Write JUnit/Mockito unit tests for Auth service and MockMvc integration tests.

---

## Phase 2: Profiles, Skills & Availability

- [ ] **Data Model & Repositories**
  - [ ] Create entities: `StudentProfile`, `Department`, `SkillCategory`, `Skill`, `UserTeachSkill`, `UserLearnSkill`, `Availability`.
  - [ ] Seed standard categories (Computer Science, Design, Languages, Business, Academics) and common skills.
- [ ] **Profile Management API**
  - [ ] Build endpoints to view and update student profile (`GET/PUT /api/v1/profiles/me`).
  - [ ] Build endpoints to add, list, and delete "skills I can teach" (`POST/GET/DELETE /api/v1/profiles/me/teach-skills`).
  - [ ] Build endpoints to add, list, and delete "skills I want to learn" (`POST/GET/DELETE /api/v1/profiles/me/learn-skills`).
  - [ ] Build endpoints to set recurring weekly availability slots (`PUT /api/v1/profiles/me/availability`).
- [ ] **Public Discovery API**
  - [ ] Implement `/api/v1/students` with keyword search, category filter, proficiency filter, and day-of-week filter.
  - [ ] Implement `/api/v1/students/{id}` returning public profile sanitized of private contact details.

---

## Phase 3: Matching Engine & Search

- [ ] **Matching Logic Implementation**
  - [ ] Implement `MatchingEngineService` evaluating:
    - Direct mutual swap compatibility (40 pts)
    - Skill proficiency level compatibility (20 pts)
    - Availability time-window overlap (20 pts)
    - Student rating & reliability score (10 pts)
    - Department & learning mode proximity (10 pts)
  - [ ] Generate structured score breakdown explanations (`MatchExplanationDto`).
  - [ ] Build endpoint `GET /api/v1/matches` returning ranked candidate students.
  - [ ] Build endpoint `GET /api/v1/matches/{targetStudentId}` returning detailed compatibility breakdown.
- [ ] **Matching Engine Testing**
  - [ ] Write unit tests for exact 100% mutual matches.
  - [ ] Write unit tests for partial matches and zero-overlap edge cases.

---

## Phase 4: Swaps, Sessions & Skill Credit System

- [ ] **Skill Credit Wallet & Escrow Ledger**
  - [ ] Create `CreditWallet` and `CreditTransaction` entities.
  - [ ] Implement atomic wallet operations with pessimistic locking (`SELECT ... FOR UPDATE`).
  - [ ] Create methods: `grantInitialCredits`, `holdInEscrow`, `settleEscrowToTeacher`, `refundEscrowToLearner`.
- [ ] **Swap Request Lifecycle**
  - [ ] Create `SwapRequest` entity with statuses: `PENDING`, `ACCEPTED`, `REJECTED`, `CANCELLED`, `EXPIRED`.
  - [ ] Implement `POST /api/v1/swaps` (validates sender != receiver, validates learner has >= 1 available credit).
  - [ ] Implement `PUT /api/v1/swaps/{id}/accept` and `PUT /api/v1/swaps/{id}/reject`.
- [ ] **Session Management & Verification Protocol**
  - [ ] Create `Session` and `SessionVerificationCode` entities.
  - [ ] Implement `POST /api/v1/sessions` (places 1 credit in `ESCROW_HOLD` upon confirmation).
  - [ ] Implement 6-digit mutual session verification code generation.
  - [ ] Implement `POST /api/v1/sessions/{id}/complete` verifying the code, transitioning session to `COMPLETED`, and releasing escrowed credit to the teacher.
  - [ ] Implement cancellation rules (`POST /api/v1/sessions/{id}/cancel`) with 2-hour policy window and automatic escrow refund.
  - [ ] Implement dispute lodging (`POST /api/v1/sessions/{id}/dispute`).

---

## Phase 5: Reviews, Chat, Notifications & Administration

- [ ] **Reviews & Ratings**
  - [ ] Create `Review` entity enforcing unique constraint `(session_id, reviewer_id)`.
  - [ ] Build `POST /api/v1/sessions/{id}/reviews` allowing rating (1-5) and feedback only for `COMPLETED` sessions.
  - [ ] Auto-recalculate teacher average rating and update profile upon review submission.
- [ ] **In-App Messaging & Notifications**
  - [ ] Create `Conversation`, `Message`, and `Notification` entities.
  - [ ] Build chat endpoints (`GET /api/v1/conversations`, `POST /api/v1/conversations/{id}/messages`).
  - [ ] Build notification polling and mark-as-read endpoints (`GET/PUT /api/v1/notifications`).
- [ ] **Reporting & Moderation**
  - [ ] Create `Report` and `AdminAuditLog` entities.
  - [ ] Build student reporting endpoint (`POST /api/v1/reports`).
- [ ] **Admin Dashboard Backend**
  - [ ] Secure `/api/v1/admin/**` endpoints with `@PreAuthorize("hasRole('ADMIN')")`.
  - [ ] Endpoints for user management (suspend, activate), dispute arbitration, and audit trail viewing.
  - [ ] Endpoints for skill supply vs. demand analytics.

---

## Phase 6: Frontend Development (React + Vite + Tailwind)

- [ ] **Frontend Foundation**
  - [ ] Scaffold React project with Vite and Tailwind CSS.
  - [ ] Configure React Router v6 with `AuthContext` and protected route wrappers.
  - [ ] Configure Axios instance with base URL, bearer token attachment, and 401 refresh interceptor.
- [ ] **Page & Component Implementation**
  - [ ] Landing Page (`/`) with value proposition, search preview, and hero section.
  - [ ] Login (`/login`) & Registration (`/register`) with OTP verification dialog.
  - [ ] Onboarding Wizard (`/onboarding`) for setting initial teach skills, learn skills, and availability.
  - [ ] Student Dashboard (`/dashboard`) summarizing credit balance, upcoming sessions, and pending swaps.
  - [ ] Discover Page (`/discover`) with search bar, multi-attribute filter chips, and student cards.
  - [ ] Match Detail Modal / Page with visual score breakdown meters.
  - [ ] Skill Management Page (`/my-skills`) to edit teach and learn inventories.
  - [ ] Availability Scheduler (`/availability`) with interactive weekly time-block grid.
  - [ ] Swap Requests Manager (`/swaps`) with incoming/outgoing tabs.
  - [ ] Sessions View (`/sessions`) with upcoming/past tabs, countdown, and OTP verification modal.
  - [ ] Wallet & Transaction History (`/wallet`) showing credit balance and ledger table.
  - [ ] In-App Chat (`/messages`) with conversation sidebar and message bubbles.
  - [ ] Notifications Bell Dropdown & Page (`/notifications`).
  - [ ] Student Public Profile (`/profile/:id`) and Settings (`/settings`).
  - [ ] Admin Console (`/admin`) with stats cards, dispute resolution table, and user audit controls.

---

## Phase 7: Verification, Documentation & Defense Preparation

- [ ] **Automated & Integration Testing**
  - [ ] Run complete backend test suite (`mvn test`) achieving >= 80% business logic coverage.
  - [ ] Run Postman collection verifying all REST endpoints.
  - [ ] Test edge cases: double-booking time slots, double-spending credits, self-requests.
- [ ] **Academic Report & Defense Material**
  - [ ] Compile final College Project Report matching university syllabus requirements (`docs/22_COLLEGE_PROJECT_REPORT.md`).
  - [ ] Prepare live demonstration script and slide deck based on architectural documents.
