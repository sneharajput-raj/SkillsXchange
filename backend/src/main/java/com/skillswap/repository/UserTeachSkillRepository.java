package com.skillswap.repository;

import com.skillswap.entity.UserTeachSkill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserTeachSkillRepository extends JpaRepository<UserTeachSkill, Long> {
    List<UserTeachSkill> findByUserId(Long userId);
    Optional<UserTeachSkill> findByUserIdAndSkillId(Long userId, Long skillId);
    boolean existsByUserIdAndSkillId(Long userId, Long skillId);
    long countByUserId(Long userId);
    void deleteByUserIdAndSkillId(Long userId, Long skillId);
}
