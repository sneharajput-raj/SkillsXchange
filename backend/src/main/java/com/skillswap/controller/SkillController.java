package com.skillswap.controller;

import com.skillswap.dto.ApiResponse;
import com.skillswap.entity.Skill;
import com.skillswap.entity.SkillCategory;
import com.skillswap.service.SkillCatalogService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/skills")
public class SkillController {

    private final SkillCatalogService skillCatalogService;

    public SkillController(SkillCatalogService skillCatalogService) {
        this.skillCatalogService = skillCatalogService;
    }

    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<List<SkillCategory>>> getCategories() {
        List<SkillCategory> categories = skillCatalogService.getAllCategories();
        return ResponseEntity.ok(ApiResponse.success("Skill categories retrieved", categories));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Skill>>> getSkills(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String search) {
        List<Skill> skills;
        if (categoryId != null) {
            skills = skillCatalogService.getSkillsByCategory(categoryId);
        } else if (search != null && !search.isBlank()) {
            skills = skillCatalogService.searchSkills(search);
        } else {
            skills = skillCatalogService.getAllApprovedSkills();
        }
        return ResponseEntity.ok(ApiResponse.success("Skills retrieved", skills));
    }
}
