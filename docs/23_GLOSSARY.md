# SkillSwap — Domain Glossary & Terminology

```
==========================================================================
Document ID      : GLOSS-SKILLSWAP-V1
Scope            : Ubiquitous Language & Standardized Terminology
Target Audience  : Developers, Students, Evaluators, Campus Administrators
==========================================================================
```

This glossary defines the ubiquitous language used throughout the SkillSwap codebase, database entities, APIs, and project reports.

---

## 1. Domain Terminology

### Skill Credit
The fundamental unit of virtual currency within SkillSwap. Exactly 1 Skill Credit corresponds to 60 minutes (1 hour) of verified peer instruction. Credits are non-monetary, cannot be converted to fiat currency, and are stored within a student's `CreditWallet`.

### Escrow Hold (`ESCROW_HOLD`)
A temporary locked state in which 1 Skill Credit is moved from a learner's available balance into a protected holding escrow when a session is scheduled. The credit remains in escrow until the session is successfully verified (settled to teacher) or cancelled under refund-eligible conditions (refunded to learner).

### Direct Mutual Swap (Direct Barter)
A bilateral exchange scenario where Student A teaches Skill $X$ to Student B, and Student B reciprocally teaches Skill $Y$ to Student A. In direct mutual swaps, both students earn and spend 1 credit, resulting in a net-zero credit expenditure.

### Indirect Swap (Credit-Backed Exchange)
A unilateral learning scenario where Student A spends 1 pre-earned or signup credit to learn from Student B, without Student B needing to learn anything from Student A. Student B deposits the earned credit to learn from Student C at a later date.

### Teach Skill (`UserTeachSkill`)
A competency that a student officially registers as qualified to tutor, categorized with a standardized proficiency tier (`BEGINNER`, `INTERMEDIATE`, `ADVANCED`, `EXPERT`), experience duration, and descriptive proof.

### Learn Skill (`UserLearnSkill`)
A competency that a student designates as a personal learning goal, assigned a target proficiency tier and priority rating (`LOW`, `MEDIUM`, `HIGH`).

### Proficiency Level
A standardized 4-tier competency classification:
1. **BEGINNER**: Foundational understanding; can guide complete novices through introductory basics.
2. **INTERMEDIATE**: Practical working knowledge; capable of assisting with standard course assignments and project tasks.
3. **ADVANCED**: Deep conceptual and practical mastery; capable of troubleshooting complex bugs and explaining system design.
4. **EXPERT**: Industry-grade or research-level competence; comprehensive theoretical and practical authority.

### Swap Request (`SwapRequest`)
A formal proposal submitted by a prospective learner to a prospective teacher specifying the requested skill, offered skill (or credit), proposed mode, and introductory message. States: `PENDING`, `ACCEPTED`, `REJECTED`, `CANCELLED`, `EXPIRED`.

### Session (`Session`)
A confirmed calendar appointment agreed upon by two students following an accepted swap request. Has a definitive date, 60-minute time window, and designated venue or Google Meet link. States: `SCHEDULED`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`, `DISPUTED`.

### Mutual Verification Code (MVC / Session OTP)
A cryptographically secure, 6-digit numeric token generated upon session confirmation. Accessible exclusively on the learner's screen, the code is verbally communicated to the teacher at the conclusion of the session. The teacher submits this code to the backend to atomically complete the session and claim the escrowed credit.

### Finite State Machine (FSM)
A mathematical model of computation that governs the lifecycle of swap requests and sessions. It strictly dictates valid state transitions and guarantees that operations such as credit settlement or review submission can only execute from valid prior states.

### Double-Spending
A critical concurrency hazard where a user with 1 available credit attempts to schedule multiple simultaneous sessions before any transaction commits. SkillSwap eliminates double-spending via pessimistic database row locking (`SELECT FOR UPDATE`) and atomic escrow reservation.

### Campus Walled Garden
A security boundary that enforces user registration and login exclusively through authorized institutional email domains (e.g., `.edu` or `.ac.in`), preventing unauthorized external access and promoting student accountability.

### Endorsement Badges
Qualitative tags awarded alongside 5-star reviews (e.g., *"Patient Tutor"*, *"Clear Explanations"*, *"Punctual"*, *"Debugging Wizard"*) that appear on a student's public profile to showcase specific instructional strengths.
