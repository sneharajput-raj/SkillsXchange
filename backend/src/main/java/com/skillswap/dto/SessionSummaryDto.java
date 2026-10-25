package com.skillswap.dto;

import com.skillswap.entity.LearningMode;
import com.skillswap.entity.SessionStatus;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.Instant;

public class SessionSummaryDto {
    private Long id;
    private Long swapRequestId;
    private Long learnerId;
    private String learnerName;
    private String learnerAvatarUrl;
    private Long teacherId;
    private String teacherName;
    private String teacherAvatarUrl;
    private Long skillId;
    private String skillName;
    private LocalDate scheduledDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private int durationMinutes;
    private LearningMode mode;
    private String venueOrLink;
    private SessionStatus status;
    private String cancellationReason;
    private String plainVerificationCode; // Populated ONLY if current user is learner
    private boolean reviewSubmittedByLearner;
    private boolean reviewSubmittedByTeacher;
    private Instant scheduledAt;
    private Instant completedAt;

    public SessionSummaryDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getSwapRequestId() { return swapRequestId; }
    public void setSwapRequestId(Long swapRequestId) { this.swapRequestId = swapRequestId; }
    public Long getLearnerId() { return learnerId; }
    public void setLearnerId(Long learnerId) { this.learnerId = learnerId; }
    public String getLearnerName() { return learnerName; }
    public void setLearnerName(String learnerName) { this.learnerName = learnerName; }
    public String getLearnerAvatarUrl() { return learnerAvatarUrl; }
    public void setLearnerAvatarUrl(String learnerAvatarUrl) { this.learnerAvatarUrl = learnerAvatarUrl; }
    public Long getTeacherId() { return teacherId; }
    public void setTeacherId(Long teacherId) { this.teacherId = teacherId; }
    public String getTeacherName() { return teacherName; }
    public void setTeacherName(String teacherName) { this.teacherName = teacherName; }
    public String getTeacherAvatarUrl() { return teacherAvatarUrl; }
    public void setTeacherAvatarUrl(String teacherAvatarUrl) { this.teacherAvatarUrl = teacherAvatarUrl; }
    public Long getSkillId() { return skillId; }
    public void setSkillId(Long skillId) { this.skillId = skillId; }
    public String getSkillName() { return skillName; }
    public void setSkillName(String skillName) { this.skillName = skillName; }
    public LocalDate getScheduledDate() { return scheduledDate; }
    public void setScheduledDate(LocalDate scheduledDate) { this.scheduledDate = scheduledDate; }
    public LocalTime getStartTime() { return startTime; }
    public void setStartTime(LocalTime startTime) { this.startTime = startTime; }
    public LocalTime getEndTime() { return endTime; }
    public void setEndTime(LocalTime endTime) { this.endTime = endTime; }
    public int getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(int durationMinutes) { this.durationMinutes = durationMinutes; }
    public LearningMode getMode() { return mode; }
    public void setMode(LearningMode mode) { this.mode = mode; }
    public String getVenueOrLink() { return venueOrLink; }
    public void setVenueOrLink(String venueOrLink) { this.venueOrLink = venueOrLink; }
    public SessionStatus getStatus() { return status; }
    public void setStatus(SessionStatus status) { this.status = status; }
    public String getCancellationReason() { return cancellationReason; }
    public void setCancellationReason(String cancellationReason) { this.cancellationReason = cancellationReason; }
    public String getPlainVerificationCode() { return plainVerificationCode; }
    public void setPlainVerificationCode(String plainVerificationCode) { this.plainVerificationCode = plainVerificationCode; }
    public boolean isReviewSubmittedByLearner() { return reviewSubmittedByLearner; }
    public void setReviewSubmittedByLearner(boolean reviewSubmittedByLearner) { this.reviewSubmittedByLearner = reviewSubmittedByLearner; }
    public boolean isReviewSubmittedByTeacher() { return reviewSubmittedByTeacher; }
    public void setReviewSubmittedByTeacher(boolean reviewSubmittedByTeacher) { this.reviewSubmittedByTeacher = reviewSubmittedByTeacher; }
    public Instant getScheduledAt() { return scheduledAt; }
    public void setScheduledAt(Instant scheduledAt) { this.scheduledAt = scheduledAt; }
    public Instant getCompletedAt() { return completedAt; }
    public void setCompletedAt(Instant completedAt) { this.completedAt = completedAt; }
}
