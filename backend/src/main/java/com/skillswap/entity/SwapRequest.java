package com.skillswap.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "swap_requests", indexes = {
    @Index(name = "idx_swap_sender_status", columnList = "sender_id, status"),
    @Index(name = "idx_swap_receiver_status", columnList = "receiver_id, status")
})
public class SwapRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "receiver_id", nullable = false)
    private User receiver;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "offered_skill_id")
    private Skill offeredSkill;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "requested_skill_id", nullable = false)
    private Skill requestedSkill;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SwapStatus status = SwapStatus.PENDING;

    @Enumerated(EnumType.STRING)
    @Column(name = "proposed_mode", nullable = false)
    private LearningMode proposedMode = LearningMode.IN_PERSON;

    @Column(columnDefinition = "TEXT")
    private String message;

    @Column(name = "rejection_reason")
    private String rejectionReason;

    @Column(name = "expires_at", nullable = false)
    private Instant expiresAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt = Instant.now();

    public SwapRequest() {}

    public SwapRequest(User sender, User receiver, Skill offeredSkill, Skill requestedSkill, LearningMode proposedMode, String message) {
        this.sender = sender;
        this.receiver = receiver;
        this.offeredSkill = offeredSkill;
        this.requestedSkill = requestedSkill;
        this.proposedMode = proposedMode;
        this.message = message;
        this.expiresAt = Instant.now().plusSeconds(172800); // 48 hours
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = Instant.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getSender() { return sender; }
    public void setSender(User sender) { this.sender = sender; }

    public User getReceiver() { return receiver; }
    public void setReceiver(User receiver) { this.receiver = receiver; }

    public Skill getOfferedSkill() { return offeredSkill; }
    public void setOfferedSkill(Skill offeredSkill) { this.offeredSkill = offeredSkill; }

    public Skill getRequestedSkill() { return requestedSkill; }
    public void setRequestedSkill(Skill requestedSkill) { this.requestedSkill = requestedSkill; }

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

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
