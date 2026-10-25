package com.skillswap.dto;

import com.skillswap.entity.LearningMode;
import jakarta.validation.constraints.NotNull;

public class CreateSwapProposalRequest {

    @NotNull(message = "Receiver ID is required")
    private Long receiverId;

    private Long offeredSkillId; // Optional for pure credit swap

    @NotNull(message = "Requested skill ID is required")
    private Long requestedSkillId;

    @NotNull(message = "Proposed mode is required")
    private LearningMode proposedMode = LearningMode.IN_PERSON;

    private String message;

    public CreateSwapProposalRequest() {}

    public Long getReceiverId() { return receiverId; }
    public void setReceiverId(Long receiverId) { this.receiverId = receiverId; }

    public Long getOfferedSkillId() { return offeredSkillId; }
    public void setOfferedSkillId(Long offeredSkillId) { this.offeredSkillId = offeredSkillId; }

    public Long getRequestedSkillId() { return requestedSkillId; }
    public void setRequestedSkillId(Long requestedSkillId) { this.requestedSkillId = requestedSkillId; }

    public LearningMode getProposedMode() { return proposedMode; }
    public void setProposedMode(LearningMode proposedMode) { this.proposedMode = proposedMode; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
