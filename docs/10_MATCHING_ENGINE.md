# SkillSwap — Intelligent Matching Engine Specification

```
==========================================================================
Document ID      : MATCH-SKILLSWAP-V1
Algorithm Type   : Deterministic Multi-Criteria Weighted Scoring (MCWS)
Score Range      : 0 to 100 Points (Normalized Percentage)
Explainability   : 100% Itemized Component Breakdown
Complexity       : O(N * (S + A)) where N = Candidates, S = Skills, A = Slots
==========================================================================
```

This document specifies the algorithmic logic, mathematical formulas, scoring weights, tie-breaking rules, and human-readable explanation generators powering SkillSwap's matching engine.

---

## 1. Matching Paradigms

SkillSwap supports two distinct matching models:

1. **Direct Mutual Swap (Barter)**:
   - Student A wants to learn Skill $X$ and teaches Skill $Y$.
   - Student B wants to learn Skill $Y$ and teaches Skill $X$.
   - Highest priority: Both students teach and learn directly from each other without requiring pre-accumulated credits.

2. **Indirect Credit-Backed Match**:
   - Student A wants to learn Skill $X$.
   - Student B teaches Skill $X$, but wants to learn Skill $Z$ (which Student A cannot teach).
   - Enabled through the Skill Credit System: Student A spends 1 credit to learn from Student B. Student B banks the credit to learn Skill $Z$ from Student C later.

---

## 2. 100-Point Scoring Formulation

The composite match score between Learner $L$ and Candidate Teacher $T$ is computed as:

$$\text{Total Score}(L, T) = S_{\text{mutual}} + S_{\text{proficiency}} + S_{\text{availability}} + S_{\text{reputation}} + S_{\text{proximity}}$$

```
┌────────────────────────────────────────────────────────────────────────┐
│                      SkillSwap Scoring Weight Matrix                   │
├───────────────────────────────────┬────────────┬───────────────────────┤
│ Evaluation Factor                 │ Max Points │ Weight Percentage     │
├───────────────────────────────────┼────────────┼───────────────────────┤
│ 1. Mutual Skill Compatibility     │ 40 Points  │ 40%                   │
│ 2. Skill Level Compatibility      │ 20 Points  │ 20%                   │
│ 3. Weekly Availability Overlap    │ 20 Points  │ 20%                   │
│ 4. Historical Peer Reputation     │ 10 Points  │ 10%                   │
│ 5. Learning Mode & Campus Proximity│ 10 Points │ 10%                   │
├───────────────────────────────────┼────────────┼───────────────────────┤
│ TOTAL MAXIMUM COMPATIBILITY       │ 100 Points │ 100%                  │
└───────────────────────────────────┴────────────┴───────────────────────┘
```

---

## 3. Mathematical Sub-Component Specifications

### 3.1 Factor 1: Mutual Skill Compatibility ($S_{\text{mutual}}$, Max: 40 pts)
Evaluates whether a complementary two-way exchange is possible:
- Let $Learn(L)$ be the set of skills Student $L$ wants to learn.
- Let $Teach(T)$ be the set of skills Candidate $T$ can teach.
- Let $Teach(L)$ be the set of skills Student $L$ can teach.
- Let $Learn(T)$ be the set of skills Candidate $T$ wants to learn.

$$\text{Forward Match} = |Learn(L) \cap Teach(T)| \ge 1$$
$$\text{Reverse Match} = |Teach(L) \cap Learn(T)| \ge 1$$

$$S_{\text{mutual}} = \begin{cases} 
40 & \text{if Forward Match is TRUE and Reverse Match is TRUE (Direct Mutual)} \\
20 & \text{if Forward Match is TRUE and Reverse Match is FALSE (Credit Match)} \\
0 & \text{otherwise}
\end{cases}$$

### 3.2 Factor 2: Skill Level Compatibility ($S_{\text{proficiency}}$, Max: 20 pts)
Matches the tutor's taught proficiency against the learner's desired target level:
- Proficiency Numeric Values:
  - `BEGINNER` = 1
  - `INTERMEDIATE` = 2
  - `ADVANCED` = 3
  - `EXPERT` = 4

Let $P_T$ be Teacher's proficiency and $P_L$ be Learner's target proficiency:

$$S_{\text{proficiency}} = \begin{cases} 
20 & \text{if } P_T > P_L \quad (\text{Teacher exceeds target level}) \\
18 & \text{if } P_T = P_L \quad (\text{Teacher perfectly meets target level}) \\
8 & \text{if } P_T = P_L - 1 \quad (\text{Teacher is 1 tier below, peer co-learner}) \\
0 & \text{if } P_T < P_L - 1 \quad (\text{Teacher qualification insufficient})
\end{cases}$$

### 3.3 Factor 3: Availability Overlap ($S_{\text{availability}}$, Max: 20 pts)
Quantifies calendar alignment across recurring weekly 1-hour slots:
- Let $O$ be the number of mutually overlapping 1-hour windows across the week (same day of week, same start/end hour range).

$$S_{\text{availability}} = \begin{cases}
20 & \text{if } O \ge 3 \text{ overlapping 1-hour slots} \\
15 & \text{if } O = 2 \text{ overlapping 1-hour slots} \\
10 & \text{if } O = 1 \text{ overlapping 1-hour slot} \\
0 & \text{if } O = 0 \text{ overlapping slots}
\end{cases}$$

### 3.4 Factor 4: Historical Peer Reputation ($S_{\text{reputation}}$, Max: 10 pts)
Rewards highly rated, reliable tutors who honor appointments:
- Let $R$ be the teacher's average rating (1.0 to 5.0).
- If teacher is new with 0 reviews ($N=0$), assign neutral score: 8.0 points (does not penalize new students).

$$S_{\text{reputation}} = \begin{cases} 
8.0 & \text{if } N = 0 \text{ (New tutor baseline)} \\
\min(10.0, \, R \times 2.0) & \text{if } N \ge 1
\end{cases}$$
*(Example: A 4.8-star tutor receives $4.8 \times 2.0 = 9.6$ points).*

### 3.5 Factor 5: Learning Mode & Proximity ($S_{\text{proximity}}$, Max: 10 pts)
Evaluates venue preference and departmental alignment:
- Mode Compatibility ($M$, Max: 6 pts):
  - Both prefer same mode (`IN_PERSON` or `ONLINE`): 6 pts
  - Either prefers `HYBRID`: 6 pts
  - One prefers `IN_PERSON`, other `ONLINE`: 2 pts
- Department Alignment ($D$, Max: 4 pts):
  - Same department (e.g., both CSE): 4 pts (shared course syllabus familiarity)
  - Different department: 2 pts (fosters cross-disciplinary exploration)

$$S_{\text{proximity}} = M + D$$

---

## 4. Minimum Cut-off Threshold & Ranking

1. **Relevance Gate**: Any candidate scoring below **30 points** is pruned from the recommendation list.
2. **Sorting**: Candidates are returned sorted in descending order of `Total Score`.
3. **Tie-Breaking Order**:
   1. Direct Mutual Match (`isDirectMutualSwap == true` wins over credit match).
   2. Higher `availabilityOverlap`.
   3. Higher `averageRating`.
   4. Seniority / Earlier registration date.

---

## 5. Structured Explanation Payload

Every match returns a complete breakdown explaining why the recommendation was made:

```json
{
  "studentId": 204,
  "fullName": "Ananya Patel",
  "matchScore": 89,
  "badge": "Top Mutual Match",
  "explanation": {
    "mutualSkill": {
      "points": 40,
      "maxPoints": 40,
      "summary": "Perfect mutual exchange! You teach Java; Ananya teaches React."
    },
    "proficiency": {
      "points": 18,
      "maxPoints": 20,
      "summary": "Ananya is Advanced in React, perfectly matching your target."
    },
    "availability": {
      "points": 15,
      "maxPoints": 20,
      "summary": "2 overlapping free windows found on Monday and Thursday afternoons."
    },
    "reputation": {
      "points": 10,
      "maxPoints": 10,
      "summary": "5.0 star rating based on 6 completed peer sessions."
    },
    "modeAndProximity": {
      "points": 6,
      "maxPoints": 10,
      "summary": "Both students prefer in-person campus study spaces."
    }
  }
}
```

---

## 6. Edge Cases & Boundary Handling

1. **Zero Availability Overlap**: If $O = 0$, student still receives credit/skill points, but availability score is 0. A warning tag is displayed: *"Schedules do not currently overlap — coordinate via chat."*
2. **New Student with Zero Teaching History**: Awarded a default 8.0 baseline reputation score, avoiding a "cold start" penalty that would lock out new students.
3. **Same Skill Taught and Wanted**: If Student A teaches Java and wants to learn Java, the engine validates that target level is higher than taught level.

---

## 7. Future Scope: AI Vector & Semantic Matching

In Phase 2, the deterministic engine will be augmented by generating vector embeddings (e.g., using Gemini text-embedding-004) for student bios, project descriptions, and custom skill tags. Cosine similarity will allow semantic matching for related concepts (e.g., pairing a student wanting "Spring Boot" with a tutor offering "Java Backend Frameworks").
