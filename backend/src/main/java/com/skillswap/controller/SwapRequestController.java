package com.skillswap.controller;

import com.skillswap.dto.ApiResponse;
import com.skillswap.dto.CreateSwapProposalRequest;
import com.skillswap.dto.SwapRequestDto;
import com.skillswap.security.UserPrincipal;
import com.skillswap.service.SwapService;
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
@RequestMapping("/api/v1/swaps")
public class SwapRequestController {

    private final SwapService swapService;

    public SwapRequestController(SwapService swapService) {
        this.swapService = swapService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<SwapRequestDto>> createSwap(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody CreateSwapProposalRequest request) {
        SwapRequestDto proposal = swapService.createSwapProposal(principal.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Swap proposal sent successfully", proposal));
    }

    @GetMapping("/incoming")
    public ResponseEntity<ApiResponse<Page<SwapRequestDto>>> getIncomingSwaps(
            @AuthenticationPrincipal UserPrincipal principal,
            @PageableDefault(sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<SwapRequestDto> incoming = swapService.getIncomingSwaps(principal.getId(), pageable);
        return ResponseEntity.ok(ApiResponse.success("Incoming swap requests retrieved", incoming));
    }

    @GetMapping("/outgoing")
    public ResponseEntity<ApiResponse<Page<SwapRequestDto>>> getOutgoingSwaps(
            @AuthenticationPrincipal UserPrincipal principal,
            @PageableDefault(sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<SwapRequestDto> outgoing = swapService.getOutgoingSwaps(principal.getId(), pageable);
        return ResponseEntity.ok(ApiResponse.success("Outgoing swap requests retrieved", outgoing));
    }

    @PostMapping("/{swapId}/accept")
    public ResponseEntity<ApiResponse<SwapRequestDto>> acceptSwap(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long swapId) {
        SwapRequestDto accepted = swapService.acceptSwap(swapId, principal.getId());
        return ResponseEntity.ok(ApiResponse.success("Swap proposal accepted! You can now book sessions.", accepted));
    }

    @PostMapping("/{swapId}/reject")
    public ResponseEntity<ApiResponse<SwapRequestDto>> rejectSwap(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long swapId,
            @RequestBody(required = false) Map<String, String> body) {
        String reason = (body != null) ? body.get("reason") : null;
        SwapRequestDto rejected = swapService.rejectSwap(swapId, principal.getId(), reason);
        return ResponseEntity.ok(ApiResponse.success("Swap proposal declined", rejected));
    }

    @PostMapping("/{swapId}/cancel")
    public ResponseEntity<ApiResponse<SwapRequestDto>> cancelSwap(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long swapId) {
        SwapRequestDto cancelled = swapService.cancelSwap(swapId, principal.getId());
        return ResponseEntity.ok(ApiResponse.success("Swap proposal cancelled", cancelled));
    }
}
