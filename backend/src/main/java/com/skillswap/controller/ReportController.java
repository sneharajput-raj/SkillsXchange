package com.skillswap.controller;

import com.skillswap.dto.ApiResponse;
import com.skillswap.dto.CreateReportRequest;
import com.skillswap.entity.Report;
import com.skillswap.security.UserPrincipal;
import com.skillswap.service.AdminService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/reports")
public class ReportController {

    private final AdminService adminService;

    public ReportController(AdminService adminService) {
        this.adminService = adminService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Report>> createReport(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody CreateReportRequest request) {
        Report report = adminService.createReport(principal.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Dispute or report submitted to SkillSwap administrators for review", report));
    }
}
