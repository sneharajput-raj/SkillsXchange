# SkillSwap — Comprehensive User Flows

```
==========================================================================
Document ID      : UFLOW-SKILLSWAP-V1
Scope            : Visual User Flows & System Interaction Diagrams
Standard         : Mermaid Diagramming & State Transition Specifications
==========================================================================
```

This document maps the sequential user journeys across the SkillSwap platform using Mermaid flowcharts and sequence diagrams.

---

## 1. Student Registration & College Email Verification Flow

```mermaid
flowchart TD
    Start([Student Visits Registration Page]) --> InputDetails[Enter Name, College Email, Password, Dept, Year]
    InputDetails --> ValidateFormat{Valid College Email & Password?}
    
    ValidateFormat -- No --> ShowFormatError[Display Validation Error] --> InputDetails
    ValidateFormat -- Yes --> CheckDB{Email Already Registered?}
    
    CheckDB -- Yes --> ShowConflict[Show 'Email Already Exists' Error] --> InputDetails
    CheckDB -- No --> HashPassword[Hash Password with BCrypt]
    
    HashPassword --> CreateUnverified[Insert User: is_verified = false]
    CreateUnverified --> GenerateOTP[Generate 6-Digit Numeric OTP - Exp 15 Mins]
    GenerateOTP --> SendEmail[Dispatch Email via Campus Mailer]
    
    SendEmail --> PromptOTP[Display OTP Verification Modal]
    PromptOTP --> SubmitOTP[Student Enters 6-Digit OTP]
    
    SubmitOTP --> VerifyCode{OTP Valid & Not Expired?}
    VerifyCode -- No --> IncrementAttempt{Attempts > 3?}
    IncrementAttempt -- Yes --> LockOTP[Invalidate OTP - Request Resend] --> PromptOTP
    IncrementAttempt -- No --> ShowOTPError[Display Invalid OTP] --> PromptOTP
    
    VerifyCode -- Yes --> ActivateUser[Update is_verified = true]
    ActivateUser --> CreateProfile[Initialize Student Profile Record]
    CreateProfile --> ProvisionWallet[Create Wallet with 3 Welcome Credits]
    ProvisionWallet --> LogTransaction[Log SIGNUP_BONUS in Credit Ledger]
    LogTransaction --> IssueJWT[Generate Access & Refresh JWT Tokens]
    IssueJWT --> RedirectOnboarding([Redirect to Onboarding Wizard])
```

---

## 2. Onboarding & Skill Profile Setup Flow

```mermaid
flowchart TD
    StartOnboarding([Enter Onboarding Wizard]) --> Step1[Step 1: Bio, Avatar, Learning Mode]
    Step1 --> Step2[Step 2: Add Skills I Can Teach]
    
    Step2 --> AddTeachSkill[Select Category, Skill, Proficiency & Experience]
    AddTeachSkill --> MoreTeach{Add More Taught Skills?}
    MoreTeach -- Yes --> Step2
    MoreTeach -- No --> Step3[Step 3: Add Skills I Want to Learn]
    
    Step3 --> AddLearnSkill[Select Skill, Target Level, Priority]
    AddLearnSkill --> MoreLearn{Add More Learning Goals?}
    MoreLearn -- Yes --> Step3
    MoreLearn -- No --> Step4[Step 4: Set Weekly Availability Schedule]
    
    Step4 --> AddSlots[Select Days & Free 1-Hour Time Blocks]
    AddSlots --> ValidateSlots{Minimum 1 Slot Added?}
    ValidateSlots -- No --> WarnSlot[Warning: Availability Required for Matches] --> AddSlots
    ValidateSlots -- Yes --> SaveOnboarding[Save Profile & Index for Search]
    SaveOnboarding --> Dashboard([Redirect to Student Dashboard])
```

---

## 3. Student Discovery & Matching Engine Flow

```mermaid
flowchart TD
    StudentDashboard([Student Views Discover / Matches]) --> EngineTrigger[System Runs Matching Engine for Student]
    
    subgraph Matching Engine Processing
        FetchLearner[Fetch Learner's Learning Skills & Free Slots] --> QueryTutors[Query Tutors Offering Those Skills]
        QueryTutors --> EvalMutual[Check Mutual Swap Compatibility: +40 pts]
        EvalMutual --> EvalProficiency[Check Proficiency Fit: +20 pts]
        EvalProficiency --> EvalTime[Calculate Overlapping Time Slots: +20 pts]
        EvalTime --> EvalRating[Compute Historical Rating Weight: +10 pts]
        EvalRating --> EvalDept[Check Dept & Mode Alignment: +10 pts]
        EvalDept --> SumScore[Calculate Total Score: 0 to 100]
    end
    
    SumScore --> FilterResults{Score >= 30?}
    FilterResults -- Yes --> DisplayCard[Render Match Card with Compatibility Breakdown]
    FilterResults -- No --> SuppressMatch[Omit from Recommendations]
    
    DisplayCard --> UserInspects[Student Clicks 'View Breakdown']
    UserInspects --> ShowExplanationModal[Display Detailed Explanation Modal]
    ShowExplanationModal --> ActionChoice{Student Action}
    ActionChoice -- Propose Swap --> SendSwapFlow([Initiate Swap Request Flow])
    ActionChoice -- Message First --> ChatFlow([Open Direct Chat])
```

---

## 4. Swap Request Negotiation Lifecycle

```mermaid
sequenceDiagram
    autonumber
    actor Learner as Student A (Learner)
    participant Platform as SkillSwap Platform
    actor Teacher as Student B (Teacher)

    Learner->>Platform: Submit Swap Request (Offered Skill/Credit, Requested Skill, Proposed Slot)
    Platform->>Platform: Validate Sender != Receiver & Available Credits >= 1
    Platform->>Platform: Create SwapRequest (Status: PENDING)
    Platform->>Teacher: Dispatch Notification ("New Swap Request from Student A")
    
    alt Teacher Accepts Request
        Teacher->>Platform: PUT /api/v1/swaps/{id}/accept
        Platform->>Platform: Update SwapRequest (Status: ACCEPTED)
        Platform->>Learner: Dispatch Notification ("Student B Accepted Your Swap!")
        Platform->>Platform: Transition to Session Scheduling
    else Teacher Rejects Request
        Teacher->>Platform: PUT /api/v1/swaps/{id}/reject (with optional reason)
        Platform->>Platform: Update SwapRequest (Status: REJECTED)
        Platform->>Learner: Dispatch Notification ("Swap Request Declined")
    else Learner Cancels Request
        Learner->>Platform: PUT /api/v1/swaps/{id}/cancel
        Platform->>Platform: Update SwapRequest (Status: CANCELLED)
        Platform->>Teacher: Invalidate Notification
    end
```

---

## 5. Session Scheduling & Escrow Hold Flow

```mermaid
flowchart TD
    AcceptedSwap([Swap Request Accepted]) --> OpenScheduler[Open Scheduling Modal]
    OpenScheduler --> SelectDate[Select Mutually Overlapping Date & Time Window]
    SelectDate --> SelectMode[Select Mode: In-Person Campus Library OR Online Google Meet]
    SelectMode --> ConfirmSchedule[Click 'Confirm Session Booking']
    
    ConfirmSchedule --> CheckLearnerWallet{Learner Available Credits >= 1?}
    CheckLearnerWallet -- No --> BlockSession[Error: Insufficient Credits. Teach a skill to earn credits!]
    CheckLearnerWallet -- Yes --> LockWallet[Acquire Pessimistic Lock on Learner Wallet]
    
    LockWallet --> DeductCredit[Deduct 1 from available balance]
    DeductCredit --> AddEscrow[Add 1 to escrow_balance]
    AddEscrow --> CreateSession[Insert Session: Status = SCHEDULED]
    CreateSession --> GenerateOTP[Generate 6-Digit Session Verification Code]
    GenerateOTP --> StoreCode[Store Code - Render ONLY in Learner Portal]
    StoreCode --> NotifyBoth[Send Calendar Notifications to Both Students]
    NotifyBoth --> SessionBooked([Session Confirmed & Active in Dashboard])
```

---

## 6. Session Completion, Verification & Credit Settlement Flow

```mermaid
sequenceDiagram
    autonumber
    actor Learner as Student A (Learner)
    actor Teacher as Student B (Teacher)
    participant Platform as SkillSwap Backend
    participant Ledger as Credit Ledger DB

    Note over Learner, Teacher: Both students meet (Campus Library or Google Meet)
    Note over Learner, Teacher: Tutoring session runs for 60 minutes
    
    Learner->>Learner: Opens SkillSwap App -> Views Active Session
    Learner->>Learner: Reads 6-Digit Verification Code (e.g. "849201")
    Learner->>Teacher: Verbally or via Chat communicates Code
    
    Teacher->>Platform: POST /api/v1/sessions/{id}/complete (code = "849201")
    Platform->>Platform: Validate Session is SCHEDULED
    Platform->>Platform: Validate Code == Session.verificationCode
    
    alt Code Valid
        Platform->>Ledger: Atomic Transaction:
        Ledger->>Ledger: 1. Update Session Status = COMPLETED
        Ledger->>Ledger: 2. Learner.escrow_balance -= 1
        Ledger->>Ledger: 3. Teacher.available_balance += 1
        Ledger->>Ledger: 4. Insert Transaction: SESSION_SPENT (Learner)
        Ledger->>Ledger: 5. Insert Transaction: SESSION_EARNED (Teacher)
        Ledger-->>Platform: Transaction Committed
        
        Platform->>Teacher: Return HTTP 200: "Session verified. 1 Credit added to your wallet!"
        Platform->>Learner: Push Notification: "Session completed successfully."
        Platform->>Learner: Prompt: "Submit Review for Student B"
        Platform->>Teacher: Prompt: "Submit Review for Student A"
    else Code Invalid
        Platform->>Teacher: Return HTTP 400: "Invalid verification code. Please check with your peer."
    end
```

---

## 7. Dual Post-Session Review & Rating Flow

```mermaid
flowchart TD
    CompletedSession([Session Status = COMPLETED]) --> TriggerReviewPrompt[Display 'Leave a Review' Banner on Dashboards]
    
    subgraph Review Submission Process
        StudentReviews[Student Opens Review Form] --> SelectStars[Select 1 to 5 Star Rating]
        SelectStars --> SelectTags[Select Endorsement Badges: Punctual, Patient, Expert, Clear]
        SelectTags --> WriteFeedback[Write Constructive Feedback: Max 1000 chars]
        WriteFeedback --> SubmitReview[Click 'Submit Review']
        
        SubmitReview --> CheckAuth{Is Student a Session Participant?}
        CheckAuth -- No --> DenyReview[HTTP 403 Forbidden]
        CheckAuth -- Yes --> CheckDuplicate{Has Student Already Reviewed This Session?}
        CheckDuplicate -- Yes --> RejectDuplicate[HTTP 409 Conflict: Review Already Submitted]
        CheckDuplicate -- No --> PersistReview[Insert into reviews Table]
    end
    
    PersistReview --> RecalculateStats[Recalculate Reviewee's Average Rating in Profile]
    RecalculateStats --> UpdateReputation[Update Campus Reputation Score & Badges]
    UpdateReputation --> FinishReview([Review Completed])
```

---

## 8. Cancellation & Dispute Resolution Flow

```mermaid
flowchart TD
    ActiveSession([Active Scheduled Session]) --> CancelInitiated{Who Initiates Cancellation?}
    
    CancelInitiated -- Cancelled > 2 Hours Prior --> AutoRefund[Automatic Full Refund]
    AutoRefund --> ReleaseEscrow[Decrement Learner Escrow, Increment Learner Available]
    ReleaseEscrow --> UpdateSessionCancelled[Session Status = CANCELLED]
    UpdateSessionCancelled --> NotifyCancelBoth[Notify Both Students of Cancellation]
    
    CancelInitiated -- Cancelled < 2 Hours Prior or No-Show --> FileDispute[File Dispute / Report Form]
    FileDispute --> EnterDetails[Select Category: NO_SHOW, Description, Proof]
    EnterDetails --> CreateReport[Insert Record into reports Table: Status = OPEN]
    CreateReport --> SetSessionDisputed[Session Status = DISPUTED]
    SetSessionDisputed --> EscalateAdmin([Admin Dispute Queue])
    
    subgraph Admin Resolution
        EscalateAdmin --> AdminReviews[Admin Reviews Chat History & Timestamps]
        AdminReviews --> Decision{Admin Finding}
        
        Decision -- Learner At Fault (No-Show) --> SettleTeacher[Transfer Escrow Credit to Teacher as Compensation]
        Decision -- Teacher At Fault (No-Show) --> RefundLearner[Refund Escrow Credit to Learner + Issue Warning to Teacher]
        Decision -- Mutual Technical Issue --> SplitNeutral[Full Refund to Learner with No Penalties]
        
        SettleTeacher --> LogAudit[Write to admin_audit_logs]
        RefundLearner --> LogAudit
        SplitNeutral --> LogAudit
        LogAudit --> CloseReport[Mark Report RESOLVED]
    end
```

---

## 9. Administrator Moderation Flow

```mermaid
flowchart TD
    AdminLogin([Admin Logs into Console]) --> DashboardView[View System Health: Active Users, Swaps, Disputes]
    
    DashboardView --> ActionMenu{Select Admin Task}
    
    ActionMenu -- Review Flagged Reports --> ReportQueue[View Open Dispute & Harassment Reports]
    ReportQueue --> InspectReport[Inspect Evidence, Session Logs, and Chat Logs]
    InspectReport --> ResolveReport[Select Resolution: Warn, Suspend User, or Dismiss]
    
    ActionMenu -- User Management --> SearchUser[Search Student by Email or Roll Number]
    SearchUser --> UserProfileInspect[Inspect Completed Swaps, Ratings, and Flag Count]
    UserProfileInspect --> ToggleStatus[Toggle Account Status: ACTIVE / SUSPENDED]
    
    ActionMenu -- Skill Supply/Demand --> AnalyticsView[View Top Demanded vs. Top Taught Skills]
    AnalyticsView --> ExportInsights[Export Deficit Skills for Academic Workshop Planning]
    
    ResolveReport --> WriteAudit[Record Operation in admin_audit_logs with Reason]
    ToggleStatus --> WriteAudit
    WriteAudit --> AdminDone([Action Committed])
```
