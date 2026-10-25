# SkillSwap — Product Requirements Document (PRD)

```
==========================================================================
Document ID      : PRD-SKILLSWAP-V1
Project Name     : SkillSwap
Status           : Approved for MVP Implementation
Target Release   : College Minor Project MVP
Stakeholders     : Students, Faculty Evaluators, System Administrators
==========================================================================
```

---

## 1. Product Vision & Goals

### 1.1 Vision Statement
To establish a self-sustaining, cashless peer-learning network across the university campus that empowers every student to teach their strengths, master their weaknesses, and collaborate across academic disciplines.

### 1.2 Core Product Goals
1. **Zero-Cost Access**: Ensure 100% of peer teaching transactions are mediated by time-based Skill Credits rather than fiat currency.
2. **High Match Success Rate**: Enable students to discover compatible learning partners in under 60 seconds with explainable match metrics.
3. **Commitment & Reliability**: Reduce ghosting and no-shows to under 5% through calendar slot negotiation, automated escrow locking, and mutual 6-digit verification codes.
4. **Campus Safety & Privacy**: Guarantee verified institutional identity while preserving personal privacy (phone numbers/emails hidden until mutual swap confirmation).

---

## 2. User Personas

### Persona 1: Rohan Sharma (The Code Specialist Seeking Design Mentorship)
- **Role / Major**: 3rd Year B.Tech Computer Science student.
- **Can Teach**: Java, Spring Boot, Data Structures & Algorithms (DSA), Git.
- **Wants to Learn**: UI/UX Design, Figma, Tailwind CSS.
- **Pain Points**: 
  - Building a major capstone project with powerful backend APIs, but the frontend looks outdated and unpresentable.
  - Cannot afford a $500 UI/UX bootcamp.
  - Does not know any design students personally outside his computer engineering block.
- **Goal on SkillSwap**: Offer 2 hours of Java tutoring to earn 2 Skill Credits, then book a session with a skilled graphic design peer to critique and polish his project UI in Figma.

### Persona 2: Ananya Patel (The Creative Designer Wanting Coding Basics)
- **Role / Major**: 2nd Year Multimedia & Digital Arts student.
- **Can Teach**: Figma, Adobe Photoshop, User Research, Color Theory.
- **Wants to Learn**: HTML, CSS, Basic JavaScript.
- **Pain Points**:
  - Needs to convert design wireframes into basic functional web pages for an upcoming internship application.
  - Struggles with self-paced YouTube tutorials when syntax bugs occur and no one is available to answer questions.
- **Goal on SkillSwap**: Exchange 1-on-1 design lessons directly for beginner frontend programming lessons with a patient engineering classmate.

### Persona 3: Prof. Arvind Mehta (Faculty Coordinator / Campus Administrator)
- **Role**: Head of Campus Student Mentorship & Academic Affairs.
- **Responsibilities**: Oversees student collaborative initiatives, ensures campus code of conduct, and resolves student grievances.
- **Pain Points**:
  - Has zero visibility into informal campus tutoring arrangements.
  - Receives occasional complaints about students paying outside tutors who fail to deliver.
- **Goal on SkillSwap**: Use the admin console to verify student cohorts, inspect skill supply vs. demand trends to organize targeted workshops, and swiftly arbitrate reported student disputes.

---

## 3. User Journey Maps

### 3.1 Primary Learner / Teacher Journey (Direct Mutual Swap)

```
[ Register with College Email ] ──► [ Verify 6-digit OTP ] ──► [ Complete Profile & Skill Inventory ]
                                                                                │
[ Receive Match Suggestions ] ◄── [ Set Weekly Availability Slots ] ◄───────────┘
               │
               ▼
[ Send Swap Request to Peer ] ──► [ Peer Accepts Request ] ──► [ Chat & Coordinate Meeting Venue ]
                                                                                │
[ Credit Settled & Reviews Left ] ◄── [ Enter 6-Digit OTP ] ◄── [ Complete 1-Hour Session ]
```

### 3.2 Indirect Credit Learner Journey
1. **Enrollment**: Student registers, verifies email, and receives **3 Welcome Skill Credits**.
2. **Discovery**: Searches catalog for "Spanish Conversation" and finds a native-speaking exchange student.
3. **Session Booking**: Submits a swap request using 1 credit. System places 1 credit into **Escrow Hold**.
4. **Execution**: Both students meet at the campus library or on Google Meet.
5. **Settlement**: At the conclusion, the learner shares the 6-digit session OTP with the teacher. The teacher enters it into the portal. The 1 escrowed credit instantly transfers to the teacher's wallet.
6. **Review**: Both participants submit ratings and feedback, updating each other's campus reputation score.

---

## 4. MVP vs. Phase 2 Feature Scope

| Feature Area | In-Scope MVP (Current Release) | Out-of-Scope (Phase 2 Roadmap) |
| :--- | :--- | :--- |
| **Authentication** | College email domain regex (`.edu`/`.ac.in`), BCrypt hashing, JWT (Access + Refresh), 6-digit email OTP. | OAuth2 Single Sign-On (Google Workspace / Microsoft Azure AD). |
| **Profile** | Bio, Department, Graduation Year, Avatar selection, Portfolio URL, Social Links. | Verified GitHub / LinkedIn integration, automated skill badges. |
| **Skills** | Pre-seeded categories + custom skills, 4 proficiency tiers (Beginner, Intermediate, Advanced, Expert). | Video skill demonstration uploads, automated coding quizzes. |
| **Availability** | Day-of-Week recurring slots (e.g., Mon 16:00–18:00), 60-min increments. | Real-time bidirectional Google Calendar / Outlook integration. |
| **Matching** | 100-pt deterministic weighted algorithm (Skills, Level, Availability, Rating). | Vector embeddings, semantic NLP skill matching (OpenAI/Gemini). |
| **Swaps & Sessions** | Direct & Indirect requests, Accept/Reject/Cancel, Escrow hold, 6-digit OTP completion. | Multi-student group workshop sessions, recurring subscription swaps. |
| **Credits** | 3 signup credits, 1 credit = 1 hour, immutable transaction ledger, double-spending lock. | Multi-tier credits based on tutor experience level, credit purchases. |
| **Communication** | In-app 1-on-1 REST-polled chat, structured notification feed. | WebSockets STOMP, in-app WebRTC video/audio calls with whiteboard. |
| **Administration** | User ban/suspend, dispute arbitration, transaction audit log, supply/demand analytics. | Automated toxic content filtering, campus multi-tenant federation. |

---

## 5. Functional Requirements Overview (Traceability Index)

| ID | Module | Title | Priority |
| :--- | :--- | :--- | :--- |
| **FR-AUTH-001** | Authentication | College Email Domain Verification | High (P0) |
| **FR-AUTH-002** | Authentication | Password Security & BCrypt Hashing | High (P0) |
| **FR-AUTH-003** | Authentication | Stateless JWT Session Management | High (P0) |
| **FR-PROF-001** | Profile | Student Profile Creation & Editing | High (P0) |
| **FR-PROF-002** | Profile | "Skills I Can Teach" Management | High (P0) |
| **FR-PROF-003** | Profile | "Skills I Want to Learn" Management | High (P0) |
| **FR-PROF-004** | Profile | Weekly Recurring Availability Scheduler | High (P0) |
| **FR-DISC-001** | Discovery | Multi-Attribute Student Directory Search | High (P0) |
| **FR-MATCH-001** | Matching | Deterministic Compatibility Scoring Engine | High (P0) |
| **FR-MATCH-002** | Matching | Transparent Score Explanation Breakdown | Medium (P1) |
| **FR-SWAP-001** | Swaps | Swap Proposal Initiation & Validation | High (P0) |
| **FR-SWAP-002** | Swaps | Proposal State Transitions (Accept, Reject, Cancel) | High (P0) |
| **FR-SESS-001** | Sessions | Session Scheduling & Mode Specification | High (P0) |
| **FR-SESS-002** | Sessions | Mutual 6-Digit Completion Code Verification | High (P0) |
| **FR-SESS-003** | Sessions | Cancellation & Dispute Escalation | High (P0) |
| **FR-CRED-001** | Credits | Initial Registration Welcome Credit Grant | High (P0) |
| **FR-CRED-002** | Credits | Escrow Locking During Active Session Scheduling | High (P0) |
| **FR-CRED-003** | Credits | Atomic Credit Settlement on Session Completion | High (P0) |
| **FR-CRED-004** | Credits | Immutable Double-Entry Audit Ledger | High (P0) |
| **FR-REVW-001** | Reviews | Post-Session Dual Peer Rating & Feedback | High (P0) |
| **FR-COMM-001** | Communication | In-App Direct Messaging | Medium (P1) |
| **FR-COMM-002** | Communication | Real-Time Notification Event Triggers | Medium (P1) |
| **FR-MOD-001** | Moderation | User Conduct Reporting | High (P0) |
| **FR-ADMN-001** | Admin | Student Status Moderation & Audit Controls | High (P0) |
| **FR-ADMN-002** | Admin | Skill Supply vs. Demand Analytics | Medium (P1) |

---

## 6. Non-Functional Requirements Summary

- **NFR-SEC-001 (Security)**: Passwords hashed with BCrypt (strength 12). JWT tokens signed using HMAC-SHA256 with 256-bit secret.
- **NFR-SEC-002 (Data Privacy)**: Private student contacts (email, phone, student ID) masked until a swap request is mutually accepted.
- **NFR-PERF-001 (Latency)**: API response time for core endpoints (Profiles, Discovery, Matches) under 250ms for 95th percentile under 200 concurrent campus users.
- **NFR-REL-001 (ACID Guarantees)**: All credit movements must execute within transactional boundaries (`@Transactional`) with row-level locks to prevent double-spending.
- **NFR-USE-001 (Usability)**: Responsive UI compatible with desktop (1920x1080), laptop (1366x768), tablet (768x1024), and mobile (375x812) viewports.

---

## 7. Success Metrics & Key Performance Indicators (KPIs)

| Metric | Target Goal (Semester 1 Pilot) | Measurement Method |
| :--- | :--- | :--- |
| **Registered Verified Students** | 250+ active campus accounts | MySQL `users` count where `is_verified = true` |
| **Cross-Disciplinary Swaps** | > 40% of swaps between differing departments | Database query comparing `student_a.dept_id != student_b.dept_id` |
| **Session Completion Rate** | > 85% of accepted swaps result in verified completion | `COUNT(COMPLETED) / COUNT(SCHEDULED)` |
| **Dispute / No-Show Rate** | < 5% of total scheduled sessions | `COUNT(DISPUTED + NO_SHOW) / COUNT(SCHEDULED)` |
| **Average Platform Rating** | >= 4.2 / 5.0 stars | Average of all records in `reviews` table |
| **Credit Velocity** | Average student transacts 2.5 credits/month | Sum of transaction ledger movements divided by active users |
