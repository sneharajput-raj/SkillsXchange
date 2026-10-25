# SkillSwap — Project Overview

```
==========================================================================
Project Name     : SkillSwap
Tagline          : Learn. Teach. Exchange.
Document Version : 1.0.0
Author           : SkillSwap Architectural & Product Engineering Group
Domain           : College Peer-to-Peer Collaborative Learning Platform
Target Release   : College Minor Project MVP (Single Institution Scope)
==========================================================================
```

---

## 1. Executive Summary

Higher education environments are filled with students possessing diverse, complementary skill sets. A computer science student may excel in Data Structures and backend programming but struggle with UI/UX design or digital marketing. Simultaneously, a multimedia design student may need tutoring in basic programming to build an interactive portfolio.

Despite being on the same campus, these students have no structured, trusted, and cashless mechanism to connect, exchange knowledge, and collaborate. Existing solutions—such as commercial tutoring platforms, expensive bootcamps, or unstructured WhatsApp/Telegram groups—either demand significant financial investment, lack accountability, or suffer from severe coordination friction.

**SkillSwap** is a specialized, campus-restricted peer-to-peer (P2P) skill exchange web application. It eliminates financial barriers by introducing a **Skill Credit System**: students earn credits by tutoring their peers in skills they have mastered, and they spend those credits to learn new competencies from other students. By leveraging an algorithmic matching engine, institutional email verification, an escrow-backed credit ledger, and a structured session verification protocol, SkillSwap creates an equitable, accountable, and vibrant learning ecosystem within higher education institutions.

---

## 2. Problem Statement

### 2.1 The Knowledge Exchange Gap in Higher Education
1. **Financial Barriers to Skill Acquisition**: Commercial tutoring services charge prohibitive hourly rates ($20–$80/hr), placing personalized 1-on-1 mentorship out of reach for average college students.
2. **Asymmetric Campus Expertise**: Skills on college campuses are isolated within departmental silos (e.g., Engineering, Business, Arts). Cross-department knowledge sharing rarely occurs organically.
3. **Inefficiency of Informal Channels**: Ad-hoc requests in campus forums, Discord servers, and WhatsApp groups suffer from low response rates, zero schedule coordination, flaky commitments, and no quality control.
4. **Lack of Trust and Accountability**: Without institutional verification and structured ratings, students risk meeting unprepared tutors, encountering no-shows, or dealing with inappropriate conduct.
5. **No Reciprocal Incentive**: In informal arrangements, high-demand tutors are quickly exhausted by repeated one-way requests with no tangible reward or credit that they can redeem for their own learning needs.

---

## 3. Proposed Solution

SkillSwap establishes a localized, cashless, time-banking micro-economy tailored specifically for college campuses:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        SkillSwap Campus Ecosystem                      │
│                                                                        │
│   ┌───────────────────┐                     ┌──────────────────────┐   │
│   │    Student A      │                     │      Student B       │   │
│   │ (Teaches: Java)   │◄──── Direct Swap ──►│ (Teaches: React)     │   │
│   │ (Wants: React)    │                     │ (Wants: Java)        │   │
│   └─────────┬─────────┘                     └──────────┬───────────┘   │
│             │                                          │               │
│      Earns 1 Credit                             Earns 1 Credit         │
│             │                                          │               │
│             ▼                                          ▼               │
│     ┌──────────────────────────────────────────────────────────┐       │
│     │               Skill Credit Escrow Ledger                 │       │
│     │   - Initial 3 Welcome Credits on Email Verification      │       │
│     │   - 1 Hour Tutoring Session = 1 Skill Credit             │       │
│     │   - Atomic Escrow Locking During Scheduled Sessions      │       │
│     │   - 6-Digit OTP Release Protocol on Session Completion   │       │
│     └──────────────────────────────────────────────────────────┘       │
│             ▲                                          ▲               │
│             │                                          │               │
│      Spends 1 Credit                            Spends 1 Credit        │
│             │                                          │               │
│   ┌─────────┴─────────┐                     ┌──────────┴───────────┐   │
│   │    Student C      │                     │      Student D       │   │
│   │ (Teaches: Python) │                     │ (Teaches: French)    │   │
│   │ (Wants: Java)     │                     │ (Wants: React)       │   │
│   └───────────────────┘                     └──────────────────────┘   │
│                        (Indirect Credit Swaps)                         │
└────────────────────────────────────────────────────────────────────────┘
```

### 3.1 Key Innovations
- **Dual Swap Paradigms**:
  1. *Direct Mutual Swaps*: Student A teaches Student B while Student B simultaneously or reciprocally teaches Student A.
  2. *Indirect Credit Swaps*: Student A teaches Student C for 1 credit, then uses that credit to learn from Student B. This breaks the strict "coincidence of wants" limitation inherent in traditional barter.
- **Intelligent Deterministic Matchmaking**: An explainable 100-point algorithm that analyzes mutual skills, proficiency levels, overlapping calendar slots, user reliability ratings, and learning modes.
- **Escrow-Protected Session Lifecycle**: Prevents double-spending and fraud by locking credits in escrow at the time of session confirmation and transferring them only after physical/virtual attendance is verified with a 6-digit mutual code.
- **Campus Walled Garden**: Mandatory institutional email verification (`.edu` / `.ac.in`) ensures that all participants belong to the same vetted campus community.

---

## 4. Project Objectives

### 4.1 Primary Objectives
1. **Democratize Tutoring**: Provide 100% free, credit-based peer instruction for all verified college students.
2. **Promote Cross-Disciplinary Learning**: Facilitate knowledge transfer across engineering, humanities, business, and arts faculties.
3. **Ensure Reliable Scheduling**: Provide calendar availability management, time-slot selection, and automated reminders to minimize missed sessions.
4. **Foster Trust & Safety**: Implement mutual rating systems, transparent profile histories, reporting mechanisms, and admin moderation.

### 4.2 Technical Objectives
1. Build a responsive, accessible, and intuitive Single Page Application (SPA) using **React, Vite, and Tailwind CSS**.
2. Develop a high-performance, robust, and secure RESTful backend using **Spring Boot 3, Spring Security, and Spring Data JPA**.
3. Implement an ACID-compliant relational data model using **MySQL 8.0** with row-level pessimistic locking for wallet transactions.
4. Deliver an explainable, deterministic matching algorithm with sub-200ms query response times.

---

## 5. Scope of the Project

### 5.1 In-Scope (MVP Phase)
- Student registration, login, and institutional email OTP verification.
- Profile management: bio, department, graduation year, avatar, social/portfolio links.
- Inventory of "Skills I Can Teach" (with proficiency and experience).
- Inventory of "Skills I Want to Learn" (with target proficiency and priority).
- Recurring weekly availability slot management.
- Discovery directory with multi-criteria search and filtering.
- Algorithmic matching engine with percentage score and factor breakdown.
- Swap proposal creation, counter-offering, acceptance, rejection, and cancellation.
- Session scheduling with Google Meet / campus venue selection.
- Escrow credit locking, 6-digit verification code settlement, and audit history.
- Post-session 5-star ratings, qualitative feedback, and peer endorsements.
- In-app notification feed and REST-based 1-on-1 direct messaging.
- Student reporting (No-Show, Inappropriate Conduct, Academic Dishonesty).
- Administrator dashboard: user moderation, dispute arbitration, platform audit logs, skill supply-demand analytics.

### 5.2 Out-of-Scope (Deferred to Future Phases)
- In-app WebRTC video calling and screen sharing (sessions use Google Meet or campus locations).
- Native mobile applications (iOS/Android) — platform is responsive web first.
- Multi-college federation (MVP is isolated to a single institutional tenant).
- Monetary payment gateways (platform strictly prohibits real currency exchanges).
- Automated AI code evaluation or test grading.

---

## 6. Target Users & Stakeholders

| User Group | Profile Description | Primary Needs on SkillSwap |
| :--- | :--- | :--- |
| **Undergraduate Learners** | 1st & 2nd year students needing guidance in foundational coursework, programming, or tools. | Find trusted, patient senior peers; book sessions around class timetables; learn without paying money. |
| **Advanced Peer Mentors** | 3rd & 4th year students or hobbyists with strong domain knowledge in specialized frameworks, design, or languages. | Share knowledge, earn Skill Credits to learn other topics (e.g., interview prep), build verified campus teaching credentials. |
| **Cross-Faculty Explorers** | Non-technical students desiring digital skills (coding, video editing) or STEM students desiring arts, music, or language skills. | Browse skills outside their department curricula with welcoming, beginner-friendly peers. |
| **College Administrator / Faculty Coordinator** | Department heads, student affairs moderators, or project evaluators. | Monitor campus academic collaboration, audit safety and dispute reports, analyze skill shortages and demands. |

---

## 7. Limitations of Existing Systems

| Platform / Method | Primary Limitations | SkillSwap Advantage |
| :--- | :--- | :--- |
| **Commercial Tutoring (Wyzant, Chegg, Preply)** | Expensive ($25–$80/hr); requires credit cards; instructors are strangers outside campus context. | 100% cashless peer credits; restricted to verified campus peers. |
| **Informal WhatsApp / Telegram Groups** | Unstructured; messages get buried; zero scheduling tools; high ghosting/no-show rate; no accountability. | Structured scheduling, calendar availability, escrow credit locks, and no-show penalties. |
| **Online MOOCs (Coursera, Udemy, YouTube)** | Passive one-way consumption; 90%+ drop-out rates; no personalized live feedback or interactive debugging. | Interactive 1-on-1 peer sessions with immediate answers to specific doubts. |
| **Campus Notice Boards & Club Desks** | Manual, slow reach; hard to match exact availability; restricted to specific physical locations. | Algorithmic matching instantly pairs compatible schedules and skill interests across campus. |

---

## 8. Expected Outcomes & Impact

1. **Equitable Learning**: Every student, regardless of financial background, gains access to personalized 1-on-1 mentorship.
2. **Strengthened Campus Community**: Bridges departmental divides, connecting engineering, business, design, and humanities students.
3. **Portfolio of Verified Experience**: Students accumulate peer reviews, validated teaching hours, and skill endorsements useful for resume building.
4. **Data-Driven Campus Insights**: Administrators gain visibility into high-demand skills, highlighting gaps where university curriculum updates or guest workshops may be needed.

---

## 9. Project Elevator Pitch

> *"SkillSwap is a cashless, peer-to-peer skill exchange platform designed exclusively for college campuses. It turns every student's existing expertise into currency: teach what you know, earn Skill Credits, and spend those credits to learn what you need from trusted classmates. With institutional email verification, smart algorithmic matching, and escrow-backed session verification, SkillSwap makes campus-wide collaborative learning reliable, safe, and completely free."*
