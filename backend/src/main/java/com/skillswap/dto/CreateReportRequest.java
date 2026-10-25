package com.skillswap.dto;

import com.skillswap.entity.ReportCategory;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CreateReportRequest {

    @NotNull(message = "Reported user ID is required")
    private Long reportedUserId;

    private Long relatedSessionId;

    @NotNull(message = "Category is required")
    private ReportCategory category;

    @NotBlank(message = "Description is required")
    private String description;

    public CreateReportRequest() {}

    public Long getReportedUserId() { return reportedUserId; }
    public void setReportedUserId(Long reportedUserId) { this.reportedUserId = reportedUserId; }

    public Long getRelatedSessionId() { return relatedSessionId; }
    public void setRelatedSessionId(Long relatedSessionId) { this.relatedSessionId = relatedSessionId; }

    public ReportCategory getCategory() { return category; }
    public void setCategory(ReportCategory category) { this.category = category; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
