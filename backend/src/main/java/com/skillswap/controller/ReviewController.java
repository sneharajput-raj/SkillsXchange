package com.skillswap.controller;

import com.skillswap.dto.ApiResponse;
import com.skillswap.dto.ReviewDto;
import com.skillswap.dto.SubmitReviewRequest;
import com.skillswap.security.UserPrincipal;
import com.skillswap.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @PostMapping("/sessions/{sessionId}/reviews")
    public ResponseEntity<ApiResponse<ReviewDto>> submitReview(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long sessionId,
            @Valid @RequestBody SubmitReviewRequest request) {
        ReviewDto review = reviewService.submitReview(principal.getId(), sessionId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Review and rating submitted successfully!", review));
    }

    @GetMapping("/users/{userId}/reviews")
    public ResponseEntity<ApiResponse<Page<ReviewDto>>> getUserReviews(
            @PathVariable Long userId,
            @PageableDefault(sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<ReviewDto> reviews = reviewService.getReviewsForUser(userId, pageable);
        return ResponseEntity.ok(ApiResponse.success("User reviews retrieved", reviews));
    }
}
