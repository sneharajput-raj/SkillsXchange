package com.skillswap.dto;

import com.skillswap.entity.LearningMode;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalTime;

public class ScheduleSessionRequest {

    @NotNull(message = "Swap request ID is required")
    private Long swapRequestId;

    @NotNull(message = "Scheduled date is required")
    @FutureOrPresent(message = "Session date cannot be in the past")
    private LocalDate scheduledDate;

    @NotNull(message = "Start time is required")
    private LocalTime startTime;

    private LocalTime endTime; // defaults to startTime + 1 hour

    @NotNull(message = "Mode is required")
    private LearningMode mode = LearningMode.IN_PERSON;

    @NotBlank(message = "Venue or meeting link is required")
    private String venueOrLink;

    public ScheduleSessionRequest() {}

    public Long getSwapRequestId() { return swapRequestId; }
    public void setSwapRequestId(Long swapRequestId) { this.swapRequestId = swapRequestId; }

    public LocalDate getScheduledDate() { return scheduledDate; }
    public void setScheduledDate(LocalDate scheduledDate) { this.scheduledDate = scheduledDate; }

    public LocalTime getStartTime() { return startTime; }
    public void setStartTime(LocalTime startTime) { this.startTime = startTime; }

    public LocalTime getEndTime() { return endTime; }
    public void setEndTime(LocalTime endTime) { this.endTime = endTime; }

    public LearningMode getMode() { return mode; }
    public void setMode(LearningMode mode) { this.mode = mode; }

    public String getVenueOrLink() { return venueOrLink; }
    public void setVenueOrLink(String venueOrLink) { this.venueOrLink = venueOrLink; }
}
