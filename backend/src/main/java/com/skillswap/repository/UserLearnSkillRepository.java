package com.skillswap.repository;

import com.skillswap.entity.UserLearnSkill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserLearnSkillRepository extends JpaRepository<UserLearnSkill, Long> {
    List<UserLearnSkill> findByUserId(Long userId);
    Optional<UserLearnSkill> findByUserIdAndSkillId(Long userId, Long skillId);
    boolean existsByUserIdAndSkillId(Long userId, Long skillId);
    long countByUserId(Long userId);
    void deleteByUserIdAndSkillId(Long userId, Long skillId);
}
