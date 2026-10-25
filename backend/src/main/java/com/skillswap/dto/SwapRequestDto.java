package com.skillswap.dto;

import com.skillswap.entity.LearningMode;
import com.skillswap.entity.SwapStatus;
import java.time.Instant;

public class SwapRequestDto {
    private Long id;
    private Long senderId;
    private String senderName;
    private String senderAvatarUrl;
    private Long receiverId;
    private String receiverName;
    private String receiverAvatarUrl;
    private Long offeredSkillId;
    private String offeredSkillName;
    private Long requestedSkillId;
    private String requestedSkillName;
    private SwapStatus status;
    private LearningMode proposedMode;
    private String message;
    private String rejectionReason;
    private Instant expiresAt;
    private Instant createdAt;

    public SwapRequestDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getSenderId() { return senderId; }
    public void setSenderId(Long senderId) { this.senderId = senderId; }
    public String getSenderName() { return senderName; }
    public void setSenderName(String senderName) { this.senderName = senderName; }
    public String getSenderAvatarUrl() { return senderAvatarUrl; }
    public void setSenderAvatarUrl(String senderAvatarUrl) { this.senderAvatarUrl = senderAvatarUrl; }
    public Long getReceiverId() { return receiverId; }
    public void setReceiverId(Long receiverId) { this.receiverId = receiverId; }
    public String getReceiverName() { return receiverName; }
    public void setReceiverName(String receiverName) { this.receiverName = receiverName; }
    public String getReceiverAvatarUrl() { return receiverAvatarUrl; }
    public void setReceiverAvatarUrl(String receiverAvatarUrl) { this.receiverAvatarUrl = receiverAvatarUrl; }
    public Long getOfferedSkillId() { return offeredSkillId; }
    public void setOfferedSkillId(Long offeredSkillId) { this.offeredSkillId = offeredSkillId; }
    public String getOfferedSkillName() { return offeredSkillName; }
    public void setOfferedSkillName(String offeredSkillName) { this.offeredSkillName = offeredSkillName; }
    public Long getRequestedSkillId() { return requestedSkillId; }
    public void setRequestedSkillId(Long requestedSkillId) { this.requestedSkillId = requestedSkillId; }
    public String getRequestedSkillName() { return requestedSkillName; }
    public void setRequestedSkillName(String requestedSkillName) { this.requestedSkillName = requestedSkillName; }
    public SwapStatus getStatus() { return status; }
    public void setStatus(SwapStatus status) { this.status = status; }
    public LearningMode getProposedMode() { return proposedMode; }
    public void setProposedMode(LearningMode proposedMode) { this.proposedMode = proposedMode; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public String getRejectionReason() { return rejectionReason; }
    public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }
    public Instant getExpiresAt() { return expiresAt; }
    public void setExpiresAt(Instant expiresAt) { this.expiresAt = expiresAt; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
