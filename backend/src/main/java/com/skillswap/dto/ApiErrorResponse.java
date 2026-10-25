package com.skillswap.dto;

import java.time.Instant;
import java.util.List;

public class ApiErrorResponse {
    private boolean success = false;
    private String errorCode;
    private String message;
    private List<String> errors;
    private Instant timestamp = Instant.now();

    public ApiErrorResponse() {}

    public ApiErrorResponse(boolean success, String errorCode, String message, List<String> errors) {
        this.success = success;
        this.errorCode = errorCode;
        this.message = message;
        this.errors = errors;
        this.timestamp = Instant.now();
    }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public String getErrorCode() { return errorCode; }
    public void setErrorCode(String errorCode) { this.errorCode = errorCode; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public List<String> getErrors() { return errors; }
    public void setErrors(List<String> errors) { this.errors = errors; }

    public Instant getTimestamp() { return timestamp; }
    public void setTimestamp(Instant timestamp) { this.timestamp = timestamp; }
}
