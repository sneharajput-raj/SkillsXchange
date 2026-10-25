# SkillSwap — UI/UX Design System & Wireframe Specifications

```
==========================================================================
Document ID      : UIUX-SKILLSWAP-V1
Design Paradigm  : Modern Campus SaaS / Clean Minimalist Interface
Styling Standard : Tailwind CSS v3.x Utility Framework
Iconography      : Lucide React Icon Library
Responsive Scope : Mobile (375px+), Tablet (768px+), Desktop (1280px+)
==========================================================================
```

This document specifies the visual design tokens, component library, layout wireframes, interactive behaviors, and empty/loading states for all 15 screens in SkillSwap.

---

## 1. Design Tokens & Visual Hierarchy

### 1.1 Color Palette
```
┌─────────────────┬───────────┬──────────────────────────────────────────┐
│ Token           │ Hex Code  │ Semantic Usage                           │
├─────────────────┼───────────┼──────────────────────────────────────────┤
│ primary-600     │ #4F46E5   │ Brand Indigo: Primary CTAs, active tabs   │
│ primary-700     │ #4338CA   │ Primary button hover state               │
│ primary-50      │ #EEF2FF   │ Active nav highlights, light badge bg     │
│ accent-500      │ #F59E0B   │ Amber: Match scores, credit badges, stars│
│ success-600     │ #10B981   │ Emerald: Verified badges, active status  │
│ danger-600      │ #EF4444   │ Rose: Cancel, dispute, error alerts      │
│ slate-900       │ #0F172A   │ Dark Charcoal: Headings, primary text    │
│ slate-600       │ #475569   │ Slate: Secondary body text, metadata     │
│ slate-100       │ #F1F5F9   │ Light Gray: Card backgrounds, borders    │
│ surface-white   │ #FFFFFF   │ Pure White: Page surface, modal containers│
└─────────────────┴───────────┴──────────────────────────────────────────┘
```

### 1.2 Typography & Spacing
- **Font Family**: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif.
- **Scale**:
  - Display Title: `text-3xl font-extrabold tracking-tight` (30px / 36px line-height)
  - Page Heading: `text-2xl font-bold` (24px / 32px line-height)
  - Card Title: `text-lg font-semibold` (18px / 24px line-height)
  - Body Text: `text-sm font-normal text-slate-600` (14px / 20px line-height)
  - Microcopy / Badges: `text-xs font-medium` (12px / 16px line-height)

---

## 2. Layout Structure & Global Navigation

All authenticated pages share a persistent, responsive shell:

```
┌────────────────────────────────────────────────────────────────────────┐
│ [SkillSwap Logo]    Discover   Matches   My Swaps   Sessions   Wallet   │
│                                           [Bell (3)] [Avatar - Rohan]  │
├──────────────┬─────────────────────────────────────────────────────────┤
│ SIDEBAR      │ MAIN CONTENT AREA                                       │
│ (Desktop)    │                                                         │
│              │ [Page Header + Action Buttons]                          │
│ • Dashboard  │                                                         │
│ • My Skills  │ ┌─────────────────────────────────────────────────────┐ │
│ • Schedule   │ │                                                     │ │
│ • Messages   │ │ Content Cards / Tables / Modals                     │ │
│ • Profile    │ │                                                     │ │
│ • Settings   │ └─────────────────────────────────────────────────────┘ │
└──────────────┴─────────────────────────────────────────────────────────┘
```

---

## 3. Specifications for All 15 Screens

### Screen 01: Public Landing Page (`/`)
- **Header**: Logo, "How it Works" link, "Login" button, "Get Started" CTA.
- **Hero Section**:
  - Headline: *"Learn what you need. Teach what you know. Cashless peer exchange."*
  - Subheadline: *"Join 250+ classmates exchanging skills in coding, design, languages, and academics using Skill Credits."*
  - Interactive Search Preview: Input box allowing visitors to type a skill (e.g. "React") to preview campus tutors.
- **Three-Pillar Feature Showcase**:
  1. *List Your Skills*: Share your expertise in 5 minutes.
  2. *Earn & Spend Credits*: 1 hour taught = 1 credit earned.
  3. *Campus Verified*: Trusted, safe environment using official college emails.
- **Testimonial Strip & Footer**.

### Screen 02: Login & Registration (`/login`, `/register`)
- **Card Layout**: Centered card with clean border and subtle shadow.
- **Registration Form**: Full Name, College Email (`@college.edu`), Password with real-time complexity checklist, Department dropdown, Graduation Year.
- **OTP Modal**: Appears immediately after registration with 6 digit-input boxes, countdown timer (15:00), and "Resend Code" link.
- **Login Form**: Email, Password, "Remember Me", "Sign In" button, link to registration.

### Screen 03: Onboarding Wizard (`/onboarding`)
- **4-Step Progress Indicator**:
  1. *Basic Profile*: Avatar selection, bio, preferred mode (In-person/Online).
  2. *What Can You Teach?*: Add at least 1 skill + proficiency level + brief experience.
  3. *What Do You Want to Learn?*: Add at least 1 learning goal + target level.
  4. *Your Free Hours*: Select at least one 1-hour recurring weekly availability block.
- **Completion CTA**: "Launch My Dashboard" button activating the account.

### Screen 04: Student Dashboard (`/dashboard`)
- **Top Metric Cards**:
  - *Available Credits*: Large number with "Earn More" prompt.
  - *Upcoming Sessions*: Countdown to next scheduled tutoring session.
  - *Pending Requests*: Count of incoming swap proposals awaiting response.
  - *Campus Rating*: Star score (e.g., 4.9) and total review count.
- **Quick Action Bar**: "Find a Tutor", "Manage My Skills", "Update Free Slots".
- **Two-Column Feed**:
  - Left: "Top Recommended Matches for You" (Cards with % match badges).
  - Right: "Active Session Schedule" & "Recent Wallet Movements".

### Screen 05: Student Discovery & Catalog (`/discover`)
- **Filter Toolbar**:
  - Search input (debounced 300ms).
  - Category pill tabs (All, Tech, Design, Languages, Academics).
  - Proficiency dropdown (Beginner, Intermediate, Advanced, Expert).
  - Availability Day dropdown (Monday .. Sunday).
  - Minimum Rating slider / chips (Any, 4.0+, 4.5+).
- **Student Card Grid**: 3-column responsive card layout featuring student avatar, name, department, top 3 teach skills with badges, rating, and "View Profile / Swap" button.

### Screen 06: Match Details & Score Explanation Modal (`/matches/:id`)
- **Compatibility Header**: Large circular gauge showing composite score (e.g., `88% Match`).
- **Explainability Meter Breakdown**:
  - *Mutual Skill Exchange*: Progress bar (40/40) + "Direct Barter Available".
  - *Proficiency Alignment*: Progress bar (18/20) + "Target match confirmed".
  - *Availability Window*: Progress bar (15/20) + "2 overlapping slots".
  - *Reputation Score*: Progress bar (9/10) + "4.8 rating across 10 reviews".
- **Primary CTA**: "Propose Skill Swap" button.

### Screen 07: My Skills Management (`/my-skills`)
- **Two-Tab Interface**:
  - Tab 1: *"Skills I Can Teach"* (Cards with edit proficiency, delete, and "Add New Skill" modal).
  - Tab 2: *"Skills I Want to Learn"* (Goal cards with target level, priority badge, and delete).

### Screen 08: Availability Scheduler (`/availability`)
- **Interactive Weekly Grid**: 7-day columns (Monday to Sunday) from 08:00 to 22:00.
- **Slot Creation**: Click-and-drag or click "+ Add Block" to declare recurring 1-hour free windows. Blocks render in soft primary indigo with a trash icon to remove.

### Screen 09: Swap Requests Hub (`/swaps`)
- **Segmented Control**:
  - *Incoming Requests* (Badged with unread count): Displays sender, offered skill vs. requested skill, proposed mode, message note, and dual "Accept" (primary) / "Decline" (outline) buttons.
  - *Outgoing Requests*: Displays sent proposals, timestamp, expiration countdown, and "Cancel Request" button.

### Screen 10: Sessions & Verification Hub (`/sessions`)
- **Upcoming Sessions Tab**:
  - Card with partner avatar, skill name, scheduled date & time, venue / Google Meet link.
  - **Learner View**: Big highlighted box: *"Your Session Completion Code: [ 8 4 9 2 0 1 ] - Share with mentor at conclusion."*
  - **Teacher View**: Button: *"Enter Learner's 6-Digit Code to Claim 1 Credit"*.
  - Secondary Action: "Cancel Session" (with policy alert modal).
- **Past Sessions Tab**: History cards with "Completed" status and "Leave Review" button.

### Screen 11: In-App Chat (`/messages`)
- **Left Sidebar**: List of active conversations with peer avatar, last message preview, timestamp, unread badge.
- **Main Chat Pane**:
  - Header: Peer name, associated skill exchange topic, meeting venue link.
  - Body: Scrollable message bubble stream (primary blue for sender, gray for receiver).
  - Footer: Input field (1,000 char limit), send button.

### Screen 12: Skill Credit Wallet & Ledger (`/wallet`)
- **Hero Balance Card**: Available Credits (large bold), In-Escrow Credits (locked badge), Lifetime Earned, Lifetime Spent.
- **Transaction History Table**:
  - Columns: Date & Time, Description, Type Badge (`SIGNUP_BONUS`, `SESSION_EARNED`, `ESCROW_HOLD`, `REFUND`), Amount (`+1` in emerald, `-1` in rose), Balance After.

### Screen 13: Notifications Center (`/notifications`)
- **List View**: Chronological notification items with icons (Swap, Calendar, Credit), title, descriptive text, timestamp, and "Mark all as read" button.

### Screen 14: Student Profile & Settings (`/profile`, `/settings`)
- **Public Profile View**: Clean hero card with avatar, department, bio, social links, full teaching inventory, and paginated student review list with star breakdown.
- **Account Settings**: Change password form, notification toggle preferences, logout CTA.

### Screen 15: Administrator Console (`/admin`)
- **KPI Summary Grid**: Total Verified Students, Total Sessions Completed, Credits in Circulation, Open Dispute Reports.
- **Dispute Resolution Table**: Open tickets with direct action buttons: "Refund Learner", "Pay Teacher", "Dismiss".
- **User Moderation Table**: Searchable table with status toggles (`Active` / `Suspended`).
- **Campus Skill Analytics Chart**: Visual horizontal bar chart comparing Demanded Skills vs. Offered Skills.

---

## 4. UI States & Edge-Case Handling

| State Type | Visual Treatment & User Guidance |
| :--- | :--- |
| **Empty State** | Clean vector illustration (Lucide icon), friendly headline (e.g., *"No Swap Requests Yet"*), explanatory subtext, and a clear action button (*"Discover Tutors"*). |
| **Loading State** | Skeleton shimmer placeholders (`animate-pulse`) mirroring exact card geometry. No jarring spinners that cause layout shifts. |
| **Form Error State** | Input border turns `border-rose-500`; inline error message appears below field in `text-xs text-rose-600`; submit button temporarily disabled. |
| **Zero Credit Warning** | Subtle amber banner on dashboard when `balance == 0`: *"You have 0 credits. Teach a skill to a peer or propose a Direct Mutual Swap to continue learning!"* |
