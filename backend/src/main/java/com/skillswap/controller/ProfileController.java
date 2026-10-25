package com.skillswap.controller;

import com.skillswap.dto.*;
import com.skillswap.security.UserPrincipal;
import com.skillswap.service.ProfileService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/profiles")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<StudentProfileDto>> getMyProfile(@AuthenticationPrincipal UserPrincipal principal) {
        StudentProfileDto profile = profileService.getProfileByUserId(principal.getId());
        return ResponseEntity.ok(ApiResponse.success("Profile fetched successfully", profile));
    }

    @PutMapping("/me")
    public ResponseEntity<ApiResponse<StudentProfileDto>> updateMyProfile(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody UpdateProfileRequest request) {
        StudentProfileDto updated = profileService.updateProfile(principal.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", updated));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<ApiResponse<StudentProfileDto>> getStudentProfile(@PathVariable Long userId) {
        StudentProfileDto profile = profileService.getProfileByUserId(userId);
        return ResponseEntity.ok(ApiResponse.success("Profile fetched successfully", profile));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<StudentSummaryDto>>> searchStudents(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) Long categoryId,
            @PageableDefault(size = 12, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<StudentSummaryDto> results = profileService.searchStudents(query, categoryId, pageable);
        return ResponseEntity.ok(ApiResponse.success("Students retrieved", results));
    }

    @PostMapping("/me/skills/teach")
    public ResponseEntity<ApiResponse<Void>> addTeachSkill(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody AddTeachSkillRequest request) {
        profileService.addTeachSkill(principal.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Taught skill added successfully", null));
    }

    @DeleteMapping("/me/skills/teach/{skillId}")
    public ResponseEntity<ApiResponse<Void>> deleteTeachSkill(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long skillId) {
        profileService.deleteTeachSkill(principal.getId(), skillId);
        return ResponseEntity.ok(ApiResponse.success("Taught skill removed", null));
    }

    @PostMapping("/me/skills/learn")
    public ResponseEntity<ApiResponse<Void>> addLearnSkill(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody AddLearnSkillRequest request) {
        profileService.addLearnSkill(principal.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Learning goal added successfully", null));
    }

    @DeleteMapping("/me/skills/learn/{skillId}")
    public ResponseEntity<ApiResponse<Void>> deleteLearnSkill(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long skillId) {
        profileService.deleteLearnSkill(principal.getId(), skillId);
        return ResponseEntity.ok(ApiResponse.success("Learning goal removed", null));
    }

    @PutMapping("/me/availability")
    public ResponseEntity<ApiResponse<Void>> setAvailability(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody SetAvailabilityRequest request) {
        profileService.setAvailability(principal.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Weekly availability saved", null));
    }
}
