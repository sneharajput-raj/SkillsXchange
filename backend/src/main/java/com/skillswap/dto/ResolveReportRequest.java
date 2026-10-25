package com.skillswap.dto;

import jakarta.validation.constraints.NotBlank;

public class ResolveReportRequest {

    @NotBlank(message = "Resolution action is required (e.g. REFUND_LEARNER, PAY_TEACHER, DISMISS)")
    private String resolutionAction;

    private String adminNotes;

    public ResolveReportRequest() {}

    public String getResolutionAction() { return resolutionAction; }
    public void setResolutionAction(String resolutionAction) { this.resolutionAction = resolutionAction; }

    public String getAdminNotes() { return adminNotes; }
    public void setAdminNotes(String adminNotes) { this.adminNotes = adminNotes; }
}
