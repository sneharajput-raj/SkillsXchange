# SkillSwap — Detailed Feature Specifications

```
==========================================================================
Document ID      : FSPEC-SKILLSWAP-V1
Scope            : Complete Specifications for 22 Core MVP Features
Standard         : Structured Enterprise Feature Specification Template
==========================================================================
```

This document specifies the behavior, business rules, edge cases, and acceptance criteria for all 22 features comprising the SkillSwap platform.

---

## Feature 01: Student Registration & Login

- **Purpose**: Authenticate students, verify identity, and grant secure system access.
- **Actors**: Prospective Student, Registered Student, System Auth Filter.
- **Preconditions**: User has access to a valid college email address.
- **Inputs**: Email, password (min 8 chars, 1 uppercase, 1 number, 1 special char), full name, department ID, graduation year.
- **Processing**:
  1. Validate email syntax and college domain whitelist.
  2. Check uniqueness in `users` table.
  3. Hash password using BCrypt (strength 12).
  4. Create unverified record (`is_verified = false`).
  5. Generate 6-digit numeric OTP with 15-minute TTL.
  6. Dispatch OTP to email.
- **Outputs**: HTTP 201 Created with `{ "message": "Verification code dispatched to college email", "userId": 123 }`.
- **Success Conditions**: User record stored; OTP dispatched.
- **Failure Conditions**: Duplicate email (HTTP 409), invalid password format (HTTP 400), invalid email domain (HTTP 400).
- **Edge Cases**:
  - Student tries to register with capital letters in email (`Student@College.EDU`): System normalizes email to lowercase before processing.
- **Acceptance Criteria**: Only users with verified accounts can log in and obtain JWT access tokens.

---

## Feature 02: College Email Verification

- **Purpose**: Confirm the user belongs to the institution and prevent unauthorized external access.
- **Actors**: Student, System Auth Service.
- **Preconditions**: User completed Feature 01 registration and received OTP.
- **Inputs**: Email address, 6-digit verification code.
- **Processing**:
  1. Query active OTP record for email.
  2. Verify code matches and current timestamp < expires_at.
  3. Update `users.is_verified = true`.
  4. Create `student_profiles` row with initial stats.
  5. Initialize `credit_wallets` with 3 credits and log `SIGNUP_BONUS` transaction.
  6. Delete or mark OTP used.
- **Outputs**: HTTP 200 OK with welcome message and initial credit balance.
- **Success Conditions**: Account activated, wallet initialized with 3 credits.
- **Failure Conditions**: Code mismatch (HTTP 400), code expired (HTTP 410), account already verified (HTTP 400).
- **Edge Cases**:
  - User requests multiple OTPs: New OTP invalidates previous OTP; previous OTP is immediately rejected.
- **Acceptance Criteria**: Account cannot be activated without the exact valid OTP.

---

## Feature 03: Student Profile Management

- **Purpose**: Maintain student identity, academic background, bio, and preferences.
- **Actors**: Verified Student.
- **Preconditions**: Authenticated with valid JWT token.
- **Inputs**: Bio (max 500 chars), graduation year, profile avatar selection, portfolio/GitHub link, preferred learning mode (`IN_PERSON`, `ONLINE`, `HYBRID`).
- **Processing**: Validate inputs, sanitize HTML tags, persist changes to `student_profiles`.
- **Outputs**: HTTP 200 with updated student profile DTO.
- **Success Conditions**: Profile updated in database and visible in public searches.
- **Failure Conditions**: Bio exceeds 500 characters, invalid URL format for portfolio.
- **Edge Cases**:
  - Graduation year set to the past: System validates graduation year >= current academic year.
- **Acceptance Criteria**: Profile changes immediately reflect in the public discovery card.

---

## Feature 04: "Skills I Can Teach" Management

- **Purpose**: Allow students to declare competencies they are qualified to teach peers.
- **Actors**: Verified Student.
- **Preconditions**: Student profile exists.
- **Inputs**: Skill ID, proficiency level (`BEGINNER`, `INTERMEDIATE`, `ADVANCED`, `EXPERT`), experience in months/years, proof description / portfolio link.
- **Processing**:
  1. Validate skill exists in catalog.
  2. Verify student does not exceed maximum limit of 10 taught skills.
  3. Ensure skill is not already in student's taught list.
  4. Insert into `user_teach_skills`.
- **Outputs**: HTTP 201 with created teach-skill record.
- **Success Conditions**: Skill added to student's teaching inventory and indexed for search.
- **Failure Conditions**: Skill already added (HTTP 409), max limit reached (HTTP 400).
- **Edge Cases**:
  - Student tries to add a skill they currently have in "Want to Learn": Allowed only if taught proficiency > learn target proficiency (e.g., teaching Beginner Python while wanting to learn Advanced Python).
- **Acceptance Criteria**: Taught skills appear in match engine calculations.

---

## Feature 05: "Skills I Want to Learn" Management

- **Purpose**: Allow students to declare learning goals and subject interests.
- **Actors**: Verified Student.
- **Preconditions**: Student profile exists.
- **Inputs**: Skill ID, target proficiency level, priority (`LOW`, `MEDIUM`, `HIGH`), learning goal notes.
- **Processing**:
  1. Validate skill exists.
  2. Check limit (max 10 learning goals).
  3. Insert into `user_learn_skills`.
- **Outputs**: HTTP 201 with created learn-skill record.
- **Success Conditions**: Skill added to student's learning inventory and indexed for matching.
- **Failure Conditions**: Duplicate skill (HTTP 409), invalid priority.
- **Acceptance Criteria**: Learning desires are matched against peers offering those skills.

---

## Feature 06: Skill Categories & Proficiency Levels

- **Purpose**: Organize skills into searchable academic domains with standardized competency levels.
- **Actors**: Student (Reader), Admin (Manager).
- **Preconditions**: System seeded with initial taxonomies.
- **Inputs**: Categories (e.g., Computer Science, Design, Languages, Business, Academics, Music); 4 proficiency tiers (`BEGINNER`, `INTERMEDIATE`, `ADVANCED`, `EXPERT`).
- **Processing**: Query skills grouped by category, filterable by active status.
- **Outputs**: Tree-structured list of categories with active skills.
- **Success Conditions**: Category and skill hierarchy rendered cleanly on UI dropdowns and filter chips.
- **Acceptance Criteria**: Students can select from pre-approved skills or suggest custom skills.

---

## Feature 07: Availability Management

- **Purpose**: Let students define recurring weekly blocks when they are free for peer sessions.
- **Actors**: Student.
- **Preconditions**: Student is authenticated.
- **Inputs**: Array of slots: `{ dayOfWeek: "MONDAY", startTime: "16:00", endTime: "18:00" }`.
- **Processing**:
  1. Check `startTime < endTime`.
  2. Validate minimum block duration is >= 60 minutes.
  3. Check for overlapping time windows on the same day.
  4. Atomically replace or upsert user availability in `availabilities` table.
- **Outputs**: HTTP 200 with saved availability schedule.
- **Success Conditions**: Availability displayed on public profile and used in match calculations.
- **Failure Conditions**: Overlapping slots submitted, end time <= start time.
- **Edge Cases**:
  - Student sets availability across midnight (e.g., 23:00 to 01:00): Rejected; slots must fall within the same calendar day (00:00 to 23:59).
- **Acceptance Criteria**: Matching engine accurately detects common free hours between students.

---

## Feature 08: Student Discovery & Search

- **Purpose**: Enable students to discover tutors across campus using multi-attribute filters.
- **Actors**: Student.
- **Inputs**: Keyword query (skill name, student name), category ID, proficiency filter, day-of-week filter, minimum average rating (e.g., >= 4.0).
- **Processing**: Dynamic SQL query via Spring Data JPA Specifications with composite indexes, paginated (10 or 20 per page).
- **Outputs**: Paginated list of student summary cards.
- **Success Conditions**: Fast search response (< 200ms) matching all applied criteria.
- **Failure Conditions**: Invalid filter parameters return HTTP 400.
- **Acceptance Criteria**: Filter results accurately match database states without showing unverified or suspended users.

---

## Feature 09: Intelligent Skill Matching

- **Purpose**: Automatically pair students who have complementary teach/learn skills and overlapping schedules.
- **Actors**: Student, Matching Engine.
- **Preconditions**: Both students have at least one taught skill and one learned skill registered.
- **Inputs**: Logged-in student ID.
- **Processing**:
  1. Fetch student's teach skills, learn skills, and availability slots.
  2. Query candidate students teaching what the user wants to learn OR wanting what the user teaches.
  3. Execute scoring algorithm (Feature 10).
  4. Filter candidates with match score >= 30.
  5. Rank candidates in descending order of score.
- **Outputs**: List of ranked match recommendations with summary cards and score badges.
- **Success Conditions**: Direct mutual matches (A teaches B and B teaches A) appear at the top.
- **Acceptance Criteria**: Matching engine completes calculation for up to 50 candidates in under 300ms.

---

## Feature 10: Match Score & Explanation

- **Purpose**: Provide transparent, understandable reasons why two students are recommended to each other.
- **Actors**: Student.
- **Inputs**: Logged-in student ID, Candidate student ID.
- **Processing**:
  - **Mutual Swap Component (40 pts)**: 40 pts if candidate teaches what user wants AND user teaches what candidate wants; 20 pts if one-way match.
  - **Proficiency Alignment (20 pts)**: Evaluates tutor proficiency relative to learner's target level.
  - **Availability Overlap (20 pts)**: Points proportional to number of overlapping 1-hour free windows.
  - **Reputation & Rating (10 pts)**: Scaled based on average review score (e.g., 5.0 stars = 10 pts).
  - **Department & Mode Proximity (10 pts)**: 5 pts for matching learning mode + 5 pts for department proximity.
- **Outputs**:
  ```json
  {
    "totalScore": 88,
    "breakdown": {
      "mutualSkillMatch": { "score": 40, "max": 40, "detail": "Direct mutual swap: You teach Java, they teach React" },
      "proficiencyCompatibility": { "score": 18, "max": 20, "detail": "Tutor is Advanced in React, matching your target" },
      "availabilityOverlap": { "score": 15, "max": 20, "detail": "3 overlapping 1-hour windows on Mon/Wed" },
      "ratingScore": { "score": 9, "max": 10, "detail": "4.6 average rating across 8 completed sessions" },
      "preferenceAlignment": { "score": 6, "max": 10, "detail": "Both prefer In-Person sessions at Campus Library" }
    }
  }
  ```
- **Acceptance Criteria**: The sum of breakdown points equals `totalScore`.

---

## Feature 11: Swap Requests

- **Purpose**: Initiate a structured peer learning proposal between two students.
- **Actors**: Proposing Student (Sender), Target Student (Receiver).
- **Preconditions**: Both students active and verified; sender has >= 1 credit (or is initiating mutual swap).
- **Inputs**: Receiver ID, Offered Skill ID, Requested Skill ID, Proposed Date/Time, Learning Mode, Proposed Venue / Meet Link, Message note.
- **Processing**:
  1. Validate `sender_id != receiver_id`.
  2. Validate no pending request exists between these two users for these skills.
  3. Validate sender has sufficient credits if proposing a credit-backed swap.
  4. Create `swap_requests` with status `PENDING`.
  5. Dispatch notification to receiver.
- **Outputs**: HTTP 201 with created swap request DTO.
- **Failure Conditions**: Insufficient credits (HTTP 402), self-swap attempt (HTTP 400), duplicate pending request (HTTP 409).
- **Acceptance Criteria**: Receiver sees incoming swap request in their dashboard with accept/reject options.

---

## Feature 12: Accept, Reject, and Cancel Requests

- **Purpose**: Manage the decision lifecycle of a pending swap request.
- **Actors**: Receiver (Accept/Reject), Sender (Cancel).
- **Preconditions**: Swap request status is `PENDING`.
- **Processing**:
  - **Accept**: Status becomes `ACCEPTED`. System triggers Feature 13 (Session Scheduling).
  - **Reject**: Status becomes `REJECTED`. Optional rejection reason saved.
  - **Cancel**: Status becomes `CANCELLED`. Only sender can cancel while `PENDING`.
- **Outputs**: HTTP 200 with updated swap request status.
- **Edge Cases**:
  - Sender cancels at the exact second receiver accepts: Handled via optimistic locking (`@Version`); whichever transaction commits first determines state; second receives HTTP 409 Conflict.
- **Acceptance Criteria**: Rejected or cancelled swaps cannot be reactivated; a new request must be created.

---

## Feature 13: Session Scheduling

- **Purpose**: Lock in a definitive calendar appointment for an accepted swap, placing the required credit in escrow.
- **Actors**: Both Students.
- **Preconditions**: Swap request in `ACCEPTED` state.
- **Inputs**: Agreed Date, Start Time, End Time (exactly 60 minutes for MVP), Learning Mode (`IN_PERSON` or `ONLINE`), Campus Venue or Meet Link.
- **Processing**:
  1. Validate date/time is in the future.
  2. Acquire pessimistic lock on learner's wallet (`credit_wallets`).
  3. Verify `balance >= 1`.
  4. Deduct 1 from `balance`, add 1 to `escrow_balance`.
  5. Create `Session` record with status `SCHEDULED`.
  6. Generate a cryptographically random 6-digit verification code stored hashed or secured in `session_verification_codes` (viewable only by learner).
- **Outputs**: HTTP 201 with scheduled session details and calendar countdown.
- **Acceptance Criteria**: Escrow balance increases by 1; learner's available balance decreases by 1; neither party can double-book that exact time window.

---

## Feature 14: Session Completion & Verification Protocol

- **Purpose**: Confirm actual attendance and instruction before releasing escrowed credits to the tutor.
- **Actors**: Learner, Teacher, System.
- **Preconditions**: Session status is `SCHEDULED`; current time is >= session scheduled start time.
- **Inputs**: Session ID, 6-digit verification code entered by the teacher.
- **Processing**:
  1. Validate session is currently `SCHEDULED`.
  2. Verify input code matches learner's assigned code.
  3. Update session status to `COMPLETED`, setting `completed_at = NOW()`.
  4. Atomically transfer 1 credit from learner's `escrow_balance` to teacher's `balance`.
  5. Log two records in `credit_transactions`: `SESSION_SPENT` (learner) and `SESSION_EARNED` (teacher).
  6. Unlock review capability for both users.
- **Outputs**: HTTP 200 with completion confirmation and updated wallet balance.
- **Failure Conditions**: Incorrect code (HTTP 400), session already completed (HTTP 400), session cancelled.
- **Acceptance Criteria**: Credit is transferred exactly once; double completion is impossible.

---

## Feature 15: Skill Credit Wallet

- **Purpose**: Provide students with real-time visibility into their available, in-escrow, and lifetime earned credits.
- **Actors**: Student.
- **Inputs**: Student ID.
- **Processing**: Query `credit_wallets` for `balance`, `escrow_balance`, `lifetime_earned`, `lifetime_spent`.
- **Outputs**: JSON wallet summary:
  ```json
  {
    "availableCredits": 3,
    "escrowLockedCredits": 1,
    "lifetimeEarned": 5,
    "lifetimeSpent": 2
  }
  ```
- **Business Rule**: Students cannot directly edit their credit balance under any circumstances. Balance can only change through verified session events or admin adjustments.
- **Acceptance Criteria**: Total accessible credits strictly equal `availableCredits`.

---

## Feature 16: Credit Transaction History

- **Purpose**: Provide an immutable audit trail of every credit movement for full financial transparency.
- **Actors**: Student, System Auditor.
- **Inputs**: Student ID, pagination parameters (page, size).
- **Processing**: Query `credit_transactions` ordered by `created_at DESC`.
- **Outputs**: Paginated list containing: Transaction ID, Timestamp, Type (`SIGNUP_BONUS`, `SESSION_SPENT`, `SESSION_EARNED`, `ESCROW_HOLD`, `ESCROW_RELEASE`, `REFUND`, `ADMIN_ADJUSTMENT`), Amount (+1 / -1), Running Balance After, Reference Session ID.
- **Acceptance Criteria**: The sum of all non-escrow transactions mathematically matches `wallet.balance`.

---

## Feature 17: Student Reviews & Ratings

- **Purpose**: Build a verified reputation system based on actual learning experiences.
- **Actors**: Reviewer (Student), Reviewee (Student).
- **Preconditions**: Session status is strictly `COMPLETED`.
- **Inputs**: Session ID, Rating (1 to 5 stars), Feedback text (max 1000 chars), Endorsement tags (e.g., "Clear Explanations", "Punctual", "Patient", "Expert Knowledge").
- **Processing**:
  1. Check reviewer was a participant in the session.
  2. Check reviewer has not already reviewed this session (unique constraint on `session_id, reviewer_id`).
  3. Save review record.
  4. Recalculate target student's `average_rating` and `total_reviews` count in `student_profiles`.
- **Outputs**: HTTP 201 with saved review.
- **Failure Conditions**: Session not completed (HTTP 400), user reviews self (HTTP 400), duplicate review (HTTP 409).
- **Acceptance Criteria**: Ratings immediately update the teacher's campus reputation badge.

---

## Feature 18: In-App Notifications

- **Purpose**: Keep students alerted about time-sensitive swap, session, and credit events.
- **Actors**: Student, System Event Listener.
- **Inputs**: Student ID, unread filter.
- **Processing**:
  - Event listeners trigger notification records on events: `SWAP_REQUEST_RECEIVED`, `SWAP_ACCEPTED`, `SWAP_REJECTED`, `SESSION_UPCOMING_1HR`, `SESSION_COMPLETED`, `CREDIT_RECEIVED`, `DISPUTE_FILED`.
  - Endpoint `PUT /api/v1/notifications/{id}/read` marks as read.
- **Outputs**: List of notification items with title, message, action link, timestamp, and unread boolean.
- **Acceptance Criteria**: Bell icon displays an unread count badge that clears upon opening.

---

## Feature 19: Basic 1-on-1 Direct Messaging

- **Purpose**: Allow matched students to coordinate logistics, share lesson materials, and discuss meeting points.
- **Actors**: Sender Student, Receiver Student.
- **Preconditions**: Students share an `ACCEPTED` swap request or active `Session`.
- **Inputs**: Conversation ID, Message text (max 1000 chars).
- **Processing**:
  1. Verify sender is a participant in conversation.
  2. Insert into `messages` table with timestamp and `is_read = false`.
  3. Update `conversation.updated_at`.
- **Outputs**: HTTP 201 with created message payload.
- **Security Rule**: Students cannot message arbitrary peers without an accepted swap or match connection (prevents unsolicited spam).
- **Acceptance Criteria**: Messages load chronologically; polling or refresh reveals new incoming messages.

---

## Feature 20: Student Reporting & Safety

- **Purpose**: Maintain campus safety and academic integrity by allowing students to report abusive behavior or no-shows.
- **Actors**: Reporting Student, Reported Student, Admin.
- **Preconditions**: Authenticated student.
- **Inputs**: Reported Student ID, Category (`NO_SHOW`, `HARASSMENT`, `FRAUD`, `INAPPROPRIATE_CONTENT`, `OTHER`), Description, Associated Session/Swap ID.
- **Processing**: Create `reports` record with status `OPEN`. Alert admin dashboard.
- **Outputs**: HTTP 201 with report tracking reference number.
- **Acceptance Criteria**: Reported user does not see who submitted the report (confidentiality).

---

## Feature 21: Admin Dashboard & Moderation

- **Purpose**: Empower campus authorities to oversee platform integrity, resolve disputes, and manage users.
- **Actors**: System Administrator (`ROLE_ADMIN`).
- **Preconditions**: Authenticated with admin role.
- **Inputs**: Action commands: Suspend User, Reinstate User, Resolve Report, Adjust Credits, Cancel Disputed Session.
- **Processing**:
  1. Execute status update.
  2. If dispute resolved with refund: release escrow credit back to learner.
  3. Write mandatory audit log to `admin_audit_logs` with admin ID, action type, target entity, justification note, and timestamp.
- **Outputs**: HTTP 200 with operation result.
- **Acceptance Criteria**: All administrative overrides are recorded in the unalterable audit log.

---

## Feature 22: Skill Demand & Supply Analytics

- **Purpose**: Provide visual insights into campus skill trends, shortages, and learning activity.
- **Actors**: Administrator, Faculty Coordinator.
- **Processing**:
  - Aggregate count of skills in `user_teach_skills` vs. `user_learn_skills`.
  - Calculate Deficit Skills: `count(learn) - count(teach) > 0`.
  - Calculate platform KPIs: Swap completion rate, total hours exchanged, active student ratio.
- **Outputs**: Analytics DTO with ranked lists, ratio metrics, and trend charts.
- **Acceptance Criteria**: Metrics calculate dynamically based on active database records.
