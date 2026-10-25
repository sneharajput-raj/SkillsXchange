# SkillSwap — REST API Specification

```
==========================================================================
Document ID      : API-SKILLSWAP-V1
Base URL         : /api/v1
Protocol         : HTTPS / RESTful JSON
Authentication   : Bearer JWT (Authorization Header)
Standard Format  : RFC 7807 Problem Details / ApiResponse Envelope
==========================================================================
```

This document specifies the REST API contract for SkillSwap, including request/response payloads, status codes, validations, and security scopes.

---

## 1. Global Standards & Envelope Formats

### 1.1 Standard Success Envelope (`ApiResponse<T>`)
```json
{
  "success": true,
  "data": {},
  "message": "Operation completed successfully",
  "timestamp": "2026-09-18T18:45:00Z"
}
```

### 1.2 Standard Error Envelope (`ApiErrorResponse`)
```json
{
  "success": false,
  "errorCode": "INSUFFICIENT_CREDITS",
  "message": "You do not have enough available credits to schedule this session.",
  "errors": [
    {
      "field": "credits",
      "rejectedValue": 0,
      "message": "Available balance must be at least 1 credit"
    }
  ],
  "timestamp": "2026-09-18T18:45:00Z"
}
```

---

## 2. Authentication Endpoints (`/api/v1/auth`)

### 2.1 Student Registration
- **URL**: `POST /api/v1/auth/register`
- **Auth**: Public (No token required)
- **Request Body**:
  ```json
  {
    "fullName": "Rohan Sharma",
    "email": "rohan.sharma@college.edu",
    "password": "Password@123",
    "departmentId": 1,
    "graduationYear": 2026
  }
  ```
- **Validation**: Email must match institutional domain regex; password min 8 characters with upper, lower, number, special char.
- **Success Response** (`201 Created`):
  ```json
  {
    "success": true,
    "message": "Verification code dispatched to your college email.",
    "data": { "userId": 101, "email": "rohan.sharma@college.edu" }
  }
  ```
- **Error Codes**: `400 BAD_REQUEST` (validation failure), `409 CONFLICT` (email already exists).

### 2.2 Verify Email OTP
- **URL**: `POST /api/v1/auth/verify-email`
- **Auth**: Public
- **Request Body**:
  ```json
  {
    "email": "rohan.sharma@college.edu",
    "otpCode": "492018"
  }
  ```
- **Success Response** (`200 OK`):
  ```json
  {
    "success": true,
    "message": "Email verified successfully. 3 welcome credits granted!",
    "data": { "verified": true }
  }
  ```
- **Error Codes**: `400 BAD_REQUEST` (invalid code), `410 GONE` (code expired).

### 2.3 Student Login
- **URL**: `POST /api/v1/auth/login`
- **Auth**: Public
- **Request Body**:
  ```json
  {
    "email": "rohan.sharma@college.edu",
    "password": "Password@123"
  }
  ```
- **Success Response** (`200 OK`):
  ```json
  {
    "success": true,
    "data": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "dGhpcy1pcy1hLXJlZnJlc2gtdG9rZW4...",
      "tokenType": "Bearer",
      "expiresInSeconds": 900,
      "user": {
        "id": 101,
        "fullName": "Rohan Sharma",
        "email": "rohan.sharma@college.edu",
        "role": "ROLE_STUDENT",
        "avatarUrl": "https://avatars.example.com/avatar1.png"
      }
    }
  }
  ```
- **Error Codes**: `401 UNAUTHORIZED` (bad credentials or unverified account), `403 FORBIDDEN` (suspended account).

### 2.4 Refresh Access Token
- **URL**: `POST /api/v1/auth/refresh-token`
- **Auth**: Public (Valid Refresh Token in body or cookie)
- **Request Body**: `{ "refreshToken": "dGhpcy1pcy1h..." }`
- **Success Response** (`200 OK`): Returns new `accessToken` and updated `expiresInSeconds`.

---

## 3. Profile & Skill Endpoints (`/api/v1/profiles`, `/api/v1/skills`)

### 3.1 Get Current Student Profile
- **URL**: `GET /api/v1/profiles/me`
- **Auth**: Bearer (`ROLE_STUDENT`)
- **Success Response** (`200 OK`):
  ```json
  {
    "success": true,
    "data": {
      "id": 101,
      "fullName": "Rohan Sharma",
      "department": { "id": 1, "code": "CSE", "name": "Computer Science & Engineering" },
      "graduationYear": 2026,
      "bio": "3rd-year CS major passionate about Spring Boot and system design.",
      "avatarUrl": "https://avatars.example.com/avatar1.png",
      "portfolioUrl": "https://github.com/rohansharma",
      "preferredLearningMode": "HYBRID",
      "averageRating": 4.85,
      "totalReviewsCount": 12,
      "totalSessionsCompleted": 14,
      "teachSkills": [
        { "id": 1, "skillName": "Java", "proficiency": "ADVANCED", "experienceMonths": 24 }
      ],
      "learnSkills": [
        { "id": 5, "skillName": "React", "targetProficiency": "INTERMEDIATE", "priority": "HIGH" }
      ]
    }
  }
  ```

### 3.2 Update Student Profile
- **URL**: `PUT /api/v1/profiles/me`
- **Auth**: Bearer (`ROLE_STUDENT`)
- **Request Body**:
  ```json
  {
    "bio": "Updated bio text...",
    "avatarUrl": "https://avatars.example.com/new.png",
    "portfolioUrl": "https://linkedin.com/in/rohan",
    "preferredLearningMode": "IN_PERSON"
  }
  ```

### 3.3 Add Skill to Teach
- **URL**: `POST /api/v1/profiles/me/teach-skills`
- **Auth**: Bearer (`ROLE_STUDENT`)
- **Request Body**:
  ```json
  {
    "skillId": 12,
    "proficiencyLevel": "ADVANCED",
    "experienceMonths": 18,
    "proofDescription": "Built 2 full-stack capstones in Spring Boot."
  }
  ```
- **Error Codes**: `400 BAD_REQUEST` (limit > 10 reached), `409 CONFLICT` (skill already in teaching list).

### 3.4 Add Skill to Learn
- **URL**: `POST /api/v1/profiles/me/learn-skills`
- **Auth**: Bearer (`ROLE_STUDENT`)
- **Request Body**:
  ```json
  {
    "skillId": 8,
    "targetProficiencyLevel": "INTERMEDIATE",
    "priority": "HIGH",
    "learningGoalNotes": "Preparing for summer frontend internship."
  }
  ```

### 3.5 Set Weekly Availability
- **URL**: `PUT /api/v1/profiles/me/availability`
- **Auth**: Bearer (`ROLE_STUDENT`)
- **Request Body**:
  ```json
  {
    "slots": [
      { "dayOfWeek": "MONDAY", "startTime": "16:00", "endTime": "18:00" },
      { "dayOfWeek": "WEDNESDAY", "startTime": "14:00", "endTime": "17:00" }
    ]
  }
  ```

---

## 4. Discovery & Matching Endpoints (`/api/v1/students`, `/api/v1/matches`)

### 4.1 Search Student Directory
- **URL**: `GET /api/v1/students?query=react&categoryId=1&minRating=4.0&page=0&size=10`
- **Auth**: Bearer (`ROLE_STUDENT`)
- **Success Response** (`200 OK`): Paginated list of student summary cards (name, department, avatar, taught skills, rating).

### 4.2 Get Recommended Matches
- **URL**: `GET /api/v1/matches`
- **Auth**: Bearer (`ROLE_STUDENT`)
- **Success Response** (`200 OK`):
  ```json
  {
    "success": true,
    "data": [
      {
        "studentId": 204,
        "fullName": "Ananya Patel",
        "avatarUrl": "https://avatars.example.com/avatar2.png",
        "department": "Design & Arts",
        "matchScore": 88,
        "isDirectMutualSwap": true,
        "teachSkills": ["React", "UI/UX Design"],
        "wantsToLearn": ["Java"],
        "averageRating": 4.9
      }
    ]
  }
  ```

### 4.3 Get Match Score Explanation
- **URL**: `GET /api/v1/matches/{targetStudentId}/explanation`
- **Auth**: Bearer (`ROLE_STUDENT`)
- **Success Response** (`200 OK`):
  ```json
  {
    "success": true,
    "data": {
      "targetStudentId": 204,
      "totalScore": 88,
      "breakdown": {
        "mutualSkillMatch": { "score": 40, "max": 40, "explanation": "Mutual match: You teach Java, they teach React" },
        "proficiencyCompatibility": { "score": 18, "max": 20, "explanation": "Target proficiency matches tutor level" },
        "availabilityOverlap": { "score": 15, "max": 20, "explanation": "2 overlapping 1-hour slots on Monday" },
        "ratingScore": { "score": 9, "max": 10, "explanation": "4.9 average peer rating" },
        "proximityScore": { "score": 6, "max": 10, "explanation": "Both prefer In-Person library sessions" }
      }
    }
  }
  ```

---

## 5. Swap Requests Endpoints (`/api/v1/swaps`)

### 5.1 Initiate Swap Proposal
- **URL**: `POST /api/v1/swaps`
- **Auth**: Bearer (`ROLE_STUDENT`)
- **Request Body**:
  ```json
  {
    "receiverId": 204,
    "offeredSkillId": 1,
    "requestedSkillId": 5,
    "proposedMode": "IN_PERSON",
    "message": "Hi Ananya! I can help you with Java DSA if you can mentor me on React components."
  }
  ```
- **Success Response** (`201 Created`): Returns created `swapRequestId`, status `PENDING`.
- **Error Codes**: `400 BAD_REQUEST` (self-swap attempt), `402 PAYMENT_REQUIRED` (insufficient credit balance for credit swap), `409 CONFLICT` (active swap already pending).

### 5.2 Accept Swap Request
- **URL**: `PUT /api/v1/swaps/{id}/accept`
- **Auth**: Bearer (Receiver only)
- **Success Response** (`200 OK`): Returns status `ACCEPTED`.

### 5.3 Reject Swap Request
- **URL**: `PUT /api/v1/swaps/{id}/reject`
- **Auth**: Bearer (Receiver only)
- **Request Body**: `{ "reason": "Busy with mid-term exams this week." }`

### 5.4 Cancel Swap Request
- **URL**: `PUT /api/v1/swaps/{id}/cancel`
- **Auth**: Bearer (Sender only)

---

## 6. Sessions & Verification Endpoints (`/api/v1/sessions`)

### 6.1 Schedule Session & Lock Escrow
- **URL**: `POST /api/v1/sessions`
- **Auth**: Bearer (`ROLE_STUDENT`)
- **Request Body**:
  ```json
  {
    "swapRequestId": 42,
    "scheduledDate": "2026-09-22",
    "startTime": "16:00",
    "endTime": "17:00",
    "mode": "IN_PERSON",
    "venueOrLink": "Central Campus Library - Discussion Pod 4"
  }
  ```
- **Success Response** (`201 Created`):
  ```json
  {
    "success": true,
    "data": {
      "sessionId": 88,
      "status": "SCHEDULED",
      "learnerId": 101,
      "teacherId": 204,
      "verificationCode": "849201"
    }
  }
  ```
  *(Note: `verificationCode` is only returned in the response if the requester is the `learnerId`)*.

### 6.2 Complete Session (Verify 6-Digit Code)
- **URL**: `POST /api/v1/sessions/{id}/complete`
- **Auth**: Bearer (Teacher only)
- **Request Body**:
  ```json
  {
    "verificationCode": "849201"
  }
  ```
- **Success Response** (`200 OK`):
  ```json
  {
    "success": true,
    "message": "Session completed! 1 Skill Credit transferred to your wallet.",
    "data": {
      "sessionId": 88,
      "status": "COMPLETED",
      "creditTransferred": 1,
      "newTeacherBalance": 4
    }
  }
  ```
- **Error Codes**: `400 BAD_REQUEST` (invalid verification code), `409 CONFLICT` (session already completed or cancelled).

### 6.3 Cancel Scheduled Session
- **URL**: `POST /api/v1/sessions/{id}/cancel`
- **Auth**: Bearer (Learner or Teacher)
- **Request Body**: `{ "reason": "Emergency lab class scheduled." }`

---

## 7. Wallet & Transactions Endpoints (`/api/v1/wallet`)

### 7.1 Get Wallet Balance
- **URL**: `GET /api/v1/wallet/me`
- **Auth**: Bearer (`ROLE_STUDENT`)
- **Success Response** (`200 OK`):
  ```json
  {
    "success": true,
    "data": {
      "availableBalance": 3,
      "escrowBalance": 1,
      "totalCredits": 4,
      "lifetimeEarned": 5,
      "lifetimeSpent": 2
    }
  }
  ```

### 7.2 Get Transaction History
- **URL**: `GET /api/v1/wallet/transactions?page=0&size=10`
- **Auth**: Bearer (`ROLE_STUDENT`)
- **Success Response** (`200 OK`): Paginated list of ledger entries with type, amount, balance after, reference session, and timestamp.

---

## 8. Reviews, Chat & Notifications Endpoints

### 8.1 Submit Session Review
- **URL**: `POST /api/v1/sessions/{sessionId}/reviews`
- **Auth**: Bearer (Participant in completed session)
- **Request Body**:
  ```json
  {
    "rating": 5,
    "feedback": "Rohan was an exceptional tutor! Helped me fix complex recursion bugs in 45 minutes.",
    "endorsementTags": ["Patient", "Clear Explanations", "Punctual"]
  }
  ```
- **Success Response** (`201 Created`).

### 8.2 Get Notifications
- **URL**: `GET /api/v1/notifications?unreadOnly=false`
- **Auth**: Bearer (`ROLE_STUDENT`)

### 8.3 Send Direct Message
- **URL**: `POST /api/v1/conversations/{conversationId}/messages`
- **Auth**: Bearer (Conversation participant)
- **Request Body**: `{ "content": "Hey! I am sitting at the 2nd floor library table." }`

---

## 9. Administrator Endpoints (`/api/v1/admin`)

### 9.1 Get Platform Analytics
- **URL**: `GET /api/v1/admin/analytics`
- **Auth**: Bearer (`ROLE_ADMIN`)
- **Success Response** (`200 OK`): Top demanded skills, top taught skills, completion ratios, active user counts.

### 9.2 Moderate User
- **URL**: `PUT /api/v1/admin/users/{userId}/status`
- **Auth**: Bearer (`ROLE_ADMIN`)
- **Request Body**: `{ "isActive": false, "reason": "Violated campus anti-harassment policy" }`

### 9.3 Arbitrate Dispute
- **URL**: `POST /api/v1/admin/reports/{reportId}/resolve`
- **Auth**: Bearer (`ROLE_ADMIN`)
- **Request Body**:
  ```json
  {
    "resolutionAction": "REFUND_LEARNER",
    "adminNotes": "Teacher confirmed no-show via chat logs."
  }
  ```
