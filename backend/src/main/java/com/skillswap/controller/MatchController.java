package com.skillswap.controller;

import com.skillswap.dto.ApiResponse;
import com.skillswap.dto.MatchScoreDto;
import com.skillswap.security.UserPrincipal;
import com.skillswap.service.MatchingEngineService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/matches")
public class MatchController {

    private final MatchingEngineService matchingEngineService;

    public MatchController(MatchingEngineService matchingEngineService) {
        this.matchingEngineService = matchingEngineService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<MatchScoreDto>>> getMatches(@AuthenticationPrincipal UserPrincipal principal) {
        List<MatchScoreDto> matches = matchingEngineService.findMatchesForStudent(principal.getId());
        return ResponseEntity.ok(ApiResponse.success("Matching candidates computed successfully", matches));
    }

    @GetMapping("/with/{targetUserId}")
    public ResponseEntity<ApiResponse<MatchScoreDto>> getMatchWithTarget(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long targetUserId) {
        MatchScoreDto explanation = matchingEngineService.getMatchExplanation(principal.getId(), targetUserId);
        return ResponseEntity.ok(ApiResponse.success("Match breakdown computed", explanation));
    }
}
