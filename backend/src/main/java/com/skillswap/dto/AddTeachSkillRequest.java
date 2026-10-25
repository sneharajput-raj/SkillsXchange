package com.skillswap.dto;

import com.skillswap.entity.ProficiencyLevel;
import jakarta.validation.constraints.NotNull;

public class AddTeachSkillRequest {
    @NotNull(message = "Skill ID is required")
    private Long skillId;

    @NotNull(message = "Proficiency level is required")
    private ProficiencyLevel proficiencyLevel;

    private int experienceMonths = 0;
    private String proofDescription;

    public AddTeachSkillRequest() {}

    public Long getSkillId() { return skillId; }
    public void setSkillId(Long skillId) { this.skillId = skillId; }

    public ProficiencyLevel getProficiencyLevel() { return proficiencyLevel; }
    public void setProficiencyLevel(ProficiencyLevel proficiencyLevel) { this.proficiencyLevel = proficiencyLevel; }

    public int getExperienceMonths() { return experienceMonths; }
    public void setExperienceMonths(int experienceMonths) { this.experienceMonths = experienceMonths; }

    public String getProofDescription() { return proofDescription; }
    public void setProofDescription(String proofDescription) { this.proofDescription = proofDescription; }
}
