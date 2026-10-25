# SkillSwap — Future Scope & Enhancement Vision

```
==========================================================================
Document ID      : FUTURE-SKILLSWAP-V1
Planning Horizon : Post-MVP / Major Project / Commercial Evolution
Scope Level      : Architectural Feasibility & Technical Roadmapping
==========================================================================
```

This document outlines the architectural enhancements, advanced algorithmic modules, and platform scaling initiatives planned for the post-MVP evolution of SkillSwap.

---

## 1. Advanced Technological Roadmap

```
┌────────────────────────────────────────────────────────────────────────┐
│                   SkillSwap Post-MVP Evolution Roadmap                 │
├──────────────────┬─────────────────────────────────────────────────────┤
│ Horizon 1        │ • In-App WebRTC Peer Video & Collaborative Canvas   │
│ (Next Semester)  │ • Bidirectional Google Calendar & Outlook Sync      │
│                  │ • AI Semantic Skill Matching via Vector Embeddings  │
├──────────────────┼─────────────────────────────────────────────────────┤
│ Horizon 2        │ • Cross-Campus Federated Multi-Tenancy              │
│ (Major Project)  │ • Native Mobile Application (React Native / Expo)   │
│                  │ • Group Workshops & Multi-Student Micro-Classes    │
├──────────────────┼─────────────────────────────────────────────────────┤
│ Horizon 3        │ • Automated Skill Verification via GitHub Analysis  │
│ (Long-Term)      │ • Decentralized Verifiable Credentials (W3C DID)   │
└──────────────────┴─────────────────────────────────────────────────────┘
```

---

## 2. In-App WebRTC Video Calling & Interactive Whiteboard

### 2.1 Limitation in Current MVP
The MVP requires students to either meet physically on campus (e.g., library) or manually share a third-party Google Meet/Zoom link. This introduces friction and prevents the platform from monitoring session attendance natively.

### 2.2 Future Architectural Solution
Implement peer-to-peer browser communication using **WebRTC**:
- **Signaling Server**: Spring Boot WebSocket server with STOMP protocol exchanging SDP offers, answers, and ICE candidates.
- **STUN/TURN Servers**: Free Coturn or Twilio Network Traversal servers to navigate campus symmetric NATs and firewalls.
- **Integrated Canvas**: HTML5 Canvas with Socket.io/WebSocket for real-time collaborative code syntax highlighting and whiteboard sketching.
- **Automated Attendance**: In-session heartbeat pings eliminate the need for manual 6-digit OTP verification; session completes automatically after 50 minutes of connected call time.

---

## 3. AI-Powered Semantic Matching (Vector Embeddings)

### 3.1 Limitation in Current MVP
The deterministic matching engine relies on exact keyword matching and relational category hierarchies. A student offering "Spring Boot RESTful Services" will not automatically match with a student wanting "Java Backend Development" unless identical tags are selected.

### 3.2 Semantic Embedding Pipeline
1. **Embedding Generation**: As students update their bios and project descriptions, the system calls Google Gemini (`text-embedding-004`) to generate a 768-dimensional dense vector embedding.
2. **Vector Storage**: Utilize MySQL 8.0/8.4 Vector indexing or a dedicated vector database (e.g., Pgvector, Milvus, or Pinecone).
3. **Cosine Similarity**: Compute semantic cosine similarity between Learner Desires Vector $\vec{v}_L$ and Teacher Strengths Vector $\vec{v}_T$:

$$\text{Similarity} = \frac{\vec{v}_L \cdot \vec{v}_T}{\|\vec{v}_L\| \|\vec{v}_T\|}$$

This captures nuanced synonyms, related frameworks, and contextual learning needs seamlessly.

---

## 4. Multi-Campus Federated Architecture

### 4.1 Evolution from Single-College to Multi-Tenant
To scale SkillSwap across regional university clusters:
- **Tenant Isolation**: Add `tenant_id` (University ID) partitioning with row-level security.
- **Inter-Campus Exchanges**: Enable cross-campus swaps for rare skills (e.g., specialized foreign languages, advanced robotics) where a single campus lacks tutors.
- **Institutional Single Sign-On (SSO)**: SAML 2.0 and OpenID Connect (OIDC) integration with institutional identity providers (Google Workspace for Education, Microsoft Azure Active Directory).

---

## 5. Calendar Integration & Mobile Ecosystem

1. **Automated Two-Way Calendar Sync**:
   - Google Calendar API & Microsoft Graph API integration.
   - Automatically books the approved session directly onto both students' personal campus calendars with reminder notifications.
2. **Cross-Platform Mobile Application**:
   - Single shared codebase using **React Native** and Expo, reusing 70% of business logic, DTO types, and API hooks from the React web client.
   - Native push notifications (Apple APNS / Google FCM) for instant swap request alerts.

---

## 6. Automated Skill Verification & Campus Credentials

1. **GitHub Repository Code Analysis**:
   - Connect GitHub OAuth to analyze public repositories, automatically detecting languages, commit frequencies, and project complexity to award verified "Proficiency Badges" (e.g., *Verified React Developer*).
2. **Verifiable Digital Credentials**:
   - Issue verifiable completion certificates for students who complete 20+ hours of peer instruction, exportable to LinkedIn and resumes.
