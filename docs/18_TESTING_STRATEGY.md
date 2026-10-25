# SkillSwap — Comprehensive Testing Strategy & Test Suites

```
==========================================================================
Document ID      : TEST-SKILLSWAP-V1
Testing Scope    : Unit, Integration, API Contract, Concurrency & Security
Testing Framework: JUnit 5, Mockito, SpringBootTest, MockMvc, Postman
Target Coverage  : >= 85% Service & Domain Logic Code Coverage
==========================================================================
```

This document specifies the testing methodology, test automation frameworks, security test cases, and domain verification suites for SkillSwap.

---

## 1. Testing Pyramid Overview

```mermaid
flowchart TD
    E2E[End-to-End & Manual API Tests: Postman & Cypress / 10%]
    Integration[Integration & Controller Tests: @SpringBootTest & MockMvc / 30%]
    Unit[Unit Tests: JUnit 5 & Mockito (Services, Matching Engine, Wallet) / 60%]

    Unit --> Integration
    Integration --> E2E
```

---

## 2. Core Business Test Suites

### 2.1 Matching Engine Test Cases (`MatchingEngineServiceTest`)

| Test ID | Scenario Description | Inputs | Expected Output | Assertion Rule |
| :--- | :--- | :--- | :--- | :--- |
| `TC-MATCH-001` | Perfect Mutual Match | Student A: Teaches Java, wants React; Student B: Teaches React, wants Java. Schedules overlap 3 slots. | Score: `95 - 100` | `isDirectMutualSwap == true`, `score >= 90` |
| `TC-MATCH-002` | One-Way Credit Match | Student A: Wants React; Student B: Teaches React, wants Spanish (A cannot teach). | Score: `60 - 75` | `isDirectMutualSwap == false`, `mutualSkillScore == 20` |
| `TC-MATCH-003` | Zero Availability Overlap | Mutually compatible skills, but zero overlapping free hours in weekly schedule. | Score: `45 - 55` | `availabilityOverlapScore == 0`, warning flag present |
| `TC-MATCH-004` | Irrelevant Skills | Student A: Wants Piano; Student B: Teaches Rust, wants Cooking. | Score < 30 | Omitted from recommendations list (below cutoff) |
| `TC-MATCH-005` | Tutor Qualification Below Target | Learner seeks Expert Python; Tutor offers Beginner Python. | Proficiency Score: 0 | `proficiencyScore == 0` |

### 2.2 Skill Credit & Escrow Concurrency Suite (`CreditWalletServiceTest`)

| Test ID | Scenario Description | Action | Invariant / Expected State |
| :--- | :--- | :--- | :--- |
| `TC-CRED-001` | Signup Welcome Grant | Student verifies email OTP. | Wallet created with `balance = 3`, `escrow = 0`. Transaction logged as `SIGNUP_BONUS`. |
| `TC-CRED-002` | Escrow Lock on Booking | Learner (balance = 3) books 1-hr session. | `balance = 2`, `escrow = 1`. Transaction logged as `ESCROW_HOLD`. |
| `TC-CRED-003` | Double-Spending Concurrency Race | Learner with 1 available credit launches 2 simultaneous booking API calls in parallel threads. | Thread 1 succeeds (`HTTP 201`); Thread 2 fails with `HTTP 402 InsufficientCreditsException`. Balance never goes negative. |
| `TC-CRED-004` | Verified Settlement | Teacher submits valid 6-digit OTP for completed session. | Learner `escrow` drops by 1; Teacher `balance` increases by 1. Two audit records inserted. |
| `TC-CRED-005` | Authorized Cancellation Refund | Learner cancels session 4 hours prior to scheduled start. | Learner `escrow` drops by 1; Learner `balance` restored by 1. Full refund logged. |

### 2.3 Session Lifecycle & OTP Verification Suite (`SessionLifecycleTest`)

| Test ID | Scenario Description | Input Verification Code | Expected State |
| :--- | :--- | :--- | :--- |
| `TC-SESS-001` | Successful Completion | Correct 6-digit OTP entered by Teacher during session. | Session status `COMPLETED`, `completed_at` set, credits transferred. |
| `TC-SESS-002` | Fraudulent Code Submission | Incorrect OTP entered by Teacher. | `HTTP 400 Bad Request`, `attempt_count = 1`, session remains `SCHEDULED`. |
| `TC-SESS-003` | Brute Force Lockout | 3 consecutive incorrect OTPs entered. | Session auto-transitions to `DISPUTED`, escrow remains locked, admin alerted. |
| `TC-SESS-004` | Duplicate Completion Attempt | Calling complete endpoint on an already `COMPLETED` session. | `HTTP 409 Conflict: Session already completed`. No secondary credit transferred. |

---

## 3. Security & Access Control Test Cases

| Test ID | Target Endpoint | Context / Role | Expected HTTP Status |
| :--- | :--- | :--- | :--- |
| `TC-SEC-001` | `GET /api/v1/wallet/me` | Unauthenticated (No Bearer Token) | `401 UNAUTHORIZED` |
| `TC-SEC-002` | `GET /api/v1/admin/analytics` | Authenticated as `ROLE_STUDENT` | `403 FORBIDDEN` |
| `TC-SEC-003` | `POST /api/v1/swaps` | Sender ID equals Receiver ID (Self-Swap) | `400 BAD_REQUEST` |
| `TC-SEC-004` | `POST /api/v1/auth/register` | Email domain `@gmail.com` | `400 BAD_REQUEST` (Domain whitelist failure) |
| `TC-SEC-005` | `POST /api/v1/sessions/{id}/reviews` | Submitting review before session is `COMPLETED` | `400 BAD_REQUEST` |

---

## 4. Sample Integration Test Implementation

```java
@SpringBootTest
@AutoConfigureMockMvc
class SessionConcurrencyIntegrationTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private CreditWalletRepository walletRepo;

    @Test
    @DisplayName("Should prevent double-spending when 2 booking calls execute simultaneously")
    void testConcurrentSessionBookingDoubleSpending() throws InterruptedException {
        Long studentId = 101L; // Has exactly 1 credit
        int numThreads = 2;
        ExecutorService executor = Executors.newFixedThreadPool(numThreads);
        CountDownLatch latch = new CountDownLatch(1);
        AtomicInteger successCount = new AtomicInteger(0);
        AtomicInteger failureCount = new AtomicInteger(0);

        for (int i = 0; i < numThreads; i++) {
            executor.submit(() -> {
                try {
                    latch.await();
                    ResultActions result = mockMvc.perform(post("/api/v1/sessions")
                        .header("Authorization", "Bearer valid_jwt_token")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"swapRequestId\": 42, \"scheduledDate\": \"2026-09-25\", \"startTime\": \"16:00\", \"venueOrLink\": \"Library\"}"));
                    
                    int status = result.andReturn().getResponse().getStatus();
                    if (status == 201) successCount.incrementAndGet();
                    else if (status == 402) failureCount.incrementAndGet();
                } catch (Exception ignored) {}
            });
        }

        latch.countDown();
        executor.shutdown();
        executor.awaitTermination(5, TimeUnit.SECONDS);

        assertEquals(1, successCount.get(), "Exactly one booking should succeed");
        assertEquals(1, failureCount.get(), "Second booking must fail with insufficient credits");
        
        CreditWallet wallet = walletRepo.findByUserId(studentId).get();
        assertEquals(0, wallet.getBalance(), "Available balance must be zero");
        assertEquals(1, wallet.getEscrowBalance(), "Escrow balance must be one");
    }
}
```
