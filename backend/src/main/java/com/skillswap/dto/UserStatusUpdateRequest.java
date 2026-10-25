package com.skillswap.dto;

import jakarta.validation.constraints.NotNull;

public class UserStatusUpdateRequest {

    @NotNull(message = "Active status is required")
    private Boolean active;

    private String reason;

    public UserStatusUpdateRequest() {}

    public UserStatusUpdateRequest(Boolean active, String reason) {
        this.active = active;
        this.reason = reason;
    }

    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
}
