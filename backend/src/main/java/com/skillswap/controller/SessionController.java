package com.skillswap.controller;

import com.skillswap.dto.ApiResponse;
import com.skillswap.dto.CompleteSessionRequest;
import com.skillswap.dto.ScheduleSessionRequest;
import com.skillswap.dto.SessionSummaryDto;
import com.skillswap.security.UserPrincipal;
import com.skillswap.service.SessionLifecycleService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/sessions")
public class SessionController {

    private final SessionLifecycleService sessionLifecycleService;

    public SessionController(SessionLifecycleService sessionLifecycleService) {
        this.sessionLifecycleService = sessionLifecycleService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<SessionSummaryDto>> scheduleSession(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody ScheduleSessionRequest request) {
        SessionSummaryDto session = sessionLifecycleService.scheduleSession(principal.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Session scheduled successfully and 1 credit placed in escrow", session));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<SessionSummaryDto>>> getMySessions(
            @AuthenticationPrincipal UserPrincipal principal,
            @PageableDefault(sort = "scheduledDate", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<SessionSummaryDto> sessions = sessionLifecycleService.getUserSessions(principal.getId(), pageable);
        return ResponseEntity.ok(ApiResponse.success("User sessions retrieved", sessions));
    }

    @PostMapping("/{sessionId}/complete")
    public ResponseEntity<ApiResponse<SessionSummaryDto>> completeSession(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long sessionId,
            @Valid @RequestBody CompleteSessionRequest request) {
        SessionSummaryDto session = sessionLifecycleService.completeSession(sessionId, request.getVerificationCode(), principal.getId());
        return ResponseEntity.ok(ApiResponse.success("Session verified and completed! 1 Skill Credit transferred to your wallet.", session));
    }

    @PostMapping("/{sessionId}/cancel")
    public ResponseEntity<ApiResponse<SessionSummaryDto>> cancelSession(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long sessionId,
            @RequestBody(required = false) Map<String, String> body) {
        String reason = (body != null && body.containsKey("reason")) ? body.get("reason") : "Cancelled by user";
        SessionSummaryDto session = sessionLifecycleService.cancelSession(sessionId, principal.getId(), reason);
        return ResponseEntity.ok(ApiResponse.success("Session cancelled and credit refunded to learner", session));
    }
}
