# SkillSwap — Skill Credit System & Escrow Ledger Specification

```
==========================================================================
Document ID      : CRED-SKILLSWAP-V1
Accounting Model : Double-Entry Relational Escrow Ledger
Currency Unit    : Skill Credit (1 Credit = 60 Minutes of Peer Instruction)
Concurrency Guard: Pessimistic Row-Level Database Locking (SELECT FOR UPDATE)
Integrity Rule   : Non-Circumventable Server-Side Balance Mutations
==========================================================================
```

This document details the financial mechanics, escrow locking protocols, concurrency protections, dispute rules, and transaction ledger powering SkillSwap's cashless campus economy.

---

## 1. Credit Economics & Conversion Rules

SkillSwap uses a closed-loop time-banking token economy:

| Parameter | Rule / Specification | Rationale |
| :--- | :--- | :--- |
| **Basic Unit of Exchange** | 1 Skill Credit = 1 Hour (60 minutes) | Direct parity between time invested and time earned. |
| **Welcome Grant** | **3 Credits** on college email verification | Solves the "cold-start" problem, enabling new students to learn immediately before teaching. |
| **Teaching Reward** | +1 Credit upon verified session completion | Fair remuneration for 1 hour of active peer tutoring. |
| **Learning Cost** | -1 Credit upon scheduled session booking | Deducted into escrow to ensure commitment. |
| **Direct Mutual Swap** | 0 Net Credit Change (Both earn 1 and spend 1) | Facilitates direct barter without exhausting wallet balance. |
| **Direct User Edits** | Strictly Prohibited (`balance` has no public setter) | Balance modifications only occur via `@Transactional` domain events. |

---

## 2. The Escrow Locking Mechanism

To prevent fraudulent double-spending (e.g., a student with 1 credit scheduling 5 simultaneous sessions across the week), SkillSwap employs an **Escrow Hold State**:

```
                  ┌──────────────────────────────────────────────┐
                  │           Learner Wallet (Balance: 3)        │
                  └──────────────────────┬───────────────────────┘
                                         │
                    Session Scheduled    │ [Hold 1 Credit]
                                         ▼
                  ┌──────────────────────────────────────────────┐
                  │    Available Balance: 2  |  Escrow Balance: 1 │
                  └──────────────┬───────────────────────────────┘
                                 │
                 ┌───────────────┴───────────────┐
                 │                               │
        Session Verified                 Session Cancelled
                 │                               │
                 ▼                               ▼
    ┌─────────────────────────┐     ┌─────────────────────────┐
    │  Learner Escrow: -1     │     │  Learner Escrow: -1     │
    │  Teacher Available: +1  │     │  Learner Available: +1  │
    └─────────────────────────┘     └─────────────────────────┘
        (Transfer to Teacher)              (Refund to Learner)
```

### 2.1 Concurrency & Double-Spending Prevention
When scheduling a session or completing an exchange, Spring Data JPA executes a pessimistic write lock:

```java
@Repository
public interface CreditWalletRepository extends JpaRepository<CreditWallet, Long> {
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT w FROM CreditWallet w WHERE w.userId = :userId")
    Optional<CreditWallet> findByUserIdWithLock(@Param("userId") Long userId);
}
```

```java
@Service
@Transactional(isolation = Isolation.READ_COMMITTED)
public void holdCreditInEscrow(Long learnerId, Long sessionId) {
    CreditWallet wallet = walletRepo.findByUserIdWithLock(learnerId)
        .orElseThrow(() -> new WalletNotFoundException(learnerId));

    if (wallet.getBalance() < 1) {
        throw new InsufficientCreditsException("Insufficient available credits.");
    }

    // Atomic mutation under row-level database lock
    wallet.setBalance(wallet.getBalance() - 1);
    wallet.setEscrowBalance(wallet.getEscrowBalance() + 1);
    walletRepo.save(wallet);

    // Record in ledger
    CreditTransaction txn = new CreditTransaction(
        wallet, sessionId, TransactionType.ESCROW_HOLD, -1, 
        wallet.getBalance(), "Credit placed in escrow for session #" + sessionId
    );
    txnRepo.save(txn);
}
```

---

## 3. Cancellation, No-Show & Refund Policies

| Event Scenario | Timing | Learner Impact | Teacher Impact | Admin Review |
| :--- | :--- | :--- | :--- | :--- |
| **Early Cancellation by Learner** | > 2 Hours before start | 100% Escrow Refund (+1 Available) | 0 Credits; slot freed | Automatic |
| **Early Cancellation by Teacher** | > 2 Hours before start | 100% Escrow Refund (+1 Available) | 0 Credits; reliability metric slight drop | Automatic |
| **Late Cancellation (< 2 Hours)** | < 2 Hours before start | 0.5 Credit Refund; 0.5 Credit to Teacher as late compensation | 0.5 Credit compensation | Automatic |
| **Teacher No-Show** | Post-start | 100% Escrow Refund (+1 Available) | Warning flag + 0 Credits | Requires Report |
| **Learner No-Show** | Post-start | 0 Refund (Escrow settled to Teacher) | +1 Credit for reserved time | Requires Report |
| **Technical / Mutual Cancel** | Mutual agreement | 100% Escrow Refund | 0 Credits | Handled in Chat/Admin |

---

## 4. Immutable Double-Entry Ledger Schema

Every credit movement is immutably recorded in `credit_transactions`. Ledger rows can **never be updated or deleted** (`UPDATE` and `DELETE` queries on this table are strictly blocked at database level via triggers/permissions).

### 4.1 Transaction Types
1. `SIGNUP_BONUS`: Initial 3 credits granted upon email OTP activation.
2. `ESCROW_HOLD`: Credit moved from available balance into escrow for an upcoming session.
3. `ESCROW_RELEASE`: Escrow credit returned to learner following an authorized cancellation.
4. `SESSION_EARNED`: Credit transferred to teacher upon successful 6-digit code verification.
5. `SESSION_SPENT`: Escrow credit permanently deducted from learner following session completion.
6. `REFUND`: Credit reinstated to learner following admin dispute arbitration.
7. `ADMIN_ADJUSTMENT`: Credit manually granted or deducted by an authorized administrator with mandatory justification log.

### 4.2 Mathematical Invariant Check
The platform guarantees that at any point in time:

$$\text{Current Available Balance} = \sum_{\text{all txns}} \text{Amount} - \text{Escrow Balance}$$

---

## 5. Duplicate Settlement & Attack Mitigations

1. **Replay Attacks on Verification OTP**:
   - The session verification code is validated inside a database transaction that transitions the session status to `COMPLETED`.
   - Any secondary API call to complete the same session fails with `HTTP 409 Conflict: Session has already been completed.`
2. **Race Condition Exploitation**:
   - Two concurrent API calls attempting to spend the same credit are serialized by InnoDB's row-level lock (`PESSIMISTIC_WRITE`). The second request finds `wallet.getBalance() == 0` and is safely rejected.
3. **Negative Balance Safeguard**:
   - MySQL database-level check constraints (`CHECK (balance >= 0)`) reject any query that would result in a negative credit balance.
