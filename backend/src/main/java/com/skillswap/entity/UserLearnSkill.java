package com.skillswap.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "user_learn_skills", uniqueConstraints = {
    @UniqueConstraint(name = "uk_user_learn_skill", columnNames = {"user_id", "skill_id"})
})
public class UserLearnSkill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "skill_id", nullable = false)
    private Skill skill;

    @Enumerated(EnumType.STRING)
    @Column(name = "target_proficiency_level", nullable = false)
    private ProficiencyLevel targetProficiencyLevel;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Priority priority = Priority.MEDIUM;

    @Column(name = "learning_goal_notes", columnDefinition = "TEXT")
    private String learningGoalNotes;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    public UserLearnSkill() {}

    public UserLearnSkill(User user, Skill skill, ProficiencyLevel targetProficiencyLevel, Priority priority) {
        this.user = user;
        this.skill = skill;
        this.targetProficiencyLevel = targetProficiencyLevel;
        this.priority = priority;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Skill getSkill() { return skill; }
    public void setSkill(Skill skill) { this.skill = skill; }

    public ProficiencyLevel getTargetProficiencyLevel() { return targetProficiencyLevel; }
    public void setTargetProficiencyLevel(ProficiencyLevel targetProficiencyLevel) { this.targetProficiencyLevel = targetProficiencyLevel; }

    public Priority getPriority() { return priority; }
    public void setPriority(Priority priority) { this.priority = priority; }

    public String getLearningGoalNotes() { return learningGoalNotes; }
    public void setLearningGoalNotes(String learningGoalNotes) { this.learningGoalNotes = learningGoalNotes; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
