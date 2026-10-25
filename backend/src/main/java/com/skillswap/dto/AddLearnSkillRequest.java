package com.skillswap.dto;

import com.skillswap.entity.Priority;
import com.skillswap.entity.ProficiencyLevel;
import jakarta.validation.constraints.NotNull;

public class AddLearnSkillRequest {
    @NotNull(message = "Skill ID is required")
    private Long skillId;

    @NotNull(message = "Target proficiency level is required")
    private ProficiencyLevel targetProficiencyLevel;

    private Priority priority = Priority.MEDIUM;
    private String learningGoalNotes;

    public AddLearnSkillRequest() {}

    public Long getSkillId() { return skillId; }
    public void setSkillId(Long skillId) { this.skillId = skillId; }

    public ProficiencyLevel getTargetProficiencyLevel() { return targetProficiencyLevel; }
    public void setTargetProficiencyLevel(ProficiencyLevel targetProficiencyLevel) { this.targetProficiencyLevel = targetProficiencyLevel; }

    public Priority getPriority() { return priority; }
    public void setPriority(Priority priority) { this.priority = priority; }

    public String getLearningGoalNotes() { return learningGoalNotes; }
    public void setLearningGoalNotes(String learningGoalNotes) { this.learningGoalNotes = learningGoalNotes; }
}
