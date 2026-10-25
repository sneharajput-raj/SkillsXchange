# SkillSwap — System Assumptions & Constraints

```
==========================================================================
Document ID      : ASSUM-SKILLSWAP-V1
Scope            : Boundary Conditions, Technical Constraints & Assumptions
Target Audience  : Software Architects, Developers, Project Evaluators
==========================================================================
```

This document catalogs the fundamental assumptions, physical and software constraints, campus boundary conditions, and edge-case resolutions established for the SkillSwap MVP.

---

## 1. Business & Campus Domain Assumptions

1. **Single Institution Boundary**:
   - *Assumption*: The initial MVP serves exactly one college campus. All users share the same campus facilities and university email domain.
   - *Resolution*: Multi-campus tenant isolation is deferred to Phase 2; the database does not require a `tenant_id` column for MVP.

2. **Fixed Session Quantum (1 Hour = 1 Credit)**:
   - *Assumption*: To avoid fractional credit complexity and price bargaining, all tutoring appointments are standardized to **60-minute increments**.
   - *Resolution*: A session cannot be scheduled for 30 or 90 minutes in the MVP; long sessions must be booked as multiple discrete 1-hour slots.

3. **Incentive Cold-Start Assumption**:
   - *Assumption*: New students will hesitate to join if they cannot learn until they first spend an hour teaching.
   - *Resolution*: Every newly verified college email account is automatically endowed with **3 Skill Credits** upon registration.

4. **Honor System with Verification Safeguards**:
   - *Assumption*: College peers generally act in good faith when meeting on campus, but require structured safeguards against flakes and no-shows.
   - *Resolution*: The 6-digit mutual code guarantees that both students met before credits change hands, while post-session reviews provide transparent reputation feedback.

5. **No Monetary Integration**:
   - *Assumption*: SkillSwap is strictly a peer barter platform. Permitting fiat currency transactions would subject the platform to payment gateway fees, tax liabilities, and commercial tutoring commercialization.
   - *Resolution*: Real currency payments are strictly prohibited by code and terms of service.

---

## 2. Technical & Architectural Constraints

1. **Relational Database Engine (MySQL 8.0)**:
   - *Constraint*: Must run on MySQL 8.0 utilizing the InnoDB storage engine.
   - *Rationale*: InnoDB provides ACID compliance, foreign key cascade constraints, and row-level locking (`PESSIMISTIC_WRITE`) necessary for financial ledger integrity.

2. **Stateless Backend APIs**:
   - *Constraint*: Spring Boot backend must maintain zero server-side HTTP session state (`SessionCreationPolicy.STATELESS`).
   - *Rationale*: All authentication must be verified per-request via JWT Bearer headers, ensuring the backend can be horizontally scaled behind a load balancer without session clustering.

3. **External Video Call Hosting**:
   - *Constraint*: The application does not stream peer video or host video rooms natively in MVP.
   - *Rationale*: Hosting WebRTC media servers (Kurento, Jitsi) or paying for Twilio video tokens introduces prohibitive infrastructure costs and complexity for a college minor project. Students meet in physical campus spaces (Library, Labs) or share Google Meet links.

4. **Client-Side Platform Scope**:
   - *Constraint*: The platform is engineered as a responsive web Single Page Application (SPA) running in modern browsers (Chrome, Firefox, Safari, Edge).
   - *Rationale*: Eliminates the overhead of maintaining separate iOS and Android native apps while ensuring full mobile accessibility via responsive design.

---

## 3. Edge Cases & Boundary Resolutions

| Scenario / Edge Case | System Behavior & Technical Resolution |
| :--- | :--- |
| **Self-Swap Proposal** | The system prevents a student from swapping with themselves. The API enforces `sender_id != receiver_id` with a database `CHECK` constraint and backend validation. |
| **Teaching and Learning Same Skill** | A student cannot learn and teach the same skill unless their taught proficiency exceeds their desired learning proficiency (e.g., teaching Beginner Python while wanting to learn Advanced Python). |
| **Concurrent Double-Booking** | A student cannot confirm two overlapping sessions during the same date and hour window. The repository validates slot availability prior to confirmation. |
| **Simultaneous Credit Double-Spending** | If a student with 1 credit attempts to schedule two sessions concurrently, InnoDB row-level locking ensures that the first request deducts the credit to escrow, while the second request fails with `HTTP 402 InsufficientCreditsException`. |
| **No-Show by Tutor** | Learner files a report via `/api/v1/reports`. The session is placed in `DISPUTED` status, freezing the escrow credit until an administrator resolves the dispute and refunds the learner. |
| **Expired Swap Requests** | Swap proposals not accepted within 48 hours automatically transition to `EXPIRED` status, freeing up proposed time slots. |
