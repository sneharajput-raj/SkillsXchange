package com.skillswap.exception;

import com.skillswap.dto.ApiErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.ArrayList;
import java.util.List;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorResponse> handleValidationErrors(MethodArgumentNotValidException ex) {
        List<String> errors = new ArrayList<>();
        for (FieldError err : ex.getBindingResult().getFieldErrors()) {
            errors.add(err.getField() + ": " + err.getDefaultMessage());
        }
        ApiErrorResponse res = new ApiErrorResponse(false, "VALIDATION_FAILED", "Invalid request content", errors);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(res);
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiErrorResponse> handleNotFound(ResourceNotFoundException ex) {
        ApiErrorResponse res = new ApiErrorResponse(false, "RESOURCE_NOT_FOUND", ex.getMessage(), null);
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(res);
    }

    @ExceptionHandler(InsufficientCreditsException.class)
    public ResponseEntity<ApiErrorResponse> handleInsufficientCredits(InsufficientCreditsException ex) {
        ApiErrorResponse res = new ApiErrorResponse(false, "INSUFFICIENT_CREDITS", ex.getMessage(), null);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(res);
    }

    @ExceptionHandler(InvalidVerificationCodeException.class)
    public ResponseEntity<ApiErrorResponse> handleInvalidVerificationCode(InvalidVerificationCodeException ex) {
        ApiErrorResponse res = new ApiErrorResponse(false, "INVALID_VERIFICATION_CODE", ex.getMessage(), null);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(res);
    }

    @ExceptionHandler(InvalidSwapStateException.class)
    public ResponseEntity<ApiErrorResponse> handleInvalidSwapState(InvalidSwapStateException ex) {
        ApiErrorResponse res = new ApiErrorResponse(false, "INVALID_STATE", ex.getMessage(), null);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(res);
    }

    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<ApiErrorResponse> handleDuplicate(DuplicateResourceException ex) {
        ApiErrorResponse res = new ApiErrorResponse(false, "DUPLICATE_RESOURCE", ex.getMessage(), null);
        return ResponseEntity.status(HttpStatus.CONFLICT).body(res);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiErrorResponse> handleBadCredentials(BadCredentialsException ex) {
        ApiErrorResponse res = new ApiErrorResponse(false, "INVALID_CREDENTIALS", "Incorrect email or password", null);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(res);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiErrorResponse> handleAccessDenied(AccessDeniedException ex) {
        ApiErrorResponse res = new ApiErrorResponse(false, "FORBIDDEN", "You do not have permission to access this resource", null);
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(res);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiErrorResponse> handleIllegalArgument(IllegalArgumentException ex) {
        ApiErrorResponse res = new ApiErrorResponse(false, "BAD_REQUEST", ex.getMessage(), null);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(res);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorResponse> handleGeneric(Exception ex) {
        ApiErrorResponse res = new ApiErrorResponse(false, "INTERNAL_SERVER_ERROR", ex.getMessage() != null ? ex.getMessage() : "An unexpected server error occurred", null);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(res);
    }
}
