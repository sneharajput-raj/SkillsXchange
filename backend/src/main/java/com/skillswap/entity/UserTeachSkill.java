package com.skillswap.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "user_teach_skills", uniqueConstraints = {
    @UniqueConstraint(name = "uk_user_teach_skill", columnNames = {"user_id", "skill_id"})
})
public class UserTeachSkill {

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
    @Column(name = "proficiency_level", nullable = false)
    private ProficiencyLevel proficiencyLevel;

    @Column(name = "experience_months", nullable = false)
    private int experienceMonths = 0;

    @Column(name = "proof_description", columnDefinition = "TEXT")
    private String proofDescription;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    public UserTeachSkill() {}

    public UserTeachSkill(User user, Skill skill, ProficiencyLevel proficiencyLevel, int experienceMonths) {
        this.user = user;
        this.skill = skill;
        this.proficiencyLevel = proficiencyLevel;
        this.experienceMonths = experienceMonths;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Skill getSkill() { return skill; }
    public void setSkill(Skill skill) { this.skill = skill; }

    public ProficiencyLevel getProficiencyLevel() { return proficiencyLevel; }
    public void setProficiencyLevel(ProficiencyLevel proficiencyLevel) { this.proficiencyLevel = proficiencyLevel; }

    public int getExperienceMonths() { return experienceMonths; }
    public void setExperienceMonths(int experienceMonths) { this.experienceMonths = experienceMonths; }

    public String getProofDescription() { return proofDescription; }
    public void setProofDescription(String proofDescription) { this.proofDescription = proofDescription; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
