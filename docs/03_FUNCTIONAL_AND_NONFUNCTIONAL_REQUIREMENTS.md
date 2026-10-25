# SkillSwap — Functional and Non-Functional Requirements Specification

```
==========================================================================
Document ID      : SRS-SKILLSWAP-V1
Standard         : IEEE 830 / ISO 25010 Adapted for Web Applications
Project          : SkillSwap Peer-to-Peer College Skill Exchange
Scope            : Complete System Requirements Matrix
==========================================================================
```

---

## 1. Functional Requirements (FR)

### 1.1 Authentication & Authorization Module (`FR-AUTH`)

#### `FR-AUTH-001`: College Email Verification
- **Description**: The system shall restrict student registration to institutional email domains matching the campus pattern (e.g., `^[A-Za-z0-9._%+-]+@([A-Za-z0-9.-]+\.)?(college\.edu|university\.ac\.in)$`).
- **Input**: Email address, Password, Full Name, Department ID, Graduation Year.
- **Processing**: The system checks domain validity, verifies uniqueness in `users`, hashes the password, creates an unverified user record, generates a cryptographically secure 6-digit numeric OTP, and dispatches it via email with a 15-minute expiration timestamp.
- **Output**: Confirmation screen prompting for the 6-digit OTP.
- **Acceptance Criteria**: Registrations with non-institutional domains (e.g., `@gmail.com`, `@yahoo.com`) are rejected with HTTP 400 and message `"Registration restricted to official college email addresses."`

#### `FR-AUTH-002`: OTP Account Activation & Welcome Credit Injection
- **Description**: The system shall activate unverified student accounts upon submission of the correct OTP and provision the initial Skill Credit wallet.
- **Input**: Email address, 6-digit OTP.
- **Processing**: System verifies OTP match and expiration. Updates `users.is_verified = true`, activates the student profile, creates a `credit_wallets` record with `balance = 3`, and logs a `SIGNUP_BONUS` transaction in `credit_transactions`.
- **Output**: Account verified message; auto-login or redirect to login.
- **Acceptance Criteria**: Once verified, user can log in. OTP cannot be reused.

#### `FR-AUTH-003`: Stateless JWT Session Issuance
- **Description**: The system shall authenticate credentials using BCrypt and issue stateless JSON Web Tokens.
- **Input**: Registered email and plaintext password.
- **Processing**: Verifies email exists, verifies `users.is_active == true`, matches password hash. Upon success, generates an Access Token (15-minute validity, HMAC-SHA256) and a Refresh Token (7-day validity).
- **Output**: JSON payload containing `accessToken`, `tokenType: "Bearer"`, user role, student profile summary, and refresh token cookie/header.
- **Acceptance Criteria**: Protected endpoints reject requests without a valid Bearer token returning HTTP 401 Unauthorized.

#### `FR-AUTH-004`: Role-Based Access Control (RBAC)
- **Description**: The system shall enforce role separation between `ROLE_STUDENT` and `ROLE_ADMIN`.
- **Processing**: Spring Security filter intercepts all `/api/v1/admin/**` requests and validates the subject contains `ROLE_ADMIN`.
- **Acceptance Criteria**: Any student attempting to access admin endpoints receives HTTP 403 Forbidden.

---

### 1.2 Profile & Skill Inventory Module (`FR-PROF`)

#### `FR-PROF-001`: Student Profile Management
- **Description**: Verified students shall be able to update their academic and biographical details.
- **Input**: Bio (max 500 chars), Graduation Year (future year validation), Avatar URL, Social/GitHub Links, Preferred Learning Mode (`IN_PERSON`, `ONLINE`, `HYBRID`).
- **Acceptance Criteria**: Updates reflect immediately across the public discovery index.

#### `FR-PROF-002`: "Skills I Can Teach" Management
- **Description**: Students shall declare skills they can teach along with their proficiency and experience.
- **Input**: Skill ID (from catalog or custom), Proficiency Level (`BEGINNER`, `INTERMEDIATE`, `ADVANCED`, `EXPERT`), Experience (months/years), Description/Portfolio Link.
- **Business Rule**: A student cannot teach more than 10 skills simultaneously to prevent spam.
- **Acceptance Criteria**: Saved skills become discoverable in search queries and match engines.

#### `FR-PROF-003`: "Skills I Want to Learn" Management
- **Description**: Students shall declare skills they desire to acquire.
- **Input**: Skill ID, Desired Target Proficiency, Priority Level (`LOW`, `MEDIUM`, `HIGH`), Notes.
- **Business Rule**: A student cannot add the exact same skill to both "Can Teach" and "Want to Learn" lists with the same proficiency level.

#### `FR-PROF-004`: Weekly Recurring Availability Scheduler
- **Description**: Students shall configure their weekly recurring free time slots for tutoring.
- **Input**: List of slots: `day_of_week` (`MONDAY`..`SUNDAY`), `start_time` (HH:mm), `end_time` (HH:mm). Minimum block size is 60 minutes.
- **Validation**: End time must be strictly after start time. Overlapping slots on the same day are merged or rejected.

---

### 1.3 Discovery & Matching Engine Module (`FR-MATCH`)

#### `FR-MATCH-001`: Multi-Criteria Student Search
- **Description**: Students shall search for tutors by keyword, skill category, proficiency, day of week, and rating.
- **Input**: Search query string, category filter, minimum rating (1-5), availability day.
- **Output**: Paginated list of matching student summary cards showing avatar, name, skills offered, rating, and compatibility score.

#### `FR-MATCH-002`: Deterministic 100-Point Matching Engine
- **Description**: The system shall compute a compatibility score (0–100) between the logged-in student and candidate peers.
- **Calculation Formula**:
  - Direct Mutual Swap Compatibility: Up to 40 points
  - Skill Proficiency Level Compatibility: Up to 20 points
  - Availability Time Slot Overlap: Up to 20 points
  - Historical Peer Rating & Reliability: Up to 10 points
  - Department / Mode Alignment: Up to 10 points
- **Output**: Total match score with an itemized explanation breakdown.

---

### 1.4 Swap Requests & Session Lifecycle (`FR-SWAP`, `FR-SESS`)

#### `FR-SWAP-001`: Swap Request Initiation
- **Description**: A student shall send a swap proposal to another student.
- **Input**: Receiver Student ID, Offered Skill ID (or credit payment), Requested Skill ID, Proposed Slot, Learning Mode (`IN_PERSON` or `ONLINE`), Campus Venue / Meeting Link.
- **Validation**:
  1. Sender cannot send a request to themselves (`sender_id != receiver_id`).
  2. Learner must have `credit_wallets.balance >= 1` (or be offering an accepted mutual swap).
  3. No duplicate pending swap can exist between the same two students for the same skills.
- **Output**: New `swap_requests` record with status `PENDING`.

#### `FR-SWAP-002`: Swap Decision (Accept, Reject, Cancel)
- **Description**: The recipient shall accept or reject a pending request; the sender may cancel before acceptance.
- **Processing**: Accepting a swap automatically initiates session scheduling. Rejecting marks status `REJECTED`. Cancelling marks status `CANCELLED`.

#### `FR-SESS-001`: Session Confirmation & Credit Escrow Hold
- **Description**: When a swap is scheduled for a specific date and time, the system shall hold 1 Skill Credit in escrow from the learner's wallet.
- **Processing**: Atomically decrements `credit_wallets.balance` by 1 and increments `credit_wallets.escrow_balance` by 1 using row locking (`PESSIMISTIC_WRITE`). Generates a `Session` record with status `SCHEDULED`.
- **Output**: Session confirmed notification dispatched to both students.

#### `FR-SESS-002`: 6-Digit Session Verification Code & Settlement
- **Description**: The system shall generate a secure 6-digit numeric verification code accessible only to the learner.
- **Processing**: At the session, learner provides the code to the teacher. Teacher enters code into `/api/v1/sessions/{id}/complete`.
- **Validation**: If code matches and current time is within session window, system:
  1. Sets session status to `COMPLETED`.
  2. Decrements learner's `escrow_balance` by 1.
  3. Increments teacher's `balance` by 1.
  4. Records `credit_transactions` for both accounts.
  5. Unlocks review submission for both parties.

#### `FR-SESS-003`: Cancellation & Dispute Rules
- **Description**: Either party may cancel up to 2 hours before session start with 100% escrow refund to learner.
- **Cancellation < 2 Hours**: Escalated for review; repeated late cancellations result in reliability score deduction.

---

### 1.5 Reviews & In-App Communication (`FR-REVW`, `FR-COMM`)

#### `FR-REVW-001`: Double-Sided Post-Session Reviews
- **Description**: Both participants may rate the completed session from 1 to 5 stars with written feedback.
- **Constraint**: Reviews can only be submitted for sessions in `COMPLETED` state. A user cannot review themselves. Only one review per user per session.
- **Processing**: System recalculates target student's average rating: `avg_rating = sum(ratings) / count(reviews)`.

#### `FR-COMM-001`: 1-on-1 Direct Messaging
- **Description**: Students with an accepted swap or scheduled session may exchange text messages.
- **Features**: REST-polled messaging, timestamped message history, unread message badges, character limits (max 1000 chars/message).

#### `FR-COMM-002`: System Event Notifications
- **Description**: System notifies users of critical events: Swap Received, Swap Accepted, Session Reminder (1 hour prior), Session Completed, Credits Transferred, Dispute Filed.

---

### 1.6 Moderation & Admin Dashboard (`FR-ADMN`)

#### `FR-ADMN-001`: User Conduct Reporting
- **Description**: Students can submit reports against peers for No-Show, Inappropriate Conduct, Academic Fraud, or Harassment with supporting descriptions.
- **Status Workflow**: `OPEN` -> `UNDER_REVIEW` -> `RESOLVED` / `DISMISSED`.

#### `FR-ADMN-002`: Administrative Suspension & Credit Adjustments
- **Description**: Admins can suspend problematic accounts and execute manual credit adjustments with mandatory audit logging (`admin_audit_logs`).

#### `FR-ADMN-003`: Campus Skill Analytics
- **Description**: Admin dashboard displays real-time analytics: Top Demanded Skills, Top Offered Skills, Deficit Skills, Swap Completion Rate, Active Student Count.

---

## 2. Non-Functional Requirements (NFR)

### 2.1 Security Requirements (`NFR-SEC`)

| ID | Specification | Metric / Validation |
| :--- | :--- | :--- |
| **NFR-SEC-001** | Password Cryptography | BCrypt hashing with strength factor 12. Plaintext passwords must never be logged or persisted. |
| **NFR-SEC-002** | Token Integrity | JWT access tokens signed with HMAC-SHA256 (secret >= 256 bits). Expiration enforced at 15 minutes. |
| **NFR-SEC-003** | Injection Defense | 100% of database queries must use Spring Data JPA parameter binding. Zero dynamic string SQL concatenation. |
| **NFR-SEC-004** | Cross-Site Scripting (XSS) | React built-in JSX escaping for frontend; HTML sanitization on all backend string inputs before persistence. |
| **NFR-SEC-005** | Rate Limiting | Auth endpoints (`/login`, `/register`, `/verify-email`) rate-limited to 5 requests per IP per minute. |
| **NFR-SEC-006** | Data Privacy & Masking | Private contact info (phone, email) hidden from public profile responses; only username, department, year, bio, and skills exposed. |

### 2.2 Performance & Scalability Requirements (`NFR-PERF`)

| ID | Specification | Metric / Target |
| :--- | :--- | :--- |
| **NFR-PERF-001** | API Response Latency | 95% of read requests (`GET /profiles`, `GET /matches`, `GET /skills`) respond in < 250ms under 200 concurrent campus users. |
| **NFR-PERF-002** | Matching Calculation Speed | Computing match scores for 100 candidate students completes in < 300ms. |
| **NFR-PERF-003** | Database Query Optimization | Composite indexes on `(user_id, day_of_week)`, `(skill_id, proficiency_level)`, and `(sender_id, status)` to prevent full table scans. |

### 2.3 Reliability & Transactional Integrity (`NFR-REL`)

| ID | Specification | Metric / Target |
| :--- | :--- | :--- |
| **NFR-REL-001** | ACID Transaction Boundaries | All wallet movements, escrow locks, and session completions run under `@Transactional(isolation = Isolation.READ_COMMITTED)`. |
| **NFR-REL-002** | Double-Spending Prevention | Wallet balance updates enforce pessimistic locking (`SELECT ... FOR UPDATE`) or optimistic version checks (`@Version`). |
| **NFR-REL-003** | Idempotent Settlements | Entering the 6-digit session OTP multiple times must be idempotent; credit can only be transferred exactly once per session. |

### 2.4 Usability & Accessibility Requirements (`NFR-USE`)

| ID | Specification | Metric / Target |
| :--- | :--- | :--- |
| **NFR-USE-001** | Multi-Device Responsiveness | Fluid layout adapting to Mobile (375px+), Tablet (768px+), and Desktop (1280px+) without horizontal scrolling. |
| **NFR-USE-002** | Accessibility (WCAG 2.1 AA) | Color contrast ratio >= 4.5:1 for standard text; all interactive elements keyboard-navigable and screen-reader accessible. |
| **NFR-USE-003** | Explainability | 100% of match scores must render a user-readable percentage breakdown explanation modal. |
