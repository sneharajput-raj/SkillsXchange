package com.skillswap.service;

import com.skillswap.entity.Skill;
import com.skillswap.entity.SkillCategory;
import com.skillswap.repository.SkillCategoryRepository;
import com.skillswap.repository.SkillRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SkillCatalogService {

    private final SkillCategoryRepository categoryRepository;
    private final SkillRepository skillRepository;

    public SkillCatalogService(SkillCategoryRepository categoryRepository, SkillRepository skillRepository) {
        this.categoryRepository = categoryRepository;
        this.skillRepository = skillRepository;
    }

    @Transactional(readOnly = true)
    public List<SkillCategory> getAllCategories() {
        return categoryRepository.findByActiveTrue();
    }

    @Transactional(readOnly = true)
    public List<Skill> getAllApprovedSkills() {
        return skillRepository.findByApprovedTrue();
    }

    @Transactional(readOnly = true)
    public List<Skill> getSkillsByCategory(Long categoryId) {
        return skillRepository.findByCategoryIdAndApprovedTrue(categoryId);
    }

    @Transactional(readOnly = true)
    public List<Skill> searchSkills(String keyword) {
        if (keyword == null || keyword.isBlank()) {
            return skillRepository.findByApprovedTrue();
        }
        String lower = keyword.toLowerCase().trim();
        return skillRepository.findByApprovedTrue().stream()
                .filter(s -> s.getName().toLowerCase().contains(lower) ||
                        (s.getDescription() != null && s.getDescription().toLowerCase().contains(lower)))
                .collect(Collectors.toList());
    }
}
